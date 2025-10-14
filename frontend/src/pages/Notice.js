import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notice({ currentUser }) {
    const [selectedNotice, setSelectedNotice] = useState(null);
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedNotice, setEditedNotice] = useState(null);

    const isAdmin = currentUser && currentUser.role === 'ADMIN';

    const fetchNotices = async () => {
        setLoading(true);
        try {
            // API 엔드포인트에서 데이터를 가져옵니다. (페이지 1로 고정)
            const response = await axios.get('/board/list/1');
            // pv 객체 안에 boardList가 포함되어 있으므로, 해당 리스트를 사용합니다.
            setNotices(response.data.boardList || []);
        } catch (error) {
            console.error("공지사항 로딩 실패:", error);
            setNotices([]); // 에러 발생 시 빈 배열로 초기화
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotices();
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

    const handleDelete = async (noticeNo) => {
        if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/board/delete/${noticeNo}`);
                alert("공지사항이 삭제되었습니다.");
                fetchNotices(); // 목록 새로고침
                setSelectedNotice(null); // 상세 보기 닫기
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제에 실패했습니다.");
            }
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('noticeTitle', editedNotice.noticeTitle);
        formData.append('noticeContent', editedNotice.noticeContent);

        // 새 글 작성과 수정 분기
        const isNew = !editedNotice.noticeNo;
        const url = isNew ? '/board/write' : '/board/update';
        const method = isNew ? 'post' : 'put';

        if (!isNew) {
            formData.append('noticeNo', editedNotice.noticeNo);
        }

        try {
            await axios({
                method: method,
                url: url,
                data: formData,
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert(`공지사항이 성공적으로 ${isNew ? '작성' : '수정'}되었습니다.`);
            setIsEditing(false);
            setEditedNotice(null);
            fetchNotices();
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장에 실패했습니다.");
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
                // --- 글쓰기/수정 UI ---
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
                // --- 상세 보기 UI ---
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
                // --- 목록 보기 UI ---
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
                                    <td className="px-6 py-4">{notice.noticeNo}</td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => setSelectedNotice(notice)} className="font-medium hover:underline text-left">
                                            {notice.noticeTitle}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">{new Date(notice.createDate).toLocaleDateString()}</td>
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