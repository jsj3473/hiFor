<template>
  <div class="mypage-con">
    <div class="row">
      <!-- 좌측 프로필 영역 -->
      <div class="col-lg-4 col-md-12">
        <div class="profile-box">
          <div class="profile-img"></div>
          <p class="profile-name">Eddie Roh</p>
          <p class="profile-info">Korea, Male, 23</p>
          <p class="profile-info">Hanyang University</p>
        </div>
        <div class="profile-box">
          <div class="row">
            <div class="col-6 host-info">
              <p class="host-info-num">12</p>
              <p class="host-info-text">Events Hosted</p>
            </div>
            <div class="col-6 host-info">
              <p class="host-info-num">120</p>
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
            <div class="col-md-6 col-sm-12" v-for="n in 4" :key="`hosted-${n}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">HiFor Party</p>
                    <p class="mp-event-host">
                      <img class="mp-host-icon" src="@/assets/img/img_LogInBanner2.png" alt="Host"> Eddie Roh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Joined Events -->
        <div class="events-box">
          <p class="box-title">Joined Event</p>
          <div class="row">
            <div class="col-md-6 col-sm-12" v-for="n in 4" :key="`joined-${n}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">HiFor Party</p>
                    <p class="mp-event-host">
                      <img class="mp-host-icon" src="@/assets/img/img_LogInBanner2.png" alt="Host"> Eddie Roh
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Liked Events -->
        <div class="events-box">
          <p class="box-title">Liked Event</p>
          <div class="row">
            <div class="col-md-6 col-sm-12" v-for="n in 4" :key="`liked-${n}`">
              <div class="mp-card">
                <div class="row">
                  <div class="col-4 mp-event-img"></div>
                  <div class="col-8">
                    <p class="mp-event-title">HiFor Party</p>
                    <p class="mp-event-host">
                      <img class="mp-host-icon" src="@/assets/img/img_LogInBanner2.png" alt="Host"> Eddie Roh
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
</template>

<!-- css -->

<style scoped>
/* 부트스트랩 요소 세팅 */
.row{
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
