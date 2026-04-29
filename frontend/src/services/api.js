import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getStatus = async () => {
    const res = await axios.get(`${API_URL}/status`);
    return res.data;
};

export const startAttack = async (type) => {
    const res = await axios.post(`${API_URL}/attack/start`, { type });
    return res.data;
};

export const performDefense = async (action, ip) => {
    const res = await axios.post(`${API_URL}/defense/action`, { action, ip });
    return res.data;
};

export const getLogs = async () => {
    const res = await axios.get(`${API_URL}/logs`);
    return res.data;
};

export const analyzeAI = async () => {
    const res = await axios.get(`${API_URL}/ai/analyze`);
    return res.data;
};
