<!-- EventCard.vue -->
<template>
  <router-link :to="`/events/${event.id}`">
    <!-- 카드 1 -->
    <div class="event-card col-4">
      <div class="event-content">
        <div class="card">
          <div class="card-img">
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
                <img class="card-icon-heart" src="@/assets/img/icon_Heart.png" alt="" />
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

  .card-body .col-6{
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
    padding: 1rem;
    margin: 0px;
  }
</style>