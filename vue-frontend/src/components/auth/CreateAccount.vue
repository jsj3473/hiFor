<template>
    <div class="login-container">

        <div class="create-image">
            <p class="banner-title">
                Start real <br>
                Korean Life <br>
                from the <span style="color: #58C3FF;">HiFor.</span>
            </p>
        </div>

        <div class="create-form">
            <h1>Sign up</h1>
            <p>Your life in Korea becomes more enjoyable here!</p>

            <form @submit.prevent="handleRegister">
                <div class="form-group">
                    <label for="email">User name</label>
                    <input type="text" v-model="user.username" id="name" placeholder="ex.HiFor" required />
                </div>

                <div class="form-group">
                    <div class="row half-input-row">
                        <div class="col-6">
                            <label for="email">Email</label>
                            <input type="email" v-model="user.email" @input="checkEmailAvailability" placeholder="Email" required />
                        </div>
                        <div class="col-6 code-btn-box">
                          <button class="code-btn" :disabled="isTimerRunning" type="button" @click="sendEmailVerification">{{ buttonText }}</button>
                        </div>
                    </div>
                </div>
                <!-- 타이머 표시 -->
                <div v-if="isTimerRunning" class="timer">
                  Resend available in {{ formattedTime }}
                </div>

                <div class="form-group" v-if="showVerificationInput">
                    <div class="row half-input-row">
                        <div class="col-6">
                            <label for="code">Verification Code</label>
                          <input type="text" v-model="verificationCodeInput" id="verificationCode" required />
                        </div>
                        <div class="col-6 code-btn-box">
                          <button v-if="!isVerified" class="code-btn" type="button" @click="verifyCode">Verify</button>
                          <button v-if="isVerified" class="code-btn" type="button">Verified</button>
                        </div>
                    </div>
                </div>


                <div class="form-group">
                  <label for="id">ID(User name)</label>
                  <input type="id" id="id" placeholder="Your ID"  v-model="user.userId" @input="checkUserIdAvailability" required />
                </div>

                <div class="form-group password-group">
                    <div class="row half-input-row">
                        <div class="col-6">
                            <label for="password">Password</label>
                            <input type="password" v-model="user.password" id="password" placeholder="Password" required />
                        </div>
                        <div class="col-6">
                            <label for="password">Comfirm Password</label>
                            <input type="password" v-model="user.confirmPassword" id="password" placeholder="Password" required />
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <div class="row half-input-row">
                        <div class="col-6">
                            <label for="email">Date of Birth</label>
                            <input type="date" id="date" v-model="user.dob" required />
                        </div>
                        <div class="col-6">
                            <label for="email">Gender</label>
                            <select id="gender" v-model="user.gender" required>
                                <option disabled hidden selected>Gender</option>
                                <option value="male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="Nationality">Nationality</label>
                    <input type="text" v-model="user.nationality"  @input="filterCountries"
                           placeholder="Search for your country" required />
                </div>

                <!-- 드롭다운 -->
                <ul v-if=" Array.isArray(filteredCountries) &&  filteredCountries.length && showDropdown" class="dropdown">
                  <li
                    v-for="country in filteredCountries"
                    :key="country.cca2"
                    @click="selectCountry(country.name.common)"
                    class="dropdown-item"
                  >
                    {{ country.name.common }}
                  </li>
                </ul>

                <!-- 선택된 국가 표시 -->
                <p v-if="selectedCountry" class="selected-country">
                  Selected Country: {{ selectedCountry }}
                </p>

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

                <button type="submit" class="btn-primary">Sign up</button>

            </form>
        </div>

    </div>

</template>

