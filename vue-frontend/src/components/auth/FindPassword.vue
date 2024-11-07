<template>
    <div>
      <h2>비밀번호 찾기</h2>
      <form @submit.prevent="submitForm">
        <label for="userId">아이디:</label>
        <input type="text" id="userId" v-model="userId" required />
  
        <label for="email">이메일:</label>
        <input type="email" id="email" v-model="email" required />
  
        <button type="submit">비밀번호 초기화</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
</template>

<script>
import FindPassword from '../../js/auth/FindPassword.js';

export default FindPassword;
</script>