package com.foresther.www.service;


import com.foresther.www.data.dto.SignInResultDto;
import com.foresther.www.data.dto.SignUpResultDto;

public interface SignService {
    SignUpResultDto signUp(String id, String password, String name, String role);
    SignInResultDto signIn(String id, String password) throws RuntimeException;
}