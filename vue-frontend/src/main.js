import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store'; // Vuex 스토어 가져오기


// Bootstrap 및 BootstrapVue Next Import
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import '@fortawesome/fontawesome-free/css/all.css';
import '@/css/global.css';



// Vue 애플리케이션에 Vuex 스토어와 라우터 등록
createApp(App)
  .use(router)
  .use(store)  // Vuex 스토어 등록
  .mount('#app');
