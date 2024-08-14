package backend.connectin.domain;


import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name = "files")
public class FileDB {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid2")
    private String id;

    private String name;

    private String type;
    @Lob
    private byte[] data;

    private Boolean isProfilePicture;

    @Column(name = "user_email", nullable = false)
    private String userEmail;

    @OneToOne
    @JoinColumn(name = "user_email", referencedColumnName = "email", insertable = false, updatable = false)
    private User user;

    public FileDB() {
    }

    public FileDB(String userEmail, byte[] data, String type, String name) {
        this.userEmail = userEmail;
        this.data = data;
        this.type = type;
        this.name = name;
    }

    public FileDB(String name, String type, byte[] data, Boolean isProfilePicture, String userEmail) {
        this.name = name;
        this.isProfilePicture = isProfilePicture;
        this.userEmail = userEmail;
        this.type = type;
        this.data = data;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Boolean getProfilePicture() {
        return isProfilePicture;
    }

    public void setProfilePicture(Boolean profilePicture) {
        isProfilePicture = profilePicture;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
        this.userEmail = user.getEmail(); // Ensure userEmail is in sync
    }
}