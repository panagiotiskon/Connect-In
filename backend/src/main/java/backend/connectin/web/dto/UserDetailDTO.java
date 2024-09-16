package backend.connectin.web.dto;

import backend.connectin.web.resources.CommentResource;
import backend.connectin.web.resources.*;

import java.util.List;

public class UserDetailDTO {
    private List<ExperienceDTO> experiences;
    private List<SkillDTO> skills;
    private List<EducationDTO> education;
    private List<JobApplicationDTO> jobApplications;
    private List<ConnectionResource> connectedUsers;
    private List<JobPostDTO> jobPosts;
    private List<PostResource> posts;
    private List<CommentResource> comments;
    private List<ReactionResource> reactions;

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

    public List<JobApplicationDTO> getJobApplications() {
        return jobApplications;
    }

    public List<ConnectionResource> getConnectedUsers() {
        return connectedUsers;
    }

    public void setConnectedUsers(List<ConnectionResource> connectedUsers) {
        this.connectedUsers = connectedUsers;
    }


    public void setJobApplications(List<JobApplicationDTO> jobApplications) {
        this.jobApplications = jobApplications;
    }

    public List<JobPostDTO> getJobPosts() {
        return jobPosts;
    }

    public void setJobPosts(List<JobPostDTO> jobPosts) {
        this.jobPosts = jobPosts;
    }

    public List<PostResource> getPosts() {
        return posts;
    }

    public void setPosts(List<PostResource> posts) {
        this.posts = posts;
    }

    public List<CommentResource> getComments() {
        return comments;
    }

    public void setComments(List<CommentResource> comments) {
        this.comments = comments;
    }

    public List<ReactionResource> getReactions() {
        return reactions;
    }

    public void setReactions(List<ReactionResource> reactions) {
        this.reactions = reactions;
    }
}
