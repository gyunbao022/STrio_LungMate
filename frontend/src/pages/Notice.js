import React, { useState,useEffect } from 'react';
import instance from "../token/interceptors";

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

function Notice({ currentUser }) {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [notices, setNotices] = useState(sampleNotices);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState(null);

    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    const getMemberList = async () => {
        console.log("meber list =>");
        await instance
        .get(`/notice/list/1`)
        .then((response) => {
            //console.log(response.data);
            setNotices(response.data.noticeList);
        })
        .catch((error) => {
            console.log("notice list:", error.message);
        });
    };

    useEffect(() => {

        //setMembers(dummyMembers);
        getMemberList();
        setLoading(false);
    }, []);    

    const handleCreate = () => {
        setEditedNotice({ noticeTitle: '', noticeContent: '' });
        setIsEditing(true);
        setSelectedNotice(null);
    };

    const handleEdit = (notice) => {
        setEditedNotice({ ...notice });
        setIsEditing(true);
        setSelectedNotice(null);
    };

    const handleDelete = (noticeNo) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            const updatedNotices = notices.filter(n => n.noticeNo !== noticeNo);
            setNotices(updatedNotices);
            alert("공지사항이 삭제되었습니다.");
            setSelectedNotice(null);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        const isNew = !editedNotice.noticeNo;

        if (isNew) {
            const newNotice = {
                ...editedNotice,
                noticeNo: notices.length > 0 ? Math.max(...notices.map(n => n.noticeNo)) + 1 : 1,
                createDate: new Date(),
            };
            setNotices([newNotice, ...notices]);
            alert('공지사항이 성공적으로 작성되었습니다.');
        } else {
            const updatedNotices = notices.map(n => 
                n.noticeNo === editedNotice.noticeNo ? { ...editedNotice, createDate: n.createDate } : n
            );
            setNotices(updatedNotices);
            alert('공지사항이 성공적으로 수정되었습니다.');
        }

        setIsEditing(false);
        setEditedNotice(null);
        setSelectedNotice(null);
    };

    if (loading) {
        return <div className="text-center">로딩 중...</div>;
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">공지사항</h1>
                {isAdmin && !isEditing && (
                    <button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        글쓰기
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSave} className="bg-gray-800/50 p-6 sm:p-8 rounded-lg">
                    <input 
                        type="text" 
                        value={editedNotice.noticeTitle}
                        onChange={(e) => setEditedNotice({ ...editedNotice, noticeTitle: e.target.value })}
                        placeholder="제목" 
                        className="w-full bg-gray-700 text-white p-2 rounded mb-4" 
                        required 
                    />
                    <textarea 
                        value={editedNotice.noticeContent}
                        onChange={(e) => setEditedNotice({ ...editedNotice, noticeContent: e.target.value })}
                        placeholder="내용" 
                        className="w-full bg-gray-700 text-white p-2 rounded mb-4 h-48" 
                        required 
                    />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            취소
                        </button>
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            저장
                        </button>
                    </div>
                </form>
            ) : selectedNotice ? (
                <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">{selectedNotice.noticeTitle}</h2>
                    <p className="text-gray-400 text-sm mb-6 border-b border-gray-700 pb-4">
                        작성일: {new Date(selectedNotice.createDate).toLocaleDateString()}
                    </p>
                    <div className="text-gray-300 whitespace-pre-wrap">
                        {selectedNotice.noticeContent}
                    </div>
                    <div className="flex justify-between items-center mt-8">
                        <button onClick={() => setSelectedNotice(null)} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            목록으로
                        </button>
                        {isAdmin && (
                            <div className="flex gap-4">
                                <button onClick={() => handleEdit(selectedNotice)} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                    수정
                                </button>
                                <button onClick={() => handleDelete(selectedNotice.noticeNo)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm text-left text-gray-300">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 w-1/6">번호</th>
                                <th scope="col" className="px-6 py-3 w-3/6">제목</th>
                                <th scope="col" className="px-6 py-3 w-2/6">작성일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notices.map(notice => (
                                <tr key={notice.noticeNo} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4">{notice.noticeId}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedNotice(notice)} className="font-medium hover:underline text-left">
                                            {notice.title}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">{new Date(notice.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default Notice;