
<template>
    <body>
        <div class="mobile">
                <div class="container mobile-login">
                    <div class="row">
                        <div class="col">
                            <router-link to="/"><img class="back-icon" src="@/assets/Union.png" alt=""></router-link>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <p class="m-login-title">Log in</p>
                        </div>
                        <form @submit.prevent="handleLogin">
                            <div class="col-12">
                                <label for="userId"></label>
                                <input class="m-enter-email" type="text" v-model="form.userId" id="userId" placeholder="id" required />
                                <label for="password"></label>
                                <input class="m-enter-email" type="password" placeholder="pw" v-model="form.password" id="password" required />
                                <p class="m-remember"><input type="checkbox">&nbsp;Remember me</p>
                            </div>
                            <div class="col-12">
                                <button class="m-login-btn1" type="submit">Log in</button>
                            </div>
                        </form>
                    </div>
                    <div class="row m-or-box">
                        <img class="m-or-line" src="@/assets/Line 1.png" alt="">
                        <p class="m-or-text">or</p>
                        <img class="m-or-line" src="@/assets/Line 1.png" alt="">
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <button class="m-login-btn3" type="button" @click="handleGoogleLogin"><img class="m-icon-google" src="@/assets/icon_google.png" alt="">Log in with Google</button>
                        </div>
                    </div>
                    <div class="m-forgot-box">
                        <button class="m-link-btn">
                            <router-link class="m-forgot-id" to="/findUsername">Forgot id ?</router-link>
                        </button>
                        <br>
                        <button class="m-link-btn">
                            <router-link class="m-forgot-pw" to="/findPassword">Forgot password ?</router-link>
                        </button>
                    </div>
                </div>
            </div>
        <div class="web">
                <div class="contaienr web-login">
                    <div class="row">
                        <div class="col">
                            <router-link to="/"><img class="back-icon" src="@/assets/Union.png" alt=""></router-link>
                        </div>
                    </div>
                    <div class="row login-box1">
                        <div class="col-8">
                            <div class="login-box-left">
                                <p class="login-sub1">Welcome to HiFor</p>
                                <p class="login-sub2">Ready to Enjoy?</p>
                            </div>
                        </div>
                        <div class="col-4">
                            <div class="login-box-right">
                                <div class="login-box2">
                                    <p class="login-text1">Login</p>
                                    <p class="login-text2"> Welcome Back!</p>

                                    <div class="row">
                                        
                                        <form @submit.prevent="handleLogin">
                                        <div class="col-12">
                                            <div class="login-id">
                                                <label class="userId-ladel-text" for="userId"></label>
                                                <input class="enter-id" type="id" v-model="form.userId" id="userId" placeholder="Username" required />
                                            </div>
                                            
                                        </div>
                                        <div class="col-12">
                                            <label class="userPw-ladel-text" for="password"></label>
                                            <div class="login-password">
                                                <input
                                                    class="enter-password"
                                                    :type="isPasswordVisible ? 'text' : 'password'" 
                                                    v-model="form.password"
                                                    id="password"
                                                    placeholder="Password"
                                                    required
                                                />
                                                <i
                                                    class="fa"
                                                    :class="isPasswordVisible ? 'fa-eye-slash' : 'fa-eye'" 
                                                    @click="togglePasswordVisibility"
                                                ></i>
                                            </div>
                                            
                                        </div>
                                        <div class="col-12">
                                            <p class="checkbox-text"><input class="cb-remember" type="checkbox">Remember me</p>
                                        </div>
                                        <div class="col-12">
                                            <button type="submit" class="login-btn">Login</button>
                                        </div>
                                        </form>
                                        <div class="col-12 login-icon-box">
                                            <button class="login-btn" @click="handleGoogleLogin"><img class="login-google-icon" src="@/assets/icon_google.png" alt="">Login with Google</button>
                                        </div>
                                        <div class="col-12 forgot-box">
                                            <button class="link-btn">
                                                <router-link class="forgot-id-text" to="/findUsername">Forgot ID ?</router-link>
                                            </button>
                                            <br>
                                            <button class="link-btn">
                                                <router-link class="forgot-pw-text" to="/findPassword">Forgot password ?</router-link>
                                            </button>
                                        </div>
                                        <div class="col-12 go-signup">
                                            <button class="link-btn">
                                                <router-link class="go-signup-text" to="/signUp">Don’t have an account? Signup</router-link>
                                            </button>
                                        
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>    
        </div>

    </body>
    
