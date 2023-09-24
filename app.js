// app.js
import {getSearchHistoryStorage} from "./utils/Storage"
App({
    globalData:{
        statusBarHeight:20,
        scrollHeight:500,
        windowHeight:600
    },
    onLaunch(){
        wx.getSystemInfo({
            success:(res)=>{
                this.globalData.statusBarHeight=res.statusBarHeight
                this.globalData.windowHeight=res.windowHeight
                this.globalData.scrollHeight=res.screenHeight-res.statusBarHeight-40
            }
        })
    },
   
})
