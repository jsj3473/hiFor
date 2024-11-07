import axios from 'axios';
import { reactive, ref } from 'vue';
import debounce from 'lodash/debounce';

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
      identityStatus: ''
    });

    const userIdAvailable = ref(true);
    const emailAvailable = ref(true);
    const showVerificationInput = ref(false);
    const verificationCodeInput = ref('');
    const verificationCode = ref('');
    const isVerified = ref(false);

    const checkUserIdAvailability = debounce(async () => {
      if (user.userId) {
        try {
          const response = await fetch(`http://localhost:3000/user/isUserId/${user.userId}`);
          //console.log("res:",response)
          const data = await response.json();
          //console.log("data:",data)
          userIdAvailable.value = data.available;
          //console.log("userIdAvailable.value:",userIdAvailable.value)
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
    };
  },
  methods: {
    async sendEmailVerification() {
      if (!this.emailAvailable) {
        alert('중복된 이메일 입니다.');
        return
      }
      try {
        const response = await axios.post('http://localhost:3000/mail/sendVerification', {
          email: this.user.email,
        });
        if (response.status === 201 || response.status === 200) {
          this.verificationCode = response.data.verificationCode; // 서버로부터 인증번호 수신, 이것 노출 막아야함ㄴ
          this.showVerificationInput = true;
          alert('인증번호가 이메일로 전송되었습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('이메일 전송에 실패했습니다.');
      }
    },
    verifyCode() {
      // 입력한 인증번호와 서버에서 받은 인증번호 비교
        console.log('사용자입력',this.verificationCodeInput)
        
        console.log('서버입력',this.verificationCode)
      if (this.verificationCodeInput === this.verificationCode) {
        this.isVerified = true;
        alert('이메일 인증이 완료되었습니다.');
      } else {
        alert('인증번호가 일치하지 않습니다.');
      }
    },
    async handleRegister() {
      if (this.user.userId.length < 6 || this.user.userId.length > 20) {
        alert('아이디는 6자에서 20자 사이여야 합니다.');
        return;
      }
      const idRegex = /^[a-zA-Z0-9]+$/;
      if (!idRegex.test(this.user.userId)) {
        alert('아이디는 영문자와 숫자만 포함할 수 있습니다.');
        return;
      }

      if (this.user.password.length < 8) {
        alert('비밀번호는 최소 8자 이상이어야 합니다.');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(this.user.password)) {
        alert('비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해야 합니다.');
        return;
      }



      if (!this.userIdAvailable || !this.emailAvailable) {
        alert('아이디나 이메일이 중복되었습니다.');
        return;
      }

      if (this.user.password !== this.user.confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
      }

      if (!this.isVerified) {
        alert('이메일 인증이 필요합니다.');
        return;
      }
      
      try {
        const response = await axios.post('http://localhost:3000/auth/signUp', this.user);
        console.log('회원가입 응답:', response.data);
        alert('회원가입이 완료되었습니다!');
        this.$router.push('/signIn');
      } catch (error) {
        console.error('회원가입 오류:', error);
        alert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    },

    googleSignIn() {
      window.location.href = 'http://localhost:3000/auth/to-google';
    },
    logout() {
      sessionStorage.removeItem('token');
      this.isLoggedIn = false;
      this.$router.push('/');
    },
  },
}