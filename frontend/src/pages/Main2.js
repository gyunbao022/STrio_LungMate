import React, { useState, useEffect } from 'react';
import axios from 'axios';

// 요청하신 예시 공지사항 데이터입니다.
const sampleNotices = [
    {
        noticeNo: 3,
        noticeTitle: '개인정보처리방침 개정 안내',
        noticeContent: `안녕하세요, STrio입니다. \n\nSTrio 서비스의 개인정보처리방침이 2025년 11월 1일자로 개정될 예정입니다. \n\n주요 개정 내용은 다음과 같습니다. \n- 개인정보 수집 항목 구체화 \n- 제3자 정보 제공 관련 내용 보강 \n\n자세한 내용은 공지사항의 첨부파일을 확인해주시기 바랍니다. \n\n감사합니다.`,
        createDate: new Date('2025-10-18T09:00:00'),
    },
    {
        noticeNo: 2,
        noticeTitle: '서버 점검 안내 (10/20 02:00 ~ 04:00)',
        noticeContent: `안녕하세요, STrio입니다. \n\n보다 안정적인 서비스 제공을 위해 아래와 같이 서버 점검을 실시할 예정입니다. \n\n- 점검 일시: 2025년 10월 20일(월) 02:00 ~ 04:00 (2시간) \n- 점검 내용: 서비스 안정화 및 성능 개선 작업 \n\n점검 시간 동안 서비스 이용이 일시적으로 중단될 수 있으니 양해 부탁드립니다. \n\n감사합니다.`,
        createDate: new Date('2025-10-17T14:30:00'),
    },
    {
        noticeNo: 1,
        noticeTitle: 'STrio 서비스 정식 오픈 안내',
        noticeContent: `안녕하세요, STrio입니다. \n\n오랜 기간의 준비 끝에 STrio가 정식으로 서비스를 오픈합니다. \n\nSTrio는 최신 AI 기술을 활용하여 의료 영상 분석을 돕는 서비스입니다. \n\n많은 관심과 이용 부탁드립니다. \n\n감사합니다.`,
        createDate: new Date('2025-10-16T10:00:00'),
    },
];


// App.js에서 onNavigate 함수를 props로 받아야 합니다.
function Main2({ currentUser, onNavigate }) {
    const [notices, setNotices] = useState(sampleNotices.slice(0, 5)); //useState([]);
    const [loading, setLoading] = useState(false); //현재는 예시 데이터를 사용하고, 로딩 상태는 false로 시작합니다.

    // useEffect(() => {
    //     const fetchNotices = async () => {
    //         setLoading(true);
    //         try {
    //             const response = await axios.get('/board/list/1');
    //             setNotices((response.data.boardList || []).slice(0, 5));
    //         } catch (error) {
    //             console.error("공지사항 로딩에 실패했습니다:", error);
    //             setNotices([]);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchNotices();
    // }, []);

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
                                        <li key={notice.noticeNo} className="py-3 flex justify-between items-center">
                                            <button onClick={() => onNavigate('notice')} className="text-gray-300 hover:text-white text-left truncate" title={notice.noticeTitle}>
                                                {notice.noticeTitle}
                                            </button>
                                            <span className="text-gray-500 text-sm flex-shrink-0 ml-4">
                                                {new Date(notice.createDate).toLocaleDateString()}
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
