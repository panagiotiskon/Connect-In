package backend.connectin.domain.repository;

import backend.connectin.domain.FileDB;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileDB, String> {
    List<FileDB> findByUserEmail(String userEmail);

    @Modifying
    @Query("DELETE FROM FileDB f WHERE f.userId = :userEmail")
    void deleteByUserEmail(@Param("userEmail") String userEmail);

    @Query("SELECT f FROM FileDB f WHERE f.userId = :userId AND f.isProfilePicture = TRUE")
    Optional<FileDB> findProfilePicture(@Param("userId") Long userId);

}
