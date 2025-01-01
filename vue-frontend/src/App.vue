<template>
  
  <div id="app">
    <!-- 헤더 영역 -->
    <header v-if="!$route.meta.hideHeaderFooter">
      <table class="header">
        <thead class="nav">
          <tr class="nav-bar">
            <td class="logo"><router-link to="/">HiFor.</router-link></td>
            <td class="nav-list"><router-link to="/">Home</router-link></td>
            <td class="nav-list"><router-link to="/ShowAllEvents">All Events</router-link></td>
            <td class="nav-list">
              <div class="dropdown">
                <div class="dropbtn">
                  <router-link to="/">About <span class="dropdown-icon">∨</span></router-link>
                </div>
                <div class="dropdown-content">
                  <router-link class="nav-sub-list" to="/">Company</router-link>
                  <router-link class="nav-sub-list" to="/">Service</router-link>
                </div>
              </div>
            </td>
            <td class="nav-list">
              <div class="dropdown">
                <div class="dropbtn">
                  <router-link to="/">Help <span class="dropdown-icon">∨</span></router-link>
                </div>
                <div class="dropdown-content">
                  <router-link class="nav-sub-list" to="/">Guide</router-link>
                  <router-link class="nav-sub-list" to="/">Notice</router-link>
                  <router-link class="nav-sub-list" to="/">F&Q</router-link>
                  <router-link class="nav-sub-list" to="/">아용약관</router-link>
                  <router-link class="nav-sub-list" to="/">고객문의</router-link>
                </div>
              </div>
            </td>
          </tr>
          <tr class="nav-btn">
            <!-- Before SignIn -->
            <td v-if="!isLoggedIn" class="btn-op1">
              <router-link class="signup-btn" to="/signUp">Sign Up</router-link>
            </td>
            <td v-if="!isLoggedIn" class="btn-op1">
              <router-link class="signup-btn" to="/signIn">Sign In</router-link>
            </td>
            <!-- After SignIn -->
            <td v-if="isLoggedIn" class="btn-op2">
              <router-link class="signup-btn" to="/createEvent">Create Events</router-link>
            </td>
            <td v-if="isLoggedIn" class="btn-op3">
              <div class="dropdown">
                <div class="dropbtn">
                  <router-link class="mp-btn" to="/myPage">
                    <img class="mp-img" src="@/assets/c-img4.png" alt=""> {{ userId }} <span class="dropdown-icon">∨</span>
                  </router-link>
                </div>
                <div class="dropdown-content mp-dropmenu">
                  <router-link class="nav-sub-list" to="/"><button @click="logout">로그아웃</button></router-link>
                  <router-link class="nav-sub-list" to="/">Notice2</router-link>
                  <router-link class="nav-sub-list" to="/">Notice3</router-link>
                </div>
              </div>
            </td>
          </tr>
        </thead>
      </table>
<<<<<<< HEAD
      <!-- <nav>
        <ul class="lz">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/">All Events</router-link></li>
          <li><router-link to="/">About</router-link></li>
          <li><router-link to="/">Notice</router-link></li>
        </ul>
        <ul class="rz">
          <li v-if="!isLoggedIn">
            <router-link to="/signUp">회원가입</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/signIn">로그인</router-link>
          </li>
          <li v-if="isLoggedIn">
            <button @click="logout">로그아웃</button>
            <router-link to="/createEvent">이벤트 생성</router-link>
          </li>
          <li v-if="isLoggedIn"> - {{ userId }}님 환영합니다 - </li>
          <li v-if="isLoggedIn"><router-link to="/myPage">마이페이지</router-link></li>
        </ul>
      </nav> -->
=======
>>>>>>> 44a0bdf (250101)
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

<style scoped>
@import url(https://fonts.googleapis.com/css?family=Lato:400,300,700,900);
body * {
  font-family: Lato !important;
}
a{
  color: unset !important;
  text-decoration: unset !important;
}
  /* 반응형 모바일 css */
  @media screen and (max-width:768px){}

  /* 웹 */
  @media screen and (min-width:769px){
    .header{
      width: 100%;
      height: 54px;
    }
    .nav{
      width: 100%;
      height: 54px;
    }
    .nav-bar{
      width: 60%;
      height: 54px;
      align-content: center;
    }
    .nav-btn{
      justify-items: end;
      width: 40%;
      height: 54px;
      align-content: center;
    }
    .dropdown{
      position : relative;
      display : inline-block;
    }

    .dropdown-content{
      display : none;
      position : absolute;
      z-index : 1; /*다른 요소들보다 앞에 배치*/
      padding-top: 10px;
      background-color: #fff;
    }

    .dropdown-content a{
      display : block;
    }

    .dropdown:hover .dropdown-content {
      display: block;
    }
    .dropdown-icon{
      font-size: 12px;
    }
    .logo{
      font-size: 36px;
      font-weight: bold;
      color: #12CF51;
      padding: 0px 20px;
    }
    .nav-list{
      padding: 0px 20px;
    }
    .nav-sub-list{
      padding: 10px 0px;
      text-align: left
    }
    .btn-op1{
      text-align: center;
      color: #12CF51;
    }
    .signup-btn{
      border: 1px solid #12CF51;
      border-radius: 24px;
      padding: 10px 20px;
      margin-right: 15px;
    }
    .btn-op1:hover{
      text-align: center;
      color: #fff;
    }
    .signup-btn:hover{
      border: 1px solid #12CF51;
      background-color: #12CF51;
      border-radius: 24px;
      padding: 10px 20px;
      margin-right: 15px;
    }
    .btn-op2{
      width: 150px;
      text-align: center;
      color: #12CF51;
    }
    .btn-op2:hover{
      width: 150px;
      text-align: center;
      color: #fff;
    }
    .btn-op3{
      text-align: center;
      color: #fff;
      width: 147px;
    }
    .mp-btn{
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
    .mp-btn:hover{
      box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
    }
    .mp-img{
      border-radius: 100%;
      width: 33px;
      height: 33px;
    }
  }
</style>