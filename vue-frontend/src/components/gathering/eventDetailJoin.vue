<template>
    <div class="web-body">
      <!-- Header -->
      <div class="container header-space"></div>
  
      <!-- Main banner -->
      <div class="container banner-img-box" :style="{ backgroundImage: `url(${event.image})` }"></div>
  
      <!-- Title-text -->
      <div class="container">
        <div class="row">
          <div class="col-8">
            <div class="gathering-box">
              <p class="gatheing-title">{{ event.name }}</p>
              <div class="gathering-text-box">
                <p class="gathering-text" v-html="event.description"></p>
              </div>
            </div>
  
            <!-- Hashtag section -->
            <div class="hashtag-box">
              <div v-for="hashtag in event.hashtags" :key="hashtag.id">
                <button class="hashtag">#{{ hashtag.name }}</button>
              </div>
            </div>
  
            <!-- Map section -->
            <div class="map-box">
              <p class="map-title">Location</p>
              <p class="map-text">{{ event.location }}</p>
              <iframe
                :src="`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${event.location}`"
                width="100%"
                height="400px"
                style="border: 0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
  
            <!-- Price section -->
            <div class="price-box">
              <p class="price-title">Price</p>
              <p class="price-text">₩ {{ event.price }}</p>
            </div>
          </div>
  
          <!-- Sticky Card -->
          <div class="col-4">
            <div class="card sticky-card">
              <div class="card-body">
                <button class="btn_like" :class="{ on: isLiked }" @click="toggleLike">like</button>
                <div class="row">
                  <div class="col-2 card-date-icon">
                  </div>
                  <div class="col-10">
                    <p class="s-card-text1">Event date</p>
                    <p class="s-card-text2">{{ formattedDate }}</p>
                  </div>
                </div>
                <div class="row">
                  <p class="s-card-text3">{{ event.description.slice(0, 100) }}...</p>
                </div>
                <div class="row">
                  <div class="col-12 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/icons/MapPin_icon.png" alt="" />
                      {{ event.location }}
                    </p>
                  </div>
                  <div class="col-5 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/icons/User_icon.png" alt="" />
                      {{ event.participants.current }}/{{ event.participants.max }}
                    </p>
                  </div>
                  <div class="col-5 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/icons/Heart.png" alt="" />
                      {{ event.likes }}
                    </p>
                  </div>
                  <div class="col-1 p-0">
                    <p class="s-card-text4">
                      <img 
                        class="s-card-icon2" 
                        src="@/assets/icons/Share.png" 
                        alt="Share" 
                        @click="copyLinkToClipboard" 
                        title="Copy link to clipboard"
                      />
                    </p>
                  </div>
                </div>
                <div class="row">
                  <router-link :to="`/hosts/${event.createdBy.userId}`" class="p-0">
                    <p class="card-host">
                      <!--<img class="host-icon" :src="event.createdBy.profileImage || '@/assets/images/default-host.png'" alt="" />-->
                      {{ event.createdBy.username }}
                    </p>
                  </router-link>
                  <div class="p-0">
                    <router-link
                      v-if="!isParticipating && !(event.participants.current >= event.participants.max)"
                      :to="event.createdBy.id === userId ? `/manage/${event.id}` : `/joinEvents/${event.id}`"
                    >
                      <button class="join-btn">
                        {{
                          event.createdBy.id === userId
                            ? 'Manage'
                            : event.type === 'First come'
                            ? 'Join Now!'
                            : 'Register'
                        }}
                      </button>
                    </router-link>
                    <button
                      v-else
                      class="closed-join-btn"
                      @click="handleClosedClick"
                    >
                      {{
                        isParticipating
                          ? 'Participated'
                          : 'Closed'
                      }}
                    </button>

                  </div>



                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';
  import { useStore } from 'vuex';
  
  export default {
    name: 'EventDetails',
    setup() {
      
      const store = useStore();
      const userId = computed(() => store.getters.userId);
      const event = ref({
            description: '', // 빈 문자열로 초기화
            name: '',
            date: '',
            location: '',
            type: '',
            hashtags: [],
            participants: { current: 0, max: 0 },
            likes: 0,
            createdBy: { name: 'Unknown', id: 0, profileImage: '' },});
      const isLiked = ref(false);
      const isParticipating = ref(false); // 사용자 참여 여부 상태
      const formattedDate = computed(() => {
        if (!event.value.date) return '';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(event.value.date).toLocaleDateString(undefined, options);
      });
  
      const fetchEvent = async (eventId) => {
        try {
          const response = await axios.get(`http://localhost:3000/gathering/getEvents/${eventId}`);
          const eventData = response.data;
              // 데이터 매핑 및 변환
          event.value = {
            id: eventData.id,
            image: eventData.image, // API 응답에 맞춰 필드명 확인
            name: eventData.name,
            description: eventData.description,
            date: eventData.date,
            hashtags: eventData.hashtags || [], // 해시태그 배열 확인
            location: eventData.location,
            participants: {
              current: eventData.participants?.length || 0,
              max: eventData.maxParticipants,
            },
            likes: eventData.likes.length || 0,
            createdBy: {
              id: eventData.createdBy?.userId || 0,
              name: eventData.createdBy?.username || "Unknown",
              //profileImage: eventData.createdBy?.profileImage || "@/assets/images/default-host.png",
            },
            price: eventData.price,
            type: eventData.type
          };  
          const userId = sessionStorage.getItem('userId')
          isLiked.value = eventData.likes.some((like) => like.user.userId === userId);
        } catch (error) {
          console.error("Error fetching event data:", error);
        }
      };
  
      const toggleLike = async () => {
        isLiked.value = !isLiked.value;

        try {
          // 좋아요 상태를 백엔드에 반영
          const response = await axios.post(`http://localhost:3000/gathering/${event.value.id}/like`, {
            userId: sessionStorage.getItem('userId'), // 사용자 ID 전달
          });

          // 백엔드로부터 최신 좋아요 상태를 반영
          event.value.likes = response.data.likesLen;
        } catch (error) {
          console.error('Failed to toggle like:', error);
          // 상태 복원
          isLiked.value = !isLiked.value;
        }
      };
      // 사용자 참여 여부 확인 함수
      const checkUserParticipation = async (eventId, userId) => {
        try {
          const response = await axios.get(`http://localhost:3000/gathering/checkParticipation`, {
            params: { eventId, userId },
          });

          // 응답 결과를 이용해 참여 상태 업데이트
          isParticipating.value = response.data.isParticipating;
        } catch (error) {
          console.error('Failed to check participation:', error);
          isParticipating.value = false;
        }
      };

      onMounted(() => {
        const eventId = parseInt(window.location.pathname.split('/').pop()); // Extract event ID from URL
        fetchEvent(eventId);
        const userId = sessionStorage.getItem('userId');
        checkUserParticipation(eventId, userId); // 사용자 참여 여부 확인
      });    
      
      const copyLinkToClipboard = () => {
        const url = window.location.href; // 현재 페이지 URL
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!');
        }).catch((error) => {
          console.error('Failed to copy link:', error);
        });
      };

      return {
        event,
        isLiked,
        toggleLike,
        formattedDate,
        copyLinkToClipboard,
        userId,
        isParticipating
      };
    },
    methods: {
        handleClosedClick() {
          alert('This event is closed and cannot be joined.');
        },
    },
  };
  </script>
  
  
  <style scoped>

  .row{
    width:100%;
  }

  .space{
    padding: 75px;
  }

  .p-0{
    padding: 0px;
  }

  .m-0{
    margin: 0px;
  }

  /* header */
  .header-space{
    height: 90px;
  }

  /* main banner */
  .banner-img-box{
    max-width:100%;
    height: 400px;
    background-image: url("@/assets/images/image1.png");
    background-size:cover;
    background-position: center;
  }

