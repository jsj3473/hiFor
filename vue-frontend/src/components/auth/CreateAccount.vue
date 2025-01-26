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
                          <button class="code-btn"  :disabled="isTimerRunning && buttonText !== 'Resend'"  type="button" @click="sendEmailVerification">{{ buttonText }}</button>
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

              <div>
                <!-- 통합 검색 입력 필드 -->
                <div class="form-group">
                  <input
                    type="text"
                    v-model="searchQuery"
                    @focus="showDropdown = true"
                    @blur="hideDropdown"
                    @input="filterCountries"
                    placeholder="Search for a country..."
                    class="search-input"
                    required
                  />
                  <!-- 드롭다운 -->
                  <ul v-if="showDropdown" class="dropdown-list">
                    <li
                      v-for="country in filteredCountries.slice(0,5)"
                      :key="country.code"
                      @mousedown="selectCountry(country)"
                      class="dropdown-item"
                    >
                      {{ country.name }}
                    </li>
                  </ul>
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

                <button type="submit" class="btn-primary">Sign up</button>

            </form>
        </div>

    </div>

</template>

<script setup>
import axios from 'axios';
import { reactive, ref, computed  } from 'vue';
import debounce from 'lodash/debounce';

const searchQuery = ref('');
const selectedCountry = ref({});
const showDropdown = ref(false);
const countries = ref([
     { code: 'AF', name: 'Afghanistan' },
     { code: 'AL', name: 'Albania' },
     { code: 'DZ', name: 'Algeria' },
     { code: 'AS', name: 'American Samoa' },
     { code: 'AD', name: 'Andorra' },
     { code: 'AO', name: 'Angola' },
     { code: 'AG', name: 'Antigua and Barbuda' },
     { code: 'AR', name: 'Argentina' },
     { code: 'AM', name: 'Armenia' },
     { code: 'AU', name: 'Australia' },
     { code: 'AT', name: 'Austria' },
     { code: 'AZ', name: 'Azerbaijan' },
     { code: 'BS', name: 'Bahamas' },
     { code: 'BH', name: 'Bahrain' },
     { code: 'BD', name: 'Bangladesh' },
     { code: 'BB', name: 'Barbados' },
     { code: 'BY', name: 'Belarus' },
     { code: 'BE', name: 'Belgium' },
     { code: 'BZ', name: 'Belize' },
     { code: 'BJ', name: 'Benin' },
     { code: 'BT', name: 'Bhutan' },
     { code: 'BO', name: 'Bolivia' },
     { code: 'BA', name: 'Bosnia and Herzegovina' },
     { code: 'BW', name: 'Botswana' },
     { code: 'BR', name: 'Brazil' },
     { code: 'BN', name: 'Brunei' },
     { code: 'BG', name: 'Bulgaria' },
     { code: 'BF', name: 'Burkina Faso' },
     { code: 'BI', name: 'Burundi' },
     { code: 'CV', name: 'Cabo Verde' },
     { code: 'KH', name: 'Cambodia' },
     { code: 'CM', name: 'Cameroon' },
     { code: 'CA', name: 'Canada' },
     { code: 'CF', name: 'Central African Republic' },
     { code: 'TD', name: 'Chad' },
     { code: 'CL', name: 'Chile' },
     { code: 'CN', name: 'China' },
     { code: 'CO', name: 'Colombia' },
     { code: 'KM', name: 'Comoros' },
     { code: 'CG', name: 'Congo (Republic)' },
     { code: 'CD', name: 'Congo (Democratic Republic)' },
     { code: 'CR', name: 'Costa Rica' },
     { code: 'CI', name: "Côte d'Ivoire" },
     { code: 'HR', name: 'Croatia' },
     { code: 'CU', name: 'Cuba' },
     { code: 'CY', name: 'Cyprus' },
     { code: 'CZ', name: 'Czech Republic' },
     { code: 'DK', name: 'Denmark' },
     { code: 'DJ', name: 'Djibouti' },
     { code: 'DM', name: 'Dominica' },
     { code: 'DO', name: 'Dominican Republic' },
     { code: 'EC', name: 'Ecuador' },
     { code: 'EG', name: 'Egypt' },
     { code: 'SV', name: 'El Salvador' },
     { code: 'GQ', name: 'Equatorial Guinea' },
     { code: 'ER', name: 'Eritrea' },
     { code: 'EE', name: 'Estonia' },
     { code: 'SZ', name: 'Eswatini' },
     { code: 'ET', name: 'Ethiopia' },
     { code: 'FJ', name: 'Fiji' },
     { code: 'FI', name: 'Finland' },
     { code: 'FR', name: 'France' },
     { code: 'GA', name: 'Gabon' },
     { code: 'GM', name: 'Gambia' },
     { code: 'GE', name: 'Georgia' },
     { code: 'DE', name: 'Germany' },
     { code: 'GH', name: 'Ghana' },
     { code: 'GR', name: 'Greece' },
     { code: 'GD', name: 'Grenada' },
     { code: 'GT', name: 'Guatemala' },
     { code: 'GN', name: 'Guinea' },
     { code: 'GW', name: 'Guinea-Bissau' },
     { code: 'GY', name: 'Guyana' },
     { code: 'HT', name: 'Haiti' },
     { code: 'HN', name: 'Honduras' },
     { code: 'HU', name: 'Hungary' },
     { code: 'IS', name: 'Iceland' },
     { code: 'IN', name: 'India' },
     { code: 'ID', name: 'Indonesia' },
     { code: 'IR', name: 'Iran' },
     { code: 'IQ', name: 'Iraq' },
     { code: 'IE', name: 'Ireland' },
     { code: 'IL', name: 'Israel' },
     { code: 'IT', name: 'Italy' },
     { code: 'JM', name: 'Jamaica' },
     { code: 'JP', name: 'Japan' },
     { code: 'JO', name: 'Jordan' },
     { code: 'KZ', name: 'Kazakhstan' },
     { code: 'KE', name: 'Kenya' },
     { code: 'KI', name: 'Kiribati' },
     { code: 'KP', name: 'North Korea' },
     { code: 'KR', name: 'South Korea' },
     { code: 'KW', name: 'Kuwait' },
     { code: 'KG', name: 'Kyrgyzstan' },
     { code: 'LA', name: 'Laos' },
     { code: 'LV', name: 'Latvia' },
     { code: 'LB', name: 'Lebanon' },
     { code: 'LS', name: 'Lesotho' },
     { code: 'LR', name: 'Liberia' },
     { code: 'LY', name: 'Libya' },
     { code: 'LI', name: 'Liechtenstein' },
     { code: 'LT', name: 'Lithuania' },
     { code: 'LU', name: 'Luxembourg' },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
     // 추가 국가 리스트
   ]);


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
    const selectCountry = (country) => {
      selectedCountry.value = country;
      searchQuery.value = country.name;
      user.nationality = country.name; // 선택된 국가의 이름을 user.nationality에 저장
      showDropdown.value = false;
    }
    const hideDropdown = () => {
      setTimeout(() => {
        showDropdown.value = false;
      }, 100); // 클릭 이벤트와 blur가 겹치지 않도록 약간의 지연
    }

    const filteredCountries = computed(() => {
      return countries.value.filter(country =>
        country.name.toLowerCase().includes(searchQuery.value.toLowerCase()))

    })
    const userIdAvailable = ref(true);
    const emailAvailable = ref(true);
    const showVerificationInput = ref(false);
    const verificationCodeInput = ref('');
    //const verificationCode = ref('');
    const isVerified = ref(false);
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

    const sendEmailVerification = async () => {
      if (!emailAvailable.value) {
        alert('An account created with this email already exists');
        return;
      }
      try {
        //console.log('123123')
        const response = await axios.post('http://localhost:3000/mail/sendVerification', {
          email: user.email,
        });
        if (response.status === 200 || response.status === 201) {
          showVerificationInput.value = true;
          buttonText.value = 'Resend';
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

      if (!userIdAvailable.value) {
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