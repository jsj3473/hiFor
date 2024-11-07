<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to Our Community!</h1>
      <p>당신의 여행과 소모임을 계획하고 커뮤니티에 참여해보세요!</p>
    </div>

    <div class="features">
      <div class="feature-card">
        <h2>소모임</h2>
        <p>관심 있는 소모임에 참여하고 사람들과 교류하세요.</p>
        <router-link to="/group"><button>소모임 둘러보기</button></router-link>
      </div>
      <div class="feature-card">
        <h2>커뮤니티</h2>
        <p>커뮤니티에서 다양한 경험과 이야기를 공유하세요.</p>
        <router-link to="/community"><button>커뮤니티 참여하기</button></router-link>
      </div>
    </div>
  </div>
</template>

<script>
import HomePage from '../js/HomePage.js';
  
  export default HomePage;

</script>

