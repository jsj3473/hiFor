import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '../components/auth/SignUp.vue'; 
import SignIn from '../components/auth/SignIn.vue';
import PasswordChange from '../components/auth/PasswordChange.vue';
import MyPage from '../components/MyPage.vue'
import FindUsername from '../components/auth/FindUsername.vue';
import FindPassword from '../components/auth/FindPassword.vue';
import CreateEvent from '../components/gathering/CreateEvent.vue';
import ShowAllEvents from '../components/gathering/ShowAllEvents.vue';
import GoogleSignUp from '../components/auth/googleSignUp.vue'; 
import EventDetailJoin from '../components/gathering/eventDetailJoin.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: () => import('../components/HomePage.vue'), // 홈 컴포넌트 경로
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/signUp',
    name: 'SignUp',
    component: SignUp, 
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/signIn',
    name: 'SignIn',
    component: SignIn, 
    meta: { hideHeaderFooter: true },
  },
  {
    path: '/myPage',
    name: 'MyPage',
    component: MyPage,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/passwordChange',
    name: 'PasswordChange',
    component: PasswordChange,
    meta: { hideHeaderFooter: true },
  },
  {
    path: '/findUsername',
    name: 'FindUsername',
    component: FindUsername,
    meta: { hideHeaderFooter: true },
  },
  {
    path: '/findPassword',
    name: 'FindPassword',
    component: FindPassword,
    meta: { hideHeaderFooter: true },
  },
  {
    path: '/createEvent',
    name: 'CreateEvent',
    component: CreateEvent,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/showAllEvents',
    name: 'ShowAllEvents',
    component: ShowAllEvents,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/googleSignUp',
    name: 'GoogleSignUp',
    component: GoogleSignUp,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/events/:eventId',
    name: 'EventDetailJoin',
    component: EventDetailJoin,
    meta: { hideHeaderFooter: false },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

