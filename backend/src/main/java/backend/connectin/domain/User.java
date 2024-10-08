package backend.connectin.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    private Long id;
    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phoneNumber;
    private Instant createdAt;
    private Instant updatedAt;
    private List<Role> roles = new ArrayList<>();
    private List<FileDB> files = new ArrayList<>();
    private List<Post> posts = new ArrayList<>();

    public User() {
    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "email")
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Column(name = "first_name")
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Column(name = "password")
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Column(name = "last_name")
    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    @Column(name = "phone_number")
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


    @Column(name = "created_date")
    public Instant getCreatedAt() {
        return createdAt;
    }

    @CreatedDate
    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    @Column(name = "updated_date")
    public Instant getUpdatedAt() {
        return updatedAt;
    }

    @LastModifiedDate
    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.MERGE) // Eager fetching, all operations cascaded
    @JoinTable(name = "user_roles", // Join table name
            joinColumns = @JoinColumn(name = "user_id", referencedColumnName = "id"), // User FK
            inverseJoinColumns = @JoinColumn(name = "role_id", referencedColumnName = "id")) // Role FK
    public List<Role> getRoles() {
        return roles;
    }

    public void setRoles(List<Role> roles) {
        this.roles = roles;
    }


    @OneToMany(mappedBy = "user",  orphanRemoval = true)
    @JsonIgnore
    public List<Post> getPosts() {
        return posts;
    }

    public void setPosts(List<Post> posts) {
        this.posts = posts;
    }

    @OneToMany(mappedBy = "user", orphanRemoval = true)
    public List<FileDB> getFiles() {
        return files;
    }

    public void setFiles(List<FileDB> files) {
        this.files = files;
    }
}
