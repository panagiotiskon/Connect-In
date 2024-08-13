package backend.connectin.config;


import backend.connectin.domain.Role;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.RoleRepository;
import backend.connectin.domain.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
public class DefaultAdminConfig {

    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;

    public DefaultAdminConfig(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Bean
    @Transactional
    public CommandLineRunner createDefaultAdmin() {
        return args -> {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN");

            // Check if the admin user exists, if not create it
            if (userRepository.findUserByEmail("admin@example.com").isEmpty()) {
                User admin = new User();
                admin.setEmail("admin@example.com");
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRoles(List.of(adminRole)); // assign admin role
                userRepository.save(admin);
            }
        };
    }
}
