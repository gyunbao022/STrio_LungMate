import React, { useState } from 'react';

// --- 각 페이지 컴포넌트들을 import 합니다. ---
// (실제 프로젝트에서는 이 파일들이 src/pages/ 폴더 안에 있어야 합니다.)
import Main from './pages/Main';
import Navbar from './components/Navbar'; // Navbar는 components 폴더로 분리하는 것이 좋습니다.
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindAccount from './pages/FindAccount';
import Notice from './pages/Notice';
import MemberManagement from './pages/MemberManagement';
import Diagnosis from './components/diagnosis/Diagnosis';

import Profile from './pages/Profile';
import DiagnosisList from './pages/DiagnosisList';
import UploadHistory from './pages/UploadHistory';

// --- 최상위 App 컴포넌트 ---
function App() {
    const [currentPage, setCurrentPage] = useState('main');
    const [currentUser, setCurrentUser] = useState(null);

    // 로그인 핸들러: 역할(role)에 따라 다른 페이지로 이동
    const handleLogin = (userData) => {
        setCurrentUser(userData);
        if (userData.role === 'ADMIN') {
            setCurrentPage('main'); // 관리자는 회원 관리 페이지로
        } else {
            setCurrentPage('main'); // 그 외 사용자는 메인 페이지로
        }
    };

    // 로그아웃 핸들러
    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentPage('main');
    };

    // 페이지 이동을 위한 핸들러 (Navbar, Login 등 자식 컴포넌트에서 사용)
    const handleNavigate = (page) => {
        setCurrentPage(page);
    };

    // 현재 상태에 따라 적절한 페이지를 렌더링하는 함수
    const renderPage = () => {
        // --- 1. 비로그인 상태에서 보여줄 페이지 ---
        if (!currentUser) {
            switch (currentPage) {
                case 'login':
                    return <Login onLogin={handleLogin} onNavigate={handleNavigate} />;
                case 'signup':
                    return <SignUp onNavigate={handleNavigate} />;
                case 'find-account':
                    return <FindAccount onNavigate={handleNavigate} />;
                case 'notice':
                    return <Notice currentUser={currentUser} />;
                case 'main':
                default:
                    return <Main />;
            }
        }

        // --- 2. 로그인 상태에서 보여줄 페이지 ---
        switch (currentPage) {
            case 'notice':
                return <Notice currentUser={currentUser} />;
            case 'profile':
                return <Profile currentUser={currentUser} setCurrentUser={setCurrentUser} />;
            case 'members':
                return currentUser.role === 'ADMIN' ? <MemberManagement /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'diagnosis': // 진단 페이지는 예시로 모든 로그인 사용자가 접근 가능하도록 설정
                return <Diagnosis currentUser={currentUser} />;
            
            // --- 아래는 Navbar 메뉴에 따라 추가될 페이지들의 case 입니다. ---
            case 'diagnosis-list':
                return currentUser.role === 'DOCTOR' ? <DiagnosisList /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'xray-upload':
                 return currentUser.role === 'XRAY_OPERATOR' ? <Diagnosis /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'upload-history':
                 return currentUser.role === 'XRAY_OPERATOR' ? <UploadHistory /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;

            case 'main':
            default:
                return <Main currentUser={currentUser} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Navbar 
                currentUser={currentUser} 
                onLogout={handleLogout}
                // Navbar에서는 페이지 이동만 필요하므로 handleNavigate를 전달하는 것이 더 명확합니다.
                onNavigate={handleNavigate} 
            />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 pt-24"> {/* Navbar가 fixed일 경우를 대비해 pt-24 추가 */}
                {renderPage()}
            </main>
        </div>
    );
}

export default App;