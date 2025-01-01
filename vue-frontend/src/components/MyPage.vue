

<template>
  <div class="banner"></div>
  <div class="contaienr mypage">
    <div class="row">
      <div class="col-2 profile-info">
        <img class="profile-img" src="@/assets/yun.jpeg" alt="">
      </div>
      <div class="col-10 profile-info">
        <p class="profile-name">
          {{ user.username }} <router-link to="/myPageEdit"><img class="mp-edit" src="@/assets/Cog.png" alt=""></router-link>
<<<<<<< HEAD
        </p>
=======
        </p>  
        <div>
          <button type="button" @click="openModal">계정삭제</button>

          <div v-if="showModal" class="modal">
            <div class="modal-content">
              <h3>비밀번호 확인</h3>
              <p>계정을 삭제하려면 비밀번호를 입력하세요.</p>
              <input
                type="password"
                v-model="password"
                placeholder="비밀번호 입력"
              />
              <div class="modal-actions">
                <button @click="confirmDelete">확인</button>
                <button @click="closeModal">취소</button>
              </div>
            </div>
          </div>
        </div>
>>>>>>> 44a0bdf (250101)
        <p class="profile-sub-info">
          <span>#{{user.nationality}}</span> <span>#{{ user.age }}</span> <span>#{{ user.gender }}</span> <span>#{{ user.university }}</span>
        </p>
      </div>
    </div>
    <div class="row mp-tab">
      <div class="row mp-tab">
      <!-- 탭 버튼 영역 -->
      <div class="tab-container">
        <div v-for="tab in tabs" :key="tab.id" class="tabs" :class="{ on: activeTab === tab.id }" @click="openTab(tab.id)">
          {{ tab.label }}
        </div>
      </div>
