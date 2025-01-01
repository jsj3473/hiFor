<!-- EventCard.vue -->
<template>
    <router-link :to="`/events/${event.id}`">
      <div class="card">
        <img class="card-img" :src="event.image" alt="" />
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
              </p>
            </div>
          </div>
          <div class="row">
            <p class="card-host">
              <img class="host-icon" src="@/assets/ex.banner.jpeg" alt="" /> {{ event.host }}
            </p>
          </div>
        </div>
      </div>
    </router-link>
  </template>
  
  <script>
  export default {
    props: {
      event: {
        type: Object,
        required: true,
      },
    },
  };
  </script>

  <style scoped>
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
</style>