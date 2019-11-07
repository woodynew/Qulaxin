<template>
    <div class="main">
        <div class="tit-close flex-item" @click.stop="tapToBack">
            <img src="../assets/images/close_detail.png" alt="" />
        </div>
        <img src="../assets/images/logo.png" alt="" class="logo" />

        <input class="login-card login-input flex-item" type="tel" v-model.trim="phone" placeholder="请输入手机号" maxlength="13"/>

        <input class="login-card login-input flex-item" type="tel" v-model.trim="authCode" placeholder="请输入验证码" />
        <div class="get-code" :class="{'send-code' : phone}" @click.stop="getAuthCode" v-if="!sendAuthCode">获取验证码</div>
        <div class="get-code" :class="{'send-code' : phone}" v-else>{{authNum}}s 重试</div>


        <div class="login-card login-btn flex-item" :class="{'login-blue' : phone && authCode}" v-if="!isFocusin" @click.stop="tapToLogin">登录</div>
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {
                phone: "", //手机号
                authCode: "", //验证码
                authNum: 60, //倒计时
                sendAuthCode: false, //是否已发送验证码
                isFocusin: false,
                phoneFocus: false,
                authCodeFocus: false
            }
        },
        watch: {

        },
        computed: {

        },
        methods: {
            //获取验证码
            getAuthCode(){
                this.$api.post('ajax/send-auth-code', {
                    phone: this.phone
                }).then(res => {
                    this.sendAuthCode=true;
                    this.$toast("发送成功，请注意接收");
                    let timer=setInterval(()=>{
                        this.authNum--;
                        if(this.authNum<=0){
                            clearInterval(timer);
                            this.authNum = 60;
                            this.sendAuthCode=false;
                        }
                    },1000)
                });
            },

            // 跳过登录
            tapToBack(event){
                // if(localStorage.getItem('sessionId')){
                //     this.$router.push({name: 'home'});
                //     return false
                // }
                event.preventDefault();
                // this.$api.post('api/v1/user/autologin', {}).then( res => {
                //     localStorage.setItem('userInfo', JSON.stringify(res.user))
                //     localStorage.setItem('sessionId', res.session_id)
                this.$router.push({name: 'home'});
                // });
            },

            // 登录
            tapToLogin(){
                if(!this.phone){
                    this.$toast("请输入手机号");
                    this.phoneFocus = true
                    return;
                }
                if(!this.authCode){
                    this.$toast("请输入验证码");
                    this.authCodeFocus = true
                    return;
                }

                var data = JSON.parse(localStorage.getItem('url_params'))
                data['phone'] = this.phone;
                data['code'] = this.authCode;
                data['session_id'] = localStorage.getItem('sessionId') || "";//登录标识
                data['qlx_trackid'] = localStorage.getItem('trackId') || "";
                this.$api.post('api/v1/user/phonelogin', data).then( res => {
                    localStorage.setItem('oldSessionId', localStorage.getItem('sessionId'))
                    this.$toast("登录成功！");
                    localStorage.setItem('userInfo', JSON.stringify(res.user))
                    localStorage.setItem('sessionId', res.session_id)
                    this.$router.push({name: 'home'});
                });
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
        background: url(../assets/images/bg.png);
        background-size: 100vw 100vh;
        min-height: 100vh;
        padding: 0 to(40);
        overflow: hidden;
        position: relative;
        text-align: center;
    }
    .logo{
        width: to(320);
        height: to(128);
        display: block;
        margin: to(200) auto to(80);
    }

    .tit-close {
        position: absolute;
        justify-content: center;
        top: to(30);
        right: to(50);
        width: to(100);
        height: to(100);
        img{
            display: block;
            width: to(32);
            height: to(32);
        }
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
    .login-input:focus{
        color: #FFFFFF;
        background: #FF8455;
        box-shadow: to(20) to(20) 0 #FFD8CA;
    }
    .login-input:focus::placeholder{
        color: #FFFFFF;
    }

    .get-code{
        color: #999999;
        font-size: to(24);
        margin-top: to(44);
        text-align: center;
        text-decoration: underline;
        font-weight: bold;
        display: inline-block;
    }
    .send-code{
        color: #D45036;
    }

    /* 红色 */
    .login-card.login-red {
        color: #FFFFFF;
        background: #FF8455;
        box-shadow: to(20) to(20) 0 #FFD8CA;
    }

    /* 蓝色 */
    .login-card.login-blue {
        color: #FFFFFF;
        background: #2795F7;
        box-shadow: to(20) to(20) 0 #D3EAFF;
    }

    .login-btn{
        background: #999999;
        margin-top: to(316);
    }
</style>
