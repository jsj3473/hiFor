
<template>

    <form @submit.prevent="handleRegister">


      <!--이름-->
      <div class="form-group">
        <label class="label-text-type1" for="username">Full name</label>
        <input class="input-box-type1" type="text" v-model="user.username" id="username" required placeholder="Hifor"/>
      </div>
      <!-- 생일 -->
      <div class="form-group">
        <label class="label-text-type1" for="dob">Date of Birth</label>
        <input class="input-box-type1" type="date" v-model="user.dob" id="dob" required/>
      </div>

      <!-- 성별 -->
      <div class="form-group">
        <label class="label-text-type1" for="gender">Gender</label>
        <select class="input-box-type1" v-model="user.gender" id="gender" required>
          <option value="">Please Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <!-- 국가 -->
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

      <button type="submit" class="ca-btn">Sign up</button>



    </form>
  </template>
  
  <script setup>
  import { jwtDecode } from 'jwt-decode';
  import axios from 'axios';
  import { ref, reactive, onMounted, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';

  const user = reactive({
    email: '',
    username: '',
    dob: '',
    gender: '',
    nationality: '',
  });

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
  const store = useStore(); // Vuex store에 접근
  const router = useRouter(); // Vue Router 사용

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
  // JWT 토큰 추출 및 디코딩
  const decodeJwtFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        user.username = decodedToken.name || '';
        user.email = decodedToken.email || '';
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  };

  // 회원가입 처리 함수
  const handleRegister = async () => {
    const requiredCheckboxes = checkboxes.value.filter((cb, index) => index < 2); // Required 체크박스만 필터링
    const allRequiredChecked = requiredCheckboxes.every((cb) => cb.checked);

    if (!allRequiredChecked) {
      alert('You must agree to the required terms to sign up.');
      return; // 제출 중단
    }
    console.log('핸들레지스터의 유저:',user)
    try {
      const response = await axios.post('http://localhost:3000/auth/googleSignUp', user);
      console.log('회원가입 응답:', response.data);
      alert('Sign-up completed!');

      // JWT 토큰 저장
      store.commit('setToken', response.data.access_token); // Vuex 상태에 저장
      store.commit('setUserId', user.userId);
      sessionStorage.setItem('token', response.data.access_token);

      router.push('/');
    } catch (error) {
      console.error('회원가입 오류:', error);
      alert('An error occurred during sign-up. Please try again.');
    }
  };

  // 체크박스 전체 선택/해제
  const toggleAllCheckboxes = () => {
    const allChecked = checkboxes.value.every((cb) => cb.checked); // 모든 체크박스가 체크 상태인지 확인
    checkboxes.value.forEach((cb) => {
      cb.checked = !allChecked; // 모두 체크/해제 상태로 변경
    });
  };

  // 컴포넌트가 마운트될 때 실행
  onMounted(() => {
    decodeJwtFromUrl();
  });

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