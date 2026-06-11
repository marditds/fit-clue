import { useState } from "react";
import { assessCommentWithGemini } from "../context/dbhandler";

export const useGemini = () => {

    const [isRunningGemini, setIsRunningGemini] = useState(false);

    const runGemini = async (commentText) => {
        setIsRunningGemini(true);

        try {
            // const chatSession = await assessCommentWithGemini(commentText);

            return 'barev';
        } catch (error) {
            console.error('Error running Gemini:', error);
        } finally {
            setIsRunningGemini(false);
        }
    }

    return { isRunningGemini, runGemini }
}