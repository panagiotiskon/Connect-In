package backend.connectin.domain.repository;

import backend.connectin.domain.PersonalInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalInfoRepository extends JpaRepository<PersonalInfo, Long> {
    PersonalInfo findByUserId(Long userId);

}
