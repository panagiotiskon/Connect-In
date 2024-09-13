package backend.connectin.domain.repository;

import backend.connectin.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {


    List<Post> findAllByUserId(Long userId);

}
