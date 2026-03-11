/**
 * The Axios Wrapper is, well surprise, a wrapper for axios, implementing the proxy schema.
 *
 * Copyright: Ruben Kaiser 2022
 * Version: 0.1.0
 */
import axios from "axios";
import { SERVER_ADDRESS } from "@/config";
const auth = {
    username: 'adminWebsite',
    password: 'z7dUCw8BgKvm4vYWG5aA3nY2B7nf2tQA'
    // password: process.env.ADMIN_API_PASSWORD!
};
if (!auth.password) {
    console.error('Auth PW not found!');
}
export function axiosGet(url) {
    /**
     * @param url: part-url, Server is added automatically
     */
    return axios.get(SERVER_ADDRESS + url, {
        auth: auth
    });
}
export function axiosPost(url, data) {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.post(SERVER_ADDRESS + url, data, {
        auth: auth
    });
}
export function axiosDelete(url) {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.delete(SERVER_ADDRESS + url, {
        auth: auth
    });
}
export function axiosPatch(url, data) {
    /**
     * @param url: part-url, Server is added automatically
     * @param data: Data
     */
    return axios.patch(SERVER_ADDRESS + url, data, {
        auth: auth
    });
}
