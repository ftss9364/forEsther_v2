// frontend/src/components/SignUp.js
import React, { useState } from 'react';
import axios from 'axios';
import PageCard from '../../components/page/PageCard';
import PageHeader from '../../components/page/PageHeader';
import PageTitle from '../../components/page/PageTitle';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

function SignUp() {
	const [user, setUser] = useState({
		id: '',
		name: '',
		password: '',
		role: 'admin',
	    });
	const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
	e.preventDefault();
	
	try {
		const response = await axios.post('/sign-api/sign-up', user);
		alert("회원가입 완료");
		history.push(`/`);
		console.log('회원가입 성공:', response.data);
	} catch (error) {
		console.error('회원가입 오류:', error);
	}
    };
  

  return (
	<PageCard>
		<PageHeader>
			<PageTitle value="회원 가입"/>
		</PageHeader>
		<div>
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
					<label>이름:</label>
					<input
						type="text"
						name="name"
						value={user.name}
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
					<button type="submit">가입하기</button>
				</div>
			</form>
		</div>
	</PageCard>
    
  );
}

export default SignUp;
