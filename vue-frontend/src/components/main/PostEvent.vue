<template>

    <div class="Web">

        <!-- 헤더 -->
        <div class="row header-space">
            <div class="header-logo">
                <img class="logo-hifor" src="@/assets/img/logo_HiFor.png" alt="">
            </div>
            <div class="header-nav">
                <router-link class="header-nav-text" to="/HomeIndex">Home</router-link>
                <router-link class="header-nav-text" to="/HomeIndex">All Events</router-link>
                <router-link class="header-nav-text" to="/HomeIndex">F&Q</router-link>
                <router-link class="header-nav-text" to="/HomeIndex">Notice</router-link>
                <router-link class="header-nav-btn" to="/HomeIndex">SignIn/SignUp</router-link>
            </div>
        </div>


        <!-- banner -->
        <div class="banner">
            <p class="banner-text1">Post your event</p>
            <p class="banner-title">Post your event</p>
            <p class="banner-text2">It is the first step in your new life in Korea. Enjoy!</p>
        </div>

        <!-- 방생성 -->
        <div class="login-container">

            <div class="row create-image">
                <div class="col-2 sub-icon">
                    <img src="@/assets/img/icon_CreateEvent.png" alt="">
                </div>
                <div class="col sub-icon-text">
                    <p class="sub-title">Event information</p>
                    <p class="sub-text">Please enter the necessary information for the successful hosting of your event!</p>
                </div>
            </div>

            <div class="create-form">
                <form>
                    <div class="form-group">
                        <div class="row half-input-row">
                            <div class="col-6">
                                <label for="EventCategory">Event Category</label>
                                <select name="Category" id="">
                                    <option disabled hidden selected></option>
                                    <option value="">All</option>
                                    <option value="">Social</option>
                                    <option value="">Growth</option>
                                    <option value="">Taste</option>
                                    <option value="">Active</option>
                                    <option value="">Trip</option>
                                    <option value="">Play</option>
                                    <option value="">Style</option>
                                    <option value="">Etc..</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="EventType">Event type</label>
                                <select name="" id="">
                                    <option disabled hidden selected></option>
                                    <option value="FirstCome">First come</option>
                                    <option value="Register">Register</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="">Event name</label>
                        <input type="text" id="" placeholder="ex. HiFor party" required />
                    </div>

                    <div class="form-group">
                        <div class="row half-input-row">
                            <div class="col-6">
                                <label for="">Event location</label>
                                <select name="location" id="">
                                    <option disabled hidden selected></option>
                                    <option value="Jongno-gu">Jongno-gu</option>
                                    <option value="Jung-gu">Jung-gu</option>
                                    <option value="Yongsan-gu">Yongsan-gu</option>
                                    <option value="Seongdong-gu">Seongdong-gu</option>
                                    <option value="Gwangjin-gu">Gwangjin-gu</option>
                                    <option value="Dongdaemun-gu">Dongdaemun-gu</option>
                                    <option value="Jungnang-gu">Jungnang-gu</option>
                                    <option value="Seongbuk-gu">Seongbuk-gu</option>
                                    <option value="Gangbuk-gu">Gangbuk-gu</option>
                                    <option value="Dobong-gu">Dobong-gu</option>
                                    <option value="Nowon-gu">Nowon-gu</option>
                                    <option value="Eunpyeong-gu">Eunpyeong-gu</option>
                                    <option value="Seodaemun-gu">Seodaemun-gu</option>
                                    <option value="Mapo-gu">Mapo-gu</option>
                                    <option value="Yangcheon-gu">Yangcheon-gu</option>
                                    <option value="Gangseo-gu">Gangseo-gu</option>
                                    <option value="Guro-gu">Guro-gu</option>
                                    <option value="Geumcheon-gu">Geumcheon-gu</option>
                                    <option value="Yeongdeungpo-gu">Yeongdeungpo-gu</option>
                                    <option value="Dongjak-gu">Dongjak-gu</option>
                                    <option value="Gwanak-gu">Gwanak-gu</option>
                                    <option value="Seocho-gu">Seocho-gu</option>
                                    <option value="Gangnam-gu">Gangnam-gu</option>
                                    <option value="Songpa-gu">Songpa-gu</option>
                                    <option value="Gangdong-gu">Gangdong-gu</option>
                                    <option value="etc">etc</option>
                                </select>
                            </div>
                            <div class="col-6">
                                <label for="EventType">Event type</label>
                                <input type="text" id="" placeholder="The exact address" required />
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="details">Event details</label>
                        <textarea class="ipnut-detail" placeholder="ex. Korea" name="" id=""></textarea>
                    </div>

                    <div class="form-group">
                        <label for="details">Event details</label>
                        <form id="dropzone-form" class="dropzone needsclick" ref="dropzone">
                            <div class="dz-message needsclick">
                                <span class="text">Drop files here or click to upload.</span>
                                <span class="plus">+</span>
                            </div>
                        </form>
                    </div>

                    <div class="form-group">
                        <div class="row half-input-row">
                            <div class="col-6">
                                <label for="">Number of participants</label>
                                <input type="number" id="" placeholder="Minimum" required />
                            </div>
                            <div class="col-6">
                                <label for="">Number of participants</label>
                                <input type="number" id="" placeholder="Maximum" required />
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="details">Question for Selection</label>
                        <textarea class="ipnut-question" placeholder="Where are you from?" name="" id=""></textarea>
                    </div>

                    <button type="submit" class="btn-primary">Submit event</button>

                </form>
            </div>

        </div>

    </div>

