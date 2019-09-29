<template>
    <div class="main">
        <!-- 任务顶部 -->
        <div class="task-card" id="fixedHeader" :class="{'header-fixed' : isFixed}" :style="{background: taskData.second_color}">
            <div class="task-item">
                <div class="task-head flex-item">
                    <div class="tit-left" :style="{color: taskData.main_color}">任务详情</div>
                    <div class="tit-right">
                        <div class="giveup-task" @click.stop="isShowPopup = true">放弃任务</div>
                        <div class="tit-close flex-item" @click.stop="tapToBack">
                            <img src="../assets/images/close_detail.png" alt=""/>
                        </div>
                    </div>
                </div>
                <div class="task-main flex-item" :style="{background: taskData.main_color}">
                    <div class="flex-item" :style="fixedHeadStyle">
                        <img :src="taskData.logo" alt="">
                        <div class="app-name">{{taskData.title}}</div>
                    </div>
                    <div class="app-reward" :style="fixedHeadStyle">奖励金<span>{{taskData.price}}</span>元</div>
                </div>
                <div class="task-cont">
                    <div class="task-desc">{{taskData.child_list[curTaskIndex].desc}}<!--可让家人朋友一起完成，拿多次奖励--></div>
                </div>
            </div>
        </div>

        <div class="task-warp" :class="{'fixed-padding' : isFixed}">
            <div class="task-branch flex-item">
                <div class="branch-item flex-item"
                     @click.stop="switchBranch(index, item)"
                     v-for="(item, index) in taskData.child_list"
                     :key="index"
                     :class="{'branch-active' : branchActive == index,
                    'branch-gray' : item.user_record_status == -1}">
<!--                    'branch-green' : item.user_record_status == 1,-->
<!--                    'branch-blue' : item.user_record_status == 2,-->
<!--                    'branch-red' : item.user_record_status == 3-->

<!--                    {{item.user_record_status == -1 ? item.price + "元任务" : item.taskStatusName}}-->
                        {{item.price + "元任务"}}<span v-if="item.user_record_status == 0">...</span>
<!--                    branchActive == index ? '../assets/images/btn_icon01.png' : '../assets/images/btn_icon02.png'-->
<!--                    <img :src="branchActive == index ? branchActiveLuckIcon : branchLuckIcon" alt="" v-if="item.user_record_status == -1"/>-->
                    <img :src="branchActive == index ? branchActiveLuckIcon : branchLuckIcon" alt="" v-if="item.user_record_status == -1"/>
                    <img :src="branchActive == index ? branchActiveLuckIconOk : branchLuckIconOk" alt="" v-if="item.user_record_status == 1"/>
                    <img :src="branchActive == index ? branchActiveLuckIconFail : branchLuckIconFail" alt="" v-if="item.user_record_status == 3"/>
                </div>
            </div>

            <!-- 任务失败板块 -->
            <div class="detail-card" v-if="taskStatus == 3">
                <div class="detail-head flex-item">
                    <div class="task-left">{{taskData.child_list[curTaskIndex].title}}</div>
                </div>
                <div class="form-warp">
                    <div class="form-label"><p>很抱歉，</p><p>您提交的资料未通过审核，任务失败了… </p></div>
                </div>

                <div class="result-warp flex-item bg-red">
                    <img src="../assets/images/task_fail.png" class="fail-img" alt=""/>
                </div>

                <div class="reason-warp">
                    <div class="reason-title">请您参考以下常见原因： </div>
                    <p v-if="taskData.child_list[curTaskIndex].jftask_record.client_remark">{{taskData.child_list[curTaskIndex].jftask_record.client_remark}}</p>
                    <template v-else-if="taskData.child_list[curTaskIndex].check_desc.length > 0 && taskData.child_list[curTaskIndex].check_desc[0]">
                        <p v-for="(item, index) in taskData.child_list[curTaskIndex].check_desc" :key="index">{{item}}</p>
                    </template>
                    <template v-else>
                        <p>1. 未符合"任务要求"及"任务须知"；</p>
                        <p>2. 未按照"图例教程"的要求上传截图凭证；</p>
                        <p>3. "提交任务"的手机号或其他信息与任务中所使用的信息不一致；</p>
                        <p>4. 可能存在作弊或非真实自然人操作行为。</p>
                    </template>
                    <div class="reason-tips">若以上不合格原因都与您无关，您可在24小时内重新完成此任务并提交审核，感谢您对趣拉新业务的支持。</div>
                </div>
            </div>

            <!-- 任务描述板块 -->
            <div class="detail-card" :class="{'bg-gray': taskStatus == -1}">
                <div class="detail-tips flex-item" @click.stop="switchBranch(curTaskIndex - 1, taskData.child_list[curTaskIndex - 1])" v-if="taskStatus == -1"><img src="../assets/images/arrow.png" alt="" />完成上个任务即可解锁，点击去完成</div>
                <div class="detail-head flex-item">
                    <div class="task-left">任务{{curTaskIndex + 1}}： {{taskData.child_list[curTaskIndex].title}}</div>
<!--                    <div class="task-right" :style="{color: taskData.main_color}">{{taskData.child_list[curTaskIndex].price}}元奖励金</div>-->
                    <div class="task-icon" @click.stop="showIconTipsPopup(1)" v-if="taskData.child_list[curTaskIndex].label_list[0] == 1">
                        <div class="btn-icon">
                            <img src="../assets/images/icon1.png" alt="" />
                        </div>
                        <span class="btn-title">{{iconTipsList[taskData.child_list[curTaskIndex].label_list[0]]}}</span>
                    </div>
                </div>
                <div class="form-warp">
                    <div class="form-label" v-if="taskStatus != 2 && taskStatus != 1 && taskStatus != -1">任务须知：</div>
<!--                    <div class="form-label" v-if="taskStatus != 2 && taskStatus != 1">任务步骤：</div>-->
                    <div class="form-label" v-if="taskStatus != 0 && taskStatus != 3 && taskStatus != -1"><p>{{taskStatus == 2 ? "小贴士： " : "恭喜您， "}}</p><p>{{taskStatus == 2 ? "下个任务已解锁！关注公众号“趣拉新”可实时接收奖励到账通知" : "恭喜您，任务成功通过审核，奖励已发放。"}}</p></div>
                </div>
                <div class="detail-cont" v-if="taskStatus == 0 || taskStatus == 3 || taskStatus == -1" style="color: #D45036">
                    <p v-for="(item, index) in taskData.child_list[curTaskIndex].notice" :key="index">{{item}}</p>
                </div>
                <div class="form-warp" v-if="taskStatus == 0 || taskStatus == 3 || taskStatus == -1">
                    <div class="form-label">任务简介：</div>
                </div>
                <div class="detail-cont" v-if="taskStatus == 0 || taskStatus == 3 || taskStatus == -1">
                    <template v-for="(item, index) in taskData.child_list[curTaskIndex].text_desc">
                        <p v-html="item"></p>
                    </template>
                </div>

                <div v-if="taskStatus == 0 || taskStatus == 3 || taskStatus == -1">
                    <div class="task-tutorial">图例教程<span>（注意☆号图例）</span>：</div>
                    <div class="tutorial-warp flex-item">
                        <div class="tutorial-item" :class="{'tutorial-active' : item.printscreen == 1}" v-for="(item, index) in taskData.step_list" :key="index" @click.stop="tapShowPreviewPopup(index)">
