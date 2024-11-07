<template>
    <div>
      <h2>아이디 찾기</h2>
      <form @submit.prevent="submitEmail">
        <label for="email">이메일을 입력해 주세요:</label>
        <input
          type="email"
          id="email"
          v-model="email"
          required
          placeholder="your-email@example.com"
        />
        <button type="submit">아이디 찾기</button>
      </form>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import FindUsername from '../../js/auth/FindUsername.js';
  
  export default FindUsername;
  </script>
  