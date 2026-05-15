import { useSession } from "@clerk/react";
import { useState } from "react";

const useFetch = (callback, options = {}) => {
    const { session } = useSession();
    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [data, setData] = useState(null);
    
    const fn = async (...args) => {
        setLoading(true);
        setError(null);
        try {
            const supabaseAccessToken = await session.getToken({
                template: "supabase",
            });
            const result = await callback(supabaseAccessToken, options, ...args);
            setData(result);
            setError(null);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, data, fn };
};
export default useFetch;