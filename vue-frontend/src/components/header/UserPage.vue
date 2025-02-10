<template>
  <div class="mypage-con">
    <div class="row">
      <!-- 좌측 프로필 영역 -->
      <div class="col-lg-4 col-md-12">
        <div class="profile-box">
          <div
            class="profile-img"
            @click="triggerFileInput"
            :class="{ 'hover-enabled': currentUserId == wantShowUserId }"
            :style="{ backgroundImage: `url(${user.profileImage})` }"
          >
            <input
              v-if="currentUserId==wantShowUserId"
              type="file"
              ref="fileInput"
              accept="image/*"
              @change="handleFileChange"
              style="display: none"
            />
            <img v-if="currentUserId==wantShowUserId" src="/assets/img/icon_UserCamera.png" alt="">
          </div>

          <p class="profile-name">{{ user.username }}</p>
          <p class="profile-info">{{user.nationality}},{{user.gender}}, {{user.age}}</p>
        </div>
        <div class="profile-box">
          <div class="row">
            <div class="col-6 host-info">
              <p class="host-info-num">{{hostEvents.length}}</p>
              <p class="host-info-text">Events Hosted</p>
            </div>
            <div class="col-6 host-info">
              <p class="host-info-num">{{ getParticipantsTotal() }}</p>
              <p class="host-info-text">Total Attendees</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 우측 이벤트 영역 -->
      <div class="col-lg-8 col-md-12">
        <!-- Hosted Events -->
        <div class="events-box">
          <p class="box-title">Hosted Event</p>
          <div class="row">
            <div class="col-md-6 col-sm-12" v-for="event in hostEvents" :key="event.id" :event="event">
              <router-link :to="`/events/${event.id}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">{{event.title}}</p>
                    <span>{{ event.participants }}</span>/<span>{{ event.maxParticipants }}</span>
                  </div>
                </div>
              </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Joined Events -->
        <div class="events-box">
          <p class="box-title">Joined Event</p>
          <div class="row">
            <div class="col-md-6 col-sm-12" v-for="event in participatedEvents" :key="event.id" :event="event">
              <router-link :to="`/events/${event.id}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">{{event.title}}</p>
                    <p class="mp-event-host" @click.stop>
                      <router-link :to="`/userPage/${event.hostId}`">
                        <img
                          class="mp-host-icon"
                          src="../../../public/assets/img/img_LogInBanner2.png"
                          alt="Host"
                        />
                        {{ event.host }}
                      </router-link>
                    </p>
                  </div>
                </div>
              </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Liked Events -->
        <div class="events-box" v-if="currentUserId==wantShowUserId">
          <p class="box-title">Liked Event</p>
          <div class="row">
            <div class="col-md-6 col-sm-12" v-for="event in likedEvents" :key="event.id" :event="event">
              <router-link :to="`/events/${event.id}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">{{event.title}}</p>
                    <p class="mp-event-host" @click.stop>
                      <router-link :to="`/userPage/${event.hostId}`">
                        <img
                          class="mp-host-icon"
                          src="../../../public/assets/img/img_LogInBanner2.png"
                          alt="Host"
                        />
                        {{ event.host }}
                      </router-link>
                    </p>
                  </div>
                </div>
              </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex';
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const store = useStore();
const currentUserId = ref(store.state.userId);
const wantShowUserId = window.location.pathname.split('/').pop(); // Extract event ID from URL
const fileInput = ref(null); // file input 요소에 대한 참조

const user = reactive({
  userId: '',
  username: '',
  dob: '',
  gender: '',
  age: 0,
  nationality: '',
  profileImage: '/profile-images/default-profile-image.png', // 정적 경로로 설정
});

const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // 클릭 이벤트로 파일 선택 창 열기
  }
};

const handleFileChange = async (event) => {
  const file = event.target.files[0]; // 선택된 파일
  if (!file) return;
  const formData = new FormData();
  formData.append('file', file);
  try {
    // 서버로 이미지 업로드
    const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/user/uploadProfileImage/${user.userId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }, // 파일 업로드를 위한 헤더 설정
          withCredentials: true, // 인증 정보를 포함
        }
    );


    // 서버에서 반환된 이미지 URL로 업데이트
    if (response.data.imageUrl) {
      user.profileImage = response.data.imageUrl; // 서버에서 반환된 경로 사용
    } else {
      console.warn('No image URL returned from the server.');
    }
  } catch (error) {
    console.error('Failed to upload profile image:', error);
  }
};


