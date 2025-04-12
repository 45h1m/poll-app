import axios from "axios";
import { useState } from "react";
import { useModal } from "../contexts/ModalContext";
import CopyToClipboard from "./CopyToClipboard";

// --- SVG Icons (remain the same) ---
const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const ErrorIcon = () => (
    <svg className="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const SuccessIcon = () => (
    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// --- End SVG Icons ---


const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

export default function PollForm({ existingPoll = null }) {
    const [poll, setPoll] = useState({
        id: existingPoll?.id || "",
        question: existingPoll?.question || "",
        theme: existingPoll?.theme || "strawberry",
        options: existingPoll?.options || [
            { text: "", votes: 0 },
            { text: "", votes: 0 },
        ],
        accepting: existingPoll?.accepting !== undefined ? existingPoll.accepting : true,
    });

    const isEditing = (!!existingPoll);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    const { openModal } = useModal();

    // Theme definitions remain the same - these are separate from the main UI accent
    const themes = [
        { id: "strawberry", color: "bg-red-400", ring: "ring-red-500" },
        { id: "blueberry", color: "bg-blue-400", ring: "ring-blue-500" }, // Note: this blue is for the theme, not the main UI accent
        { id: "grape", color: "bg-purple-400", ring: "ring-purple-500" },
        { id: "lime", color: "bg-green-400", ring: "ring-green-500" },
        { id: "orange", color: "bg-orange-400", ring: "ring-orange-500" },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        const formData = {
            ...poll,
            createdAt: isEditing ? existingPoll.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: isEditing ? existingPoll.createdBy : "current-user-id", // TODO: Replace with actual user ID
        };

        console.log("Submitting poll data:", formData);

        try {
            let res = null;
            const url = isEditing ? `${apiUrl}/api/update/${poll.id}` : `${apiUrl}/api/polls`;
            res = await axios.post(url, formData, {withCredentials: true});

            console.log("API Response:", res);

            if (res.data.success) {
                const successMsg = `Poll ${isEditing ? "updated" : "created"} successfully!`;
                setMessage(successMsg);

                if (!isEditing) {
                     setPoll({
                         id: "", question: "", theme: "strawberry",
                         options: [{ text: "", votes: 0 }, { text: "", votes: 0 }],
                         accepting: true
                     });
                }

                openModal(
                     <div className="p-4 bg-white rounded-lg shadow-xl max-w-xl">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Poll {isEditing ? "Updated" : "Created"}!</h3>
                        <p className="text-sm text-gray-600 mb-4">Share this link with others:</p>
                        <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded">
                            <CopyToClipboard link={`${window.location.origin}/polls/${res.data.data.id}`}/>
                        </div>
                    </div>
                );

            } else if (res.data.error) {
                setError(res.data.error || `Failed to ${isEditing ? "update" : "create"} poll.`);
            } else {
                 setError(`An unexpected response occurred while ${isEditing ? "updating" : "creating"} the poll.`);
            }
        } catch (err) {
            console.error("API Error:", err);
            const errorMsg = err.response?.data?.error || err.message || `An error occurred while ${isEditing ? "updating" : "creating"} the poll.`;
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    // --- Input Handlers (remain the same) ---
    const handleQuestionChange = (e) => setPoll({ ...poll, question: e.target.value });
    const handleThemeChange = (themeId) => setPoll({ ...poll, theme: themeId });
    const handleOptionChange = (index, value) => {
        const newOptions = [...poll.options];
        newOptions[index] = { ...newOptions[index], text: value };
        setPoll({ ...poll, options: newOptions });
    };
    const handleVotesChange = (index, value) => {
        const votes = parseInt(value) || 0;
        const newOptions = [...poll.options];
        newOptions[index] = { ...newOptions[index], votes };
        setPoll({ ...poll, options: newOptions });
    };
    const addOption = () => setPoll({ ...poll, options: [...poll.options, { text: "", votes: 0 }] });
    const removeOption = (index) => {
        if (poll.options.length <= 2) {
            setError("Polls must have at least 2 options.");
            return;
        }
        setError(null);
        const newOptions = poll.options.filter((_, i) => i !== index);
        setPoll({ ...poll, options: newOptions });
    };
    const toggleAccepting = () => setPoll({ ...poll, accepting: !poll.accepting });
    // --- End Input Handlers ---

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">{isEditing ? "Update Poll" : "Create a New Poll"}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Poll Question */}
                <div>
                    <label htmlFor="poll-question" className="block text-sm font-medium text-gray-700 mb-1">Poll Question</label>
                    <input
                        id="poll-question"
                        type="text"
                        value={poll.question}
                        onChange={handleQuestionChange}
                        required
                        // Changed focus ring/border to blue-500
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                        placeholder="e.g., What's your favorite framework?"
                    />
                </div>

                {/* Theme Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div className="flex space-x-3">
                        {/* Theme button rings remain based on their specific color */}
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                type="button"
                                onClick={() => handleThemeChange(theme.id)}
                                className={`w-9 h-9 rounded-full ${theme.color} transition duration-150 ease-in-out focus:outline-none ${
                                    poll.theme === theme.id
                                        ? `ring-2 ring-offset-2 ${theme.ring}` // Use theme-specific ring
                                        : "hover:ring-2 hover:ring-offset-1 hover:ring-gray-400"
                                }`}
                                aria-label={`${theme.id} theme`}
                            />
                        ))}
                    </div>
                </div>

                {/* Poll Options */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                    <div className="space-y-3">
                        {poll.options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-3">
                                <div className="flex-grow">
                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, e.target.value)}
                                        required
                                        // Changed focus ring/border to blue-500
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                        placeholder={`Option ${index + 1}`}
                                    />
                                </div>

                                {isEditing && (
                                    <div className="w-24 shrink-0">
                                        <input
                                            type="number"
                                            value={option.votes}
                                            onChange={(e) => handleVotesChange(index, e.target.value)}
                                            min="0"
                                            // Changed focus ring/border to blue-500
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
                                            placeholder="Votes"
                                            aria-label={`Votes for option ${index + 1}`}
                                        />
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    disabled={poll.options.length <= 2}
                                    className={`p-2 text-gray-400 rounded-full transition duration-150 ease-in-out ${
                                        poll.options.length > 2
                                            ? "hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400" // Added focus style for accessibility
                                            : "opacity-50 cursor-not-allowed"
                                    }`}
                                    aria-label="Remove option"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addOption}
                         // Changed focus ring to blue-500
                        className="mt-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                    >
                        + Add Option
                    </button>
                </div>

                {/* Accept Votes Toggle */}
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-gray-200">
                     <span className="text-sm font-medium text-gray-700">
                         {poll.accepting ? "Accepting new votes" : "Voting closed"}
                     </span>
                    <button
                        type="button"
                        onClick={toggleAccepting}
                        // Changed background and focus ring to blue-500/600
                        className={`${
                            poll.accepting ? 'bg-blue-600' : 'bg-gray-300' // Use blue-600 for 'on' state
                        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                        role="switch"
                        aria-checked={poll.accepting}
                    >
                        <span
                            aria-hidden="true"
                            className={`${
                                poll.accepting ? 'translate-x-5' : 'translate-x-0'
                            } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                        />
                    </button>
                </div>

                 {/* Message Area (remains the same) */}
                <div className="mt-6 space-y-3">
                    {error && (
                        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                            <ErrorIcon />
                            <span>{error}</span>
                        </div>
                    )}
                    {message && (
                         <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
                            <SuccessIcon />
                            <span>{message}</span>
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        disabled={loading}
                        type="submit"
                         // Changed background, hover, focus ring to blue-500/600/700
                        className={`inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                            loading
                                ? "bg-blue-400 cursor-not-allowed" // Lighter blue for disabled state
                                : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" // Standard blue states
                        } transition duration-150 ease-in-out`}
                    >
                        {loading && <LoadingSpinner />}
                        {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Poll" : "Create Poll")}
                    </button>
                </div>
            </form>
        </div>
    );
}