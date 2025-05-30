import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    console.log("login clicked");
    e.preventDefault();
    const success = await loginUser(username, password);
    if (success) navigate("/dashboard");
    else alert("Invalid credentials");
  };

  return (

    <div className=" mt-4">
    <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
      <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button onClick={handleSubmit} type="submit">Login</button>
      </form>
    </div>
    </div>
  );
  
}

export default LoginForm;
