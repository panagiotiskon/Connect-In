package backend.connectin.web.mappers;

import backend.connectin.domain.Comment;
import backend.connectin.domain.Post;
import backend.connectin.domain.User;
import backend.connectin.web.requests.CommentRequest;
import backend.connectin.web.resources.CommentResource;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class CommentMapper {

    public Comment mapToComment( User user, Post post,CommentRequest commentRequest) {
        Comment comment = new Comment();
        comment.setContent(commentRequest.getContent());
        comment.setUser(user);
        comment.setPost(post);
        comment.setCreatedAt(Instant.now());
        post.getComments().add(comment);
        return comment;
    }

    public CommentResource mapToCommentResource(Comment comment) {
        CommentResource commentResource = new CommentResource();
        commentResource.setCommentId(comment.getId());
        commentResource.setContent(comment.getContent());
        commentResource.setCreatedAt(comment.getCreatedAt());
        commentResource.setUserId(comment.getUser().getId());
        commentResource.setUsername(comment.getUser().getFirstName()+" "+comment.getUser().getLastName());
        return commentResource;
    }

}
