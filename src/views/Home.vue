<template>
    <div class="main"
         :style="isShowWithdraw ? 'overflow: hidden;height: 100vh;' : ''"
         ref="mainDraw"
         @touchstart="scrollTouchStart"
         @touchmove="touchmove"
         @touchend="refreshEnd">
        <div class="main-scroller-warp">
            <div class="page-head" id="fixedHeader" @touchend="scrollTouchEnd" :class="{'header-fixed' : isFixed}" :style="topFixedStyle">
                <div class="head-warp">
                    <div :style="fixedHeadStyle">
                        <div class="head-info flex-item">
                            <div class="head-left" @click.stop="showLogOut" v-if="userData.phone">
                                <div class="head-name">用户{{userData.name}}</div>
                                <div class="head-reward">{{isCashLog ? '提现记录' : '奖励金：' + userData.balance + '元'}}</div>
                            </div>
                            <div v-else @click.stop="toLogin">
                                <div class="head-name">用户{{userData.name}}</div>
                                <div class="head-reward">{{isCashLog ? '提现记录' : '立即登录'}}</div>
                            </div>
                            <div class="head-right" :style="downwarpShow" @click.stop="changeCashLog">{{!isCashLog ? '查看提现记录' : '返回提现大厅'}} <span>!</span></div>
                        </div>

                        <div class="scroll-downwarp" @touchmove="touchmove" @touchend="refreshEnd" :style="downwarpStyle" ref="scrollerDownwarp">
                            <div class="weui-pull-refreshing-box" style="position: absolute;top: 20vw;left: 50%;color: #ffffff" :style="fixedHeadStyle, cashStyle" v-if="isCashLog">
                                <div v-if="cashMoveState < 2">{{ cashMoveState === 0 ? '下拉即可刷新...' : '释放即可刷新...' }}</div>
                                <div v-else><i class="weui-loading"></i>加载中...</div>
                            </div>
                            <transition name="fade">
                                <div class="scroll-warp" v-if="!isCashLog">
                                    <div class="form-warp">
                                        <div class="form-label">提现的支付宝手机号</div>
                                        <input class="form-input" v-model="phone" type="tel" placeholder="请输入支付宝绑定的手机号码">
                                    </div>
                                    <div class="form-warp">
                                        <div class="form-label">验证码</div>
                                        <div class="flex-item">
                                            <input class="form-input" type="tel" v-model="authCode" placeholder="请输入收到的验证码">
                                            <div class="get-code" @click.stop="getAuthCode" v-if="!sendAuthCode">获取验证码</div>
                                            <div class="get-code" v-else>{{authNum}}s</div>
                                        </div>
                                    </div>
                                    <div class="form-warp">
                                        <div class="form-label">支付宝收款人姓名</div>
                                        <input class="form-input" v-model="ali_name" type="text" placeholder="请输入收款人姓名">
                                    </div>
                                    <div class="form-warp">
                                        <div class="form-label">提现的金额</div>
                                        <div class="cash-list">
                                            <div class="cash-item nowrap" :class="{'cash-active' : isCashActive == index}"
                                                 v-for="(item, index) in cashList" :key="index" @click.stop="tapCashItem(index)">{{item}}元</div>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                            <transition name="fade">
                                <div class="scroll-warp" ref="scrollWarp" v-if="isCashLog" :style="style">
                                    <div class="cash-log-item" v-for="(item, index) in cashLogList" :key="index">
                                        <div class="cash-log-top flex-item">
<!--                                            <div class="nowrap">{{item.remark}}</div>-->
                                            <div class="nowrap">{{item.money}}元 </div>
                                            <div class="cash-log-money nowrap"><span :class="item.status == 2 ? 'color-red' : (item.status == 0 ? 'color-gray' : '')">{{item.status_desc}}</span></div>
                                        </div>
                                        <div class="cash-log-bottom flex-item">
                                            <div class="nowrap">{{item.alipay_account}}</div>
                                            <div class="cash-log-time" :class="item.status == 2 ? 'color-red' : ''">{{item.status == 2 ? item.remark : item.dispose_time}}</div>
                                        </div>
                                    </div>
                                    <div class="loading-box" v-if="cashLoading">
                                        <div class="loading"></div>
                                        <span>加载中...</span>
                                    </div>
                                    <div class="loading-box" style="color: #ffffff" v-if="!cashLoading&&!isCashData">-- END --</div>

                                </div>
                            </transition>

                            <div class="btn-warp flex-item" v-if="!isCashLog" :style="isShowWithdraw ? 'paddingTop: 2vh;' : ''">
                                <div class="page-btn btn-yellow tap-ripple" @click.stop="hideWithdrawWarp" v-if="isShowWithdraw">返回大厅</div>
                                <div class="page-btn tap-ripple" @click.stop="tapWithdraw" v-if="isShowWithdraw">确认提现</div>
                            </div>
                        </div>
                        <div class="btn-warp flex-item" v-if="!isCashLog" :style="isShowWithdraw ? 'paddingTop: 2vh;' : ''">
<!--                            <div class="page-btn btn-yellow tap-ripple" @click.stop="hideWithdrawWarp" v-if="isShowWithdraw">返回大厅</div>-->
                            <div class="btn-placeholder" v-if="!isShowWithdraw"></div>
                            <div class="page-btn tap-ripple" @click.stop="showWithdrawWarp" v-if="!isShowWithdraw">点我提现</div>
