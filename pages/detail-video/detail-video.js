// pages/detail-video/detail-video.js
import { getMvUrl,getMvDetail,getRecommendVideo } from "../../services/Video/index"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        url:"",
        id:"",
        mvInfo:{},
        recommendVideoList:[],
        recommendList:[],
        autoplay:false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const id = options.id
        this.setData({
            id
        })
        this.fetchMvUrl()
        this.fetchMvDetail()
        this.fetchRecommendVideo()

        wx.getNetworkType({
            success:(res)=>{
                if(res.networkType === 'wifi'){
                    this.setData({
                        autoplay:true
                    })
                }
            }
        })
    },
    async fetchMvUrl(){
       const res = await getMvUrl(this.data.id)
        this.setData({
            url:res.data.url
        })
    },
    async fetchMvDetail(){
        const res = await getMvDetail(this.data.id)
        this.setData({
            mvInfo:res.data
        })
    },
    async fetchRecommendVideo(){
        const res=await getRecommendVideo(this.data.id)
        this.setData({
            recommendList:res.data
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})