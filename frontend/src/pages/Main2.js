import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Main2({ currentUser, onNavigate }) {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNotices = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8090/notice/list/1');
                setNotices((response.data.noticeList || []).slice(0, 5));
            } catch (error) {
                console.error("공지사항 로딩에 실패했습니다:", error);
                setNotices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchNotices();
    }, []);

    return (
        <div className="text-center">
            {currentUser ? (
                <h2 className="text-2xl font-bold mb-6">'{currentUser.memberName}'님, 환영합니다.</h2>
            ) : (
                <h2 className="text-2xl font-bold mb-6">LungMate에 오신 것을 환영합니다.</h2>
            )}
            
            <div className="max-w-6xl mx-auto">
                
                {/* 이미지와 공지사항을 위한 플렉스 컨테이너 */}
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    
                    {/* 왼쪽: 이미지 */}
                    <div className="md:w-1/2">
                        <img 
                            src={require('../images/image1.jpg')} 
                            alt="Doctor examining X-ray" 
                            className="rounded-lg shadow-xl w-full h-full object-cover"
                        />
                    </div>

                    {/* 오른쪽: 공지사항 미리보기 */}
                    <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-inner flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold text-blue-300">최신 공지사항</h3>
                            <button onClick={() => onNavigate('notice')} className="text-sm text-blue-400 hover:underline">더보기</button>
                        </div>
                        <div className="flex-grow">
                            {loading ? (
                                <p className="text-gray-400">공지사항을 불러오는 중입니다...</p>
                            ) : notices.length > 0 ? (
                                <ul className="text-left divide-y divide-gray-700">
                                    {notices.map(notice => (
                                        <li key={notice.noticeId}
                                         className="py-3 flex justify-between items-center">
                                            <button onClick={() => onNavigate('notice', { notice: notice })}
                                             className="text-gray-300 hover:text-white text-left truncate"
                                              title={notice.title}>
                                                {notice.title}
                                            </button>
                                            <span className="text-gray-500 text-sm flex-shrink-0 ml-4">
                                                {new Date(notice.createdAt).toLocaleDateString()}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">등록된 공지사항이 없습니다.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* About LungMate 섹션 */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">About LungMate</h3>
                    <p className="text-lg text-gray-300">
                        LungMate는 흉부 X-ray 이미지를 통해 폐렴을 진단하는 데 도움을 주는 AI 기반 서비스입니다. 
                        <br />
                        이미지를 업로드하고 몇 초 안에 예비 진단을 받아보세요.
                    </p>
                </div>

            </div>

            <p className="mt-8 text-lg text-gray-400">메뉴를 선택하여 진단을 시작하세요.</p>
        </div>
    );
}

export default Main2;