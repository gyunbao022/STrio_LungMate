import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout'; // 1. AuthLayout을 import 합니다.

function Login({ onLogin, onNavigate }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

 if (username === "admin" && password === "1234") {
        onLogin({ memberName: '관리자', role: 'ADMIN' });
    } else if (username === "test1" && password === "1234") {
        onLogin({ memberName: 'xray유저', role: 'XRAY_OPERATOR' });
    } else if (username === "test2" && password === "1234") {
        onLogin({ memberName: '의사유저', role: 'DOCTOR' });
    } else {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
    }
};

    return (
        // 2. AuthLayout으로 전체를 감싸고, title prop을 전달합니다.
        <AuthLayout title="로그인">
            {/* 이제부터는 로그인 페이지의 고유한 내용만 남깁니다. */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">아이디</label>
                    <input
                        id="username"
                        type="text"
                        className="w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password"  className="block text-sm font-medium text-gray-300">비밀번호</label>
                    <input
                        id="password"
                        type="password"
                        className="w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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