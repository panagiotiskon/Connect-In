package backend.connectin.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "post_recommendation")
public class PostRecommendation {
    private long id;
    private long userId;
    private long postId;
    private double postScore;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Column(name = "user_id")
    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    @Column(name = "post_id")
    public long getPostId() {
        return postId;
    }

    public void setPostId(long postId) {
        this.postId = postId;
    }

    @Column(name = "post_score")
    public double getPostScore() {
        return postScore;
    }

    public void setPostScore(double postScore) {
        this.postScore = postScore;
    }

}
