import { useState } from "react";
import LoginComponent from "../../components/loginComponent";
import { useNavigate } from "react-router-dom";
import { POST_REQUEST } from "../../api";


const Admin=()=>{
     const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();
    
      const handleLogin = async (e) => {
        e.preventDefault();
        const payload = {
          email: email,
          password: password,
        };
        if(email=='admin@images.ai'&&password=='Admin@12345'){
         const response = await POST_REQUEST(
          "https://images-api.retailopedia.com/login",
          payload,
          {},
          {},
          true
        );
         sessionStorage.setItem("token", response.access_token);
        sessionStorage.setItem("adminToken", response.access_token);
        sessionStorage.setItem("userId", response.user_key);
        if (response.access_token) {
          console.log(window.location.href);
          navigate("/admin/dashboard");
        } else {
          alert("Invalid Credential");
        }
        }
         else {
          alert("Invalid Credential");
        }
       
       
      };
    
    return(
       <LoginComponent setEmail={setEmail} setPassword={setPassword} handleLogin={handleLogin} email={email} password={password}/>
    )
}

export default Admin;