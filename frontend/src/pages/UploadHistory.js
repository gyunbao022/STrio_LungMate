import React, { useState } from 'react';

// 업로드 내역에 사용할 초기 예시 데이터입니다. (업로더 이름을 'xray유저'로 변경)
const initialUploadHistoryData = [
  {
    xrayId: '5012',
    patientId: '100023',
    uploader: 'xray유저', // 현재 로그인된 xray유저와 일치하도록 수정
    registrationDate: '2025-09-30',
    status: 'PENDING',
  },
  {
    xrayId: '5013',
    patientId: '100024',
    uploader: 'another_xray_user', // 다른 업로더
    registrationDate: '2025-09-30',
    status: 'PENDING',
  },
  {
    xrayId: '5014',
    patientId: '100025',
    uploader: 'xray유저', // 현재 로그인된 xray유저와 일치하도록 수정
    registrationDate: '2025-10-01',
    status: 'COMPLETED',
  },
];

// App.js로부터 currentUser를 props로 받습니다.
function UploadHistory({ currentUser }) {
  const [uploadHistory, setUploadHistory] = useState(initialUploadHistoryData);
  
  // 필터 상태 관리
  const [patientIdFilter, setPatientIdFilter] = useState('');
  const [uploaderFilter, setUploaderFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // 등록일 필터 추가
  const [statusFilter, setStatusFilter] = useState('ALL');

  const handleDelete = (xrayIdToDelete) => {
    const updatedHistory = uploadHistory.filter(item => item.xrayId !== xrayIdToDelete);
    setUploadHistory(updatedHistory);
    console.log(`ID가 ${xrayIdToDelete}인 항목을 삭제했습니다.`);
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'PENDING':
        return <span className="bg-yellow-900 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">PENDING</span>;
      case 'COMPLETED':
        return <span className="bg-green-900 text-green-300 text-xs font-semibold px-3 py-1 rounded-full">COMPLETED</span>;
      default:
        return <span className="bg-gray-700 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full">{status}</span>;
    }
  };

  const getStatusButtonClass = (filterName) => {
    return `px-4 py-2 rounded-lg font-semibold transition-colors duration-200 w-full ${
      statusFilter === filterName
        ? 'bg-blue-600 text-white'
        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
    }`;
  };

  // 현재 사용자의 역할에 따라 초기 데이터를 필터링합니다.
  const userFilteredHistory = currentUser && currentUser.role === 'XRAY_OPERATOR'
    ? uploadHistory.filter(item => item.uploader === currentUser.memberName)
    : uploadHistory;

  // 여러 필터 조건에 따라 데이터를 필터링합니다.
  const filteredHistory = userFilteredHistory
    .filter(item => 
      item.patientId.toLowerCase().includes(patientIdFilter.toLowerCase())
    )
    .filter(item => 
      item.uploader.toLowerCase().includes(uploaderFilter.toLowerCase())
    )
    .filter(item => 
      item.registrationDate.includes(dateFilter)
    )
    .filter(item => {
      if (statusFilter === 'ALL') return true;
      return item.status === statusFilter;
    });

  return (
    <div className="bg-[#1a202c] text-white p-8 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-6">업로드 내역</h1>
      
      {/* 필터 컨트롤 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-gray-800/50 rounded-lg">
        <div>
          <label htmlFor="patientId" className="block text-sm font-medium text-gray-400 mb-1">환자 ID</label>
          <input
            id="patientId"
            type="text"
            placeholder="환자 ID로 검색..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-blue-200 focus:ring-opacity-50"
            value={patientIdFilter}
            onChange={(e) => setPatientIdFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="uploader" className="block text-sm font-medium text-gray-400 mb-1">업로더</label>
          <input
            id="uploader"
            type="text"
            placeholder="업로더로 검색..."
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-blue-200 focus:ring-opacity-50"
            value={uploaderFilter}
            onChange={(e) => setUploaderFilter(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="regDate" className="block text-sm font-medium text-gray-400 mb-1">등록일</label>
          <input
            id="regDate"
            type="date"
            className="w-full p-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:ring-blue-200 focus:ring-opacity-50 text-white"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-400 mb-1">상태</label>
          <div className="flex items-center justify-around space-x-2 bg-gray-700 p-1 rounded-lg h-full">
            <button onClick={() => setStatusFilter('ALL')} className={getStatusButtonClass('ALL')}>
              전체
            </button>
            <button onClick={() => setStatusFilter('PENDING')} className={getStatusButtonClass('PENDING')}>
              PENDING
            </button>
            <button onClick={() => setStatusFilter('COMPLETED')} className={getStatusButtonClass('COMPLETED')}>
              COMPLETED
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">X-ray ID</th>
              <th className="p-4">환자 ID</th>
              <th className="p-4">업로더</th>
              <th className="p-4">등록일</th>
              <th className="p-4">상태</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              filteredHistory.map((item) => (
                <tr key={item.xrayId} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <td className="p-4">{item.xrayId}</td>
                  <td className="p-4">{item.patientId}</td>
                  <td className="p-4">{item.uploader}</td>
                  <td className="p-4">{item.registrationDate}</td>
                  <td className="p-4">{getStatusChip(item.status)}</td>
                  <td className="p-4 text-right">
                    {/* 삭제 버튼 권한 제어 */}
                    {(currentUser && (currentUser.role === 'ADMIN' || (currentUser.role === 'XRAY_OPERATOR' && currentUser.memberName === item.uploader))) && (
                      <button 
                        onClick={() => handleDelete(item.xrayId)} 
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded transition-colors duration-200"
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UploadHistory;

