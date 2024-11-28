<template>
  <div>
    <!-- 헤더 공간 -->
    <div class="container header-space"></div>

    <!-- 배너 섹션 -->
    <div class="main-banner">
      <div class="row">
        <div class="col-12 banner-text-box1">
          <p class="banner-text1">Welcome to HiFor</p>
        </div>
        <div class="col-12 banner-text-box2">
          <p class="banner-title">
            The Real Experience<br />
            of Korean Life, Start<br />
            From The <span style="color: #0ca835;">HiFor.</span><br />
          </p>
        </div>
        <div class="col-12 banner-button-box">
          <button type="button" class="banner-button">Browse events</button>
        </div>
      </div>
    </div>

    <!-- Event Carousel -->
    <div class="container events-carousel">
      <div id="carouselExampleInterval" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div class="carousel-item active" data-bs-interval="10000">
            <img class="bc-img d-block w-100" src="@/assets/images/008 2.png" alt="..." />
          </div>
          <div class="carousel-item" data-bs-interval="2000">
            <img class="bc-img d-block w-100" src="@/assets/images/008 2.png" alt="..." />
          </div>
          <div class="carousel-item">
            <img class="bc-img d-block w-100" src="@/assets/images/008 2.png" alt="..." />
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    </div>

    <!-- HiFor Cards -->
    <div class="container cards-section">
      <div class="row">
        <p class="cs-title">Hosted by HiFor</p>
      </div>
      <div class="row">
        <div class="col-4" v-for="(event, index) in visibleCards" :key="index">
          <router-link :to="`/events/${event.id}`">
            <div class="card">
              <img :src="event.image" class="card-img-top card-img" alt="..." />
              <div class="card-body">
                <p class="card-title">{{ event.name }}</p>
                <div class="row hashtag-row"></div>
                <div class="row">
                  <div class="col-6">
                    <p class="card-info-text">
                      <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="" />
                      {{ event.date }}
                    </p>
                  </div>
                  <div class="col-6">
                    <p class="card-info-text">
                      <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="" />
                      {{ event.location }}
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
                    </p>
                  </div>
                </div>
                <div class="row">
                  <!--
                  <router-link>
                    <p class="card-host">
                      <img class="host-icon" :src="event.hostImage" alt="" />
                      {{ event.createdBy }}
                    </p>
                  </router-link>
                  -->
                  <router-link :to="`/hosts/${event.hostId}`">
                    <p class="card-host">
                      {{ event.host }}
                    </p>
                  </router-link>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="row text-center">
        <div class="col">
          <div class="text-center">
            <p class="d-inline-flex gap-1">
              <button
                class="showall-btn"
                type="button"
                @click="toggleShowAll"
              >
                {{ showAll ? 'Show Less' : 'Show More' }}
              </button>
            </p>
          </div>
       </div>
      </div>
    </div>

    <!-- Host Cards -->
    <div class="container cards-section">
      <div class="row">
        <p class="cs-title">Hot events</p>
      </div>
      <div class="row">
        <div class="col-4" v-for="(event, index) in visibleCards" :key="index">
          <router-link :to="`/events/${event.id}`">
            <div class="card">
              <img :src="event.image" class="card-img-top card-img" alt="..." />
              <div class="card-body">
                <p class="card-title">{{ event.name }}</p>
                <div class="row hashtag-row"></div>
                <div class="row">
                  <div class="col-6">
                    <p class="card-info-text">
                      <img class="card-info-icon" src="@/assets/icons/Date_icon.png" alt="" />
                      {{ event.date }}
                    </p>
                  </div>
                  <div class="col-6">
                    <p class="card-info-text">
                      <img class="card-info-icon" src="@/assets/icons/MapPin_icon.png" alt="" />
                      {{ event.location }}
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
                    </p>
                  </div>
                </div>
                <div class="row">
                  <!--
                  <router-link>
                    <p class="card-host">
                      <img class="host-icon" :src="event.hostImage" alt="" />
                      {{ event.createdBy }}
                    </p>
                  </router-link>
                  -->
                  <router-link :to="`/hosts/${event.hostId}`">
                    <p class="card-host">
                      {{ event.host }}
                    </p>
                  </router-link>
                </div>
              </div>
            </div>
          </router-link>
        </div>
      </div>
      <div class="row">
          <div class="col">
            <div class="text-center">
              <router-link to="/showAllEvents">
                <button class="showall-btn btn btn-outline-success" type="button">
                  Show All
                </button>
              </router-link>
            </div>
          </div>
        </div>
    </div>
    

    <!-- Space -->
    <div class="space"></div>

      <!-- explain section -->
      <div class="contaienr ex-con">
        <div class="row">
          <div class="col ex-text1">
            <p>How it works</p>
          </div>
        </div>
        <div class="row">
          <div class="col ex-title">
            <h2>Learn how the experience works</h2>
          </div>
        </div>
        <div class="row">
          <div class="col-1"></div>
          <div class="col ex-box">
            <img class="ex-icon1" src="@/assets/images/Group 1000005008.png" alt=""><br>
            <img class="ex-num1" src="@/assets/images/MapPin (1).png" alt=""><br>
            <p class="ex-text2">
              Search for events<br>
              interests you 
            </p>
            <p class="ex-text3">
              Search for a topic you're interested in and<br> find a event you want!
            </p>
          </div>
          <div class="col ex-box">
            <img class="ex-icon2" src="@/assets/images/Group 1000005011.png" alt=""><br>
            <img class="ex-num2" src="@/assets/images/MapPin (2).png" alt=""><br>
            <p class="ex-text2">
              Create any events<br>you want! 
            </p>
            <p class="ex-text3">
              If you don't like anything or have a good idea,<br>make your own event!
            </p>
          </div>
          <div class="col ex-box">
            <img class="ex-icon3" src="@/assets/images/co_.svg" alt=""><br>
            <img class="ex-num3" src="@/assets/images/MapPin (3).png" alt=""><br>
            <p class="ex-text2">
              Enjoy an event and<br> connect with people
            </p>
            <p class="ex-text3">
              Enjoy the event and have a new meeting with<br> new people at HiFor!
            </p>
          </div>
          <div class="col-1"></div>
        </div>
      </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
  name: 'HomePage',
  setup() {
    const store = useStore();

    // Vuex 상태 및 getter 사용
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const token = computed(() => store.getters.token);

    // 로컬 상태 관리
    const events = ref([]); // 이벤트 데이터
    // "Show More" 상태
    const showAll = ref(false);

    // 표시할 카드 계산
    const visibleCards = computed(() => {
      return showAll.value ? events.value : events.value.slice(0, 3);
    });

    // "Show More" 버튼 클릭 시 상태 변경
    const toggleShowAll = () => {
      showAll.value = !showAll.value;
    };
    // 이벤트 데이터 가져오기
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:3000/gathering"); 
        events.value = response.data.map(event => ({
          id: event.id,
          image: event.image,
          title: event.name,
          date: event.date,
          location: event.location,
          participants: {
            current: event.participants.length, // 현재 참가자 수
            max: event.maxParticipants, // 최대 참가자 수
          },
          likes: event.likes, // 좋아요 수
          host: event.createdBy.name, // 이벤트 생성자 이름
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
      showAll,
      visibleCards,
      toggleShowAll,
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

  /* header */
  .header-box{
    height: 90px;
  }

  /* banner */
  .main-banner{
    background-image: url('@/assets/images/banner_img.png');
    background-size: cover;
    height: 480px;
    background-position: center;
    margin-bottom:60px;
  }
  .banner-text-box1{
    padding-top: 72px;
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
  .banner-text-box2{
    margin-bottom: 40px;
  }
  .banner-title{
    font-size: 50px;
    font-weight: 700;
    line-height: 64px;
    text-align: center;
  }
  .banner-button-box{
    text-align: center;
  }
  .banner-button{
    background: none;
    border: 2px solid #0CA835;
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 30px;
    color: #0CA835;
  }
  .banner-button:hover{
    background-color: #0CA835;
    border: 2px solid #0CA835;
    color: #ffffff;
    padding: 15px;
    padding-left: 20px;
    padding-right: 20px;
    border-radius: 30px;
  }
  .events-carousel{
    height: 180px;
    margin-bottom: 60px;
    width: 80%;
  }
  .bc-img{
    height: 180px;
    width: 100%;
    object-fit: cover;
    background-color: #CBD7EA;
    border: none;
  }

  /* cards */
  .cs-title{
    font-size: 38px;
    font-weight: bold;
  }

  /* ex */
  .ex-text1{
    text-align:center;
  }
  .ex-title{
    text-align:center;
  }
  .ex-icon1{}
  .ex-icon2{}
  .ex-icon3{
    margin-top:-10px;
    margin-left:-40px;
  }
  .ex-con{
    height:800px;
    align-content:center;
    background-color: #F8F8FB;
    border-radius: 40px;
  }
  .ex-box{
    text-align:center;
  }
  .ex-icon1{
    width:150px;
    margin-top:10px;
    margin-bottom:40px;
  }
  .ex-icon2{
    width:150px;
    margin-top:10px;
    margin-bottom:40px;
  }
  .ex-icon3{
    height:210px;
  }
  .ex-text2{
    font-size: 30px;
    font-weight: 700;
    line-height: 40px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  .ex-text3{
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }


  /* Contact-Us */
  .contact-con{
    height:630px;
    background-color:#F8F8FB;
    border-radius:40px;
    justify-items: center;
    padding-top:40px;
    padding-bottom: 40px;
    padding-left:125px;
    padding-right:125px;
  }
  .contact-box{
    background-color:#12CF51;
    height:550px;
    border-radius: 40px;
  }
  .c-img-box{
    height:550px;
  }
  .c-img-box1{
    text-align: right;
  }
  .c-img-box2{
    align-self:end;
  }
  .c-img1{
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    margin-bottom:25px;
  }
  .c-img3{
    margin-bottom:25px;
  }
  .c-text-box{
    padding-top:120px;
    padding-bottom:120px;
  }
  .c-title{
    color: #ffffff;
    font-size: 50px;
    font-weight: 700;
    line-height: 64px;
  }
  .c-text{
    color: #f1f1f1;
    font-size: 18px;
    font-weight: 500;
    line-height: 28px;
  }
  .contact-btn{
    width: 155px;
    height: 58px;
    background-color: black;
    border-radius: 100px;
    color: #ffffff;
    margin-top: 40px;
    border: none;
  }

  /* cards */
  .card-box{
    margin-top:20px;
    margin-bottom:20px;
    margin-right: 10px;
    margin-left: 10px;
  }
  .card-box:hover{
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
    margin-bottom: 33px;
  }
  .card-img{
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
  }
  .card-host{
    margin: 0px;
    cursor: pointer;
  }
  .host-icon{
    width: 32px;
    height: 32px;
    border-radius: 100%;
  }
  .showall-btn{
    margin-top: 33px;
    margin-bottom: 66px;
    background-color: #0CA835;
    border: 1px #0CA835 solid;
    width: 189px;
    height: 56px;
    color: #ffffff;
    font-style: italic;
    font-weight: bold;
    border-radius: 108px;
  }

  /* how to enjoy */
  .ex-text1{
    text-align:center;
  }
  .ex-title{
    text-align:center;
  }
  .ex-icon1{}
  .ex-icon2{}
  .ex-icon3{
    margin-top:-10px;
    margin-left:-40px;
  }
  .ex-con{
    height:800px;
    align-content:center;
    background-color: #F8F8FB;
    border-radius: 40px;
  }
  .ex-box{
    text-align:center;
  }
  .ex-icon1{
    width:150px;
    margin-top:10px;
    margin-bottom:40px;
  }
  .ex-icon2{
    width:150px;
    margin-top:10px;
    margin-bottom:40px;
  }
  .ex-icon3{
    height:210px;
  }
  .ex-text2{
    font-size: 30px;
    font-weight: 700;
    line-height: 40px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }
  .ex-text3{
    font-size: 16px;
    font-weight: 500;
    line-height: 28px;
    text-align: center;
    text-underline-position: from-font;
    text-decoration-skip-ink: none;
  }

</style>