<!--                            <img :src="item.img" alt="" class="tutorial-img"/>-->
                            <div class="tutorial-img" :style="{background: 'url(' + item.img + ') center center / cover no-repeat'}"></div>
                            <div class="tutorial-mask">
                                <div class="tutorial-sequence flex-item">{{index + 1}}</div>
                                <div class="tutorial-star flex-item" v-if="item.printscreen == 1"><img src="../assets/images/star.png" alt=""></div>
                            </div>
                        </div>
                    </div>

                    <div class="page-btn btn-gray tap-ripple" v-if="taskStatus == -1">未解锁</div>
                    <div class="page-btn btn-yellow tap-ripple" @click.stop="jumpTaskUrl" v-else>开始任务</div>
                </div>
                <div v-else>
                    <div class="result-warp flex-item bg-blue" :class="{'bg-green' : taskStatus == 1}">
                        <div class="result-box" v-if="taskStatus == 2">
                            <div class="result-title">审核中...</div>
                            <div class="result-desc">
                                <p>您的资料已进入风控系统</p>
                                <p>预计2～6小时出结果</p>
                            </div>
                        </div>
                        <img src="../assets/images/task_over.png" class="over-img" alt="" v-if="taskStatus == 1"/>
                        <img src="../assets/images/task_review.png" class="review-img" alt="" v-if="taskStatus == 2"/>
                    </div>
                </div>
            </div>

            <!-- 提交任务板块 -->
            <div class="detail-card" v-if="taskStatus == 0 || taskStatus == 3">
                <div class="detail-head flex-item flex-compact">
                    <div class="task-title">提交凭证</div>
                    <div class="task-icon" @click.stop="showIconTipsPopup(2)" v-if="taskData.child_list[curTaskIndex].label_list[1] == 2">
                        <div class="btn-icon btn-green">
                            <img src="../assets/images/icon2.png" alt="" />
                        </div>
                        <span class="btn-title">{{iconTipsList[taskData.child_list[curTaskIndex].label_list[1]]}}</span>
                    </div>
                    <div class="task-icon" @click.stop="showIconTipsPopup(3)" v-if="taskData.child_list[curTaskIndex].label_list[2] == 3">
                        <div class="btn-icon btn-red">
                            <img src="../assets/images/icon3.png" alt="" />
                        </div>
                        <span class="btn-title">{{iconTipsList[taskData.child_list[curTaskIndex].label_list[2]]}}</span>
                    </div>
                </div>

                <div class="form-warp" v-if="uploadList.length > 0">
					<!-- <div class="form-label">{{taskData.child_list[curTaskIndex].submit_text_list.length + 1}}. 根据 “图例教程” 上任务中遇到的对应截图</div> -->
                    <div class="form-label">1. 截图凭证<span>（注意☆号图例）</span></div>
                </div>
                <div class="tutorial-warp flex-item" v-if="uploadList.length > 0">
                    <div class="upload-item" v-for="(item, index) in uploadList" :key="index">
                        <label :for="item.id" class="upload-img flex-item">
                            <img src="../assets/images/upload.png" alt="" v-if="!item.imgUrl"/>
                            <div :style="{background: 'url(' + item.imgUrl + ') center center / cover no-repeat'}" class="upload-data" v-else></div>
                            <input type="file" class="upload-input" :id="item.id" @change.stop="changeImage($event,index)" ref="inputer" accept="image/*"/>
                        </label>
                        <div class="upload-title">{{item.title}}</div>
                    </div>
                </div>

				<div class="form-warp" v-for="(item, index) in taskData.child_list[curTaskIndex].submit_text_list" :key="index">
                    <div class="form-label">{{index + 2}}. 文本凭证</div>
                    <input class="form-input" @input="onInputData(index, $event)" type="text" :placeholder="'请填写' + item">
                </div>

                <div class="page-btn btn-gray tap-ripple" :class="{'btn-blue' : startTask === 'true'}" @click.stop="onSubmitReview">提交审核</div>
            </div>

            <!-- 下一级任务板块 任务状态 任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1 -->
            <div class="next-card flex-item" :class="{'bg-gray' : taskData.child_list[curTaskIndex + 1] && taskData.child_list[curTaskIndex + 1].allow_take == 2}" v-if="taskStatus != -1 &&taskStatus != 0 && taskStatus != 3 && isHasNextTask" @click.stop="tapToGrabTask()">
                <div class="next-title">任务{{curTaskIndex + 2}}{{taskData.child_list[curTaskIndex + 1] && taskData.child_list[curTaskIndex + 1].allow_take == 2 ? "即将解锁" : "已开启"}}</div>
<!--                <div class="next-title">任务{{curTaskIndex + 2}}{{taskStatus == 2 ? "即将解锁" : "已开启"}}</div>-->
                <div class="next-title">{{taskData.child_list[curTaskIndex + 1] && taskData.child_list[curTaskIndex + 1].allow_take == 2 ? "可得" +nextTaskData.price+ "元奖励金" : "立即前往!"}}</div>
            </div>
        </div>

        <!-- 预览教程图片弹层 -->
        <transition name="fade">
            <div class="preview-popup" v-if="isShowPreviewPopup" @touchmove.prevent="maskMove">
                <div class="preview-head flex-item">
                    <div class="preview-num"><span :style="{'color' : taskData.step_list[swiperIndex - 1].printscreen == 1 ? '#FF8455' : '#FFFFFF'}">{{swiperIndex}}</span>/{{taskData.step_list.length}}</div>
                    <div>任务{{curTaskIndex + 1}}： {{taskData.child_list[curTaskIndex].title}}</div>
                </div>
                <swiper :options="swiperOption">
                    <swiper-slide v-for="(item, index) in taskData.step_list" :key="index">
                        <div class="swiper-warp" :class="{'swiper-border' : item.printscreen == 1}">
                            <div class="swiper-cont">
