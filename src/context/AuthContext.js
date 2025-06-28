import { createContext, useState, useEffect, useCallback } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(() => {
    const tokens = localStorage.getItem("authTokens");
    return tokens ? JSON.parse(tokens) : null;
  });

  const [user, setUser] = useState(() =>
    authTokens ? jwtDecode(authTokens.access) : null
  );

  const [role, setRole] = useState({ is_admin: false, is_seo: false });
  const [loading, setLoading] = useState(true);

  const fetchUserRole = useCallback(async (accessToken) => {
    try {
      const res = await axiosInstance.get("/api/role/", {
        headers: { Authorization: `Bearer ${accessToken}` },
        timeout: 20000,
      });
      setRole(res.data);
    } catch (err) {
      console.error("Role fetch failed", err);
    }
  }, []);

  const loginUser = async (username, password) => {
    try {
      const res = await axiosInstance.post("/api/token/", {
        username,
        password,
      });

      const tokens = res.data;
      setAuthTokens(tokens);
      localStorage.setItem("authTokens", JSON.stringify(tokens));
      const decoded = jwtDecode(tokens.access);
      setUser(decoded);
      await fetchUserRole(tokens.access);
      return true;
    } catch (err) {
      console.error("Login failed", err);
      return false;
    }
  };

  const logout = () => {
    setAuthTokens(null);
    setUser(null);
    setRole({ is_admin: false, is_seo: false });
    localStorage.removeItem("authTokens");
    window.location.href = "/login";
  };

  const updateToken = useCallback(async () => {
    try {
      const res = await axiosInstance.post("/api/token/refresh/", {
        refresh: authTokens?.refresh,
      });

      const data = res.data;
      const updatedTokens = {
        ...authTokens,
        access: data.access,
      };

      setAuthTokens(updatedTokens);
      localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
      const decoded = jwtDecode(data.access);
      setUser(decoded);
      await fetchUserRole(data.access);  // <-- only here
    } catch (err) {
      console.warn("Token refresh failed", err);
      logout();
    }
  }, [authTokens, fetchUserRole]);

  // Only set interval when tokens exist
  useEffect(() => {
  const tokens = localStorage.getItem("authTokens")
    ? JSON.parse(localStorage.getItem("authTokens"))
    : null;

  if (!tokens) {
    setLoading(false);
    return;
  }

  const decoded = jwtDecode(tokens.access);
  const now = Math.floor(Date.now() / 1000);

  if (decoded.exp < now) {
    updateToken();
  } else {
    // Only update state if tokens or user are different
    setAuthTokens((prevTokens) => {
      if (JSON.stringify(prevTokens) !== JSON.stringify(tokens)) {
        return tokens;
      }
      return prevTokens;
    });

    setUser((prevUser) => {
      if (JSON.stringify(prevUser) !== JSON.stringify(decoded)) {
        return decoded;
      }
      return prevUser;
    });

    fetchUserRole(tokens.access);
  }

  setLoading(false);
}, [updateToken, fetchUserRole]);


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