/* Event content */
  .gatheing-title{
    margin-top: 66px;
    font-size: 48px;
    margin-bottom: 33px;
    font-weight: 600;
  }
  .hashtag-box{
    margin-top: 33px;
    margin-bottom: 66px;
  }
  .hashtag{
    background-color: #12CF51;
    color: #ffffff;
    padding: 3px;
    padding-left: 10px;
    padding-right: 10px;
    border: none;
    border-radius: 24px;
  }
  .map-box{
    margin-top: 33px;
    margin-bottom: 66px;
  }
  .map-title{
    font-size: 38px;
    font-weight: bold;
    margin: 0px;
  }
  .map-text{
    color: #5F687A;
    font-size: 16px;
  }
  .price-box{
    margin-bottom: 132px;
  }
  .price-title{
    font-size: 38px;
    font-weight: bold;
    margin: 0px;
  }
  .price-text{
    font-size: 24px;
    font-weight: 400;
  }

/* sticky-card */
  .sticky-card{
    position: sticky;
    top: 66px;
    margin-top: -200px;
    height: 426px;
    margin-bottom: 30px;
    border-radius: 24px;
    padding: 15px;
    padding-left: 27px;
    padding-right: 27px;
  }
  .btn_like {
    position: absolute;
    right: 15;
    width: 50px; 
    height: 50px;
    background: url("@/assets/icons/card_heart(1).png") no-repeat center / 40px; 
    cursor: pointer; 
    border:0; 
    font-size:0; 
    display:block;
    margin-top: -15px;
    margin-right: -0px;
  }
  .btn_like.on {
    background: url("@/assets/icons/card_heart(2).png") no-repeat center / 40px; 
    animation: beating .5s 1 alternate;
  }
  @keyframes beating {
    0% {transform: scale(1);}
    40% {transform: scale(1.25);}
    70% {transform: scale(0.9);}
    100% {transform: scale(1);}
  }

  .card-date-icon{
    background-image: url("@/assets/icons/Card_Date.png");
    width: 50px;
    height: 50px;
    background-size: cover;
    align-content: center;
    text-align: center;
  }
  .card-date{
    margin: 0px;
    font-size: 16px;
    font-weight: bold;
    color: #07722B;
  }
  .s-card-icon1{
    margin-bottom: 3px;
  }
  .s-card-icon2{
    width: 15px;
    margin-top: 5px;
    cursor: pointer;
  }
  .s-card-text1{
    margin: 0px;
    color: #5F687A;
    font-size: 16px;
  }
  .s-card-text2{
    margin: 0px;
    color: #1C1F23;
    font-size: 16px;
    font-weight: bold;
  }
  .s-card-text3{
    margin-top: 15px;
    margin-bottom: 24px;
    padding: 0px;
    color: #5F687A;
    font-size: 16px;
  }
  .s-card-text4{
    padding: 0px;
    color: #5F687A;
    font-size: 16px;
  }
  .card-host{
    margin: 0px;
    margin-top: 16px;
    cursor: pointer;
  }
  .host-icon{
    width: 32px;
    height: 32px;
    border-radius: 100%;
  }
  .join-btn{
    width: 280px;
    margin: 32px;
    padding: 20px;
    padding-left: 100px;
    padding-right: 100px;
    background-color: #12CF51;
    border: none;
    border-radius: 96px;
    color: #ffffff;
  }
  .closed-join-btn{
    width: 280px;
    margin: 32px;
    padding: 20px;
    padding-left: 100px;
    padding-right: 100px;
    background-color:gray;
    border: none;
    border-radius: 96px;
    color: #ffffff;
  }

</style>

  