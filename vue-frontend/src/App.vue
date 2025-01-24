<template>

  <!-- Web -->
  <div class="Web" id="app">
    <!-- 헤더 영역 -->
    <header v-if="!$route.meta.hideHeaderFooter">
      <!-- 헤더 -->
      <!-- 메페,올이벤트 헤더-->
      <div  v-if="$route.meta.mainHeader" class="row header-space-main">
        <div class="header-logo">
          <router-link class="header-nav-text" to="/"><img class="logo-hifor" src="@/assets/img/logo_HiFor.png" alt=""></router-link>
        </div>
        <div class="header-nav main-page">
          <router-link class="header-nav-text" to="/">Home</router-link>
          <router-link class="header-nav-text" to="/allEvents">All Events</router-link>
          <router-link class="header-nav-text" to="/">F&Q</router-link>
          <router-link class="header-nav-text" to="/">Notice</router-link>
          <router-link v-if="!isLoggedIn" class="header-nav-btn" to="/logIn">SignIn/SignUp</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" :to="`/userPage/${userId}`">My Page</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" to="/postEvent">Create Event</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" to="/" @click="logout">logout</router-link>
        </div>
      </div>
      <!--나머지 헤더 -->
      <div  v-if="!$route.meta.mainHeader" class="row header-space">
        <div class="header-logo">
          <router-link class="header-nav-text" to="/"><img class="logo-hifor" src="@/assets/img/logo_HiFor.png" alt=""></router-link>
        </div>
        <div class="header-nav">
          <router-link class="header-nav-text" to="/">Home</router-link>
          <router-link class="header-nav-text" to="/allEvents">All Events</router-link>
          <router-link class="header-nav-text" to="/">F&Q</router-link>
          <router-link class="header-nav-text" to="/">Notice</router-link>
          <router-link v-if="!isLoggedIn" class="header-nav-btn" to="/logIn">SignIn/SignUp</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" :to="`/userPage/${userId}`">My Page</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" to="/postEvent">Create Event</router-link>
          <router-link v-if="isLoggedIn" class="header-nav-btn" to="/" @click="logout">logout</router-link>
        </div>
      </div>
    </header>

    <!-- 라우터 뷰 -->
    <router-view :key="$route.fullPath" />

    <!-- 푸터 영역 -->
    <footer v-if="!$route.meta.hideHeaderFooter">
      <!-- 푸터 -->
      <div class="row footer-space">
        <div class="col-12">
          <p class="footer-logo">HiFor.</p>
        </div>
        <div class="col-12">
          <!-- Buttons -->
          <div class="button-row">
            <button class="cta-button primary-button">Post a event</button>
            <button class="cta-button secondary-button">Browse events</button>
          </div>
        </div>
        <div class="follow-us">
          <p class="footer-text">Follow us</p>
          <div class="row follow-row">
            <p class="follow-instagram">
              <img src="@/assets/img/icon_Instagram.png" alt=""> Instagram
            </p>
            <p class="follow-facebook">
              <img src="@/assets/img/icon_Facebook.png" alt=""> Facebook
            </p>
            <p class="follow-youtube">
              <img src="@/assets/img/icon_YouTube.png" alt=""> YouTube
            </p>
          </div>
        </div>
        <div class="newsletter-container">
          <div class="row newsletter-box">
            <div class="col-6 newsletter-content">
              <div class="newsletter-icon">
                <img src="@/assets/img/icon_SendMail.png" alt="" />
              </div>
              <div>
                <h3 class="newsletter-title">Subscribe to our newsletter</h3>
                <p class="newsletter-description">Lorem ipsum dolor sit amet consectetur velit.</p>
              </div>
            </div>
            <div class="col-6 newsletter-input-container">
              <input
                type="email"
                class="newsletter-input"
                placeholder="Enter your email..."
              />
              <button class="newsletter-button">Subscribe</button>
            </div>
          </div>
        </div>
        <p class="copyright">Copyright © HiFor.</p>
      </div>
    </footer>
  </div>

  <!-- Mobile -->
  <div class="Mobile" id="app">
    <header></header>
    <router-view></router-view>
    <footer></footer>
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
//const userId = computed(() => store.getters.userId);

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

<style scoped>
/* 반응형 모바일 css */
@media screen and (max-width: 768px) {
  .Web {
    display: none;
  }

  .Mobile {
    display: block;
  }
}

