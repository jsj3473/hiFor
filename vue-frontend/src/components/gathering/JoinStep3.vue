<template>
    <div class="contaienr">

        <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-bar" style="width: 100%"></div>
        </div>

        <!-- Top Bar -->
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
              3 of 3
            </button>
          </div>
        </div>
        
        <!-- Body -->
        <div class="row">
            <div class="col body-box">
                <p class="title">Payment</p>
                
                <!-- Card -->
                <div class="col">
                    <div class="row join-card">
                        <div class="col-5 join-card-img-box">
                            <img class="join-card-img" src="@/assets/images/ex2.png" alt="">
                        </div>
                        <div class="col-7 join-card-info-box">
                            <div class="row">
                                <div class="col-12">
                                    <p class="card-title">HiFor Open Party</p>
                                </div>
                                <div class="col-6">
                                    <p class="join-card-info-text">
                                        <img class="join-card-info-icon" src="@/assets/icons/Date_icon.png" alt="">Nov 26, 2024
                                    </p>
                                </div>
                                <div class="col-6">
                                    <p class="join-card-info-text">
                                        <img class="join-card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="">Hongdae, Seoul
                                    </p>
                                </div>
                                <div class="col-12">
                                    <p class="card-price">Price: 30,000 won</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Refund Policy -->
                <div class="col">
                    <div class="policy-box">
                        <p class="policy-title">Refund Policy</p>
                        <div class="policy-text-box">
                            <p class="policy-text">
                                1. Full refund if participation is denied.
                            </p>
                            <p class="policy-text">
                                2. Full refund if you cancel while approval is pending
                            </p>
                            <p class="policy-text">
                                3. Full refund if you cancel up to 3 days before the event date once participation is confirmed.
                            </p>
                            <p class="policy-text">
                                4. No refunds if you cancel 2 days before the event date once participation is confirmed.
                            </p>
                        </div>
                    </div>
                    <div class="rule-box">
                        <div class="checkbox-wrapper-15">
                            <span>"I have read the payment details, refund policy, and terms of use, and I agree to them."
                            </span>
                            <input class="inp-cbx" id="cbx-15" type="checkbox" style="display: none;" v-model="isAgreed"/>
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
        </div>

        <!-- Next Button -->
        <div class="row">
            <div class="next-btn-box">
                <router-link class="next-btn" to="#" :class="{ 'disabled-link': !isAgreed }" :disabled="!isAgreed" @click="payNow">
                    Pay Now
                </router-link>
            </div>
        </div>

    </div>
</template>

<script>
import { ref } from "vue";
import axios from 'axios';
import { useStore } from 'vuex';

export default {
  props: {
    formData: Object, // 부모 컴포넌트로부터 전달된 상태
  },
  emits: ["update-form-data", "next", "previous"],
  setup(props, { emit }) {
    const eventName = ref(props.formData?.name || "");
    const isAgreed = ref(false); // 동의 체크박스 상태
    const store = useStore();
    const userId = store.getters.userId;
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

    // 결제하기
    const payNow =  async ()  => {
      if (!isAgreed.value) {
        alert("You must agree to the terms before proceeding.");
        return;
      } 
      console.log(props.formData.eventId)
      console.log(userId)
      console.log(props.formData.answer)
       try {
                const response = await axios.post('http://localhost:3000/gathering/createParticipant', {
                eventId: props.formData.eventId,
                userId: userId,
                answer: props.formData.answer,
            });

            if (response.status === 201) {
            alert('Registration successful!');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('Failed to register for the event. Please try again.');
        }
    };

    return {
      saveProgress,
      nextStep,
      goBack,
      isAgreed,
      payNow,
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
    /* Body */
    .body-box{
        justify-content: center;
        justify-items: center;
    }
    .title{
        margin-top: 66px;
        font-size: 50px;
        font-weight: bold;
    }
        /* card */
    .join-card-img-box{
        padding: 0px !important;
    }
    .join-card-info-box{
        padding: 10px !important;
    }
    .join-card{
        max-width: 780px;
        height: 270px;
        padding: 0px;
        margin-top: 90px !important;
        border-radius: 20px;
        box-shadow: 0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);
    }
    .join-card-img{
        width: 100%;
        height: 270px;
        border-top-left-radius: 20px;
        border-bottom-left-radius: 20px;
    }
    .card-title{
        margin-top: 25px;
        font-size: 28px;
        font-weight: bold;
    }
    .join-card-info-text{
        margin-top: 35px;
        font-size: 16px;
    }
    .join-card-info-icon{
        width: 20px;
        height: 20px;
        margin-right: 5px;
    }
    .card-price{
        margin-top: 35px;
        font-size: 22px;
        font-weight: bold;
    }
    /* Refund Policy */
    .policy-box{
        width: 780px;
        padding: 15px;
        margin-top: 100px;
    }
    .policy-title{
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        color: #07722B;
    }
    .policy-text-box{
        padding: 55px;
        padding-top: 50px;
        padding-bottom: 30px;
        border: 2px solid #07722B;
        border-radius: 80px;
    }
    .policy-text{
        font-size: 26px;
        font-weight: 600;
        margin-bottom: 25px;
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
  