import React, { useEffect, useState } from "react";
import Poll from "../components/Poll"; // Component to display a single poll summary/link
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner"; // Assuming you have this

// --- Reusable Error Icon (Optional) ---
const ErrorIcon = () => (
    <svg className="h-6 w-6 text-red-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
// --- End Error Icon ---

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

const Polls = () => {
    const [polls, setPolls] = useState([]);
    const [loading, setLoading] = useState(true); // Start loading
    const [error, setError] = useState(null);     // Store errors

    const fetchPolls = async () => {
        setLoading(true);
        setError(null);
        // Don't clear polls immediately, maybe show stale data while loading?
        // setPolls([]); // Optional: clear polls at the start of fetch

        try {
            const res = await axios.get(`${apiUrl}/api/polls`, {withCredentials: true});
            console.log("API Response (List):", res.data);

            if (res.data.success) {
                setPolls(res.data.data || []); // Ensure it's an array
            } else if (res.data.error) {
                // Use setError instead of alert
                setError(res.data.error || "An unknown error occurred while fetching polls.");
                setPolls([]); // Clear polls on known API error
            } else {
                 setError("Received an unexpected response from the server.");
                 setPolls([]);
            }
        } catch (err) {
            console.error("Error fetching polls:", err);
            if (err.response) {
                 setError(`Error ${err.response.status}: ${err.response.data?.error || 'Could not fetch polls.'}`);
            } else if (err.request) {
                setError("Could not connect to the server. Please check your network.");
            } else {
                setError("An error occurred while trying to fetch polls.");
            }
            setPolls([]); // Clear polls on network/request error
        } finally {
            setLoading(false); // Stop loading indicator
        }
    };

    useEffect(() => {
        fetchPolls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Runs once on component mount

    // --- Render Logic Helper ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                    <LoadingSpinner className="h-10 w-10" />
                    <p className="mt-4 text-lg">Loading Polls...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex items-center justify-center p-4 bg-red-50 border border-red-200 rounded-md text-red-700 max-w-2xl mx-auto mt-6">
                    <ErrorIcon />
                    <span className="text-sm sm:text-base">{error}</span>
                    {/* Optional: Retry Button */}
                    {/* <button onClick={fetchPolls} className="ml-4 px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700">Retry</button> */}
                </div>
            );
        }

        if (polls.length === 0) {
            return (
                <div className="text-center py-16 text-gray-500">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-700">No Polls Found</h3>
                    <p className="mt-1 text-sm text-gray-500">Get started by creating a new poll.</p>
                     {/* Optional: Link to create poll page */}
                     {/* <Link to="/create-poll" className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create Poll</Link> */}
                </div>
            );
        }

        // Success: Render the list of polls
        return (
             // Use a slightly larger gap for better separation
            <div className="flex flex-col gap-2 sm:gap-2">
                {polls.map((poll) => (
                    // Make sure the 'Poll' component accepts a 'poll' prop
                    <Poll poll={poll} key={poll.id} />
                ))}
            </div>
        );
    };


    return (
         // Added min-height to prevent footer jump
        <div className="pb-8 pt-4 min-h-[calc(100vh-150px)]">
             {/* Centered Title with more emphasis */}
            <h1 className="font-semibold text-xl sm:text-xl text-gray-800 p-4 mb-4 sm:mb-6 container mx-auto px-4">
                Available Polls
            </h1>
             {/* Consistent max-width for content */}
            <div className="max-w-2xl mx-auto px-4">
                {renderContent()}
            </div>
        </div>
    );
};

export default Polls;