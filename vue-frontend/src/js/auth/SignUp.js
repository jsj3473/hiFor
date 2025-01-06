import axios from 'axios';
import { reactive, ref } from 'vue';
import debounce from 'lodash/debounce';
import { computed } from 'vue';

export default {
  name: 'SignUp',
  setup() {
    const user = reactive({
      username: '',
      dob: '',
      gender: '',
      email: '',
      userId: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      nationality: '',
      identityStatus: '',
      university: '',
    });

    const userIdAvailable = ref(true);
    const emailAvailable = ref(true);
    const showVerificationInput = ref(false);
    const verificationCodeInput = ref('');
    const verificationCode = ref('');
    const isVerified = ref(false);
    const isPasswordVisible = ref(false); // 비밀번호 가시성 상태
    const isConfirmPasswordVisible = ref(false); // 비밀번호 확인 가시성 상태
    const buttonText = ref('Send Code'); // 버튼 텍스트
    const isTimerRunning = ref(false); // 타이머 상태
    const timeLeft = ref(300); // 남은 시간 (5분)
    const checkboxes = ref([
      {
        label: "I accept and agree to the Terms of use(Required)",
        checked: false,
      },
      {
        label: "I accept and agree to the Privacy policy(Required)",
        checked: false,
      },
      {
        label:
          "I agree to collect and use personal information for the purpose of receiving and promoting marketing. (Optional)",
        checked: false,
      },
    ]);
    let timerInterval = null; // 타이머 인터벌 변수

    // 타이머 형식 변환
    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });

    const startTimer = () => {
      isTimerRunning.value = true;
      buttonText.value = 'Resend';

      if (timerInterval) clearInterval(timerInterval); // 기존 타이머 정리

      timerInterval = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          clearInterval(timerInterval);
          isTimerRunning.value = false;
        }
      }, 1000);
    };
    const resetTimer = () => {
      timeLeft.value = 300;
      startTimer();
    };
    const checkUserIdAvailability = debounce(async () => {
      if (user.userId) {
        try {
          const response = await fetch(`http://localhost:3000/user/isUserId/${user.userId}`);
          const data = await response.json();
          userIdAvailable.value = data.available;
        } catch (error) {
          console.error('아이디 중복 확인 오류:', error);
        }
      }
    }, 500);

    const checkEmailAvailability = debounce(async () => {
      if (user.email) {
        try {
          const response = await fetch(`http://localhost:3000/user/isEmail/${user.email}`);
          const data = await response.json();
          emailAvailable.value = data.available;
        } catch (error) {
          console.error('이메일 중복 확인 오류:', error);
        }
      }
    }, 500);    
    
    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value; // 비밀번호 필드 토글
    };

    const toggleConfirmPasswordVisibility = () => {
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value; // 비밀번호 확인 필드 토글
    };

    return {
      user,
      userIdAvailable,
      emailAvailable,
      showVerificationInput,
      verificationCodeInput,
      verificationCode,
      isVerified,
      checkUserIdAvailability,
      checkEmailAvailability,
      checkboxes,
      isPasswordVisible,
      isConfirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      resetTimer,
      formattedTime,
      buttonText,
      isTimerRunning,
    };
  },
  methods: {

    async sendEmailVerification() {
      if (!this.emailAvailable) {
        alert('An account created with this email already exists');
        return
      }
      try {
        const response = await axios.post('http://localhost:3000/mail/sendVerification', {
          email: this.user.email,
        });
        if (response.status === 201 || response.status === 200) {
          this.showVerificationInput = true;
          this.resetTimer();
          alert('The verification code has been sent to your email.');
        }
      } catch (error) {
        console.error(error);
        alert('Failed to send the email.');
      }
    },
    async verifyCode() {
      try {
        const response = await axios.post('http://localhost:3000/mail/verifyCode', {
          email: this.user.email,
          code: this.verificationCodeInput,
        });
        if (response.status === 201 || response.status === 200) {
          this.isVerified = true;
          alert('Email verification has been completed.');
        }
      } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          alert(error.response.data.message);
        } else {
          alert('The verification code does not match.');
        }
      }
    },
    async handleRegister() {
      const requiredCheckboxes = this.checkboxes.filter((cb, index) => index < 2); // Required 체크박스만 필터링
      const allRequiredChecked = requiredCheckboxes.every((cb) => cb.checked);
  
      if (!allRequiredChecked) {
        alert('You must agree to the required terms to sign up.');
        return; // 제출 중단
      }
      if (this.user.userId.length < 6 || this.user.userId.length > 20) {
        alert('The username must be between 6 and 20 characters.');
        return;
      }
      const idRegex = /^[a-zA-Z0-9]+$/;
      if (!idRegex.test(this.user.userId)) {
        alert('The username can only contain letters and numbers.');
        return;
      }

      if (this.user.password.length < 8) {
        alert('The password must be at least 8 characters long.');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(this.user.password)) {
        alert('The password must include uppercase and lowercase letters, numbers, and special characters');
        return;
      }



      if (!this.userIdAvailable || !this.emailAvailable) {
        alert('The username or email is already in use.');
        return;
      }

      if (this.user.password !== this.user.confirmPassword) {
        alert('The passwords do not match.');
        return;
      }

      if (!this.isVerified) {
        alert('Email verification is required.');
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:3000/auth/signUp', this.user);
        console.log('회원가입 응답:', response.data);
        alert('Sign-up completed!');
        this.$router.push('/signIn');
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('An error occurred during sign-up. Please try again.');
      }
    },
    toggleAllCheckboxes() {
      const allChecked = this.checkboxes.every((cb) => cb.checked); // 모든 체크박스가 체크 상태인지 확인
      console.log(allChecked)
      this.checkboxes.forEach((cb) => {
        cb.checked = !allChecked; // 모두 체크/해제 상태로 변경
      });
    },
  },
}