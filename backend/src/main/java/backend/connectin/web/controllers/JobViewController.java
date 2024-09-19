package backend.connectin.web.controllers;

import backend.connectin.domain.JobPost;
import backend.connectin.domain.JobRecommendation;
import backend.connectin.domain.JobView;
import backend.connectin.service.JobService;
import backend.connectin.service.RecommendationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/jobs")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class JobViewController {
    private final JobService jobService;
    private final RecommendationService recommendationService;

    public JobViewController(JobService jobService, RecommendationService recommendationService) {
        this.jobService = jobService;
        this.recommendationService = recommendationService;
    }

    @PostMapping("/view-job")
    public JobView addViewToAJob(@RequestParam long userId , @RequestParam long jobId) {
        return jobService.addViewToAJob(userId,jobId);
    }

    @GetMapping("/recommend-jobs")
    public List<JobPost> getRecommendedJobs(@RequestParam long userId) {
        recommendationService.recommendJobs();
        System.out.println(recommendationService.findRecommendJobsForUser(userId));
        return recommendationService.findRecommendJobsForUser(userId);
    }
}
