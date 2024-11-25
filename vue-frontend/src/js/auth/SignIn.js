import axios from 'axios';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const store = useStore(); // Vuex store에 접근
    const router = useRouter(); // Vue Router에 접근
    const form = ref({
      userId: '',
      password: ''
    });
    const isPasswordVisible = ref(false); // 비밀번호 가시성 상태

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

  const handleLogin = async () => {
    try {
      // 로그인 처리 로직 (Axios를 사용해 백엔드 API 호출)
      const response = await axios.post('http://localhost:3000/auth/signIn', form.value);

      // JWT 토큰 저장 (localStorage 또는 sessionStorage에 저장 가능)
      store.commit('setToken', response.data.access_token); // Vuex 상태에 저장
      store.commit('setUserId', form.value.userId);
      sessionStorage.setItem('token', response.data.access_token);



      if (response.data.passwordChangeRequired) {
        alert('Password change is required. Redirecting to the password change page.');
        router.push('/passwordChange'); // 비밀번호 변경 페이지로 리다이렉트
        return;
      }

      alert('Login successed');
      router.push('/'); // 로그인 후 메인 페이지로 이동
    } catch (error) {
      console.error('로그인 오류:', error);
      alert('Your HiFor Username or Password is incorrect');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/to-google';
  };

  const handleFindUsername = () => {

  }
return {
  form,
  handleLogin,
  handleGoogleLogin,
  handleFindUsername,
  isPasswordVisible,
  togglePasswordVisibility,
};
}

};