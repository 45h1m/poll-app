export const LoadingSpinner = ({ size = "h-12 w-12", color = "border-t-blue-500", borderColor = "border-gray-200", thickness = "border-4" }) => {
    const spinnerClasses = `
       ${size}
       ${thickness}
       ${borderColor}
       ${color}
       rounded-full
       animate-spin
     `;
    return (
        <div role="status">
            {" "}
            {/* Wrapper might be good for the sr-only text placement */}
            <div className={spinnerClasses}></div>
            <span className="sr-only">Loading...</span>
        </div>
    );
};
