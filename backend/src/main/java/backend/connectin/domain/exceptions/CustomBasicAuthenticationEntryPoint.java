package backend.connectin.domain.exceptions;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class CustomBasicAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException {
        String message = authException.getMessage() != null ? authException.getMessage() : authException.getClass().getName();
        String path = request.getRequestURI();
        response.setHeader("connectIn-error-reason","Authentication Failed");
        response.sendError(HttpStatus.UNAUTHORIZED.value(), HttpStatus.UNAUTHORIZED.getReasonPhrase());
        response.setContentType("application/json;charset=UTF-8");

        String json = String.format("{\"error\":\"Authentication Failed\"%s\"}",
                message);

        response.getWriter().write(json);

    }


}
