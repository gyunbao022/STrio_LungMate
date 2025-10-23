import React, { useEffect, useRef } from "react";
import instance from "../../token/interceptors";

const Logout = ({ onNavigate, onLogout }) => {
  const hasRun = useRef(false);

  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("Authorization"),
      "Authorization-refresh": localStorage.getItem("Authorization-refresh"),
    },
  };

  const handleCommit = async () => {
    console.log("logout start");
    const userId = localStorage.getItem("userId");
    console.log("logout userId =>", userId);

    try {
      await instance.delete(`/member/logout`, config);
    } catch (error) {
      console.warn("logout 실패 =>", error.message);
    }

    // 로컬스토리지 완전 정리
    localStorage.clear();

    // App 상태 초기화
    onLogout(); // currentUser = null, currentPage = main
    onNavigate("main"); // 메인화면으로 이동

    console.log("logout 완료, 메인 페이지 이동");
  };

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;
      handleCommit();
    }
  }, []);

  return null; // 별도 렌더링 필요 없음
};

export default Logout;
