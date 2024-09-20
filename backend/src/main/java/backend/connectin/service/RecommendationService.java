package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.*;
import backend.connectin.recommendation.Algortithm.MatrixFactorization;
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
        List<JobRecommendation> jobRecommendations = jobRecommendationRepository.findByUserId(userId);
        List<Long> jobIds = jobRecommendations.stream().map(JobRecommendation::getJobId).toList();
        List<JobPost> recommendedJobs = new ArrayList<>();
        jobIds.stream().map(jobId -> jobPostRepository.findById(jobId).orElse(null))
                .filter(Objects::nonNull)
                .forEach(recommendedJobs::add);
        return recommendedJobs;
    }

    public void recommendJobs() {
        List<User> users = userService.fetchAll();
        List<JobPost> jobPosts = jobPostRepository.findAll();

        if (users.isEmpty() || jobPosts.isEmpty()) {
            System.out.println("No users or job posts available for recommendation.");
            return;
        }

        double[][] matrix = new double[users.size()][jobPosts.size()];

        for (int userIndex = 0; userIndex < users.size(); userIndex++) {
            User user = users.get(userIndex);
            if (user.getId() == 1) { // Skip admin user
                continue;
            }

            List<JobView> jobViews = jobViewRepository.findByUserId(user.getId());
            PersonalInfo personalInfo = personalInfoRepository.findByUserId(user.getId());
            if(personalInfo==null){
                continue;
            }
            List<Skill> skills = personalInfo.getSkills();

            for (int jobPostIndex = 0; jobPostIndex < jobPosts.size(); jobPostIndex++) {
                JobPost job = jobPosts.get(jobPostIndex);
                int skillMatchScore = calculateSkillMatch(skills, job, jobViews);
                System.out.println("MATCH SCORE FOR USER "+user.getFirstName()+" TOTAL SCORE "+skillMatchScore+" JOB TITLE "+job.getJobTitle());
                // LOWER MATCHING SCORE MEANING MORE RELEVANCE
                matrix[userIndex][jobPostIndex] = skillMatchScore > 0 ? skillMatchScore : -1;
            }
        }
        System.out.println("MATRIX BEFORE FACTORIZATION");
        System.out.println(Arrays.deepToString(matrix));
        MatrixFactorization matrixFactorization = new MatrixFactorization(matrix, 2, 0.0002, 0.02, 5000);
        double[][] results = matrixFactorization.trainAndPredict();
        System.out.println("MATRIX AFTER FACTORIZATION"+ Arrays.deepToString(results));
        saveRecommendations(users, jobPosts, results, matrix);
    }

    private int calculateSkillMatch(List<Skill> skills, JobPost jobPost, List<JobView> jobViews) {
        int totalDistance = 0;
        int skillCount = 0;

        for (Skill skill : skills) {
            int distance = calculateLevenshteinDistance(skill.getSkillTitle().toLowerCase(), jobPost.getJobTitle().toLowerCase());
            if (distance >= 0) {
                totalDistance += distance;
                skillCount++;
            }
        }   //here in levenshtein distance if the total distance is smaller we have more relevance
        int skillMatchScore = skillCount > 0 ? totalDistance / skillCount : -1;
        int viewBonus = calculateViewedJobBonus(jobPost, jobViews);
        if(viewBonus==0){
            skillMatchScore+=2;
        }
        else if(viewBonus<0) {
            skillMatchScore += 4;
        }
        else if(viewBonus>5 && viewBonus<10){
            skillMatchScore -= 2;
        }
        else if(viewBonus>10 && viewBonus<20) {
            skillMatchScore -= 4;
        }
        else if(viewBonus>20){
            skillMatchScore -= 6;
        }


        return skillMatchScore;
    }

    private int calculateViewedJobBonus(JobPost currentJob, List<JobView> jobViews) {
        int bonusScore = 0;

        for (JobView jobView : jobViews) {
            Optional<JobPost> viewedJobOpt = jobPostRepository.findById(jobView.getJobId()); //we need to know what job the user has seen ,find their titles
            if (viewedJobOpt.isPresent()) {                                                  //and see the relevance with each other job
                JobPost viewedJob = viewedJobOpt.get();
                int titleDistance = calculateLevenshteinDistance(viewedJob.getJobTitle().toLowerCase(), currentJob.getJobTitle().toLowerCase());
                System.out.println("title distance "+titleDistance);
                // Invert the distance to create a "bonus" (lower distance = higher bonus)
                int similarityBonus = Math.max(0, 10 - titleDistance);  // Bonus: 10 points minus title distance
                System.out.println("similarity Bonus "+similarityBonus);
                bonusScore += similarityBonus;
            }
        }

        return bonusScore;
    }

    private int calculateLevenshteinDistance(String word1, String word2) {
        int[][] dp = new int[word1.length() + 1][word2.length() + 1];

        for (int i = 0; i <= word1.length(); i++) {
            for (int j = 0; j <= word2.length(); j++) {
                if (i == 0) {
                    dp[i][j] = j;
                }
                else if (j == 0) {
                    dp[i][j] = i;
                }
                else {
                    dp[i][j] = min(dp[i - 1][j - 1]
                                    + costOfSubstitution(word1.charAt(i - 1), word2.charAt(j - 1)),
                            dp[i - 1][j] + 1,
                            dp[i][j - 1] + 1);
                }
            }
        }

        return dp[word1.length()][word2.length()];
    }

    public static int costOfSubstitution(char a, char b) {
        return a == b ? 0 : 1;
    }

    public static int min(int... numbers) {
        return Arrays.stream(numbers)
                .min().orElse(Integer.MAX_VALUE);
    }

    private void saveRecommendations(List<User> users, List<JobPost> jobPosts, double[][] results, double[][] matrix) {
        for (int userIndex = 0; userIndex < users.size(); userIndex++) {
            User user = users.get(userIndex);
            if (user.getId() == 1) continue; // Skip admin user

            List<Pair> pairs = new ArrayList<>();
            for (int jobPostIndex = 0; jobPostIndex < jobPosts.size(); jobPostIndex++) {
                if (matrix[userIndex][jobPostIndex] != -1) {
                    pairs.add(new Pair(jobPostIndex, results[userIndex][jobPostIndex]));
                }
            }

            pairs.sort(Comparator.comparingDouble(p -> p.value)); // Sort by descending score

            System.out.println("Recommendations for user: " + user.getFirstName());
            for (Pair pair : pairs) {
                JobPost job = jobPosts.get(pair.getIndex());
                System.out.println("Job: " + job.getJobTitle() + " | Score: " + pair.getValue());

                // Check if the recommendation already exists to avoid duplicates
                List<JobRecommendation> jobRecommendations = jobRecommendationRepository.findByUserId(user.getId());
                if (jobRecommendations != null) {
                    for (var jobRecommendation : jobRecommendations) {
                        if (jobRecommendation.getJobId() == job.getId()) {
                            jobRecommendationRepository.delete(jobRecommendation);
                        }
                    }
                }

                // Save the recommendation to the database
                JobRecommendation jobRecommendation = new JobRecommendation();
                jobRecommendation.setJobId(job.getId());
                jobRecommendation.setUserId(user.getId());
                jobRecommendationRepository.save(jobRecommendation);
            }
        }
    }
    private static class Pair {
        private final int index;
        private final double value;

        public Pair(int index, double value) {
            this.index = index;
            this.value = value;
        }

        public int getIndex() {
            return index;
        }

        public double getValue() {
            return value;
        }
    }
}