<!--                            <div class="page-btn tap-ripple" @click.stop="tapWithdraw" v-if="isShowWithdraw">确认提现</div>-->
                        </div>
                    </div>
                </div>
            </div>

            <div class="weui-pull-refreshing-box" :style="fixedHeadStyle, style">
                <div v-if="moveState < 2">{{moveState === 0 ? '下拉即可刷新...' : '释放即可刷新...'}}</div>
                <div v-else><i class="weui-loading"></i>加载中...</div>
            </div>
            <transition name="fade">
                <div class="task-hall" :style="isFixed ? 'paddingTop: 2.93333rem;' + style : style" v-if="!showCompletedList">
                    <div class="task-warp task-ongoing" v-if="ongoingList.length > 0">
                        <div class="warp-head flex-item">
                            <div class="warp-tit" :style="warpTitSmall">进行中的任务</div>
                            <div class="task-completed" @click.stop="viewCompletedList(true)">查看完成的任务<span>！</span>
                            </div>
                        </div>
                        <div class="task-list">
                            <div class="task-card" :style="{background: item.second_color}" :data-type="activeSwiper == index ? 1 : 0" v-for="(item, index) in ongoingList" :key="index">
                                <div class="task-item" :style="{background: item.main_color}" :data-id="item.id" :data-color="item.main_color" @touchstart.capture="touchstart" @touchmove.capture="touchmove" @touchend.capture="touchEnd">
                                    <div class="task-main flex-item" :style="{background: item.main_color}">
                                        <div class="flex-item task-info">
                                            <img :src="item.logo" alt="" />
                                            <div class="app-name nowrap">{{item.title}}</div>
                                        </div>
                                        <div class="app-reward"  v-if="item.price > 0">奖励金<span>{{item.price}}</span>元</div>
                                    </div>
                                </div>
                                <div class="task-quit flex-item" @click="deleteItem(index)" v-if="isShowAbandon"><img
                                        src="../assets/images/quit.png" alt=""/>放弃
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="task-warp">
                        <div class="warp-head flex-item">
                            <div class="warp-tit" :style="warpTitSmall">任务大厅</div>
                            <div class="task-completed" @click.stop="viewCompletedList(true)" v-if="completedList.length > 0 && ongoingList.length == 0">查看完成的任务<span>！</span></div>
                            <img src="../assets/images/logo_m.png" alt="" class="warp-logo" v-else/>
                        </div>
                        <div class="task-list">
                            <div class="task-card" :style="{boxShadow: '0.26667rem 0.26667rem 0' + item.second_color}" v-for="(item, index) in taskList" :key="index" @click.stop="tapToGrabTask(item.id)">
                                <div class="task-item">
                                    <div class="task-head flex-item" :style="{color: item.main_color}">
                                        <div class="tit-left">可接任务</div>

                                        <div class="flex-item">
                                            <div class="flex-item" v-if="item.surplus < 200">剩余<span class="item-surplus">{{item.surplus}}</span>份</div>
                                            <div class="task-icon" @click.stop="showIconTipsPopup(label)" v-for="(label, lindex) in item.label_list" :key="lindex" v-if="label">
                                                <div class="btn-icon" :class="label == 2 ? 'btn-green' : label == 3 ? 'btn-red' : ''">
                                                    <img :src="iconTipsImgList[label - 1]" alt="" />
                                                </div>
                                                <div class="btn-title">{{iconTipsList[label]}}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="task-main flex-item" :style="{background: item.main_color}">
                                        <div class="flex-item task-info">
                                            <img :src="item.logo" alt="" />
                                            <div class="app-name nowrap">{{item.title}}</div>
                                        </div>
                                        <div class="app-reward" v-if="item.price > 0">奖励金<span>{{item.price}}</span>元</div>
                                    </div>
                                    <div class="task-cont">
                                        <div class="task-desc">任务要求：{{item.child_list.length > 0 ? item.child_list[0].title : ''}}</div>
                                        <div class="task-desc">任务时长：{{item.duration}}</div>
                                        <div class="task-extra" v-if="item.wb_desc[0]">额外福利：{{item.wb_desc[0]}}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <transition name="fade">
                <div class="completed-warp" :style="isFixed ? 'padding-top: 2.93333rem' + style : style" v-if="showCompletedList">
                    <div class="task-warp task-complete">
                        <div class="warp-head flex-item">
                            <div class="warp-tit" :style="warpTitSmall">完成的任务</div>
                            <div class="task-completed" @click="viewCompletedList(false)">返回任务大厅<span>！</span></div>
                        </div>
                        <div class="task-list">
                            <div class="task-card" :style="{boxShadow: '0.26667rem 0.26667rem 0' + item.second_color}" :data-type="activeSwiper == index ? 1 : 0" v-for="(item, index) in completedList" :key="index">
                                <div class="task-item">
                                    <div class="task-main flex-item" :style="{background: item.main_color}">
                                        <div class="flex-item task-info">
                                            <img :src="item.logo" alt="">
                                            <div class="app-name">{{item.title}}</div>
                                        </div>
                                    </div>

                                    <div class="task-cont">
                                        <div class="cont-item" :class="{'undone': childItem.user_record_status == -1}" v-for="(childItem, index) in item.child_list">
                                            <div class="cont-head flex-item">
                                                <div class="task-desc">任务{{index + 1}}：{{childItem.title}}</div>
                                                <div class="task-reward" :style="childItem.user_record_status != -1 ? 'color: ' + item.main_color : ''" v-if="childItem.price > 0">{{childItem.user_record_status == 1 ? "已到账" : (childItem.user_record_status == 0 ? "在路上" : "")}}{{childItem.price}}元{{childItem.user_record_status == -1 ? "奖励金" : ""}}</div>
                                            </div>
                                            <div class="cont-time">{{childItem.jftask_record ? childItem.jftask_record.submit_time : "未完成此任务"}}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </transition>
            <div v-if="(taskList.length == 0 && !showCompletedList) || (completedList.length == 0 && showCompletedList)" style="height: 70vh"></div>
        </div>

        <div class="loading-box" v-if="loading">
            <div class="loading"></div>
            <span>加载中...</span>
        </div>
<!--        <div class="nomore">&#45;&#45; END &#45;&#45;</div>-->

        <div class="loading-warp" v-if="!loading&&!isData">
            <img class="loading-logo" src="../assets/images/logo.png" alt=""/>
        </div>

        <div class="mask" @touchmove.prevent="maskMove" v-if="isShowPopup || iconTipsPopup" @click.stop="isShowPopup = false; iconTipsPopup = false"></div>
        <div class="task-popup" @touchmove.prevent="maskMove" v-if="isShowPopup || iconTipsPopup">
            <div class="task-box">
                <div class="tit-head flex-item">
                    <div class="task-title-small" v-if="isEmptyTask && !iconTipsPopup">哦..糟了</div>
                    <div class="task-title-small" v-else-if="iconTipsPopup">{{iconTipsTitle}}</div>
                    <div class="task-title-small" v-else>切换账号</div>
                    <div class="tit-close flex-item" @click.stop="hideLogOut">
                        <img src="../assets/images/close_detail.png" alt=""/>
                    </div>
                </div>
                <template v-if="isEmptyTask && !iconTipsPopup">
                    <div class="task-title" style="text-align: left">任务没了?@!</div>
                    <div class="other-title" style="text-align: left">没关系，我们为您推荐以下任务</div>
                    <div class="other-task">
                        <div class="other-item flex-item" v-for="(item, index) in recommendTaskList" :key="index" :style="{background: item.main_color}">
                            <img :src="item.logo" alt="" />
                            <div class="app-name">{{item.title}}</div>
                        </div>
                    </div>
                </template>
                <div v-else-if="iconTipsPopup" class="start-task">
                    <div class="tips-text">{{iconTipsContent}}</div>
                    <div class="logout-btn" @click.stop="iconTipsPopup = false">我知道了</div>
                </div>
                <template v-else>
                    <div class="task-title">{{userData.name}}</div>
                    <div class="other-title" style="text-align: center">当前账号</div>
                    <div class="logout-btn" @click.stop="tapToLogout">退出登录</div>
                </template>
            </div>
        </div>

    </div>
</template>

