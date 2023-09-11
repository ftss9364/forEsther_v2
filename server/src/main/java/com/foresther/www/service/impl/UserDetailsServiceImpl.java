package com.foresther.www.service.impl;

//import com.springboot.security.data.repository.UserRepository;
import com.foresther.www.data.entity.User;
import com.foresther.www.data.repository.UserMapper;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final Logger LOGGER = LoggerFactory.getLogger(UserDetailsServiceImpl.class);

    private final UserMapper userMapper; // UserMapper 주입

    @Autowired
    public UserDetailsServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        LOGGER.info("[loadUserByUsername] loadUserByUsername 수행. username : {}", username);

        User user = userMapper.getById(username); // UserMapper를 사용하여 사용자 정보 가져오기

        if (user == null) {
            throw new UsernameNotFoundException("사용자를 찾을 수 없습니다: " + username);
        }

        // UserDetails 인터페이스를 구현한 사용자 정보를 반환합니다.
        return user;
    }
}