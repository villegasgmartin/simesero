import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		proxy: {
			'/socket.io': {
				target: 'http://localhost:3002',
				changeOrigin: true,
				ws: true,
				onError: (err) => {
					console.error('Error en el proxy:', err);
				},
			}
		}
	},
	optimize: {
		minify: 'terser',
		target: 'es2015' // o 'es2015' dependiendo de tus necesidades
	},
	build: {
		brotli: true,
		chunkSizeWarningLimit: 1000,
		rollupOptions: {
			plugins: []
		}
	}
});

// target: 'https://menu-didactico.up.railway.app',
