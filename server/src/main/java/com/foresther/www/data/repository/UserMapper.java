package com.foresther.www.data.repository;

import com.foresther.www.data.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface UserMapper {
    User getById(@Param("id") String id);

    // 회원 가입을 위한 메서드 추가
    int insertUser(User user);
}
