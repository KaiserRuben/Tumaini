import axios, {AxiosResponse} from "axios";
import {SERVER_ADDRESS} from "@/config";

const auth = {
    username: 'adminWebsite',
    password: 'z7dUCw8BgKvm4vYWG5aA3nY2B7nf2tQA'
}

export function axiosGet(url: string): Promise<AxiosResponse> {
    /**
     * @param url: part-url, Server is added automatically
     */
    return axios.get(SERVER_ADDRESS + url, {
        auth: auth
    });
}

export function axiosPost(url: string, data: any): Promise<AxiosResponse> {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.post(SERVER_ADDRESS + url, data, {
        auth: auth
    });
}

export function axiosDelete(url: string): Promise<AxiosResponse> {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.delete(SERVER_ADDRESS + url, {
        auth: auth
    });
}

export function axiosPatch(url: string, data: any): Promise<AxiosResponse> {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.patch(SERVER_ADDRESS + url, data, {
        auth: auth
    });
}