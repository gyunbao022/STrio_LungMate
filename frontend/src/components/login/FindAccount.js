import React, { useState } from 'react';
import AuthLayout from '../AuthLayout'; // 1. AuthLayout을 import 합니다.

function FindAccount({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('id'); // 'id' or 'pw'

    // 아이디 찾기 관련 state 및 핸들러
    const handleFindId = async (e) => {
        e.preventDefault();
        // TODO: 아이디 찾기 API 호출 로직
        alert("아이디 찾기 API가 호출되었습니다.");
    };

    // 비밀번호 찾기 관련 state 및 핸들러
    const handleFindPassword = async (e) => {
        e.preventDefault();
        // TODO: 비밀번호 찾기 API 호출 로직
        alert("비밀번호 찾기 API가 호출되었습니다.");
    };

    const inputStyles = "w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";
    const buttonStyles = "w-full bg-blue-600 py-2 rounded hover:bg-blue-700 font-bold transition-colors duration-200";

    return (
        // 2. AuthLayout으로 전체를 감싸고, title prop을 전달합니다.
        <AuthLayout title="계정 찾기">
            {/* FindAccount 페이지의 고유한 내용물 시작 */}
            <div className="flex border-b border-gray-600 mb-6">
                <button 
                    onClick={() => setActiveTab('id')} 
                    className={`flex-1 py-2 text-center transition-colors duration-200 ${activeTab === 'id' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    아이디 찾기
                </button>
                <button 
                    onClick={() => setActiveTab('pw')} 
                    className={`flex-1 py-2 text-center transition-colors duration-200 ${activeTab === 'pw' ? 'text-white border-b-2 border-blue-500' : 'text-gray-400 hover:text-gray-200'}`}
                >
                    비밀번호 찾기
                </button>
            </div>

            {activeTab === 'id' ? (
                <form onSubmit={handleFindId} className="space-y-6">
                    {/* 3. AuthLayout이 제목을 제공하므로 내부 h3 태그는 제거합니다. */}
                    <input placeholder="이름" className={inputStyles}/>
                    <input type="email" placeholder="이메일" className={inputStyles}/>
                    <button type="submit" className={buttonStyles}>아이디 찾기</button>
                </form>
            ) : (
                <form onSubmit={handleFindPassword} className="space-y-6">
                    <input placeholder="아이디" className={inputStyles}/>
                    <input type="email" placeholder="이메일" className={inputStyles}/>
                    <button type="submit" className={buttonStyles}>비밀번호 재설정 링크 보내기</button>
                </form>
            )}

            <div className="text-center mt-6">
                <button 
                    onClick={() => onNavigate('login')} 
                    className="text-sm text-blue-400 hover:underline"
                >
                    로그인 페이지로 돌아가기
                </button>
            </div>
             {/* 고유한 내용물 끝 */}
        </AuthLayout>
    );
}

export default FindAccount;