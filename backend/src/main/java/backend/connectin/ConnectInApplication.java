package backend.connectin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ConnectInApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConnectInApplication.class, args);
    }

}
