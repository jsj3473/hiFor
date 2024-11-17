<template>
    <form @submit.prevent="submitEvent">
    
    <div>
      <label for="hashtags">Hash Tags:</label>
      <div class="hashtags-container">
        <div
          v-for="(tag, index) in eventData.hashtags"
          :key="index"
          class="tag-input-wrapper"
        >
          <input
            type="text"
            v-model="eventData.hashtags[index]"
            placeholder="#"
            class="tag-input"
          />
        </div>
      </div>
    </div>
      <div>
        <label for="eventName">이벤트 이름:</label>
        <input v-model="eventData.eventName" id="eventName" type="text" required />
      </div>
  
      <div>
        <label for="eventLocation">이벤트 장소:</label>
        <input v-model="eventData.eventLocation" id="eventLocation" type="text" required />
      </div>
  
      <div>
        <label for="eventType">이벤트 타입:</label>
        <input v-model="eventData.eventType" id="eventType" type="text" required />
      </div>
  
      <div>
        <label for="eventDetails">이벤트 세부사항:</label>
        <textarea v-model="eventData.eventDetails" id="eventDetails" required></textarea>
      </div>
  
      <div>
        <label for="selectionQuestion">선택 질문:</label>
        <input v-model="eventData.selectionQuestion" id="selectionQuestion" type="text" />
      </div>

      <div>
        <label>이미지 추가등록</label>
        <p>이미지는 최대 5개까지 등록 가능합니다. 이미지를 선택하여 대표 이미지를 변경할 수 있습니다.</p>
        <div class="image-upload-container">
          <div
            v-for="(image, index) in eventData.eventImages"
            :key="index"
            class="image-preview"
            @click="setMainImage(index)"
          >
            <img :src="image.url" alt="Uploaded Image" />
            <span v-if="eventData.mainImageIndex === index" class="main-image-badge">대표 이미지</span>
            <button @click="removeImage(index)" class="remove-image-button">&times;</button>
          </div>
          <div v-if="eventData.eventImages.length < 5" class="image-upload">
            <input @change="handleFileUpload" type="file" accept="image/*" />
            <span>이미지 선택</span>
          </div>
        </div>
      </div>
        
      <div>
        <label for="price">가격:</label>
        <input v-model="eventData.price" id="price" type="number" required />
      </div>
  
      <div>
        <label for="priceInfo">가격 정보:</label>
        <input v-model="eventData.priceInfo" id="priceInfo" type="text" />
      </div>
  
      <button type="submit">이벤트 제출</button>
    </form>
  </template>
  
  <script>
  import axios from 'axios';

  export default {
    data() {
      return {
        eventData: {
          eventName: "",
          eventLocation: "",
          eventType: "",
          eventDetails: "",
          selectionQuestion: "",
          hashtags: ["", "", "", "", "", ""], // 고정된 6개의 인풋 필드
          eventImages: [], 
          mainImageIndex: 0,
          price: "",
          priceInfo: ""
        }
      };
    },
    methods: {
        handleFileUpload(event) {
          if (event.target.files && event.target.files.length > 0) {
            const files = Array.from(event.target.files);
            files.forEach(file => {
              if (!this.eventData.eventImages) {
                this.eventData.eventImages = []; // 배열이 없으면 초기화
              }
              this.eventData.eventImages.push(file);
            }); 
          } else {
            console.error('No files selected or files not available.');
          }
      },
      async submitEvent() {
        try {
          // 세션스토리지에서 userId 가져오기
          const userId = sessionStorage.getItem('userId');
          if (!userId) {
            throw new Error('사용자 ID를 찾을 수 없습니다. 로그인이 필요합니다.');
          }

          // createEventDto 형식에 맞게 데이터 생성
          const createEventDto = {
            ...this.eventData,
            userId: userId,
          };

          // 서버로 이벤트 데이터 전송
          const formData = new FormData();
          for (const key in createEventDto) {
            if (key === 'hashtags') {
              formData.append(key, createEventDto[key].join(',')); // 해시태그는 콤마로 구분된 문자열로 변환
            } else if (key === 'eventImages') {
              console.log(1)
              createEventDto.eventImages.forEach((image) => {
              formData.append(`eventImages`, image);
            });
            } else {
              formData.append(key, createEventDto[key]);
            }
          }
          for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }
          await axios.post('http://localhost:3000/gathering/create', formData);

          alert('이벤트가 성공적으로 생성되었습니다.');
        } catch (error) {
          console.error('이벤트 생성 실패:', error);
          alert('이벤트 생성에 실패했습니다. 다시 시도해 주세요.');
        }
      },

      setMainImage(index) {
        this.eventData.mainImageIndex = index;
      },
      removeImage(index) {
        this.eventData.eventImages.splice(index, 1);
        // 대표 이미지가 삭제될 경우 첫 번째 이미지를 대표 이미지로 설정
        if (this.eventData.mainImageIndex === index) {
          this.eventData.mainImageIndex = 0;
        }
      },

    }
  };
  </script>
  

  <style scoped>

  .remove-image-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #ff4d4d;
    color: white;
    border: none;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
  .hashtags-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    max-width: 300px;
  }
  
  .tag-input-wrapper {
    width: 45%;
  }
  
  .tag-input {
    width: 100%;
    padding: 8px;
    border-radius: 15px;
    border: 1px solid #e0e0e0;
    font-size: 14px;
    text-align: center;
    outline: none;
  }
  
  .image-upload-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
  
  .image-preview {
    width: 100px;
    height: 100px;
    position: relative;
    cursor: pointer;
  }
  
  .image-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .main-image-badge {
    position: absolute;
    top: 5px;
    left: 5px;
    background-color: #00d173;
    color: white;
    padding: 2px 5px;
    border-radius: 3px;
    font-size: 10px;
  }
  
  .image-upload {
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  
  form {
    display: flex;
    flex-direction: column;
    width: 300px;
  }
  
  label {
    margin-top: 10px;
  }
  
  input, textarea, button {
    margin-top: 5px;
  }
  </style>