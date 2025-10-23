import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import instance from "../../token/interceptors"; // 백엔드 연결 전 잠시 주석
import "./Login.css"; // 커스텀 CSS만 사용
import instance from "../../token/interceptors";
import { useAuth } from "../layout/AuthProvider";

const Login = () => {
  const [inputs, setInputs] = useState({
    adminId: "",
    pwd: "",
  });

  const { adminId, pwd } = inputs;
  const { login } = useAuth();

  const handleValueChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      await instance
        .post(`/login`, inputs)
        .then((response) => {
          console.log(response);

          //응답 헤더에서 토큰 추출
          const accessToken = response.headers["authorization"]; //대소문자 주의
          const refreshToken = response.headers["authorization-refresh"];

          // const accessToken = response.data.accessToken;
          //const refreshToken = response.data.refreshToken;

          console.log("accessToken => ", accessToken);
          console.log("refreshToken => ", refreshToken);

          localStorage.setItem("Authorization", accessToken);
          localStorage.setItem("Authorization-refresh", refreshToken);

          localStorage.setItem("adminId", response.data.adminId);
          localStorage.setItem("name", response.data.name);
          //localStorage.setItem("authRole", response.data.authRole);
          localStorage.setItem("isLogin", true);
          return response;
        })
        .then((response) => {
          // console.log("then2=>", response);
          // window.location.replace("/");
          login(); // Context 상태변경
          setInputs({ adminId: "", pwd: "" });
          window.location.replace("/");
        })
        .catch((error) => console.log("login 오류:", error.message));
    } catch (err) {
      alert("로그인 실패 : 아이디 또는 비밀번호 확인");
    }

    // * 나중에 백엔드 연결 시 주석 해제
    /*
        await instance
          .post(`/login`, inputs)
          .then((response) => {
            const accessToken = response.headers["authorization"];
            const refreshToken = response.headers["authorization-refresh"];
    
            localStorage.setItem("Authorization", accessToken);
            localStorage.setItem("Authorization-refresh", refreshToken);
            localStorage.setItem("memberEmail", response.data.memberEmail);
            localStorage.setItem("memberName", response.data.memberName);
            localStorage.setItem("isLogin", true);
    
            setInputs({ memberEmail: "", memberPass: "" });
            window.location.replace("/");
          })
          .catch((error) => console.log("login 오류:", error.message));
        */
  };

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <h1>로그인</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="adminId"
              className="form-control"
              value={adminId}
              placeholder="이메일"
              onChange={handleValueChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="pwd"
              className="form-control"
              value={pwd}
              placeholder="비밀번호"
              onChange={handleValueChange}
            />
          </div>
          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              로그인
            </button>
            <Link to="/joinadd" className="btn btn-primary">
              회원 가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
