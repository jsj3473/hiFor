<template>
  <div class="event-creation-wizard">
    <!-- 현재 스텝에 따라 해당 컴포넌트를 렌더링 -->
    <component
      :is="currentStepComponent"
      :form-data="formData"
      @update-form-data="updateFormData"
      @next="nextStep"
      @previous="previousStep"
      @submit="submitForm"
    />

    <div class="navigation-buttons">
      <button v-if="currentStep > 1" @click="previousStep">Previous</button>
      <button v-if="currentStep < steps.length" @click="nextStep">Next</button>
    </div>
  </div>
</template>

<script>
import { toRaw } from "vue";
import axios from "axios";
import { reactive, computed } from "vue";
<<<<<<< HEAD
import Step1 from "./ceStep1.vue";
import Step2 from "./ceStep2.vue";
import Step3 from "./ceStep3.vue";
import Step4 from "./ceStep4.vue";
import Step5 from "./ceStep5.vue";
import Step6 from "./ceStep6.vue";
=======
import Step1 from "./createEvent/ceStep1.vue";
import Step2 from "./createEvent/ceStep2.vue";
import Step3 from "./createEvent/ceStep3.vue";
import Step4 from "./createEvent/ceStep4.vue";
import Step5 from "./createEvent/ceStep5.vue";
import Step6 from "./createEvent/ceStep6.vue";
>>>>>>> 44a0bdf (250101)

export default {
  components: { Step1, Step2, Step3, Step4, Step5, Step6 },
  setup() {
    const currentStep = reactive({ value: 1 });

    const formData = reactive({
      name: "",
      description: "",
      image: "",
      location: "",
      date: "",
      time: "",
      type: "",
      question: "",
      price: 0,
      maxParticipants: 0,
      minParticipants: 0,
      hashtags: [],
    });

    const steps = [
      { id: 1, label: "Event Name", component: Step1 },
      { id: 2, label: "Image Upload", component: Step2 },
      { id: 3, label: "Event Details", component: Step3 },
      { id: 4, label: "Location & Time", component: Step4 },
      { id: 5, label: "Description", component: Step5 },
      { id: 6, label: "Hashtags", component: Step6 },
    ];

    const currentStepComponent = computed(() => {
      return steps[currentStep.value - 1].component;
    });

    const nextStep = () => {
      if (currentStep.value < steps.length) currentStep.value++;
    };

    const previousStep = () => {
      if (currentStep.value > 1) currentStep.value--;
    };

    const updateFormData = (updatedData) => {
      Object.assign(formData, updatedData);
    };

    const submitForm = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        // 사용자 ID와 임시 저장 여부 추가
        const enrichedFormData = {
          ...toRaw(formData),
          userId: userId, // 여기에 실제 사용자 ID를 넣어야 합니다
          isDraft: false, // 완전제출임
        };
        console.log("Submitting form:", JSON.stringify(enrichedFormData, null, 2));

        // 백엔드로 POST 요청 보내기
        const response = await axios.post("http://localhost:3000/gathering/submit", enrichedFormData);
        console.log(response)
        // 요청 성공 시 처리
        alert("Event submitted successfully!");
      } catch (error) {
        // 요청 실패 시 에러 처리
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      }
    };

    return {
      currentStep,
      currentStepComponent,
      formData,
      steps,
      nextStep,
      previousStep,
      updateFormData,
      submitForm,
    };
  },
};
</script>
