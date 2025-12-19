"use client";
import { api } from "@/lib/axios";
import axios from "axios";
import { useEffect, useState } from "react";

const HealthCheck = () => {
    const [message, setMessage] = useState({ message: "", data: "" });
    const [loading, setLoading] = useState(false);

    const fetchHealth = async () => {
        try {
            setLoading(true);

            const response = await api.get("/healthcheck");
            
            setMessage({
                message: response.data.message,
                data: response.data.data,
            });
        } catch (error) {
            setMessage({
                message: "Bad Request",
                data: "Backend is not reacheable",
            });
        } finally {
            setLoading(false);
        }
    };

    // useEffect(() => {
    //     fetchHealth();
    // }, []);

    return (
        <div>
            <h1>Healthcheck</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <p>{message.message}</p>
                    <p>{message.data}</p>
                </>
            )}

            <button onClick={fetchHealth}>Get health</button>
        </div>
    );
};

export default HealthCheck;
