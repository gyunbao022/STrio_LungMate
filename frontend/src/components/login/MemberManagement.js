import React, { useState, useEffect } from 'react';
import instance from "../../token/interceptors";

function MemberManagement() {
    // 1. 상태 관리 확장: 검색어, 수정 중인 회원 ID 등을 추가합니다.
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingMemberId, setEditingMemberId] = useState(null); // 수정 모드인 회원의 ID
    const [editedRole, setEditedRole] = useState(''); // 수정 시 선택된 역할

  const getMemberList = async () => {
    console.log("meber list =>");
    await instance
      .get(`/member/list`)
      .then((response) => {
        //console.log(response.data);
        setMembers(response.data.merberList);
      })
      .catch((error) => {
        console.log("member list:", error.message);
      });
    };
    
    useEffect(() => {
        // DB MEMBER 테이블 스키마에 맞춘 더미 데이터   
        const dummyMembers = [
            { memberId: 'doctor_kim', memberName: '김의사3', email: 'dr.kim@hospital.com', role: 'DOCTOR', joinDate: '2025-09-15', status: 'ACTIVE' },
            { memberId: 'xray_lee', memberName: '이방사선', email: 'xray.lee@hospital.com', role: 'XRAY_OPERATOR', joinDate: '2025-09-18', status: 'ACTIVE' },
            { memberId: 'admin_park', memberName: '박관리', email: 'admin@system.com', role: 'ADMIN', joinDate: '2025-09-01', status: 'ACTIVE' },
            { memberId: 'inactive_doc', memberName: '최휴면', email: 'inactive@hospital.com', role: 'DOCTOR', joinDate: '2025-08-21', status: 'INACTIVE' },
        ];
        //setMembers(dummyMembers);
        getMemberList();
        setLoading(false);
    }, []);

    // 2. 검색 기능: 검색어(이름 또는 아이디)에 따라 목록을 필터링합니다.
    const filteredMembers = members.filter(member =>
        member.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.userId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 3. 수정 모드 활성화 핸들러
    const handleEditClick = (member) => {
        setEditingMemberId(member.userId);
        setEditedRole(member.roleCd);
    };

    // 4. 수정 내용 저장 핸들러 (API 호출 지점)
    const handleSaveClick = (memberId) => {
        // TODO: 여기에 memberId와 editedRole을 백엔드로 보내는 API 호출 로직 추가
        alert(`${memberId}의 권한을 ${editedRole}(으)로 변경 요청했습니다.`);
        // 프론트엔드 상태를 즉시 업데이트
        setMembers(members.map(m => m.userId === memberId ? { ...m, role: editedRole } : m));
        setEditingMemberId(null); // 수정 모드 종료
    };
    
    // 5. 수정 취소 핸들러
    const handleCancelClick = () => {
        setEditingMemberId(null);
    };

    // 6. 회원 삭제 핸들러 (API 호출 지점)
    const handleDeleteClick = (memberId) => {
        if (window.confirm(`${memberId} 회원을 정말로 삭제하시겠습니까?`)) {
            // TODO: 여기에 memberId를 백엔드로 보내 삭제하는 API 호출 로직 추가
            alert(`${memberId} 회원을 삭제 요청했습니다.`);
            setMembers(members.filter(m => m.userId !== memberId));
        }
    };

    if (loading) return <div>로딩 중...</div>;

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg glassmorphism">
            <h1 className="text-2xl font-bold mb-4">회원 관리</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="아이디 또는 이름으로 검색..."
                    className="w-full p-2 bg-gray-700 rounded border border-gray-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-300">
                    <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3">아이디</th>
                            <th className="px-6 py-3">이름</th>
                            <th className="px-6 py-3">역할(Role)</th>
                            <th className="px-6 py-3">가입일</th>
                            <th className="px-6 py-3 text-center">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMembers.map(member => (
                            <tr key={member.userId} className="border-b border-gray-700 hover:bg-gray-700/50">
                                <td className="px-6 py-4">{member.userId}</td>
                                <td className="px-6 py-4">{member.userName}</td>
                                <td className="px-6 py-4">
                                    {editingMemberId === member.userId ? (
                                        // 수정 모드일 때 Select Box 표시
                                        <select value={editedRole} onChange={(e) => setEditedRole(e.target.value)} className="bg-gray-600 rounded p-1">
                                            <option value="D">DOCTOR</option>
                                            <option value="X">XRAY_OPERATOR</option>
                                            <option value="A">ADMIN</option>
                                        </select>
                                    ) : (
                                        // 일반 모드일 때 텍스트 표시
                                        member.roleCd
                                    )}
                                </td>
                                <td className="px-6 py-4">{member.createdAt}</td>
                                <td className="px-6 py-4 text-center">
                                    {editingMemberId === member.userId ? (
                                        // 수정 모드일 때 '저장', '취소' 버튼 표시
                                        <>
                                            <button onClick={() => handleSaveClick(member.userId)} className="font-medium text-green-400 hover:underline mr-4">저장</button>
                                            <button onClick={handleCancelClick} className="font-medium text-gray-400 hover:underline">취소</button>
                                        </>
                                    ) : (
                                        // 일반 모드일 때 '수정', '삭제' 버튼 표시
                                        <>
                                            <button onClick={() => handleEditClick(member)} className="font-medium text-blue-400 hover:underline mr-4">수정</button>
                                            <button onClick={() => handleDeleteClick(member.userId)} className="font-medium text-red-400 hover:underline">삭제</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MemberManagement;