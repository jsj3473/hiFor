<template>

    <form @submit.prevent="handleRegister">
      <div class="container sign-up">
        <div class="row">
          <div class="col-12">
            <p class="sub-text1">WELCOME TO HIFOR</p>
          </div>
          <div class="col-5 title-box">
            <p class="title-text1">Sign-Up</p>
            <p class="sub-text2">Your life in Korea becomes more enjoyable here!</p>
          </div>
  
  
  
          <!-- 회원가입 입력 form -->
           
          <div class="col-7 signup-form-box">
  
            <!-- 1열 name / id -->
            <div class="row form-table">
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="username">Full name</label>
                  <input class="input-box-type1" type="text" v-model="user.username" id="username" required placeholder="Hifor"/>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="userId">ID(User name)</label>
                  <input class="input-box-type1" type="text" v-model="user.userId" id="userId" @input="checkUserIdAvailability" required placeholder="6자-20자"/>
                  <span v-if="!userIdAvailable" class="error-message error-text">This User Name is already taken.</span>
                  <!-- <span v-if="userIdAvailable" class="error-message available-text">This User Name is Available.</span> -->
                </div>
              </div>
            </div>
  
            <!-- 2열 date of birth -->
            <div class="row form-table">
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="dob">Date of Birth</label>
                  <input class="input-box-type1" type="date" v-model="user.dob" id="dob" required/>
                </div>
              </div>
              <div class="col-6"></div>
            </div>
  
            <!-- 3열 Gender/Nationality -->
            <div class="row form-table">
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="gender">Gender</label>
                  <select class="input-box-type1" v-model="user.gender" id="gender" required>
                    <option value="">Please Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="nationality">Nationality</label>
                  <input class="input-box-type1" type="text" v-model="user.nationality" id="nationality" required/>
                </div>
              </div>
              <div class="col-6">
                <div class="form-group">
                  <label class="label-text-type1" for="university">university</label>
                  <input class="input-box-type1" type="text" v-model="user.university" id="university" />
                </div>
              </div>
            </div>
  
            <!-- 동의 section -->
             <div class="row agree-box">
  
              <div class="col-12">
                <button type="button" class="agree-all" @click="toggleAllCheckboxes">Accept All</button>
              </div>
                  <!-- 각 체크박스와 텍스트 -->
              <div v-for="(checkbox, index) in checkboxes" :key="index" class="row">
                <div class="col-11">
                  <button class="agree-text1">{{ checkbox.label }}</button>
                </div>
                <div class="col-1 agree-cb-box">
                  <input
                    class="agree-cb"
                    type="checkbox"
                    v-model="checkbox.checked"
                  />
                </div>
              </div>
            </div>
  
  
            <!-- create account -->
            <div class="row">
              <div class="col-12 ca-btn-box">
                <button type="submit" class="ca-btn">
                  CREATE ACCOUNT!
                </button>
              </div>
            </div>
          </div>
  
        
        </div>
      </div>
    </form>
  
  
    
  
  
  </template>
  
  <script>
  import { jwtDecode } from 'jwt-decode';
  import axios from 'axios';
  import { ref, reactive, onMounted } from 'vue';
  import debounce from 'lodash/debounce';
  import { useStore } from 'vuex';
  
  export default {
    name: 'googleSignUp',
    setup() {
      const user = reactive({
        username: '',
        dob: '',
        gender: '',
        userId: '',
        nationality: '',
        university: '',
      });
  
      const userIdAvailable = ref(true);
      const store = useStore(); // Vuex store에 접근
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
  
      // JWT 토큰 추출 및 디코딩
      const decodeJwtFromUrl = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        console.log('token:',token);
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            console.log('dtoken:',decodedToken)
            // 디코딩된 정보를 사용자 데이터에 반영
            user.username = decodedToken.name || '';
            user.dob = decodedToken.dob || '';
            user.gender = decodedToken.gender || '';
            user.nationality = decodedToken.nationality || '';
            user.university = decodedToken.university || '';
            console.log('Decoded JWT:', decodedToken);
          } catch (error) {
            console.error('Invalid token:', error);
          }
        }
      };
  
      // ID 중복 체크 함수
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
  
      // 컴포넌트 마운트 시 JWT 디코딩
      onMounted(() => {
        decodeJwtFromUrl();
      });
  
      return {
        user,
        userIdAvailable,
        checkUserIdAvailability,
        checkboxes,
        store
      };
    },
    methods: {
      async handleRegister() {
        const requiredCheckboxes = this.checkboxes.filter((cb, index) => index < 2); // Required 체크박스만 필터링
        const allRequiredChecked = requiredCheckboxes.every((cb) => cb.checked);
        console.log('User data at handleRegister:', this.user);
        if (!this.user.userId) {
            alert('Please enter a valid username.');
            return;
        }
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
  
        if (!this.userIdAvailable) {
          alert('The username is already in use.');
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:3000/auth/googleSignUp', this.user);
          console.log('회원가입 응답:', response.data);
          alert('Sign-up completed!');      
          
          // JWT 토큰 저장 (localStorage 또는 sessionStorage에 저장 가능)
          this.store.commit('setToken', response.data.access_token); // Vuex 상태에 저장
          this.store.commit('setUserId', this.user.userId);
          sessionStorage.setItem('token', response.data.access_token);

          this.$router.push('/');
        } catch (error) {
          console.error('회원가입 오류:', error);
          alert('An error occurred during sign-up. Please try again.');
        }
      },
      toggleAllCheckboxes() {
        const allChecked = this.checkboxes.every((cb) => cb.checked); // 모든 체크박스가 체크 상태인지 확인
        this.checkboxes.forEach((cb) => {
          cb.checked = !allChecked; // 모두 체크/해제 상태로 변경
        });
      },
    },
  };
  </script>
  
  
  <style scoped>
    /* 전체 설정 */
  
    html, body{
        height: 100%;
    }
  
    input {
      color: black;
    }
    /* 반응형 모바일 */
    @media screen and (max-width:768px){
  
    }
  
    /* 웹 */
    @media screen and (min-width:769px){
      
      /* 웹 레이아웃 */
      .container{
        width: 100%;
        padding-left: 10%;
        padding-right: 10%;
      }
  
      /* all-box setting */
      .sign-up{
        max-width: 100%;
        margin: 0px;
        margin-top: 90px;
      }
  
      /* left section */
      .sub-text1{
        margin-bottom: 20px;
        font-size: 14px;
        font-weight: bold;
        color: #07722B;
      }
      .title-text1{
        font-size: 50;
        font-weight: bold;
        margin-bottom: 8px;
      }
      .sub-text2{
        font-size: 16px;
        color: #5F687A;
      }
  
      /* right section */
      .form-table{
        margin-top: 16px;
      }
      .signup-form-box{
        padding: 0px;
      }
      .label-text-type1{
        width: 100%;
        color: #1C1F23;
        font-size: 16px;
        font-weight: bold;
      }
      .input-box-type1{
        width: 100%;
        height: 59px;
        padding: 10px;
        padding-left: 20px;
        padding-right: 20px;
        border: 1px solid;
        border-color: #E5ECF8;
        border-radius: 108px;
      }
      .error-text{
        color: red;
      }
      .available-text{
        color: blue;
      }
      .input-box-type2{
        border: none;
        width: 70%;
        border-radius: 108px;
      }
      .input-btn-type2{
        width: 30%;
        font-size: small;
        background-color: #37C00E;
        border: none;
        border-radius: 108px;
        color: #fff;
        font-style: italic;
        height: 36px;
      }
  
      .agree-box{
        margin-top: 64px;
        margin-bottom: 48px;
      }
      .agree-all{
        background-color: #37C00E;
        border: none;
        border-radius: 16px;
        font-size: 15px;
        color: #fff;
        padding: 3px;
        padding-left: 9px;
        padding-right: 9px;
        margin-bottom: 16px;
      }
      .agree-text1{
        background: none;
        border: none;
        color: #5F687A;
        text-align: left;
        text-decoration: underline;
      }
      .agree-cb-box{
        align-content: center;
      }
      .agree-cb{
        accent-color: green;
      }
  
      .ca-btn-box{
        text-align: center;
        margin-top: 90px;
        margin-bottom: 120px;
      }
      .ca-btn{
        font-size: 20px;
        border: none;
        background-color: #37C00E;
        border-radius: 16px;
        padding: 12px;
        padding-left: 48px;
        padding-right: 48px;
        color: #fff;
      }
        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }
  
        .input-with-icon input {
          padding-right: 35px; /* 아이콘 위치 확보 */
        }
  
        .input-with-icon .fa {
          position: absolute;
          right: 10px; /* 아이콘 위치 조정 */
          cursor: pointer;
          color: #5f687a; /* 기본 색상 */
        }
  
    }
  </style>