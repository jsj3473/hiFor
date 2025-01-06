<template>

<!-- banner -->
<div class="contaienr main-banner">
  <div class="row">
    <div class="col-12 banner-text-box1">
      <p class="banner-text1">Events</p>
    </div>
    <div class="col-12 banner-text-box2">
      <p class="banner-title">Browse all the events</p>
    </div>
    <div class="col-12 banner-text-box3">
      <p class="banner-text3">Find the event you want!</p>
    </div>
  </div>
</div>

<!-- 검색 -->
 <div class="container">
  <form class="search-form" @submit.prevent="searchEvents">
  <table class="search-table">
    <thead>
    <tr>
      <th>
        <input class="search-text"  v-model="searchQuery" type="search" placeholder="Search for events">
        <button class="submit-btn" type="submit">
          <img class="submit-btn-img" src="@/assets/Search-icon.png" alt="">
        </button>
      </th>
      <th>
        <input type="date" v-model="searchDate">
      </th>
      <th>
        <select v-model="searchLocation">
          <option disabled>Select Location</option>
          <option value="Jongno-gu">Jongno-gu</option>
          <option value="Jung-gu">Jung-gu</option>
          <option value="Yongsan-gu">Yongsan-gu</option>
          <option value="Seongdong-gu">Seongdong-gu</option>
          <option value="Gwangjin-gu">Gwangjin-gu</option>
          <option value="Dongdaemun-gu">Dongdaemun-gu</option>
          <option value="Jungnang-gu">Jungnang-gu</option>
          <option value="Seongbuk-gu">Seongbuk-gu</option>
          <option value="Gangbuk-gu">Gangbuk-gu</option>
          <option value="Dobong-gu">Dobong-gu</option>
          <option value="Nowon-gu">Nowon-gu</option>
          <option value="Eunpyeong-gu">Eunpyeong-gu</option>
          <option value="Seodaemun-gu">Seodaemun-gu</option>
          <option value="Mapo-gu">Mapo-gu</option>
          <option value="Yangcheon-gu">Yangcheon-gu</option>
          <option value="Gangseo-gu">Gangseo-gu</option>
          <option value="Guro-gu">Guro-gu</option>
          <option value="Geumcheon-gu">Geumcheon-gu</option>
          <option value="Yeongdeungpo-gu">Yeongdeungpo-gu</option>
          <option value="Dongjak-gu">Dongjak-gu</option>
          <option value="Gwanak-gu">Gwanak-gu</option>
          <option value="Seocho-gu">Seocho-gu</option>
          <option value="Gangnam-gu">Gangnam-gu</option>
          <option value="Songpa-gu">Songpa-gu</option>
          <option value="Gangdong-gu">Gangdong-gu</option>
          <option value="etc">etc</option>
        </select>
      </th>
      <th>
        <select v-model="searchType">
          <option disabled>Recruitment Type</option>
          <option value="First come">First come</option>
          <option value="Register">Register</option>
        </select>
      </th>
    </tr>
  </thead>
  </table>
  </form>
  
  <div class="row title-box">
    <div class="col-6">
      <p class="title-op1">All events</p>
    </div>
    <div class="col-6 text-right">
      <img src="@/assets/icons/Graph.png" alt="">
      <select v-model="sortOption" @change="fetchSortedEvents">
        <option value="all">All</option>
        <option value="hot">Hot</option>
        <option value="date">Date</option>
      </select>
    </div>

  </div>  
  <div class="row card-section">
    <EventCard v-for="event in paginatedEvents" :key="event.id" :event="event"  class="col-4 card-box"/>
  </div>
  
</div>
<!-- 페이지네이션 버튼 -->
<div class="pagination">
  <button @click="goToPage(1)" :disabled="currentPage === 1">&laquo;</button> <!-- << -->
  <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">&lt;</button> <!-- < -->

  <button
    v-for="page in visiblePages"
    :key="page"
    @click="goToPage(page)"
    :class="{ active: currentPage === page }"
  >
    {{ page }}
  </button>

  <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">&gt;</button> <!-- > -->
  <button @click="goToPage(totalPages)" :disabled="currentPage === totalPages">&raquo;</button> <!-- >> -->
</div>


</template>

