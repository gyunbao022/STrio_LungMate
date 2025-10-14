import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import ResultCard from './ResultCard';

// Gemini API 호출 로직 (원래는 별도 api.js 파일로 분리하는 것이 좋습니다)
async function callGeminiAPI(systemPrompt, userQuery) {
    const apiKey = ""; // 실제 앱에서는 백엔드에서 안전하게 처리해야 합니다.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    const payload = { 
        contents: [{ parts: [{ text: userQuery }] }], 
        systemInstruction: { parts: [{ text: systemPrompt }] }, 
    };
    const response = await fetch(apiUrl, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
    });
    if (!response.ok) throw new Error(`API call failed: ${response.status}`);
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text;
}

function Diagnosis() {
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [summaryResult, setSummaryResult] = useState(null);
    const [isSummaryLoading, setIsSummaryLoading] = useState(false);

    const handleImageSelect = (file) => {
        setImageFile(file);
        setAnalysisResult(null);
        setSummaryResult(null);
    };

    const handleAnalyze = () => {
        setIsLoading(true);
        setAnalysisResult(null);
        setTimeout(() => {
            const isPneumonia = Math.random() > 0.5;
            const confidence = Math.random() * (0.99 - 0.85) + 0.85;
            setAnalysisResult({ isPneumonia, confidence });
            setIsLoading(false);
        }, 2500);
    };
    
    const handleGenerateSummary = async () => {
        if (!analysisResult) return;
        setIsSummaryLoading(true);
        setSummaryResult(null);
        const { isPneumonia, confidence } = analysisResult;
        const resultString = isPneumonia ? "Pneumonia Suspected" : "Normal";
        const confidencePercent = (confidence * 100).toFixed(1);
        const systemPrompt = `You are a medical AI assistant specializing in radiology. Based on the analysis result of a chest X-ray, generate a brief, professional-looking report. The report should include a "Findings" section and an "Impression" section. The language must be concise and formal. Do not add any extra information or disclaimers.`;
        const userQuery = `Analysis Result: ${resultString}, Confidence Score: ${confidencePercent}%. Generate the report.`;
        try {
            const text = await callGeminiAPI(systemPrompt, userQuery);
            setSummaryResult(text);
        } catch (error) {
            setSummaryResult("오류가 발생하여 소견을 생성할 수 없습니다.");
            console.error(error);
        } finally {
            setIsSummaryLoading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
             <header className="text-center mb-8">
                <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300">
                    AI 폐렴 진단 어시스턴트
                </h1>
                <p className="text-gray-400 mt-2 max-w-2xl mx-auto">
                    흉부 X-ray 이미지를 업로드하여 폐렴 가능성을 확인해 보세요.
                </p>
            </header>
            <main className="w-full glassmorphism rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <ImageUploader 
                        onImageSelect={handleImageSelect}
                        onAnalyze={handleAnalyze}
                        isLoading={isLoading}
                        imageFile={imageFile}
                    />
                    <ResultCard 
                        analysisResult={analysisResult}
                        summaryResult={summaryResult}
                        onGenerateSummary={handleGenerateSummary}
                        isSummaryLoading={isSummaryLoading}
                    />
                </div>
            </main>
        </div>
    );
}

export default Diagnosis;

