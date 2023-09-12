package com.foresther.www.data.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponseDto {
    private String username;
    private Collection<? extends GrantedAuthority> roles;
}
