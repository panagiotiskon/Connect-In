package backend.connectin.domain;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "personal_info")
public class PersonalInfo {
    private long id;
    private User user;
    private List<Experience> experiences;
    private List<Education> educations;
    private List<Skill> skills;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @OneToOne
    @JoinColumn(name = "user_id",  referencedColumnName = "id")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @OneToMany(mappedBy = "personalInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Experience> getExperiences() {
        return experiences;
    }

    public void setExperiences(List<Experience> experiences) {
        this.experiences = experiences;
    }

    @OneToMany(mappedBy = "personalInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Education> getEducations() {
        return educations;
    }

    public void setEducations(List<Education> educations) {
        this.educations = educations;
    }
    public void addToEducations(Education education) {
        this.educations.add(education);
    }
    public void addToExperiences(Experience experience) {
        this.experiences.add(experience);
    }
    public void addToSkills(Skill skill) {
        this.skills.add(skill);
    }

    @OneToMany(mappedBy = "personalInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }


}
