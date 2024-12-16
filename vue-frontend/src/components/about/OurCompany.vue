<template>
    <div class="container intro-box">
        <div class="row">
            <div class="col-12 text-hifor-box">
                <p class="text-hifor">
                    <span class="text-h">H</span> 
                    <span class="text-i">i</span> 
                    <span class="text-f">F</span> 
                    <span class="text-o">o</span> 
                    <span class="text-r">r</span> 
                </p>
            </div>
            <div class="col-12 text-hifor-box text-hover-h">
                <p class="text-hifor">
                    <span class="text-h">H</span> 
                    <span class="text-hidden">elp</span> 
                </p>
            </div>
        </div>
    </div>
</template>

<script></script>

<style scoped>

/* 반응형 모바일 css */
@media screen and (max-width:768px){}

/* 웹 */
@media screen and (min-width:769px){
    .text-hifor-box{
        text-align: center;
        align-content: center;
        height: 650px;
    }
    .text-hifor{
        font-size: 180px;
        font-weight: 900;
        color: #12CF51;
    }
    .text-hidden{
        font-size: 100px;
        font-weight: bold;
    }
    .text-hover-h{
        display: none;
    }
    .text-h :hover .text-hover-h{
        display: block;
    }
}

</style>

<!-- 
H hi
I is
F 
O of
R 
-->