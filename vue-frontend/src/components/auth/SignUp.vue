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
                <label class="label-text-type1" for="username">username</label>
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


          <!-- 2열 email / code -->
          <div class="row form-table">
            <div class="col-6">
              <div class="form-group">
                <label class="label-text-type1" for="email">Email</label>
                <div class="input-box-type1">
                  <div class="row">
                    <input class="input-box-type2" type="email" v-model="user.email" id="email" @input="checkEmailAvailability" required placeholder="Enter your email"/>
                    <button class="input-btn-type2" :disabled="isTimerRunning" type="button" @click="sendEmailVerification">{{ buttonText }}</button> 
                  </div>
                  
                  <!-- 타이머 표시 -->
                  <div v-if="isTimerRunning" class="timer">
                    Resend available in {{ formattedTime }}
                  </div>
                </div>
                <div v-if="!emailAvailable" class="error-message error-text">An account created with this email already exists</div>
                <div v-if="!emailAvailable" class="error-message error-text"><router-link to="/findUsername">Move to Find my ID.</router-link></div>
              </div>
            </div>
            <div class="col-6">
              <div class="form-group" v-if="showVerificationInput">
                <label class="label-text-type1" for="verificationCode">Verification Code</label>
                <div class="input-box-type1">
                  <div class="row">
                    <input class="input-box-type2" type="text" v-model="verificationCodeInput" id="verificationCode" required />
                    <button v-if="!isVerified" class="input-btn-type2" type="button" @click="verifyCode">Verify</button>
                    <button v-if="isVerified" class="input-btn-type2" type="button">Verified</button>
                  </div>
                </div>
                <span v-if="!emailAvailable" class="error-message error-text">Your Verification code is incorrect.</span>
              </div>
            </div>
          </div>

          <!-- 3열 pw / confirm pw -->
          <div class="row form-table">
            <!-- 비밀번호 입력 -->
            <div class="col-6">
              <div class="form-group">
                <label class="label-text-type1" for="password">Password</label>
                <div class="input-with-icon">
                  <input
                    class="input-box-type1"
                    :type="isPasswordVisible ? 'text' : 'password'" 
                    v-model="user.password"
                    id="password"
                    required
                    placeholder="ex. HiFor!!1234"
                  />
                  <i
                    class="fa"
                    :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
                    @click="togglePasswordVisibility"
                  ></i>
                </div>
              </div>
            </div>

            <!-- 비밀번호 확인 -->
            <div class="col-6">
              <div class="form-group">
                <label class="label-text-type1" for="confirmPassword">Confirm Password</label>
                <div class="input-with-icon">
                  <input
                    class="input-box-type1"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    v-model="user.confirmPassword"
                    id="confirmPassword"
                    required
                  />
                  <i
                    class="fa"
                    :class="isConfirmPasswordVisible ? 'fa-eye-slash' : 'fa-eye'"
                    @click="toggleConfirmPasswordVisibility"
                  ></i>
                </div>
              </div>
            </div>
          </div>

          <!-- 4열 date of birth -->
          <div class="row form-table">
            <div class="col-6">
              <div class="form-group">
                <label class="label-text-type1" for="dob">Date of Birth</label>
                <input class="input-box-type1" type="date" v-model="user.dob" id="dob" />
              </div>
            </div>
            <div class="col-6"></div>
          </div>

          <!-- 5열 Gender/Nationality -->
          <div class="row form-table">
            <div class="col-6">
              <div class="form-group">
                <label class="label-text-type1" for="gender">Gender</label>
                <select class="input-box-type1" v-model="user.gender" id="gender">
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
                <input class="input-box-type1" type="text" v-model="user.nationality" id="nationality" />
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
import SignUp from '../../js/auth/SignUp.js';
  
  export default SignUp;

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