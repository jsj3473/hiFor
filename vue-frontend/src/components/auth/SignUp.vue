<template>
  <div class="sign-up">
    <h2>회원가입</h2>
    <form @submit.prevent="handleRegister">
      <div class="form-group">
        <label for="username">이름</label>
        <input type="text" v-model="user.username" id="username" required />
      </div>
      <div class="form-group">
        <label for="userId">아이디</label>
        <input type="text" v-model="user.userId" id="userId" @input="checkUserIdAvailability" required placeholder="6자-20자"/>
        <span v-if="!userIdAvailable" class="error-message">중복된 아이디입니다.</span>
      </div>
      <div class="form-group">
        <label for="email">이메일</label>
        <input type="email" v-model="user.email" id="email" @input="checkEmailAvailability" required />
        <button type="button" @click="sendEmailVerification">이메일 인증</button>
        <span v-if="!emailAvailable" class="error-message">중복된 이메일입니다.</span>
      </div>
      <!-- 인증번호 입력 필드 -->
      <div class="form-group" v-if="showVerificationInput">
        <label for="verificationCode">인증번호 입력</label>
        <input type="text" v-model="verificationCodeInput" id="verificationCode" required />
        <button type="button" @click="verifyCode">인증번호 확인</button>
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" v-model="user.password" id="password" required placeholder="영문 대소문자, 숫자, 특수문자를 포함"/>
      </div>
      <div class="form-group">
        <label for="confirmPassword">비밀번호 확인</label>
        <input type="password" v-model="user.confirmPassword" id="confirmPassword" required />
      </div>
      <div class="form-group">
        <label for="dob">생년월일</label>
        <input type="date" v-model="user.dob" id="dob" />
      </div>
      <div class="form-group">
        <label for="gender">성별</label>
        <select v-model="user.gender" id="gender">
          <option value="">선택하세요</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
          <option value="other">기타</option>
        </select>
      </div>
      <div class="form-group">
        <label for="phoneNumber">휴대폰 번호</label>
        <input type="text" v-model="user.phoneNumber" id="phoneNumber" />
      </div>
      <div class="form-group">
        <label for="nationality">국적</label>
        <input type="text" v-model="user.nationality" id="nationality" />
      </div>
      <div class="form-group">
        <label for="identityStatus">신분</label>
        <input type="text" v-model="user.identityStatus" id="identityStatus" />
      </div>
      <button type="submit">회원가입</button>
      <button @click="googleSignIn">구글 계정으로 로그인</button>
    </form>
  </div>
</template>

<script>
import SignUp from '../../js/auth/SignUp.js';
  
  export default SignUp;
</script>


