<template>
    <div class="banner"></div>
    <div class="container mypage">
      <div class="row">
        <div class="col-2 profile-info">
          <div class="profile-img">
            <div class="image-upload-container">
              <!-- 이미지가 선택되지 않았을 때 -->
              <div v-if="!imageInfo.file" class="image-standby" @click="imageUploadOnClick">
                <img src="@/assets/Camera (L).png" alt="Upload Icon" class="upload-icon" />
              </div>
  
              <!-- 이미지가 선택되었을 때 -->
              <div v-else>
                <img :src="imageInfo.previewURL" alt="previewImage" @click="imageOverlayOnClick" class="preview-image" />
              </div>
  
              <!-- 숨겨진 파일 입력 필드 -->
              <input
                type="file"
                accept="image/jpg, image/jpeg, image/png"
                ref="photoInput"
                @change="imageInputOnChange"
                style="display: none"
              />
            </div>
          </div>
        </div>
  
        <div class="col-10 profile-info">
          <p class="profile-name">Yun</p>
          <p class="profile-sub-info">
            <span>#Korea</span> <span>#22</span> <span>#Male</span> <span>#HanyangUniv</span>
          </p>
        </div>
      </div>
  
      <div class="row mp-tab">
        <!-- 탭 버튼 영역 -->
        <div class="tab-container">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            class="tabs"
            :class="{ on: activeTab === tab.id }"
            @click="openTab(tab.id)"
          >
            {{ tab.label }}
          </div>
        </div>
  
        <!-- 탭 콘텐츠 영역 -->
        <div class="row tab_wrap">
          <div class="col-12 tab" v-for="tab in tabs" :key="tab.id" :class="{ on: activeTab === tab.id }">
            <div class="tab-content">
              <div class="row custom-section">
                <div class="col-4 card-box" v-for="card in tab.cards" :key="card.id">
                  <div class="card">
                    <img class="card-img" :src="card.imgSrc" alt="Event Image" />
                    <div class="card-body">
                      <div class="card-title">{{ card.title }}</div>
                      <div class="row hashtag-row">
                        <div class="hashtag-box">
                          <div class="hashtag">{{ card.hashtag }}</div>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="Date" /> {{ card.date }}
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="Location" /> {{ card.location }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/User_icon.png" alt="Attendance" /> {{ card.attendance }}
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Heart.png" alt="Likes" /> {{ card.likes }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <p class="card-host">
                          <img class="host-icon" :src="card.hostImg" alt="Host" /> {{ card.host }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // 이미지 업로드 상태
  const imageInfo = ref({
    file: null,
    previewURL: '',
  });
  
  // 파일 입력 참조
  const photoInput = ref(null);
  
  // 이미지 업로드 버튼 클릭 핸들러
  const imageUploadOnClick = (e) => {
    e.preventDefault();
    photoInput.value.click();
  };
  
  // 이미지 입력 변경 핸들러
  const imageInputOnChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      imageInfo.value = {
        file,
        previewURL: URL.createObjectURL(file),
      };
    }
  };
  
  // 탭 데이터 배열
  const tabs = [
    {
      id: 'Tab1',
      label: 'Hosted Events',
      cards: [
        {
          id: 1,
          title: 'X-mas Party',
          imgSrc: '@/assets/ex.banner.jpeg',
          hashtag: '#party',
          date: 'Nov 26, 2024',
          location: 'Hongdae, Seoul',
          attendance: '05/20',
          likes: '37',
          host: 'Yun',
          hostImg: '@/assets/ex.banner.jpeg',
        },
      ],
    },
    {
      id: 'Tab2',
      label: 'Participation Events',
      cards: [],
    },
    {
      id: 'Tab3',
      label: 'Liked Events',
      cards: [],
    },
  ];
  
  // 현재 활성화된 탭을 추적
  const activeTab = ref('Tab1');
  
  // 탭 변경 함수
  const openTab = (tabId) => {
    activeTab.value = tabId;
  };
  </script>
  
  <style scoped>
  /* 이미지 업로드 스타일 */
  .image-upload-container {
    text-align: center;
  }
  
  .image-standby {
    cursor: pointer;
    padding: 20px;
    border: 2px dashed #ccc;
    display: inline-block;
    border-radius: 10px;
    text-align: center;
  }
  
  .upload-icon {
    width: 50px;
    height: 50px;
  }
  
  .preview-image {
    max-width: 100%;
    height: auto;
    border-radius: 10px;
    cursor: pointer;
  }
  
  /* 기존 스타일 유지 */
  .mypage {
    max-width: 1140px;
    width: 100%;
    justify-self: center;
  }
  
  .banner {
    height: 330px;
    background-image: url('@/assets/ex.banner.jpeg');
    background-size: cover;
    background-position: center;
  }
  
  .profile-img {
    width: 180px;
    height: 180px;
    border-radius: 108px;
    background-size: cover;
    background-position: center;
  }
  
  .profile-name {
    font-size: 40px;
    font-weight: bold;
  }
  
  .profile-sub-info {
    font-size: 18px;
    font-weight: 300;
  }
  
  /* 탭 스타일 */
  .mp-tab {
    justify-content: center;
    min-width: 1140px;
  }
  
  .tab {
    display: none;
  }
  
  .tab.on {
    display: block;
  }
  
  .tab-container {
    display: flex;
    gap: 20px;
    margin-top: 33px;
  }
  
  .tabs {
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    background: #f2f2f2;
    font-weight: 700;
    transition: all 0.3s;
  }
  
  .tabs.on {
    color: #fff;
    background-color: #0ca835;
  }
  
  .tab_wrap {
    margin-top: 10px;
    padding: 50px;
    background: #f2f2f2;
  }
  </style>
  