import React from 'react';

// App.js로부터 currentUser, onNavigate, onLogout 함수를 props로 받습니다.
// setCurrentPage 대신 onNavigate를 사용합니다.
function Navbar({ currentUser, onNavigate, onLogout }) {
    
    // 역할(role)에 따라 다른 메뉴 아이템을 반환하는 함수
    const getMenuItems = (role) => {
        const commonMenus = [
            { name: '메인', page: 'main' },
            { name: '공지사항', page: 'notice' }
        ];

        // 로그인한 사용자일 경우에만 역할별 메뉴를 추가합니다.
        if (currentUser) {
            const userSpecificMenus = [
                { name: '회원정보', page: 'profile' },
            ];

            switch (role) {
                case 'DOCTOR':
                    return [ ...commonMenus, ...userSpecificMenus, { name: '판독 대기 리스트', page: 'diagnosis-list' }];
                case 'XRAY_OPERATOR':
                    // 'X-Ray 업로드' 메뉴를 누르면 'diagnosis' 페이지로 연결되도록 수정
                    return [ ...commonMenus, ...userSpecificMenus, { name: 'X-Ray 업로드', page: 'diagnosis' }, { name: '업로드 내역', page: 'upload-history' }];
                case 'ADMIN':
                    return [ ...commonMenus, ...userSpecificMenus, { name: '회원 관리', page: 'members' }, { name: '공지사항 관리', page: 'notice-management' }];
                default:
                    return [...commonMenus, ...userSpecificMenus];
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
                    {/* 로고 클릭 시 메인 페이지로 이동 */}
                    <div className="flex-shrink-0 text-white font-bold text-xl cursor-pointer" onClick={() => onNavigate('main')}>
                        <i className="fas fa-stethoscope mr-2"></i> LungMate
                    </div>

                    {/* 메뉴 아이템 목록 */}
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

                    {/* 로그인/로그아웃 및 사용자 정보 표시 영역 */}
                    <div className="flex items-center">
                        {currentUser ? (
                            // 로그인 했을 때 UI
                            <>
                                <span className="text-gray-400 text-sm mr-4">{currentUser.memberName} ({currentUser.role})</span>
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

// 다른 파일에서 이 컴포넌트를 사용할 수 있도록 export 합니다.
export default Navbar;