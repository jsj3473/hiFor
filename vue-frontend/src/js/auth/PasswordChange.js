import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
  name: 'PasswordChange',
  setup() {
    const router = useRouter();
    const userId = ref('');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const isCurrentPasswordValid = ref(false);

    const checkCurrentPassword = async () => {
      try {
        const response = await axios.post('http://localhost:3000/auth/checkCurrentPassword', {
          userId: userId.value,
          password: currentPassword.value,
        });

        if (response.data.valid) {
          isCurrentPasswordValid.value = true;
        } else {
          alert('현재 비밀번호가 올바르지 않습니다.');
        }
      } catch (error) {
        alert('비밀번호 확인 중 오류가 발생했습니다.');
      }
    };

    const handleSubmit = async () => {
      if (newPassword.value !== confirmPassword.value) {
        alert('새 비밀번호가 일치하지 않습니다.');
        return;
      }

      try {
        await axios.patch('http://localhost:3000/auth/updatePassword', {
          userId: userId.value,
          password: newPassword.value,
        });
        alert('비밀번호가 성공적으로 변경되었습니다.');
      } catch {
        alert('비밀번호 변경 중 오류가 발생했습니다.');
      }
    };

    const handleCancel = () => {
      alert('비밀번호 변경을 취소하셨습니다.');
    };

    onMounted(() => {
      // 세션 또는 로컬 스토리지에서 사용자 ID 가져오기
      userId.value = sessionStorage.getItem('userId') || localStorage.getItem('userId');

      if (!userId.value) {
        alert('사용자 정보가 없습니다. 다시 로그인해 주세요.');
        router.push({ name: 'Login' }); // 로그인 페이지로 리다이렉트
      }
    });

    return {
      userId,
      currentPassword,
      newPassword,
      confirmPassword,
      isCurrentPasswordValid,
      checkCurrentPassword,
      handleSubmit,
      handleCancel,
    };
  },
};