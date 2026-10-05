import axios from "axios";

const API_URL = "https://paniveno.onrender.com/api/jobs";

export const getJobs = async (params = {}) => {
    const response = await axios.get(API_URL, {
        params
    });

    return response.data;
};