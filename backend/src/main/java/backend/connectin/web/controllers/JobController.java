package backend.connectin.web.controllers;

import backend.connectin.domain.JobPost;
import backend.connectin.service.JobService;
import backend.connectin.web.dto.JobApplicationDTO;
import backend.connectin.web.dto.JobPostDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/jobs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobController {
    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @PostMapping("/post")
    public JobPost createJobPost(@RequestParam long userId, @RequestParam String jobTitle, @RequestParam String companyName, @RequestParam String jobDescription) {
        return jobService.createJobPost(userId, jobTitle, companyName, jobDescription);
    }

    @PostMapping("/apply")
    public void applyToAJob(@RequestParam long userId, @RequestParam long jobPostId) {
        jobService.applyToAJob(userId, jobPostId);
    }

    @GetMapping("/posts")
    public List<JobPostDTO> getJobPosts(@RequestParam long currentUserId) {
        return jobService.getJobPosts(currentUserId);
    }

    @GetMapping("/applications")
    public List<JobApplicationDTO> getJobApplications(@RequestParam long userId) {
        return jobService.getJobApplications(userId);
    }

    @DeleteMapping("/delete")
    public void deleteJob(@RequestParam long userId, @RequestParam long jobPostId) {
        jobService.deleteJob(userId, jobPostId);
    }
}
