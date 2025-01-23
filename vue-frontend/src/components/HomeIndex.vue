<template>
    <div class="Web">
        <div class="home-banner">
            <!-- 메인 -->
            <p class="banner-title">
              <router-link to="/contactUs">contactUs</router-link>
                Start real Korean Life <br>
                from the <span style="color: #58C3FF;">HiFor.</span>
            </p>


            <div class="search-box">
              <form class="search-form" @submit.prevent="searchEvents">
                <table>
                    <tr class="search-text">
                        <button type="submit">
                            <img src="../assets/img/icons_search.png" alt="">
                        </button>
                        <input type="text" class="search-text-box" v-model="searchQuery">
                    </tr>
                    <tr class="search-date">
                        <input type="date" v-model="searchDate">
                    </tr>
                    <tr class="search-location">
                        <select v-model="searchLocation">
                            <option disabled selected>Location</option>
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
                    </tr>
                    <tr class="search-type">
                        <select v-model="searchType">
                            <option value="">Type</option>
                            <option value="First come">First come</option>
                            <option value="Register">Register</option>
                        </select>
                    </tr>
                </table>
              </form>
            </div>
            <div class="category-row">
              <p class="title">Top categories</p>
              <div class="row">
                <div
                  class="col category-box"
                  v-for="category in categories"
                  :key="category.name"
                  @click="fetchEventsByCategory(category.name)"
                >
                  <img :src="category.icon" :alt="category.name" />
                  <p>{{ category.displayName }}</p>
                </div>
              </div>
            </div>
        </div>

        <!-- Hot Events Carousel -->
         <div class="carousel-container">
            <!-- 이전 버튼 -->
            <button class="carousel-btn prev-btn" @click="scrollCarousel('prev')">‹</button>

           <!-- 카드 슬라이더 -->
           <div ref="carousel" class="carousel">
             <div class="carousel-item" v-for="(event, index) in hotEvents" :key="index">
               <EventCard :event="event" />
             </div>
           </div>

            <!-- 다음 버튼 -->
            <button class="carousel-btn next-btn" @click="scrollCarousel('next')">›</button>
        </div>

        <!-- All Events -->
        <div class="events-container">
            <p class="eventcontainer-title">Events</p>
            <!-- Event Cards -->
            <div class="row cards-grid">
              <div class="col-4" v-for="(event, index) in visibleEvents" :key="index">
                <EventCard :event="event" />
              </div>
            <!-- 다른 카드들도 여기에 추가 -->
            </div>

            <!-- 페이지네이션 버튼 -->
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>{{ currentPage }} / {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
        </div>


        <!-- explain section -->
        <div class="contaienr ex-con">
            <div class="row">
                <div class="col ex-text1">
                    How it works
                </div>
            </div>
            <div class="row">
                <p class="ex-title">
                    Learn how the experience works
                </p>
            </div>
            <div class="row">
                <div class="col ex-box">
                    <img class="ex-icon1" src="../assets/img/icon_HowTo1.png" alt=""><br>
                    <img class="ex-num1" src="../assets/img/icon_Num1.png" alt=""><br>
                    <p class="ex-text2">
                        Search for events<br>
                        interests you 
                    </p>
                    <p class="ex-text3">
                        Search for a topic you're interested in and<br> find a event you want!
                    </p>
                </div>
                <div class="col ex-box">
                    <img class="ex-icon2" src="../assets/img/icon_HowTo2.png" alt=""><br>
                    <img class="ex-num2" src="../assets/img/icon_Num2.png" alt=""><br>
                    <p class="ex-text2">
                        Create any events<br>you want! 
                    </p>
                    <p class="ex-text3">
                        If you don't like anything or have a good idea,<br>make your own event!
                    </p>
                </div>
                <div class="col ex-box">
                    <img class="ex-icon3" src="../assets/img/icon_HowTo3.svg" alt=""><br>
                    <img class="ex-num3" src="../assets/img/icon_Num3.png" alt=""><br>
                    <p class="ex-text2">
                        Enjoy an event and<br> connect with people
                    </p>
                    <p class="ex-text3">
                        Enjoy the event and have a new meeting with<br> new people at HiFor!
                    </p>
                </div>
            </div>
        </div>

        <!-- why hifor -->
        <div class="container why-con">
            <div class="row">
                <div class="col-6 why-box">
                    <img src="../assets/img/img_MeetUp.png" alt="">
                </div>
                <div class="col-6 why-box">
                    <p class="wc-text1">Why HiFor</p>
                    <p class="wc-title">
                        Discover more than <br>
                        3,000+ technology events
                    </p>
                    <p class="wc-text2">
                        Lorem ipsum dolor sit amet consectetur erat elit viverra quis vestibulum auctor sit tellus est quam quis urna id at nunc amet dolor hendrerit justo.
                    </p>
                    <router-link to="/">
                        <button class="wc-btn">Create Event</button>
                    </router-link>
                </div>
            </div>
        </div>
        <!-- our values -->
        <div class="row ov-con">
            <p class="rc-text1">Our values</p>
            <p class="rc-title">
                The values that drive<br>
                everything we do
            </p>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue1.png" alt="">
                    <p class="value-title">Inclusivity</p>
                    <p class="value-text">HiFor welcomes everyone,<br>fostering a sense of belonging.</p>
                </div>
            </div>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue2.png" alt="">
                    <p class="value-title">Growth</p>
                    <p class="value-text">Guided by feedback and data,<br>we improve to support growth.</p>
                </div>
            </div>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue3.png" alt="">
                    <p class="value-title">Innovation</p>
                    <p class="value-text">AI-driven services transform<br>experiences with personalization.</p>
                </div>
            </div>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue4.png" alt="">
                    <p class="value-title">Connection</p>
                    <p class="value-text">HiFor connects people through <br>shared interests and events.</p>
                </div>
            </div>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue5.png" alt="">
                    <p class="value-title">Support</p>
                    <p class="value-text">We empower individuals with <br>language learning and networking.</p>
                </div>
            </div>
            <div class="col-4">
                <div class="value-card">
                    <img src="../assets/img/icon_OurValue6.png" alt="">
                    <p class="value-title">Accessibility</p>
                    <p class="value-text">Affordable services ensure <br>easy participation for all.</p>
                </div>
            </div>
        </div>
        <!-- user say -->
        <div class="review-con">
            <p class="rc-text1">Testimonials</p>
            <p class="rc-title">What our users say about us</p>
            <p class="rc-text2">
                Lorem ipsum dolor sit amet consectetur elit cursus bibendum pharetra <br> 
                integer pharetra eu sollicitudin ipsum sit id mi vulputate quis vel.
            </p>
        </div>
        <!-- Testimonials Cards1 -->
        <div class="testimonials-grid review-row1">
            <!-- Testimonial 1 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="John Carter" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">John Carter</p>
                    <p class="testimonial-location">New York, NY</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Fames in metus ipsum nisi atibus id mauris lectus non semper nisi elementum.
            </p>
            </div>

            <!-- Testimonial 2 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Lily Woods" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Lily Woods</p>
                    <p class="testimonial-location">San Francisco, CA</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Lorem ipsum dolor sit amet ipsum non consectetur adipiscing elit hendrerit elit at a at cursus nibh lorem aliquam.
            </p>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Andy Smith" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Andy Smith</p>
                    <p class="testimonial-location">Chicago, IL</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Eu tempus viverra mi porttitor ut at neque at nisl sed pharetra sodales ultrices volutpat tincidunt dictum ut.
            </p>
            </div>

            <!-- Testimonial 4 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Kelly Sung" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Kelly Sung</p>
                    <p class="testimonial-location">New York, NY</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Lorem ipsum dolor sit amet consectetu adipiscing elit nisi id at felis risus commodo elit ut ultrices.
            </p>
            </div>

            <!-- Add more testimonial cards as needed -->
        </div>

        <!-- Testimonials Cards2 -->
        <div class="testimonials-grid review-row2">
            <!-- Testimonial 1 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="John Carter" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">John Carter</p>
                    <p class="testimonial-location">New York, NY</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Fames in metus ipsum nisi atibus id mauris lectus non semper nisi elementum.
            </p>
            </div>

            <!-- Testimonial 2 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Lily Woods" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Lily Woods</p>
                    <p class="testimonial-location">San Francisco, CA</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Lorem ipsum dolor sit amet ipsum non consectetur adipiscing elit hendrerit elit at a at cursus nibh lorem aliquam.
            </p>
            </div>

            <!-- Testimonial 3 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Andy Smith" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Andy Smith</p>
                    <p class="testimonial-location">Chicago, IL</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Eu tempus viverra mi porttitor ut at neque at nisl sed pharetra sodales ultrices volutpat tincidunt dictum ut.
            </p>
            </div>

            <!-- Testimonial 4 -->
            <div class="testimonial-card">
            <div class="testimonial-header">
                <img src="https://via.placeholder.com/50" alt="Kelly Sung" class="testimonial-avatar" />
                <div>
                    <p class="testimonial-name">Kelly Sung</p>
                    <p class="testimonial-location">New York, NY</p>
                </div>
                <img src="https://via.placeholder.com/20" alt="Twitter Icon" class="testimonial-icon" />
            </div>
            <p class="testimonial-text">
                Lorem ipsum dolor sit amet consectetu adipiscing elit nisi id at felis risus commodo elit ut ultrices.
            </p>
            </div>

            <!-- Add more testimonial cards as needed -->
        </div>

        <!-- Buttons -->
        <div class="button-row">
            <button class="cta-button primary-button">Post a event</button>
            <button class="cta-button secondary-button">Browse events</button>
        </div>

        <!-- 컨택어스 -->
        <!-- past a event -->
        <div class="contaeiner contact-con">
            <div class="row contact-box">
            <div class="col-6">
                <div class="row c-img-box">
                <div class="col-6 c-img-box1">
                    <img class="c-img1" src="../assets/c-img1.png" alt="">
                    <img class="c-img2" src="../assets/c-img2.png" alt="">
                </div>
                <div class="col-6 c-img-box2">
                    <img class="c-img3" src="../assets/c-img3.png" alt="">
                    <img class="c-img4" src="../assets/c-img4.png" alt="">
                </div>
                </div>
            </div>
            <div class="col-6 c-text-box">
                <p class="c-title">
                Create the next<br>event you want!
                </p>
                <p class="c-text">
                    Make your own ideas or <br> 
                    whatever you want an event on HiFor and enjoy it!
                </p>
                <button class="contact-btn" type="button">Post a event</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, computed, onMounted, nextTick } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import EventCard from './gathering/EventCard.vue'; // EventCard 컴포넌트 가져오기