</template>

<script setup>
import { onMounted, onBeforeUnmount, defineEmits } from "vue";
import Dropzone from "dropzone";

const emit = defineEmits(["update-form-data"]);
let dropzoneInstance = null;

// Dropzone 초기화 함수
const initDropzone = () => {
  // 기존 Dropzone 인스턴스 제거
  if (Dropzone.instances.length > 0) {
    Dropzone.instances.forEach((dz) => dz.destroy());
  }

  // 새로운 Dropzone 인스턴스 생성
  dropzoneInstance = new Dropzone("#dropzone-form", {
    url: "http://localhost:3000/gathering/upload", // 업로드 URL
    maxFiles: 5, // 최대 파일 수
    addRemoveLinks: true,
    acceptedFiles: "image/*", // 이미지 파일만 허용
    dictMaxFilesExceeded: "You can only upload up to 5 images.", // 제한 초과 메시지
    dictRemoveFile: "Remove", // 파일 제거 버튼 텍스트
    init() {
      this.on("addedfile", () => {
        // 최대 파일 수 초과 시 초과된 파일은 자동으로 제거
        if (this.files.length > this.options.maxFiles) {
          this.removeFile(this.files[0]); // 첫 번째 파일 삭제
        }
      });

      this.on("success", (file, response) => {
        // 업로드 성공 시 부모 컴포넌트에 URL 전달
        emit("update-form-data", { image: response.url });
        console.log("Uploaded file URL:", response.url);
      });

      this.on("removedfile", (file) => {
        // 파일 삭제 시 부모 컴포넌트에 데이터 초기화
        emit("update-form-data", { image: null });
        console.log("File removed:", file.name);
      });
    },
  });
};

// Dropzone 초기화 및 정리
onMounted(() => {
  initDropzone();
});

onBeforeUnmount(() => {
  if (dropzoneInstance) {
    dropzoneInstance.destroy();
  }
});
</script>


