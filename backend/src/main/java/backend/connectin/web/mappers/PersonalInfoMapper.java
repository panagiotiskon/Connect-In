package backend.connectin.web.mappers;

import backend.connectin.domain.Education;
import backend.connectin.domain.Experience;
import backend.connectin.domain.Skill;
import backend.connectin.web.dto.EducationDTO;
import backend.connectin.web.dto.ExperienceDTO;
import backend.connectin.web.dto.SkillDTO;
import org.springframework.stereotype.Component;

@Component
public class PersonalInfoMapper {
    public ExperienceDTO mapToExperienceDTO(Experience experience) {
        return new ExperienceDTO(
                experience.getJobTitle(),
                experience.getCompanyName(),
                experience.getStartDate(),
                experience.getEndDate(),
                experience.getPublic()
        );
    }

    public SkillDTO mapToSkillDTO(Skill skill) {
        return new SkillDTO(
                skill.getSkillTitle(),
                skill.getSkillDescription(),
                skill.getPublic()
        );
    }

    public EducationDTO mapToEducationDTO(Education education) {
        return new EducationDTO(
                education.getUniversityName(),
                education.getFieldOfStudy(),
                education.getStartDate(),
                education.getEndDate(),
                education.getPublic()
        );
    }
}