/* 웹 */
@media screen and (min-width: 769px) {
  .Web {
    display: block;
  }

  .Mobile {
    display: none;
  }

  /* header */
  .header-space {
    padding: 15px;
    max-width: 100%;
    width: 100%;
    justify-self: center;
  }

  .header-space-main {
    padding: 15px;
    max-width: 100%;
    width: 100%;
    justify-self: center;
    position: absolute;
  }

  .header-logo {
    max-width: 50%;
    font-size: 28px;
    font-weight: bold;
    color: #58C3FF;
  }

  .logo-hifor {
    width: 100px;
    margin-top: -20px;
  }

  .header-nav {
    max-width: 50%;
    text-align: right;
  }

  .header-nav-text {
    font-size: 18px;
    color: #58C3FF;
    padding: 15px;
    text-decoration: none;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .main-page .header-nav-text {
    font-size: 18px;
    color: #FFFFFF;
    padding: 15px;
    text-decoration: none;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .header-nav-text:hover {
    font-size: 18px;
    color: #58C3FF;
    padding: 15px;
    text-decoration: none;
    opacity: 1;
    font-weight: 700;
  }

  .main-page .header-nav-text:hover {
    font-size: 18px;
    color: #FFFFFF;
    padding: 15px;
    text-decoration: none;
    opacity: 1;
    font-weight: 700;
  }

  .main-page .header-nav-btn {
    font-size: 18px;
    color: #FFFFFF;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0px 5px;
    text-decoration: none;
    border: 1px solid #FFFFFF;
    border-radius: 32px;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .header-nav-btn {
    font-size: 18px;
    color: #58C3FF;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0px 5px;
    text-decoration: none;
    border: 1px solid #58C3FF;
    border-radius: 32px;
    opacity: 1;
    transition: all 0.3s ease;
  }

  .main-page .header-nav-btn:hover {
    font-size: 18px;
    color: #FFFFFF;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0px 5px;
    text-decoration: none;
    border: 1px solid #FFFFFF;
    border-radius: 32px;
    opacity: 1;
    font-weight: 700;
  }

  .header-nav-btn:hover {
    font-size: 18px;
    color: #58C3FF;
    text-decoration: none;
    padding: 10px 15px;
    margin: 0px 5px;
    text-decoration: none;
    border: 1px solid #58C3FF;
    border-radius: 32px;
    opacity: 1;
    font-weight: 700;
  }

  .dropdown {
    position: relative;
    display: inline-block;
  }

  .dropdown-content {
    display: none;
    position: absolute;
    z-index: 1; /*다른 요소들보다 앞에 배치*/
    padding-top: 10px;
    background-color: #fff;
  }

  .dropdown-content a {
    display: block;
  }

  .dropdown:hover .dropdown-content {
    display: block;
  }

  .dropdown-icon {
    font-size: 12px;
  }

  .logo {
    font-size: 36px;
    font-weight: bold;
    color: #12CF51;
    padding: 0px 20px;
  }

  .nav-list {
    padding: 0px 20px;
  }

  .nav-sub-list {
    padding: 10px 0px;
    text-align: left
  }

  .btn-op1 {
    text-align: center;
    color: #12CF51;
  }

  .signup-btn {
    border: 1px solid #12CF51;
    border-radius: 24px;
    padding: 10px 20px;
    margin-right: 15px;
  }

  .btn-op1:hover {
    text-align: center;
    color: #fff;
  }

  .signup-btn:hover {
    border: 1px solid #12CF51;
    background-color: #12CF51;
    border-radius: 24px;
    padding: 10px 20px;
    margin-right: 15px;
  }

  .btn-op2 {
    width: 160px;
    text-align: center;
    color: #12CF51;
  }

  .btn-op2:hover {
    width: 160px;
    text-align: center;
    color: #fff;
  }

  .btn-op3 {
    text-align: center;
    color: #fff;
  }

  .mp-btn {
    text-align: center;
    color: #fff;
    border: 1px solid #12CF51;
    background-color: #12CF51;
    border-radius: 24px;
    padding-top: 9px;
    padding-bottom: 11px;
    padding-left: 5px;
    padding-right: 5px;
    z-index: 10;
  }

  .mp-btn:hover {
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .mp-img {
    border-radius: 100%;
    width: 33px;
    height: 33px;
  }


  /* 푸터 */
  .footer-space {
    margin-top: 60px;
    background-color: #58c2ff2e;
  }

  .footer-logo {
    margin-bottom: 0px;
    margin-top: 40px;
    font-size: 39px;
    font-weight: bold;
    padding: 0px 150px;
    color: #58C3FF;
    align-content: center;
    text-align: center;
  }

  .follow-us {
    padding: 40px 150px;
  }

  .footer-text {
    text-align: center;
    font-size: 20px;
    font-weight: 400;
    color: #555;
  }

  .follow-row {
    justify-content: center;
  }

  .follow-instagram {
    width: 125px;
    text-align: left;
    color: #555;
    font-size: 16px;
    font-weight: 300;
  }

  .follow-facebook {
    width: 125px;
    text-align: left;
    color: #555;
    font-size: 16px;
    font-weight: 300;
  }

  .follow-youtube {
    width: 125px;
    text-align: left;
    color: #555;
    font-size: 16px;
    font-weight: 300;
  }

  .newsletter-container {
    padding: 30px 150px;
    justify-items: center;
  }

  .newsletter-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    width: 100%;
    background-color: #58c2ff8c;
    border-radius: 24px;
    padding: 30px;
  }

  /* 뉴스레터 아이콘 및 텍스트 */
  .newsletter-content {
    display: flex;
    align-items: center;
    gap: 15px;
    flex: 1;
  }

  .newsletter-icon img {
    width: 50px;
    height: 50px;
  }

  .newsletter-title {
    font-size: 18px;
    font-weight: bold;
    margin: 0;
    color: #FFFFFF;
  }

  .newsletter-description {
    font-size: 14px;
    margin: 0;
    color: #FFFFFF;
    font-weight: 300;
  }

  /* 입력 필드 및 버튼 */
  .newsletter-input-container {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .newsletter-input {
    flex: 1;
    padding: 10px 15px;
    border-radius: 30px;
    border: none;
    outline: none;
    font-size: 14px;
  }

  .newsletter-button {
    padding: 10px 20px;
    background-color: white;
    color: #58C3FF;
    border-radius: 30px;
    border: none;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .newsletter-button:hover {
    background-color: #58C3FF;
    color: #FFFFFF;
  }

  .copyright {
    padding: 15px 150px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    color: #555;
  }

  .button-row {
    text-align: center;
    padding: 30px;
  }

  .primary-button {
    width: 155px;
    height: 58px;
    border-radius: 100px;
    background-color: #58C3FF;
    color: white;
    border: none;
    margin-right: 10px;
    transition: all 0.3s ease;
  }

  .primary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .secondary-button {
    width: 155px;
    height: 58px;
    background-color: #FFFFFF;
    border: 1.5px solid #58C3FF;
    border-radius: 100px;
    color: #58C3FF;
    margin-left: 10px;
    transition: all 0.3s ease;
  }

  .secondary-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
}
</style>