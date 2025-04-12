import { useState, useEffect, useRef } from "react";
import { getUser, logOut } from "../utils/authentication";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/pollups-logo.png';

export default function Header() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const pathname = useLocation().pathname;

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = getUser();
                console.log(userData);
                setUser(userData);
            } catch (error) {
                console.error("Failed to get user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Function to get user initials for avatar
    const getUserInitials = () => {
        if (!user || !user.email) return "U";
        return user.email.charAt(0).toUpperCase();
    };

    const handleLogout = () => {
        // Implement logout functionality here
        console.log("Logging out...");
        logOut();
        setDropdownOpen(false);
    };

    return (
        <header className="bg-white text-gray-800 shadow-xs sticky top-0 z-10">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to={"/home"} className="flex items-center gap-2">
                    <img src={logo} alt="pollups-logo" className="w-10" />
                    <p className={`text-xl font-semibold sm:block hidden text-gray-600`}>Pollups</p>
                </Link>

                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="text-gray-500 text-sm">Loading...</div>
                    ) : user ? (
                        <>
                            {user && pathname !== "/polls" && (
                                <Link to="/polls" className="inline-block">
                                    <button className="bg-transparent hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200">
                                        Your Polls
                                    </button>
                                </Link>
                            )}

                            {pathname !== "/create" && (
                                <Link to="/create" className="inline-block">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:shadow">
                                        Create Poll
                                    </button>
                                </Link>
                            )}

                            {/* Avatar with dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium shadow-sm hover:bg-blue-600 transition-colors duration-200 focus:outline-none"
                                >
                                    {getUserInitials()}
                                </button>
                                
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                        <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                                            {user.email}
                                        </div>
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile
                                        </Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        pathname !== "/auth" && (
                            <Link to="/auth" className="inline-block">
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-sm transition-all duration-200 hover:shadow">
                                    Login
                                </button>
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
}