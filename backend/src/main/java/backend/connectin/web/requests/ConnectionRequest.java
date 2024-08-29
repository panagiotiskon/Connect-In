package backend.connectin.web.requests;

public class ConnectionRequest {
    private String user_1_email;
    private String user_2_email;

    public String getUser_1_email() {
        return user_1_email;
    }

    public void setUser_1_email(String user_1_email) {
        this.user_1_email = user_1_email;
    }

    public String getUser_2_email() {
        return user_2_email;
    }

    public void setUser_2_email(String user_2_email) {
        this.user_2_email = user_2_email;
    }
}
