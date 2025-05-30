// ✅ AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() =>
    authTokens ? jwtDecode(authTokens.access) : null
  );

  const [role, setRole] = useState({ is_admin: false, is_seo: false });
  const [loading, setLoading] = useState(true);

  const loginUser = async (username, password) => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        username,
        password,
      });

      const tokens = res.data;
      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      setUser(jwtDecode(tokens.access));
      await fetchUserRole(tokens.access);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const fetchUserRole = async (accessToken) => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/role/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setRole(res.data);
    } catch (err) {
      console.error("Role fetch failed", err);
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    setRole({ is_admin: false, is_seo: false });
    localStorage.removeItem("authTokens");
    window.location.href = "/login";

  };

  const updateToken = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/refresh/", {
        refresh: authTokens?.refresh,
      });

      const data = res.data;
      const updatedTokens = {
        ...authTokens,
        access: data.access,
      };

      setAuthTokens(updatedTokens);
      localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
      setUser(jwtDecode(data.access));
    } catch (err) {
      console.warn("Token refresh failed", err);
      logout(); // Refresh token is probably expired or invalid
    }
  };

  // ⏳ Auto-refresh every 4 minutes
  useEffect(() => {
    if (authTokens) {
      const interval = setInterval(() => {
        updateToken();
      }, 1000 * 60 * 4); // every 4 minutes

      return () => clearInterval(interval);
    }
  }, [authTokens]);

  // 🔁 On page load, validate token
  useEffect(() => {
    const tokens = localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null;

    if (tokens) {
      const decoded = jwtDecode(tokens.access);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp < now) {
        updateToken(); // try to refresh
      } else {
        setAuthTokens(tokens);
        setUser(decoded);
        fetchUserRole(tokens.access);
      }
    }

    setLoading(false);
  }, []);

  const getAuthHeader = () => {
    return authTokens
      ? { Authorization: `Bearer ${authTokens.access}` }
      : {};
  };

  return (
    <AuthContext.Provider
      value={{
        authTokens,
        loginUser,
        logout,
        user,
        role,
        loading,
        getAuthHeader,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
