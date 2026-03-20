package backend.connectin.service;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

@Service
public class JWTService {

    public ResponseCookie createCookie(String type, String token) {
        return ResponseCookie.from(type, token)
                .httpOnly(true)
                .secure(true)
                .maxAge(3600)
                .path("/")
                .sameSite("None")
                .build();
    }

    public ResponseCookie returnEmptyCookie() {
        return ResponseCookie.from("accessToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .sameSite("None")
                .build();
    }
}
