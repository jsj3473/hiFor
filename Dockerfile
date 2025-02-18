# 1. Node.js 기반 NestJS 애플리케이션
FROM node:18

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 필요한 패키지 설치
COPY package.json package-lock.json ./
RUN npm install

# 4. 애플리케이션 소스 복사
COPY . .

# 5. 이미지 저장할 디렉토리 생성 (이벤트 이미지 & 프로필 이미지)
RUN mkdir -p /app/event-images /app/profile-images


# 6. Redis 설치
RUN apt-get update && apt-get install -y redis-server

# 7. 포트 설정 (6379 제거)
EXPOSE 3000  # Render에서 3000번 포트만 사용

# 8. Redis 실행 + 서버 실행
CMD redis-server --daemonize yes && npm run start
