<template>
    <div class="main" @touchmove.prevent="maskMove">
        <!--<img src="../../assets/images/logo.png" alt="" class="logo" />-->
        <img src="" alt="" class="logo" />

        <div class="task-card tips-card">
            <div class="tips-img"></div>
            <div class="task-item">
                <div class="task-main flex-item">
                    <div class="flex-item task-info">点击右上角<span>“···”</span>选择<span>“在浏览器打开”</span></div>
                </div>
            </div>
        </div>
<!--        <div class="task-card">-->
<!--            <div class="task-item">-->
<!--                <div class="task-head flex-item">-->
<!--                    <div class="tit-left">小贴士</div>-->
<!--                    <div class="flex-item">-->
<!--                        <img src="../../assets/images/win_01.png" alt="" />-->
<!--                        <img src="../../assets/images/win_02.png" alt="" />-->
<!--                        <img src="../../assets/images/win_03.png" alt="" />-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="task-main flex-item">-->
<!--                    <div class="flex-item task-info">-->
<!--                        <img src="../../assets/images/earth.png" alt="" />-->
<!--                        <div class="app-name nowrap">前往趣拉新世界</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="task-cont">-->
<!--                    <div class="task-desc">任务要求：成功在微信/QQ内访问趣拉新主页</div>-->
<!--                    <div class="task-desc">任务时长：1～3秒 </div>-->
<!--                    <div class="task-extra">额外福利：获得掘金基地大门的钥匙</div>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script>
    export default {
        name: 'error',
        data() {
            return {

            }
        },
        watch: {

        },
        computed: {

        },
        methods: {
            maskMove(e){
                e.preventDefault();
            }
        },
        mounted() {

        },
        created() {

        }
    }
</script>

<style lang="scss" scoped>
    .main {
        background: url(../../assets/images/bg.png);
        background-size: 100vw 100vh;
        min-height: 100vh;
        padding: 0 to(40);
        overflow: hidden;
        position: relative;
    }
    .logo{
        width: to(320);
        height: to(128);
        display: block;
        margin: to(240) auto to(174);
    }
    .login-card{
        background: #FFFFFF;
        border-radius: to(16);
        border: solid to(8) #333333;
        box-shadow: to(20) to(20) 0 #BBBBBB;
        margin-bottom: to(40);
        font-size: to(32);
        color: #333333;
        font-weight: bold;
        justify-content: center;
        height: to(112);
        transition: all .3s;
        text-align: center;
        width: 100%;
    }

    .login-card::placeholder{
        color: #333333;
    }

    .task-card.tips-card{
        position: relative;
        right: to(-10);
        bottom: to(-10);
        height: to(112);
        margin-top: 0;
        margin-left: 0;
        margin-bottom: to(60);
        box-shadow: none;
        font-size: to(32);
        background: #BBBBBB;
        .tips-img{
            background: url(../../assets/images/wechat-tip.png) no-repeat;
            background-size: 100% 100%;
            position: fixed;
            right: to(8);
            top: to(16);
            width: to(226);
            height: to(512);
        }
        .task-item{
            position: absolute;
            top: to(-18);
            left: to(-18);
            padding: 0;
            .task-main{
                background: #FFFFFF;
                margin: 0;
                padding: 0;
                color: #333333;
                font-weight: bold;
                justify-content: center;
                span{
                    color: #FF7C46;
                }
            }
        }
    }

    .task-card {
        background: #FF8455;
        border-radius: to(16);
        width: 100%;
        margin-bottom: to(60);
        margin-left: to(-10);
        margin-top: to(-10);
        box-shadow: to(20) to(20) 0 #FFD8CA;
        .task-item {
            width: 100%;
            border: solid to(8) #333333;
            border-radius: to(16);
            background: #FFFFFF;
            padding: to(14) to(32) to(24);
            z-index: 10;
            overflow: hidden;

            .task-head {
                justify-content: space-between;
                -webkit-justify-content: space-between;
                color: #FF8455;
                font-family: "HYZhuZiMeiXinTiW";
                font-size: to(26);
                img {
                    margin: 0 to(10);
                    width: to(24);
                    height: to(24);
                }
            }

            .task-main {
                justify-content: space-between;
                -webkit-justify-content: space-between;
                background: #FF8455;
                height: to(96);
                color: #FFFFFF;
                margin: to(10) to(-32) 0;
                padding: 0 to(32) 0 to(28);
                .task-info{
                    /*width: 60%;*/
                }
                img {
                    border: solid to(4) #333333;
                    border-radius: to(8);
                    width: to(60);
                    height: to(60);
                    margin-right: to(20);
                    background: #FF8455;
                }

                .app-name {
                    font-size: to(32);
                    font-weight: bold;
                }

                .app-reward {
                    font-size: to(26);
                    font-weight: bold;
                    span {
                        font-size: to(50);
                    }
                }
            }

            .task-cont {
                color: #333333;
                font-size: to(24);
                margin-top: to(22);
                .task-desc {
                    margin-bottom: to(18);
                    font-weight: bold;
                }

                .task-extra {
                    color: #FF8455;
                    text-decoration: underline;
                }
            }
        }
    }
</style>
