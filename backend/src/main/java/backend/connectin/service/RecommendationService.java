package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RecommendationService {
    private final JobPostRepository jobPostRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JobViewRepository jobViewRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final JobRecommendationRepository jobRecommendationRepository;

    public RecommendationService(JobPostRepository jobPostRepository, UserRepository userRepository, UserService userService, JobViewRepository jobViewRepository, PersonalInfoRepository personalInfoRepository, JobRecommendationRepository jobRecommendationRepository) {
        this.jobPostRepository = jobPostRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.jobViewRepository = jobViewRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.jobRecommendationRepository = jobRecommendationRepository;
    }

    public List<JobPost> findRecommendJobsForUser(long userId) {
        List<JobRecommendation> jobPosts = jobRecommendationRepository.findByUserId(userId);
        List<Long> jobIds = jobPosts.stream().map(JobRecommendation::getJobId).toList();
        List<JobPost> recommendedJobs = new ArrayList<>();
        jobIds.stream().map(jobId -> jobPostRepository.findById(jobId).orElse(null)).filter(Objects::nonNull).forEach(recommendedJobs::add);
        return recommendedJobs;
    }

    public void recommendJobs() {
        List<User> users = userService.fetchAll();
        List<JobPost> jobPosts = jobPostRepository.findAll();

        System.out.println("Fetched users: " + users.size());
        System.out.println("Fetched job posts: " + jobPosts.size());

        if (users.isEmpty() || jobPosts.isEmpty()) {
            System.out.println("No users or job posts available for recommendation.");
            return;
        }

        double[][] matrix = new double[users.size()][jobPosts.size()];
        int userIndex = 0;

        for (var user : users) {
            if (user.getId() == 1) { // Skip the admin user
                continue;
            }

            List<JobView> jobViews = jobViewRepository.findByUserId(user.getId());
            PersonalInfo personalInfo = personalInfoRepository.findByUserId(user.getId());
            List<Skill> skills = new ArrayList<>();

            if (personalInfo != null) {
                skills = personalInfo.getSkills();
            } else {
                System.out.println("No personal info found for user ID: " + user.getId());
                continue;
            }

            System.out.println("Processing user ID: " + user.getId() + " with skills: " + skills.size() + " skills");

            int jobPostIndex = 0;
            for (var job : jobPosts) {
                int skillMatchScore = calculateSkillMatch(skills, job);
                if (jobViews.stream().anyMatch(view -> view.getJobId() == job.getId())) {
                    skillMatchScore += 10;
                }
                matrix[userIndex][jobPostIndex] = skillMatchScore > 0 ? skillMatchScore : -1;
                System.out.println("User ID: " + user.getId() + ", Job ID: " + job.getId() + ", Skill Match Score: " + skillMatchScore);
                jobPostIndex++;
            }
            userIndex++;
        }

        System.out.println("Matrix for factorization: ");
        for (double[] row : matrix) {
            System.out.println(Arrays.toString(row));
        }

        double[][] results = matrixFactorization(matrix, 2, 0.0002, 0.0);
        System.out.println("Results from matrix factorization: ");
        for (double[] row : results) {
            System.out.println(Arrays.toString(row));
        }

        userIndex = 0;
        for (var user : users) {
            if (user.getId() == 1) { // Skip the admin user
                continue;
            }

            List<JobPost> recommendedJobs = new ArrayList<>();
            List<Pair> pairs = new ArrayList<>();
            int jobPostIndex = 0;

            // Ensure results and matrix dimensions match
            if (userIndex >= results.length) {
                System.out.println("Warning: userIndex out of bounds for results array.");
                continue;
            }

            for (var job : jobPosts) {
                if (jobPostIndex >= results[userIndex].length) {
                    System.out.println("Warning: jobPostIndex out of bounds for results array.");
                    break;
                }

                if (matrix[userIndex][jobPostIndex] != -1) {
                    pairs.add(new Pair(jobPostIndex, results[userIndex][jobPostIndex]));
                    System.out.println("User ID: " + user.getId() + ", Job ID: " + job.getId() + ", Score: " + results[userIndex][jobPostIndex]);
                }

                jobPostIndex++;
            }

            pairs.sort((p1, p2) -> Double.compare(p2.value, p1.value));
            System.out.println("Recommended jobs for user ID: " + user.getId() + ":");

            for (Pair pair : pairs) {
                JobPost job = jobPosts.get(pair.getIndex());
                recommendedJobs.add(job);
                System.out.println("Recommended Job ID: " + job.getId() + ", Score: " + pair.value);
            }

            for (var job : recommendedJobs) {
                JobRecommendation jobRecommendation = new JobRecommendation();
                jobRecommendation.setJobId(job.getId());
                jobRecommendation.setUserId(user.getId());
                jobRecommendationRepository.save(jobRecommendation);
                System.out.println("Saved job recommendation for User ID: " + user.getId() + ", Job ID: " + job.getId());
            }
            userIndex++;
        }
    }

    private int calculateSkillMatch(List<Skill> skills, JobPost jobPost) {
        int totalDistance = 0;
        int count = 0;
        for (Skill skill : skills) {
            int distance = calculateLevenshteinDistance(skill.getSkillTitle().toLowerCase(), jobPost.getJobTitle().toLowerCase());
            if (distance >= 0) {
                totalDistance += distance;
                count++;
            }
        }
        return count > 0 ? totalDistance / count : -1;
    }

    private int calculateLevenshteinDistance(String word1, String word2) {
        int m = word1.length();
        int n = word2.length();
        int[][] dp = new int[m + 1][n + 1];
        for (int i = 0; i <= m; i++) {
            dp[i][0] = i;
        }
        for (int j = 0; j <= n; j++) {
            dp[0][j] = j;
        }
        for (int i = 1; i <= m; i++) {
            for (int j = 1; j <= n; j++) {
                if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                    dp[i][j] = dp[i - 1][j - 1];
                } else {
                    dp[i][j] = Math.min(Math.min(
                                    dp[i - 1][j] + 1,
                                    dp[i][j - 1] + 1),
                            dp[i - 1][j - 1] + 1
                    );
                }
            }
        }
        return dp[m][n];
    }
    public double[][] matrixFactorization(double[][] R, int K, double alpha, double beta) {
        int users = R.length;
        int items = R[0].length;

        double[][] V = new double[users][K];
        double[][] FTr = new double[K][items];
        Random rand = new Random();

        initializeMatrix(V, rand);
        initializeMatrix(FTr, rand);

        for (int step = 0; step < 5000; step++) {
            double errorSquared = 0;
            for (int u = 0; u < users; u++) {
                for (int i = 0; i < items; i++) {
                    if (R[u][i] != -1) {
                        double[] row = V[u];
                        double[] col = new double[K];
                        for (int k = 0; k < K; k++) {
                            col[k] = FTr[k][i];
                        }

                        double prediction = dot(row, col, K);
                        double error = R[u][i] - prediction;
                        for (int k = 0; k < K; k++) {
                            V[u][k] += alpha * (2 * error * col[k] - beta * V[u][k]);
                            FTr[k][i] += alpha * (2 * error * row[k] - beta * FTr[k][i]);
                        }

                        errorSquared += error * error;
                    }
                }
            }
            for (int u = 0; u < users; u++) {
                for (int k = 0; k < K; k++) {
                    errorSquared += (beta / 2) * (V[u][k] * V[u][k]);
                }
            }
            for (int i = 0; i < items; i++) {
                for (int k = 0; k < K; k++) {
                    errorSquared += (beta / 2) * (FTr[k][i] * FTr[k][i]);
                }
            }

            if (errorSquared <= 0.001) {
                break;
            }
        }
        return predictRatings(V, FTr, users, items, K);
    }


    private void initializeMatrix(double[][] matrix, Random rand) {
        for (int i = 0; i < matrix.length; i++) {
            for (int j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = rand.nextDouble();
            }
        }
    }

    private double dot(double[] row, double[] col, int K) {
        double product = 0;
        for (int i = 0; i < K; i++) {
            product += row[i] * col[i];
        }
        return product;
    }

    private double[][] predictRatings(double[][] V, double[][] FTr, int users, int items, int K) {
        double[][] newR = new double[users][items];
        for (int u = 0; u < users; u++) {
            for (int i = 0; i < items; i++) {
                double[] col = new double[K];
                for (int k = 0; k < K; k++) {
                    col[k] = FTr[k][i];
                }
                newR[u][i] = dot(V[u], col, K);
            }
        }
        return newR;
    }

    public void print(double[][] R) {
        for (double[] row : R) {
            StringJoiner sj = new StringJoiner(" | ");
            for (double col : row) {
                sj.add(String.format("%.2f", col));
            }
            System.out.println(sj.toString());
        }
    }


}
