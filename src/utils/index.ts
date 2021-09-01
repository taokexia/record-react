import axios from './axios'

export const get = axios.get
export const post = axios.post

const host = 'http://127.0.0.1:7001'

export const register = (params: any) => axios.post(`${host}/api/user/register`, params);
export const login = (params: any) => axios.post(`${host}/api/user/login`, params);