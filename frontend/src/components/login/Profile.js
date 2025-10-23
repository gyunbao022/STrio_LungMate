import React, { useState, useEffect } from 'react';
import AuthLayout from '../AuthLayout'; // 공통 레이아웃 사용
import instance from "../../token/interceptors";

// App.js로부터 currentUser (로그인 정보)와 setCurrentUser (정보 업데이트 함수)를 받습니다.
function Profile({ currentUser, setCurrentUser }) {
    // 사용자 정보 상태 (수정 가능한 필드는 별도로 관리)
    const [memberName, setMemberName] = useState(currentUser?.memberName || '');
    const [email, setEmail] = useState(currentUser?.email || '');

    // 비밀번호 변경 관련 상태
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    // 에러 및 성공 메시지 상태
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // currentUser 정보가 변경될 때마다 입력 필드도 업데이트 (로그아웃 후 재로그인 등)
    useEffect(() => {
        if (currentUser) {
            setMemberName(currentUser.memberName || '');
            setEmail(currentUser.email || '');
            // 비밀번호 관련 필드는 보안상 비워둡니다.
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setError('');
            //setSuccessMessage('');
        }
    }, [currentUser]);
   

    // 일반 정보(이름, 이메일) 수정 핸들러
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!memberName || !email) {
            setError("이름과 이메일을 모두 입력해주세요.");
            return;
        }
        // TODO: 백엔드 API 호출로 사용자 정보 업데이트
        /*try {
            // 성공 시 currentUser 업데이트 및 성공 메시지 표시
            setCurrentUser({ ...currentUser, memberName, email });
            setSuccessMessage("회원 정보가 성공적으로 업데이트되었습니다.");
        } catch (err) {
            setError(err.message);
        }*/
        const userData = {
            userId: currentUser.memberId,
            userName: memberName,
            email: email,
        };  
        
        await instance
        .put(`/member/update`, userData)
        .then((response) => {
            console.log(response.data);
            //onNavigate('login'); // 로그인 페이지로 이동
            localStorage.setItem("userName", memberName);
            localStorage.setItem("email", email);            
            setCurrentUser({ ...currentUser, memberName, email });
            setSuccessMessage("회원 정보가 성공적으로 업데이트되었습니다.");            
        })
        .catch((error) => {
            console.log(" member update 오류:", error.message);
            setError("정보 수정시 에러가 발생하였습니다.");
        });        
    };


    // 비밀번호 변경 핸들러
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            setError("모든 비밀번호 필드를 입력해주세요.");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        if (newPassword.length < 4) { // 최소 길이 설정
            setError("새 비밀번호는 4자 이상이어야 합니다.");
            return;
        }
        if (currentPassword === newPassword) {
            setError("현재 비밀번호와 새 비밀번호가 동일합니다.");
            return;
        }

        // TODO: 백엔드 API 호출로 비밀번호 변경
        try {

            const userData = {
                userId: currentUser.memberId,
                passwd: currentPassword,
                newPasswd: newPassword,
            };              
            await instance
            .put(`/member/updatePasswd`, userData)
            .then((response) => {
                console.log(response.data);
                // 성공 시 비밀번호 필드 초기화 및 성공 메시지 표시
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");         
            })
            .catch((error) => {
                console.log(" member update 오류:", error.message);
                setError("비밀번호 변경시 에러가 발생하였습니다.");
            });              



        } catch (err) {
            setError(err.message);
        }
    };

    // 로그인된 사용자가 없으면 접근 불가
    if (!currentUser) {
        return <AuthLayout title="회원 정보">
            <p className="text-center text-red-400">로그인이 필요합니다.</p>
        </AuthLayout>;
    }

    const inputStyles = "w-full p-2 bg-gray-700 rounded mt-1 border border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";
    const buttonStyles = "w-full bg-blue-600 py-2 rounded hover:bg-blue-700 font-bold transition-colors duration-200";

    return (
        <AuthLayout title="회원 정보">
            <div className="space-y-8">

                {/* --- 1. 기본 정보 --- */}
                <div className="bg-gray-700/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">내 정보</h3>
                    <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">아이디</label>
                            <input type="text" value={currentUser.memberId} className={`${inputStyles} cursor-not-allowed text-gray-400`} disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">이름</label>
                            <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} className={inputStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">이메일</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">역할(Role)</label>
                            <input type="text" value={currentUser.role} className={`${inputStyles} cursor-not-allowed text-gray-400`} disabled />
                        </div>
                        <button type="submit" className={buttonStyles}>
                            정보 수정
                        </button>
                    </form>
                </div>

                {error && <p className="text-red-400 text-center text-sm mb-4">{error}</p>}
                {successMessage && <p className="text-green-400 text-center text-sm mb-4">{successMessage}</p>}
                
                {/* --- 2. 비밀번호 변경 --- */}
                <div className="bg-gray-700/50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4 border-b border-gray-600 pb-2">비밀번호 변경</h3>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300">현재 비밀번호</label>
                            <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">새 비밀번호</label>
                            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputStyles} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">새 비밀번호 확인</label>
                            <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className={inputStyles} />
                        </div>
                        <button type="submit" className={buttonStyles}>
                            비밀번호 변경
                        </button>
                    </form>
                </div>
            </div>
        </AuthLayout>
    );
}

export default Profile;