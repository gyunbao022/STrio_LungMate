import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8090";

function Notice({ currentUser }) {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    // 1. fetchNotices (useCallback 유지 - 올바른 코드)
    const fetchNotices = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/notice/list/1`);
            const sortedNotices = response.data.noticeList.sort((a, b) => b.noticeId - a.noticeId);
            setNotices(sortedNotices);
        } catch (error) {
            console.error("공지사항을 불러오는 중 오류가 발생했습니다:", error);
            alert("공지사항을 불러오는 데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    }, []); 

    // 2. useEffect (useCallback 의존성 유지)
    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]); 

    const isAdmin = currentUser && currentUser.role === 'A'; 

    // 4. handleCreate, handleEdit (유지)
    const handleCreate = () => {
        setEditedNotice({ title: '', cont: '' });
        setIsEditing(true);
        setSelectedNotice(null);
    };

    const handleEdit = (notice) => {
        setEditedNotice({ ...notice });
        setIsEditing(true);
        setSelectedNotice(null);
    };

    // 5. handleDelete (유지 - 올바른 코드)
    const handleDelete = async (noticeId) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            setIsSaving(true); 
            try {
                await axios.delete(`${API_BASE_URL}/notice/delete/${noticeId}`);
                alert("공지사항이 삭제되었습니다.");
                setSelectedNotice(null);
                await fetchNotices(); // 목록 새로고침
            } catch (error) {
                console.error("공지사항 삭제 중 오류:", error);
                alert("삭제 중 오류가 발생했습니다.");
            } finally {
                setIsSaving(false); 
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true); 

        const isNew = !editedNotice.noticeId;
        const formData = new FormData();
        formData.append('title', editedNotice.title);
        formData.append('cont', editedNotice.cont);

        // [수정 2] DB의 USER_ID (NOT NULL) 컬럼을 채우기 위해 userId 전송
        const userId = currentUser ? currentUser.memberName : null;

        if (!userId) {
            console.error("userId(memberName)를 찾을 수 없습니다! currentUser 객체:", currentUser);
            alert("로그인 정보(ID)가 없어 저장할 수 없습니다.");
            setIsSaving(false);
            return;
        }
        
        formData.append('userId', userId);

        try {
            if (isNew) {
                await axios.post(`${API_BASE_URL}/notice/write`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('공지사항이 성공적으로 작성되었습니다.');
            } else {
                formData.append('noticeId', editedNotice.noticeId);
                await axios.put(`${API_BASE_URL}/notice/update`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert('공지사항이 성공적으로 수정되었습니다.');
            }

            setIsEditing(false);
            setEditedNotice(null);
            setSelectedNotice(null);
            await fetchNotices(); // 목록 새로고침

        } catch (error) {
            console.error("공지사항 저장 중 오류:", error);
            if (error.response && error.response.status === 403) {
                alert("저장 권한이 없습니다. (403 Forbidden)");
            } else if (error.response && error.response.status === 500) {
                 alert("서버 내부 오류 (500).\n백엔드 콘솔 로그를 확인하세요.");
            } else {
                alert("저장 중 오류가 발생했습니다.");
            }
        } finally {
            setIsSaving(false); 
        }
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
                        value={editedNotice.title}
                        onChange={(e) => setEditedNotice({ ...editedNotice, title: e.target.value })}
                        placeholder="제목" 
                        className="w-full bg-gray-700 text-white p-2 rounded mb-4" 
                        required 
                        disabled={isSaving} 
                    />
                    <textarea 
                        value={editedNotice.cont}
                        onChange={(e) => setEditedNotice({ ...editedNotice, cont: e.target.value })}
                        placeholder="내용" 
                        className="w-full bg-gray-700 text-white p-2 rounded mb-4 h-48" 
                        required 
                        disabled={isSaving} 
                    />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setIsEditing(false)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" 
                            disabled={isSaving}> 
                            취소
                        </button>
                        <button type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50" 
                            disabled={isSaving}>
                            {isSaving ? '저장 중...' : '저장'} 
                        </button>
                    </div>
                </form>
            ) : selectedNotice ? (
                <div className="bg-gray-800/50 p-6 sm:p-8 rounded-lg">
                    <h2 className="text-2xl font-bold mb-2">{selectedNotice.title}</h2>
                    <p className="text-gray-400 text-sm mb-6 border-b border-gray-700 pb-4">
                        작성일: {new Date(selectedNotice.createdAt).toLocaleDateString()}
                    </p>
                    <div className="text-gray-300 whitespace-pre-wrap">
                        {selectedNotice.cont}
                    </div>
                    <div className="flex justify-between items-center mt-8">
                        <button onClick={() => setSelectedNotice(null)}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">
                            목록으로
                        </button>
                        {isAdmin && (
                            <div className="flex gap-4">
                                <button onClick={() => handleEdit(selectedNotice)}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                    수정
                                </button>
                                <button onClick={() => handleDelete(selectedNotice.noticeId)}
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                                    disabled={isSaving}> 
                                    {isSaving ? '삭제 중...' : '삭제'}
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
                                <tr key={notice.noticeId} className="border-b border-gray-700 hover:bg-gray-700/50">
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