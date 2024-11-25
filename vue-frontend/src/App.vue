<template>
  
  <div id="app">
    <!-- 헤더 영역 -->
    <header v-if="!$route.meta.hideHeaderFooter">
      <nav>
        <ul>
          <li><router-link to="/">홈</router-link></li>
          <li v-if="isLoggedIn"> - {{ userId }}님 환영합니다 - </li>
          <li v-if="!isLoggedIn"><router-link to="/signUp">회원가입</router-link></li>
          <li v-if="!isLoggedIn"><router-link to="/signIn">로그인</router-link></li>
          <li v-if="isLoggedIn">
            <button @click="logout">로그아웃</button>
            
            <router-link to="/createEvent">이벤트 생성</router-link>
          </li>
          <li v-if="isLoggedIn"><router-link to="/myPage">마이페이지</router-link></li>
        </ul>
      </nav>
    </header>

    <!-- 라우터 뷰 -->
    <router-view></router-view>

    <!-- 푸터 영역 -->
    <footer v-if="!$route.meta.hideHeaderFooter">
      <p>&copy; 2024 Our Application. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import "dropzone/dist/dropzone.css";
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { computed,onMounted } from 'vue';

const store = useStore();
const router = useRouter();

const isLoggedIn = computed(() => store.getters.isLoggedIn);
//const token = computed(() => store.getters.token);
const userId = computed(() => store.getters.userId);

const clearToken = () => store.commit('clearToken');
const setToken = (token) => store.commit('setToken', token);
const setUserId = (userId) => store.commit('setUserId', userId);

const logout = () => {
  // 로그아웃 버튼 클릭 시 Vuex에서 토큰 삭제 및 로그인 상태 갱신
  clearToken();
  router.push('/');
};



onMounted(() => {
  // 일반 사용자 로그인 상태 복원 (세션 스토리지에서 JWT 토큰 가져오기)
  const token = sessionStorage.getItem('token');
  if (token) {
    setToken(token); // Vuex 상태에 토큰 저장 (일반 로그인 사용자)
  }

  // Google 로그인 사용자 로그인 상태 확인 (쿠키에 access_token 확인)
  const cookieExists = document.cookie.split('; ').some((cookie) => cookie.startsWith('access_token='));
  if (cookieExists) {
    axios.get('http://localhost:3000/auth/profile', {
      withCredentials: true, // 쿠키를 함께 전송
    })
    .then(response => {
      const user = response.data.user;
      setUserId(user.userId); // 세션 스토리지 사용을 위해 setUserId 사용
      setToken(user.jwtToken);
      sessionStorage.setItem('token', user.jwtToken);
      document.cookie = 'access_token=; Max-Age=0; path=/;';
      //alert('Google 로그인이 완료되었습니다!');
      location.reload();

      router.push('/'); // 홈 페이지로 리다이렉트
    })
    .catch(error => {
      console.error('로그인 상태 확인 오류:', error);
      alert('로그인 상태 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
    });
  }
});
</script>

