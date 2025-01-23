<template>
    <div class="web-body">
  
      <!-- Title-text -->
      <div class="container">
        <div class="row">
          <div class="col-8">
            <!-- Main banner -->
            <div class="container banner-img-box" :style="{ backgroundImage: `url(${event.mainImage})` }"></div>
            
            <!-- text section -->
            <div class="gathering-box">
              <p class="gatheing-title">{{ event.name }}</p>
              <div class="gathering-text-box">
                <p class="gathering-text" v-html="event.description"></p>
              </div>
            </div>
  
            <!-- Map section -->
            <div class="map-box">
              <p class="map-title">
                <img src="" alt="">Location
              </p>
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
                  <div class="col-2 card-date-icon">08</div>
                  <div class="col-10">
                    <p class="s-card-text1">Event Date</p>
                    <p class="s-card-text2">{{ formattedDate }}</p>
                  </div>
                </div>
                <div class="row">
                  <div class="col-12 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/img/icon_Location.png" alt="" />
                      {{ event.location }}
                    </p>
                  </div>
                  <div class="col-12 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/img/icon_User.png" alt="" />
                      {{ event.participants.current }}/{{ event.participants.max }}
                    </p>
                  </div>
                  <div class="col-12 p-0">
                    <p class="s-card-text4">
                      <img class="s-card-icon1" src="@/assets/img/icon_Heart.png" alt="" />
                      {{ event.likes }}
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
                    <!-- 사용자가 이벤트 생성자인 경우 -->
                    <router-link
                      v-if="event.createdBy.id === userId"
                      :to="`/manage/${event.id}`"
                    >
                      <button class="join-btn">
                        Manage
                      </button>
                    </router-link>

                    <!-- 사용자가 이벤트 생성자가 아니고, 참여하지 않은 경우 -->
                    <router-link
                      v-else-if="!isParticipating && !(event.participants.current >= event.participants.max) && new Date(`${event.date}T${event.time}`) >= new Date()"
                      :to="`/enterEvent/${event.id}`"
                    >
                      <button class="join-btn">
                        Join Now!
                      </button>
                    </router-link>

                    <!-- 참여한 경우 -->
                    <button
                      v-else-if="isParticipating"
                      class="cancel-btn"
                      @click="handleCancelParticipation"
                    >
                      Cancel
                    </button>

                    <!-- 참여하지 않은 경우 -->
                    <button
                      v-else
                      class="closed-join-btn"
                      disabled
                    >
                      Closed
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
            id: '',
            description: '', // 빈 문자열로 초기화
            name: '',
            date: '',
            time: '',
            location: '',
            locationDetail: '',
            mainImage: '',
            images: [],
            participants: { current: 0, max: 0, min: 0},
            category: '',
            type: '',
            likes: 0,
            createdBy: { name: '', id: 0, profileImage: '' },
            price: 0,
            question: '',
      });
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
            time: eventData.time,
            category: eventData.category,
            mainImage: eventData.mainImage,
            location: eventData.location,
            locationDetail: eventData.locationDetail,
            participants: {
              current: eventData.participants?.length || 0,
              max: eventData.maxParticipants,
              min: eventData.minParticipants
            },
            likes: eventData.likes.length || 0,
            createdBy: {
              id: eventData.createdBy?.userId || 0,
              name: eventData.createdBy?.username || "Unknown",
              //profileImage: eventData.createdBy?.profileImage || "@/assets/images/default-host.png",
            },
            price: eventData.price,
            type: eventData.type,
            question: eventData.question,
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
    // 참여 취소 함수
      const handleCancelParticipation = async () => {
        // 사용자 확인
        const userConfirmed = window.confirm(
          "Are you sure you want to cancel your participation in this event?"
        );

        if (userConfirmed) {
          try {
            // 백엔드 호출
            const response = await axios.post("http://localhost:3000/gathering/cancelParticipation", {
              userId: userId.value,
              eventId: event.value.id,
            });

            // 성공 메시지 표시
            console.log("Participation canceled:", response.data);
            alert("Your participation has been successfully canceled.");
          } catch (error) {
            // 에러 처리
            console.error("Error canceling participation:", error);
            alert("Failed to cancel participation. Please try again.");
          }
        } else {
          // 사용자가 취소를 확정하지 않음
          console.log("User canceled the confirmation.");
        }
      };

      onMounted(() => {
        const eventId = parseInt(window.location.pathname.split('/').pop()); // Extract event ID from URL
        fetchEvent(eventId);
        const userId = sessionStorage.getItem('userId');
        checkUserParticipation(eventId, userId); // 사용자 참여 여부 확인
      });

      return {
        event,
        isLiked,
        toggleLike,
        formattedDate,
        userId,
        isParticipating,
        handleCancelParticipation
      };
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
    height: 320px;
    margin-bottom: 30px;
    border-radius: 24px;
    padding: 15px;
    padding-left: 27px;
    padding-right: 27px;
  }
  .btn_like {
    position: absolute;
    right: 25px;
    top: 45px;
    width: 50px; 
    height: 50px;
    background: url("@/assets/img/icon_Heart.png") no-repeat center / 40px; 
    cursor: pointer; 
    border:0; 
    font-size:0; 
    display:block;
    margin-top: -15px;
    margin-right: -0px;
  }
  .btn_like.on {
    background: url("@/assets/img/icon_HeartFilled.png") no-repeat center / 40px; 
    animation: beating .5s 1 alternate;
  }
  @keyframes beating {
    0% {transform: scale(1);}
    40% {transform: scale(1.25);}
    70% {transform: scale(0.9);}
    100% {transform: scale(1);}
  }

  .card-date-icon{
    background-image: url("@/assets/img/icon_DateDetail.png");
    width: 50px;
    height: 50px;
    background-size: cover;
    align-content: center;
    text-align: center;
    font-weight: 600;
    color: #4457FF;
  }
  .s-card-icon1{
    margin-bottom: 3px;
    width: 17px;
    height: 17px;
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
    margin: 0px;
    padding: 5px 0px;
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
    margin: 12px 32px;
    padding: 20px;
    padding-left: 100px;
    padding-right: 100px;
    background-color: #4457FF;
    border: none;
    border-radius: 96px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 300;
  }
  .cancel-btn{
    width: 280px;
    margin: 12px 32px;
    padding: 20px;
    padding-left: 100px;
    padding-right: 100px;
    background-color: #e84a4a;
    border: none;
    border-radius: 96px;
    color: #ffffff;
    font-size: 18px;
    font-weight: 300;
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

  