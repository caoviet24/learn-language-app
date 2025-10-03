import axiosJWT from "@/configs/axios";
import { baseUrl2 } from "@/configs/baseUrl";
import axios from "axios";


async function talkingWithMessage({
    message,
    language,
}: {
    message: string;
    language: string;
}) {
    const res = await axios.post(`${baseUrl2}/talking-service`, {
        message,
        language,
        topic: 'daily-life', // Default topic, can be changed based on user preference
    });
    return res.data;
}

const chatBotService = {
    talkingWithMessage,
};

export default chatBotService;