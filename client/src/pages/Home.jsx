import React from "react";
import { Link } from "react-router-dom";
// Optional: Icons
// import { ChartBarIcon, LinkIcon, CogIcon, UserGroupIcon } from '@heroicons/react/24/outline';

function Home() {
    return (
        // Apply the subtle pattern class to the outermost container
        // Sections inside will layer on top with their own backgrounds
        <div className="bg-subtle-dots min-h-screen">
            {/* Hero Section - Now with a subtle gradient */}
            <section className="bg-blue-500 bg-gradient-to-br from-white/80 via-blue-50 to-blue-100/50 shadow-sm">
                {" "}
                {/* Subtle Gradient */}
                <div className="container mx-auto px-6 py-20 md:py-28 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Create & Share Polls, Instantly.
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                        Effortlessly create engaging polls, share them instantly with a public link, and gather valuable feedback in real-time. See
                        votes appear live and manage all your polls from one simple, powerful dashboard. Customize your polls to perfectly match your
                        needs.
                    </p>
                    <Link to="/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
                        Create A Poll Free
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">No credit card required.</p>
                </div>
            </section>

            {/* Features Section - Keep background clean or slightly transparent if needed */}
            {/* Using bg-transparent allows the dot pattern from the parent to show through faintly */}
            {/* Or use bg-gray-50/95 for slight opacity if needed */}
            <section className="py-16 md:py-24 bg-transparent">
                {" "}
                {/* Or try bg-gray-50/95 */}
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Everything You Need to Poll Smarter</h2>
                    {/* Feature Cards remain opaque white to stand out */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {/* Feature 1: Create Polls */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/50 text-center md:text-left transform hover:scale-105 transition-transform duration-300 ease-out">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-flex mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Poll Creation</h3>
                            <p className="text-gray-600">Sign up in seconds and build your polls with our intuitive interface.</p>
                        </div>

                        {/* Feature 2: Share Polls */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/50 text-center md:text-left transform hover:scale-105 transition-transform duration-300 ease-out">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-flex mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Shareable Links</h3>
                            <p className="text-gray-600">Generate unique public links for each poll to easily share anywhere.</p>
                        </div>

                        {/* Feature 3: Real-time Results */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/50 text-center md:text-left transform hover:scale-105 transition-transform duration-300 ease-out">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-flex mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                                    />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Live Voting & Results</h3>
                            <p className="text-gray-600">Watch votes come in live and view clear results as they happen.</p>
                        </div>

                        {/* Feature 4: Manage & Customize */}
                        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200/50 text-center md:text-left transform hover:scale-105 transition-transform duration-300 ease-out">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-3 inline-flex mb-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.43.992a6.759 6.759 0 0 1 0 1.316c.008.378.137.75.43.99l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.333.184-.582.496-.645.87l-.213 1.28c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.759 6.759 0 0 1 0-1.316c-.007-.378-.137-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.490l1.217.456c.355.133.75.072 1.076-.124.072-.044.146-.087.22-.128.332-.184.582-.496.644-.87l.213-1.28Z"
                                    />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">Manage & Customize</h3>
                            <p className="text-gray-600">Keep polls organized, view history, and customize options to fit your specific needs.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Home;
