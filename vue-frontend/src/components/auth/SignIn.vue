<template>
  <div class="sign-in">
    <h2>로그인</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="userId">아이디</label>
        <input type="text" v-model="form.userId" id="userId" required />
      </div>
      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" v-model="form.password" id="password" required />
      </div>
      <button type="submit">로그인</button>
    </form>
    <div class="buttons">
      <button @click="handleGoogleLogin">구글 계정으로 로그인</button>
      <button type="button"><router-link to="/findUsername">아이디 찾기</router-link></button>
      <button type="button"><router-link to="/findPassword">비밀번호 찾기</router-link></button>
    </div>
  </div>
</template>

<script>
import SignIn from '../../js/auth/SignIn.js';
  
  export default SignIn;
</script>

