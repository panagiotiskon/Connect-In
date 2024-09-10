package backend.connectin.service;

import jakarta.servlet.http.Cookie;
import org.springframework.stereotype.Service;

@Service
public class JWTService {


    public Cookie createCookie(String type, String token){
        Cookie cookie = new Cookie(type, token);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setMaxAge(3600);
        cookie.setPath("/");
        return cookie;
    }


    public Cookie returnEmptyCookie() {
        Cookie jwtCookie = new Cookie("accessToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);
        return jwtCookie;
    }

}
