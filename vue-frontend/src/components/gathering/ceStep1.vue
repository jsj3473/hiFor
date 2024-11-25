<template>
    <div>
      <!-- 헤더 공간 -->
      <div class="header-space"></div>
  
      <!-- progress -->
        <div
          class="progress"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-bar" style="width: 16.5%"></div>
        </div>
  
      <!-- top bar -->
      <div class="container">
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img
                class="back-btn-icon"
                src="@/assets/icons/Back_icon.png"
                alt="Back"
              />
              1 of 6
            </button>
          </div>
          <div class="col bar-right">
            <button class="save-btn" @click="saveProgress">Save</button>
          </div>
        </div>
      </div>
  
      <!-- Input Section -->
      <div class="container">
        <div class="row">
          <div class="col-12 i-box" style="width: 100%!important;">
            <form @submit.prevent="nextStep">
              <label class="event-name-label" for="event-name">Name of Your Event</label>
              <br />
              <input
                id="event-name"
                class="event-name"
                type="text"
                placeholder="ex. Marketing predictions for 2023"
                v-model="eventName"
              />
            </form>
          </div>
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
      formData: Object, // 부모 컴포넌트로부터 전달된 상태
    },
    emits: ["update-form-data", "next", "previous"],
    setup(props, { emit }) {
      const eventName = ref(props.formData?.name || "");
  
      const saveProgress = () => {
        emit("update-form-data", { name: eventName.value });
        alert("Progress saved!");
      };
  
      const nextStep = () => {
        if (!eventName.value.trim()) {
          alert("Event name is required!");
          return;
        }
        emit("update-form-data", { name: eventName.value });
        emit("next");
      };
  
      const goBack = () => {
        emit("previous");
      };
  
      return {
        eventName,
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

  /* 반응형 모바일 css */
  @media screen and (max-width:768px){}

  /* 웹 */
  @media screen and (min-width:769px){
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
          margin-bottom: 264px;
      }
      .event-name-label{
          font-size: 50px;
          font-weight: bold;
          margin-bottom: 33px;
      }
      .event-name{
          width: 510px;
          height: 59px;
          padding: 20px;
          border: 1px solid #37C00E;
          border-radius: 108px;
      }
      .next-btn-box{
          text-align: center;
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
  