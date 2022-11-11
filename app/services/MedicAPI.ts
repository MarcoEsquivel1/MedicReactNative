import axios from 'axios';

export const MedicAPI = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default class MedicApiService {
    static login(username: string, password: string) {
        const response = MedicAPI.post('/login', {
            username: username,
            password: password
        });

        return response
    }
}