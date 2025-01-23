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
import { toRaw, reactive, computed, onMounted } from "vue";
import axios from "axios";
import Step1 from "../../../../trash/createEvent/ceStep1.vue";
import Step2 from "../../../../trash/createEvent/ceStep2.vue";
import Step3 from "../../../../trash/createEvent/ceStep3.vue";
import Step4 from "../../../../trash/createEvent/ceStep4.vue";
import Step5 from "../../../../trash/createEvent/ceStep5.vue";
import Step6 from "../../../../trash/createEvent/ceStep6.vue";

export default {
  components: { Step1, Step2, Step3, Step4, Step5, Step6 },
  setup() {
    const LOCAL_STORAGE_KEY = `eventCreationProgress_${sessionStorage.getItem("userId")}`;

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

    const saveProgress = () => {
      const progress = {
        currentStep: currentStep.value,
        formData: toRaw(formData),
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(progress));
    };

    const loadProgress = () => {
      const savedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedProgress) {
        const { currentStep: savedStep, formData: savedFormData } = JSON.parse(savedProgress);
        currentStep.value = savedStep || 1;
        Object.assign(formData, savedFormData || {});
      }
    };

    const nextStep = () => {
      if (currentStep.value < steps.length) {
        currentStep.value++;
        saveProgress();
      }
    };

    const previousStep = () => {
      if (currentStep.value > 1) {
        currentStep.value--;
        saveProgress();
      }
    };

    const updateFormData = (updatedData) => {
      Object.assign(formData, updatedData);
      saveProgress();
    };

    const submitForm = async () => {
      try {
        const userId = sessionStorage.getItem("userId");
        const enrichedFormData = {
          ...toRaw(formData),
          userId: userId,
          isDraft: false,
        };
        console.log("Submitting form:", JSON.stringify(enrichedFormData, null, 2));
        const response = await axios.post("http://localhost:3000/gathering/submit", enrichedFormData);
        console.log(response);
        alert("Event submitted successfully!");
        localStorage.removeItem(LOCAL_STORAGE_KEY); // 데이터 제출 후 로컬 스토리지 초기화
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("Failed to submit the form. Please try again.");
      }
    };

    // 컴포넌트가 마운트될 때 진행 상황 복원
    onMounted(() => {
      loadProgress();
    });

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

