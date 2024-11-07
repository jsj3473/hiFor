<template>
  <div class="mypage">
    <h2>마이페이지</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="userId">User ID:</label>
        <input type="text" v-model="user.userId" id="userId" disabled />
      </div>

      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" id="email" :disabled="user.isEmailVerified" />
        <!-- <button v-if="!user.isEmailVerified" @click="verifyEmail">이메일 인증</button>-->
      </div>

      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="user.username" id="username" />
      </div>

      <div class="form-group">
        <label for="dob">Date of Birth:</label>
        <input type="date" v-model="user.dob" id="dob" />
      </div>

      <div class="form-group">
        <label for="gender">Gender:</label>
        <input type="text" v-model="user.gender" id="gender" />
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number:</label>
        <input type="text" v-model="user.phoneNumber" id="phoneNumber" :disabled="user.isPhoneVerified" />
        <!-- <button v-if="!user.isPhoneVerified" @click="verifyPhoneNumber">휴대폰 인증</button> -->
      </div>

      <div class="form-group">
        <label for="nationality">Nationality:</label>
        <input type="text" v-model="user.nationality" id="nationality" />
      </div>

      <div class="form-group">
        <label for="identityStatus">Identity Status:</label>
        <input type="text" v-model="user.identityStatus" id="identityStatus" />
      </div>

      <button type="submit">확인</button>
    </form>
  </div>
</template>

<script>
import MyPage from '../js/MyPage.js';
  
  export default MyPage;
</script>


