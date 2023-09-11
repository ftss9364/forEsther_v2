package com.foresther.www.service.impl;

import com.foresther.www.common.CommonResponse;
import com.foresther.www.config.security.JwtTokenProvider;
import com.foresther.www.data.dto.SignInResultDto;
import com.foresther.www.data.dto.SignUpResultDto;
import com.foresther.www.data.entity.User;
import com.foresther.www.data.repository.UserMapper;
import com.foresther.www.service.SignService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class SignServiceImpl implements SignService {

    private final Logger LOGGER = LoggerFactory.getLogger(SignServiceImpl.class);

    private final UserMapper userMapper; // UserMapper 주입

    public JwtTokenProvider jwtTokenProvider;
    public PasswordEncoder passwordEncoder;

    @Autowired
    public SignServiceImpl(UserMapper userMapper, JwtTokenProvider jwtTokenProvider, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public SignUpResultDto signUp(String id, String password, String name, String role) {
        LOGGER.info("[getSignUpResult] 회원 가입 정보 전달");
        User user;
        if (role.equalsIgnoreCase("admin")) {
            user = User.builder()
                    .id(id)
                    .name(name)
                    .password(passwordEncoder.encode(password))
                    .roles(Collections.singletonList("ROLE_ADMIN"))
                    .build();
        } else {
            user = User.builder()
                    .id(id)
                    .name(name)
                    .password(passwordEncoder.encode(password))
                    .roles(Collections.singletonList("ROLE_USER"))
                    .build();
        }

        // 사용자 정보를 데이터베이스에 저장
        int rowsInserted = userMapper.insertUser(user);

        SignUpResultDto signUpResultDto = new SignInResultDto();

        LOGGER.info("[signUp] 사용자 정보 저장 결과 확인");
        if (rowsInserted > 0) {
            LOGGER.info("[signUp] 정상 처리 완료");
            setSuccessResult(signUpResultDto);
        } else {
            LOGGER.info(" [signUp] 실패 처리 완료");
            setFailResult(signUpResultDto);
        }
        return signUpResultDto;
    }

    @Override
    public SignInResultDto signIn(String id, String password) throws RuntimeException {
        LOGGER.info("[signIn] 회원 로그인 정보 확인");
        User user = userMapper.getById(id); // UserMapper로 변경

        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            LOGGER.info("[signIn] 로그인 성공, id : {}", id);

            // 토큰 생성 및 설정
            String token = jwtTokenProvider.createToken(String.valueOf(user.getId()), user.getRoles());
            SignInResultDto signInResultDto = SignInResultDto.builder()
                    .token(token)
                    .build();

            setSuccessResult(signInResultDto);
            return signInResultDto;
        } else {
            LOGGER.error("[signIn] 로그인 실패, id : {}", id);
            throw new RuntimeException("로그인 실패"); // 로그인 실패 예외 처리
        }
    }

    private void setSuccessResult(SignUpResultDto result) {
        result.setSuccess(true);
        result.setCode(CommonResponse.SUCCESS.getCode());
        result.setMsg(CommonResponse.SUCCESS.getMsg());
    }

    private void setFailResult(SignUpResultDto result){
        result.setSuccess(false);
        result.setCode(CommonResponse.FAIL.getCode());
        result.setMsg(CommonResponse.FAIL.getMsg());
    }

}