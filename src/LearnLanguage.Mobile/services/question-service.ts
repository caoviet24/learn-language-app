import axios from "axios";
import { baseUrl2 } from "@/configs/baseUrl";

async function generate({
    topic,
    word,
    type_qs,
}: {
    topic?: string,
    word?: string;
    type_qs: string;
}) {
    const res = await axios.post(`${baseUrl2}/generate`, {
        topic,
        word,
        question_type: type_qs,
    });
    return res.data;
}

async function compare(params: { sentence1: string; sentence2: string }) {
    const res = await axios.post(`${baseUrl2}/compare`, params);
    return res.data;
}
const questionService = {
    generate,
    compare,
};

export default questionService;
