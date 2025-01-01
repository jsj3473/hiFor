<template>
    <div>
      <!-- 헤더 공간 -->
      <div class="header-space"></div>
  
      <!-- Progress Bar -->
      <div>
        <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="66.5" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: 66.5%"></div>
        </div>
      </div>
  
      <!-- Top Bar -->
      <div class="container">
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
              4 of 6
            </button>
          </div>
          <div class="col bar-right">
            <button class="save-btn" @click="saveProgress">Save</button>
          </div>
        </div>
      </div>
  
      <!-- Input Section -->
      <div class="container">
        <div class="row i-form-box">
          <!-- Event Location -->
          <div class="col-12 i-box">
            <label class="event-name-label" for="event-location">Location for your Event</label>

            <!-- Select Dropdown -->
            <select
              id="event-location"
              class="event-name"
              v-model="location"
            >
              <option value="" disabled>Select Location</option>
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
          <!-- Google Map Embed -->
          <div class="col-12 map-box">
            <iframe
              class="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d101211.9034469795!2d126.91295388612455!3d37.55807979547794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca52a763a5f4f%3A0x52af77a8ccbcbf63!2z7Iqk7YyM7YGs7ZSM65-s7IqkIOyEseyImOygkA!5e0!3m2!1sko!2skr!4v1732255801130!5m2!1sko!2skr"
              width="600"
              height="450"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
  
          <!-- Event Date and Time -->
          <div class="col-6 text-right">
            <label class="e-type" for="event-date">Event Date</label>
            <input id="event-date" class="e-price" type="date" v-model="date" />
          </div>
          <div class="col-6">
            <label class="e-type" for="event-time">Event Time</label>
            <input id="event-time" class="e-price" type="time" v-model="time" />
          </div>
  
          <!-- Next Button -->
          <div class="col-12 next-btn-box">
            <button class="next-btn" @click="nextStep">Next</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    props: {
      formData: Object, // 부모 컴포넌트에서 전달된 데이터
    },
    emits: ["update-form-data", "next", "previous"],
    setup(props, { emit }) {
      // 로컬 상태로 props 복사
      const location = ref(props.formData?.location || "");
      const date = ref(props.formData?.date || "");
      const time = ref(props.formData?.time || "");
  
      // 저장
      const saveProgress = () => {
        emit("update-form-data", {
          location: location.value,
          date: date.value,
          time: time.value,
        });
        alert("Progress saved!");
      };
      // 현재 시간 확인
      const isPastDateTime = () => {
        const currentDate = new Date();
        const selectedDateTime = new Date(`${date.value}T${time.value}`);
        return selectedDateTime < currentDate;
      };
    
      // 다음 단계
      const nextStep = () => {
        if (!location.value.trim() || !date.value.trim() || !time.value.trim()) {
          alert("Please fill in all fields!");
          return;
        }

        // 과거 날짜와 시간 확인
        if (isPastDateTime()) {
          alert("The selected date and time cannot be in the past!");
          return;
        }

        emit("update-form-data", {
          location: location.value,
          date: date.value,
          time: time.value,
        });
        emit("next");
    };

      // 이전 단계
      const goBack = () => {
        emit("previous");
      };
  
      return {
        location,
        date,
        time,
        saveProgress,
        nextStep,
        goBack,
      };
    },
  };
  </script>
  
  
  <style scoped>
    input::placeholder {
  color: gray; /* 원하는 색상으로 설정 */
  opacity: 1;  /* 텍스트가 투명하지 않도록 설정 */
}
  html, body{
      height: 100%;
  }
  .header-logo{
      margin-right:10px;
  }
  .header-nav{
      width:min-content;  
  }
  .button-box{
      text-align:right;
  }
  .text-right{
      text-align: right;
  }
  .text-left{
      text-align: left;
  }

  /* 반응형 모바일 css */
  @media screen and (max-width:768px){}

  /* 웹 */
  @media screen and (min-width:769px){
    input {
      color: black;
    }
      .header-space{
          height: 66px;
      }

      /* progress */
      .progress{
          border-radius: 0px !important;
          --bs-progress-bar-bg: #37C00E !important;
      }

      /* topbar */
      .bar-left{
          margin-top: 30px !important;
          text-align: left;
      }
      .back-btn{
          background: none;
          border: none;
          width: 120px;
          padding: 10px;
          font-size: 20px;
      }
      .back-btn-icon{
          height: 20px;
          margin-right: 5px;
          margin-bottom: 2px;
      }
      .bar-right{
          margin-top: 30px !important;
          text-align: right;
      }
      .save-btn{
          background-color: #37C00E;
          border: none;
          border-radius: 30px;
          width: 100px;
          padding: 10px;
          font-size: 20px;
          color: #ffffff;
      }

      /* input section */
      .i-box{
          padding-top: 50px;
          text-align: center;
          margin-bottom: 33px;
      }
      .event-name-label{
          font-size: 50px;
          font-weight: bold;
          margin-bottom: 33px;
      }
      .event-name{
          width: 510px;
          height: 59px;
          padding: 14px;
          border: 1px solid #37C00E;
          border-radius: 108px;
      }
      .map-box{
          text-align: center;
          margin-bottom: 33px;
      }
      .map{
          height: 360px;
      }

      .e-type{
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 12px;
          width: 261px;
          text-align: left;
      }
      .e-price{
          width: 261px;
          height: 59px;
          padding: 10px !important;
          padding-left: 20px !important;
          text-align: left !important;
          border-radius: 108px !important;
          border: 1px solid #37C00E;
          margin-bottom: 15px;
      }

      .next-btn-box{
          text-align: center;
          margin-top: 66px !important;
          margin-bottom: 66px !important;
      }
      .next-btn{
          width: 244px;
          height: 59px;
          color: #ffffff;
          background-color: #37C00E;
          border: 0px;
          border-radius: 108px;
      }
  }
</style>
  