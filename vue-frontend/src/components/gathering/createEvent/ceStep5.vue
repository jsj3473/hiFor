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
          aria-valuenow="83.5"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div class="progress-bar" style="width: 83.5%"></div>
        </div>
      </div>
  
      <!-- Top Bar -->
      <div class="container">
        <div class="row">
          <div class="col bar-left">
            <button class="back-btn" @click="goBack">
              <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
              5 of 6
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
            <label class="event-name-label">
              Describe your Event
              <img
                class="event-image-icon"
                src="@/assets/icons/Info.png"
                alt="Info"
              />
            </label>
            <!-- WYSIWYG Editor -->
            <article>
              <ul class="options">
                <li v-for="(command, index) in editorCommands" :key="index">
                  <button type="button" @click="executeCommand(command.type)">
                    <i :class="command.icon"></i>
                    {{ command.label }}
                  </button>
                </li>
              </ul>
              <div
                class="editor"
                contenteditable="true"
                ref="editor"
                @input="updateContent"
              >
                <h1>Start writing your event description here...</h1>
              </div>
            </article>
          </div>
  
          <!-- Next Button -->
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
      formData: Object, // 부모 컴포넌트에서 전달된 상태
    },
    emits: ["update-form-data", "next", "previous"],
    setup(props, { emit }) {
      const editorContent = ref("");
      const editor = ref(null);
  
      const editorCommands = [
        { type: "h1", label: "H1" },
        { type: "h2", label: "H2" },
        { type: "h3", label: "H3" },
        { type: "p", label: "P" },
        { type: "bold", icon: "fa-solid fa-bold", label: "" },
        { type: "italic", icon: "fa-solid fa-italic", label: "" },
        { type: "underline", icon: "fa-solid fa-underline", label: "" },
        { type: "strikeThrough", icon: "fa-solid fa-strikethrough", label: "" },
        { type: "justifyLeft", icon: "fa-solid fa-align-left", label: "" },
        { type: "justifyCenter", icon: "fa-solid fa-align-center", label: "" },
        { type: "justifyRight", icon: "fa-solid fa-align-right", label: "" },
        { type: "justifyFull", icon: "fa-solid fa-align-justify", label: "" },
      ];
  
      const executeCommand = (command) => {
        document.execCommand(command, false, null);
      };
  
      const updateContent = () => {
        editorContent.value = editor.value.innerHTML;
        emit("update-form-data", { description: editorContent.value });
      };
  
      const saveProgress = () => {
        alert("Progress saved!");
      };
  
      const nextStep = () => {
        if (!editorContent.value.trim()) {
          alert("Please add a description!");
          return;
        }
        emit("next");
      };
  
      const goBack = () => {
        emit("previous");
      };
  
      return {
        editorCommands,
        executeCommand,
        updateContent,
        saveProgress,
        nextStep,
        goBack,
        editor,
      };
    },
  };
  </script>
  
  <style scoped>
    input::placeholder {
  color: gray; /* 원하는 색상으로 설정 */
  opacity: 1;  /* 텍스트가 투명하지 않도록 설정 */
}
  /* 기존 CSS 유지 */
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
        .event-image-icon{
            margin-left: 10px;
            cursor: pointer;
        }
        .next-btn-box{
            text-align: center;
            margin-bottom: 66px !important;
        }
        .next-btn{
            width: 244px;
            height: 59px;
            color: #ffffff;
            background-color: #37C00E;
            border: 0px;
            border-radius: 108px;
        }

        /* 에디터 */
        .editor {
            min-height: 150px;
            padding: 10px;
        }

        .options {
            display: flex;
            padding: 8px;
            margin: 0;
            list-style-type: none;
            border-bottom: 1px solid lightgray;
            background-color: aliceblue;
        }

        .options li:nth-child(4n){
            margin-right: 8px;
        }

        .options li button{
            background-color: lightskyblue;
            padding: 4px;
            border-radius: 5px;
        }

        .options li button:hover{
            background-color: rgb(81, 81, 230);
            border-color: rgb(81, 81, 230);

        }
    }
</style>
  