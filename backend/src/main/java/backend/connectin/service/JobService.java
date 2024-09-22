package backend.connectin.service;

import backend.connectin.domain.JobApplication;
import backend.connectin.domain.JobPost;
import backend.connectin.domain.JobView;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.JobApplicationRepository;
import backend.connectin.domain.repository.JobPostRepository;
import backend.connectin.domain.repository.JobViewRepository;
import backend.connectin.web.dto.JobApplicationDTO;
import backend.connectin.web.dto.JobPostDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {
    private final JobPostRepository jobPostRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final UserService userService;
    private final JobViewRepository jobViewRepository;
    private final ConnectionService connectionService;

    public JobService(JobPostRepository jobPostRepository, JobApplicationRepository jobApplicationRepository, UserService userService, JobViewRepository jobViewRepository, ConnectionService connectionService) {
        this.jobPostRepository = jobPostRepository;
        this.jobApplicationRepository = jobApplicationRepository;
        this.userService = userService;
        this.jobViewRepository = jobViewRepository;
        this.connectionService = connectionService;
    }

    public JobPost createJobPost(long userId,String jobTitle,String companyName,String jobDescription){
        userService.findUserOrThrow(userId);
        JobPost jobPost = new JobPost();
        jobPost.setUserId(userId);
        jobPost.setJobTitle(jobTitle);
        jobPost.setCompanyName(companyName);
        jobPost.setJobDescription(jobDescription);
        jobPost.setCreatedAt(Instant.now());
        jobPostRepository.save(jobPost);
        return jobPost;
    }

    public void applyToAJob(long userId,long postId){
        userService.findUserOrThrow(userId);
        Optional<JobPost> jobPost = jobPostRepository.findById(postId);
        if(jobPost.isEmpty()){
            throw new RuntimeException("Job post not found");
        }
        if(jobPost.get().getUserId()==userId){
            throw new RuntimeException("You cant apply to your one job");
        }
        List<JobApplication> jobApplications = jobApplicationRepository.findJobApplicationByUserId(userId);
        if(!jobApplications.isEmpty()){
            if(jobApplications.stream().anyMatch(jobApplication -> jobApplication.getJobPostId()==postId)){
                throw new RuntimeException("already applied");
            }
        }
        JobApplication jobApplication = new JobApplication();
        jobApplication.setUserId(userId);
        jobApplication.setJobPostId(postId);
        jobApplication.setAppliedAt(Instant.now());
        jobApplicationRepository.save(jobApplication);
    }

    public List<JobPostDTO> getJobPosts(long currentUserId){
        List<JobPost> jobPosts = jobPostRepository.findAll();
        if(jobPosts.isEmpty()){
            return List.of();
        }
        List<JobPostDTO> jobPostDTOS = new ArrayList<>();
        for(var jobPost : jobPosts){
            User user = userService.findUserOrThrow(jobPost.getUserId());
            String fullName = user.getFirstName() + " " + user.getLastName();
            List<JobApplication> jobApplications = jobApplicationRepository.findAll();
            boolean hasApplied = false;
            if(jobApplications.stream().anyMatch(jobApplication -> jobApplication.getJobPostId()==jobPost.getId() && jobApplication.getUserId() == currentUserId)){
                hasApplied = true;
            }
            JobPostDTO jobPostDTO = new JobPostDTO(jobPost.getId(),user.getId(),jobPost.getJobTitle(),jobPost.getCompanyName(),jobPost.getJobDescription(),jobPost.getCreatedAt(),fullName,hasApplied);
            jobPostDTOS.add(jobPostDTO);
        }
        return jobPostDTOS;
    }


    public List<JobApplicationDTO> getJobApplications(long userId){
        userService.findUserOrThrow(userId);
        List<Long> jobPosts = jobPostRepository.findJobPostByUserId(userId).stream().map(JobPost::getId).toList();
        if(jobPosts.isEmpty()){
            return List.of();
        }
        List<JobApplicationDTO> jobApplicationDTOS = new ArrayList<>();
        for(var jobPost:jobPosts){
            List<JobApplication> jobApplications = jobApplicationRepository.findJobApplicationByJobPostId(jobPost);
            if(jobApplications.isEmpty()){
                continue;
            }
            for(JobApplication jobApplication:jobApplications){
                User user = userService.findUserOrThrow(jobApplication.getUserId());
                String fullName = user.getFirstName() + " " + user.getLastName();
                JobApplicationDTO jobApplicationDTO = new JobApplicationDTO(user.getId(),jobApplication.getJobPostId(),fullName);
                jobApplicationDTOS.add(jobApplicationDTO);

            }
        }

        return jobApplicationDTOS;
    }

    public void deleteJob(long userId,long jobPostId){
        userService.findUserOrThrow(userId);
        Optional<JobPost> jobPost = jobPostRepository.findById(jobPostId);
        if(jobPost.isEmpty()){
            throw new RuntimeException("Job post not found");
        }
        if(jobPost.get().getUserId()==userId){
            jobPostRepository.delete(jobPost.get());
        }
    }

    public JobView addViewToAJob(long userId,long jobPostId){
        userService.findUserOrThrow(userId);
        Optional<JobPost> jobPost = jobPostRepository.findById(jobPostId);
        if(jobPost.isEmpty()){
            throw new RuntimeException("Job post not found");
        }
        if(jobViewRepository.findJobViewByUserIdAndJobId(userId,jobPostId).isPresent()){
            return null;
        };
        JobView jobView = new JobView();
        jobView.setUserId(userId);
        jobView.setJobId(jobPost.get().getId());
        jobView.setViewedAt(Instant.now());
        jobViewRepository.save(jobView);
        return jobView;
    }
}
