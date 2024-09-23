package backend.connectin.web.mappers;

import backend.connectin.domain.JobPost;
import backend.connectin.domain.User;
import backend.connectin.web.dto.JobPostDTO;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {

    public JobPostDTO mapToJopPostDto(JobPost job, User user, Boolean hasApplied) {

        String userName = user.getFirstName() + " " + user.getLastName();

        return new JobPostDTO(
                job.getId(),
                user.getId(),
                job.getJobTitle(),
                job.getCompanyName(),
                job.getJobDescription(),
                job.getCreatedAt(),
                userName,
                hasApplied);
    }

}
