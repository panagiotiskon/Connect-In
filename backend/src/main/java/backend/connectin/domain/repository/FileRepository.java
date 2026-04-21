package backend.connectin.domain.repository;

import backend.connectin.domain.FileDB;
import backend.connectin.web.dto.FileMetaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<FileDB, String> {
    List<FileDB> findByUserEmail(String userEmail);

    @Query("""
            SELECT f.userId, f.id
            FROM FileDB f
            WHERE f.userId IN :userIds AND f.isProfilePicture = TRUE
            """)
    List<Object[]> findProfilePictureFileIdsByUserIds(@Param("userIds") Collection<Long> userIds);

    @Modifying
    @Query("DELETE FROM FileDB f WHERE f.userId = :userEmail")
    void deleteByUserEmail(@Param("userEmail") String userEmail);

    @Query("SELECT f FROM FileDB f WHERE f.userId = :userId AND f.isProfilePicture = TRUE")
    Optional<FileDB> findProfilePicture(@Param("userId") Long userId);

    @Query("SELECT f FROM FileDB f WHERE f.userId IN :userIds AND f.isProfilePicture = TRUE")
    List<FileDB> findProfilePicturesByUserIds(@Param("userIds") List<Long> userIds);

    @Query("""
            SELECT new backend.connectin.web.dto.FileMetaDTO(f.id, f.type, f.name)
            FROM FileDB f
            WHERE f.id IN :ids
            """)
    List<FileMetaDTO> findMetaByIds(@Param("ids") List<String> ids);

    @Query("""
            SELECT new backend.connectin.web.dto.FileMetaDTO(f.id, f.type, f.name)
            FROM FileDB f
            WHERE f.id = :id
            """)
    Optional<FileMetaDTO> findMetaById(@Param("id") String id);

}