export default {

  name: 'HomePage',
  components: {
    EventCard, // 컴포넌트 등록
  },
  setup() {
    // 로컬 상태 관리
    const events = ref([]); // 이벤트 데이터
    const hotEvents = ref([]); // 캐러셀 이벤트
    const store = useStore();
    // Carousel DOM 요소 참조
    const carousel = ref(null);

    // 스크롤 이동 함수
    const scrollCarousel = (direction) => {
      const scrollAmount = 300; // 한 번에 이동하는 픽셀
      if (carousel.value) {
        if (direction === 'prev') {
          carousel.value.scrollLeft -= scrollAmount;
        } else if (direction === 'next') {
          carousel.value.scrollLeft += scrollAmount;
        }
      }
    };
    // Vuex 상태 및 getter 사용
    const isLoggedIn = computed(() => store.getters.isLoggedIn);
    const token = computed(() => store.getters.token);
    // 상태 관리
    const currentPage = ref(1);
    const itemsPerPage = 6;
    const totalItems = computed(() => events.value.length);

    const categories = ref([
      { name: "All", displayName: "ALL", icon: require('@/assets/img/icon_All.png') },
      { name: "Social", displayName: "SOCIAL", icon: require('@/assets/img/icon_Social.png') },
      { name: "Food", displayName: "FOOD", icon: require('@/assets/img/icon_Food.png') },
      { name: "Games", displayName: "GAMES", icon: require('@/assets/img/icon_Games.png') },
      { name: "Growth", displayName: "GROWTH", icon: require('@/assets/img/icon_Growth.png') },
      { name: "Sports", displayName: "SPORTS", icon: require('@/assets/img/icon_Sports.png') },
      { name: "Trip", displayName: "TRIP", icon: require('@/assets/img/icon_Trip.png') },
      { name: "Artfasion", displayName: "ART/FASHION", icon: require('@/assets/img/icon_ArtFasion.png') },
      { name: "Others", displayName: "OTHERS", icon: require('@/assets/img/icon_Others.png') },
    ]);

    // 계산된 속성
    const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage)));
    const visibleEvents = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return events.value.slice(start, end); // 현재 페이지에 해당하는 이벤트만 반환
    });

    // 메서드
    const isCardVisible = (index) => {
      const start = (currentPage.value - 1) * itemsPerPage + 1;
      const end = start + itemsPerPage - 1;
      return index >= start && index <= end;
    };
    //검색
    const searchQuery = ref(''); // 제목 검색어
    const searchDate = ref(''); // 날짜
    const searchLocation = ref(''); // 위치
    const searchType = ref(''); // 모집 유형

    const mapEventData = (event) => ({
      id: event.id,
      mainImage: event.mainImage,
      title: event.name,
      date: event.date,
      location: event.location,
      category: event.category,
      type: event.type,
      participants: {
        current: event.participants ?? 0, // 현재 참가자 수
        max: event.maxParticipants, // 최대 참가자 수
      },
      likes: event.likes, // 좋아요 수
    });


    // 통합된 fetchEvents 함수
    const fetchEvents = async (type, params = {}) => {
      try {
        const response = await axios.get('http://localhost:3000/gathering', {
          params: { type, ...params }, // type을 쿼리 파라미터에 추가
        });
        return response.data.map(mapEventData); // 데이터 매핑 후 반환
      } catch (error) {
        console.error(`Failed to fetch events for type "${type}":`, error);
        return []; // 에러 시 빈 배열 반환
      }
    };

