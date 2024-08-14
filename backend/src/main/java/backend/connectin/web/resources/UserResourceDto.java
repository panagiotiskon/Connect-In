package backend.connectin.web.resources;

import backend.connectin.domain.User;

public class UserResourceDto {

    private Long id;
    private String firstName;
    private String lastName;

    public UserResourceDto(User user) {
        this.id = user.getId();
        this.firstName = user.getFirstName();
        this.lastName = user.getLastName();
    }

    public UserResourceDto() {
    }

    public UserResourceDto(Object o) {
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
