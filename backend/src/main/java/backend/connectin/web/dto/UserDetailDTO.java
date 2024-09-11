package backend.connectin.web.dto;

import backend.connectin.domain.Education;
import backend.connectin.domain.Experience;
import backend.connectin.domain.Skill;

import java.util.List;

public class UserDetailDTO {
    private List<ExperienceDTO> experiences;
    private List<SkillDTO> skills;
    private List<EducationDTO> education;

    public List<ExperienceDTO> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<ExperienceDTO> experiences) {
        this.experiences = experiences;
    }

    public List<EducationDTO> getEducation() {
        return education;
    }

    public void setEducation(List<EducationDTO> education) {
        this.education = education;
    }

    public List<SkillDTO> getSkills() {
        return skills;
    }

    public void setSkills(List<SkillDTO> skills) {
        this.skills = skills;
    }
}
