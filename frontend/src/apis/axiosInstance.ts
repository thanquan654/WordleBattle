// axiosInstance.js
import axios from 'axios'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

console.log('🚀 ~ backendUrl:', backendUrl)

const axiosInstance = axios.create({
	baseURL: `${backendUrl}/api`,
	timeout: 10000,
})

// Thêm interceptors để xử lý request và response
axiosInstance.interceptors.request.use(
	(config) => {
		return config
	},
	(error) => Promise.reject(error),
)

axiosInstance.interceptors.response.use(
	(response) => response,
	(error) => {
		// Xử lý lỗi chung (ví dụ: thông báo lỗi toàn cục)
		console.error('API error:', error.response || error)
		return error
	},
)

export default axiosInstance
