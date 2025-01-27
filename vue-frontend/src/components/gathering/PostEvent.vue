
<template>

  <div class="Web">


    <!-- banner -->
    <div class="banner">
      <p class="banner-text1">New EVENT!</p>
      <p class="banner-title">Post your event</p>
      <p class="banner-text2">It is the first step in your new life in Korea. Enjoy!</p>
    </div>

    <!-- 방생성 -->
    <div class="login-container">

      <div class="row create-image">
        <div class="col-2 sub-icon">
          <img src="../../assets/img/icon_CreateEvent.png" alt="">
        </div>
        <div class="col sub-icon-text">
          <p class="sub-title">Event information</p>
          <p class="sub-text">Please enter the necessary information for the successful hosting of your event!</p>
        </div>
      </div>

      <div class="create-form">
        <form  @submit.prevent="postEvent">
          <div class="form-group">
            <div class="row half-input-row">
              <div class="col-6">
                <label for="EventCategory">Event Category</label>
                <select v-model="form.category">
                  <option disabled hidden selected></option>
                  <option value="Social">Social</option>
                  <option value="Growth">Growth</option>
                  <option value="Taste">Taste</option>
                  <option value="Active">Active</option>
                  <option value="Trip">Trip</option>
                  <option value="Play">Play</option>
                  <option value="Style">Style</option>
                  <option value="Others">Etc..</option>
                </select>
              </div>
              <div class="col-6">
                <label for="EventType">Event type</label>
                <select v-model="form.type">
                  <option disabled hidden selected></option>
                  <option value="FirstCome">First come</option>
                  <option value="Register">Register</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="">Event name</label>
            <input type="text" v-model="form.name" placeholder="ex. HiFor party" required />
          </div>

          <div class="form-group">
            <div class="row half-input-row">
              <div class="col-6">
                <label for="">Event location</label>
                <select v-model="form.location">
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
                <label for="EventType">Event type  바꿔야함 (정상진)</label>
                <input type="text" v-model="form.locationDetail" placeholder="The exact address" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <div class="row half-input-row">
              <div class="col-6">
                <label for="">Event Date</label>
                <input type="date" v-model="form.date" required />
              </div>
              <div class="col-6">
                <label for="">Event Time</label>
                <input type="time" v-model="form.time" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="details">Event details</label>
            <textarea class="ipnut-detail"
                      v-model="form.description"
                      placeholder="You Might Include..

 - Purpose of the event
 - planned activities
 - who can join
 - what to expect
                        "
                      name=""
                      id=""
            ></textarea>
          </div>

          <!-- Dropzone 수정된 부분 -->
          <div class="form-group">
            <label for="file-upload">Event Images</label>
            <p>The first image will be the main image of the event.<br>Drop files here or click to upload.</p>

            <!-- 파일 입력 -->
            <input
              type="file"
              id="file-upload"
              multiple
              accept="image/*"
              @change="handleFileUpload"
              style="display: none;"
            />

            <!-- 클릭 가능한 업로드 박스 -->
            <div
              id="upload-box"
              @click="triggerFileInput"
              @dragover.prevent
              @drop.prevent="handleDrop"
              style="border: 2px dashed #ccc; padding: 20px; text-align: center; cursor: pointer;"
            >
              <span>Click to upload or drag and drop files here</span>
            </div>

            <!-- 업로드된 파일 미리보기 및 제거 -->
            <ul id="file-list" style="margin-top: 10px; list-style: none; padding: 0;">
              <li v-for="(file, index) in uploadedFiles" :key="index">
                <img
                  :src="file.preview"
                  alt="Preview"
                  style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;"
                />
                {{ file.name }}
                <button
                  @click="removeFile(index)"
                  style="margin-left: 10px; cursor: pointer; color: red;"
                >
                  Remove
                </button>
              </li>
            </ul>
          </div>
          <!-- Dropzone 끝 -->

          <div class="form-group">
            <div class="row half-input-row">
              <div class="col-6">
                <label for="">Number of participants</label>
                <input type="number" v-model="form.minParticipants" placeholder="Minimum" required />
              </div>
              <div class="col-6">
                <label for="">Number of participants</label>
                <input type="number" v-model="form.maxParticipants"  placeholder="Maximum" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="details">Question for Selection</label>
            <textarea class="ipnut-question" placeholder="Where are you from?" v-model="form.question"  id=""></textarea>
          </div>

          <div class="form-group">
            <label for="details">Price</label>
            <input type="number" v-model="form.price" placeholder="ex) 20,000KRW / All events must be approved on-site!" required />
          </div>

          <!-- 방생성 버튼 -->
          <div class="login-container-op2">

            <div class="create-form-op2">

                <div class="agreement-container">
                  <!-- 체크박스와 텍스트 -->
                  <label class="agreement-label">
                    Notice: Once an event post is published, it cannot be edited
                  </label>
                  <label class="agreement-label">
                    I agree to include all additional fees in the event details and understand that failing to do so may result in penalties
                  </label>
                  <label class="agreement-label">
                    I have read the basic
                    <span @click="openPopup" class="usage-rules-link">usage rules</span>
                    of HiFor, and I agree with that.
                    <input type="checkbox" v-model="isChecked" class="agreement-checkbox" />
                    <span class="checkbox-custom"></span>
                  </label>
                  <!-- Join Now 버튼 -->
                  <button type="submit" class="join-now-button-op2" :disabled="!isChecked">Submit event</button>
                </div>

            </div>

          </div>

        </form>

      </div>
    </div>

  </div>