<!--                                <img :src="item.img" alt="" />-->
                                <div :style="{background: 'url(' + item.img + ') center center / auto 100% no-repeat', width: '100%', height: '100%'}"></div>
                            </div>
                            <div class="preview-tips flex-item" v-if="item.printscreen == 1">● 完成此步骤后请<span>“截图”</span>，审核任务时需要提交 ●</div>
                            <div class="preview-foot">{{taskData.step_list[swiperIndex - 1].desc}}</div>
                        </div>
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
        </transition>


        <div class="mask" @touchmove.prevent="maskMove" v-if="isShowPopup || showLogin || iconTipsPopup"
             @click.stop="isShowPopup = false;showLogin = false;iconTipsPopup = false"></div>
        <div class="task-popup" @touchmove.prevent="maskMove" v-if="isShowPopup || iconTipsPopup">
            <div class="task-box">
                <div class="tit-head flex-item">
                    <div class="head-text"><span v-if="showStartPopup">任务已开始</span><span v-if="iconTipsPopup">{{iconTipsTitle}}</span></div>
                    <div class="tit-close flex-item" @click.stop="isShowPopup = false; iconTipsPopup = false">
                        <img src="../assets/images/close_detail.png" alt=""/>
                    </div>
                </div>
                <div v-if="showStartPopup" class="start-task">
                    <div class="start-text" v-for="(item, index) in taskData.child_list[curTaskIndex].start_desc">
                        <div class="start-tit" v-html="item"></div>
                        <div v-if="index + 1 !== taskData.child_list[curTaskIndex].start_desc.length" class="start-dot">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                    </div>
                    <div v-if="taskData.child_list[curTaskIndex].start_img" class="start-img">
                        <img :src="taskData.child_list[curTaskIndex].start_img" alt="">
                    </div>
                    <div v-if="taskData.child_list[curTaskIndex].start_keyword" class="start-keyword">
                        <div>{{taskData.child_list[curTaskIndex].start_keyword}}</div>
                        <div class="copy-tips">- 长按复制 -</div>
                    </div>
                </div>
                <div v-else-if="iconTipsPopup" class="start-task">
                    <div class="tips-text">{{iconTipsContent}}</div>
                    <div class="logout-btn" @click.stop="iconTipsPopup = false">我知道了</div>
                </div>
                <template v-else>
                    <div class="task-title-small">想好了哦!!!</div>
                    <div class="task-title">真的要放弃嘛</div>
                    <div class="logout-btn" @click.stop="isShowPopup = false">手抖！按错了</div>
                    <div class="logout-btn bg-gray" @click.stop="deleteItem">还是放弃吧..</div>
                </template>
            </div>
        </div>

        <div class="login-main" :class="{'on-show' : showLogin}">
            <div class="tit-close flex-item" @click.stop="tapToCloseLogin">
                <div class="login-title">快捷登录</div>
                <img src="../assets/images/close_detail.png" alt="" />
            </div>

            <input class="login-card login-input flex-item" type="tel" v-model.trim="phone" placeholder="请输入手机号" maxlength="13"/>

            <div class="flex-item code-box">
                <input class="login-card login-input flex-item" type="tel" v-model.trim="authCode" placeholder="请输入验证码" />
                <div class="get-code" @click.stop="getAuthCode" v-if="!sendAuthCode">获取验证码</div>
                <div class="get-code" v-else>{{authNum}}s 重试</div>
            </div>
            <img src="../assets/images/logo.png" alt="" class="logo" />
            <div class="login-card login-btn flex-item" :class="{'login-blue' : phone && authCode}" @click.stop="tapToLogin">登录</div>
        </div>
    </div>
</template>

