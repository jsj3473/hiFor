import axios from 'axios';
import { ref } from 'vue';
  
export default {
  name: 'FindUsername',
  setup() {
    const email = ref('');
    const message = ref('');

    const submitEmail = async () => {
      try {
        // 여기에 API 요청 로직을 추가합니다.
        const response = await axios.post('http://localhost:3000/user/findUsername', { email: email.value });
        // 성공적으로 요청이 완료되었다고 가정하고 메시지를 설정합니다.
        
        message.value = `아이디 찾기 요청이 완료되었습니다. 아이디는 "${response.data.username}" 입니다.`;
        email.value = '';
      } catch (error) {
        // 오류가 발생했을 때의 메시지 설정
        message.value = '아이디 찾기에 실패했습니다. 다시 시도해 주세요.';
      }
    };

    return {
      email,
      message,
      submitEmail,
    };
  },
};