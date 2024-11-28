<template>
    <div class="event-join-wizard">
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
import { reactive, computed } from "vue";
import Step1 from "./JoinStep1.vue";
import Step2 from "./JoinStep2.vue";
import Step3 from "./JoinStep3.vue";

export default {
  components: { Step1, Step2, Step3},
  setup() {
    const currentStep = reactive({ value: 1 });

    const formData = reactive({
      name: "",
      description: "",
      image: "",
      location: "",
      date: "",
      time: "",
      //type: "",
      question: "",
      price: 0,
      //maxParticipants: 0,
      //minParticipants: 0,
      //hashtags: [],
    });

    const steps = [
      { id: 1, label: "Basic Rules!", component: Step1 },
      { id: 2, label: "Answer Host’s Question", component: Step2 },
      { id: 3, label: "Payment", component: Step3 },
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