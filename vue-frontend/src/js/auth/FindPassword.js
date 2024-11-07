import axios from 'axios';
import { ref } from 'vue';

export default {
  name: 'FindPassword',
  setup() {
    const userId = ref('');
    const email = ref('');
    const message = ref('');

    const submitForm = async () => {
      try {
        // 백엔드에 아이디와 이메일 전송하여 비밀번호 초기화 요청
        const response = await axios.post('http://localhost:3000/mail/findPassword', {
          userId: userId.value,
          email: email.value,
        });
        
        // 요청 성공 시 메시지 표시
        message.value = response.data.message;
        userId.value = '';
        email.value = '';
      } catch (error) {
        // 오류 발생 시 메시지 표시
        message.value = '비밀번호 초기화에 실패했습니다. 다시 시도해 주세요.';
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