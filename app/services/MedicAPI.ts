import axios from 'axios';
import config from '../../config'

export const MedicAPI = axios.create({
    baseURL: config.API_URL,
    headers: {
        'Accept': 'application/json'
    }
});

export default class MedicApiService {
    //Auth
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

    //Doctors
    static async getDoctor(token: string) {
        try {
            const response = await MedicAPI.get('/doctor', {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async updateDoctor(token: string, name: string, start_time: string, end_time: string) {
        try {
            const response = await MedicAPI.put('/doctor', {
                name,
                start_time,
                end_time
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    //Patients
    static async getPatients(token: string) {
        try {
            const response = await MedicAPI.get('/patients', {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async addPatient(token: string, name: string, dni: string, phone: string, birthday: string,) {
        try {
            const response = await MedicAPI.post('/patients', {
                name,
                dni,
                phone,
                birthday
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async updatePatient(token: string, id: number, name: string, dni: string, phone: string, birthday: string) {
        try {
            const response = await MedicAPI.put('/patients', {
                id,
                name,
                dni,
                phone,
                birthday
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async deletePatient(token: string, id: number) {
        try {
            const response = await MedicAPI.delete(`/patients?id=${id}`, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    //Appointments
    static async getAppointments(token: string) {
        try {
            const response = await MedicAPI.get('/appointments', {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async addAppointment(token: string, patient_id: number, date: string, time: string, comment: string) {
        try {
            const response = await MedicAPI.post('/appointments', {
                patient_id,
                date,
                time,
                comment
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async updateAppointment(token: string, id: number, patient_id: number, date: string, time: string, comment: string) {
        try {
            const response = await MedicAPI.put('/appointments', {
                id,
                patient_id,
                date,
                time,
                comment
            }, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async deleteAppointment(token: string, id: number) {
        try {
            const response = await MedicAPI.delete(`/appointments?id=${id}`, {
                headers: {
                    'Authorization': token
                }
            });
            return response.data;
        } catch (error) {
            return error.response;
        }
    }

    static async updateStateAppointment(token: string, id: number, done: number) {
        try {
            const response = await MedicAPI.put('/appointments', {
                id,
                done
            }, {
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