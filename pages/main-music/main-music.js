// pages/main-music/main-music.js

import {getMusicBanners} from "../../services/Music/index"
import {querySelect} from "../../utils/query-select"
import  throttle from "../../utils/throttle"
import { createStoreBindings } from "mobx-miniprogram-bindings"
import {SongStore,RankSongStore} from "../../store/index"
import {playerStore} from "../../store/player"
const querySelectThrottle = throttle(querySelect,10)
Page({

    /**
     * 页面的初始数据
     */
    data: {
     banners:[],
     swiperitemImage:150,
     recommendSongList:[],
     rankInfo:{},
     focus:false
    },
    onClickSearch(){
        wx.navigateTo({
          url: '/pages/detail-search/detail-search',
        })
    },
    onLoad(){
        // querySelect('.player').then(res=>{
        //     console.log(res);
        // })
        this.fetchMusicBanners()
        this.storBindings=createStoreBindings(this,{
            store:SongStore,
            fields:['hotSongList','recommendSongMenu'],
            actions:['fetchRecommendSongs','fetchHotSongs','fetchRecommendMenu']
        })
        this.storBindings1=createStoreBindings(this,{
            store:RankSongStore,
            actions:['fetchRankingList']
        })
        this.playerStorBinding=createStoreBindings(this,{
            store:playerStore,
            fields:["id",
            "playList",
            "currentPlayInfo",
            "currentTime",
            "durationTime",
            "sliderValue",
            "isClickSlider",
            "popupShow",
            "isPlaying",
            "lyricInfos",
            "currentLyricIndex",
            "currentLyricText",
            "lyricScrollTop",
            "playListIndex"],
            actions:['playMediaqRequest']
        }
        )
       wx.nextTick(()=>{
        if(this.data.id!==0){
            this.playMediaqRequest()
        }
       })
    
        this.fetchRecommendSongs(3778678).then(_=>{
            this.setData({
                recommendSongList:SongStore.recommendSongList.tracks.slice(0,6)
            })
        })
        this.fetchHotSongs()
        this.fetchRecommendMenu()
        this.fetchRankingList().then(res=>{
            const newinfo={
                newRanking:res[0].playlist,
                originRanking:res[1].playlist,
                upRanking:res[2].playlist
            };
            this.setData({
                rankInfo:newinfo
            })
        })
      
    },
    async fetchMusicBanners(){
        const res = await getMusicBanners()
        this.setData({
            banners:res.banners
        })
    },
    
    onImageLoad(event){
        querySelectThrottle(".swiperimage").then(res=>{
            this.setData({
                swiperitemImage:res[0].height
            })
        })
    
    },
    onClickMore(){
        wx.navigateTo({
          url: '/pages/detail-music/detail-music?type=recommove',
        })
    },
    onUnload(){
        this.storeBindings.destroyStoreBindings();
        this.storBindings1.destroyStoreBindings()
        this.playerStorBinding.destroyStoreBindings()
    },
    onClickMenuTag(){
        wx.navigateTo({
          url: '/pages/detail-menu-tag/detail-menu-tag',
        })
    },
    ontaptoplay(e){
        const id=e.currentTarget.dataset.id
        const index=e.mark.index
        wx.navigateTo({
          url: `/pages/music-player/music-player?id=${id}`,
          success:(res)=>{
              res.eventChannel.emit('setplaylist',this.data.recommendSongList,index)
          }
        })
    }
})