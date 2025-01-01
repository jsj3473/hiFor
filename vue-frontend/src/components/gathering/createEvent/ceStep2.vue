
<template>
  <div>
    <!-- 헤더 공간 -->
    <div class="header-space"></div>

    <!-- Progress Bar -->
    <div class="progress" role="progressbar" aria-label="Basic example" aria-valuenow="33" aria-valuemin="0" aria-valuemax="100">
      <div class="progress-bar" style="width: 33%"></div>
    </div>

    <!-- Top Bar -->
    <div class="container">
      <div class="row">
        <div class="col bar-left">
          <button class="back-btn" @click="goBack">
            <img class="back-btn-icon" src="@/assets/icons/Back_icon.png" alt="Back" />
            2 of 6
          </button>
        </div>
        <div class="col bar-right">
          <button class="save-btn" @click="saveProgress">Save</button>
        </div>
      </div>
    </div>

    <!-- Dropzone Input Section -->
    <div class="container">
      <div class="row">
        <div class="col-12 i-box" style="width: 100%!important;">
          <div id="dropzone">
            <form class="dropzone needsclick" ref="dropzone">
              <div class="dz-message needsclick">
                <span class="text">
                  <img src="http://www.freeiconspng.com/uploads/------------------------------iconpngm--22.png" alt="Camera" />
                  Drop files here or click to upload.
                </span>
                <span class="plus">+</span>
              </div>
            </form>
          </div>
        </div>
        <div class="col-12 next-btn-box">
          <button class="next-btn" @click="nextStep">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import Dropzone from "dropzone";

export default {
  props: {
    formData: Object, // 부모로부터 전달된 상태
  },
  emits: ["update-form-data", "next", "previous"],
  setup(props, { emit }) {
    const dropzone = ref(null);

    const initDropzone = () => {
      dropzone.value = new Dropzone("#dropzone form", {
        url: "http://localhost:3000/gathering/upload", // 백엔드 업로드 URL
        maxFiles: 1,
        addRemoveLinks: true,
        acceptedFiles: "image/*", // 이미지 파일만 허용
        init() {
          this.on("success", (file, response) => {
            // 백엔드에서 받은 이미지 URL을 formData에 추가
            emit("update-form-data", { image: response.url });
            console.log("Uploaded file URL:", response.url);
          });
          this.on("removedfile", () => {
            emit("update-form-data", { image: null });
          });
        },
      });
    };

    const saveProgress = () => {
      alert("Progress saved!");
    };

    const nextStep = () => {
      if (!props.formData.image) {
        alert("Please upload an image!");
        return;
      }
      emit("next");
    };

    const goBack = () => {
      emit("previous");
    };

    onMounted(() => {
      initDropzone();
    });

    return {
      saveProgress,
      nextStep,
      goBack,
      dropzone,
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

        /* progress */
        .progress{
            position: sticky;
            top: 0px;
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
            margin-bottom: 66px;
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

        /* drag & drop */
        .dropzone {
            width: 98%;
            height: 360px;
            margin: 1%;
            border: 2px dashed #37C00E !important;
            border-radius: 5px;
            -webkit-transition: .2s;
            transition: .2s;
            align-content: center;
        }
        .dropzone.dz-drag-hover {
            border: 2px solid #37C00E !important;
        }
        .dz-message.needsclick img {
            width: 50px;
            display: block;
            margin: auto;
            opacity: .6;
            margin-bottom: 15px;
        }
        span.plus {
            display: none;
        }
        .dropzone.dz-started .dz-message {
            display: inline-block !important;
            width: 120px;
            float: right;
            border: 1px solid rgba(238, 238, 238, 0.36);
            border-radius: 30px;
            height: 120px;
            margin: 16px;
            -webkit-transition: .2s;
            transition: .2s;
        }
        .dropzone.dz-started .dz-message span.text {
            display: none;
        }
        .dropzone.dz-started .dz-message span.plus {
            display: block;
            font-size: 70px;
            color: #AAA;
            line-height: 110px;
        }
    }
</style>