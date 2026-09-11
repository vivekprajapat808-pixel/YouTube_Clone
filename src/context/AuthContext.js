import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const USERS_STORAGE_KEY = "yt_clone_users";
const CURRENT_USER_KEY = "yt_clone_current_user";

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signin"); // "signin" | "signup"

  // Load existing session on initial mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(CURRENT_USER_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse stored user from localStorage:", error);
    }
  }, []);

  // Helper to retrieve all registered users
  const getRegisteredUsers = () => {
    try {
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  };

  // Sign Up
  const signup = ({ name, email, password, avatar }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    const existingUser = users.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (existingUser) {
      throw new Error("An account with this email already exists.");
    }

    const newUser = {
      id: "usr_" + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      password, // Stored in localStorage for client-side demo
      avatar:
        avatar ||
        `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    // Automatically sign in the newly registered user
    const sessionUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
    };
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setAuthModalOpen(false);
    return sessionUser;
  };

  // Sign In
  const login = ({ email, password }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const users = getRegisteredUsers();

    const user = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail && u.password === password
    );

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    };
    setCurrentUser(sessionUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
    setAuthModalOpen(false);
    return sessionUser;
  };

  // Sign Out
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const openAuthModal = (mode = "signin") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        authModalOpen,
        authMode,
        setAuthMode,
        openAuthModal,
        closeAuthModal,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