// 모든 이벤트 가져오기
    const fetchAllEvents = async () => {
      events.value = await fetchEvents('all');
    };

// 핫 이벤트 가져오기
    const fetchHotEvents = async () => {
      hotEvents.value = await fetchEvents('hot');
      console.log('Hot events:', hotEvents.value); // 값 확인
    };

// 검색 이벤트 가져오기
    const searchEvents = async () => {
      const params = {
        query: searchQuery.value || undefined,
        date: searchDate.value || undefined,
        location: searchLocation.value || undefined,
        type: searchType.value || undefined,
      };
      events.value = await fetchEvents('search', params);
    };

// 카테고리별 이벤트 가져오기
    const fetchEventsByCategory = async (category) => {
      events.value = await fetchEvents('category', { category });
    };


    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    onMounted(async () => {
      await fetchAllEvents(); // 모든 이벤트 가져오기
      // DOM 업데이트 완료 대기
      await nextTick();
      if (carousel.value) {
        console.log('Carousel initialized:', carousel.value);
      }
      await fetchHotEvents(); // 핫 이벤트
    });

    return {
      isLoggedIn,
      token,
      scrollCarousel,
      searchEvents,
      searchQuery,
      searchDate,
      searchLocation,
      searchType,
      categories,
      fetchEventsByCategory,
      isCardVisible,
      prevPage,
      nextPage,
      totalPages,
      currentPage,
      visibleEvents,
      hotEvents,
    };
  },
};
</script>



