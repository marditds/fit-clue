import { assessCommentWithGemini } from "../context/dbhandler";

export const useGemini = () => {

    const runGemini = async (commentText) => {

        const chatSession = await assessCommentWithGemini(commentText);

        console.log('chatSession', chatSession);

        return chatSession;
    }

    return { runGemini }
}