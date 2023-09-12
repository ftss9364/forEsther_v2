import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로그인 시 저장한 토큰을 가져옵니다.
    const token = localStorage.getItem('token');

    // 토큰을 백엔드에 보냅니다.
    axios.get('/sign-api/validate-token', {
      headers: {
        Authorization: `Bearer ${token}`, // 토큰을 Authorization 헤더에 추가
      },
    })
      .then((response) => {
        // 백엔드로부터 권한 정보를 받아옵니다.
        const user = response.data;
        console.log(user);

        // 권한 정보를 상태에 저장합니다.
        setUser(user);
        setLoading(false);
        
      })
      .catch((error) => {
        // 토큰이 유효하지 않거나 권한이 없는 경우 처리
        console.error('토큰 검증 실패:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div>
      {user && user.username ? (
        <div>
          <h2>사용자 정보</h2>
          <p>사용자 이름: {user.username}</p>
          <p>권한: {user.roles.map(role => role.authority).join(', ')}</p>
        </div>
      ) : (
        <div>로그인이 필요합니다.</div>
      )}
    </div>
  );
}

export default UserProfile;