<script>
import EventCard from "./EventCard.vue";
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'HomePage',
  components: {EventCard},
  setup() {
    const store = useStore();

    // Vuex 상태 및 getter 사용
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const token = computed(() => store.getters.token);

    // 로컬 상태 관리
    const events = ref([]); // 이벤트 데이터
    const currentPage = ref(1); // 현재 페이지
    const eventsPerPage = 12; // 한 페이지당 이벤트 수

    //검색
    const searchQuery = ref(''); // 제목 검색어
    const searchDate = ref(''); // 날짜
    const searchLocation = ref(''); // 위치
    const searchType = ref(''); // 모집 유형

    //정렬
    const sortOption = ref('all'); // 기본 정렬 옵션

    // 정렬된 이벤트 가져오기
    const fetchSortedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/gathering/sorted', {
          params: { sortBy: sortOption.value },
        });      
        events.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants, // 현재 참가자 수
            max: event.maxParticipants, // 최대 참가자 수
          },
          likes: event.likes, // 좋아요 수
          host: event.createdBy.name, // 이벤트 생성자 이름
          hashtags: event.hashtags, //해시태그 배열
          // hostImage: event.createdBy.profileImage || "@/assets/images/default-host.png", // 생성자 이미지
        }));
        console.log('Mapped events:', events.value);
      } catch (error) {
        console.error('Error fetching sorted events:', error);
      }
    };

    // 검색 API 호출
    const searchEvents = async () => {
    try {
      const params = {
        query: searchQuery.value || undefined,
        date: searchDate.value || undefined,
        location: searchLocation.value || undefined,
        type: searchType.value || undefined,
      };

      const response = await axios.get('http://localhost:3000/gathering/searchEvent', { params });        
      events.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants, // 현재 참가자 수
            max: event.maxParticipants, // 최대 참가자 수
          },
          likes: event.likes, // 좋아요 수
          host: event.createdBy.name, // 이벤트 생성자 이름
          hashtags: event.hashtags, //해시태그 배열
          // hostImage: event.createdBy.profileImage || "@/assets/images/default-host.png", // 생성자 이미지
        }));
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  //페이지네이션
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
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/gathering/getAllEvents"); 
        events.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants, // 현재 참가자 수
            max: event.maxParticipants, // 최대 참가자 수
          },
          likes: event.likes, // 좋아요 수
          host: event.createdBy.name, // 이벤트 생성자 이름
          hashtags: event.hashtags, //해시태그 배열
          // hostImage: event.createdBy.profileImage || "@/assets/images/default-host.png", // 생성자 이미지
        }));
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    // 컴포넌트 마운트 시 이벤트 데이터 가져오기
    onMounted(() => {
      fetchEvents();
    });

    return {
      isLoggedIn,
      token,
      events,
      goToPage,
      paginatedEvents,
      currentPage,
      totalPages,
      visiblePages,
      searchQuery,
      searchDate,
      searchLocation,
      searchType,
      searchEvents,
      sortOption,
      fetchSortedEvents,
    };
  },
};
</script>

<style scoped>
.text-right{
text-align: right;
}
.text-left{
text-align: left;
}
.row{
width: 100%;
}
/* 반응형 모바일 css */
@media screen and (max-width:768px){}

/* 웹 */
@media screen and (min-width:769px){
/* banner */
.main-banner{
  height: 280px;
  background-position: center;
}
.banner-text-box1{
  padding-top: 72px;
}
.banner-text-box3{
  padding-top: 0px;
}
.banner-text1{
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.06em;
  color: #0CA835;
  text-align: center;
  text-decoration-skip-ink: none;
}
.banner-text3{
  font-size: 14px;
  font-weight: 700;
  line-height: 16px;
  letter-spacing: 0.06em;
  text-align: center;
  text-decoration-skip-ink: none;
}
.banner-text-box2{
  margin-bottom: 12px;
}
.banner-title{
  font-size: 50px;
  font-weight: 700;
  line-height: 64px;
  text-align: center;
}

/* Search */
.search-table{
  width: 100%;
  height: 50px;
  border-bottom: 1px solid #CBD7EA;
}
.search-table th{
  text-align: center;
  padding-right: 10px;
  border-right: 1px solid #CBD7EA;
}
.search-table input{
  height: 40px;
  border: none;
}
.search-table select{
  height: 40px;
  border: none;
}
table{
  border-collapse: separate;
  border-spacing: 10px 10px;
}
.search-form{
  text-align: center;
}
.search-text{
  max-width: 88%;
  height: 40px;
  border: none;
}
.submit-btn{
  padding: 0px;
  border: none;
  float: right;
}
.submit-btn-img{
  width: 40px;
  height: 40px;
}
.title-box select{
  text-align: center;
  border: none;
}
.title-box img{
  height: 21px;
}

/* card list section */
.card-section{
  margin-bottom: 33px;
}
.title-box{
  margin-top: 66px;
}
.title-op1{
  font-size: 36px;
  font-weight: bold;
  margin: 0px;
}
.text-op1{
  font-size: 20px;
  margin: 0px;
  align-self: bottom;
}
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
}
</style>