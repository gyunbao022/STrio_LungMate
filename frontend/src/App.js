import React, { useState } from 'react';

// --- 각 페이지 컴포넌트들을 import 합니다. ---
import Main1 from './pages/Main1';
import Main2 from './pages/Main2';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import FindAccount from './pages/FindAccount';
import Notice from './pages/Notice';
import MemberManagement from './pages/MemberManagement';
import XRayUpload from './pages/XRayUpload';
import Profile from './pages/Profile';
import DiagnosisList from './pages/DiagnosisList';
import UploadHistory from './pages/UploadHistory';
import Diagnosis from './components/diagnosis/Diagnosis';

// --- 최상위 App 컴포넌트 ---
function App() {
    const [currentPage, setCurrentPage] = useState('main');
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedXrayId, setSelectedXrayId] = useState(null);


    const handleLogin = (userData) => {
        setCurrentUser(userData);
        setCurrentPage('main');
    };

    const handleLogout = () => {
        setCurrentUser(null);
        setCurrentPage('main');
    };

    const handleNavigate = (page, payload) => {
        setCurrentPage(page);
        if (payload && payload.xrayId) {
            setSelectedXrayId(payload.xrayId);
        }
    };

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
                case 'main':
                default:
                    return <Main1 />;
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
            case 'diagnosis':
                return <XRayUpload currentUser={currentUser} />;
            case 'view-diagnosis':
                return <Diagnosis xrayId={selectedXrayId} currentUser={currentUser} onNavigate={handleNavigate} />;
            case 'diagnosis-list':
                return currentUser.role === 'DOCTOR' || currentUser.role === 'ADMIN' ? <DiagnosisList onNavigate={handleNavigate} /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'xray-upload':
                 return currentUser.role === 'XRAY_OPERATOR' ? <XRayUpload currentUser={currentUser} /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'upload-history':
                 return currentUser.role === 'XRAY_OPERATOR' || currentUser.role === 'ADMIN' ? <UploadHistory /> : <h2 className="text-center">접근 권한이 없습니다.</h2>;
            case 'main':
            default:
                return <Main2 currentUser={currentUser} onNavigate={handleNavigate} />;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen font-sans">
            <Navbar 
                currentUser={currentUser} 
                onLogout={handleLogout}
                onNavigate={handleNavigate} 
            />
            <main className="container mx-auto p-4 sm:p-6 md:p-8 pt-24">
                {renderPage()}
            </main>
        </div>
    );
}

export default App;
