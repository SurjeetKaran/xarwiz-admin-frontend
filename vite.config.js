import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
plugins: [react()],
server: {
proxy: {
'/api': {
target: '[https://xarwiz-admin-backend.onrender.com](https://xarwiz-admin-backend.onrender.com)', // live Render backend URL
changeOrigin: true,
secure: true,
},
},
},
})
