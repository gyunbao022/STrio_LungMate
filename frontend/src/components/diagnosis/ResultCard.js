import React from 'react';

function ResultCard({ analysisResult, summaryResult, onGenerateSummary, isSummaryLoading }) {
    if (!analysisResult) {
        return (
            <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700 flex items-center justify-center h-full">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5l4 4v10a2 2 0 01-2 2z"></path></svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-300">분석 대기 중</h3>
                    <p className="mt-1 text-sm text-gray-500">이미지를 업로드하고 분석을 시작하세요.</p>
                </div>
            </div>
        );
    }
    
    const { isPneumonia, confidence } = analysisResult;
    const resultString = isPneumonia ? "폐렴 의심" : "정상";
    const confidencePercent = (confidence * 100).toFixed(1);

    return (
        <div className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-cyan-400">2. AI 분석 결과</h2>
            <div className={`p-4 rounded-lg mb-4 ${isPneumonia ? 'bg-red-900 bg-opacity-50' : 'bg-green-900 bg-opacity-50'}`}>
                <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">진단 결과:</span>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${isPneumonia ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>{resultString}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-lg">신뢰도:</span>
                    <span className="text-lg font-mono">{confidencePercent}%</span>
                </div>
            </div>
            
            <button 
                onClick={onGenerateSummary}
                disabled={isSummaryLoading}
                className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition flex items-center justify-center disabled:bg-gray-600"
            >
                {isSummaryLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        생성 중...
                    </>
                ) : '✨ AI 소견 요약 생성'}
            </button>

            {summaryResult && (
                 <div className="bg-gray-900 bg-opacity-70 p-4 rounded-lg animate-fade-in">
                    <h3 className="font-bold text-lg mb-2 text-purple-400">AI 소견 요약</h3>
                    <div className="whitespace-pre-wrap text-gray-300 text-sm">{summaryResult}</div>
                </div>
            )}
        </div>
    );
}

export default ResultCard;
