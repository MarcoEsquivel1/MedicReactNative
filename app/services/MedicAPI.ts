import axios from 'axios';

export const MedicAPI = axios.create({
    baseURL: 'http://192.168.1.1:80/api',
    headers: {
        'Accept': 'application/json'
    }
});

export default class MedicApiService {
    static async login(username: string, password: string) {
        try {
            const response = await MedicAPI.post('/login', {
                username,
                password
            });
            return response.data;  
        } catch (error) {
            return error.response;
        }
    }

    static async register(username: string, email: string, password: string, password_confirmation: string) {
        try {
            const response = await MedicAPI.post('/register', {
                username,
                email,
                password,
                password_confirmation
            });
            
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async logout(token: string) {
        try {
            //request with token in header as Authorization
            const response = await MedicAPI.post('/logout', {}, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }
}