import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, ChevronDown, ChevronUp } from "lucide-react";
import CopyToClipboard from "./CopyToClipboard";
// const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

const Poll = ({ poll }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

    const handleEdit = () => {
        navigate(`/update/${poll.id}`);
    };

    const toggleExpand = () => {
        setExpanded(!expanded);
    };

    // Calculate percentage for progress bars
    const getPercentage = (votes) => {
        if (totalVotes === 0) return 0;
        return Math.round((votes / totalVotes) * 100);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-4 border border-pink-100 max-w-3xl mx-auto w-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-pink-500 mr-2 ${poll.theme === "strawberry" ? "bg-pink-500" : "bg-blue-500"}`}></div>
                    <h3 className="font-medium text-gray-800">{poll.question}</h3>
                </div>
                <div className="flex items-center">
                    <button onClick={handleEdit} className="p-1 text-gray-500 hover:text-pink-500 transition-colors" aria-label="Edit poll">
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={toggleExpand}
                        className="ml-2 p-1 text-gray-500 hover:text-pink-500 transition-colors"
                        aria-label={expanded ? "Collapse poll" : "Expand poll"}
                    >
                        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {expanded && (
                <div className="mt-4 space-y-3">
                    {poll.options.map((option, index) => (
                        <div key={index} className="space-y-1">
                            <div className="flex justify-between text-sm">
                                <span>{option.text}</span>
                                <span className="text-gray-500">
                                    {option.votes} votes ({getPercentage(option.votes)}%)
                                </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${getPercentage(option.votes)}%` }}></div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-2 text-xs text-gray-500 flex justify-between items-center">
                        <span>Total: {totalVotes} votes</span>
                        <span>Created: {new Date(poll.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="pt-1 text-xs grid gap-2">
                        <span
                            className={`inline-block px-2 py-1 rounded-full w-fit ${
                                poll.accepting ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                            }`}
                        >
                            {poll.accepting ? "Accepting votes" : "Closed"}
                        </span>
                        <CopyToClipboard link={`${window.location.origin}/polls/${poll.id}`} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Poll;
