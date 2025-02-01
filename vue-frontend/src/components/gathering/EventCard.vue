<!-- EventCard.vue -->
<template>
  <router-link :to="`/events/${event.id}`">
    <!-- 카드 1 -->
    <div class="event-card col-4">
      <div class="event-content">
        <div class="card">
          <div class="card-img" :style="{ backgroundImage: `url(${event.mainImage})` }">
            <div class="row">
              <div class="col-9">
                <div class="icon_tema">
                  {{ event.category }}
                </div>
                <div class="icon_type">
                  {{ event.type }}
                </div>
                <div class="participants">
                  <img class="card-info-icon" src="@/assets/img/icon_User.png" alt="" />
                  <span>{{ event.participants.current }}</span>/<span>{{ event.participants.max }}</span>
                </div>
              </div>
              <div class="col-3">
                <button class="btn_like" :class="{ on: isLiked }" @click.stop.prevent="toggleLike">like</button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <p class="card-info-text">
                  <img class="card-info-icon" src="@/assets/img/icon_Date.png" alt="" /> {{ event.date }}
                </p>
              </div>
              <div class="col-6">
                <p class="card-info-text">
                  <img class="card-info-icon" src="@/assets/img/icon_Heart.png" alt="" /> {{localEvent.likes}}
                </p>
              </div>
              <div class="col-12">
                <p class="card-info-text">
                  <img class="card-info-icon" src="@/assets/img/icon_Location.png" alt="" /> {{event.location}}
                </p>
              </div>
            </div>
            <p class="card-title">{{event.title}}</p>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  props: {
    event: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const isLiked = ref(false);
    const localEvent = ref({ ...props.event }); // 로컬 상태 생성
    // 좋아요 상태 초기화
    const initializeLikeStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/gathering/${props.event.id}/isLiked`,
          {
            params: {
              userId: sessionStorage.getItem('userId'), // 사용자 ID 전달
            },
          }
        );
        isLiked.value = response.data.isLiked; // 서버에서 받은 상태로 초기화
      } catch (error) {
        console.error('Failed to initialize like status:', error);
      }
    };
    const toggleLike = async () => {
      const userId = sessionStorage.getItem('userId'); // 로그인 여부 확인

      if (!userId) {
        alert('로그인이 필요합니다.');
        window.location.href = '/login'; // 로그인 페이지로 이동
        return;
      }
      isLiked.value = !isLiked.value;

      try {
        // 좋아요 상태를 백엔드에 반영
        const response = await axios.post(`http://localhost:3000/gathering/${props.event.id}/like`, {
          userId: sessionStorage.getItem('userId'), // 사용자 ID 전달
        });

        // 백엔드로부터 최신 좋아요 상태를 반영
        localEvent.value.likes = response.data.likesLen;
      } catch (error) {
        console.error('Failed to toggle like:', error);
        // 상태 복원
        isLiked.value = !isLiked.value;
      }
    };

    // 컴포넌트가 마운트될 때 좋아요 상태 초기화
    onMounted(() => {
      initializeLikeStatus();
    });

    return {
      isLiked,
      toggleLike,
      localEvent,
    }
  }
};
</script>

<style scoped>
/* card */
/* all events */
.card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  flex-shrink: 0;
  text-align: center;
  --bs-card-border-width: none;
  transition: all 0.3s ease;
}

.card:hover {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  width: 300px;
  flex-shrink: 0;
  text-align: center;
  --bs-card-border-width: none;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.card-body .col-6, .col-12{
  padding: 0px;
}

.card-title{
  font-size: 1.75rem;
  font-weight: 500;
  text-align: left;
  margin: 0px;
}

.card-detail{
  text-align: left;
  font-size: 15px;
  font-weight: 300;
}


.btn_like {
  position: absolute;
  top: 25px;
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

.icon_type{
  width: min-content;
  background-color: #58C3FF;
  color: #FFFFFF;
  padding: 5px 15px;
  border-radius: 24px;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card-img {
  background-image: url('@/assets/img/img_LogInBanner1.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 210px;
  border-radius: 8px;
}

.card-info-text{
  padding: 0px 5px;
}

.icon_tema{
  width: min-content;
  background-color: #5870FF;
  color: #FFFFFF;
  padding: 5px 15px;
  border-radius: 24px;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
.participants{
  width: max-content;
  background-color: #FFFFFF;
  color: #5870FF;
  padding: 5px 15px;
  border-radius: 24px;
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
.card-icon-heart{
  margin: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.card-info-text{
  text-align: left;
  font-weight: 300;
}

.card-info-icon{
  width: 20px !important;
  height: 20px !important;
}

.event-card{
  width: 100%;
  padding: 15px;
}
.events-container .card-img{
  height: 240px;
}
.event-content .card{
  width: 100%;
  height: 420px;
}
.event-content .card-body{
  padding: 1rem;
}
.event-content .card-info-text{
  padding: 0.5rem;
  margin: 0px;
}
</style>