</template>


<!--
<script>

    import SignIn from '../../js/auth/SignIn.js';

    export default SignIn;

</script>
-->

<!-- css -->
<style scoped>
    html, body{
        height: 100%;
    }
    form{
        margin: 0px;
        padding: 0px;
    }

    /* 반응형 모바일 css */
    @media screen and (max-width:768px) {
        .web{
            display: none;
        }
        .mobile{
            height: 100%;
            display: block;
            min-height: 900px;
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
            color: #07722B;
        }
        .m-enter-email{
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
        }
        .m-inc-text{
            color: red;
            margin: 0px;
            margin-top: 16px;
        }
        .m-remember{
            margin-top: 9px;
            padding-left: 3px;;
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
            margin-bottom: 24px;
        }
        .m-or-box{
            margin-bottom: 24px;
            align-items: center;
        }
        .m-or-text{
            width: 10%;
            margin: 0px;
        }
        .m-or-line{
            width: 45%;
            height: 1.5px;
        }
        .m-login-btn3{
            padding-top: 12px;
            padding-bottom: 12px;
            width: 100%;
            padding-top: 12px;
            padding-bottom: 12px;
            background: none;
            border-radius: 10px;
            border: 1px solid;
            color: #000;
            margin-bottom: 24px;
        }
        .m-icon-google{
            width: 25px;
            height: 25px;
            margin-right: 9px;
        }
        .m-forgot-box{
            margin-top: 32px;
            text-align: center;
            margin-bottom: 64px;
        }
        .m-link-btn{
            background: none;
            border: none;
        }
        .m-forgot-id{
            color: #000;
            text-decoration: underline;
        }
        .m-forgot-pw{
            color: #000;
            text-decoration: underline;
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
            min-height: 765px;
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
        .login-id{
            width: 100%;
            height: 55px;
            background: none;
            border: 1px solid;
            border-color: #FFF;
            border-radius: 10px;
            margin-bottom: 10px;
            padding: 5px;
        }
        .enter-id{
            width: 100%;
            height: 100%;
            background: none;
            border: none;
            border-radius: 10px;
            color: #FFF;
        }
        .login-password{
            width: 100%;
            height: 55px;
            background: none;
            border: 1px solid;
            border-color: #FFF;
            border-radius: 10px;
            margin-bottom: 10px;
            padding: 5px;
        }
        .inc-text{
            color: red;
            margin: 0px;
        }
        .enter-password{
            width: 90%;
            height: 100%;
            background: none;
            border: none;
            border-radius: 10px;
            color: #FFF;
        }
        .forgot-id-text{
            text-decoration: underline;
            color: #FFF;
        }
        .forgot-pw-text{
            text-decoration: underline;
            color: #FFF;
        }
        .link-btn{
            background: none;
            border: none;
        }
        .checkbox-text{
            margin: 0px;
            width: max-content;
            color: #FFF;
        }
        .cb-remember{
            margin-right: 5px;
        }
        input::placeholder{
            color:#FFF;
        }
        input{
            color:#FFF;
        }
        .login-btn{
            height: 50px;
            width: 100%;
            background: honeydew;
            border: none;
            border-radius: 12px;
            margin-top: 12px;
        }
        .forgot-box{
            text-align: center;
            margin-top: 12px;
        }
        .forgot-id{
            color: #FFF;
            font-size: 16px;
        }
        .forgot-pw{
            color: #FFF;
            margin-top: 12px;
        }
        .login-google-icon{
            width: 27px;
            margin-right: 20px;
        }
        .go-signup{
            margin-top:120px;
            text-align: center;
        }
        .go-signup-text{
            text-decoration: underline;
            color: #FFF;
        } 

        /* 비번 눈깔 */
        .fa-eye{
            cursor:pointer; 
            color: #FFF;
        }
    }
    
</style>