</template>

<script setup>
import { ref, toRaw } from 'vue';
import axios from "axios";

// 폼 데이터 및 상태 관리
const form = ref({
  category: "",
  type: "",
  name: "",
  location: "",
  locationDetail: "",
  date: "",
  time: "",
  description: "",
  minParticipants: 0,
  maxParticipants: 0,
  question: "",
  price: 0,
  mainImage: "", // 첫 번째 이미지 URL
  images: [], // 나머지 이미지 URL 배열
});

const uploadedFiles = ref([]);
const maxFiles = 5;

const handleFileUpload = (event) => {
  const files = Array.from(event.target.files);
  processFiles(files);
};

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files);
  processFiles(files);
};

const processFiles = (files) => {
  if (uploadedFiles.value.length + files.length > maxFiles) {
    alert(`You can upload up to ${maxFiles} files.`);
    return;
  }

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedFiles.value.push({
        file: file,
        name: file.name,
        preview: e.target.result,
      });
    };
    reader.readAsDataURL(file);
  });
};

const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1);
};

const triggerFileInput = () => {
  document.getElementById('file-upload').click();
};




const postEvent = async () => {
  try {
    const uploadedImageUrls = [];
    for (const fileObj of uploadedFiles.value) {
      const rawFile = toRaw(fileObj.file); // Proxy 객체 제거
      console.log('Raw File:', rawFile);
      console.log('Type of Raw File:', typeof rawFile); // 타입 확인
      console.log('Is File Instance:', rawFile instanceof File); // File 객체인지 확인
      console.log('File Type:', rawFile.type); // 파일의 MIME 타입 (예: image/jpeg)

      const formData = new FormData();
      formData.append('file', rawFile);


      console.log('formdata:',formData)
      const uploadResponse = await axios.post(
        "http://localhost:3000/gathering/upload-image-postEvent",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      uploadedImageUrls.push(uploadResponse.data.imageUrl);
    }
// `uploadedFiles.value`에서 데이터를 분리
    const mainImage =
      uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : null; // 첫 번째 파일
    const images =
      uploadedImageUrls.length > 1 ? uploadedImageUrls.slice(1) : []; // 나머지 파일들
    const userId = sessionStorage.getItem("userId");
    const eventData = {
      category: form.value.category,
      type: form.value.type,
      name: form.value.name,
      location: form.value.location,
      locationDetail: form.value.locationDetail,
      date: form.value.date,
      time: form.value.time,
      description: form.value.description,
      minParticipants: form.value.minParticipants,
      maxParticipants: form.value.maxParticipants,
      question: form.value.question,
      price: form.value.price,
      mainImage: mainImage,
      images: images,
    };
    const enrichedFormData = {
      ...toRaw(eventData),
      userId: userId
    };
    console.log(eventData.mainImage)
    console.log(eventData.images)

    // Axios를 이용한 POST 요청
    const response = await axios.post("http://localhost:3000/gathering/submit", enrichedFormData);

    // 성공적으로 전송된 경우
    console.log("Event created successfully:", response.data);

    // 성공 메시지 표시 (필요에 따라 구현)
    alert("Event created successfully!");

    // 폼 초기화
    Object.keys(form.value).forEach((key) => {
      form.value[key] = "";
    });
  } catch (error) {
    // 에러 처리
    console.error("Error creating event:", error);
    alert("Failed to create event. Please try again.");
  }
};


// 체크박스 상태
const isChecked = ref(false);

// 팝업 창 열기 함수
const openPopup = () => {
  const popupContent = `
    <html>
      <head>
        <title>Usage Rules</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            padding: 20px;
          }
          h3 {
            color: #333;
          }
          ul {
            padding-left: 20px;
          }
          li {
            margin-bottom: 10px;
          }
          p {
            margin-bottom: 10px;
          }
          .close-btn {
            margin-top: 20px;
            padding: 10px 20px;
            border: none;
            background-color: #007bff;
            color: white;
            border-radius: 5px;
            cursor: pointer;
          }
          .close-btn:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h2>Usage Rules</h2>
        <h3>1. 개인정보 수집 및 이용 동의서 (필수)</h3>
        <ul>
          <li>개인정보 수집 항목</li>
          <p>필수 항목: 이름, 생년월일, 국적, 이메일 주소, 비밀번호</p>
          <p>선택 항목: 학교, 관심 있는 소모임/이벤트 카테고리, 프로필 사진</p>
          <li>수집 목적</li>
          <ul>
            <li>플랫폼 이용을 위한 기본 정보 관리</li>
            <li>회원 식별 및 인증</li>
            <li>소모임/이벤트 등록 및 참여 관리</li>
            <li>사용자 맞춤형 서비스 제공</li>
          </ul>
          <li>개인정보 보유 및 이용 기간</li>
          <p>회원 탈퇴 시 즉시 파기</p>
          <p>단, 법령에 따라 보관해야 하는 경우 아래 기준에 따릅니다:</p>
          <ul>
            <li>계약 또는 청약 철회 기록: 5년</li>
            <li>대금 결제 및 재화 공급 기록: 5년</li>
            <li>소비자 불만 또는 분쟁 처리 기록: 3년</li>
          </ul>
          <li>개인정보 제공 및 위탁</li>
          <p>개인정보는 원칙적으로 외부에 제공하지 않습니다.</p>
          <li>동의 거부 시 불이익</li>
          <p>필수 항목에 대한 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.</p>
        </ul>
        <h3>2. 광고성 이메일 수신 동의서 (선택)</h3>
        <ul>
          <li>수집 및 이용 목적</li>
          <p>소모임/이벤트 관련 추천 정보 제공</p>
          <li>보유 및 이용 기간</li>
          <p>회원 탈퇴 시 즉시 파기</p>
          <li>수신 거부 권리</li>
          <p>사용자는 언제든지 광고성 이메일 수신을 거부할 수 있습니다.</p>
        </ul>
        <button class="close-btn" onclick="window.close()">Close</button>
      </body>
    </html>
  `;

  const popupWindow = window.open(
    "",
    "Usage Rules",
    "width=600,height=700,scrollbars=yes,resizable=yes"
  );

  popupWindow.document.write(popupContent);
  popupWindow.document.close();
};
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

  .form-group .text{
    font-size: 16px;
    color: #555;
  }

  .form-group .plus{
    font-size: 14px;
    color: #555;
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

  /* 컨테이너 스타일 */
  .agreement-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 20px;
    font-family: Arial, sans-serif;
    padding-top: 30px;
  }

  /* 약관 텍스트 스타일 */
  .agreement-label {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #6c757d;
    margin-bottom: 20px;
    position: relative;
  }

  /* usage rules 링크 스타일 */
  .usage-rules-link {
    color: #4457FF;
    text-decoration: none;
    margin: 0 5px;
  }

  .usage-rules-link:hover {
    text-decoration: underline;
  }

  /* 커스텀 체크박스 스타일 */
  .agreement-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 20px;
    font-family: Arial, sans-serif;
  }

  .usage-rules-link {
    color: #007bff;
    text-decoration: underline;
    cursor: pointer;
  }

  /* Join Now 버튼 스타일 */

  .join-now-button {
    background-color: #4a68ff;
    width: 100%;
    color: white;
    border: none;
    border-radius: 50px;
    padding: 15px 40px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .join-now-button:disabled {
    background-color: #d6d6d6;
    cursor: not-allowed;
  }

  .join-now-button:hover:not(:disabled) {
    background-color: #4457FF;
  }

  .join-now-button-op2 {
    background-color: #4a68ff;
    color: white;
    width: 300px;
    border: none;
    border-radius: 50px;
    padding: 15px 40px;
    margin-bottom: 40px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .join-now-button-op2:disabled {
    background-color: #d6d6d6;
    cursor: not-allowed;
  }

  .join-now-button-op2:hover:not(:disabled) {
    background-color: #4457FF;
  }

}
</style>
