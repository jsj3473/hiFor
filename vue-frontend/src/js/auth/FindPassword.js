import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'FindPassword',
  setup() {
    const userId = ref('');
    const email = ref('');
    const message = ref('');
    const router = useRouter(); // Vue Router에 접근

    const submitForm = async () => {
      try {
        // 백엔드에 아이디와 이메일 전송하여 비밀번호 초기화 요청
        const response = await axios.post('http://localhost:3000/mail/findPassword', {
          userId: userId.value,
          email: email.value,
        });
        if (response.data.pwChangeSuccess) {
          
          userId.value = '';
          email.value = '';
          alert('A temporary password has been emailed to you. Move to login page');
          router.push('/signIn'); // 비밀번호 변경 페이지로 리다이렉트
          return;
        }
        
        // 요청 성공 시 메시지 표시
        message.value = response.data.message;
      } catch (error) {
        // 오류 발생 시 메시지 표시
        message.value = 'Email or ID not found. Please check again';
      }
    };

    return {
      userId,
      email,
      message,
      submitForm,
    };
  },
};