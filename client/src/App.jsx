import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Import your page components
import Home from "./pages/Home";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Polls from "./pages/Polls";
import Auth from "./pages/Auth";
import Layout from "./components/Layout";
import { getUser } from "./utils/authentication";
import MainPolling from "./pages/MainPolling";

const ProtectedRoute = ({ children }) => {
    const user = getUser();

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    {/* Public routes */}
                    <Route index element={<Navigate to="/home" replace />} />
                    <Route path="home" element={<Home />} />
                    <Route path="polls/:id" element={<MainPolling />} />
                    <Route path="auth" element={<Auth />} />

                    {/* Protected routes */}
                    <Route
                        path="polls"
                        element={
                            <ProtectedRoute>
                                <Polls />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="create"
                        element={
                            <ProtectedRoute>
                                <Create />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="update/:id"
                        element={
                            <ProtectedRoute>
                                <Update />
                            </ProtectedRoute>
                        }
                    />

                    {/* Handle 404 */}
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
