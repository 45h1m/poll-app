import { useState } from "react";
import { Copy, Check } from "lucide-react"; // Using lucide-react icons

export default function CopyToClipboard({ link = "https://example.com" }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async () => {
        // Check if running in a secure context (required for navigator.clipboard)
        if (!navigator.clipboard || !window.isSecureContext) {
            console.warn("Clipboard API not available or not in secure context.");
            // You could implement a fallback here if needed (e.g., using document.execCommand)
            // For simplicity, we'll just log a warning.
            return;
        }

        try {
            await navigator.clipboard.writeText(link);
            setCopied(true);

            // Reset copied state after 2 seconds
            setTimeout(() => {
                setCopied(false);
            }, 2000);

            // Optional: Clear timeout if component unmounts before 2s
            // return () => clearTimeout(timer); // You'd need useEffect for this cleanup logic

        } catch (error) {
            console.error("Failed to copy link: ", error);
            // Optionally show an error state to the user
        }
    };

    return (
        <div className="flex items-center gap-2 max-w-md w-full">
            {/* Input Field - Material "Filled" Style Inspiration */}
            <input
                type="text"
                value={link}
                readOnly
                className="
                    flex-grow p-3                        
                    text-sm text-gray-800               
                    bg-gray-100                         
                    border-b-2 border-gray-300          
                    rounded-t-md                        
                    focus:outline-none                  
                    focus:border-blue-500               
                    transition-colors duration-200 ease-in-out 
                    hover:bg-gray-200                   
                "
                aria-label="Link to copy"
            />

            {/* Button - Material Icon Button Style Inspiration */}
            <button
                onClick={copyToClipboard}
                className={`
                    flex items-center justify-center 
                    p-3                                
                    rounded-md                         
                    text-white                         
                    transition-all duration-200 ease-in-out
                    shadow-md                          
                    focus:outline-none                 
                    focus:ring-2 focus:ring-offset-1 focus:ring-blue-400 
                    ${copied 
                        ? 'bg-green-500 hover:bg-green-600 shadow-lg' // Green feedback for success
                        : 'bg-blue-500 hover:bg-blue-600 hover:shadow-lg' // Standard blue button
                    }
                `}
                aria-label={copied ? "Link copied" : "Copy link"}
                title={copied ? "Copied!" : "Copy link to clipboard"} // Tooltip for clarity
            >
                {copied ? (
                    <Check size={20} aria-hidden="true" /> // Use size 20 for better visibility in p-3 button
                ) : (
                    <Copy size={20} aria-hidden="true" />
                )}
            </button>
        </div>
    );
}