// 유저 데이터 가져오기
const getUser = async (userId) => {
  try {
    const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/user/getUser/${userId}`,
        {
          withCredentials: true, // 인증 정보를 포함
        }
    );
    const userData = response.data;

    // user 상태 업데이트
    user.userId = userData.userId || '';
    user.email = userData.email || '';
    user.username = userData.username || '';
    user.dob = userData.dob || '';
    user.gender = userData.gender || '';
    user.age = userData.age || 0;
    user.university = userData.university || '';
    user.phoneNumber = userData.phoneNumber || '';
    user.nationality = userData.nationality || '';
    user.profileImage = userData.profileImage || '';
  } catch (error) {
    console.error('Failed to fetch user:', error);
  }
};

// 탭별 이벤트 데이터
const hostEvents = ref([]);
const participatedEvents = ref([]);
const likedEvents = ref([]);

// 공통 매핑 함수
const mapEventData = event => ({
  id: event.id,
  mainImage: event.mainImage,
  title: event.name,
  host: event.createdBy?.username,
  hostId: event.createdBy?.userId,
  participants: event.participants,
  maxParticipants:event.maxParticipants,
});

// 이벤트 데이터 가져오기
const fetchAllEvents = async () => {
  try {
    // Host 이벤트 가져오기
    const hostResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/gathering/getEventsByHostId/${wantShowUserId}`,
        { withCredentials: true }
    );
    hostEvents.value = hostResponse.data.map(mapEventData);

    // Participated 이벤트 가져오기
    const participatedResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/gathering/getParticipatedEvent/${wantShowUserId}`,
        { withCredentials: true }
    );
    participatedEvents.value = participatedResponse.data.map(mapEventData);

    // Liked 이벤트 가져오기
    const likedResponse = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/gathering/getLikedEvent/${wantShowUserId}`,
        { withCredentials: true }
    );
    likedEvents.value = likedResponse.data.map(mapEventData);
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};


// Participants 총합 계산 함수
const getParticipantsTotal = () => {
  return hostEvents.value.reduce((total, event) => total + (event.participants || 0), 0);
};

// mounted 훅
onMounted(() => {

  const wantShowUserId = window.location.pathname.split('/').pop(); // Extract event ID from URL
  getUser(wantShowUserId);
  fetchAllEvents(); // 디폴트 탭 데이터
});
</script>

<!-- css -->

<style scoped>
/* 부트스트랩 요소 세팅 */
.row {
  width: 100%;
  justify-self: center;
}

/* 공통 스타일 */
.mypage-con {
  padding: 75px 150px;
}

/* 프로필 카드 */
.profile-box {
  background-color: #f6f7f8;
  border: 1px solid #d7d8d8;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  text-align: center;
}

.profile-img {
  background-size: cover;
  background-position: center;
  height: 200px;
  width: 200px;
  margin: 0 auto;
  border-radius: 50%;
  text-align: center;
  fill-opacity: 0.5;
}
.profile-img.hover-enabled:hover {
  filter: brightness(0.8);
}
.profile-img img{
  display: none;
  transition: all 0.3s ease;
  filter: none;
}
.profile-img:hover img{
  display: block;
  padding: 45px 50px;
  filter: none;
}

.profile-name {
  font-size: 22px;
  font-weight: bold;
  margin-top: 10px;
}

.profile-info {
  font-size: 14px;
  color: #777;
  margin: 5px 0;
}

/* 호스트 정보 */
.host-info {
  text-align: center;
}

.host-info-num {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.host-info-text {
  font-size: 14px;
  color: #555;
}

/* 이벤트 카드 */
.events-box {
  background-color: #f6f7f8;
  border: 1px solid #d7d8d8;
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
}

.box-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
}

.mp-card {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 10px;
  transition: box-shadow 0.3s ease;
}

.mp-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mp-event-img {
  background-image: url('/assets/img/img_LogInBanner1.png');
  background-size: cover;
  background-position: center;
  height: 80px;
  border-radius: 8px;
}

.mp-event-title {
  font-size: 16px;
  font-weight: bold;
}

.mp-event-host {
  font-size: 14px;
  color: #777;
  margin-top: 5px;
}

.mp-host-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 5px;
}

/* 반응형 스타일 */
@media screen and (max-width: 768px) {
  .mypage-con {
    padding: 20px;
  }

  .profile-img {
    height: 150px;
    width: 150px;
  }

  .box-title {
    font-size: 18px;
  }

  .mp-event-title {
    font-size: 14px;
  }
}
</style>