<script>
import axios from 'axios';
import { reactive, ref, computed,onMounted  } from 'vue';
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
      nationality: '',
    });

    const countries = ref([]);
    const filteredCountries = ref([]);
    const selectedCountry = ref("");
    const showDropdown = ref(false);
    const userIdAvailable = ref(true);
    const emailAvailable = ref(true);
    const showVerificationInput = ref(false);
    const verificationCodeInput = ref('');
    const verificationCode = ref('');
    const isVerified = ref(false);
    const isPasswordVisible = ref(false);
    const isConfirmPasswordVisible = ref(false);
    const buttonText = ref('Send Code');
    const isTimerRunning = ref(false);
    const timeLeft = ref(300);
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

    let timerInterval = null;

    const formattedTime = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    });

    const startTimer = () => {
      isTimerRunning.value = true;
      buttonText.value = 'Resend';

      if (timerInterval) clearInterval(timerInterval);

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

    // 국가 목록 가져오기 (API 호출)
    const fetchCountries = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");
        countries.value = response.data.map((country) => ({
          name: country.name,
          cca2: country.cca2,
        }));
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };

// 국가 검색 필터링
    const filterCountries = () => {
      if (user.nationality.trim()) {
        filteredCountries.value = countries.value.filter((country) =>
          country.name.common
            .toLowerCase()
            .includes(user.nationality.toLowerCase())
        );
        showDropdown.value = true;
      } else {
        filteredCountries.value = [];
        showDropdown.value = false;
      }
    };

// 국가 선택 핸들러
    const selectCountry = (country) => {
      selectedCountry.value = country;
      user.nationality = country; // 검색창에 선택된 국가 표시
      showDropdown.value = false; // 드롭다운 숨기기
    };

    const checkUserIdAvailability = debounce(async () => {
      if (user.userId) {
        try {
          const response = await fetch(`http://localhost:3000/user/isUserId/${user.userId}`);
          const data = await response.json();
          userIdAvailable.value = data.available;
        } catch (error) {
          console.error('Error checking user ID availability:', error);
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
          console.error('Error checking email availability:', error);
        }
      }
    }, 500);

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value;
    };

    const toggleConfirmPasswordVisibility = () => {
      isConfirmPasswordVisible.value = !isConfirmPasswordVisible.value;
    };

    const sendEmailVerification = async () => {
      if (!emailAvailable.value) {
        alert('An account created with this email already exists');
        return;
      }
      try {
        const response = await axios.post('http://localhost:3000/mail/sendVerification', {
          email: user.email,
        });
        if (response.status === 200 || response.status === 201) {
          showVerificationInput.value = true;
          resetTimer();
          alert('The verification code has been sent to your email.');
        }
      } catch (error) {
        console.error('Error sending email verification:', error);
        alert('Failed to send the email.');
      }
    };

    const verifyCode = async () => {
      try {
        const response = await axios.post('http://localhost:3000/mail/verifyCode', {
          email: user.email,
          code: verificationCodeInput.value,
        });
        if (response.status === 200 || response.status === 201) {
          isVerified.value = true;
          alert('Email verification has been completed.');
        }
      } catch (error) {
        console.error('Error verifying code:', error);
        alert('The verification code does not match.');
      }
    };

    const handleRegister = async () => {
      const requiredCheckboxes = checkboxes.value.filter((cb, index) => index < 2);
      const allRequiredChecked = requiredCheckboxes.every((cb) => cb.checked);

      if (!allRequiredChecked) {
        alert('You must agree to the required terms to sign up.');
        return;
      }
      if (user.userId.length < 6 || user.userId.length > 20) {
        alert('The username must be between 6 and 20 characters.');
        return;
      }

      const idRegex = /^[a-zA-Z0-9]+$/;
      if (!idRegex.test(user.userId)) {
        alert('The username can only contain letters and numbers.');
        return;
      }

      if (user.password.length < 8) {
        alert('The password must be at least 8 characters long.');
        return;
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
      if (!passwordRegex.test(user.password)) {
        alert('The password must include uppercase and lowercase letters, numbers, and special characters');
        return;
      }

      if (!userIdAvailable.value || !emailAvailable.value) {
        alert('The username or email is already in use.');
        return;
      }

      if (user.password !== user.confirmPassword) {
        alert('The passwords do not match.');
        return;
      }

      if (!isVerified.value) {
        alert('Email verification is required.');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/auth/signUp', user);
        console.log('Sign-up response:', response.data);
        alert('Sign-up completed!');
      } catch (error) {
        console.error('Error during sign-up:', error);
        alert('An error occurred during sign-up. Please try again.');
      }
    };

    const toggleAllCheckboxes = () => {
      const allChecked = checkboxes.value.every((cb) => cb.checked);
      checkboxes.value.forEach((cb) => {
        cb.checked = !allChecked;
      });
    };
    // 컴포넌트가 마운트될 때 fetchCountries 실행
    onMounted(async () => {
      await fetchCountries();
    });

    return {
      user,
      userIdAvailable,
      emailAvailable,
      showVerificationInput,
      verificationCodeInput,
      verificationCode,
      isVerified,
      isPasswordVisible,
      isConfirmPasswordVisible,
      togglePasswordVisibility,
      toggleConfirmPasswordVisibility,
      startTimer,
      resetTimer,
      checkUserIdAvailability,
      checkEmailAvailability,
      sendEmailVerification,
      verifyCode,
      handleRegister,
      checkboxes,
      toggleAllCheckboxes,
      formattedTime,
      buttonText,
      isTimerRunning,
      filterCountries,
      selectCountry,
    };
  },
};

