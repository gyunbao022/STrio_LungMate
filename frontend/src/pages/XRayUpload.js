import React, { useState, useEffect } from 'react';

function XRayUpload({ currentUser }) {
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(null); // 'success', 'error', or null

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(imageFile);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setUploadStatus(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!patientId || !doctorId || !imageFile) {
            alert('환자 ID, 담당의사 ID, 그리고 이미지 파일을 모두 입력해주세요.');
            return;
        }
        setIsLoading(true);
        setUploadStatus(null);

        // FormData 객체 생성
        const formData = new FormData();
        formData.append('patientId', patientId);
        formData.append('doctorId', doctorId);
        formData.append('xrayImage', imageFile);
        formData.append('uploaderId', currentUser.memberId); // 현재 로그인한 사용자 ID

        try {
            // --- 백엔드 API 호출 (실제 엔드포인트로 수정 필요) ---
            // const response = await fetch('/api/xray/upload', {
            //     method: 'POST',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error('업로드 실패');
            // }
            
            // const result = await response.json();

            // 시뮬레이션을 위한 setTimeout
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log('Uploaded data:', {
                patientId,
                doctorId,
                imageFile,
                uploaderId: currentUser.memberId
            });


            setUploadStatus('success');
            // 성공 후 폼 초기화
            setPatientId('');
            setDoctorId('');
            setImageFile(null);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500">
                    X-Ray 이미지 업로드
                </h1>
                <p className="text-gray-400 mt-2">
                    환자의 X-Ray 이미지와 정보를 등록합니다.
                </p>
            </header>
            <main className="w-full glassmorphism rounded-2xl shadow-lg p-6 sm:p-8">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* 환자 및 의사 정보 입력 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="patientId" className="block text-sm font-medium text-gray-300 mb-2">환자 ID</label>
                                <input
                                    type="text"
                                    id="patientId"
                                    value={patientId}
                                    onChange={(e) => setPatientId(e.target.value)}
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    placeholder="예: P12345"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="doctorId" className="block text-sm font-medium text-gray-300 mb-2">담당 의사 ID</label>
                                <input
                                    type="text"
                                    id="doctorId"
                                    value={doctorId}
                                    onChange={(e) => setDoctorId(e.target.value)}
                                    className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                    placeholder="예: D67890"
                                    required
                                />
                            </div>
                        </div>

                        {/* 이미지 업로드 */}
                        <div>
                             <label className="block text-sm font-medium text-gray-300 mb-2">X-Ray 이미지</label>
                            <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden bg-gray-900/50">
                                {previewUrl ? (
                                    <img src={previewUrl} alt="X-ray preview" className="h-full w-full object-contain" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <i className="fas fa-upload text-4xl mb-2"></i>
                                        <p>파일을 드래그하거나 클릭하여 업로드</p>
                                    </div>
                                )}
                                <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/dicom" onChange={handleFileChange} required />
                            </div>
                        </div>
                    </div>

                    {/* 제출 버튼 */}
                    <div className="mt-8">
                        <button type="submit" disabled={isLoading} className="w-full bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center">
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin mr-2"></i> 업로드 중...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-cloud-upload-alt mr-2"></i> 정보 등록 및 업로드
                                </>
                            )}
                        </button>
                    </div>
                </form>
                 {/* 업로드 상태 메시지 */}
                {uploadStatus && (
                    <div className={`mt-4 text-center p-3 rounded-lg ${uploadStatus === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {uploadStatus === 'success' ? '성공적으로 업로드되었습니다.' : '업로드 중 오류가 발생했습니다.'}
                    </div>
                )}
            </main>
        </div>
    );
}

export default XRayUpload;
