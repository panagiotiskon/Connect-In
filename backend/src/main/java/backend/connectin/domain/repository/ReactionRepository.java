package backend.connectin.domain.repository;

import backend.connectin.domain.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    List<Reaction> findAllByUserId(Long userId);


}
