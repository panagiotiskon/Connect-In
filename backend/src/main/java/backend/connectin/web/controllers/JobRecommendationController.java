package backend.connectin.web.controllers;

import backend.connectin.domain.JobView;
import backend.connectin.service.JobService;
import backend.connectin.service.RecommendationService;
import backend.connectin.web.dto.JobPostDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/jobs")
public class JobRecommendationController {
    private final JobService jobService;
    private final RecommendationService recommendationService;

    public JobRecommendationController(JobService jobService, RecommendationService recommendationService) {
        this.jobService = jobService;
        this.recommendationService = recommendationService;
    }

    @PostMapping("/view-job")
    public JobView addViewToAJob(@RequestParam long userId , @RequestParam long jobId) {
        return jobService.addViewToAJob(userId,jobId);
    }

    @GetMapping("/recommend-jobs")
    public List<JobPostDTO> getRecommendedJobs(@RequestParam long userId) {
        return recommendationService.findRecommendedJobsForUser(userId);
    }
}
