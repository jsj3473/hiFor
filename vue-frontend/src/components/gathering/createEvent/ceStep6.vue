<template>
    <div>
      <!-- 헤더 공간 -->
      <div class="header-space"></div>
  
      <!-- Progress Bar -->
      <div>
        <div
          class="progress"
          role="progressbar"
          aria-label="Basic example"
          aria-valuenow="100"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-bar" style="width: 100%"></div>
        </div>
      </div>
  
      <!-- Top Bar -->
      <div class="container">
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
              6 of 6
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
            <label class="event-name-label">Short informations</label>
            <form @submit.prevent="addTag">
              <label class="e-type">
                Short informations
                <img class="event-image-icon" src="@/assets/icons/Info.png" alt="Info" />
              </label>
  
              <!-- Existing Hashtags -->
              <div v-for="(tag, index) in tags" :key="index" class="tag-name1">
                {{ tag }}
                <button type="button" @click="removeTag(index)" class="remove-tag">
                  ×
                </button>
              </div>
  
              <!-- New Hashtag Input -->
              <input
                class="tag-name2"
                type="text"
                placeholder="#HashTag"
                v-model="newTag"
              />
              <button class="tag-add" type="submit">Add+</button>
            </form>
          </div>
  
          <!-- Next Button -->
          <div class="col-12 next-btn-box">
            <button class="next-btn" @click="submitForm">Finish</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  
  export default {
    props: {
      formData: Object, // 부모 컴포넌트에서 전달된 상태
    },
    emits: ["update-form-data", "next", "previous", "submit"],
    setup(props, { emit }) {
      const router = useRouter(); // Vue Router 사용
      const tags = ref(props.formData?.hashtags || []); // 해시태그 목록
      const newTag = ref("");
  
      const forbiddenTag = "hifor"; // 금지된 해시태그

      const addTag = () => {
        const normalizedTag = newTag.value.trim().toLowerCase();
        if (normalizedTag === forbiddenTag) {
          alert("The hashtag 'hifor' is not allowed!");
          newTag.value = "";
          return;
        }
        if (normalizedTag && !tags.value.some(tag => tag.toLowerCase() === normalizedTag)) {
          tags.value.push(newTag.value.trim());
          emit("update-form-data", { hashtags: tags.value });
        }
        newTag.value = "";
      };
  
      const removeTag = (index) => {
        tags.value.splice(index, 1);
        emit("update-form-data", { hashtags: tags.value });
      };
  
      const saveProgress = () => {
        alert("Progress saved!");
      };
  
      const nextStep = () => {
        if (tags.value.length === 0) {
          alert("Please add at least one hashtag!");
          return;
        }
        emit("next");
      };
  
      const goBack = () => {
        emit("previous");
      };

      const submitForm = () => {
        if (tags.value.some(tag => tag.toLowerCase() === forbiddenTag)) {
          alert("You cannot submit the form with the forbidden hashtag 'hifor'.");
          return;
        }
        emit("submit");
        router.push({
          path: '/showAllEvents',
          name: 'ShowAllEvents',
        }); // 폼 제출 후 이동
      };
  
      return {
        tags,
        newTag,
        addTag,
        removeTag,
        saveProgress,
        nextStep,
        goBack,
        submitForm,
      };
    },
  };
  </script>
  
  <style scoped>
    input::placeholder {
  color: gray; /* 원하는 색상으로 설정 */
  opacity: 1;  /* 텍스트가 투명하지 않도록 설정 */
}

input {
  color: black;
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
            margin-bottom: 164px;
        }
        .event-name-label{
            font-size: 50px;
            font-weight: bold;
            margin-bottom: 33px;
        }
        .tag-name1{
            width: 310px;
            height: 59px;
            padding: 20px;
            padding-top: 15px;
            padding-bottom: 15px;
            border: 1px solid #37C00E;
            border-radius: 108px;
            margin-bottom: 15px;
            background-color: #37C00E;
            color: #ffffff;
            text-decoration: underline;
            margin: 0px;
            justify-self: center;
            text-align: left;
            margin-bottom: 15px;
        }
        .tag-name2{
            width: 310px;
            height: 59px;
            padding: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
            border: 1px solid #37C00E;
            border-radius: 108px;
            margin-bottom: 15px;
            background-color: #ffffff;
        }
        .tag-add{
            width: 310px;
            height: 59px;
            padding: 20px;
            padding-top: 10px;
            padding-bottom: 10px;
            border: 1px solid #37C00E;
            border-radius: 108px;
            margin-bottom: 15px;
            background-color: #ffffff;
        }
        .event-image-icon{
            margin-left: 10px;
            cursor: pointer;
        }
        .e-type{
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 12px;
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
    }
</style>
  