<script>
    export default {
        name: 'home',
        computed: {
            style () {
                return {
                    transition: `translate3d ${this.duration}ms`,
                    transform: `translate3d(0,${this.moveDistance}px, 0)`
                }
            },
            cashStyle () {
                return {
                    transition: `translate3d ${this.duration}ms`,
                    transform: `translate3d(-50%,${this.moveDistance}px, 0)`
                }
            }
        },
        data() {
            return {
                num: 1,//上拉的计数器
                loading:false, //加载图标
                isData:true ,//判断是否有上拉的数据
                moveDistance: 0,    //保存向下滑动的距离
                moveState: 0,        //开始滑动到结束后状态的变化 0:下拉即可刷新 1:释放即可刷新 2:加载中
                duration: 0,        //动画持续时间，0就是没有动画

                // 提现记录
                cashNum: 1,//上拉的计数器
                cashMoveState: 0,
                cashLoading: false,
                isCashData: true,

                userData: {},
                // 任务大厅
                taskList: [],
                // 进行中的任务
                ongoingList: [],
                // 推荐任务列表
                recommendTaskList: [],
                // 已完成任务列表
                completedList: [],
                // 提现记录
                cashLogList: [],
                cashList: [],
                showCompletedList: false, //是否显示已完成的任务
                downwarpStyle: '',
                downwarpShow: 'opacity: 0;',
                isEmptyTask: true, //是否显示没抢到任务提示 为false则显示退出登录
                isShowAbandon: true, //是否显示放弃
                isShowWithdraw: false,
                isShowPopup: false, //是否显示任务弹层
                iconTipsPopup: false, // 是否显示提示
                iconTipsTitle: '', // 提示标题
                iconTipsContent: '', // 提示内容
                iconTipsList: [],
                iconTipsImgList: [
                    require('../assets/images/icon1.png'),
                    require('../assets/images/icon2.png'),
                    require('../assets/images/icon3.png')
                ],
                iconTipsContentList: [],
                isCashActive: 0, //当前选中的提现金额
                activeSwiper: -1, //当前活动的滑块
                authNum: 60, //倒计时
                sendAuthCode: false, //是否已发送验证码
                authCode: "", //验证码
                phone: "", //支付宝收款人姓名
                ali_name: "", //支付宝收款人姓名
                isCashLog: false, //是否显示提现记录
                isFixed: false,
                fixedHeadStyle: '',
                warpTitSmall: '',

                overTimer: null, // 超时定时器
                startTime: 0,// 刚触碰到屏幕的时间信息
                startX: 0, // 刚触碰到屏幕的时的手指信息
                currentX: null,
                distance: null,
                deceleration: 0.0006,
                minValue: 0,
                maxValue: 124,
                resetX: null,
                currentTime: null,
                lastX: 0,
                lastTime: 0,

                topFixedStyle: '',
                oldScrollTop: 0,
            }
        },
        watch: {
            //这里是给用户操作返回的核心
            moveState (state) {
                //我们监听moveState的状态，
                //0意味着开始也意味着结束，这里是结束，并且只有动画生效我们才能 moveDistance 设为0，
                //为什么动画生效才行，因为动画生效意味着手指离开了屏幕，如果不懂去看touchEnd方法，这时
                //我们让距离变为0才会有动画效果。
                if (state === 0 && this.duration === 300) this.moveDistance = 0
            },

            cashMoveState (state) {
                if (state === 0 && this.duration === 300) this.moveDistance = 0
            }
        },
        methods: {
            // 隐藏退出登录
            hideLogOut(){
                this.isEmptyTask = true;
                this.isShowPopup = false;
                this.iconTipsPopup = false;
            },
            // 显示退出登录
            showLogOut(){
                this.isEmptyTask = false;
                this.isShowPopup = true;
            },
            showShareTask(taskList){
                //判断是否链接分享单品任务
                if(this.GetUrlParam("qlx_trackid") && this.GetUrlParam("task")){
                    var trackId = this.GetUrlParam("qlx_trackid");
                    var taskno = this.GetUrlParam("task");
                    var trackData = trackId.split('_');

                    if(trackData.length > 0 && trackData[0] == 'onepro' && taskno != ''){
                        var usetask;
                        for(var tindex in taskList){
                            if(usetask)
                                break;

                            var task = taskList[tindex];
                            if(task.code == taskno){
                                usetask = task;
                                break;
                            }else{
                                for(var subindex in task.child_list){
                                    var subTask = task.child_list[subindex];
                                    if(subTask.code == taskno) {
                                        usetask = task;
                                        break;
                                    }
                                }
                            }
                        }

                        if(usetask){
                            if(!localStorage.getItem('back_home') || localStorage.getItem('back_home') != '1'){
                                var underway = 0;
                                for(var subindex in usetask.child_list){
                                    var subTask = usetask.child_list[subindex];
                                    if(subTask.user_record_status != -1){
                                        underway = 1;
                                        break;
                                    }
                                }
                                if(usetask.user_record_status == -1 || underway == 0){
                                    this.tapToGrabTask(usetask.id);
                                }else{
                                    this.$store.commit('LoadingStatus', {isLoading: true, loadingMsg: "加载中..."})
                                    this.$router.push({name: 'task', params: {id: usetask.id}});
                                }
                            }else
                                localStorage.removeItem('back_home')
                        }
                    }
                }
            },
            // 抢任务
            tapToGrabTask(id){
                this.$store.commit('LoadingStatus', {isLoading: true, loadingMsg: "加载中..."})
                // 获取任务剩余数量
                this.$api.post('api/v1/jftask/surplus', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    task_id: id
                }).then( numRes => {
                    if(numRes === 0){
                        // 获取推荐任务
                        this.$api.post('api/v1/jftask/recommend', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                        }).then( res => {
                            this.$store.commit('LoadingStatus', {isLoading: false});
                            for(let i in res.dataList){
                                let colorList = res.dataList[i].color.split(",");
                                res.dataList[i].main_color = colorList[0];
                                res.dataList[i].second_color = colorList[1];
                            }
                            this.recommendTaskList = res.dataList;
                        });
                    }else{
                        this.$api.post('api/v1/jftask/take', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                            task_id: id
                        }).then( takeRes => {
                            this.$store.commit('LoadingStatus', {isLoading: false});
                            this.$router.push({name: 'task', params: {id: id}})
                        })
                    }
                })
            },
            // 退出登录
            tapToLogout(){
                this.$api.get('api/v1/user/logout', {}).then( res => {
                    localStorage.removeItem("userInfo");
                    localStorage.removeItem("sessionId");
                    if(localStorage.getItem('oldSessionId') && !localStorage.getItem('sessionId')){
                        localStorage.setItem('sessionId', localStorage.getItem('oldSessionId'));
                        // 获取用户信息
                        this.$api.post('api/v1/user/info', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                        }).then( res => {
                            localStorage.setItem('userInfo', JSON.stringify(res));
                            this.userData = res;
                            this.hideLogOut();
                            this.$router.go(0);
                        });
                    }else{
                        this.$router.push({name: 'login'});
                    }
                });
            },
            // 游客去登录
            toLogin(){
                this.$router.push({name: 'login'});
            },
            //判断页面滚动距离
            handleScroll(){
                this.$store.commit('LoadingStatus', {isLoading: false});
                // 得到页面滚动的距离
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                let scroll = scrollTop - this.oldScrollTop;
                this.oldScrollTop = scrollTop;
                // 判断页面滚动的距离是否大于吸顶元素的位置
                this.isFixed = scrollTop > 75;
                if(scrollTop < 75){
                    this.fixedHeadStyle = 'opacity: ' + (1 - scrollTop / 75) + ';transition: all .3s ease-out;';
                    // 缩放的比例 = 2 - 滚动条的位置除最大滚动吸顶的值
                    let doubleScale =  (2 - scrollTop / 75) > 2 ? 2 : (2 - scrollTop / 75),
                        titleScale = doubleScale / 75;
                    this.warpTitSmall = 'font-size: ' + (24 * titleScale) + 'rem;transition: all .3s ease-out;'
                    // this.topFixedStyle = "top: 0;transition: all .3s ease-out;"
                }else{
                    this.fixedHeadStyle = 'opacity: 0;transition: all .3s ease-out;';
                    // this.topFixedStyle = "top: -75px;transition: all .3s ease-out;"
                }

                //吸顶后的样式
                if(scrollTop > (75 + this.offsetHeight)){
                    // 判断页面的滚动方向
                    if(scroll < 0){ //上
                        this.topFixedStyle = "top: 0;transition: all .3s ease-out;";
                        this.fixedHeadStyle = 'opacity: 1;transition: all .3s ease-out;';
                    }else{ //下
                        this.topFixedStyle = "top: -75px;transition: all .3s ease-out;"
                    }
                }else{
                    this.topFixedStyle = this.isFixed ? "top: -75px;transition: all .3s ease-out;" : ""
                }

                //判断是否到底部
                //可滚动容器的高度
                let innerHeight = document.querySelector('#app').clientHeight;
                //屏幕尺寸高度
                let outerHeight = document.documentElement.clientHeight;

                //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + scrollTop)的情况，严格来讲，是接近底部。
                if (innerHeight < (outerHeight + scrollTop + 80)) {
                    if(this.isData && !this.loading){
                        this.loading = true;
                        // 获取任务大厅的任务列表
                        this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                            session_id: localStorage.getItem('sessionId'), //登录标识
                            qlx_trackid: localStorage.getItem('trackId') || "", //渠道id
                            page: ++this.num, //当前页数
                            page_size: 10, //每页数量
                            status: -1 //用户任务状态
                        })).then( res => {
                            if(res.dataList.length > 0){
                                this.loading = false;
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1]
                                    res.dataList[i].label_list = res.dataList[i].rights_label
                                }
                                this.taskList = this.taskList.concat(res.dataList)
                            } else{
                                this.loading=false;
                                this.isData=false;
                            }
                        });
                    }
                }
            },
            //判断提现记录滚动距离
            cashHandleScroll(){
                //判断是否到底部
                //可滚动容器的高度
                let innerHeight = this.$refs.scrollWarp.clientHeight;
                //屏幕尺寸高度
                let outerHeight = this.$refs.scrollerDownwarp.clientHeight;
                //可滚动容器超出当前窗口显示范围的高度
                let docScrollTop = this.$refs.scrollerDownwarp.scrollTop;
                //scrollTop在页面为滚动时为0，开始滚动后，慢慢增加，滚动到页面底部时，出现innerHeight < (outerHeight + docScrollTop)的情况，严格来讲，是接近底部。
                if (innerHeight < (outerHeight + docScrollTop - 5)) {
                    if(this.isCashData && !this.cashLoading){
                        this.cashLoading = true;
                        // 获取任务大厅的任务列表
                        this.$api.post('api/v1/user/withdraw-list', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                            page: ++this.cashNum, //当前页数
                            page_size: 10, //每页数量
                        }).then( res => {
                            if(res.dataList.length > 0){
                                this.cashLoading = false;
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1];
                                }
                                this.cashLogList = this.cashLogList.concat(res.dataList)
                            } else{
                                this.cashLoading = false;
                                this.isCashData = false;
                            }
                        });
                    }
                }
            },
            //提现列表
            changeCashLog(){
                if(this.isCashLog){
                    this.$refs.scrollerDownwarp.removeEventListener('scroll', this.cashHandleScroll);
                    this.isCashLog = false;
                    this.downwarpStyle = 'opacity: 1;height: '+ (100 - (document.body.clientHeight / (document.querySelector('.head-info').clientHeight + 100))) +'vh;transition: translate3d .45s ease-out;';
                    this.cashNum = 1;
                }else{
                    this.cashNum = 1;
                    this.$api.post('api/v1/user/withdraw-list', {
                        session_id: localStorage.getItem('sessionId'), //登录标识
                        page: 1,
                        page_size: 10
                    }).then( res => {
                        this.cashLogList = res.dataList;
                        this.cashLoading = false;
                        this.isCashData = true;
                        this.isCashLog = true;
                        this.downwarpStyle = 'opacity: 1;height: '+ (100 - (document.body.clientHeight / (document.querySelector('.head-info').clientHeight + 100))) +'vh;transition: translate3d .45s ease-out;';

                        // 移除页面滚动的监听handleScroll
                        window.removeEventListener('scroll', this.handleScroll);
                    })
                }
            },
            //获取验证码
            getAuthCode(){
                let reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
                if(!reg.test(this.phone)){
                    this.$toast("手机号码格式不正确");
                    return;
                }
                this.$api.post('ajax/send-auth-code', {
                    phone: this.phone
                }).then( res => {
                    this.sendAuthCode=true;
                    this.$toast("发送成功，请注意接收");
                    let timer=setInterval(()=>{
                        this.authNum--;
                        if(this.authNum<=0){
                            clearInterval(timer);
                            this.sendAuthCode=false;
                        }
                    },1000)
                })
            },
            // 防止蒙版穿透
            maskMove(){
                return false
            },
            // 显示提示
            showIconTipsPopup(type){
                this.iconTipsTitle = this.iconTipsList[type]
                this.iconTipsContent = this.iconTipsContentList[type]
                this.iconTipsPopup = true
            },
            // 返回大厅
            hideWithdrawWarp() {
                this.isCashLog = false;
                this.isShowWithdraw = false;
                this.downwarpStyle = 'opacity: 0;height: 0;transition: all .4s ease-out;';
                this.downwarpShow = 'opacity: 0;transition: opacity .4s ease-out;';
                // handleScroll为页面滚动的监听回调
                window.addEventListener('scroll', this.handleScroll);
            },
            // 点击提现
            showWithdrawWarp() {
                this.isShowWithdraw = true;
                this.downwarpStyle = 'opacity: 1;height: '+ (100 - (document.body.clientHeight /  (document.querySelector('.head-info').clientHeight + 100))) +'vh;transition: all .45s ease-out;';
                this.downwarpShow = 'opacity: 1;transition: opacity .3s ease-out;';
                this.fixedHeadStyle = 'opacity: 1;transition: all .3s ease-out;';
                // 移除页面滚动的监听handleScroll
                window.removeEventListener('scroll', this.handleScroll);
            },
            // 立即提现
            tapWithdraw() {
                this.$api.post('api/v1/user/withdraw', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    phone: this.phone,
                    code: this.authCode,
                    ali_name: this.ali_name,
                    money: this.cashList[this.isCashActive]
                }).then( res => {
                    this.$toast.center(res || "提现申请已提交，请耐心等待");
                    this.phone = "";
                    this.authCode = "";
                    this.ali_name = "";
                    this.isCashActive = 0;

                    // 获取用户信息
                    this.$api.post('api/v1/user/info', {
                        session_id: localStorage.getItem('sessionId'), //登录标识
                    }).then( res => {
                        this.userData = res
                    });
                });
            },
            // 选择提现金额
            tapCashItem(index) {
                this.isCashActive = index
            },
            // 切换已完成的任务
            viewCompletedList(isShow) {
                // 获取任务列表
                this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    page: 1, //当前页数
                    status: 1 //用户任务状态
                })).then( res => {
                    this.showCompletedList = isShow;
                    for(let i in res.dataList){
                        let colorList = res.dataList[i].color.split(",");
                        res.dataList[i].main_color = colorList[0];
                        res.dataList[i].second_color = colorList[1]
                    }
                    this.completedList = res.dataList

                    if(this.completedList.length > 0){
                        // handleScroll为页面滚动的监听回调
                        window.addEventListener('scroll', this.handleScroll);
                    }else{
                        // 移除页面滚动的监听handleScroll
                        window.removeEventListener('scroll', this.handleScroll);
                    }

                    if(isShow) window.addEventListener('scroll', this.handleScroll);
                });
            },
            // 获取dom节点的Translate的值
            getTranslate(dom){
                let transformString = dom.style.transform;
                if (transformString) {
                    return this.getPxValue(transformString);
                } else {
                    return 0;
                }
            },
            // 获取100rem中100的值
            getPxValue(str){
                return Number(String(str).match(/\(([^)]*)\)/)[1].split(",")[0].replace("rem",""));
            },
            // 滑动开始
            touchstart(e) {
                // e.preventDefault()
                // 当前滑动的元素
                let thatElement = e.currentTarget;
                if(thatElement.dataset.type != 1){
                    this.restSlide();
                }
                //记录X轴的位置
                this.resetX = this.startX = e.touches.item(0).pageX;
                /*每次移动开始时设置初始的oldX的值*/
                this.oldX = this.getTranslate(thatElement) * 75;

                this.lastTime = this.startTime = new Date().getTime();
                this.distance = 0;
                // 初始化样式
                // this.$refs.mainDraw.style = ""
            },
            // 滑动过程
            touchmove(e) {
                // 当前滑动的元素
                let thatElement = e.currentTarget;
                this.currentY = e.touches.item(0).pageY;
                this.currentX = e.touches.item(0).pageX;
                let X = this.currentX - this.startX,
                    Y = this.currentY - this.startY;
                this.currentTime = new Date().getTime();
                // 判断是否上滑
                this.touchmoveY = Math.abs(Y) > Math.abs(X) && Y < 0;
                if((Math.abs(Y) > Math.abs(X) && Y > 0 || Math.abs(Y) > Math.abs(X) && Y < 0) && this.isCashLog){
                    let downwarpTop = this.$refs.scrollerDownwarp.scrollTop;

                    //首先判断我们有没有滚动条，如果有，我们下拉刷新就不能启用。
                    if (downwarpTop > 0 || !this.isCashLog) return;

                    let moveDownwarp = e.targetTouches[0].clientY - this.startY;
                    //判断手指滑动的距离，只有为正数才代表用户下拉了。
                    if (moveDownwarp > 0) {
                        //阻止默认事件。
                        e.preventDefault();
                        //增加滑动阻力的感觉
                        this.moveDistance = Math.pow(moveDownwarp, 0.8);
                        if (this.moveDistance > 50) {
                            //如果滑动距离大于50 那我就告诉你，释放即可刷新
                            if (this.cashMoveState === 1) return;
                            this.cashMoveState = 1
                        } else {
                            //否则 恢复原样
                            if (this.cashMoveState === 0) return;
                            this.cashMoveState = 0
                        }
                    }
                // 判断是否上下滑动
                } else if(Math.abs(Y) > Math.abs(X) && Y > 0 || Math.abs(Y) > Math.abs(X) && Y < 0){
                    this.restSlide();
                    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;

                    //首先判断我们有没有滚动条，如果有，我们下拉刷新就不能启用。
                    if (scrollTop > 0 || this.isShowWithdraw) return;

                    let move = e.targetTouches[0].clientY - this.startY;
                    //判断手指滑动的距离，只有为正数才代表用户下拉了。
                    if (move > 0) {
                        //阻止默认事件。
                        e.preventDefault();
                        //增加滑动阻力的感觉
                        this.moveDistance = Math.pow(move, 0.8);
                        if (this.moveDistance > 50) {
                            //如果滑动距离大于50 那我就告诉你，释放即可刷新
                            if (this.moveState === 1) return;
                            this.moveState = 1
                        } else {
                            //否则 恢复原样
                            if (this.moveState === 0) return;
                            this.moveState = 0
                        }
                    }
                }else{
                    if(thatElement.className == "task-item" && this.isShowAbandon){
                        // 左右滑动时禁用页面滚动条
                        // e.preventDefault();
                        // 二次及以上次数滚动（间歇性滚动）时间和路程重置计算，0.05是间歇性滚动的停顿位移和时间比
                        if (Math.abs(this.currentX - this.lastX) / Math.abs(this.currentTime - this.lastTime) < 0.05) {
                            this.startTime = new Date().getTime();
                            this.resetX = this.currentX;
                        }

                        this.distance = this.currentX - this.startX;
                        let temDis = this.distance + this.oldX;
                        /*设置移动最小值*/
                        temDis = temDis > this.minValue ? temDis * 1 / 3 : temDis;
                        /*设置移动最大值*/
                        temDis = temDis < -this.maxValue ? -this.maxValue + (temDis + this.maxValue) / 3 : temDis;

                        //向左滑动
                        if(temDis < 0){
                            thatElement.dataset.type = '1';
                            thatElement.style = "transform: translate3d(" + temDis / 75 + "rem, 0, 0);background:"+thatElement.dataset.color
                        }else{  //向右滑动
                            if(temDis < 0){
                                thatElement.dataset.type = '0';
                                thatElement.style = "transform: translate3d(" + temDis / 75 + "rem, 0, 0);background:"+thatElement.dataset.color
                            }
                        }
                        this.lastX = this.currentX;
                        this.lastTime = this.currentTime;
                    }
                }
            },
            // 滑动结束
            touchEnd(e) {
                // 当前滑动的元素
                let thatElement = e.currentTarget;
                /*计算缓动值*/
                let duration = new Date().getTime() - this.startTime;
                // 记录结束位置
                this.endX = e.changedTouches[0].clientX;
                if(this.startX !== this.endX && Math.abs(this.endX - this.startX) > 10){
                    e.preventDefault()
                    let temDis = this.distance + this.oldX;
                    let speed = 0, //速度
                        destination;
                    // 300毫秒是判断间隔的最佳时间
                    let resetDistance = this.currentX - this.resetX;
                    if (duration < 300 && Math.abs(resetDistance) > 10) {
                        speed = Math.abs(resetDistance) / duration;

                        // 初速度为0 距离等于速度的平方除以2倍加速度
                        destination = (speed * speed) / (2 * this.deceleration) * (resetDistance < 0 ? -1 : 1);
                        temDis += destination;
                    }

                    // 计算最终滑动的值
                    this.currentX = temDis + duration/1000 * e.changedTouches.item(0).pageX;
                    /*设置最大值*/
                    if (temDis < -this.maxValue || temDis < -(this.maxValue / 2)) {
                        temDis = -this.maxValue;
                    }else{
                        temDis = this.minValue;
                    }

                    // 左滑
                    if (temDis < 0) {
                        this.restSlide();
                        thatElement.dataset.type = '1';
                    }else{
                        thatElement.dataset.type = '0';
                    }

                    thatElement.style = "transform: translate3d(" + temDis / 75 + "rem, 0, 0);background:"+thatElement.dataset.color;
                    this.startX = 0;
                    this.endX = 0;
                }else{
                    // 判断是点击还是长按
                    if(duration < 300){
                        this.restSlide();
                        //跳转
                        this.$store.commit('LoadingStatus', {isLoading: true, loadingMsg: "加载中..."})
                        this.$router.push({name: 'task', params: {id: thatElement.dataset.id}});
                    }
                }
            },
            // 滑动返回大厅
            scrollTouchStart(e) {
                this.duration = 0; // 关闭动画
                this.moveDistance = 0; // 滑动距离归0
                //记录Y轴的位置
                this.startY = e.touches.item(0).pageY;
                //记录X轴的位置
                this.startX = e.touches.item(0).pageX;
            },
            // 拉下刷新
            refreshEnd(){
                // 只要手指拿开，我都需要加上结束时的动画，这里为300ms
                this.duration = 300;
                if (this.moveDistance > 50) {
                    if(this.isCashLog){
                        //这里逻辑跟touchMove一样，但是需要真的加载数据了，那moveState变为2 所以加载动画在这出现
                        this.cashMoveState = 2;
                        //因为还没加载完，我得让加载动画显示着，所以这里移动距离为50
                        this.moveDistance = 50;

                        this.cashNum = 1;
                        this.isCashData = true;

                        this.$api.post('api/v1/user/withdraw-list', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                            page: 1,
                            page_size: 10
                        }).then( res => {
                            //加载数据完成，所以状态要回到0。
                            this.cashMoveState = 0;
                            this.cashLogList = res.dataList;
                        })
                    }else{
                        //这里逻辑跟touchMove一样，但是需要真的加载数据了，那moveState变为2 所以加载动画在这出现
                        this.moveState = 2;
                        //因为还没加载完，我得让加载动画显示着，所以这里移动距离为50
                        this.moveDistance = 50;

                        this.num = 1;
                        this.isData = true;

                        if(this.showCompletedList){
                            // 获取已完成任务列表
                            this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                                session_id: localStorage.getItem('sessionId'), //登录标识
                                status: 1 //用户任务状态
                            })).then( res => {
                                //加载数据完成，所以状态要回到0。
                                this.moveState = 0;
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1]
                                }
                                this.completedList = res.dataList;
                            });
                        }else{
                            // 获取任务大厅的任务列表
                            this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                                session_id: localStorage.getItem('sessionId'), //登录标识
                                qlx_trackid: localStorage.getItem('trackId') || "", //渠道id
                                page: 1, //当前页数
                                page_size: 10, //每页数量
                                status: -1 //用户任务状态
                            })).then( res => {
                                //加载数据完成，所以状态要回到0。
                                this.moveState = 0;
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1]
                                    res.dataList[i].label_list = res.dataList[i].rights_label
                                }
                                this.taskList = res.dataList;
                            });

                            // 获取进行中的任务列表
                            this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                                session_id: localStorage.getItem('sessionId'), //登录标识
                                status: 0 //用户任务状态
                            })).then( res => {
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1]
                                }
                                this.ongoingList = res.dataList;
                            });

                            // 获取已完成的任务列表
                            this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                                session_id: localStorage.getItem('sessionId'), //登录标识
                                page: 1, //当前页数
                                status: 1 //用户任务状态
                            })).then( res => {
                                for(let i in res.dataList){
                                    let colorList = res.dataList[i].color.split(",");
                                    res.dataList[i].main_color = colorList[0];
                                    res.dataList[i].second_color = colorList[1]
                                }
                                this.completedList = res.dataList
                            });

                            // 获取用户信息
                            this.$api.post('api/v1/user/info', {
                                session_id: localStorage.getItem('sessionId'), //登录标识
                            }).then( res => {
                                this.userData = res
                            });

                            // 获取用户提现配置
                            this.$api.post('api/v1/user/withdraw-config', {
                                session_id: localStorage.getItem('sessionId'), //登录标识
                            }).then( res => {
                                this.cashList = res.amount
                            })
                        }
                    }
                } else {
                    //否则 给我老老实实恢复原样
                    this.moveDistance = 0
                }
            },
            // 滑动结束
            scrollTouchEnd(e) {
                // 判断是否上下滑动
                if (this.touchmoveY && this.isShowWithdraw && !this.isCashLog) {
                    // 判断是点击还是滑动
                    if (this.startY !== e.changedTouches.item(0).pageY && this.startY - e.changedTouches.item(0).pageY > 130) {
                        this.hideWithdrawWarp()
                    }
                }
            },
            //复位滑动状态
            restSlide() {
                let listItems = document.querySelectorAll('.task-ongoing .task-item');
                // 复位
                for (let i = 0; i < listItems.length; i++) {
                    listItems[i].dataset.type = '0';
                    listItems[i].style = "transform: translate3d(0rem, 0, 0);background:"+listItems[i].dataset.color
                }
            },
            //放弃任务
            deleteItem(index) {
                this.$api.post('api/v1/jftask/abandon', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    task_id: this.ongoingList[index].id
                }).then( res => {
                    // 复位
                    this.restSlide();
                    // 获取任务大厅的任务列表
                    this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                        session_id: localStorage.getItem('sessionId'), //登录标识
                        qlx_trackid: localStorage.getItem('trackId') || "", //渠道id
                        page: 1, //当前页数
                        page_size: 10, //每页数量
                        status: -1 //用户任务状态
                    })).then( res => {
                        this.loading = false;
                        for(let i in res.dataList){
                            let colorList = res.dataList[i].color.split(",");
                            res.dataList[i].main_color = colorList[0];
                            res.dataList[i].second_color = colorList[1]
                            res.dataList[i].label_list = res.dataList[i].rights_label
                        }
                        this.taskList = res.dataList;
                    });

                    // 获取进行中的任务列表
                    this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                        session_id: localStorage.getItem('sessionId'), //登录标识
                        status: 0 //用户任务状态
                    })).then( res => {
                        for(let i in res.dataList){
                            let colorList = res.dataList[i].color.split(",");
                            res.dataList[i].main_color = colorList[0];
                            res.dataList[i].second_color = colorList[1]
                        }
                        this.ongoingList = res.dataList;
                    });
                }).catch( error => {
                    // 复位
                    this.restSlide();
                })

            },
            /**
             * 获取URL中的参数
             * @return {string}
             */
            GetUrlParam(paraName) {
                let url = document.location.toString();
                let arrObj = url.split("?");
                if (arrObj.length > 1) {
                    let arrPara = arrObj[1].split("&");
                    let arr;
                    for (let i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");
                        if (arr != null && arr[0] == paraName) {
                            return arr[1];
                        }
                    }
                    return "";
                }else {
                    return "";
                }
            },
            GetUrlParamAll() {
                let params = {};

                let url = document.location.toString();
                let arrObj = url.split("?");
                if (arrObj.length > 1) {
                    let arrPara = arrObj[1].split("&");
                    let arr;
                    for (let i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");
                        if (arr != null && arr.length > 1) {
                            params[arr[0]] = arr[1];
                        }
                    }
                }
                return params;
            },

            queryData(){
                this.loading = true;

                // 监听dom渲染完成
                this.$nextTick(() => {
                    // 获取提现模块的高度
                    this.$refs.scrollerDownwarp.addEventListener('scroll', this.cashHandleScroll);
                    // 默认隐藏
                    this.downwarpStyle = 'height: 0;';
                    // handleScroll为页面滚动的监听回调
                    window.addEventListener('scroll', this.handleScroll);

                    // 这里fixedHeaderRoot是吸顶元素的ID
                    let header = document.getElementById("fixedHeader");
                    // 这里要得到top的距离和元素自身的高度
                    this.offsetTop = header.offsetTop;
                    this.offsetHeight = header.offsetHeight;
                });

                // 获取任务大厅的任务列表
                this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')), {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    qlx_trackid: localStorage.getItem('trackId') || "", //渠道id
                    page: 1, //当前页数
                    page_size: 10, //每页数量
                    status: -1 //用户任务状态
                })).then( res => {
                    this.loading = false;
                    for(let i in res.dataList){
                        let colorList = res.dataList[i].color.split(",");
                        res.dataList[i].main_color = colorList[0];
                        res.dataList[i].second_color = colorList[1]
                        res.dataList[i].label_list = res.dataList[i].rights_label
                    }
                    this.taskList = res.dataList;

                    this.showShareTask(this.taskList);
                });

                // 获取进行中的任务列表
                this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    status: 0 //用户任务状态
                })).then( res => {
                    for(let i in res.dataList){
                        let colorList = res.dataList[i].color.split(",");
                        res.dataList[i].main_color = colorList[0];
                        res.dataList[i].second_color = colorList[1]
                    }
                    this.ongoingList = res.dataList;

                    this.showShareTask(this.ongoingList);
                });

                // 获取已完成的任务列表
                this.$api.post('api/v1/jftask/list', Object.assign(JSON.parse(localStorage.getItem('url_params')),{
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    page: 1, //当前页数
                    status: 1 //用户任务状态
                })).then( res => {
                    for(let i in res.dataList){
                        let colorList = res.dataList[i].color.split(",");
                        res.dataList[i].main_color = colorList[0];
                        res.dataList[i].second_color = colorList[1]
                    }
                    this.completedList = res.dataList
                });

                // 获取用户信息
                this.$api.post('api/v1/user/info', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                }).then( res => {
                    this.userData = res
                });

                // 获取用户提现配置
                this.$api.post('api/v1/user/withdraw-config', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                }).then( res => {
                    this.cashList = res.amount
                });
            },
        },
        mounted() {

        },
        destroyed(){
            // 移除页面滚动的监听handleScroll
            window.removeEventListener('scroll', this.handleScroll);

            // 销毁定时器
            clearInterval(this.overTimer)
        },
        created() {
            var reqParams = this.GetUrlParamAll();
            if(reqParams && reqParams.cid){
                localStorage.setItem('url_params', JSON.stringify(reqParams))
            }

            if(localStorage.getItem('url_params')){
                var url_params = JSON.parse(localStorage.getItem('url_params'));
                if(url_params && url_params.task && url_params.qlx_trackid && url_params.qlx_trackid == 'onepro')
                    this.isShowAbandon = false;
            }else
                localStorage.setItem('url_params', JSON.stringify(reqParams))

            this.$api.post('api/v1/jftask/config', {}).then( res => {
                this.iconTipsContentList = res.rights_label_desc
                this.iconTipsList = res.rights_label
            })

            if(this.GetUrlParam("qlx_trackid")) localStorage.setItem('trackId', this.GetUrlParam("qlx_trackid"))
            const is_login = localStorage.getItem('sessionId')
            if(localStorage.getItem('oldSessionId') && !is_login) localStorage.setItem('sessionId', localStorage.getItem('oldSessionId'));
            if (is_login === null) {
                this.$store.commit('LoadingStatus', {isLoading: true})

                var data = JSON.parse(localStorage.getItem('url_params'));
                data['qlx_trackid'] = localStorage.getItem('trackId') || "";
                this.$api.post('api/v1/user/autologin', data).then( res => {
                    localStorage.setItem('userInfo', JSON.stringify(res.user))
                    localStorage.setItem('sessionId', res.session_id)
                    this.queryData()
                });
            }else{
                this.queryData()
                this.overTimer = setInterval(function(){
                    // 获取用户信息
                    this.$api.post('api/v1/user/info', {
                        session_id: localStorage.getItem('sessionId'), //登录标识
                    }).then( res => {
                        this.userData = res
                    });
                }, 300000)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        background: url(../assets/images/bg.png);
        background-size: 100vw 100vh;
        min-height: 100vh;
        overflow-y: scroll;
    }

    /* 提现板块 */
    .scroll-downwarp {
        width: 100%;
        overflow-y: scroll;
        .scroll-warp {
            padding-top: to(144);
        }
        .form-warp {
            margin-bottom: to(24);
            .form-label {
                user-select: none;
                color: #333333;
                font-size: to(24);
                margin-bottom: to(18);
                font-weight: bold;
            }

            .form-input {
                display: block;
                border: solid to(6) #333333;
                height: to(80);
                border-radius: to(12);
                font-size: to(24);
                color: #333333;
                padding: to(15) to(12);
                width: 100%;
                flex: 1;
                font-weight: bold;
            }

            .get-code {
                margin-left: to(32);
                color: #333333;
                font-size: to(28);
                height: to(80);
                padding: to(8) to(16);
                background: #FF8455;
                box-shadow: inset 0 to(-10) 0 0 #D45036;
                border-radius: to(12);
                border: solid to(6) #333333;
                min-width: to(184);
                text-align: center;
                font-weight: bold;
            }

            .cash-list {
                display: flex;
                flex-wrap: wrap;

                .cash-item {
                    color: #333333;
                    font-size: to(28);
                    background: #FF8455;
                    box-shadow: inset 0 to(-16) 0 0 #D45036;
                    border-radius: to(12);
                    border: solid to(6) #333333;
                    text-align: center;
                    padding-top: to(38);
                    width: to(200);
                    height: to(144);
                    margin-right: to(30);;
                    margin-bottom: to(30);
                    font-weight: bold;
                    transition: all .3s;
                }

                .cash-item:nth-child(3n) {
                    margin-right: 0;
                }

                .cash-item.cash-active {
                    background: #FFA751;
                    box-shadow: inset 0 to(-16) 0 0 #D47136;
                }
            }
        }

        .cash-log-item{
            background: #FFFFFF;
            border: solid to(6) #333333;
            min-height: to(118);
            padding: to(20) to(28);
            color: #333333;
            border-radius: to(16);
            margin-bottom: to(32);
            .cash-log-top{
                font-size: to(32);
                justify-content: space-between;
            }
            .cash-log-bottom{
                font-size: to(24);
                justify-content: space-between;
            }
            .cash-log-money{
                font-weight: bold;
            }
            .cash-log-time{
                color: #999999;
            }
        }
    }

    /* 头部板块 */
    .page-head {
        background: #D45036;
        padding-bottom: to(16);
        position: relative;
        z-index: 1;
        width: 100vw;
        .head-warp {
            border: solid to(8) #333333;
            border-top: none;
            border-radius: 0 0 to(28) to(28);
            color: #FFFFFF;
            background: #FF8455;
            box-shadow: inset 0 to(-16) 0 0 #d45036;
            padding: to(46) to(36) to(64);
            position: relative;
            max-height: 100vh;
            overflow: hidden;
            .head-info {
                position: absolute;
                left: to(36);
                right: to(36);
                justify-content: space-between;
                align-items: flex-start;
                background: #ff8455;
                padding-bottom: to(40);
                z-index: 1;
                .head-right {
                    color: #D45036;
                    font-size: to(24);
                    font-weight: bold;
                    &>span{
                        color: #333333;
                    }
                }
            }

            .head-name {
                font-size: to(24);
            }

            .head-reward {
                font-size: to(40);
                font-weight: bold;
            }

            .btn-warp {
                flex: 1;
                justify-content: space-between;
            }

            .page-btn {
                width: to(188);
                height: to(94);
                background: url(../assets/images/btn_white.png) no-repeat center;
                background-size: 100% 100%;
                text-align: center;
                font-size: to(28);
                color: #333333;
                font-weight: bold;
                padding-top: to(18);
                position: relative;
                z-index: 1;
            }

            .page-btn.btn-yellow {
                background-image: url(../assets/images/btn_yellow.png);
            }
        }
    }
    .header-fixed{
        position: fixed;
        top: -75px;
        z-index: 999;
    }
    .task-hall,.completed-warp{
        position: relative;
        z-index: 9;
    }
    /* 任务板块 */
    .task-warp {
        padding: to(48) to(40) 0;

        .warp-head {
            justify-content: space-between;
            -webkit-justify-content: space-between;
            height: to(48);
            margin-bottom: to(32);
            .warp-tit {
                font-family: "HYZhuZiMeiXinTiW";
                font-size: to(48);
            }

            .warp-logo {
                width: to(80);
                height: to(32);
                margin-right: to(14);
            }
        }

        .task-list {
            user-select: none;
            .task-card {
                background: #D8D8D8;
                border-radius: to(16);
                width: 100%;
                margin-bottom: to(60);
                margin-left: to(-10);
                margin-top: to(-10);
                box-shadow: to(20) to(20) 0 #D8D8D8;
                .task-item {
                    width: 100%;
                    border: solid to(8) #333333;
                    border-radius: to(16);
                    background: #FFFFFF;
                    padding: to(16) to(20) to(32) to(24);
                    z-index: 10;
                    overflow: hidden;
                    .task-head {
                        justify-content: space-between;
                        -webkit-justify-content: space-between;
                        color: #BBBBBB;
                        font-family: "HYZhuZiMeiXinTiW";
                        font-size: to(26);
                        .item-surplus {
                            font-family: initial;
                            font-size: to(28);
                            font-weight: bold;
                            margin: 0 to(4);
                        }
                    }

                    .task-main {
                        justify-content: space-between;
                        -webkit-justify-content: space-between;
                        background: #BBBBBB;
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
                            background: #999999;
                        }

                        .app-name {
                            font-size: to(32);
                            font-weight: bold;
                        }

                        .app-reward {
                            font-size: to(26);
                            font-weight: 700;
                            span {
                                font-family: "DIN Alternate Bold";
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

            /* 红色 */
            .task-card.task-red {
                box-shadow: to(20) to(20) 0 #FFD8CA;
                .task-head {
                    color: #FF8455;
                }

                .task-main {
                    background: #FF8455;
                }
            }

            /* 蓝色 */
            .task-card.task-blue {
                box-shadow: to(20) to(20) 0 #D3EAFF;
                .task-head {
                    color: #2795F7;
                }

                .task-main {
                    background: #2795F7;
                }
            }

            /* 绿色 */
            .task-card.task-green {
                box-shadow: to(20) to(20) 0 #BDECBE;

                .task-head {
                    color: #56BE5F;
                }

                .task-main {
                    background: #56BE5F;
                }
            }
        }
    }

    .task-warp.task-ongoing {
        .task-list {
            .task-card {
                position: relative;
                right: to(-14);
                bottom: to(-14);
                height: to(112);
                margin-top: 0;
                margin-left: 0;
                margin-bottom: to(60);
                box-shadow: none !important;
                .task-item {
                    background: #BBBBBB;
                    padding: 0;
                    position: absolute;
                    top: to(-22);
                    left: to(-22);
                    -webkit-transition: all 0.2s;
                    transition: all 0.2s;

                    .task-main {
                        margin: 0;
                    }
                }

                .task-quit {
                    color: #333333;
                    font-size: to(28);
                    font-weight: bold;
                    position: absolute;
                    right: to(28);
                    top: 50%;
                    transform: translateY(-50%);

                    & > img {
                        width: to(26);
                        height: to(28);
                        margin-right: to(6);
                    }
                }
            }

            .task-card:last-child {
                margin-bottom: to(4);
            }


            /* 红色 */
            .task-card.task-red {
                background: #FFD8CA;
                .task-item {
                    background: #FF8455;
                }
            }

            /* 蓝色 */
            .task-card.task-blue {
                background: #D3EAFF;
                .task-item {
                    background: #2795F7;
                }
            }

            /* 绿色 */
            .task-card.task-green {
                background: #BDECBE;
                .task-item {
                    background: #56BE5F;
                }
            }
        }
    }

    .task-completed {
        color: #999999;
        font-size: to(24);
        font-weight: bold;
        span {
            color: #333333;
        }
    }

    /* 完成的任务 */
    .task-warp.task-complete{
        .task-list {
            .task-card {
                margin-bottom: to(60);
                .task-item{
                    padding: 0;
                    .task-main {
                        margin: 0;
                    }
                    .task-cont{
                        background: #FFFFFF;
                        margin-top: 0;
                        padding: to(32);
                        .cont-item{
                            margin-bottom: to(24);
                            .cont-head{
                                justify-content: space-between;
                            }
                            .cont-time{
                                color: #999999;
                                margin-left: to(88);
                            }
                            .task-desc{
                                font-weight: bold;
                                margin-bottom: 0;
                            }
                            .task-reward{
                                font-weight: bold;
                            }
                        }
                        .cont-item.undone{
                            .task-reward{
                                color: #D8D8D8;
                            }
                            .cont-time{
                                color: #D8D8D8;
                            }
                            color: #D8D8D8;
                        }
                    }
                }
            }
            /* 红色 */
            .task-card.task-red {
                .task-reward {
                    color: #FF8455;
                }
            }

            /* 蓝色 */
            .task-card.task-blue {
                .task-reward {
                    color: #2795F7;
                }
            }

            /* 绿色 */
            .task-card.task-green {
                .task-reward {
                    color: #56BE5F;
                }
            }
        }
        .task-completed {
            color: #999999;
            font-size: to(24);

            span {
                color: #333333;
            }
        }
    }

    .loading-warp {
        position: relative;
        overflow: hidden;
        height: to(160);
        line-height: to(160);
        text-align: center;
    }

    .loading-logo {
        width: to(160);
        height: to(64);
        margin: auto;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

    /* 任务没了-弹出层板块 */
    .mask {
        position: fixed;
        background: rgba(0, 0, 0, 0.55);
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999
    }

    .task-popup {
        /*box-shadow: to(20) to(20) 0 #FF8455;*/
        position: fixed;
        z-index: 999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: to(476);
        border-radius: to(16);
        .tit-head{
            justify-content: space-between;
        }
        .tit-close {
            justify-content: center;
            img{
                display: block;
                width: to(32);
                height: to(32);
            }
        }
        .start-task{
            margin-top: to(84);
        }
        .tips-text{
            color: #333333;
            font-size: to(24);
            font-weight: bold;
            margin-bottom: to(56);
            text-align: justify;
        }
        .logout-btn{
            background: #FF8455;
            text-align: center;
            font-weight: bold;
            font-size: to(24);
            color: #FFFFFF;
            height: to(80);
            line-height: to(80);
            margin: to(48) to(6) to(0);
        }
        .task-box {
            border: solid to(8) #333333;
            background: #FFFFFF;
            border-radius: to(16);
            width: 100%;
            color: #333333;
            padding: to(30) to(40) to(64);
            .task-title-small {
                font-size: to(32);
                font-family: "HYZhuZiMeiXinTiW";
            }

            .task-title {
                font-size: to(48);
                text-align: center;
                font-weight: bold;
                margin: to(84) auto to(64)
            }

            .other-title {
                color: #BBBBBB;
                font-size: to(24);
            }

            .other-task {
                padding: 0 to(16);
                max-height: to(336);
                overflow-y: scroll;
                .other-item{
                    padding: 0 to(12);
                    margin-top: to(16);
                    background: #BBBBBB;
                    height: to(96);
                    &>img{
                        width: to(60);
                        height: to(60);
                        border-radius: to(8);
                        margin-right: to(16);
                        display: block;
                        border: solid to(6) #333333;
                    }
                    .app-name{
                        font-size: to(32);
                        font-weight: bold;
                        color: #FFFFFF;
                    }
                }
            }
        }
    }

    .weui-pull-refreshing-box {
        line-height: to(50);
        height: to(50);
        font-size: to(24);
        color: #455A64;
        text-align: center;
        margin-top: to(-50);
    }
    .weui-loading {
        width: to(40);
        height: to(40);
        display: inline-block;
        vertical-align: middle;
        -webkit-animation: weuiLoading 1s steps(12, end) infinite;
        animation: weuiLoading 1s steps(12, end) infinite;
        background: transparent url("data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 100 100'%3E%3Cpath fill='none' d='M0 0h100v100H0z'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E9E9E9' rx='5' ry='5' transform='translate(0 -30)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23989697' rx='5' ry='5' transform='rotate(30 105.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%239B999A' rx='5' ry='5' transform='rotate(60 75.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23A3A1A2' rx='5' ry='5' transform='rotate(90 65 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23ABA9AA' rx='5' ry='5' transform='rotate(120 58.66 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23B2B2B2' rx='5' ry='5' transform='rotate(150 54.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23BAB8B9' rx='5' ry='5' transform='rotate(180 50 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23C2C0C1' rx='5' ry='5' transform='rotate(-150 45.98 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23CBCBCB' rx='5' ry='5' transform='rotate(-120 41.34 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23D2D2D2' rx='5' ry='5' transform='rotate(-90 35 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23DADADA' rx='5' ry='5' transform='rotate(-60 24.02 65)'/%3E%3Crect width='7' height='20' x='46.5' y='40' fill='%23E2E2E2' rx='5' ry='5' transform='rotate(-30 -5.98 65)'/%3E%3C/svg%3E") no-repeat;
        background-size: 100%
    }
    @keyframes weuiLoading{0%{transform: rotate3d(0, 0, 1, 0deg)} 100% {transform: rotate3d(0, 0, 1, 360deg)}}

    /* loading */
    .loading-box{
        text-align: center;
        font-size: to(28);
        color: #999999;
        margin: to(30) 0;
    }
    .loading{
        display:inline-block;
        margin-right: to(12);
        vertical-align: middle;
        width: to(40);
        height: to(40);
        background: transparent;
        border-radius: 50%;
        border-width: to(4);
        border-style: solid;
        border-color: #e9eaec #e9eaec #e9eaec #FF8455;
        animation: loading-spin .6s linear;
        animation-iteration-count: infinite;
    }
    @keyframes loading-spin{0%{transform: rotate(0);} 100%{transform: rotate(360deg);}}

    .color-gray{color: #BBBBBB}
    .color-red{color: #D45036 !important;}

    .task-icon{
        margin-left: to(24);
        margin-top: to(-8);
        color: #333333;
        background: #FFF;
        font-size: to(24);
        display: flex;
        border-radius: to(6);
        font-family: initial;
        font-weight: bold;
        height: 38px;
        overflow: hidden;
        .btn-icon{
            border: solid to(4) #333;
            border-radius: to(6) 0 0 to(6);
            background: #2795F7;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 38px;
            img{
                width: to(34);
                height: to(30);
            }
            &.btn-green{
                background: #56BE5F;
            }
            &.btn-red{
                background: #FF8455;
            }
        }
        .btn-title{
            height: 38px;
            display: flex;
            align-items: center;
            padding: 0 to(6);
            border: solid to(4) #333;
            border-radius: 0 to(6) to(6) 0;
            border-left: 0;
        }
    }
</style>
