import io from 'socket.io-client'

const URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

console.log('🚀 ~ URL:', URL)

export const socket = io(URL)
