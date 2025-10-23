// frontend/src/components/diagnosis/Diagnosis.js
import React, { useEffect, useMemo, useState, useCallback } from "react";
import safeStorage from "../../utils/safeStorage";

/**
 * Props:
 *  - xrayId:        선택된 X-ray ID (App.js에서 전달)
 *  - currentUser:   로그인 사용자 정보 (선택)
 *  - onNavigate:    페이지 전환 핸들러 (App.js의 handleNavigate)
 *
 * 동작:
 *  - 마운트/ID 변경 시 자동으로 백엔드에 분석을 요청하고 결과를 표시
 *  - 백엔드 엔드포인트는 아래 ENDPOINTS 중 실제 사용 중인 것으로 맞춰서 쓰세요.
 */
function Diagnosis({ xrayId, currentUser, onNavigate }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [result, setResult] = useState(null);

  // --- 🔧 여기에 실제 백엔드 엔드포인트를 맞추세요 ---
  // ① POST by-id (추천: 명확)
  // ② GET result?id= (이미 분석된 결과를 조회하는 스타일)
  const ENDPOINTS = useMemo(
    () => ({
      POST_ANALYZE_BY_ID: "/api/analyze/by-id",
      GET_RESULT_BY_ID: (id) =>
        `/api/analyze/result?xrayId=${encodeURIComponent(id)}`,
    }),
    []
  );

  // 토큰 헤더(있으면 자동 첨부) — 프로젝트에 맞게 키 이름을 조정
  const authHeaders = useMemo(() => {
    const token =
      safeStorage.getItem("accessToken") || safeStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const analyzeById = useCallback(
    async (id, signal) => {
      // ⚠️ 실제 응답 스키마에 맞게 파싱 로직을 조정하세요.
      // 기대 예시:
      // { pred: "PNEUMONIA", prob: 0.83, overlayUrl: "...", originalUrl: "..." }
      // 또는 { data: { ... } }
      // 또는 { result: { ... } }
      // 아래는 ①POST → 실패 시 ②GET로 폴백하는 패턴입니다.

      // ① POST /api/analyze/by-id
      try {
        const res = await fetch(ENDPOINTS.POST_ANALYZE_BY_ID, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders,
          },
          body: JSON.stringify({ xrayId: id }),
          signal,
        });

        if (res.ok) {
          const data = await res.json();
          return (
            data?.result ||
            data?.data ||
            data || {
              pred: data?.pred,
              prob: data?.prob,
              overlayUrl: data?.overlayUrl,
              originalUrl: data?.originalUrl,
            }
          );
        }
        // 이어서 GET으로 폴백
      } catch (e) {
        if (e.name === "AbortError") throw e;
        // 폴백 진행
      }

      // ② GET /api/analyze/result?xrayId=...
      const res2 = await fetch(ENDPOINTS.GET_RESULT_BY_ID(id), {
        method: "GET",
        headers: {
          ...authHeaders,
        },
        signal,
      });

      if (!res2.ok) {
        const txt = await res2.text().catch(() => "");
        throw new Error(txt || "분석 요청 실패 (GET 폴백)");
      }
      const data2 = await res2.json();

      return (
        data2?.result ||
        data2?.data ||
        data2 || {
          pred: data2?.pred,
          prob: data2?.prob,
          overlayUrl: data2?.overlayUrl,
          originalUrl: data2?.originalUrl,
        }
      );
    },
    [ENDPOINTS, authHeaders]
  );

  // 마운트/ID 변경 시 자동 분석
  useEffect(() => {
    if (!xrayId) return;
    let isActive = true;
    const ac = new AbortController();

    (async () => {
      try {
        setErr(null);
        setLoading(true);
        const payload = await analyzeById(xrayId, ac.signal);
        if (!isActive) return;

        // 정규화: 누락 필드 대비 기본값
        const normalized = {
          xrayId,
          pred: payload?.pred ?? "-",
          prob: typeof payload?.prob === "number" ? payload.prob : null,
          overlayUrl: payload?.overlayUrl ?? null,
          originalUrl: payload?.originalUrl ?? null,
          camLayer: payload?.camLayer ?? null,
          threshold: payload?.threshold ?? null,
          raw: payload,
        };
        setResult(normalized);
      } catch (e) {
        if (e.name !== "AbortError") {
          setErr(e?.message || "분석 중 오류가 발생했습니다.");
        }
      } finally {
        if (isActive) setLoading(false);
      }
    })();

    return () => {
      isActive = false;
      ac.abort();
    };
  }, [xrayId, analyzeById]);

  const handleRetry = async () => {
    if (!xrayId) return;
    setResult(null);
    setErr(null);
    setLoading(true);

    const ac = new AbortController();
    try {
      const payload = await analyzeById(xrayId, ac.signal);
      const normalized = {
        xrayId,
        pred: payload?.pred ?? "-",
        prob: typeof payload?.prob === "number" ? payload.prob : null,
        overlayUrl: payload?.overlayUrl ?? null,
        originalUrl: payload?.originalUrl ?? null,
        camLayer: payload?.camLayer ?? null,
        threshold: payload?.threshold ?? null,
        raw: payload,
      };
      setResult(normalized);
    } catch (e) {
      if (e.name !== "AbortError") {
        setErr(e?.message || "재실행 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const goList = () => onNavigate?.("diagnosis-list");

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">X-ray 분석 결과</h1>
        <div className="flex gap-2">
          <button
            onClick={goList}
            className="px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
          >
            목록으로
          </button>
          <button
            onClick={handleRetry}
            disabled={!xrayId || loading}
            className={`px-3 py-2 rounded ${
              loading
                ? "bg-gray-700 cursor-not-allowed"
                : "bg-cyan-600 hover:bg-cyan-500"
            }`}
          >
            {loading ? "분석 중..." : "다시 분석"}
          </button>
        </div>
      </div>

      <div className="text-sm text-gray-300 mb-4">
        X-ray ID: <span className="font-mono">{xrayId ?? "-"}</span>
        {currentUser?.memberName && (
          <span className="ml-3">
            · 사용자: <b>{currentUser.memberName}</b>
          </span>
        )}
      </div>

      {err && (
        <div className="p-3 mb-4 rounded bg-red-900/40 text-red-300">{err}</div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="p-4 rounded bg-gray-800/60">
              <div className="text-gray-400 text-sm mb-2">예측</div>
              <div className="text-xl">
                {result.pred}{" "}
                {typeof result.prob === "number" && (
                  <span className="text-gray-400 text-base ml-2">
                    ({(result.prob * 100).toFixed(1)}%)
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-2 space-x-3">
                {result.camLayer && <span>CAM: {result.camLayer}</span>}
                {result.threshold != null && (
                  <span>th: {String(result.threshold)}</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded bg-gray-800/60">
              <div className="text-gray-400 text-sm mb-2">원본 이미지</div>
              {result.originalUrl ? (
                <img
                  src={result.originalUrl}
                  alt="original"
                  className="rounded-lg w-full max-h-[480px] object-contain bg-black"
                />
              ) : (
                <div className="text-gray-500 text-sm">
                  원본 이미지가 없습니다.
                </div>
              )}
            </div>
          </div>

          <div className="p-4 rounded bg-gray-800/60">
            <div className="text-gray-400 text-sm mb-2">Grad-CAM Overlay</div>
            {result.overlayUrl ? (
              <img
                src={result.overlayUrl}
                alt="overlay"
                className="rounded-lg w-full max-h-[640px] object-contain bg-black"
              />
            ) : (
              <div className="text-gray-500 text-sm">
                오버레이 이미지가 없습니다.
              </div>
            )}
          </div>
        </div>
      )}

      {!loading && !err && !result && (
        <div className="text-gray-400">분석 결과가 아직 없습니다.</div>
      )}
    </div>
  );
}

export default Diagnosis;
