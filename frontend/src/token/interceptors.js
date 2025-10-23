import axios from "axios";

/**
 * ✅ AccessToken 재발급 함수
 * RefreshToken을 이용해 새로운 AccessToken을 발급받습니다.
 */
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("Authorization-refresh");
    if (!refreshToken) throw new Error("refreshToken 없음");

    const response = await axios.post(
      "/auth/refresh",
      {},
      {
        baseURL: "http://localhost:8090",
        headers: {
          "Authorization-refresh": refreshToken,
        },
        withCredentials: true,
      }
    );

    return response.data.accessToken;
  } catch (error) {
    console.error("❌ refreshToken 갱신 실패:", error);
    throw error;
  }
};

/**
 * ✅ Axios 공통 인스턴스
 */
const instance = axios.create({
  baseURL: "http://localhost:8090",
  withCredentials: true, // 쿠키 및 인증정보 포함
});

/**
 * ✅ 요청 인터셉터
 * 모든 요청에 AccessToken 자동 포함
 */
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("Authorization");
    if (token) {
      config.headers["Authorization"] = token; // ex) "Bearer eyJ..."
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ✅ 응답 인터셉터
 * 401(Unauthorized) 발생 시 AccessToken 재발급 처리
 */
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    /**
     * 1️⃣ 로그인/회원가입/아이디찾기 등 비인증 요청은 예외처리
     * -> 세션 만료 메시지 표시 X
     */
    const unauthenticatedEndpoints = ["/login", "/signup", "/find-account"];
    if (unauthenticatedEndpoints.some((url) => originalRequest.url.includes(url))) {
      return Promise.reject(error); // 그대로 Login.jsx 등으로 전달
    }

    /**
     * 2️⃣ AccessToken 만료로 인한 401 에러 처리
     */
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // AccessToken 재발급
        const newAccessToken = await refreshAccessToken();
        const bearerToken = `Bearer ${newAccessToken}`;

        // 새 토큰 저장
        localStorage.setItem("Authorization", bearerToken);

        // 요청 헤더 갱신
        originalRequest.headers["Authorization"] = bearerToken;

        // ✅ FormData일 경우 Content-Type 수동 지정
        if (
          originalRequest.data instanceof FormData &&
          !originalRequest.headers["Content-Type"]
        ) {
          originalRequest.headers["Content-Type"] = "multipart/form-data";
        }

        // ✅ 재요청 실행
        return instance(originalRequest);
      } catch (refreshError) {
        console.error("❌ refreshToken 재발급 실패:", refreshError);

        /**
         * 3️⃣ refreshToken도 만료되었거나 재발급 실패 → 로그아웃 처리
         */
        localStorage.removeItem("Authorization");
        localStorage.removeItem("Authorization-refresh");
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        localStorage.removeItem("roleCd");
        localStorage.removeItem("isLogin");

        alert("세션이 만료되었습니다. 다시 로그인해주세요.");

        // React SPA에서는 전체 새로고침 없이 상태만 초기화
        return Promise.reject(refreshError);
      }
    }

    /**
     * 4️⃣ 기타 오류는 그대로 상위로 전파
     */
    return Promise.reject(error);
  }
);

export default instance;
