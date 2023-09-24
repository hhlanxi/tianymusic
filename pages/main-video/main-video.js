// pages/main-video/main-video.js

import { getVideoList } from "../../services/Video/index"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoList:[],
        offset:0,
        hasMore:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.fetchVideoList()
    },
    async fetchVideoList(){
        const res= await getVideoList(this.data.offset)
        const newVideoList = [...this.data.videoList,...res.data]
        this.setData({
            videoList:newVideoList
        })
        this.data.offset = this.data.videoList.length
        this.data.hasMore=res.hasMore
        
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
     async onPullDownRefresh() {
        this.setData({
            videoList:[]
        })
        this.data.hasMore=true
        this.data.offset=0
        await this.getMv()
        wx.stopPullDownRefresh()
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        if(!this.data.hasMore) return;
        this.fetchVideoList()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})