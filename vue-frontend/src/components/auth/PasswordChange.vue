<template>
    <div class="password-change">
      <h2>비밀번호 변경</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="currentPassword">현재 비밀번호</label>
          <input
            type="password"
            v-model="password"
            id="password"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="newPassword">새 비밀번호</label>
          <input
            type="password"
            v-model="newPassword"
            id="newPassword"
            required
          />
        </div>
  
        <div class="form-group">
          <label for="confirmPassword">새 비밀번호 확인</label>
          <input
            type="password"
            v-model="confirmPassword"
            id="confirmPassword"
            required
          />
        </div>
  
        <div class="button-group">
          <button type="submit">확인</button>
          <button type="button" @click="handleCancel">다음에 변경하기</button>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import PasswordChange from '../../js/auth/PasswordChange.js';
  
  export default PasswordChange;
  </script>
  

  