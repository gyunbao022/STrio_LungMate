import React from 'react';

function Navbar({ currentUser, onNavigate, onLogout }) {
    
    const getMenuItems = (role) => {
        // 비로그인 사용자를 위한 메뉴
        const commonMenus = [
            { name: '메인', page: 'main' },
        ];

        // 로그인한 사용자일 경우
        if (currentUser) {
            // 로그인 사용자 공통 메뉴 (회원정보는 별도 위치로 이동)
            const loggedInUserMenus = [
                { name: '공지사항', page: 'notice' }
            ];

            switch (role) {
                case 'DOCTOR':
                    return [ ...loggedInUserMenus, { name: '판독 리스트', page: 'diagnosis-list' }];
                case 'XRAY_OPERATOR':
                    return [ ...loggedInUserMenus, { name: 'X-Ray 업로드', page: 'diagnosis' },
                                                   { name: '업로드 내역', page: 'upload-history' }];
                case 'ADMIN':
                    return [
                        { name: '메인', page: 'main' },
                        { name: '공지사항', page: 'notice' },
                        { name: 'X-Ray 업로드', page: 'diagnosis' },
                        { name: '업로드 내역', page: 'upload-history' },
                        { name: '판독 리스트', page: 'diagnosis-list' },
                        { name: '회원 관리', page: 'members' }
                    ];
                default: // 일반 사용자
                    return loggedInUserMenus;
            }
        }
        
        // 로그인하지 않은 사용자는 공통 메뉴만 보입니다.
        return commonMenus;
    };

    const menuItems = getMenuItems(currentUser?.role);

    return (
        <nav className="w-full bg-gray-800/50 glassmorphism shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0 text-white font-bold text-xl cursor-pointer" onClick={() => onNavigate('main')}>
                        <i className="fas fa-stethoscope mr-2"></i> LungMate
                    </div>

                    <div className="hidden md:flex items-center space-x-4">
                        {menuItems.map(item => (
                            <button 
                                key={item.page} 
                                onClick={() => onNavigate(item.page)} 
                                className="text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center">
                        {currentUser ? (
                            // 로그인 했을 때 UI
                            <>
                                <span className="text-gray-400 text-sm mr-2">{currentUser.memberName} ({currentUser.role})</span>
                                <button 
                                    onClick={() => onNavigate('profile')} 
                                    className="text-gray-300 hover:bg-gray-700/50 hover:text-white px-3 py-2 rounded-md text-sm font-medium mr-2"
                                >
                                    회원정보
                                </button>
                                <button onClick={onLogout} className="bg-red-600/80 hover:bg-red-700/80 text-white px-3 py-2 rounded-md text-sm font-medium">
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            // 로그인 안 했을 때 UI
                            <div className="flex items-center space-x-2">
                                <button onClick={() => onNavigate('login')} className="bg-blue-600/80 hover:bg-blue-700/80 text-white px-3 py-2 rounded-md text-sm font-medium">
                                    로그인
                                </button>
                                <button onClick={() => onNavigate('signup')} className="bg-green-600/80 hover:bg-green-700/80 text-white px-3 py-2 rounded-md text-sm font-medium">
                                    회원가입
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
