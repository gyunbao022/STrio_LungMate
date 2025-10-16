import React, { useState } from 'react';

// 업로드 내역에 사용할 초기 예시 데이터입니다.
const initialUploadHistoryData = [
  {
    xrayId: '5012',
    patientId: '100023',
    uploader: 'xray01',
    registrationDate: '2025-09-30',
    status: 'PENDING',
  },
  {
    xrayId: '5013',
    patientId: '100024',
    uploader: 'xray02',
    registrationDate: '2025-09-30',
    status: 'PENDING',
  },
  {
    xrayId: '5014',
    patientId: '100025',
    uploader: 'xray01',
    registrationDate: '2025-10-01',
    status: 'COMPLETED',
  },
];

function UploadHistory() {
  // 데이터를 상태로 관리하여 삭제 기능을 구현할 수 있도록 합니다.
  const [uploadHistory, setUploadHistory] = useState(initialUploadHistoryData);

  // 삭제 버튼 클릭 시 실행될 함수입니다.
  const handleDelete = (xrayIdToDelete) => {
    // filter 함수를 사용하여 선택된 ID를 제외한 새 배열을 만듭니다.
    const updatedHistory = uploadHistory.filter(item => item.xrayId !== xrayIdToDelete);
    // 상태를 업데이트하여 화면을 다시 렌더링합니다.
    setUploadHistory(updatedHistory);
    console.log(`ID가 ${xrayIdToDelete}인 항목을 삭제했습니다.`);
  };

  // 상태(status)에 따라 다른 스타일을 적용하기 위한 함수입니다.
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

  return (
    // 전체 레이아웃 컨테이너
    <div className="bg-[#1a202c] text-white p-8 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-6">업로드 내역</h1>
      
      {/* 테이블을 감싸는 컨테이너 */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          {/* 테이블 헤더 */}
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">X-ray ID</th>
              <th className="p-4">환자 ID</th>
              <th className="p-4">업로더</th>
              <th className="p-4">등록일</th>
              <th className="p-4">상태</th>
              <th className="p-4"></th> {/* 버튼을 위한 빈 헤더 */}
            </tr>
          </thead>

          {/* 테이블 본문 */}
          <tbody>
            {/* 데이터가 없을 경우 메시지를 표시합니다. */}
            {uploadHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  업로드 내역이 없습니다.
                </td>
              </tr>
            ) : (
              uploadHistory.map((item) => (
                <tr key={item.xrayId} className="border-b border-gray-700 hover:bg-gray-800 transition-colors duration-200">
                  <td className="p-4">{item.xrayId}</td>
                  <td className="p-4">{item.patientId}</td>
                  <td className="p-4">{item.uploader}</td>
                  <td className="p-4">{item.registrationDate}</td>
                  <td className="p-4">
                    {getStatusChip(item.status)}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleDelete(item.xrayId)} 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded transition-colors duration-200"
                    >
                      삭제
                    </button>
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

