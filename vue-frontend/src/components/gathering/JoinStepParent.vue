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
import { useRoute } from 'vue-router';
import { reactive, onMounted, computed } from "vue";
<<<<<<< HEAD
import Step1 from "./JoinStep1.vue";
import Step2 from "./JoinStep2.vue";
import Step3 from "./JoinStep3.vue";
=======
import Step1 from "./joinEvent/JoinStep1.vue";
import Step2 from "./joinEvent/JoinStep2.vue";
import Step3 from "./joinEvent/JoinStep3.vue";
>>>>>>> 44a0bdf (250101)

export default {
  components: { Step1, Step2, Step3},
  setup() {
    const route = useRoute(); // 현재 경로 정보를 가져오기 위한 Vue Router 훅
    const currentStep = reactive({ value: 1 });

    const formData = reactive({
      eventId: 0,
      name: "",
      description: "",
      image: "",
      location: "",
      date: "",
      time: "",
      answer: "",
      //type: "",
      question: "",
      price: 0,
      //maxParticipants: 0,
      //minParticipants: 0,
      //hashtags: [],
    });

    // 컴포넌트가 마운트될 때 URL에서 eventId를 가져와서 설정
    onMounted(() => {
      const eventId = parseInt(route.params.eventId, 10);
      if (!isNaN(eventId)) {
        formData.eventId = eventId;
      } else {
        console.error("Invalid event ID in URL");
      }
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