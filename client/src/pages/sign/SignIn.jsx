// frontend/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import PageCard from '../../components/page/PageCard';
import PageHeader from '../../components/page/PageHeader';
import PageTitle from '../../components/page/PageTitle';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function SignIn() {
  const [user, setUser] = useState({
    id: '',
    password: '',
  });
  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Axios를 사용하여 로그인 요청을 백엔드에 보냅니다.
        const response = await axios.post('/sign-api/sign-in', user);

        // 로그인이 성공하면 서버에서 반환한 토큰을 저장합니다.
        const token = response.data.token;

        // 토큰을 로컬 스토리지에 저장합니다.
        localStorage.setItem('token', token);

        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 로그인 성공 후 필요한 작업을 수행하세요.
        alert('로그인 성공');
        console.log('로그인 성공');
        console.log(token);
        // history.push(`/`);
    } catch (error) {
        // 로그인 실패 시 오류 처리
        alert('로그인 실패')
        console.error('로그인 오류:', error);
    }
  };

  return (
    <PageCard>
        <PageHeader>
			<PageTitle value="로그인"/>
		</PageHeader>
        <div>
            <h2>로그인</h2>
            <form onSubmit={handleSubmit}>
                <div>
                <label>ID:</label>
                <input
                    type="text"
                    name="id"
                    value={user.id}
                    onChange={handleChange}
                />
                </div>
                <div>
                <label>비밀번호:</label>
                <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleChange}
                />
                </div>
                <div>
                <button type="submit">로그인</button>
                </div>
            </form>
        </div>
    </PageCard>
    
  );
}

export default SignIn;
