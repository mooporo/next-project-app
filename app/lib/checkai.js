// เจมส์ : สำหรับตรวจสอบ AI Server ว่า Online หรือไม่
import { useState, useEffect } from 'react';
import { N8N_TUNNEL_URL } from '@/app/lib/config';
import axios from 'axios';

const useAIHealth = () => {
    const [isOnline, setIsOnline] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${N8N_TUNNEL_URL}/webhook/health`)

                if (response.status === 200) {
                    setIsOnline(true);
                }
            } catch (error) {
                console.error("AI Server is offline or URL is wrong:", error.message);
                setIsOnline(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkStatus();

        const intervalId = setInterval(checkStatus, 30000);

        return () => clearInterval(intervalId);
    }, []);

    return { isOnline, isLoading };
};

export default useAIHealth;