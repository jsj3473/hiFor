<template>
    <div class="contaienr">


        <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: 66.6%"></div>
        </div>

        <!-- Top Bar -->
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
              2 of 3
            </button>
          </div>
        </div>
        <!-- QnA -->
         <div class="body-box">
            <p class="title">Answer Host’s Question</p>

            <!-- Question -->
            <div class="Q-box">
                <div class="Q-title">
                    Question
                </div>
                <div class="host-box">
                    <p class="host-name"><img class="host-icon" src="@/assets/images/ex7.jpeg" alt="">Min Kim</p>
                </div>
                <div class="Q-text-box">
                    <p class="Q-text">What your name?</p>
                </div>
            </div>

            <!-- Line -->
            <div class="line"></div>

            <!-- Answer -->
            <div class="Answer-box">
                <div class="Answer-title">
                    Answer
                </div>
                <div class="Answer-text-box">
                    <div class="ghest-box">
                        <p class="ghest-name"><img class="ghest-icon" src="@/assets/images/ex5.jpeg" alt="">MinSoo Kim</p>
                    </div>
                    <input class="Answer-text" type="text" placeholder="Answer host's Question">
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
    // 사용자의 답변 상태를 관리
    const userAnswer = ref(props.formData?.answer || "");

    // 다음 스텝으로 이동
    const nextStep = () => {
      if (!userAnswer.value.trim()) {
        alert("Please provide an answer before proceeding.");
        return;
      }
      // 부모 컴포넌트로 업데이트된 데이터를 전달
      emit("update-form-data", { answer: userAnswer.value });
      emit("next");
    };

    // 이전 스텝으로 이동
    const goBack = () => {
      emit("previous");
    };

    return {
      userAnswer,
      nextStep,
      goBack,
    };
  },
};
</script>


<style>
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
    /* QnA */
    .body-box{
        justify-content: center;
        justify-items: center;
    }
    .title{
        margin-top: 66px;
        font-size: 50px;
        font-weight: bold;
    }
    .line{
        width: 1000px;
        height: 1px;
        border: 1px solid #37C00E;
        margin-top: 100px;
    }
        /* Q */
    .Q-title{
        margin-top: 90px;
        margin-left: 16px;
        font-size: 36px;
        font-weight: bold;
    }
    .Q-text-box{
        width: 900px;
    }
    .host-box{
        position: relative;
        margin-top: 15px;
        margin-left: 15px;
        width: max-content;
        background-color: #96FFB9;
        padding-right: 16px;
        padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 100px;
        z-index: 10;
    }
    .host-name{
        font-size: 18px;
        font-weight: 500;
        margin: 0px;
    }
    .host-icon{
        margin-right: 10px;
    }
    .Q-text-box{
        padding-top: 55px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 20px;
        border: 1.5px solid #37C00E;
        border-radius: 30px;
        margin-top: -25px;
    }
    .Q-text{
        font-size: 18px;
        font-weight: 600;
    }
        /* A */
    .Answer-title{
        text-align: right;
        margin-top: 90px;
        margin-right: 16px;
        font-size: 36px;
        font-weight: bold;
    }
    .Answer-box{
        width: 900px;
    }
    .ghest-box{
        position: relative;
        margin-top: 15px;
        margin-right: 15px;
        width: max-content;
        background-color: #AAFFC6;
        padding-right: 16px;
        padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 100px;
        z-index: 1;
    }
    .ghest-name{
        font-size: 18px;
        font-weight: 500;
        margin: 0px;
        z-index: 1;
    }
    .ghest-icon{
        margin-right: 10px;
        width: 32px;
        height: 32px;
        border-radius: 100px;
        z-index: 1 !important;
    }
    .Answer-text-box{
        justify-items: end;
    }
    .Answer-text{
        width: 900px;
        padding: 30px !important;
        padding-top: 50px !important;
        border: 1.5px solid #AAFFC6;
        border-radius: 30px;
        margin-top: -25px;
        font-size: 18px;
        font-weight: 400;
        color: black;
        z-index: 0;
        outline: none;
        padding-left: 10px;
        background-color: transparent;
    }
    .Answer-text::placeholder{
        color: gray;
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

<!-- #todo 
1. 답변칸 자동줄바꿈 작업 -->
