package backend.connectin.domain.repository;

import backend.connectin.domain.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
    PersonalInfo findByUserId(Long userId);

    @Query(value = """
            SELECT pi.user_id, e.job_title, e.company_name
            FROM personal_info pi
            LEFT JOIN experience e ON e.personal_info_id = pi.id
                AND e.id = (SELECT MAX(e2.id) FROM experience e2 WHERE e2.personal_info_id = pi.id)
            WHERE pi.user_id IN :userIds
            """, nativeQuery = true)
    List<Object[]> findLatestExperienceByUserIds(@Param("userIds") List<Long> userIds);
}
