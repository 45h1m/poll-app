import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

// --- Reusable Icons (remain the same) ---
const LoadingSpinner = ({ className = "h-5 w-5" }) => (
    <svg className={`animate-spin ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const CheckCircleIcon = ({ className = "h-5 w-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
);

const ErrorIcon = () => (
    <svg className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const SuccessIcon = () => (
    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);
// --- End Icons ---

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

export default function PollComponent({ pollData }) {
    const [poll, setPoll] = useState(pollData);
    const [selectedOption, setSelectedOption] = useState(null);
    const [optimisticVoteIndex, setOptimisticVoteIndex] = useState(null);
    const [isVoting, setIsVoting] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [hasVoted, setHasVoted] = useState(false);

    const { id } = useParams();

    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    // Function to get theme-specific classes - expanded for backgrounds and text contrast
    const getThemeClasses = (theme) => {
        switch (theme) {
            case "strawberry":
                return {
                    bgLight: "bg-red-50", // For main component background
                    progress: "bg-red-500", // For progress fill
                    border: "border-red-600", // For selected border emphasis
                    text: "text-red-800", // Default text related to theme (optional)
                    textSelected: "text-gray-900", // Text color on top of progress fill
                    icon: "text-red-600", // Icon colors (loading/check)
                    iconSelected: "text-white", // Icon color when selected
                };
            case "blueberry":
                 return { bgLight: "bg-blue-50", progress: "bg-blue-500", border: "border-blue-600", text: "text-blue-800", textSelected: "text-white", icon: "text-blue-600", iconSelected: "text-white" };
            case "grape":
                return { bgLight: "bg-purple-50", progress: "bg-purple-500", border: "border-purple-600", text: "text-purple-800", textSelected: "text-white", icon: "text-purple-600", iconSelected: "text-white" };
            case "lime":
                return { bgLight: "bg-green-50", progress: "bg-green-500", border: "border-green-600", text: "text-green-800", textSelected: "text-white", icon: "text-green-600", iconSelected: "text-white" };
            case "orange":
                return { bgLight: "bg-orange-50", progress: "bg-orange-500", border: "border-orange-600", text: "text-orange-800", textSelected: "text-white", icon: "text-orange-600", iconSelected: "text-white" };
            default: // Default to blue
                 return { bgLight: "bg-blue-50", progress: "bg-blue-500", border: "border-blue-600", text: "text-blue-800", textSelected: "text-white", icon: "text-blue-600", iconSelected: "text-white" };
        }
    };

    const themeClasses = getThemeClasses(poll.theme);

    useEffect(() => {
        setMessage(null);
        setError(null);
    }, [pollData]);


    const handleVote = async (index) => {
        if (hasVoted || !poll.accepting || isVoting) return;

        setMessage(null);
        setError(null);
        setIsVoting(true);
        setOptimisticVoteIndex(index);

        try {
            const res = await axios.post(`${apiUrl}/api/polls/vote/${id}`, {
                optionIndex: index,
            }, { withCredentials: true });

            if (res.data.success) {
                setMessage(res.data.message || "Vote cast successfully!");
                setHasVoted(true);
                setSelectedOption(index);

                 const updatedPoll = { ...poll };
                 updatedPoll.options[index].votes += 1;
                 // updatedPoll.accepting = false; // Optional: Close poll for user after voting
                 setPoll(updatedPoll);

            } else {
                 setError(res.data.error || "An unknown error occurred while voting.");
            }
        } catch (err) {
            console.error("Vote Error:", err);
            setError(err.response?.data?.error || err.message || "Failed to connect to the server.");
            // Revert optimistic UI if vote fails (optional, but good practice)
            // setSelectedOption(null); // Uncomment if you want selection visual to disappear on error
        } finally {
            setIsVoting(false);
            setOptimisticVoteIndex(null);
        }
    };

    const canVote = poll.accepting && !hasVoted && !isVoting;
    const votingClosedPermanently = !poll.accepting;

    return (
        // Added subtle theme background color
        <div className={`rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8 max-w-lg mx-auto ${themeClasses.bgLight}`}>
            {/* Changed heading color for better contrast on light theme bg */}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">{poll.question}</h2>

            <div className="space-y-3 sm:space-y-4">
                {poll.options.map((option, index) => {
                    const percentage = totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0;
                    const isCurrentlySelected = selectedOption === index;
                    const isBeingVotedFor = optimisticVoteIndex === index;

                    // Determine text/icon color based on selection state for contrast
                    const contentColor = isCurrentlySelected ? themeClasses.textSelected : 'text-gray-700';
                    const spinnerColor = isCurrentlySelected ? themeClasses.iconSelected : themeClasses.icon; // Spinner color

                    return (
                        <div
                            key={index}
                            onClick={() => handleVote(index)}
                            className={`
                                relative border rounded-lg overflow-hidden transition-all duration-150 ease-in-out group bg-white shadow-sm
                                ${canVote ? 'cursor-pointer hover:border-gray-400' : 'cursor-not-allowed'}
                                ${isCurrentlySelected ? `border-2 ${themeClasses.border}` : 'border-gray-200'}
                                ${isVoting ? 'pointer-events-none opacity-80' : ''}
                            `}
                            aria-disabled={!canVote || isVoting}
                        >
                            {/* Progress Fill Background */}
                            <div
                                className={`absolute top-0 left-0 bottom-0 ${themeClasses.progress} opacity-30 transition-all duration-500 ease-out`}
                                style={{ width: `${percentage}%` }}
                                role="presentation" // It's decorative
                            ></div>

                            {/* Content Layer (Above Progress) */}
                            <div className="relative z-10 flex items-center justify-between p-3 sm:p-4">
                                <span className={`font-medium ${contentColor} transition-colors duration-200 ease-in-out`}>
                                    {option.text}
                                </span>

                                <div className="flex items-center space-x-2">
                                    {/* Vote Count/Percentage */}
                                    <span className={`text-xs sm:text-sm font-medium ${contentColor} transition-colors duration-200 ease-in-out`}>
                                         {percentage}% ({option.votes})
                                    </span>

                                    {/* Spinner or Checkmark */}
                                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                                        {isBeingVotedFor && isVoting && <LoadingSpinner className={`h-4 w-4 sm:h-5 sm:w-5 ${spinnerColor}`} />}
                                        {isCurrentlySelected && !isVoting && <CheckCircleIcon className={`h-5 w-5 sm:h-6 sm:w-6 text-green-500`} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Status/Action Text */}
            <div className="mt-6 text-sm text-center text-gray-700"> {/* Adjusted color for better contrast */}
                {isVoting && "Submitting your vote..."}
                {!isVoting && canVote && "Select an option to cast your vote."}
                {!isVoting && hasVoted && !votingClosedPermanently && "Thank you for voting!"}
                {votingClosedPermanently && "Voting is closed for this poll."}
            </div>

            {/* Message Area */}
            <div className="mt-4 space-y-3">
                {error && (
                    <div className="flex items-start p-3 bg-red-100 border border-red-300 rounded-md text-sm text-red-800"> {/* Slightly adjusted message colors */}
                        <ErrorIcon />
                        <span>{error}</span>
                    </div>
                )}
                {message && (
                     <div className="flex items-start p-3 bg-green-100 border border-green-300 rounded-md text-sm text-green-800"> {/* Slightly adjusted message colors */}
                        <SuccessIcon />
                        <span>{message}</span>
                    </div>
                )}
            </div>
        </div>
    );
}