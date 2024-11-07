import { createRouter, createWebHistory } from 'vue-router';
// Register.vue 파일을 실제 위치로부터 가져옵니다.
import SignUp from '../components/auth/SignUp.vue'; 
import SignIn from '../components/auth/SignIn.vue';
import PasswordChange from '../components/auth/PasswordChange.vue';
import MyPage from '../components/MyPage.vue'

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('../components/HomePage.vue'), // 홈 컴포넌트 경로
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp, 
  },
  {
    path: '/signIn',
    name: 'SignIn',
    component: SignIn, 
  },
  {
    path: '/myPage',
    name: 'MyPage',
    component: MyPage,
  },
  {
    path: '/passwordChange',
    name: 'PasswordChange',
    component: PasswordChange,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

