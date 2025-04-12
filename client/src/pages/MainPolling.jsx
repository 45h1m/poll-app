import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PollComponent from "../components/PollComponent";
import { LoadingSpinner } from "../components/LoadingSpinner"; // Assuming you have this component

// --- Reusable Error Icon (Optional, but nice) ---
const ErrorIcon = () => (
    <svg className="h-12 w-12 text-red-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);
// --- End Error Icon ---


const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

const MainPolling = () => {
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true); // Start in loading state
    const [error, setError] = useState(null);     // State for error messages
    const { id } = useParams();

    const fetchPoll = async () => {
        setLoading(true); // Set loading true when fetch starts
        setError(null);   // Clear previous errors
        setPoll(null);    // Clear previous poll data

        try {
            const res = await axios.get(`${apiUrl}/api/polls/${id}`, {withCredentials: true});
            console.log("API Response:", res.data);

            if (res.data.success) {
                if (res.data.data) {
                    setPoll(res.data.data);
                } else {
                    // Success response but no data means poll not found
                    setError(`Poll with ID "${id}" not found.`);
                }
            } else if (res.data.error) {
                setError(res.data.error || "An unknown error occurred.");
            } else {
                 setError("Received an unexpected response from the server.");
            }
        } catch (err) {
            console.error("Error fetching poll:", err);
            // Handle specific error types if needed (e.g., network error)
            if (err.response) {
                // Server responded with a status code outside the 2xx range
                 setError(`Error ${err.response.status}: ${err.response.data?.error || 'Could not fetch poll data.'}`);
            } else if (err.request) {
                // The request was made but no response was received
                setError("Could not connect to the server. Please check your network.");
            } else {
                // Something happened in setting up the request that triggered an Error
                setError("An error occurred while trying to fetch the poll.");
            }
        } finally {
            setLoading(false); // Set loading false when fetch completes
        }
    };

    useEffect(() => {
        if (id) {
            // Remove the artificial delay unless needed for testing
            // setTimeout(() => {
            //     fetchPoll();
            // }, 2000);
             fetchPoll(); // Fetch immediately
        } else {
            setError("No Poll ID provided in the URL.");
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Re-fetch if the ID parameter changes

    // --- Render Logic ---
    const renderContent = () => {
        if (loading) {
            return (
                <div className="w-full h-[60vh] flex flex-col gap-4 justify-center items-center text-gray-500">
                    <LoadingSpinner className="h-10 w-10" />
                    <p className="text-lg">Loading Poll...</p>
                </div>
            );
        }

        if (error) {
             return (
                <div className="w-full h-[60vh] flex flex-col gap-2 justify-center items-center text-center text-red-600 px-4">
                    <ErrorIcon />
                    <h2 className="text-xl font-semibold">Loading Failed</h2>
                    <p>{error}</p>
                    {/* Optional: Add a retry button */}
                    {/* <button onClick={fetchPoll} className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Try Again</button> */}
                </div>
            );
        }

        if (poll) {
            // Poll loaded successfully
            return <PollComponent pollData={poll} />;
        }

        // Should ideally not be reached if logic is correct, but as a fallback:
        return (
             <div className="w-full h-[60vh] flex justify-center items-center text-gray-500">
                Poll data could not be loaded.
            </div>
        );
    };

    return (
        // Adjust padding as needed, min-height helps keep footer down
        <div className="p-4 md:p-8 min-h-[calc(100vh-100px)]">
            <h1 className="font-semibold text-xl sm:text-xl text-gray-800 p-4 mb-4 sm:mb-6 max-w-2xl mx-auto">
                Start Polling
            </h1>
            {renderContent()}
        </div>
    );
};

export default MainPolling;