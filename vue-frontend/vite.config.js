import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    plugins: [vue()], // Vue 플러그인 추가
    build: {
        outDir: 'dist', // 빌드 결과물을 저장할 디렉토리
        sourcemap: true, // 디버깅을 위해 소스맵 생성
    },
    server: {
        port: 8081, // 개발 서버 실행 포트
        open: true, // 개발 서버 시작 시 브라우저 자동 열기
        proxy: {
            // ✅ CORS 문제 방지 (프론트 → 백엔드 요청 프록시)
            '/api': {
                target: import.meta.env.VITE_API_BASE_URL || 'https://hifor.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, ''), // '/api' 제거 후 백엔드 요청
            },
        },
    },
    resolve: {
        alias: {
            '@': '/src', // ✅ src 폴더를 `@`로 매핑
        },
    },
});
