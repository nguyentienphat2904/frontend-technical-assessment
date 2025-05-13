import { User, UserAlbums } from "@/types/user";
import axios from "axios";

export class UserOperation {

    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/users`;
    }

    async getAllUsers() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            return { error: false, data: response.data as User[] };
        } catch (error) {
            return { error: true, message: error };
        }
    }

    async getUserByID(id: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}`);
            return { error: false, data: response.data as User };
        } catch (error) {
            return { error: true, message: error };
        }
    }

    async getUserAlbums(id: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}/albums`);
            return { error: false, data: response.data as UserAlbums[] };
        } catch (error) {
            return { error: true, message: error };
        }
    }
}