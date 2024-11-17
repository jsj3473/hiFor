<template>
    <div>
      <h1>이벤트 목록</h1>
      <div v-for="event in events" :key="event.id" class="event-card">
        <img v-if="event.eventImages && event.eventImages.length > 0" :src="`http://localhost:3000/uploads/${event.eventImages[0]}`" :alt="event.eventName" />
        <h2>{{ event.eventName }}</h2>
        <p>날짜: {{ event.date }}</p>
        <p>장소: {{ event.eventLocation }}</p>
        <p>인원: {{ event.participants || "구현 중" }}</p>
        <p>좋아요 수: {{ event.likes || "구현 중" }}</p>
        <button @click="shareEvent(event.id)">공유하기</button>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      const events = ref([]);
  
      const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:3000/gathering');
          events.value = response.data;
        } catch (error) {
          console.error('이벤트 데이터를 불러오는 중 오류 발생:', error);
        }
      };
  
      const shareEvent = (eventId) => {
        const url = `${window.location.origin}/events/${eventId}`;
        navigator.clipboard.writeText(url).then(() => {
          alert("이벤트 링크가 복사되었습니다!");
        });
      };
  
      onMounted(() => {
        fetchEvents();
      });
  
      return {
        events,
        shareEvent
      };
    }
  };
  </script>
  