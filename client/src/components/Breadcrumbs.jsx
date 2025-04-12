import { ArrowLeft } from "lucide-react";
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

// Optional: Define an icon component or use a library like react-icons
// import { FiChevronLeft } from 'react-icons/fi';

const Breadcrumbs = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Get path segments, filter out empty strings
    const pathnames = location.pathname.split("/").filter((x) => x);

    const handleBack = () => {
        navigate(-1); // Go back one step in history
    };

    // Function to format segment names (e.g., capitalize, replace hyphens)
    const formatSegment = (segment) => {
        if (!segment) return "";
        // Decode URI component first (e.g., %20 becomes space)
        const decodedSegment = decodeURIComponent(segment);
        // Replace hyphens/underscores with spaces, then capitalize words
        return decodedSegment.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
    };

    return (
        <div className="bg-gray-100 border-b border-gray-200 flex items-center overflow-x-auto">
            <nav
                aria-label="breadcrumb"
                className="flex container mx-auto items-center gap-4 p-3 px-4 text-smrounded-md w-[150vw]" // Added rounded, margin-bottom for spacing
            >
                {/* Back Button */}
                <button
                    onClick={handleBack}
                    className="flex items-center px-2 py-1 font-semibold text-gray-600 transition-colors duration-200 ease-in-out border border-gray-200 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
                    aria-label="Go back"
                >
                    {/* Option 1: Text */}
                    <ArrowLeft />
                    {/* Option 2: Icon (requires installing react-icons: npm install react-icons) */}
                    {/* <FiChevronLeft className="w-4 h-4 mr-1" />
                Back */}
                </button>

                {/* Breadcrumb Links List */}
                <ol className="flex items-center list-none p-0 m-0 flex-wrap">
                    {/* Home Link Logic */}
                    {location.pathname !== "/" ? (
                        <li className="flex items-center">
                            <Link to="/" className="text-gray-600 transition-colors duration-150 hover:text-blue-800 hover:underline">
                                Home
                            </Link>
                        </li>
                    ) : (
                        <li className="flex items-center">
                            <span className="font-semibold text-gray-700" aria-current="page">
                                Home
                            </span>
                        </li>
                    )}

                    {/* Path Segment Links */}
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathnames.length - 1;
                        const displayName = formatSegment(value);

                        // Don't render if display name is empty (could happen with trailing slash logic)
                        if (!displayName) return null;

                        return (
                            <li key={to} className="flex items-center">
                                {/* Separator - Always add unless it's the very first item (which is handled by the Home logic above) */}
                                <span className="mx-2 text-gray-400">/</span>

                                {isLast ? (
                                    <span className="font-semibold text-gray-700 w-20 whitespace-nowrap truncate" aria-current="page">
                                        {displayName}
                                    </span>
                                ) : (
                                    <Link to={to} className="text-blue-600 transition-colors duration-150 hover:text-blue-800 hover:underline">
                                        {displayName}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </nav>
        </div>
    );
};

export default Breadcrumbs;