<script>
    import {swiper, swiperSlide} from 'vue-awesome-swiper'

    export default {
        components: {
            swiper,
            swiperSlide
        },
        name: 'task',
        data() {
            return {
                branchActiveLuckIcon: require('../assets/images/btn_icon01.png'),
                branchActiveLuckIconOk: require('../assets/images/btn_icon05.png'),
                branchActiveLuckIconFail: require('../assets/images/btn_icon03.png'),
                branchLuckIcon: require('../assets/images/btn_icon02.png'),
                branchLuckIconOk: require('../assets/images/btn_icon06.png'),
                branchLuckIconFail: require('../assets/images/btn_icon04.png'),
                isShowPopup: false, // 是否显示放弃任务弹层
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
                taskStatus: 0, // 当前任务状态 任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1
                isShowPreviewPopup: false,
                taskData: {
                    child_list: [{
                        title: "",
                        price: "",
                        jftask_record: {
                            check_desc: [],
                            check_remark: ""
                        },
                        label_list: []
                    }],
                    logo: require("../assets/images/logo_01.webp"),
                    title: "京东白条",
                    remaining: "20",
                    bonus: "10",
                    task_claim: "新用户成功获取信用额度",
                    duration: "6~12分钟",
                    extra: "使用白条首次充值话费减免10元"
                },
                swiperIndex: 1,
                swiperOption: {},

                inputData: [], //填写内容的数组
                uploadList: [], //上传图片的数组
                isFixed: false,
                fixedHeadStyle: "",


                overTimer: null, // 超时定时器
                nextTaskData: {}, // 下一个任务的数据
                curTaskIndex: 0, //当前是第几个任务

                taskId: 0, //任务ID
                recordId: 0, //记录ID
                isHasNextTask: false, //是否存在下一个任务
                branchActive: 0, //当前的任务的索引

                startTask: false, //判断是否开始任务

                phone: "", //手机号
                authCode: "", //验证码
                authNum: 60, //倒计时
                sendAuthCode: false, //是否已发送验证码
                phoneFocus: false, //自动聚焦到手机号输入框
                authCodeFocus: false, //自动聚焦到验证码输入框
                showLogin: false, //是否显示快捷登录
                showStartPopup: false, //是否显示开始任务弹窗
            }
        },
        computed: {},
        methods: {
            //获取验证码
            getAuthCode(){
                let reg = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
                if(!reg.test(this.phone)){
                    this.$toast("手机号码格式不正确");
                    this.phoneFocus = true
                    return;
                }
                this.$api.post('ajax/send-auth-code', {
                    phone: this.phone
                }).then(res => {
                    this.sendAuthCode=true;
                    this.$toast("发送成功，请注意接收");
                    let timer=setInterval(()=>{
                        this.authNum--;
                        if(this.authNum<=0){
                            clearInterval(timer);
                            this.sendAuthCode=false;
                        }
                    },1000)
                });
            },

            // 跳过登录
            tapToCloseLogin(event){
                event.preventDefault();
                this.showLogin = false
            },

            // 登录
            tapToLogin(){
                if(!this.phone){
                    this.$toast("请输入手机号");
                    this.phoneFocus = true;
                    return;
                }
                if(!this.authCode){
                    this.$toast("请输入验证码");
                    this.authCodeFocus = true;
                    return;
                }
                this.$api.post('api/v1/user/phonelogin', {
                    phone: this.phone,
                    code: this.authCode,
                    session_id: localStorage.getItem('sessionId') || "", //登录标识
                    qlx_trackid: localStorage.getItem('trackId') || "" //渠道id
                }).then( res => {
                    localStorage.setItem('oldSessionId', localStorage.getItem('sessionId'))
                    this.$toast("登录成功！");
                    localStorage.setItem('userInfo', JSON.stringify(res.user))
                    localStorage.setItem('sessionId', res.session_id)
                    this.showLogin = false;
                    this.queryData().then(() => {
                        //领取资格allow_take  1允许 2不允许
                        if(this.taskData.child_list[this.curTaskIndex].user_record_status == -1 && this.taskData.child_list[this.curTaskIndex].allow_take == 1){
                            this.$api.post('api/v1/jftask/take', {
                                session_id: localStorage.getItem('sessionId'), //登录标识
                                task_id: this.taskData.id
                            }).then( res => {
                                this.queryData()
                            })
                        }else{
                            //任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1
                            if (this.taskStatus === 1 || this.taskStatus === -1) {
                                this.$router.back();
                            }
                        }
                    })
                });
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
            //判断页面滚动距离
            handleScroll(){
                // 得到页面滚动的距离
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
                // 判断页面滚动的距离是否大于吸顶元素的位置
                this.isFixed = scrollTop > 100;
                this.fixedHeadStyle = 'opacity: ' + (scrollTop < 100 ? (1 - scrollTop / 100) : 0) + ';';
            },
            // 上传图片
            changeImage(event,index){
                if(localStorage.getItem('userInfo') && !JSON.parse(localStorage.getItem('userInfo')).phone){
                    this.$toast.center("请先登录");
                    this.showLogin = true;
                    return false
                }
                this.$store.commit('LoadingStatus', {isLoading: true, loadingMsg: "上传中..."})
                // 通过DOM取文件数据
                let fileData = event.target.files[0];
                if(fileData){
                    let size = Math.floor(fileData.size / 1024);
                    if (size > 201) {
                        //如果超过200kb就压缩图片
                        this.imgCompress(fileData, 150 / size, index);
                        // this.$toast.center("请选择5M以内的图片！");
                        return false
                    }
                    this.uploadList[index].imgFile = fileData
                    this.getObjectURL(fileData, index)
                }else{
                    this.$store.commit('LoadingStatus', {isLoading: false});
                }
            },
            //图片压缩
            imgCompress(file, quality, index){
                this.picavalue = file;
                if (this.picavalue.size / 1024 > 5121) {
                    this.$store.commit('LoadingStatus', {isLoading: false});
                    this.$toast.center("请选择5M以内的图片！");
                } else {
                    this.imgPreview(this.picavalue, quality, index);
                }
            },
            //获取图片
            imgPreview(file, quality, index) {
                //判断支不支持FileReader
                if (!file || !window.FileReader) return;
                if (/^image/.test(file.type)) {
                    //创建一个reader
                    let reader = new FileReader();

                    //将图片转成base64格式
                    reader.readAsDataURL(file);
                    //读取成功后的回调
                    reader.onloadend = e => {
                        let result = e.target.result;
                        let img = new Image();
                        img.src = result;
                        img.onload = () => {
                            let data = this.compress(img, quality);
                            this.$store.commit('LoadingStatus', {isLoading: false});
                            this.uploadList[index].imgUrl = data;
                            this.uploadList[index].imgFile = this.dataURItoBlob(data)
                        };
                    };
                }
            },
            // 压缩图片
            compress(img, quality) {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                let initSize = img.src.length;
                let width = img.width;
                let height = img.height;
                canvas.width = width;
                canvas.height = height;
                // 铺底色
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, width, height);

                //进行最小压缩
                return canvas.toDataURL("image/jpeg", quality);
            },
            // base64转成bolb对象
            dataURItoBlob(base64Data) {
                let byteString;
                if (base64Data.split(",")[0].indexOf("base64") >= 0)
                    byteString = atob(base64Data.split(",")[1]);
                else byteString = unescape(base64Data.split(",")[1]);
                let mimeString = base64Data
                    .split(",")[0]
                    .split(":")[1]
                    .split(";")[0];
                let ia = new Uint8Array(byteString.length);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                return new Blob([ia], { type: mimeString });
            },
            // 转预览图
            getObjectURL(file, index) {
                let url = new FileReader();  //本地预览
                url.onload = (e) => {
                    this.$store.commit('LoadingStatus', {isLoading: false})
                    this.uploadList[index].imgUrl = e.target.result
                };
                url.readAsDataURL(file); //Base64
            },
            // 删除图片
            delImg(index){
                this.uploadList[index].imgFile = ""
                this.uploadList[index].imgUrl = ""
            },
            //放弃任务
            deleteItem() {
                this.$api.post('api/v1/jftask/abandon', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    task_id: this.$route.params.id, //任务ID
                }).then( res => {
                    this.$router.back();
                })

            },
            // 返回首页
            tapToBack(event){
                event.preventDefault();
                this.$router.back();
            },
            // 查看实例图片
            tapShowPreviewPopup(swiperIndex){
                let that = this;
                this.swiperOption = {
                    initialSlide: swiperIndex,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true,
                        renderBullet(index, className) {
                            let swiperDot = `<span class="${className} swiper-pagination-bullet-custom"></span>`
                            if (that.taskData.step_list[index].printscreen == 1){
                                swiperDot = `<span class="${className} swiper-pagination-bullet-custom swiper-pagination-star"></span>`
                            }
                            return swiperDot
                        }
                    },
                    on:{
                        slideChange() {
                            that.swiperIndex = this.activeIndex + 1;
                        },
                        tap() {
                            that.isShowPreviewPopup = false
                        }
                    }
                };
                this.swiperIndex = swiperIndex + 1
                this.isShowPreviewPopup = true
            },
            // 开始任务
            jumpTaskUrl(){
                if(localStorage.getItem('userInfo') && !JSON.parse(localStorage.getItem('userInfo')).phone){
                    this.$toast.center("请先登录");
                    this.showLogin = true;
                    return false
                }
                this.$api.post('api/v1/jftask/start', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    record_id: this.recordId //记录ID
                }).then();
                localStorage.setItem('startTask_' + this.taskId, 'true');
                this.startTask = localStorage.getItem('startTask_' + this.taskId);
                this.showStartPopup = true;
                this.isShowPopup = true;
                if(!this.taskData.child_list[this.curTaskIndex].url) return false;
                // setTimeout(()=>{
                    // window.open(this.taskData.child_list[this.curTaskIndex].url);
                // }, (this.taskData.child_list[this.curTaskIndex].url_time * 1000))
                let a = document.createElement("a");
                a.setAttribute("href", this.taskData.child_list[this.curTaskIndex].url)
                a.setAttribute("target", "_blank")
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a)
            },
            // 文本框输入
            onInputData(index, event){
                this.inputData[index] = event.target.value
            },
            // 提交任务
            onSubmitReview(){
                if(localStorage.getItem('startTask_' + this.taskId) === 'false'){
                    this.$toast.center("请按教程开始任务");
                    return false
                }
                if(localStorage.getItem('userInfo') && !JSON.parse(localStorage.getItem('userInfo')).phone){
                    this.$toast.center("请先登录");
                    this.showLogin = true;
                    return false
                }
                let imgList = [];
                for (let i in this.uploadList){
                    if(this.uploadList[i].imgUrl) imgList.push(this.uploadList[i].imgUrl)
                }
                if(this.uploadList.length > 0 && imgList.length !== this.uploadList.length){
                    this.$toast.center("请根据 “图例教程” 上传对应所有截图");
                    return false
                }
                for(let i in this.taskData.child_list[this.curTaskIndex].submit_text_list){
                    if(!this.inputData[i]){
                        this.$toast.center("请填写" + this.taskData.child_list[this.curTaskIndex].submit_text_list[i]);
                        return false
                    }
                }
                this.$api.post('api/v1/jftask/submit', {
                    session_id: localStorage.getItem('sessionId'), //登录标识
                    task_id: this.taskId, //任务ID
                    record_id: this.recordId, //记录ID
                    inputData: this.inputData,
                    inputLabel: this.taskData.child_list[this.curTaskIndex].submit_text_list,
                    imgArr: imgList
                }, 2).then( res => {
                    this.$toast.center("提交成功");
                    this.inputData = []
                    return this.queryData()
                }).then(() => {
                    this.tapToGrabTask()
                })
            },

            // 开启下一个任务
            tapToGrabTask(){
                this.nextTaskData = (this.taskStatus == 2 ? this.taskData.child_list[this.curTaskIndex + 1] : this.nextTaskData);
                if(this.nextTaskData && Object.keys(this.nextTaskData).length !== 0){
                    //领取资格allow_take  1允许 2不允许
                    if(this.nextTaskData.user_record_status == -1 && this.nextTaskData.allow_take == 1){
                        this.$api.post('api/v1/jftask/take', {
                            session_id: localStorage.getItem('sessionId'), //登录标识
                            task_id: this.nextTaskData.id
                        }).then( res => {
                            this.queryData()
                        })
                    }else{
                        this.prevTaskData = this.taskData;
                        this.branchActive = this.curTaskIndex + 1;
                        this.taskStatus = this.nextTaskData.user_record_status;
                        this.curTaskIndex = this.curTaskIndex + 1;
                        this.taskId = this.nextTaskData.id;
                        this.recordId = this.nextTaskData.jftask_record ? this.nextTaskData.jftask_record.id : "";
                        this.uploadList = [];
                        this.taskData.step_list = '';
                        if(this.taskStatus != -1){
                            //任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1
                            switch (this.taskStatus) {
                                case 3:
                                    this.taskData.child_list[this.curTaskIndex].taskStatusName = "失败了...";
                                    this.taskData.step_list = this.taskData.child_list[this.curTaskIndex].step_list
                                    for(let i in this.taskData.step_list){
                                        if(this.taskData.step_list[i].printscreen == 1){
                                            this.uploadList.push({
                                                imgUrl: "",
                                                imgFile: "",
                                                title: Number(i) + 1 + "号"
                                            })
                                        }
                                    }
                                    break;
                                case 0:
                                    this.taskData.child_list[this.curTaskIndex].taskStatusName = "进行中...";
                                    this.taskData.step_list = this.taskData.child_list[this.curTaskIndex].step_list
                                    for(let i in this.taskData.step_list){
                                        if(this.taskData.step_list[i].printscreen == 1){
                                            this.uploadList.push({
                                                imgUrl: "",
                                                imgFile: "",
                                                title: Number(i) + 1 + "号"
                                            })
                                        }
                                    }
                                    break;

                                case 2:
                                    this.taskData.child_list[this.curTaskIndex].taskStatusName = "审核中...";
                                    break;

                                case 1:
                                    this.taskData.child_list[this.curTaskIndex].taskStatusName = "任务完成";
                                    break;
                            }
                        }
                        if(this.taskStatus != 1 && this.taskStatus != 2){
                            this.taskData.step_list = this.nextTaskData.step_list
                        }else{
                            if(this.taskData.child_list.length > 1 && this.curTaskIndex !== this.taskData.child_list.length){
                                this.nextTaskData = this.taskData.child_list[this.curTaskIndex].user_record_status == 2 ? this.taskData.child_list[this.curTaskIndex] : this.taskData.child_list[this.curTaskIndex + 1]
                                if(this.taskData.child_list[this.curTaskIndex + 1]){
                                    this.isHasNextTask = true
                                }
                            }else{
                                this.nextTaskData = [];
                                this.isHasNextTask = false
                            }
                        }

                        //截取文字教程中的“【需截图】”
                        let textDescData = this.taskData.child_list[this.curTaskIndex].text_desc
                        for(let i in textDescData){
                            textDescData[i] = textDescData[i].replace(/【需截图】/g, "<span style='color:" + this.taskData.main_color + "'>【需截图】</span>");
                        }
                    }
                }else{
                    this.queryData()
                    // this.$router.go(0)
                }
            },
            //切换其他任务
            switchBranch(index, item){
                this.prevTaskData = this.taskData
                this.branchActive = index

                this.taskStatus = item.user_record_status;
                this.curTaskIndex = index;
                this.taskId = item.id;
                this.recordId = item.jftask_record ? item.jftask_record.id : "";
                this.uploadList = [];
                this.taskData.step_list = '';
                if(this.taskStatus != -1){
                    //任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1
                    switch (this.taskStatus) {
                        case 3:
                            this.taskData.child_list[index].taskStatusName = "失败了...";
                            this.taskData.step_list = this.taskData.child_list[index].step_list
                            for(let i in this.taskData.step_list){
                                if(this.taskData.step_list[i].printscreen == 1){
                                    this.uploadList.push({
                                        imgUrl: "",
                                        imgFile: "",
                                        title: Number(i) + 1 + "号"
                                    })
                                }
                            }
                            break;
                        case 0:
                            this.taskData.child_list[index].taskStatusName = "进行中...";
                            this.taskData.step_list = this.taskData.child_list[index].step_list
                            for(let i in this.taskData.step_list){
                                if(this.taskData.step_list[i].printscreen == 1){
                                    this.uploadList.push({
                                        imgUrl: "",
                                        imgFile: "",
                                        title: Number(i) + 1 + "号"
                                    })
                                }
                            }
                            break;

                        case 2:
                            this.taskData.child_list[index].taskStatusName = "审核中...";
                            break;

                        case 1:
                            this.taskData.child_list[index].taskStatusName = "任务完成";
                            break;
                    }
                }
                if(this.taskStatus != 1 && this.taskStatus != 2){
                    this.taskData.step_list = item.step_list
                }else{
                    if(this.taskData.child_list.length > 1 && this.curTaskIndex + 1 !== this.taskData.child_list.length){
                        this.nextTaskData = this.taskData.child_list[this.curTaskIndex].user_record_status == 2 ? this.taskData.child_list[this.curTaskIndex] : this.taskData.child_list[this.curTaskIndex + 1]
                        if(this.taskData.child_list[this.curTaskIndex + 1]){
                            this.isHasNextTask = true
                        }
                    }else{
                        this.nextTaskData = [];
                        this.isHasNextTask = false
                    }
                }

                //截取文字教程中的“【需截图】”
                let textDescData = this.taskData.child_list[this.curTaskIndex].text_desc
                for(let i in textDescData){
                    textDescData[i] = textDescData[i].replace(/【需截图】/g, "<span style='color:" + this.taskData.main_color + "'>【需截图】</span>");
                }
            },
            // 查询任务详情数据
            queryData(){
                return new Promise((resolve, reject) => {
                    this.$api.post('api/v1/jftask/info', {
                        session_id: localStorage.getItem('sessionId'), //登录标识
                        id: this.$route.params.id || this.taskData.id, //任务ID
                    }).then( res => {
                        let colorList = res.color.split(",");
                        res.main_color = colorList[0];
                        res.second_color = colorList[1];
                        for(let i in res.child_list){
                            res.child_list[i].label_list = res.child_list[i].rights_label.split(",")
                        }
                        this.taskData = res;
                        if(!localStorage.getItem('startTask_' + this.taskData.child_list[this.curTaskIndex].id)){
                            localStorage.setItem('startTask_' + this.taskData.child_list[this.curTaskIndex].id, 'false');
                        }
                        this.startTask = localStorage.getItem('startTask_' + this.taskData.child_list[this.curTaskIndex].id);
                        this.uploadList = [];

                        this.taskData.step_list = '';
                        for(let i in this.taskData.child_list){
                            i = Number(i);
                            if(this.taskData.child_list[i].user_record_status != -1){
                                this.taskStatus = this.taskData.child_list[this.curTaskIndex].user_record_status;
                                this.taskId = this.taskData.child_list[this.curTaskIndex].id;
                                this.recordId = this.taskData.child_list[this.curTaskIndex].jftask_record ? this.taskData.child_list[this.curTaskIndex].jftask_record.id : ""

                                //任务进行中0 任务审核中2 任务失败3 任务已完成1 锁定任务-1
                                switch (this.taskStatus) {
                                    case 3:
                                        this.taskData.child_list[i].taskStatusName = "失败了...";
                                        this.taskData.step_list = this.taskData.child_list[i].step_list;
                                        for(let j in this.taskData.step_list){
                                            if(this.taskData.step_list[j].printscreen == 1){
                                                this.uploadList.push({
                                                    imgUrl: "",
                                                    imgFile: "",
                                                    title: Number(j) + 1 + "号"
                                                })
                                            }
                                        }
                                        break;
                                    case 0:
                                        this.taskData.child_list[i].taskStatusName = "进行中...";
                                        this.taskData.step_list = this.taskData.child_list[i].step_list;
                                        for(let j in this.taskData.step_list){
                                            if(this.taskData.step_list[j].printscreen == 1){
                                                this.uploadList.push({
                                                    imgUrl: "",
                                                    imgFile: "",
                                                    title: Number(j) + 1 + "号"
                                                })
                                            }
                                        }
                                        break;

                                    case 2:
                                        this.taskData.child_list[i].taskStatusName = "审核中...";
                                        break;

                                    case 1:
                                        this.taskData.child_list[i].taskStatusName = "任务完成";
                                        break;
                                }
                            }
                            if((this.taskData.child_list[this.curTaskIndex].user_record_status == 2 || this.taskData.child_list[this.curTaskIndex].user_record_status == 1) && this.taskData.child_list.length > 1){
                                this.nextTaskData = this.taskData.child_list[this.curTaskIndex].user_record_status == 2 ? this.taskData.child_list[this.curTaskIndex] : this.taskData.child_list[this.curTaskIndex + 1];
                                if(this.taskData.child_list[this.curTaskIndex + 1]){
                                    this.isHasNextTask = true
                                }
                            }
                        }

                        //截取文字教程中的“【需截图】”
                        let textDescData = this.taskData.child_list[this.curTaskIndex].text_desc
                        for(let i in textDescData){
                            textDescData[i] = textDescData[i].replace(/【需截图】/g, "<span style='color:" + res.main_color + "'>【需截图】</span>");
                        }
                        resolve(1)
                    })
                })
            }
        },
        mounted() {
            // handleScroll为页面滚动的监听回调
            window.addEventListener('scroll', this.handleScroll);

            // 监听dom渲染完成
            this.$nextTick(() => {
                // 这里fixedHeaderRoot是吸顶元素的ID
                let header = document.getElementById("fixedHeader");
                // 这里要得到top的距离和元素自身的高度
                this.offsetTop = header.offsetTop;
                this.offsetHeight = header.offsetHeight;
            });
        },
        destroyed(){
            // 移除页面滚动的监听handleScroll
            window.removeEventListener('scroll', this.handleScroll);

            // 销毁定时器
            clearInterval(this.overTimer)
        },
        created() {
            this.$api.post('api/v1/jftask/config', {}).then( res => {
                this.iconTipsContentList = res.rights_label_desc
                this.iconTipsList = res.rights_label
            })
            this.$store.commit('LoadingStatus', {isLoading: false});
            // 开启定时器 每隔5分钟调一次接口，刷新页面状态
            this.overTimer = setInterval(this.queryData(), 300000)
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        background: url(../assets/images/bg.png);
        background-size: 100vw 100vh;
        min-height: 100vh;
        overflow: hidden;
    }

    .login-main{
        border: #333333 solid to(8);
        border-bottom: none;
        border-radius: to(30) to(30) 0 0;
        position: fixed;
        bottom: 0;
        left: to(-8);
        right: to(-8);
        background: #ffffff;
        transform: translate3d(0, 100%, 0);
        transition: transform .3s;
        padding: to(56) to(56) to(36);
        z-index: 999;
        .logo{
            width: to(80);
            height: to(32);
            display: block;
            margin: to(96) auto to(32);
        }

        .tit-close {
            justify-content: space-between;
            margin-bottom: to(54);
            .login-title{
                color: #333333;
                font-size: to(32);
                font-weight: bold;
            }
            img{
                display: block;
                width: to(40);
                height: to(40);
            }
        }

        .login-card{
            background: #EEEEEE;
            border-radius: to(10);
            border: solid to(6) #333333;
            font-size: to(28);
            color: #333333;
            height: to(92);
            transition: all .3s;
            padding: to(20) to(24);
            width: 100%;
            flex: 1;
        }

        .login-card::placeholder{
            color: #333333;
        }
        .login-input:focus{
            color: #FFFFFF;
            background: #FF8455;
        }
        .login-input:focus::placeholder{
            color: #FFFFFF;
        }
        .code-box{
            justify-content: space-between;
            align-items: center;
            margin-top: to(40);
        }
        .get-code{
            width: to(188);
            height: to(80);
            background: #2795F7;
            box-shadow: inset 0 to(-10) 0 0 #2753F7;
            border-radius: to(10);
            border: to(6) solid #333333;
            font-size: to(28);
            color: #FFFFFF;
            text-align: center;
            padding-top: to(10);
            margin-left: to(40);
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
            background: #BBBBBB;
            height: to(100);
            text-align: center;
            justify-content: center;
            font-weight: bold;
            font-size: to(32);
        }
    }
    .login-main.on-show{
        transform: translate3d(0, 0, 0);
    }
    .task-warp{
        padding: to(22) to(40) to(20);
    }

    .swiper-container-horizontal > .swiper-pagination-progressbar {
        top: auto;
        bottom: 0;
    }

    .swiper-pagination-progressbar .swiper-pagination-progressbar-fill {
        background: #FF8455;
    }

    .task-card {
        border-radius: to(16);
        margin: to(56) to(40) 0;
        position: relative;
        right: to(-22);
        background: #D8D8D8;
        /*height: to(280);*/
        transition: all .3s ease-out;
        .task-item {
            width: 100%;
            border: solid to(8) #333333;
            border-radius: to(16);
            background: #FFFFFF;
            padding: to(26) to(32) to(24);
            z-index: 10;
            overflow: hidden;
            position: relative;
            top: to(-22);
            left: to(-22);
            .tit-left {
                // width: to(144);
                // height: to(36);
                font-family: "HYZhuZiMeiXinTiW";
                font-size: to(36);
            }
            .tit-right{

            }
            .giveup-task{
                font-weight: bold;
                font-size: to(28);
                text-decoration: underline;
                margin-right: to(62);
            }

            .tit-close {
                position: absolute;
                justify-content: center;
                top: to(10);
                right: 0;
                width: to(94);
                height: to(84);
                transition: all .3s ease-out;
                img{
                    display: block;
                    width: to(32);
                    height: to(32);
                }
            }

            .task-head {
                justify-content: space-between;
                -webkit-justify-content: space-between;
                color: #BBBBBB;
                font-size: to(28);
            }

            .task-main {
                justify-content: space-between;
                -webkit-justify-content: space-between;
                background: #BBBBBB;
                height: to(96);
                color: #FFFFFF;
                margin: to(26) to(-32) 0;
                padding: 0 to(32);

                img {
                    border: solid to(4) #333333;
                    border-radius: to(8);
                    width: to(60);
                    height: to(60);
                    margin-right: to(24);
                    background: #999999;
                }

                .app-name {
                    font-size: to(32);
                    font-weight: bold;
                }

                .app-reward {
                    font-size: to(26);

                    span {
                        font-family: "DIN Alternate Bold";
                        font-size: to(50);
                        font-weight: bold;
                    }
                }
            }

            .task-cont {
                margin-top: to(16);
                color: #333333;
                font-size: to(24);
                text-align: right;
                font-weight: bold;
                padding: to(8) to(6) to(4);
            }
        }
    }

    /* 红色 */
    .task-card.task-red {
        background: #FFD8CA;
        .task-main {
            background: #FF8455;
        }
    }

    /* 蓝色 */
    .task-card.task-blue {
        background: #D3EAFF;
        .task-main {
            background: #2795F7;
        }
    }

    /* 绿色 */
    .task-card.task-green {
        background: #BDECBE;
        .task-main {
            background: #56BE5F;
        }
    }
    .header-fixed{
        position: fixed;
        top: to(-200);
        left: 0;
        right: 0;
        margin-left: 0;
        margin-right: 0;
        z-index: 999;
        border-radius: 0;
        .task-item{
            left: 0;
            right: 0;
            .tit-close{
                top: to(190);
            }
            .task-cont{
                margin-right: to(52);
                text-align: left;
            }
        }
    }
    .fixed-padding{
        padding-top: to(376);
    }

    .task-branch {
        /*justify-content: space-between;*/
        margin-bottom: to(28);
        padding-bottom: to(10);
        flex-wrap: nowrap;
        overflow-y: hidden;
        overflow-x: scroll;
        .branch-item {
            background: #FFFFFF;
            border-radius: to(16);
            border: solid to(6) #333333;
            height: to(84);
            margin-right: to(38);
            box-shadow: to(10) to(10) 0 #BBBBBB;
            text-align: center;
            color: #333333;
            font-size: to(32);
            font-weight: bold;
            justify-content: center;
            padding: 0 to(18);
            white-space: nowrap;
            & > img {
                width: to(26);
                height: to(28);
                margin-left: to(8);
            }
        }
        .branch-item:last-child{
            margin-right: 0;
        }
        .branch-item.branch-active{
            color: #FFFFFF;
            background: #FF8455;
            box-shadow: to(10) to(10) 0 #FF8455 !important;
        }
        .branch-item.branch-red{
            color: #D45036;
            box-shadow: to(10) to(10) 0 #D45036;
        }
        .branch-item.branch-blue{
            background: #2795F7;
            box-shadow: to(10) to(10) 0 #2795F7;
        }
        .branch-item.branch-gray{
            background: #999999;
            box-shadow: to(10) to(10) 0 #BBBBBB;
        }
        .branch-item.branch-green{
            background: #56BE5F;
            box-shadow: to(10) to(10) 0 #56BE5F;
        }
        .branch-item.branch-yellow{
            background: #FEF766;
            box-shadow: to(10) to(10) 0 #FEF766;
        }
    }

    .detail-card{
        background: #FFFFFF;
        border-radius: to(16);
        border: solid to(8) #333333;
        box-shadow: to(20) to(20) 0 #BBBBBB;
        margin-bottom: to(40);
        padding: to(36) to(32);
        position: relative;
        overflow: hidden;
        .detail-tips{
            position: absolute;
            left: 0;
            right: 0;
            top: 0;
            height: to(64);
            justify-content: center;
            background: #FF8455;
            font-size: to(24);
            color: #FFFFFF !important;
            font-weight: bold;
            & > img{
                width: to(14);
                height: to(20);
                margin-right: to(8);
            }
        }
        .detail-head{
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: to(40);
            padding: 0 to(6);
            .task-title{
                font-size: to(24);
            }
            .task-left{
                color: #333333;
                font-size: to(24);
                flex: 1;
            }
            .task-right{
                color: #FF8455;
                font-size: to(32);
            }
        }
        .detail-cont{
            color: #999999;
            font-size: to(26);
            margin: to(-8) auto 0;
            padding: 0 to(6);
            p{
                margin-bottom: to(25);
            }
        }
        .task-tutorial{
            color: #333333;
            font-weight: bold;
            font-size: to(24);
            padding: 0 to(6);
            margin-bottom: to(26);
            & > span{
                color: #FF8455;
            }
        }
        .tutorial-warp{
            flex-wrap: wrap;
            margin-bottom: to(25);
            .tutorial-item{
                position: relative;
                border-radius: to(16);
                width: to(112);
                height: to(112);
                margin-right: to(7);
                margin-bottom: to(7);
                overflow: hidden;
            }
            .tutorial-item:nth-child(5n){
                margin-right: 0;
            }
            .tutorial-item.tutorial-active{
                .tutorial-mask{
                    border-color: #FF8455;
                }
            }
            .tutorial-img{
                width: 100%;
                height: 100%;
            }
            .tutorial-mask{
                border-radius: to(16);
                border: solid to(6) #333333;
                background:rgba(51,51,51,0.5);
                position: absolute;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                .tutorial-sequence{
                    height: 100%;
                    justify-content: center;
                    color: #FFFFFF;
                    font-size: to(40);
                    font-weight: bold;
                }
                .tutorial-star{
                    background: #FF8455;
                    padding-top: to(6);
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    justify-content: center;
                    &>img{
                        width: to(20);
                        height: to(20);
                    }
                }
            }
            .upload-item{
                margin-right: to(12);
                margin-bottom: to(12);
                .upload-img{
                    border-radius: to(16);
                    border: solid to(6) #333333;
                    width: to(112);
                    height: to(112);
                    background: #EEEEEE;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    .upload-data{
                        width: to(112);
                        height: to(112);
                    }
                    img{
                        width: to(48);
                        height: to(48);
                        display: block;
                    }
                }
                .upload-input{
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0;
                    z-index: 10;
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                }
                .upload-title{
                    color: #333333;
                    font-size: to(20);
                    margin-top: to(2);
                    text-align: center;
                }
            }
        }
        .result-warp{
            margin-top: to(16);
            border-radius: to(16);
            border: solid to(6) #333333;
            color: #333333;
            position: relative;
            min-height: to(288);
            padding: 0 to(32);
            justify-content: space-between;
            .result-title{
                font-size: to(32);
                font-weight: bold;
            }
            .result-desc{
                font-size: to(24);
            }
            .review-img{
                width: to(260);
                height: to(234);
                position: absolute;
                right: 0;
                bottom: 0;
            }
            .over-img{
                width: to(352);
                height: to(210);
                margin: auto;
            }
            .fail-img{
                width: to(344);
                height: to(276);
                margin: auto;
            }
        }
        .reason-warp{
            font-size: to(24);
            color: #D45036;
            font-weight: bold;
            margin-top: to(34);
            .reason-title{
                color: #333333;
                margin-bottom: to(20);
            }
            p{
                margin-bottom: to(16);
            }
            .reason-tips{
                font-weight: initial;
                color: #999999;
            }
        }
    }

    .detail-card.bg-gray{
        padding-top: to(100);
        *{
            color: #666666
        }
        .task-right, .task-tutorial > span{
            color: #FFFFFF !important;
        }
        .tutorial-warp .tutorial-item.tutorial-active{
            border-color: #BBBBBB;
        }
        .tutorial-warp .tutorial-mask .tutorial-star{
            background-color: #BBBBBB;
        }
    }

    .next-card{
        background: #FFFFFF;
        border-radius: to(16);
        border: solid to(8) #333333;
        box-shadow: to(20) to(20) 0 #BBBBBB;
        margin-bottom: to(40);
        font-size: to(32);
        color: #2D2D2D;
        font-weight: bold;
        padding: to(26) to(32);
        justify-content: space-between;
    }

    .form-warp {
        margin-bottom: to(24);
        padding: 0 to(6);
        .form-label {
            user-select: none;
            color: #333333;
            font-size: to(24);
            margin-bottom: to(24);
            font-weight: bold;
            span{
                color: #FF8455;
            }
        }

        .form-input {
            background: #EEEEEE;
            display: block;
            border: solid to(6) #333333;
            height: to(80);
            border-radius: to(12);
            font-size: to(24);
            font-weight: bold;
            color: #333333;
            padding: to(15) to(12);
            width: 100%;
            flex: 1;
        }
    }
    /* 按钮 */
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
        margin: to(42) auto to(0);
    }
    .page-btn.btn-yellow {
        background-image: url(../assets/images/btn_yellow.png);
    }
    .page-btn.btn-gray {
        background-image: url(../assets/images/btn_gray.png);
    }
    .page-btn.btn-blue {
        margin-top: to(42);
        background-image: url(../assets/images/btn_blue.png);
        color: #FFFFFF;
    }

    .bg-yellow{background: #FEF766 !important;}
    .bg-gray{background: #999999 !important;}
    .bg-blue{background: #2795F7 !important;color: #FFFFFF !important;}
    .bg-red{background: #D45036 !important;justify-content: center !important;}
    .bg-green{background: #56BE5F !important;justify-content: center !important;}


    .preview-popup{
        position: fixed;
        background: #0F0F0F;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 999;
        color: #EFEFEF;
        font-size: to(26);
        img{
            width: 96%;
            margin: auto;
        }
        .preview-head{
            height: 8vh;
            justify-content: center;
            font-size: to(26);
            color: #EFEFEF;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            background: #0F0F0F;
            z-index: 99;
        }
        .preview-num{
            position: absolute;
            left: to(24);
            font-size: to(28);
            font-weight: bold;
        }
        .swiper-warp{
            height: 100%;
            .swiper-cont{
                background: #0F0F0F;
                position: absolute;
                top: 0;
                bottom: to(220);
                left: 0;
                right: 0;
            }
        }
        .swiper-warp.swiper-border{
            border: solid to(8) #FF8455;
            .swiper-cont{
                top: to(8);
                left: to(8);
                right: to(8);
                bottom: to(288);
            }
            .preview-foot{
                border-left: solid to(8) #FF8455;
                border-right: solid to(8) #FF8455;
                border-bottom: solid to(8) #FF8455;
            }
        }
        .preview-tips{
            background: #FF8455;
            position: absolute;
            bottom: to(220);
            justify-content: center;
            left: 0;
            right: 0;
            height: to(68);
            span{
                color: #333333;
            }
        }
        .preview-foot{
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: to(220);
            padding: to(40) to(24) to(60);
            background: rgba(15, 15, 15, .8);
            border: solid to(8) transparent;
            border-top: none;
        }
    }

    /* 放弃任务-弹出层板块 */
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
        transform: translateY(-50%);
        border-radius: to(16);
        word-break: break-all;
        left: to(130);
        right: to(130);
        .tit-head{
            justify-content: space-between;
            .head-text{
                font-size: to(32);
                font-family: "HYZhuZiMeiXinTiW";
            }
        }
        .tit-close {
            justify-content: center;
            margin-top: to(-6);
            img{
                display: block;
                width: to(28);
                height: to(28);
            }
        }
        .logout-btn{
            background: #FF8455;
            text-align: center;
            font-weight: bold;
            font-size: to(24);
            color: #FFFFFF;
            height: to(80);
            line-height: to(80);
            margin: to(16) to(6) to(0);
        }
        .task-box {
            border: solid to(8) #333333;
            background: #FFFFFF;
            border-radius: to(16);
            width: 100%;
            color: #333333;
            padding: to(28) to(40) to(64);
            .task-title-small {
                text-align: center;
                font-size: to(32);
                margin: to(56) auto to(16);
                font-weight: bold
            }

            .task-title {
                font-size: to(48);
                text-align: center;
                font-weight: bold;
                margin-bottom: to(64)
            }
        }

        .start-task{
            margin-top: to(74);
        }
        .tips-text{
            color: #333333;
            font-size: to(24);
            font-weight: bold;
            margin-bottom: to(56);
            text-align: justify;
        }
        .start-text{
            .start-tit{
                color: #333333;
                font-size: to(24);
                font-weight: bold;
                position: relative;
                padding-left: to(40);
                margin-bottom: to(4);
                text-decoration: none;
                &:before{
                    position: absolute;
                    left: 0;
                    top: to(6);
                    content: "";
                    width: to(8);
                    height: to(8);
                    border: solid to(4) #333333;
                    background: #FF8455;
                    border-radius: 50%;
                    display: inline-block;
                }
            }
            .start-dot{
                padding-left: to(4);
                &>div{
                    width: to(8);
                    height: to(8);
                    background: #333333;
                    border-radius: 50%;
                    margin-bottom: to(12);
                    &:last-child{
                        margin-bottom: to(4);
                    }
                }
            }
        }

        .start-img{
            border: to(8) solid #FF8455;
            width: to(200);
            height: to(200);
            margin: to(48) auto 0;
        }

        .start-keyword{
            user-select: text;
            background: #EEEEEE;
            border-radius: to(8);
            padding: to(24) to(24) to(16);
            color: #999999;
            font-size: to(24);
            margin: to(48) auto 0;
            width: 100%;
            .copy-tips{
                -webkit-touch-callout: none;  /*系统默认菜单被禁用*/
                -webkit-user-select: none; /*webkit浏览器*/
                -moz-user-select: none; /*火狐*/
                user-select: none;
                margin-top: to(32);
                text-align: center;
            }
        }
    }

    .task-icon{
        margin-left: to(24);
        color: #333333;
        background: #FFF;
        font-size: to(24);
        display: flex;
        border: solid to(4) #333;
        border-radius: to(6);
        height: to(38);
        .btn-icon{
            background: #2795F7;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: solid to(4) #333;
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
            display: flex;
            align-items: center;
            padding: 0 to(10);
        }
    }
</style>
<style lang="scss">
    .swiper-container.swiper-container-horizontal{
        margin-top: 8vh;
        height: 92vh;
        .swiper-pagination.swiper-pagination-bullets{
            position: absolute;
            bottom: to(30);
            .swiper-pagination-bullet-custom{
                background: url(../assets/images/dot_01.png) no-repeat center;
                background-size: 100% 100%;
                margin: 0 to(6);
                width: to(16);
                height: to(16);
                opacity: 1;
            }
            .swiper-pagination-bullet-custom.swiper-pagination-star{
                background-image: url(../assets/images/dot_02.png);
            }
            .swiper-pagination-bullet-active{
                background-image: url(../assets/images/dot_01_cur.png);
            }
            .swiper-pagination-bullet-active.swiper-pagination-star{
                background-image: url(../assets/images/dot_02_cur.png);
            }
        }
    }
</style>
