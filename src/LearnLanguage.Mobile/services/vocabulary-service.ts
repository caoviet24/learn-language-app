import axios from 'axios';

const DICTIONARY_API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

async function search(word: string) {
    try {
        const response = await axios.get(`${DICTIONARY_API_BASE_URL}/${word}`);
        return response.data;
    } catch (error: any) {
        if (error.response) {
            // Server responded with error status
            if (error.response.status === 404) {
                throw new Error('Không tìm thấy từ này trong từ điển');
            } else {
                throw new Error(`Lỗi từ máy chủ: ${error.response.status}`);
            }
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Không thể kết nối đến máy chủ từ điển');
        } else {
            // Something else happened
            throw new Error('Có lỗi xảy ra khi tìm kiếm từ vựng');
        }
    }
}

const vocabularyService = {
    search,
};

export default vocabularyService;