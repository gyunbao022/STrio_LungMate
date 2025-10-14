import React, { useState, useEffect } from 'react';

function ImageUploader({ onImageSelect, onAnalyze, isLoading, imageFile }) {
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (!imageFile) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(imageFile);
        setPreviewUrl(objectUrl);
        
        // Clean up the object URL on unmount
        return () => URL.revokeObjectURL(objectUrl);
    }, [imageFile]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onImageSelect(e.target.files[0]);
        }
    };

    return (
        <div className="bg-gray-800/50 p-6 rounded-lg glassmorphism h-full flex flex-col items-center justify-center">
            <h2 className="text-xl font-bold mb-4 self-start">1. 흉부 X-ray 이미지 업로드</h2>
            <div className="w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden bg-gray-900/50">
                {previewUrl ? (
                    <img src={previewUrl} alt="X-ray preview" className="h-full w-full object-contain" />
                ) : (
                    <div className="text-center text-gray-400">
                        <i className="fas fa-upload text-4xl mb-2"></i>
                        <p>파일을 드래그하거나 클릭하여 업로드</p>
                    </div>
                )}
                 <input type="file" className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer" accept="image/png, image/jpeg, image/dicom" onChange={handleFileChange} />
            </div>
            <button onClick={onAnalyze} disabled={!imageFile || isLoading} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center">
                 {isLoading ? (
                    <>
                        <i className="fas fa-spinner fa-spin mr-2"></i> 분석 중...
                    </>
                 ) : (
                    <>
                       <i className="fas fa-microscope mr-2"></i> 분석 시작
                    </>
                 )}
            </button>
        </div>
    );
}

export default ImageUploader;
