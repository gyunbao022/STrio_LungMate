import React, { useState } from 'react';
import AuthLayout from '../AuthLayout'; // 1. AuthLayout을 import 합니다.
import instance from "../../token/interceptors";
import { useAuth } from "../layout/AuthProvider";

function Login({ onLogin, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const [inputs, setInputs] = useState({
        userId: "",
        passwd: "",
    });
    
    const handleValueChange = (e) => {
        setInputs((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };
  
    const { userId, passwd } = inputs;
    const { login } = useAuth();    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (userId === "admin" && passwd === "1234") {
            onLogin({ memberName: '관리자', role: 'ADMIN' });
        } else if (userId === "test1" && passwd === "1234") {
            onLogin({ memberName: 'xray유저', role: 'XRAY_OPERATOR' });
        } else if (userId === "test2" && passwd === "1234") {
            onLogin({ memberName: '의사유저', role: 'DOCTOR' });
        } else {
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
    };

    //2025.10.22 jaemin 실제 로그인 처리 코드
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await instance
                .post(`/login`, inputs)
                .then((response) => {
                console.log(response);

                //응답 헤더에서 토큰 추출
                const accessToken = response.headers["authorization"]; //대소문자 주의
                const refreshToken = response.headers["authorization-refresh"];

                console.log("accessToken => ", accessToken);
                console.log("refreshToken => ", refreshToken);

                localStorage.setItem("Authorization", accessToken);
                localStorage.setItem("Authorization-refresh", refreshToken);

                localStorage.setItem("userId", response.data.userId);
                localStorage.setItem("userName", response.data.userName);
                localStorage.setItem("roleCd", response.data.roleCd);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("isLogin", true);
                return response;
                })
                .then((response) => {
                    login(); // Context 상태변경
                    setInputs({ userId: "", passwd: "" });
                    //window.location.replace("/");
                    const userData = {
                        memberId: response.data.userId,
                        memberName: response.data.userName,
                        role: response.data.roleCd,
                        email: response.data.email,
                    };                    
                    onLogin(userData);
                })
                .catch((error) => {
                      if (error.response && error.response.status === 401) {
                          setError("아이디 또는 비밀번호가 일치하지 않습니다.");
                      } else {
                          setError("로그인 중 오류가 발생했습니다.");
                      }
                });
        } catch (err) {
            alert("로그인 실패2 : 아이디 또는 비밀번호 확인");
        }

    };    

    
    return (
        // 2. AuthLayout으로 전체를 감싸고, title prop을 전달합니다.
        <AuthLayout title="로그인">
            {/* 이제부터는 로그인 페이지의 고유한 내용만 남깁니다. */}
            <form onSubmit={onSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">아이디</label>
                    <input
                        id="username"
                        type="text"
                        name="userId"
                        className="w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={userId}
                        onChange={handleValueChange}
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-medium text-gray-300">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        name="passwd"
                        className="w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={passwd}
                        onChange={handleValueChange}
                    />
                </div>
                {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                
                <button type="submit" className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 font-bold transition-colors duration-200">
                    로그인
                </button>
            </form>

            <div className="text-center mt-6">
                <button 
                    onClick={() => onNavigate('signup')} 
                    className="text-sm text-blue-400 hover:underline"
                >
                    회원가입
                </button>
                <span className="mx-2 text-gray-500">|</span>
                <button 
                    onClick={() => onNavigate('find-account')} 
                    className="text-sm text-blue-400 hover:underline"
                >
                    아이디/비밀번호 찾기
                </button>
            </div>
        </AuthLayout>
    );
}

export default Login;