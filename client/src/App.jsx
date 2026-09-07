import React, { useEffect, useState } from "react";
import { ThemeProvider, styled } from "styled-components";
import { darkTheme, lightTheme } from "./utils/Themes";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Tutorials from "./pages/Tutorials";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import Profile from "./pages/Profile";
import { getCurrentUser } from "./api";
import { clearAuthMessage, logout, restoreSession } from "./redux/reducers/userSlice";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  overflow-x: hidden;
  overflow-y: hidden;
  transition: all 0.2s ease;
`;
const SuccessToast = styled.div`
  position: fixed;
  top: 96px;
  right: 24px;
  z-index: 50;
  padding: 12px 18px;
  border: 1px solid ${({ theme }) => theme.green + 70};
  border-radius: 8px;
  background: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.green};
  box-shadow: 0 8px 22px ${({ theme }) => theme.black + 20};
  font-size: 13px;
  @media (max-width: 600px) {
    right: 16px;
    left: 16px;
    text-align: center;
  }
`;

function App() {
  const { currentUser, authMessage } = useSelector((state) => state.user);
  const [isRestoringSession, setIsRestoringSession] = useState(true);
  const [themeMode, setThemeMode] = useState(
    () => localStorage.getItem("fittrack-theme") || "light"
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("fittrack-app-token");

    if (!token) {
      setIsRestoringSession(false);
      return;
    }

    getCurrentUser(token)
      .then((response) => {
        dispatch(restoreSession(response.data.user));
        setThemeMode(response.data.user.theme || localStorage.getItem("fittrack-theme") || "light");
      })
      .catch(() => dispatch(logout()))
      .finally(() => setIsRestoringSession(false));
  }, [dispatch]);

  useEffect(() => {
    if (!authMessage) return undefined;
    const timer = window.setTimeout(() => dispatch(clearAuthMessage()), 3000);
    return () => window.clearTimeout(timer);
  }, [authMessage, dispatch]);

  useEffect(() => {
    const handleThemeChange = (event) => setThemeMode(event.detail);
    window.addEventListener("fittrack-theme-change", handleThemeChange);
    return () => window.removeEventListener("fittrack-theme-change", handleThemeChange);
  }, []);

  if (isRestoringSession) {
    return null;
  }

  return (
    <ThemeProvider theme={themeMode === "dark" ? darkTheme : lightTheme}>
      <BrowserRouter>
        {currentUser ? (
          <Container>
            {authMessage && <SuccessToast>{authMessage}</SuccessToast>}
            <Navbar currentUser={currentUser} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:slug" element={<BlogDetail />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </Container>
        ) : (
          <Container>
            {authMessage && <SuccessToast>{authMessage}</SuccessToast>}
            <Authentication />
          </Container>
        )}
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
