<template>
    <div>
      <!-- 헤더 공간 -->
      <div class="header-space"></div>
  
      <!-- Progress Bar -->
      <div
        class="progress"
        role="progressbar"
        aria-label="Basic example"
        aria-valuenow="50"
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div class="progress-bar" style="width: 50%"></div>
      </div>
  
      <!-- Top Bar -->
      <div class="container">
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img
                class="back-btn-icon"
                src="@/assets/icons/Back_icon.png"
                alt="Back"
              />
              3 of 6
            </button>
          </div>
          <div class="col bar-right">
            <button class="save-btn" @click="saveProgress">Save</button>
          </div>
        </div>
      </div>
  
      <!-- Input Section -->
      <div class="container">
        <div class="row i-boxs">
          <div class="col-12 i-box3">
            <p class="event-image-label">Event Informations</p>
          </div>
        </div>
        <div class="row i-form-box">   
          <!-- Line1: Event Type -->
          <div class="col-6 i-box4">
            <label class="e-type">
              Event type
              <img
                class="event-image-icon"
                src="@/assets/icons/Info.png"
                alt="Info"
              />
            </label>
              <div class="dropdown">
                <button
                  class="btn btn-secondary dropdown-toggle e-type-dd"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {{ formData.type || "Select Type" }}
                </button>
                <ul class="dropdown-menu">
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      @click="setType('Register')"
                    >
                      Register
                    </button>
                  </li>
                  <li>
                    <button
                      class="dropdown-item"
                      type="button"
                      @click="setType('First come')"
                    >
                      First come
                    </button>
                  </li>
                </ul>
              </div>
          </div>
          <div class="col-6"></div>
  
          <!-- Line2: Questions -->
          <div class="col-12">
            <label class="e-type">
              Questions for selection
              <img
                class="event-image-icon"
                src="@/assets/icons/Info.png"
                alt="Info"
              />
            </label>
            <input
              class="event-name"
              type="text"
              placeholder="Why do you want to join this event?"
              v-model="eventQuestion"
            />
          </div>
  
          <!-- Line3: Price -->
          <div class="col-6">
            <label class="e-type">Event Price</label>
            <input
              class="e-price"
              type="number"
              placeholder="ex. 30,000 won"
              v-model="price"
            />
          </div>
          <div class="col-6"></div>
  
          <!-- Line4: Participants -->
          <div class="col-6">
            <label class="e-type">Number of Participants</label>
            <input
              class="e-price"
              type="number"
              placeholder="Maximum"
              v-model="maxParticipants"
            />
          </div>
          <div class="col-6">
            <label class="e-type"></label>
            <input
              class="e-price"
              type="number"
              placeholder="Minimum"
              v-model="minParticipants"
            />
          </div>
        </div>
  
        <!-- Next Button -->
        <div class="row">
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
      formData: Object, // 부모로부터 전달된 상태
    },
    emits: ["update-form-data", "next", "previous"],
    setup(props, { emit }) {
      // 로컬 상태로 props 복사
      const type = ref(props.formData?.type || "");
      const eventQuestion = ref(props.formData?.question || "");
      const price = ref(props.formData?.price || 0);
      const maxParticipants = ref(props.formData?.maxParticipants || 0);
      const minParticipants = ref(props.formData?.minParticipants || 0);
  
      // Event Type 설정
      const setType = (selectedType) => {
        type.value = selectedType;
        emit("update-form-data", { type: type.value });
      };
  
      // 저장
      const saveProgress = () => {
        emit("update-form-data", {
          type: type.value,
          question: eventQuestion.value,
          price: price.value,
          maxParticipants: maxParticipants.value,
          minParticipants: minParticipants.value,
        });
        alert("Progress saved!");
      };
  
      // 다음 단계
      const nextStep = () => {
        if (!type.value) {
          alert("Please select an event type!");
          return;
        }
        emit("update-form-data", {
          type: type.value,
          question: eventQuestion.value,
          price: price.value,
          maxParticipants: maxParticipants.value,
          minParticipants: minParticipants.value,
        });
        emit("next");
      };
  
      // 이전 단계
      const goBack = () => {
        emit("previous");
      };
  
      return {
        type,
        eventQuestion,
        price,
        maxParticipants,
        minParticipants,
        setType,
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
    input {
      color: black;
    }
      .header-space{
          height: 66px;
      }
      .col-12{
          padding-left: 0px;
          padding-right: 0px;
      }
      .col-6{
          padding: 0px;
          padding-right: 0px;
      }

      /* progress */
      .progress{
          position: sticky;
          top: 0px;
          border-radius: 0px !important;
          --bs-progress-bar-bg: #37C00E !important;
          z-index: 1;
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
      .i-boxs{
          justify-content: center;
          height: min-content;
      }
      .i-form-box{
          justify-content: center;
          height: min-content;
          margin-bottom: 33px;
          max-width: 534px;
          justify-self: center;
      }
      .i-box{
          width: 540px !important;
          padding-top: 50px;
          text-align: center;
      }
      .i-box3{
          width: 540px !important;
          text-align: left;
          margin-bottom: 15px;
      }
      .i-box4{
          width: 540px !important;
          text-align: left;
          margin-bottom: 15px;
      }
      .event-image-label{
          font-size: 50px;
          font-weight: bold;
          margin-bottom: 33px;
      }
      .event-image-icon{
          margin-left: 10px;
          cursor: pointer;
      }
      .event-image{
          width: 1180px;
          height: 400px;
          padding: 0px;
          background-color: #E6ECE7;
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
          margin-bottom: 66px;
      }

      .e-type{
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 12px;
      }
      .e-type-dd{
          width: 261px;
          height: 59px;
          padding: 10px !important;
          padding-left: 20px !important;
          text-align: left !important;
          border-radius: 108px !important;
          --bs-btn-color: #5F687A !important;
          --bs-btn-bg: #fff !important;
          --bs-btn-border-color: #37C00E !important;
          --bs-btn-hover-color: #fff !important;
          --bs-btn-hover-bg: #37C00E !important;
          --bs-btn-hover-border-color: #37C00E !important;
          --bs-btn-focus-shadow-rgb: 130, 138, 145 !important;
          --bs-btn-active-color: #fff !important;
          --bs-btn-active-bg: #37C00E !important;
          --bs-btn-active-border-color: #37C00E !important;
          --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125) !important;
          --bs-btn-disabled-color: #fff !important;
          --bs-btn-disabled-bg: #37C00E !important;
          --bs-btn-disabled-border-color: #37C00E !important;
      }
      .dropdown-menu{
          width: 261px !important;
          --bs-dropdown-link-active-bg: #37C00E !important;
      }
      .event-name{
          width: 534px;
          height: 59px;
          padding: 20px;
          border: 1px solid #37C00E;
          border-radius: 108px;
          margin-bottom: 15px;
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
  }
</style>
  