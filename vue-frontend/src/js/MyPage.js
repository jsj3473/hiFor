
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  data() {
    return {
      user: {
        userId: '',
        email: '',
        username: '',
        dob: '',
        gender: '',
        phoneNumber: '',
        nationality: '',
        identityStatus: '',
        isEmailVerified: false,
        isPhoneVerified: false
      }
    };
  },
  computed: {
    store() {
      return useStore();
    }
  },
  methods: {
    async fetchUserData() {
      try {
        const userId = this.store.state.userId || localStorage.getItem('userId');

        const response = await fetch(`http://localhost:3000/user/getUser/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          this.user = { ...data };
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    async submitForm() {
      try {
        const response = await axios.post(`http://localhost:3000/user/updateUser`, this.user, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.status === 201) {
          alert('정보가 성공적으로 업데이트되었습니다.');
        } else {
          alert('정보 업데이트에 실패했습니다.');
        }
      } catch (error) {
        console.error(error);
        alert('오류가 발생했습니다.');
      }
    }
    // 이메일 인증 및 휴대폰 인증 메소드 추가 가능
    // verifyEmail() {
    //   alert('이메일 인증을 진행합니다.');
    // },
    // verifyPhoneNumber() {
    //   alert('휴대폰 인증을 진행합니다.');
    // }
  },
  mounted() {
    this.fetchUserData();
  }
};
