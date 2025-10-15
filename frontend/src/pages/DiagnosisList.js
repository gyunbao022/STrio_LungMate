import React from 'react';

// 예시용 데이터입니다. 실제 애플리케이션에서는 API를 통해 받아오는 데이터로 대체해야 합니다.
const diagnosisData = [
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
];

function DiagnosisList({ onNavigate }) {
  return (
    // 전체 레이아웃을 감싸는 컨테이너입니다. 이미지의 어두운 배경색과 유사하게 스타일링합니다.
    <div className="bg-[#1a202c] text-white p-8 rounded-lg min-h-screen">
      <h1 className="text-2xl font-bold mb-6">판독 리스트</h1>
      
      {/* 테이블 전체를 감싸는 컨테이너입니다. */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          {/* 테이블 헤더 부분입니다. */}
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">X-ray ID</th>
              <th className="p-4">환자ID</th>
              <th className="p-4">업로더</th>
              <th className="p-4">등록일</th>
              <th className="p-4">상태</th>
              <th className="p-4"></th> {/* 버튼을 위한 빈 헤더 */}
            </tr>
          </thead>

          {/* 테이블 본문 부분입니다. */}
          <tbody>
            {diagnosisData.map((item, index) => (
              <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="p-4">{item.xrayId}</td>
                <td className="p-4">{item.patientId}</td>
                <td className="p-4">{item.uploader}</td>
                <td className="p-4">{item.registrationDate}</td>
                <td className="p-4">
                  {/* 상태 표시는 조건부 스타일링을 적용할 수 있습니다. */}
                  <span className="bg-yellow-900 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">
                    {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => onNavigate('view-diagnosis', { xrayId: item.xrayId })} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-5 rounded">
                    열기
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DiagnosisList;