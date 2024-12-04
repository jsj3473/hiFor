<template>
    <!-- 배너 섹션 -->
    <div class="main-banner">
        <div class="banner-title">
            <p class="banner-title">HiFor Open  Party</p>
        </div>
    </div>
    <!-- Participants Count -->
    <div class="P-box">
        <p class="p-count-title">
            Participants <img class="p-icon" src="" alt="">
            <span class="p-count"><span>9</span> / <span>15</span></span>
        </p>

        <p class="p-icon-box">
            <img class="p-icon1" src="@/assets/c-img1.png" alt=""><img class="p-icon2" src="@/assets/c-img2.png" alt=""><img class="p-icon3" src="@/assets/c-img3.png" alt=""> +<span>6</span>
        </p>
    </div>
     
    <!-- Question -->
    <div class="Q-box">
        <div class="Q-title">
            Host's Question
        </div>
        <div class="host-box">
            <p class="host-name"><img class="host-icon" src="@/assets/images/ex7.jpeg" alt="">Min Kim</p>
        </div>
        <div class="Q-text-box">
            <p class="Q-text">What your name?</p>
        </div>
    </div>
    <!-- Line -->
    <div class="line"></div>
    <!-- Answer -->
    <div class="Answer-box">
        <div class="Answer-title">
            Ghest's Answer
        </div>
        <!-- 답변 -->
        <div class="ghest-box">
            <p class="host-name"><img class="host-icon" src="@/assets/images/ex7.jpeg" alt="">MinSoo Kim</p>
        </div>
        <div class="Q-text-box">
            <p class="Q-text">My name is MinSoo Kim. Nice to meet you!</p>
        </div>
        <div class="approve-box">
            <button class="accept-btn">Accept</button>
            <button class="reject-btn">Reject</button>
        </div>

        <div class="ghest-box">
            <p class="host-name"><img class="host-icon" src="@/assets/images/ex7.jpeg" alt="">MinSoo Kim</p>
        </div>
        <div class="Q-text-box">
            <p class="Q-text">
                My name is MinSoo Kim. Nice to meet you! <br>
                asdasdasdasdasdlaksjdvbasdlkjvbnsalkjvnaslkvjbnsadlkvjbsndalkvjbsadlkvjsadblvkjsdbavlkjsdabvlkjsadbvlksajvb lsakjvdb dslkjvb sdlakjvbsaldkvjbnsadlkvjbsaldkvjabs dlkvj sdlkvjsad lvkjsa dvlkasjd vlkasjv alskdj 
            </p>
        </div>
        <div class="approve-box">
            <button class="accept-btn">Accept</button>
            <button class="reject-btn">Reject</button>
        </div>
    </div>
    <!-- Next Button -->
    <div class="row">
        <div class="next-btn-box">
            <router-link class="next-btn" to="../JoinStep3">
                Completed
            </router-link>
        </div>
    </div>
    
</template>

<script></script>

<style scoped>
.row{
    justify-self: center;
}
/* 반응형 모바일 css */
@media screen and (max-width:768px){}

/* 웹 */
@media screen and (min-width:769px){
    .main-banner{
        background-image: url('@/assets/images/image1.png');
        background-size: cover;
        height: 360px;
        background-position: center;
        margin-bottom:60px;
        align-content: center;
    }
    .banner-title{
        font-size: 50px;
        font-weight: 700;
        line-height: 64px;
        text-align: center;
        color: #fff;
        text-shadow: 38px 38px 38px rgba(0, 0, 0, 0.5), 17px 5px 12px rgba(0, 0, 0, 0.5)
    }
    /* 참여현황 */
    .P-box{
        text-align: center;
    }
    .p-count-title{
        margin-top: 15px;
        font-size: 36px;
        font-weight: bold;
    }
    .p-count{
        margin-top: 15px;
        font-size: 44px;
        font-weight: bold;
        background-color: #37C00E;
        color: #fff;
        border: none;
        border-radius: 14px;
        width: 200px;
        justify-self: center;
    }
    .p-icon-box{
        font-size: 18px;
    }
    .p-icon1{
        width: 33px;
        height: 33px;
        border: none;
        border-radius: 100%;
    }
    .p-icon2{
        width: 33px;
        height: 33px;
        border: none;
        border-radius: 100%;
        margin-left: -15px;
    }
    .p-icon3{
        width: 33px;
        height: 33px;
        border: none;
        border-radius: 100%;
        margin-left: -15px;
    }
    /* QnA */
    .Q-box{
        justify-self: center;
        justify-items: start;
    }
    .Answer-box{
        justify-self: center;
        justify-items: start;
        margin-bottom: 66px;
    }
    .Q-title{
        margin-top: 90px;
        margin-left: 16px;
        font-size: 36px;
        font-weight: bold;
    }
    .Q-text-box{
        width: 900px;
    }
    .Q-text{
        word-wrap:break-word;
    }
    .host-box{
        position: relative;
        margin-top: 15px;
        margin-right: 15px;
        width: max-content;
        background-color: #96FFB9;
        padding-right: 16px;
        padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 100px;
        z-index: 10;
        justify-self: end;
    }
    .host-name{
        font-size: 18px;
        font-weight: 500;
        margin: 0px;
    }
    .host-icon{
        margin-right: 10px;
    }
    .line{
        justify-self: center;
    }
    .Answer-title{
        margin-top: 90px;
        margin-left: 16px;
        font-size: 36px;
        font-weight: bold;
        justify-self: end;
    }
    .ghest-box{
        position: relative;
        margin-top: 15px;
        margin-left: 15px;
        width: max-content;
        background-color: #96FFB9;
        padding-right: 16px;
        padding-left: 10px;
        padding-top: 8px;
        padding-bottom: 8px;
        border-radius: 100px;
        z-index: 10;
        justify-self: start;
    }
    /* approve button */
    .approve-box{
        width: 900px;
        margin-top: 15px;
        justify-self: center;
        text-align: right;
    }
    .accept-btn{
        overflow: hidden;
        width: 130px;
        height: 40px;
        padding: 5px 25px;
        border: 2px solid #37C00E;
        font-weight: 500;
        background: transparent;
        transition: all 0.3s ease;
        position: relative;
        display: inline-block;
        color: #37C00E;
        margin-right: 15px;
        border-radius: 12px;
    }
    .accept-btn:hover{
        background: #37C00E;
        color: #fff;
    }
    .accept-btn:before{
        position: absolute;
        content: '';
        display: inline-block;
        top: -180px;
        left: 0;
        width: 30px;
        height: 100%;
        background-color: #fff;
        animation: shiny-btn1 3s ease-in-out infinite;
    }
    .accept-btn:active{
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
                -4px -4px 6px 0 rgba(116, 125, 136, .2), 
        inset -4px -4px 6px 0 rgba(255,255,255,.2),
        inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    }
    .reject-btn {
        overflow: hidden;
        width: 130px;
        height: 40px;
        padding: 5px 25px;
        border: 2px solid #ec3737;
        font-weight: 500;
        background: transparent;
        transition: all 0.3s ease;
        position: relative;
        display: inline-block;
        color: #ec3737;
        margin-right: 15px;
        border-radius: 12px;
    }
    .reject-btn:hover {
        background: #ec3737;
        color: #fff;
    }
    .reject-btn:before {
        position: absolute;
        content: '';
        display: inline-block;
        top: -180px;
        left: 0;
        width: 30px;
        height: 100%;
        background-color: #fff;
        animation: shiny-btn1 3s ease-in-out infinite;
    }
    .reject-btn:active{
    box-shadow:  4px 4px 6px 0 rgba(255,255,255,.3),
                -4px -4px 6px 0 rgba(116, 125, 136, .2), 
        inset -4px -4px 6px 0 rgba(255,255,255,.2),
        inset 4px 4px 6px 0 rgba(0, 0, 0, .2);
    }
    /* Next button */
    .next-btn-box{
        text-align: center;
        padding-top: 66px;
        padding-bottom: 180px;
    }
    .next-btn{
        width: 240px;
        padding: 20px;
        padding-left: 100px;
        padding-right: 100px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        text-decoration: none;
        background-color: #37C00E;
        border: none;
        border-radius: 96px;
    }
}
</style>
  