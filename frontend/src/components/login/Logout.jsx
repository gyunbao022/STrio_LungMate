import React, { useEffect } from "react";
// import instance from "../../token/interceptors"; // 백엔드 연결 후 사용

const Logout = () => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
      "Authorization-refresh": localStorage.getItem("Authorization-refresh"),
    },
  };

  const handleCommit = async () => {
    console.log("logout");
    const email = localStorage.getItem("adminId");
    console.log("logout=============> / :", email);

    // 백엔드와 연결되기 전까지는 아래 API 요청 주석 처리!

    try {
      await instance.delete(`/admin/logout`, config);
    } catch (error) {
      console.log("logout 실패 =>", error.message);
    }

    // 로컬스토리지 데이터 제거
    localStorage.removeItem("Authorization");
    localStorage.removeItem("Authorization-refresh");
    localStorage.removeItem("adminId");
    localStorage.removeItem("name");
    localStorage.removeItem("isLogin");

    // 전체 비우는 경우 (위 코드들과 중복되므로 선택적으로 사용)
    localStorage.clear();

    // 홈으로 리다이렉트
    window.location.replace("/");
  };

  useEffect(() => {
    handleCommit();
  }, []);

  return null; // 로그아웃 페이지는 실제 렌더링 필요 없음
};

export default Logout;
