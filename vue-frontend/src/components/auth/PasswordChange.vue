<template>
  <div class="password-change">
    <h2>비밀번호 변경</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="currentPassword">현재 비밀번호</label>
        <input
          type="password"
          v-model="currentPassword"
          id="currentPassword"
          required
        />
        <button type="button" @click="checkCurrentPassword">확인</button>
      </div>

      <div v-if="isCurrentPasswordValid">
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
      </div>
    </form>
  </div>

    <!-- mobile -->
    <div class="mobile">
        <div class="container mobile-login">
            <div class="row">
                <div class="col">
                    <img class="back-icon" src="/vue-frontend/src/assets/Union.png" alt="">
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <p class="m-login-title">Change Password</p>
                </div>
                <div class="col-12">
                    <input class="m-enter-pw" type="password" placeholder="Current Password">
                    <input class="m-enter-pw" type="password" placeholder="New Password">
                    <input class="m-enter-pw" type="password" placeholder="Confirm New Password">
                </div>
                <div class="col-12">
                    <button class="m-login-btn1" type="button">Change password</button>
                    <button class="m-login-btn2" type="button">Change later</button>
                </div>
            </div>
        </div>
     </div>

    <!-- 웹 -->
     <div class="web">
        <div class="contaienr web-login">
            <div class="row">
                <div class="col">
                    <a href="#">
                        <img src="/vue-frontend/src/assets/Union.png" alt="">
                    </a>
                </div>
            </div>
            <div class="row login-box1">
                <div class="col-8">
                    <div class="login-box-left">
                        <p class="login-sub1">No worries..!</p>
                        <p class="login-sub2">We can help you!!</p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="login-box-right">
                        <div class="login-box2">
                            <p class="login-text1">Change Password</p>

                            <div class="row">
                                <div class="col-12">
                                    <input class="enter-cp" type="password" placeholder="Current Password">
                                </div>
                                <div class="col-12">
                                    <input class="enter-password" type="password" placeholder="New Password">
                                </div>
                                <div class="col-12">
                                    <input class="enter-password" type="password" placeholder="Confirm New Password">
                                </div>
                                <div class="col-12">
                                    <button class="reset-btn">Reset Password.</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    </div>
</template>
  
  <script>
  import PasswordChange from '../../js/auth/PasswordChange.js';
  
  export default PasswordChange;
  </script>
  

  <!-- css -->
<style>


html, body{
    height: 100%;
}

/* 반응형 모바일 css */
@media screen and (max-width:768px) {
    .web{
        display: none;
    }
    .mobile{
        display: block;
    }
    .mobile-login{
        margin-top: 60px;
    }
    .back-icon{
        width: 15px;
        height: 15px;
        filter: invert(1);
    }
    .m-login-title{
        margin-top: 60px;
        font-size: 36px;
    }
    .m-enter-pw{
        height: 50px;
        width: 100%;
        border: 1px solid;
        font-size: 15px;
        padding: 15px;
        margin-top: 32px;
        border-radius: 10px;
    }
    .show-id{
        height: 50px;
        width: 100%;
        border: 1px solid;
        font-size: 15px;
        padding: 15px;
        margin-top: 32px;
        border-radius: 10px;
    }
    .m-login-btn1{
        padding-top: 12px;
        padding-bottom: 12px;
        width: 100%;
        padding-top: 12px;
        padding-bottom: 12px;
        margin-top: 32px;
        background-color: #12CF51;
        border-radius: 10px;
        border: none;
        color: #FFF;
    }
    .m-login-btn2{
        padding-top: 12px;
        padding-bottom: 12px;
        width: 100%;
        padding-top: 12px;
        padding-bottom: 12px;
        margin-top: 16px;
        background-color: #07722B;
        border-radius: 10px;
        border: none;
        color: #FFF;
        margin-bottom: 32px;
    }
}

/* 웹 */
@media screen and (min-width:769px){
    .mobile{
        display: none;
    }
    .web{
        display: block;
    }
    .web-login{
        display: flex;
        flex-direction: column;
        background: linear-gradient(#58D89A, #3FDE83);
        padding: 60px;
        padding-top:30px;
        height: 100%;
    }
    .row{
        max-width: 100%;
    }

    .login-box1{
        place-items: center;
        height: 100%;
    }
    .login-box-left{
        
    }
    .login-sub1{
        color: #FFFFFF;
        font-weight: 700;
        font-size: 96px;
    }
    .login-sub2{
        width: max-content;
        color: #FFFFFF;
        font-size: 32px;
        font-style: italic;
        border: 3px solid;
        border-color: #FFFFFF;
        padding-left: 15px;
        padding-right: 15px;
    }

    .login-box-right{
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
        padding:40px;
        border-radius: 20px;
        height: 100%;
    }
    .login-box2{
        height: 100%;
    }
    .login-text1{
        font-size: 36px;
        color: #FFFFFF;
        font-weight: 700;
        margin-bottom: 0px;
    }
    .login-text2{
        font-size: 16px;
        color: #FFFFFF;
    }
    .enter-cp{
        width: 100%;
        height: 55px;
        background: none;
        border: 1px solid;
        border-color: #FFF;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 5px;
        margin-top: 30px;
    }
    .enter-password{
        width: 100%;
        height: 55px;
        background: none;
        border: 1px solid;
        border-color: #FFF;
        border-radius: 10px;
        margin-bottom: 10px;
        padding: 5px;
    }
    input::placeholder{
        color:#FFF;
    }
    input{
        color:#FFF;
    }
    .reset-btn{
        height: 50px;
        width: 100%;
        background: honeydew;
        border: none;
        border-radius: 12px;
        margin-top: 12px;
    }
}

</style>