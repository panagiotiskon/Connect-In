package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.*;
import backend.connectin.recommendation.Algortithm.MatrixFactorization;
import backend.connectin.web.dto.JobPostDTO;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {
    private final JobPostRepository jobPostRepository;
    private final UserService userService;
    private final JobViewRepository jobViewRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final JobRecommendationRepository jobRecommendationRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final PostService postService;
    private final ConnectionService connectionService;
    private final ReactionRepository reactionRepository;
    private final PostRepository postRepository;
    private final PostRecommendationRepository postRecommendationRepository;
    private final PostMapper postMapper;
    private final PostViewRepository postViewRepository;

    public RecommendationService(JobPostRepository jobPostRepository, UserService userService, JobViewRepository jobViewRepository, PersonalInfoRepository personalInfoRepository, JobRecommendationRepository jobRecommendationRepository, JobApplicationRepository jobApplicationRepository, PostService postService, ConnectionService connectionService, ReactionRepository reactionRepository, PostRepository postRepository, PostRecommendationRepository postRecommendationRepository, PostMapper postMapper, PostViewRepository postViewRepository) {
        this.jobPostRepository = jobPostRepository;
        this.userService = userService;
        this.jobViewRepository = jobViewRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.jobRecommendationRepository = jobRecommendationRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.postService = postService;
        this.connectionService = connectionService;
        this.reactionRepository = reactionRepository;
        this.postRepository = postRepository;
        this.postRecommendationRepository = postRecommendationRepository;
        this.postMapper = postMapper;
        this.postViewRepository = postViewRepository;
    }

    public List<JobPostDTO> findRecommendedJobsForUser(long userId) {
        List<JobRecommendation> jobRecommendations = jobRecommendationRepository.findByUserId(userId);
        List<JobRecommendation> sortedRecommendations = jobRecommendations.stream()
                .sorted(Comparator.comparing(JobRecommendation::getJobScore))
                .toList();
        //store by ascending order
        List<Long> jobIds = sortedRecommendations.stream().map(JobRecommendation::getJobId).toList();
        List<JobPost> recommendedJobs = new ArrayList<>();
        jobIds.stream().map(jobId -> jobPostRepository.findById(jobId).orElse(null))
                .filter(Objects::nonNull)
                .forEach(recommendedJobs::add);
        List<Long> connectedUserIds = connectionService.getConnectedUserIds(userId);
        List<JobPost> connectedJobPosts = recommendedJobs.stream().filter(jobPost -> connectedUserIds.contains(jobPost.getUserId()) || jobPost.getUserId()==userId).toList();
        List<JobPostDTO> jobPostDTOS = new ArrayList<>();
        for(var jobPost : connectedJobPosts){
            User user = userService.findUserOrThrow(jobPost.getUserId());
            String fullName = user.getFirstName() + " " + user.getLastName();
            List<JobApplication> jobApplications = jobApplicationRepository.findAll();
            boolean hasApplied = false;
            if(jobApplications.stream().anyMatch(jobApplication -> jobApplication.getJobPostId()==jobPost.getId() && jobApplication.getUserId() == userId)){
                hasApplied = true;
            }
            JobPostDTO jobPostDTO = new JobPostDTO(jobPost.getId(),user.getId(),jobPost.getJobTitle(),jobPost.getCompanyName(),jobPost.getJobDescription(),jobPost.getCreatedAt(),fullName,hasApplied);
            jobPostDTOS.add(jobPostDTO);
        }
        return jobPostDTOS;
    }

    public List<PostResourceDetailed> findRecommendedPostsForUser(long userId) {
        List<PostRecommendation> postRecommendations = postRecommendationRepository.findByUserId(userId);
        List<PostRecommendation> sortedRecommendations = postRecommendations.stream()
                .sorted(Comparator.comparing(PostRecommendation::getPostScore).reversed())
                .toList();

        //store by descending order
        List<Post> postsThatMustBeFetched = postService.fetchFeed(userId);

        Set<Long> fetchedPostIds = postsThatMustBeFetched.stream()
                .map(Post::getId)
                .collect(Collectors.toSet());

        List<PostRecommendation> filteredRecommendations = sortedRecommendations.stream()
                .filter(rec -> fetchedPostIds.contains(rec.getPostId()))
                .toList();

        List<Post> orderedPosts = postsThatMustBeFetched.stream()
                .filter(post -> filteredRecommendations.stream()
                        .anyMatch(rec -> rec.getPostId() == post.getId()))
                .sorted(Comparator.comparing(post -> filteredRecommendations.stream()
                        .map(PostRecommendation::getPostId)
                        .toList()
                        .indexOf(post.getId())))
                .toList();

        return orderedPosts.stream()
                .map(postMapper::mapToPostResourceDetailed).toList();
    }

    public void recommendJobs() {
        recommendPosts();
        List<User> users = userService.fetchAll();
        List<JobPost> jobPosts = jobPostRepository.findAll();

        if (users.isEmpty() || jobPosts.isEmpty()) {
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
                int skillMatchScore = calculateSkillMatchForJobs(skills, job, jobViews);
                // LOWER MATCHING SCORE MEANING MORE RELEVANCE
                matrix[userIndex][jobPostIndex] = skillMatchScore > 0 ? skillMatchScore : -1;
            }
        }
        MatrixFactorization matrixFactorization = new MatrixFactorization(matrix, 2, 0.0002, 0.02, 5000);
        double[][] results = matrixFactorization.trainAndPredict();
        saveJobRecommendations(users, jobPosts, results, matrix);
    }

    public void recommendPosts(){
        List<User> users = userService.fetchAll();
        List<Post> posts = postService.fetchAll();
        if (users.isEmpty() || posts.isEmpty()) {
            return;
        }
        double[][] matrix = new double[users.size()][posts.size()];

        for (int userIndex = 0; userIndex < users.size(); userIndex++) {
            User user = users.get(userIndex);
            if (user.getId() == 1) { // Skip admin user
                continue;
            }

            //List<JobView> jobViews = jobViewRepository.findByUserId(user.getId());
            List<Long> connectionIds = new ArrayList<>(connectionService.getConnectedUserIds(user.getId()));
            List<Long> postIdsFromReactions = reactionRepository.findPostIdsByUserIds(connectionIds);
            // find the posts with the postsIds fetched before
            List<Post> postsFromReactions= postRepository.findPostsByIdIn(postIdsFromReactions);
            connectionIds.add(user.getId());
            connectionIds = new ArrayList<>(new HashSet<>(connectionIds));
            List<Reaction> userReactions = reactionRepository.findAllByUserId(user.getId());
            List<PostView> postViews = postViewRepository.findByUserId(user.getId());
            for (int postIndex = 0; postIndex < posts.size(); postIndex++) {
                int postScore = 0;
                Post post = posts.get(postIndex);
                if(connectionIds.contains(post.getUserId())){   //if the post is user post or connection post add score
                    postScore+= 10;
                    if(!Objects.equals(post.getUserId(), user.getId())){
                        List<Reaction> reactions = reactionRepository.findAllByUserId(user.getId());
                        Long whoPosted = post.getUserId();
                        long howManyReactions = reactions.stream().filter(reaction -> reaction.getPost().getUserId().equals(whoPosted)).count();
                        postScore += (int) howManyReactions;
                         // depending on how many likes or comments current user has done to this user add score
                    }
                }
                else if(postsFromReactions.contains(post)){ //if not connected but connections have like this post
                    postScore+= 3;
                    List<Reaction> connectionReactions = new ArrayList<>();
                    for(var connection : connectionIds){
                        if(!Objects.equals(connection, user.getId())) {
                            List<Reaction> reactions = reactionRepository.findAllByUserId(connection);
                            connectionReactions.addAll(reactions);
                        }
                    }
                    long reactionCount = connectionReactions.stream().filter(reaction -> reaction.getPost().getId().equals(post.getId())).count();
                    if(reactionCount>6){
                        reactionCount = 6;
                    }
                    postScore+= (int) reactionCount;
                }
                if(!userReactions.isEmpty()) {
                    if (userReactions.stream().anyMatch(reaction -> reaction.getPost().getId().equals(post.getId()))) {
                        postScore += 4;
                    }
                }
                else {
                    List<Long> viewedPostIds = postViews.stream().map(PostView::getPostId).toList(); //here if no reactions or likes from user then depending on his post views,
                    Map<Long, Integer> postCountByUser = new HashMap<>();                            //if he liked 3 posts from a user and the post is from that user add 3 to the score of that post
                    viewedPostIds.stream()
                            .map(postRepository::findById)
                            .filter(Optional::isPresent)
                            .map(Optional::get)
                            .forEach(viewedPost -> {
                                long userId = viewedPost.getUserId();
                                postCountByUser.put(userId, postCountByUser.getOrDefault(userId, 0) + 1);
                            });
                    for (Map.Entry<Long, Integer> entry : postCountByUser.entrySet()) {
                        if(entry.getKey()==post.getUserId()){
                            postScore+= entry.getValue();
                        }
                    }
                }
                matrix[userIndex][postIndex] = postScore > 0 ? postScore : -1;
            }

        }
        MatrixFactorization matrixFactorization = new MatrixFactorization(matrix, 2, 0.0002, 0.02, 5000);
        double[][] results = matrixFactorization.trainAndPredict();
        savePostRecommendations(users, posts, results, matrix);

    }

    private int calculateSkillMatchForJobs(List<Skill> skills, JobPost jobPost, List<JobView> jobViews) {
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
                // Invert the distance to create a "bonus" (lower distance = higher bonus)
                int similarityBonus = Math.max(0, 10 - titleDistance);  // Bonus: 10 points minus title distance
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

    private void saveJobRecommendations(List<User> users, List<JobPost> jobPosts, double[][] results, double[][] matrix) {
        for (int userIndex = 0; userIndex < users.size(); userIndex++) {
            User user = users.get(userIndex);
            if (user.getId() == 1) continue; // Skip admin user

            List<Recommendation> recommendations = new ArrayList<>();
            for (int jobPostIndex = 0; jobPostIndex < jobPosts.size(); jobPostIndex++) {
                if (matrix[userIndex][jobPostIndex] != -1) {
                    recommendations.add(new Recommendation(jobPostIndex, results[userIndex][jobPostIndex]));
                }
            }

            for (Recommendation recommendation : recommendations) {
                JobPost job = jobPosts.get(recommendation.getIndex());
                // Check if the recommendation already exists to avoid duplicates
                List<JobRecommendation> jobRecommendations = jobRecommendationRepository.findByUserId(user.getId());
                if (jobRecommendations != null) {
                    for (var jobRecommendation : jobRecommendations) {
                        if (jobRecommendation.getJobId() == job.getId()) {
                            jobRecommendationRepository.delete(jobRecommendation);
                        }
                    }
                }
                JobRecommendation jobRecommendation = new JobRecommendation();
                jobRecommendation.setJobId(job.getId());
                jobRecommendation.setUserId(user.getId());
                jobRecommendation.setJobScore(recommendation.getScore());
                jobRecommendationRepository.save(jobRecommendation);
            }
        }
    }

    private void savePostRecommendations(List<User> users, List<Post> posts, double[][] results, double[][] matrix) {
        for (int userIndex = 0; userIndex < users.size(); userIndex++) {
            User user = users.get(userIndex);
            if (user.getId() == 1) continue; // Skip admin user

            List<Recommendation> recommendations = new ArrayList<>();
            for (int postIndex = 0; postIndex < posts.size(); postIndex++) {
                if (matrix[userIndex][postIndex] != -1) {
                    recommendations.add(new Recommendation(postIndex, results[userIndex][postIndex]));
                }
            }

            for (Recommendation recommendation : recommendations) {
                Post post = posts.get(recommendation.getIndex());
                // Check if the recommendation already exists to avoid duplicates
                List<PostRecommendation> postRecommendations = postRecommendationRepository.findByUserId(user.getId());
                if (postRecommendations != null) {
                    for (var postRecommendation : postRecommendations) {
                        if (postRecommendation.getPostId() == post.getId()) {
                            postRecommendationRepository.delete(postRecommendation);
                        }
                    }
                }
                PostRecommendation postRecommendation = new PostRecommendation();
                postRecommendation.setPostId(post.getId());
                postRecommendation.setUserId(user.getId());
                postRecommendation.setPostScore(recommendation.getScore());
                postRecommendationRepository.save(postRecommendation);
            }
        }
    }
}
