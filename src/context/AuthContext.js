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

  const refreshAccessToken = useCallback(
    async (tokensToRefresh) => {
      const refreshToken = tokensToRefresh?.refresh;
      if (!refreshToken) {
        logout();
        return null;
      }

      try {
        const res = await axiosInstance.post("/api/token/refresh/", {
          refresh: refreshToken,
        });

        const data = res.data;
        const updatedTokens = {
          ...tokensToRefresh,
          access: data.access,
        };

        setAuthTokens(updatedTokens);
        localStorage.setItem("authTokens", JSON.stringify(updatedTokens));
        const decoded = jwtDecode(data.access);
        setUser(decoded);
        await fetchUserRole(data.access);
        return updatedTokens.access;
      } catch (err) {
        console.warn("Token refresh failed", err);
        logout();
        return null;
      }
    },
    [fetchUserRole]
  );

  const updateToken = useCallback(async () => {
    await refreshAccessToken(authTokens);
  }, [authTokens, refreshAccessToken]);

  const getValidAccessToken = useCallback(async () => {
    const storedTokens = localStorage.getItem("authTokens");
    const parsedTokens = storedTokens ? JSON.parse(storedTokens) : authTokens;

    if (!parsedTokens?.access) {
      return null;
    }

    try {
      const decoded = jwtDecode(parsedTokens.access);
      const now = Math.floor(Date.now() / 1000);

      if (decoded.exp <= now + 60) {
        return await refreshAccessToken(parsedTokens);
      }

      if (!authTokens || authTokens.access !== parsedTokens.access) {
        setAuthTokens(parsedTokens);
        setUser(decoded);
      }

      return parsedTokens.access;
    } catch (err) {
      console.warn("Invalid access token", err);
      return await refreshAccessToken(parsedTokens);
    }
  }, [authTokens, refreshAccessToken]);

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
        getValidAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
