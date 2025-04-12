import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, AlertTriangle, CheckCircle } from "lucide-react"; // Added icons for messages
import axios from "axios";
import Cookies from "js-cookie"; // Note: Cookies are imported but not used yet.

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        // Clear messages when user starts typing again
        setError(null);
        setMessage(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            let res = null;
            const endpoint = isLogin ? `${apiUrl}/api/login` : `${apiUrl}/api/register`;
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { username: formData.name, email: formData.email, password: formData.password }; // Include name for registration

            res = await axios.post(endpoint, payload, { withCredentials: true });

            console.log("API Response:", res);

            if (res.data.success) {
                setMessage(res.data.message || `${isLogin ? "Login" : "Signup"} successful!`);
                // In a real app, you would likely:
                // 1. Store the token (e.g., res.data.token) in Cookies or localStorage
                //    Cookies.set('authToken', res.data.token, { expires: 7 }); // Example
                // 2. Redirect the user or update the application state
                //    window.location.href = '/dashboard'; // Example redirect
                // Reset form only on success
                setFormData({ name: "", email: "", password: "" });

                if(res.data.data && res.data.data.token) {
                    // document.cookie = `access_token=${res.data.data.token}`; 
                }
                location.reload();
            } else if (res.data.error) {
                setError(res.data.error || `An unknown error occurred during ${isLogin ? "login" : "signup"}.`);
            } else {
                // Handle cases where response might not have 'success' or 'error' keys as expected
                setError(`Unexpected response format from server.`);
            }
        } catch (err) {
            console.error("API Call Error:", err);
            let errorMessage = `Error ${isLogin ? "logging in" : "signing up"}.`;
            if (err.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Error Response Data:", err.response.data);
                console.error("Error Response Status:", err.response.status);
                // Try to get a specific error message from the backend response
                const backendError = err.response.data?.error || err.response.data?.message || JSON.stringify(err.response.data);
                errorMessage = `${errorMessage} Server responded with: ${backendError} (Status: ${err.response.status})`;
            } else if (err.request) {
                // The request was made but no response was received
                console.error("Error Request:", err.request);
                errorMessage = `${errorMessage} No response received from server. Please check your network connection and the API endpoint (${apiUrl}).`;
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Error Message:", err.message);
                errorMessage = `${errorMessage} ${err.message}`;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        // Reset form data and messages when switching modes
        setFormData({
            name: "",
            email: "",
            password: "",
        });
        setError(null);
        setMessage(null);
        setShowPassword(false); // Also reset password visibility
    };

    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Added min-h-screen, background, and padding for better page layout */}
            <div
                className={`bg-white p-8 rounded-lg shadow-xl w-full max-w-md transition-opacity duration-300 ${
                    loading ? "opacity-70 pointer-events-none" : "opacity-100"
                }`}
            >
                {/* Enhanced shadow and transition */}
                <div className="text-center mb-8">
                    {/* Optional: Add a logo here */}
                    <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-500 to-blue-300 text-transparent bg-clip-text">
                        {isLogin ? "Welcome Back" : "Create Your Account"}
                    </h1>
                </div>

                {/* Display Messages/Errors Above the Form */}
                <div className="mb-4 space-y-3">
                    {error && (
                        <div className="flex items-start p-3 bg-red-100 border border-red-300 text-red-800 rounded-md text-sm max-h-20 overflow-auto">
                            <AlertTriangle size={18} className="mr-2 flex-shrink-0 text-red-600 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}
                    {message && (
                        <div className="flex items-start p-3 bg-green-100 border border-green-300 text-green-800 rounded-md text-sm max-h-20 overflow-auto">
                            <CheckCircle size={18} className="mr-2 flex-shrink-0 text-green-600 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {" "}
                    {/* Added space-y-6 for consistent spacing */}
                    {/* Name Field - Only shown for signup */}
                    {!isLogin && (
                        <div>
                            {" "}
                            {/* Wrapped inputs in divs for better spacing control */}
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>{" "}
                            {/* Added label for accessibility */}
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User size={18} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" // Adjusted focus style
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required={!isLogin}
                                    aria-label="Name"
                                />
                            </div>
                        </div>
                    )}
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email address
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email" // Added autocomplete
                                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                aria-label="Email address"
                            />
                        </div>
                    </div>
                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock size={18} className="text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                autoComplete={isLogin ? "current-password" : "new-password"} // Added autocomplete
                                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                placeholder={isLogin ? "Password" : "Create a password"}
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                aria-label="Password"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none" // Added focus style
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? "Hide password" : "Show password"} // Accessibility
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                    {/* Terms & Conditions (Signup Only) */}
                    {!isLogin && (
                        <div className="flex items-start">
                            {" "}
                            {/* Changed to items-start for better alignment with multiline text */}
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    required
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="font-medium text-gray-700">
                                    I agree to the{" "}
                                    <a href="#" className="text-indigo-600 hover:underline">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-indigo-600 hover:underline">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>
                        </div>
                    )}
                    {/* Submit Button */}
                    <div>
                        {" "}
                        {/* Wrapped button in div for consistent spacing */}
                        <button
                            type="submit"
                            disabled={loading} // Disable button when loading
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition ease-in-out duration-150" // Added disabled styles and transition
                        >
                            {/* Show loading text */}
                            {loading ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    {isLogin ? "Signing In..." : "Creating Account..."}
                                </>
                            ) : isLogin ? (
                                "Sign In"
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                {/* Removed Social Login for brevity, can be added back if needed */}

                {/* Footer - Switch between Login/Signup */}
                <p className="mt-8 text-center text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline" // Added focus styles
                        onClick={toggleAuthMode}
                        disabled={loading} // Also disable this button when loading
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}
