import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { POST_REQUEST } from "../../api";
import LoginComponent from "../../components/loginComponent";

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const payload = {
      email: email,
      password: password,
    };

    const response = await POST_REQUEST(
      "https://images-api.retailopedia.com/login",
      payload,
      {},
      {},
      true
    );
    sessionStorage.setItem("token", response.access_token);
    sessionStorage.setItem("userId", response.user.user_key);
    if (response.access_token) {
      console.log(window.location.href);
      navigate("/images-ai");
    } else {
      alert("Invalid Credential");
    }
  };

  return (
    <LoginComponent setEmail={setEmail} setPassword={setPassword} handleLogin={handleLogin} email={email} password={password} />
  );
};

export default HomePage;
