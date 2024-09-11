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
                experience.getIsPublic()
        );
    }

    public SkillDTO mapToSkillDTO(Skill skill) {
        return new SkillDTO(
                skill.getSkillTitle(),
                skill.getSkillDescription(),
                skill.getIsPublic()
        );
    }

    public EducationDTO mapToEducationDTO(Education education) {
        return new EducationDTO(
                education.getUniversityName(),
                education.getFieldOfStudy(),
                education.getStartDate(),
                education.getEndDate(),
                education.getIsPublic()
        );
    }

    public Education mapToEducation(EducationDTO educationDTO) {
        Education education = new Education();
        education.setUniversityName(educationDTO.universityName());
        education.setFieldOfStudy(educationDTO.fieldOfStudy());
        education.setStartDate(educationDTO.startDate());
        education.setEndDate(educationDTO.endDate());
        education.setIsPublic(educationDTO.isPublic());
        return education;
    }

    public Experience mapToExperience(ExperienceDTO experienceDTO) {
        Experience experience = new Experience();
        experience.setCompanyName(experienceDTO.companyName());
        experience.setJobTitle(experienceDTO.jobTitle());
        experience.setStartDate(experienceDTO.startDate());
        experience.setEndDate(experienceDTO.endDate());
        experience.setIsPublic(experienceDTO.isPublic());
        return experience;
    }

    public Skill mapToSkill(SkillDTO skillDTO) {
        Skill skill = new Skill();
        skill.setSkillTitle(skillDTO.skillTitle());
        skill.setSkillDescription(skillDTO.skillDescription());
        skill.setIsPublic(skill.getIsPublic());
        return skill;
    }
}
