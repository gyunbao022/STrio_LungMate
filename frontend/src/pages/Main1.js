import React from 'react';

function Main1() {
    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">LungMate에 오신 것을 환영합니다.</h2>
            
            <div className="max-w-4xl mx-auto">
                <img 
                    src={require('../images/image1.jpg')} 
                    alt="Doctor examining X-ray" 
                    className="rounded-lg shadow-xl mx-auto mb-6 w-full object-cover"
                    style={{maxWidth: '600px'}}
                />
                <div className="bg-gray-800 p-6 rounded-lg shadow-inner">
                    <h3 className="text-xl font-semibold text-blue-300 mb-3">About LungMate</h3>
                    <p className="text-lg text-gray-300">
                        LungMate는 흉부 X-ray 이미지를 통해 폐렴을 진단하는 데 도움을 주는 AI 기반 서비스입니다. 
                        <br />
                        이미지를 업로드하고 몇 초 안에 예비 진단을 받아보세요.
                    </p>
                </div>
            </div>

            <p className="mt-8 text-lg text-gray-400">로그인하여 진단을 시작하세요.</p>
        </div>
    );
}

export default Main1;
