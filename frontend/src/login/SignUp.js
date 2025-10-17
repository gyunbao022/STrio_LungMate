import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';

function SignUp({ onNavigate }) {
    // 1. 각 입력 필드에 대한 상태(state)를 만듭니다.
    const [memberId, setMemberId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [memberName, setMemberName] = useState('');
    const [email, setEmail] = useState('');
    
    // 2. 에러 메시지를 위한 상태를 만듭니다.
    const [error, setError] = useState('');

    // '가입하기' 버튼 클릭 시 실행될 함수
    const handleSubmit = async (e) => {
        e.preventDefault(); // 페이지 새로고침 방지
        setError(''); // 이전 에러 메시지 초기화

        // 3. 클라이언트 측 유효성 검사
        if (!memberId || !password || !memberName || !email) {
            setError("모든 항목을 입력해주세요.");
            return;
        }
        if (password !== confirmPassword) {
            setError("비밀번호가 일치하지 않습니다.");
            return;
        }

        // 4. API 호출 및 서버 측 유효성 검사 (시뮬레이션)
        try {
            // 실제로는 여기서 백엔드 API에 fetch 요청을 보냅니다.
            // (예: const response = await fetch('/api/signup', { ... });)
            
            // 아이디 중복 체크 시뮬레이션
            if (memberId === 'existinguser') {
                throw new Error('이미 사용 중인 아이디입니다.');
            }

            // 모든 검증 통과 시
            alert('회원가입이 성공적으로 완료되었습니다!');
            onNavigate('login'); // 로그인 페이지로 이동

        } catch (err) {
            // API 호출 중 에러 발생 시 (e.g., 아이디 중복)
            setError(err.message);
        }
    };
    
    const inputStyles = "w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

    return (
        <AuthLayout title="회원가입">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">아이디</label>
                    <input type="text" value={memberId} onChange={(e) => setMemberId(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">비밀번호</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">비밀번호 확인</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">이름</label>
                    <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputStyles} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-300">이메일</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} />
                </div>

                {error && <p className="text-red-400 text-center text-sm pt-2">{error}</p>}
                
                <button type="submit" className="w-full bg-green-600 py-2 mt-4 rounded hover:bg-green-700 font-bold transition-colors duration-200">
                    가입하기
                </button>
            </form>
            <div className="text-center mt-6">
                <button onClick={() => onNavigate('login')} className="text-sm text-blue-400 hover:underline">
                    이미 계정이 있으신가요? 로그인
                </button>
            </div>
        </AuthLayout>
    );
}

export default SignUp;