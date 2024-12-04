<template>
  <div class="contaienr">
    <!-- Progress Bar -->
    <div
      class="progress"
      role="progressbar"
      aria-label="Basic example"
      aria-valuenow="25"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="progress-bar" style="width: 33.3%"></div>
    </div>

    <!-- Top Bar -->
    <div class="row">
      <div class="col bar-left">
        <button class="back-btn" @click="goBack">
          <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
          1 of 3
        </button>
      </div>
    </div>

    <!-- Agreement -->
    <div class="row">
      <div class="col body-box">
        <p class="title">Basic Rules!</p>
        <p class="reminder-text">
          1. Please follow the community usage guidelines of HiFor.
        </p>
        <p class="reminder-text">2. Always respect the nationality and religion of others.</p>
        <p class="reminder-text">3. Be cautious of everything that might be offensive or rude to others.</p>
        <div class="rule-box">
          <div class="checkbox-wrapper-15">
            <span>I have read and agree.</span>
            <input
              class="inp-cbx"
              id="cbx-15"
              type="checkbox"
              v-model="isAgreed"
              style="display: none;"
            />
            <label class="cbx" for="cbx-15">
              <span>
                <svg width="12px" height="9px" viewbox="0 0 12 9">
                  <polyline points="1 5 4 8 11 1"></polyline>
                </svg>
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="next-btn-box" :disabled="!isAgreed" @click="nextStep">
          <div class="next-btn">
            Next
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
    // 동의 상태
    const isAgreed = ref(false);

    // 다음 스텝으로 이동
    const nextStep = () => {
      if (isAgreed.value) {
        emit("next");
      } else {
        alert("Please agree to the rules before proceeding.");
      }
    };

    // 이전 스텝으로 이동
    const goBack = () => {
      emit("previous");
    };

    return {
      isAgreed,
      nextStep,
      goBack,
    };
  },
};
</script>

<style scoped>
.row{
    justify-self: center;
}
/* 반응형 모바일 css */
@media screen and (max-width:768px){}

/* 웹 */
@media screen and (min-width:769px){
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
    /* basic rules */
    .body-box{
        justify-content: center;
        justify-items: center;
    }
    .title{
        margin-top: 66px;
        font-size: 50px;
        font-weight: bold;
    }
    .reminder-text{
        width: 690px;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
        margin-top: 33px;
        border: 1px solid #37C00E;
        padding: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 108px;
    }
    /* agree CB */
    .rule-box{
        width: 780px;
        height: 50px;
        align-content: center;
        text-align: center;
    }
    .rule-agree{
        font-size: 18px;
    }
    .checkbox-wrapper-15 .cbx {
      -webkit-user-select: none;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      cursor: pointer;
    }
    .checkbox-wrapper-15 .cbx span {
      display: inline-block;
      vertical-align: middle;
      transform: translate3d(0, 0, 0);
    }
    .checkbox-wrapper-15 .cbx span:first-child {
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      transform: scale(1);
      vertical-align: middle;
      border: 1px solid #B9B8C3;
      transition: all 0.2s ease;
    }
    .checkbox-wrapper-15 .cbx span:first-child svg {
      position: absolute;
      z-index: 1;
      top: 8px;
      left: 6px;
      fill: none;
      stroke: white;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 16px;
      stroke-dashoffset: 16px;
      transition: all 0.3s ease;
      transition-delay: 0.1s;
      transform: translate3d(0, 0, 0);
    }
    .checkbox-wrapper-15 .cbx span:first-child:before {
      content: "";
      width: 100%;
      height: 100%;
      background: #37C00E;
      display: block;
      transform: scale(0);
      opacity: 1;
      border-radius: 50%;
      transition-delay: 0.2s;
    }
    .checkbox-wrapper-15 .cbx span:last-child {
      margin-left: 8px;
    }
    .checkbox-wrapper-15 .cbx span:last-child:after {
      content: "";
      position: absolute;
      top: 8px;
      left: 0;
      height: 1px;
      width: 100%;
      background: #B9B8C3;
      transform-origin: 0 0;
      transform: scaleX(0);
    }
    .checkbox-wrapper-15 .cbx:hover span:first-child {
      border-color: #37C00E;
    }
  
    .checkbox-wrapper-15 .inp-cbx:checked + .cbx span:first-child {
      border-color: #37C00E;
      background: #37C00E;
      animation: check-15 0.6s ease;
    }
    .checkbox-wrapper-15 .inp-cbx:checked + .cbx span:first-child svg {
      stroke-dashoffset: 0;
    }
    .checkbox-wrapper-15 .inp-cbx:checked + .cbx span:first-child:before {
      transform: scale(2.2);
      opacity: 0;
      transition: all 0.6s ease;
    }
    .checkbox-wrapper-15 .inp-cbx:checked + .cbx span:last-child {
      color: #B9B8C3;
      transition: all 0.3s ease;
    }
    .checkbox-wrapper-15 .inp-cbx:checked + .cbx span:last-child:after {
      transform: scaleX(1);
      transition: all 0.3s ease;
    }
  
    @keyframes check-15 {
      50% {
        transform: scale(1.2);
      }
    }
    /* Next button */
    .next-btn-box{
        text-align: center;
        padding-top: 99px;
        padding-bottom: 180px;
    }
    .next-btn{
        width: 240px;
        padding: 20px;
        padding-left: 100px;
        padding-right: 100px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        background-color: #37C00E;
        border: none;
        border-radius: 96px;
    }
}

</style>
  