<!-- css -->
<style scoped>
    /* 반응형 모바일 css */
    @media screen and (max-width:768px){}
    /* 웹 */
    @media screen and (min-width:769px){
        /* header */
        .header-space{
            padding: 15px;
            max-width: 100%;
            width: 100%;
            justify-self: center;
        }
        .header-logo{
            max-width: 50%;
            font-size: 28px;
            font-weight: bold;
            color: #58C3FF;
        }
        .logo-hifor{
            width: 100px;
            margin-top: -20px;
        }
        .header-nav{
            max-width: 50%;
            text-align: right;
        }
        .header-nav-text{
            font-size: 18px;
            color: #58C3FF;
            padding: 15px;
            text-decoration: none;
            opacity: 1;
            transition: all 0.3s ease;
        }
        .header-nav-text:hover{
            font-size: 18px;
            color: #58C3FF;
            padding: 15px;
            text-decoration: none;
            opacity: 1;
            font-weight: 700;
        }
        .header-nav-btn{
            font-size: 18px;
            color: #58C3FF;
            text-decoration: none;
            padding: 10px 15px;
            margin: 0px 5px;
            text-decoration: none;
            border: 1px solid #58C3FF;
            border-radius: 32px;
            opacity: 1;
            transition: all 0.3s ease;
        }
        .header-nav-btn:hover{
            font-size: 18px;
            color: #58C3FF;
            text-decoration: none;
            padding: 10px 15px;
            margin: 0px 5px;
            text-decoration: none;
            border: 1px solid #58C3FF;
            border-radius: 32px;
            opacity: 1;
            font-weight: 700;
        }

        /* banner */
        .banner{
            padding: 75px 150px;
        }
        .banner-text1{
            color: #4457FF;
            font-size: 16px;
            font-weight: 400;
            text-align: center;
            margin: 0px;
        }
        .banner-text2{
            color: #5F687A;
            font-size: 16px;
            font-weight: 400;
            text-align: center;
        }
        .banner-title{
            color: #333;
            font-size: 54px;
            font-weight: bold;
            text-align: center;
        }

        /* 방생성 */
        .login-container {
            display: flex;
            background: #fff;
            border-radius: 10px;
            overflow: hidden;
            width: 100%;
            min-height: 680px;
            padding: 30px 150px;
        }

        .create-form {
            flex: 1;
            padding: 40px;
            padding-top: 20px;
            padding-bottom: 0px;
            max-width: 720px;
            align-content: center;
            margin-top: 40px;
            border: 1px solid #E5ECF8;
            border-radius: 24px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            font-size: 14px;
            margin-bottom: 5px;
            color: #333;
        }

        .form-group input {
            width: 100%;
            height: 50px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 24px;
            box-sizing: border-box;
        }

        .form-group textarea {
            width: 100%;
            height: 50px;
            padding: 20px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 24px;
            box-sizing: border-box;
        }

        .form-group form {
            width: 100%;
            padding: 20px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 24px;
            box-sizing: border-box;
        }

        .form-group select {
            width: 100%;
            height: 50px;
            padding: 10px;
            font-size: 16px;
            border: 1px solid #ccc;
            border-radius: 24px;
            box-sizing: border-box;
        }

        .password-group {
            position: relative;
        }

        .form-options {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .form-options label {
            font-size: 16px;
            color: #555;
        }

        .btn-primary {
            background-color: #4457FF;
            color: #fff;
            border: none;
            padding: 10px;
            width: 100%;
            height: 50px;
            font-size: 16px;
            border-radius: 24px;
            cursor: pointer;
            margin-bottom: 20px;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        .divider {
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 20px 0;
            color: #aaa;
        }

        .divider span {
            background: #fff;
            padding: 0 10px;
        }

        .create-image {
            flex: 1;
            display: flex;
            justify-content: center;
            width: 100%;
            height: 150px;
            background-repeat: no-repeat;
            background-size: cover;
            background-position: bottom;
            border-radius: 24px;
            padding: 40px;
        }

        .code-btn-box{
            align-content: end;
        }
        .code-btn{
            background-color: #58C3FF;
            border: none;
            color: #FFFFFF;
            padding: 13px 26px;
            border-radius: 12px;
        }
        .sub-icon{
            text-align: center;
        }
        .sub-title{
            font-size: 30px;
            font-weight: 600;
        }
        .sub-text{
            color: #5F687A;
        }
        .ipnut-detail{
            min-height: 360px;
        }
        .ipnut-question{
            height: 120px !important;
            padding: 15px !important;
        }

    }
</style>
