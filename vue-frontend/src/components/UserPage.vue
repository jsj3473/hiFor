<template>
  <div class="mypage-con">
    <div class="row">
      <!-- 좌측 프로필 영역 -->
      <div class="col-lg-4 col-md-12">
        <div class="profile-box">
          <div class="profile-img"></div>
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
                          src="@/assets/img/img_LogInBanner2.png"
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
                          src="@/assets/img/img_LogInBanner2.png"
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
console.log(currentUserId,wantShowUserId)

const user = reactive({
  userId: '',
  username: '',
  dob: '',
  gender: '',
  age: 0,
  nationality: '',
});

// 유저 데이터 가져오기
const getUser = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:3000/user/getUser/${userId}`);
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
      `http://localhost:3000/gathering/getEventsByHostId/${wantShowUserId}`
    );
    hostEvents.value = hostResponse.data.map(mapEventData);

    // Participated 이벤트 가져오기
    const participatedResponse = await axios.get(
      `http://localhost:3000/gathering/getParticipatedEvent/${wantShowUserId}`
    );
    participatedEvents.value = participatedResponse.data.map(mapEventData);

    // Liked 이벤트 가져오기
    const likedResponse = await axios.get(
      `http://localhost:3000/gathering/getLikedEvent/${wantShowUserId}`
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
  background-image: url('@/assets/img/img_LogInBanner2.png');
  background-size: cover;
  background-position: center;
  height: 200px;
  width: 200px;
  margin: 0 auto;
  border-radius: 50%;
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
  background-image: url('@/assets/img/img_LogInBanner1.png');
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
