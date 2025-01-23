<template>

  <div class="Web">

    <!-- 호스트 질문이 있는경우 -->
    <template v-if="event.question">
    <!-- banner -->
    <div class="banner">
      <p class="banner-text1">it’s time to join!</p>
      <p class="banner-title">Join event</p>
      <p class="banner-text2">Your next great adventure starts here!</p>
    </div>

    <EventCard
      :event="event"
    />

    <p class="card-detail text-center">
      <br>
      Event fees are paid by the host on site.
    </p>

    <!-- 방참가 -->
    <div class="login-container">

      <div class="row create-image">
        <div class="col-2 sub-icon">
          <img src="../../assets/img/icon_CreateEvent.png" alt="">
        </div>
        <div class="col sub-icon-text">
          <p class="sub-title">Host’s Question</p>
          <p class="sub-text">Answer the following questions to help the host select the guests for the event!</p>
        </div>
      </div>

      <div class="create-form">
        <form  @submit.prevent="submitEvent">

          <div class="form-group">
            <label for="details">Question for Selection</label>
            <div class="ipnut-detail" name="" id="">Where are you from?</div>
          </div>

          <div class="form-group">
            <label for="details">Answer for Selection</label>
            <textarea class="ipnut-question" placeholder="Your answer:" v-model="userAnswer"></textarea>
          </div>

          <div class="agreement-container">
            <!-- 체크박스와 텍스트 -->
            <label class="agreement-label">
              As a rule, all payments should be made directly to the host on-site.
            </label>
            <label class="agreement-label">
              I have read the basic
              <span @click="openPopup" class="usage-rules-link">usage rules</span>
              of HiFor, and I agree with that.
              <input type="checkbox" v-model="isChecked" class="agreement-checkbox" />
              <span class="checkbox-custom"></span>
            </label>
            <!-- Join Now 버튼 -->
            <button type="submit" class="join-now-button" :disabled="!isChecked">Submit event</button>
          </div>

        </form>
      </div>

    </div>
    </template>
    <!-- 호스트 질문이 없는 경우 -->
    <template v-else>
    <!-- banner -->
    <div class="banner">
      <p class="banner-text1">Join event</p>
      <p class="banner-title">Join event</p>
      <p class="banner-text2">Your next great adventure starts here!</p>
    </div>

    <EventCard
      :event="event"
    />

    <p class="card-detail text-center">
      <br>
      Event fees are paid by the host on site.
    </p>

    <!-- 방참가 -->
      <form @submit.prevent="submitEvent">
        <div class="login-container-op2">

          <div class="create-form-op2">

              <div class="agreement-container">
                <!-- 체크박스와 텍스트 -->
                <label class="agreement-label">
                  I have read the basic
                  <span @click="openPopup" class="usage-rules-link">usage rules</span>
                  of HiFor, and I agree with that.
                  <input type="checkbox" v-model="isChecked" class="agreement-checkbox" />
                  <span class="checkbox-custom"></span>
                </label>
                <!-- Join Now 버튼 -->
                <button type="submit" class="join-now-button-op2" :disabled="!isChecked" >Submit event</button>
              </div>
          </div>

        </div>

      </form>
    </template>
  </div>

</template>


<script setup>
import {  onMounted, ref } from 'vue';
import EventCard from '@/components/gathering/EventCard.vue';
import axios from 'axios';
//import { useStore } from 'vuex';
//const store = useStore();
const userId =  sessionStorage.getItem('userId');
const userAnswer = ref();
const event = ref({
  id: '',
  description: '', // 빈 문자열로 초기화
  name: '',
  date: '',
  time: '',
  location: '',
  locationDetail: '',
  mainImage: '',
  images: [],
  participants: { current: 0, max: 0, min: 0},
  category: '',
  type: '',
  likes: 0,
  createdBy: { name: '', id: 0, profileImage: '' },
  price: 0,
  question: '',
});