<<<<<<< HEAD

      <!-- 탭 콘텐츠 영역 -->
      <div class="row tab_wrap">
        <div class="col-12 tab" v-for="tab in tabs" :key="tab.id" :class="{ on: activeTab === tab.id }">
          <div v-if="activeTab === 'Tab1'" class="tab-content">
            <div class="row custom-section">
              <div v-for="event in hostedEvents" :key="event.id" class="col-4 card-box">
                <router-link :to="`/events/${event.id}`">
                  <div class="card">
                    <img class="card-img" :src="event.image" alt="">
                    <div class="card-body">
                      <div class="card-title">{{ event.title }}</div>
                      <div class="row hashtag-row">
                        <div class="hashtag-box">
                          <button v-for="hashtag in event.hashtags" :key="hashtag" class="hashtag">
                            #{{ hashtag }}
                          </button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="" />{{ event.date }}
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="" />{{ event.location }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/User_icon.png" alt="" />
                            <span>{{ event.participants.current }}</span>/<span>{{ event.participants.max }}</span>
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Heart.png" alt="" />
                            <span>{{ event.likes }}</span>
                            <span></span>
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <p class="card-host">
                          <img class="host-icon" src="@/assets/ex.banner.jpeg" alt=""> {{ event.host }}
                        </p>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'Tab2'" class="tab-content">
            <div class="row custom-section">
              <div v-for="event in participatedEvents" :key="event.id" class="col-4 card-box">
                <router-link :to="`/events/${event.id}`">
                  <div class="card">
                    <img class="card-img" :src="event.image" alt="">
                    <div class="card-body">
                      <div class="card-title">{{ event.title }}</div>
                      <div class="row hashtag-row">
                        <div class="hashtag-box">
                          <button v-for="hashtag in event.hashtags" :key="hashtag" class="hashtag">
                            #{{ hashtag }}
                          </button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="" />{{ event.date }}
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="" />{{ event.location }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/User_icon.png" alt="" />
                            <span>{{ event.participants.current }}</span>/<span>{{ event.participants.max }}</span>
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Heart.png" alt="" />
                            <span>{{ event.likes }}</span>
                            <span></span>
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <p class="card-host">
                          <img class="host-icon" src="@/assets/ex.banner.jpeg" alt=""> {{ event.host }}
                        </p>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div v-if="activeTab === 'Tab3'" class="tab-content">
            <div class="row custom-section">
              <div v-for="event in likedEvents" :key="event.id" class="col-4 card-box">
                <router-link :to="`/events/${event.id}`">
                  <div class="card">
                    <img class="card-img" :src="event.image" alt="">
                    <div class="card-body">
                      <div class="card-title">{{ event.title }}</div>
                      <div class="row hashtag-row">
                        <div class="hashtag-box">
                          <button v-for="hashtag in event.hashtags" :key="hashtag" class="hashtag">
                            #{{ hashtag }}
                          </button>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="" />{{ event.date }}
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="" />{{ event.location }}
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/User_icon.png" alt="" />
                            <span>{{ event.participants.current }}</span>/<span>{{ event.participants.max }}</span>
                          </p>
                        </div>
                        <div class="col-6">
                          <p class="card-info-text">
                            <img class="card-info-icon" src="@/assets/icons/Heart.png" alt="" />
                            <span>{{ event.likes }}</span>
                            <span></span>
                          </p>
                        </div>
                      </div>
                      <div class="row">
                        <p class="card-host">
                          <img class="host-icon" src="@/assets/ex.banner.jpeg" alt=""> {{ event.host }}
                        </p>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
=======
      <div class="row tab_wrap">
        <div class="col-12 tab" v-for="tab in tabs" :key="tab.id" :class="{ on: activeTab === tab.id }">
          <div class="tab-content">
            <div class="row custom-section">
              <EventCard v-for="event in paginatedEvents" :key="event.id" :event="event"  class="col-4 card-box"/>
>>>>>>> 44a0bdf (250101)
            </div>
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD

=======
    <div class="pagination">
        <!-- 처음으로 이동 -->
        <button @click="goToPage(1)" :disabled="currentPage === 1">&laquo;</button>

        <!-- 이전 페이지 -->
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button>

        <!-- 동적 페이지 버튼 -->
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          :class="{ active: currentPage === page }"
        >
          {{ page }}
        </button>

        <!-- 다음 페이지 -->
        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button>

        <!-- 마지막으로 이동 -->
        <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">&raquo;</button>
    </div>
>>>>>>> 44a0bdf (250101)

  </div>
  </div>
</template>

<script>
<<<<<<< HEAD
import axios from 'axios';
import { useStore } from 'vuex';
import { ref, reactive, onMounted } from 'vue';

export default {
=======
import EventCard from "./gathering/EventCard.vue";
import axios from 'axios';
import { useStore } from 'vuex';
import { ref, reactive, onMounted, computed } from 'vue';

export default {
  components: {EventCard},
>>>>>>> 44a0bdf (250101)
  setup() {
    const store = useStore();
    const userId = ref(store.state.userId); // Vuex에서 userId 가져오기

    // user 상태를 reactive 객체로 선언
    const user = reactive({
      userId: '',
      email: '',
      username: '',
      dob: '',
      gender: '',
      age: 0,
      university: '',
      phoneNumber: '',
      nationality: '',
      identityStatus: '',
    });

<<<<<<< HEAD
    // 탭 상태들 (이벤트 데이터)
    const hostedEvents = ref([]);
    const participatedEvents = ref([]);
    const likedEvents = ref([]);
=======

    // 로컬 상태 관리
    const events = ref([]); // 이벤트 데이터

    const currentPage = ref(1); // 현재 페이지
    const eventsPerPage = 12; // 한 페이지당 이벤트 수
    const totalPages = computed(() => {
      return events.value.length > 0
        ? Math.ceil(events.value.length / eventsPerPage)
        : 1; // 데이터가 없을 때 최소 1페이지 유지
    });

    // 현재 페이지에 표시될 이벤트
    const paginatedEvents = computed(() => {
      const start = (currentPage.value - 1) * eventsPerPage;
      const end = start + eventsPerPage;
      return events.value.slice(start, end);
    });

    // 최대 10개의 페이지 버튼 표시
    const visiblePages = computed(() => {
      const maxPagesToShow = 10;
      const half = Math.floor(maxPagesToShow / 2);

      let startPage = currentPage.value - half;
      let endPage = currentPage.value + half;

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPages.value, maxPagesToShow);
      }
      if (endPage > totalPages.value) {
        endPage = totalPages.value;
        startPage = Math.max(1, totalPages.value - maxPagesToShow + 1);
      }

      const pages = [];
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      return pages;
    });

    // 페이지 변경 함수
    const goToPage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    // 이벤트 데이터 가져오기
    const fetchEvents = async (tabId) => {
      events.value = []; // 이전 데이터 비우기

      try {
        let url = '';
        if (tabId === 'Tab1') {
          url = `http://localhost:3000/gathering/getEventsByHostId/${userId.value}`;
        } else if (tabId === 'Tab2') {
          url = `http://localhost:3000/gathering/getParticipatedEvent/${userId.value}`;
        } else if (tabId === 'Tab3') {
          url = `http://localhost:3000/gathering/getLikedEvent/${userId.value}`;
        }

        const response = await axios.get(url);
        events.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants || 0,
            max: event.maxParticipants,
          },
          likes: event.likes,
          host: event.createdBy?.name,
          hashtags: event.hashtags,
        }));
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
>>>>>>> 44a0bdf (250101)

    // 탭 데이터 및 현재 활성화된 탭 추적
    const tabs = [
      { id: 'Tab1', label: 'Hosted Events' },
      { id: 'Tab2', label: 'Participation Events' },
      { id: 'Tab3', label: 'Liked Events' },
    ];
    const activeTab = ref('Tab1');
<<<<<<< HEAD

    // Hosted Events 가져오기
    const fetchHostedEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gathering/getEventsByHostId/${userId.value}`);
        hostedEvents.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants || 0,
            max: event.maxParticipants,
          },
          likes: event.likes,
          host: event.createdBy?.name,
          hashtags: event.hashtags,
        }));
      } catch (error) {
        console.error('Error fetching hosted events:', error);
      }
    };

    // Participation Events 가져오기
    const fetchParticipatedEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gathering/getParticipatedEvent/${userId.value}`);
        participatedEvents.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants || 0,
            max: event.maxParticipants,
          },
          likes: event.likes,
          host: event.createdBy?.name,
          hashtags: event.hashtags,
        }));
      } catch (error) {
        console.error('Error fetching participated events:', error);
      }
    };

    // Liked Events 가져오기
    const fetchLikedEvents = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/gathering/getLikedEvent/${userId.value}`);
        likedEvents.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants || 0,
            max: event.maxParticipants,
          },
          likes: event.likes,
          host: event.createdBy?.name,
          hashtags: event.hashtags,
        }));
      } catch (error) {
        console.error('Error fetching liked events:', error);
      }
    };
=======
    
    const showModal = ref(false);
    const password = ref("");
    const isDeleting = ref(false);

    const confirmDelete = async () => {
      if (!password.value) {
        alert("비밀번호를 입력해주세요.");
        return;
      }

      try {
        isDeleting.value = true;
        const response = await axios.post(`http://localhost:3000/auth/checkCurrentPassword`, {
          userId: userId, // 사용자 ID를 전달
          password: password.value, // 입력된 비밀번호를 전달
        });


        if (response.data.success) {
          if (!confirm("정말로 계정을 삭제하시겠습니까?")) {
            closeModal();
            return;
          }

          await axios.delete(`/api/users/${response.data.userId}`);
          alert("계정이 성공적으로 삭제되었습니다.");
          closeModal();
        } else {
          alert("비밀번호가 올바르지 않습니다.");
        }
      } catch (error) {
        console.error("오류 발생:", error);
        alert("계정 삭제 중 오류가 발생했습니다.");
      } finally {
        isDeleting.value = false;
      }
    };    
    
    const openModal = () => {
      showModal.value = true;
      console.log('293')
    };

    const closeModal = () => {
      showModal.value = false;
      password.value = "";
    };


