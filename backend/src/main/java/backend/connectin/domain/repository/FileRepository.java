package backend.connectin.domain.repository;

import backend.connectin.domain.FileDB;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface FileRepository extends CrudRepository<FileDB, String> {
    List<FileDB> findByUserEmail(String userEmail);

    @Modifying
    @Query("DELETE FROM FileDB f WHERE f.userId = :userEmail")
    void deleteByUserEmail(@Param("userEmail") String userEmail);
}
