import { createRouter, createWebHistory } from 'vue-router';
import SignUp from '../components/auth/SignUp.vue'; 
import SignIn from '../components/auth/SignIn.vue';
import PasswordChange from '../components/auth/PasswordChange.vue';
import MyPage from '../components/MyPage.vue'
import MyPageEdit from '../components/MyPageEdit.vue'
import FindUsername from '../components/auth/FindUsername.vue';
import FindPassword from '../components/auth/FindPassword.vue';
import CreateEvent from '../components/gathering/CreateEvent.vue';
import ShowAllEvents from '../components/gathering/ShowAllEvents.vue';
import GoogleSignUp from '../components/auth/googleSignUp.vue'; 
import EventDetailJoin from '../components/gathering/eventDetailJoin.vue';
import JoinEvent from '../components/gathering/JoinStepParent.vue';
import GatheringApprove from '../components/gathering/GatheringApprove.vue';
import OurCompany from '@/components/about/OurCompany.vue';
import OurService from '@/components/about/OurService.vue';
//import Notice from '@/components/help/Notice.vue';
import ServiceGuide from '@/components/help/ServiceGuide.vue';
//import Support from '@/components/help/Support.vue';
import UseClause from '@/components/help/UseClause.vue';

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
    path: '/myPageEdit',
    name: 'MyPageEdit',
    component: MyPageEdit,
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
  {
    path: '/joinEvents/:eventId',
    name: 'JoinEvent',
    component: JoinEvent,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/manage/:eventId',
    name: 'GatheringApprove',
    component: GatheringApprove,
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
    path: '/serviceGuide',
    name: 'ServiceGuide',
    component: ServiceGuide,
    meta: { hideHeaderFooter: false },
  },
  {
    path: '/useClause',
    name: 'UseClause',
    component: UseClause,
    meta: { hideHeaderFooter: false },
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

