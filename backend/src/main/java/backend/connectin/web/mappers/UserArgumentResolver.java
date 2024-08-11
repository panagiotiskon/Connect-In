//package backend.connectin.web.mappers;
//
//import backend.connectin.domain.User;
//import backend.connectin.service.AuthService;
//import io.jsonwebtoken.Jwt;
//import org.springframework.core.MethodParameter;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.support.WebDataBinderFactory;
//import org.springframework.web.context.request.NativeWebRequest;
//import org.springframework.web.method.support.HandlerMethodArgumentResolver;
//import org.springframework.web.method.support.ModelAndViewContainer;
//import org.springframework.web.server.ResponseStatusException;
//
//import java.util.Optional;
//
//public class UserArgumentResolver implements HandlerMethodArgumentResolver {
//
//    private final AuthService authService;
//
//    public UserArgumentResolver(AuthService authService) {
//        this.authService = authService;
//    }
//
//    @Override
//    public boolean supportsParameter(MethodParameter parameter) {
//        return parameter.getParameterType().equals(User.class);
//    }
//
//    @Override
//    public Object resolveArgument(MethodParameter parameter,
//                                  ModelAndViewContainer mavContainer,
//                                  NativeWebRequest webRequest,
//                                  WebDataBinderFactory binderFactory) {
//        Authentication authentication = (Authentication) webRequest.getUserPrincipal();
//
//        if (authentication != null && authentication.getPrincipal() instanceof Jwt) {
//            Jwt jwt = (Jwt) authentication.getPrincipal();
//            String userId = jwt.getSubject();
//            return authService.findUserById(userId);
//            return optionalUser.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
//        } else {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Jwt token not found in @AuthenticationPrincipal");
//        }
//    }
//}
