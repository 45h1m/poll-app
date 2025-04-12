import React, { useEffect, useState } from "react";
import PollForm from "../components/PollForm";
import { useParams } from "react-router-dom";
import axios from "axios";
import { LoadingSpinner } from "../components/LoadingSpinner";

const Update = () => {
    const [poll, setPoll] = useState(null);
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost";

    const { id } = useParams();

    async function fetchPoll() {
        try {
            const res = await axios.get(`${apiUrl}/api/polls/${id}`, {withCredentials: true});
            console.log(res.data);
            if (res.data.success && res.data.data) {
                setPoll(res.data.data);
            } else if (res.data.error) {
                console.log(res.data.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        setTimeout(() => {
            fetchPoll();
        }, 2000);
    }, []);

    return (
        <div className="p-4">
            {poll ? (
                <PollForm existingPoll={poll} />
            ) : (
                <div className="w-full h-[50vh] flex flex-col gap-2 justify-center items-center">
                    <LoadingSpinner />
                </div>
            )}
        </div>
    );
};

export default Update;