<!-- css -->
<style scoped>
    /* 반응형 모바일 css */
    @media screen and (max-width:768px){
        .Web{display: none;}
        .Mobile{display: block;}
    }
    /* 웹 */
    @media screen and (min-width:769px){


        .Web{display: block;}
        .Mobile{display: none;}
        /* 고정 */
        .title{
            font-size: 32px;
            font-weight: bold;
            color: #FFFFFF;
            text-align: left;
            padding: 0px 30px;
        }

        /* banner */
        .home-banner{
            background-image: url('@/assets/img/img_HomeBanner.png');
            background-size: cover;
            background-position: center;
            height: 900px;
        }
        .banner-title{
            font-size: 72px;
            font-weight: bold;
            color: #FFFFFF;
            padding: 75px 150px;
        }
        .search-box{
            max-width: 100%;
            height: fit-content;
            margin: 30px 150px;
            padding: 10px 15px;
            background-color: #FFFFFF69;
            border-radius: 15px;
            align-content: center;
            text-align: center;
        }
        .search-box button{
            background: none;
            border: none;
        }
        .search-box input{
            background:none;
            border: none;
            color: #FFFFFF;
            height: 42px;
            color-scheme: white;
            margin: 0px 5px;
            width: 10rem;
        }
        .search-box input[type='date']{
            color: #FFFFFF;
        }
        .search-box select{
            background:none;
            border: none;
            color: #FFFFFF;
            height: 42px;
            margin: 0px 5px;
            width: 10rem;
        }
        .search-text-box{
            width: 33rem !important;
        }
        /* category */
        .category-row{
            padding: 30px 150px;
            text-align: center;
        }
        .category-box{
            margin: 0px 20px;
            color: #FFFFFF;
            opacity: 0.7;
            transition: all 0.3s ease;
        }
        .category-box:hover{
            margin: 0px 20px;
            color: #FFFFFF;
            opacity: 1;
            border-bottom: 1px solid #FFFFFF;
            cursor: pointer;
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

      .eventcontainer-title{
        font-size: 36px;
        font-weight: bold;
        color: #0C1830;
        text-align: left;
        padding: 0px 30px;
      }
        

        /* Hot Events */
        .carousel-container {
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 100%;
            margin-top: -150px;
        }

        .carousel {
            display: flex;
            overflow-x: auto;
            scroll-behavior: smooth;
            gap: 16px;
            padding: 16px 0;
            width: 80%;
        }



        .carousel-btn {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            margin: 0 8px;
        }

        .carousel-btn:focus {
            outline: none;
        }

        /* all events */
        .events-container{
            padding: 75px 150px;
        }
        /* pagenation */
        .pagination {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
            gap: 10px;
        }

        .pagination button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #58C3FF;
            color: #fff;    
            cursor: pointer;
            border-radius: 24px;
            transition: all 0.3s ease;
        }

        .pagination button:hover {
            background: #5870FF;
        }

        .pagination button:disabled {
            background: #ccc;
        }

        /* how to works */
        .ex-con{
            height:800px;
            align-content:center;
            background-color: #F8F8FB;
            border-radius: 40px;
            padding: 0px 150px;
        }
        .ex-text1{
            text-align:center;
            color: #58C3FF;
            font-weight: 500;
        }
        .ex-title{
            text-align:center;
            font-size: 40px;
            font-weight: bold;
            margin-bottom: 30px;
        }
        .ex-icon3{
            margin-top:-10px;
            margin-left:-40px;
        }
        .ex-box{
            text-align:center;
            /* filter: grayscale(1); */
        }
        /* .ex-box:hover{
            text-align:center;
            filter: grayscale(0);
        } */
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
            margin-top: 30px;
            text-decoration-skip-ink: none;
        }
        .ex-text3{
            font-size: 16px;
            font-weight: 500;
            line-height: 28px;
            text-align: center;
            text-decoration-skip-ink: none;
        }
        /* why hifor */
        .why-con{
            padding: 75px 150px;
        }
        .why-box{
            align-self: center;
        }
        .why-box img{
            width: 100%;
        }
        .wc-text1{
            color: #58C3FF;
            font-weight: 500;
        }
        .wc-text2{
            font-weight: 300;
        }
        .wc-title{
            font-size: 40px;
            font-weight: bold;
        }
        .wc-btn{
            width: 180px;
            height: 60px;
            text-align: center;
            align-self: center;
            border-radius: 96px;
            border: none;
            color: #FFFFFF;
            background-color: #58C3FF;
            margin-top: 15px;
            transition: all 0.3s ease;
        }
        .wc-btn:hover{
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }

        /* 우리 가치 */
        .ov-con{
            padding: 30px 150px;
            margin: 30px 0px;
            background-color: #F8F8FB;
        }
        .value-card{
            margin: 15px;
            background-color: #FFFFFF;
            border-radius: 24px;
            padding: 40px;
            text-align: center;
        }
        .value-title{
            margin-top: 20px;
            font-size: 22px;
            font-weight: 400;
            color: #0C1830;
            margin-bottom: 8px;
        }
        .value-text{
            font-size: 16px;
            font-weight: 400;
            color: #46526A;
        }

        /* 사용자 리뷰 */
        .review-con{
            padding-left: 150px;
            padding-right: 150px;
            padding-top: 30px;
        }
        .review-row1{
            margin-left: -30px !important;
            margin-right: 30px !important;
        }
        .review-row2{
            margin-left: 30px !important;
            margin-right: -30px !important;
        }
        .rc-title{
            text-align: center;
            font-size: 40px;
            font-weight: bold;
        }
        .rc-text1{
            text-align: center;
            margin: 0px;
            color: #58C3FF;
        }
        .rc-text2{
            text-align: center;
            font-weight: 300;
        }
        .testimonials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 30px;
            margin: 40px 0;
        }

        .testimonial-card {
            background: #fff;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .testimonial-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 15px;
        }

        .testimonial-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
        }

        .testimonial-name {
            font-size: 16px;
            font-weight: bold;
        }

        .testimonial-location {
            font-size: 14px;
            color: #999;
        }

        .testimonial-icon {
            margin-left: auto;
            width: 20px;
            height: 20px;
        }

        .testimonial-text {
            font-size: 14px;
            color: #555;
        }

        .button-row {
            margin-top: 40px;
            display: flex;
            justify-content: center;
            gap: 20px;
        }

        .cta-button {
            padding: 12px 20px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .primary-button {
            width: 155px;
            height: 58px;
            border-radius: 100px;
            background-color: #58C3FF;
            color: white;
            border: none;
        }

        .secondary-button {
            width: 155px;
            height: 58px;
            background-color: #FFFFFF;
            border: 1.5px solid #58C3FF;
            border-radius: 100px;
            color: #58C3FF;
        }

        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
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
            margin-top: 90px;
        }
        .contact-box{
            background-color:#58C3FF;
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
            font-weight: 600;
            line-height: 64px;
        }
        .c-text{
            color: #f1f1f1;
            font-size: 16px;
            font-weight: 400;
            line-height: 28px;
        }
        .contact-btn{
            width: 155px;
            height: 58px;
            background-color: #58C3FF;
            border: 1.5px solid #FFFFFF;
            border-radius: 100px;
            color: #FFFFFF;
            margin-top: 40px;
            transition: all 0.3s ease;
        }
        .contact-btn:hover{
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
    }
</style>