</script>

<!-- css -->
<style scoped>
    /* 반응형 모바일 css */
    @media screen and (max-width:768px){}
    /* 웹 */
    @media screen and (min-width:769px){
        .login-container {
            display: flex;
            background: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            width: 100%;
            min-height: 680px;
            padding: 30px 150px;
        }

        .create-form {
            flex: 1;
            padding: 40px;
            max-width: 720px;
            align-content: center;
        }

        .login-form h1 {
            font-size: 36px;
            font-weight: bold;
            margin-bottom: 10px;
        }

        .login-form p {
            color: #777;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
        }

        .form-group input {
            width: 100%;
            height: 50px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 12px;
            box-sizing: border-box;
        }

        .form-group select {
            width: 100%;
            height: 50px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 12px;
            box-sizing: border-box;
        }

        .password-group {
            position: relative;
        }

        .toggle-password {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
        }

        .form-options {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .form-options label {
            font-size: 16px;
            color: #555;
        }

        .btn-primary {
            background-color: #58C3FF;
            color: #fff;
            border: none;
            padding: 10px;
            width: 100%;
            height: 50px;
            font-size: 16px;
            border-radius: 12px;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .divider {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
            color: #aaa;
        }

        .divider span {
            background: #fff;
            padding: 0 10px;
        }

        .create-image {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background-image: url('@/assets/img/img_LogInBanner2.png');
            width: 100%;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: bottom;
            border-radius: 24px;
            margin: 10px;
        }

        .banner-title{
            width: 100%;
            height: 100%;
            padding: 45px;
            font-size: 48px;
            font-weight: bold;
            color: #FFFFFF;
        }
        .code-btn-box{
            align-content: end;
        }
        .code-btn{
            background-color: #58C3FF;
            border: none;
            color: #FFFFFF;
            padding: 13px 26px;
            border-radius: 12px;
        }


      .agree-box{
        margin-top: 64px;
        margin-bottom: 48px;
      }
      .agree-all{
        background-color: #58C3FF;
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
        accent-color: #58C3FF;
      }

      .ca-btn-box{
        text-align: center;
        margin-top: 90px;
        margin-bottom: 120px;
      }
      .ca-btn{
        font-size: 20px;
        border: none;
        background-color: #58C3FF;
        border-radius: 16px;
        padding: 12px;
        padding-left: 48px;
        padding-right: 48px;
        color: #fff;
      }
    }
</style>