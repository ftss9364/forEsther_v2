package com.foresther.www.sign;

import com.foresther.www.config.security.JwtTokenProvider;
import com.foresther.www.data.dto.*;
import com.foresther.www.data.entity.User;
import com.foresther.www.service.SignService;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/sign-api")
public class SignController {
    private final Logger LOGGER = LoggerFactory.getLogger(SignController.class);
    private final SignService signService;

    private final JwtTokenProvider jwtTokenProvider;

    private final UserDetailsService userDetailsService;

    @Autowired
    public  SignController(SignService signService, JwtTokenProvider jwtTokenProvider, UserDetailsService userDetailsService) {
        this.signService = signService;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userDetailsService = userDetailsService;
    }

//    @PostMapping(value = "/sign-in")
//    public SignInResultDto signIn(
//            @ApiParam(value = "ID", required = true) @RequestParam String id,
//            @ApiParam(value = "Password", required = true) @RequestParam String password)
//            throws RuntimeException {
//        LOGGER.info("[signIn] 로그인을 시도하고 있습니다. id : {}, pw : ****", id);
//        SignInResultDto signInResultDto = signService.signIn(id, password);
//
//        if(signInResultDto.getCode() == 0) {
//            LOGGER.info("[signIn] 정상적으로 로그인되었습니다. id : {}, token : {}", id,
//                    signInResultDto.getToken());
//        }
//
//        return signInResultDto;
//    }

    @PostMapping(value = "/sign-in")
    public ResponseEntity<?> signIn(@RequestBody SignInRequestDto signInRequestDto)
            throws RuntimeException {
        String id = signInRequestDto.getId();
        String password = signInRequestDto.getPassword();
        LOGGER.info("[signIn] 로그인을 시도하고 있습니다. id : {}, pw : ****", id);
        SignInResultDto signInResultDto = signService.signIn(id, password);

        if(signInResultDto.getCode() == 0) {
            LOGGER.info("[signIn] 정상적으로 로그인되었습니다. id : {}, token : {}", id,
                    signInResultDto.getToken());
        }

        return ResponseEntity.ok(signInResultDto);
    }

//    @PostMapping(value = "/sign-up")
//    public SignUpResultDto signUp(
//            @ApiParam(value = "ID", required = true) @RequestParam String id,
//            @ApiParam(value = "비밀번호", required = true) @RequestParam String password,
//            @ApiParam(value = "이름", required = true) @RequestParam String name,
//            @ApiParam(value = "권한", required = true) @RequestParam String role) {
//        LOGGER.info("[signUp] 회원가입을 수행합니다. id : {}, password : ****, name : {}, role : {}", id,
//                name, role);
//        SignUpResultDto signUpResultDto = signService.signUp(id, password, name, role);
//
//        LOGGER.info("[signUp] 회원가입을 완료했습니다. id :{}", id);
//        return signUpResultDto;
//    }

    @PostMapping(value = "/sign-up")
    public SignUpResultDto signUp(@RequestBody SignUpRequestDto signUpRequestDto) {
        String id = signUpRequestDto.getId();
        String password = signUpRequestDto.getPassword();
        String name = signUpRequestDto.getName();
        String role = signUpRequestDto.getRole();

        LOGGER.info("[signUp] 회원가입을 수행합니다. id : {}, password : ****, name : {}, role : {}", id, name, role);
        SignUpResultDto signUpResultDto = signService.signUp(id, password, name, role);

        LOGGER.info("[signUp] 회원가입을 완료했습니다. id :{}", id);
        return signUpResultDto;
    }


    @GetMapping(value = "/exception")
    public void exceptionTest() throws RuntimeException {
        throw new RuntimeException("접근이 금지되었습니다.");
    }

    @ExceptionHandler(value = RuntimeException.class)
    public ResponseEntity<Map<String, String>> ExceptionHandler(RuntimeException e) {
        HttpHeaders responseHeaders = new HttpHeaders();
        HttpStatus httpStatus = HttpStatus.BAD_REQUEST;

        LOGGER.error("ExceptionHandler 호출, {}z {}", e.getCause(), e.getMessage());

        Map<String, String> map = new HashMap<>();
        map.put("error type", httpStatus.getReasonPhrase());
        map.put("code", "400");
        map.put("message", "에러 발생");

        return new ResponseEntity<>(map, responseHeaders, httpStatus);
    }


//    @GetMapping("/validate-token")
//    public ResponseEntity<User> validateToken(@RequestHeader("Authorization") String tokenHeader) {
//        try {
//            // 헤더에서 토큰을 추출합니다.
//            String token = tokenHeader.replace("Bearer ", "");
//
//            // 토큰을 검증하고 사용자 정보를 가져옵니다.
//            UserDetails userDetails = jwtTokenUtil.getUserDetailsFromToken(token);
//
//            // 사용자 정보를 반환합니다.
//            return ResponseEntity.ok(new User(userDetails.getUsername(), userDetails.getAuthorities()));
//        } catch (Exception e) {
//            // 토큰이 유효하지 않거나 권한이 없는 경우 처리
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//        }
//    }

    @GetMapping("/validate-token")
    public ResponseEntity<UserProfileResponseDto> getUserProfile(@RequestHeader("Authorization") String tokenHeader) {
        try {
            // 헤더에서 토큰을 추출합니다.
            String token = tokenHeader.replace("Bearer ", "");


            // 토큰을 검증하고 사용자 정보를 가져옵니다.
//            UserDetails userDetails = jwtTokenUtil.getUserDetailsFromToken(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(jwtTokenProvider.getUsername(token));
            System.out.println(userDetails);

            // 사용자 정보를 반환합니다.
            UserProfileResponseDto userProfileResponseDto = new UserProfileResponseDto();
            userProfileResponseDto.setUsername(userDetails.getUsername());
            userProfileResponseDto.setRoles(userDetails.getAuthorities());

            // 사용자 프로필 정보 응답
            return ResponseEntity.ok(userProfileResponseDto);
        } catch (Exception e) {
            // 토큰이 유효하지 않거나 권한이 없는 경우 처리
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }


}