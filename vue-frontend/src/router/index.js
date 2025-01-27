import { createRouter, createWebHistory } from 'vue-router';
import CreateAccount from '../components/auth/CreateAccount.vue';
import PasswordChange from '../components/auth/PasswordChange.vue';
import FindUsername from '../components/auth/FindUsername.vue';
import FindPassword from '../components/auth/FindPassword.vue';
import GoogleSignUp from '../components/auth/googleSignUp.vue'; 
import EventDetailJoin from '../components/gathering/eventDetailJoin.vue';
import EventApprove from '../components/gathering/EventApprove.vue';
import OurCompany from '@/components/about/OurCompany.vue';
import OurService from '@/components/about/OurService.vue';
import UseClause from '@/components/help/UseClause.vue';
import HomeIndex from '@/components/HomeIndex.vue';
import AllEvents from '@/components/gathering/AllEvents.vue';
import PostEvent from '@/components/gathering/PostEvent.vue';
import EnterEvent from '@/components/gathering/EnterEvent.vue';
import ContactUs from '@/components/main/ContactUs.vue';
import LogIn from '@/components/auth/LogIn.vue';
import UserPage from '../components/main/UserPage.vue';
import fnq from '@/components/main/ServiceGuide.vue';
import notice from '@/components/main/HiForeigners.vue';

const routes = [

  {
    path: '/',
    name: 'HomeIndex',
    component: HomeIndex,
    meta: { hideHeaderFooter: false , mainHeader: true},
  },
  {
    path: '/createAccount',
    name: 'CreateAccount',
    component: CreateAccount, 
    meta: { hideHeaderFooter: true },
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
  {
    path: '/manage/:eventId',
    name: 'EventApprove',
    component: EventApprove,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/ourCompany',
    name: 'OurCompany',
    component: OurCompany,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/ourService',
    name: 'OurService',
    component: OurService,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/useClause',
    name: 'UseClause',
    component: UseClause,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/allEvents',
    name: 'AllEvents',
    component: AllEvents,
    meta: { hideHeaderFooter: false, mainHeader: true },
  },
  {
    path: '/postEvent',
    name: 'PostEvent',
    component: PostEvent,

    meta: { hideHeaderFooter: false },
  },
  {
    path: '/enterEvent/:eventId',
    name: 'EnterEvent',
    component: EnterEvent,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/contactUs',
    name: 'ContactUs',
    component: ContactUs,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/logIn',
    name: 'LogIn',
    component: LogIn,
    meta: { hideHeaderFooter: true },
  },
  {
    path: '/userPage/:userId',
    name: 'UserPage',
    component: UserPage,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/fnq',
    name: 'fnq',
    component: fnq,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/notice',
    name: 'notice',
    component: notice,
    meta: { hideHeaderFooter: false },
  },

];
// 라우터 객체 생성
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// 전역 가드 추가 (createRouter 이후)
router.beforeEach((to, from, next) => {
  if (to.meta.mainHeader === undefined) {
    to.meta.mainHeader = false; // 기본값 설정
  }
  next();
});

export default router;

