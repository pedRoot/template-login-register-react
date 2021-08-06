import axios from "../configs/AxiosConfig";

const get = url => {
	return axios.get(url);
}

const post = (url, data) => {
	return axios.post(url, data)
}

const put = (url, data) => {
	return axios.put(url, data);
}

const remove = url => {
	return axios.delete(url);
}

export const apiWrapper = {
	get,
	post,
	put,
	remove
}
