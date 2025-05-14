import { Album, AlbumPhoto } from "@/types/album";
import axios from "axios";
import { UserOperation } from "../user";
import { User } from "@/types/user";

const userOp = new UserOperation()

export class AlbumOperation {

    private baseUrl: string;

    constructor() {
        this.baseUrl = `${process.env.NEXT_PUBLIC_BACKEND_LOGIN_ENDPOINT!}/albums`;
    }

    async getAllAlbums() {
        try {
            const resAlbums = await axios.get(`${this.baseUrl}`);
            const resUsers = await userOp.getAllUsers()

            const userMap = resUsers?.data?.reduce((map: any, user: User) => {
                map[user.id] = user.name;
                return map;
            }, {});

            const albumsWithUsernames = resAlbums?.data?.map((album: Album) => {
                return {
                    ...album,
                    username: userMap[album.userId] || 'Unknown',
                };
            });

            return { error: false, data: albumsWithUsernames as Album[] };
        } catch (error) {
            return { error: true, message: error };
        }
    }

    async getAlbumById(id: string) {
        try {
            const resAlbum = await axios.get(`${this.baseUrl}/${id}`);
            const resUser = await userOp.getUserByID(resAlbum.data.userId);
            const response = {
                ...resAlbum.data,
                username: resUser.data?.name || 'unknow',
                email: resUser.data?.email || 'unknow'
            }
            return { error: false, data: response as Album };
        } catch (error) {
            return { error: true, message: error };
        }
    }

    async getAlbumPhotos(id: string) {
        try {
            const response = await axios.get(`${this.baseUrl}/${id}/photos`);
            return { error: false, data: response.data as AlbumPhoto[] };
        } catch (error) {
            return { error: true, message: error };
        }
    }
}