// 체크박스 상태
const isChecked = ref(false);
const fetchEvent = async (eventId) => {
  try {
    const response = await axios.get(`http://localhost:3000/gathering/getEvents/${eventId}`);
    const eventData = response.data;
    // 데이터 매핑 및 변환
    event.value = {
      id: eventData.id,
      image: eventData.image, // API 응답에 맞춰 필드명 확인
      name: eventData.name,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      category: eventData.category,
      mainImage: eventData.mainImage,
      location: eventData.location,
      locationDetail: eventData.locationDetail,
      participants: {
        current: eventData.participants?.length || 0,
        max: eventData.maxParticipants,
        min: eventData.minParticipants
      },
      likes: eventData.likes.length || 0,
      createdBy: {
        id: eventData.createdBy?.userId || 0,
        name: eventData.createdBy?.username || "Unknown",
        //profileImage: eventData.createdBy?.profileImage || "@/assets/images/default-host.png",
      },
      price: eventData.price,
      type: eventData.type,
      question: eventData.question,
    };
    //isLiked.value = eventData.likes.some((like) => like.user.userId === userId);
  } catch (error) {
    console.error("Error fetching event data:", error);
  }
};

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

// 결제하기
const submitEvent =  async ()  => {
  try {
    console.log(event.value.id,userId,userAnswer.value)
    const response = await axios.post('http://localhost:3000/gathering/createParticipant', {
      eventId: event.value.id,
      userId: userId,
      answer: userAnswer.value || ''
    });

    if (response.status === 201) {
      alert('Registration successful!');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    alert('Failed to register for the event. Please try again.');
  }
};



onMounted(() => {
  const eventId = parseInt(window.location.pathname.split('/').pop()); // Extract event ID from URL
  fetchEvent(eventId);
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
    min-height: 380px;
    padding: 30px 150px;
  }

  .login-container-op2 {
    display: flex;
    background: #fff;
    overflow: hidden;
    width: 100%;
    padding: 30px 150px;
    justify-content: center;
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

  .create-form-op2 {
    flex: 1;
    padding: 40px;
    padding-top: 20px;
    padding-bottom: 0px;
    max-width: 720px;
    align-content: center;
    border-radius: 24px;
    margin-bottom: 20px;
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

  /* 컨테이너 스타일 */
  .agreement-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-top: 20px;
    font-family: Arial, sans-serif;
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
  }
  .ipnut-question{
    height: 120px !important;
    padding: 15px !important;
  }

  /* 이벤트 카드 */
  .card {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    flex-shrink: 0;
    text-align: center;
    --bs-card-border-width: none;
    transition: all 0.3s ease;
    justify-self: center;
  }

  .card:hover {
    background-color: white;
    border-radius: 12px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    width: 300px;
    flex-shrink: 0;
    text-align: center;
    --bs-card-border-width: none;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }

  .card-body .col-6{
    padding: 0px;
  }

  .card-title{
    font-size: 1.75rem;
    font-weight: 500;
    text-align: left;
    margin: 0px;
  }

  .card-detail{
    text-align: left;
    font-size: 15px;
    font-weight: 300;
  }

  .card-price{
    text-align: left;
  }

  .card-img {
    background-image: url('@/assets/img/img_LogInBanner1.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 210px;
    border-radius: 8px;
  }

  .card-info-text{
    padding: 0px 5px;
  }
  .card-icon-heart{
    margin: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .card-info-text{
    text-align: left;
    font-weight: 300;
  }

  .card-info-icon{
    width: 20px !important;
    height: 20px !important;
  }

  .icon_tema{
    width: min-content;
    background-color: #5870FF;
    color: #FFFFFF;
    padding: 5px 15px;
    border-radius: 24px;
    margin: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .icon_type{
    width: min-content;
    background-color: #58C3FF;
    color: #FFFFFF;
    padding: 5px 15px;
    border-radius: 24px;
    margin: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }
  .participants{
    width: max-content;
    background-color: #FFFFFF;
    color: #5870FF;
    padding: 5px 15px;
    border-radius: 24px;
    margin: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

}
</style>