>>>>>>> 44a0bdf (250101)

    // 유저 데이터 가져오기
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/user/getUser/${userId.value}`);
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

    // 탭 클릭 시 실행되는 함수
    const openTab = (tabId) => {
      activeTab.value = tabId;
<<<<<<< HEAD

      if (tabId === 'Tab2') {
        fetchParticipatedEvents();
      } else if (tabId === 'Tab3') {
        fetchLikedEvents();
      } else {
        fetchHostedEvents();
      }
=======
      currentPage.value = 1; // 페이지를 초기화
      fetchEvents(tabId); // 탭 전환 시 데이터 로드
>>>>>>> 44a0bdf (250101)
    };

    // mounted 훅
    onMounted(() => {
      getUser();
<<<<<<< HEAD
      fetchHostedEvents(); // 디폴트 탭 데이터
=======
      fetchEvents('Tab1'); // 디폴트 탭 데이터
>>>>>>> 44a0bdf (250101)
    });

    return {
      tabs,
      activeTab,
      openTab,
<<<<<<< HEAD
      hostedEvents,
      participatedEvents,
      likedEvents,
      userId,
      user,
=======
      events,
      userId,
      user,
      confirmDelete,
      closeModal,
      openModal,
      isDeleting,
      showModal,
      goToPage,
      paginatedEvents,
      currentPage,
      totalPages,
      visiblePages,
>>>>>>> 44a0bdf (250101)
    };
  },
};
</script>


<style scoped>
/* 반응형 모바일 css */
@media screen and (max-width:768px){}

/* 웹 */
@media screen and (min-width:769px){
  .mypage{
    max-width: 1140px;
    width: 100%;
    justify-self: center;
  }
  .banner{
    height: 330px;
    background-image: url('@/assets/ex.banner.jpeg');
    background-size: cover;
    background-position: center;
    object-fit: cover;
  }
  .profile-info{
    align-content: end;
    margin-top: -93px;
  }
  .profile-img{
    width: 180px;
    height: 180px;
    float: inline-end;
    border-radius: 108px;
    object-fit: cover;
  }
  .profile-name{
    font-size: 40px;
    font-weight: bold;
    margin-bottom: 0px;
  }
  .profile-sub-info{
    font-size: 18px;
    font-weight: 300;
    margin: 0px;
  }
  .mp-edit{
    width: 20px;
    height: 20px;
  }
  /* Tab */
  .mp-tab{
    justify-content: center;
    min-width: 1140px;
  }
  .tab{
    display:none;
  }
  .tab.on{
    display:block;
  }
  .tab-container{
    display:flex;
    gap:20px;
    margin-top:33px;
    font-size:18px;
  }
  .tabs{
    padding:10px 20px;
    border-radius:50px;
    font-weight:700;
    cursor:pointer;
    background:#f2f2f2;
    transition:all .3s;
  }
  .tabs:hover{
    padding:10px 30px;
  }
  .tabs.on{
    color:#fff;
    background-color: #0ca835;
  }
  .tab_wrap{
    margin-top:10px;
    padding:50px;
    text-align:center;
    background:#f2f2f2;
    min-width: 1140px;
  }
  /* card */
  .card:hover{
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
  .card-title{
    font-size: 20px;
    font-weight: 700;
    line-height: 20px;
    text-align: left;
    padding-top: 15px;
    padding-bottom: 15px;
  }
  .card{
    border-radius:30px !important;
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .card-img{
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius:30px !important;
  }
  .card-info-icon{
    width: 16px;
    height: 16px;
  }
  .card-info-text{
    align-content: center;
    text-align: left;
  }
  .card-host{
    margin: 0px;
    cursor: pointer;
    text-align: left;
  }
  .host-icon{
    width: 32px;
    height: 32px;
    border-radius: 100%;
  }
  .hashtag{
    background-color: #12CF51;
    color: #ffffff;
    padding: 3px;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    border-radius: 24px;
    margin-bottom: 15px;
    width: min-content;
  }
<<<<<<< HEAD
=======
  .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.modal-actions button {
  margin: 10px;
  padding: 10px 20px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin: 20px 0;
}

.pagination button {
  margin: 0 5px;
  padding: 8px 12px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.pagination button.active {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.pagination button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

>>>>>>> 44a0bdf (250101)
}
</style>
