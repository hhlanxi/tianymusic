// pages/detail-music/detail-music.js

import {SongStore,RankSongStore} from "../../store/index"
import { getMusicPlayList } from "../../services/Music/index"
Page({
    data:{
        showSongList:{},
        type:''
    },
    onLoad(options){
        const type=options.type
        this.setData({
            type
        })
        if(type==='rank'){
            const key=options.key
            this.setData({
                showSongList:RankSongStore[key]
            })
        }else if(type === 'recommove'){
            this.setData({
                showSongList:SongStore.recommendSongList
            })
        }else if(type === 'menu'){
            const id=options.id
            this.fetchlSongMenuListDetail(id)
        }
        // this.setNavbarTitle(this.data.showSongList.name)
    },
    setNavbarTitle(title){
        wx.setNavigationBarTitle({
          title
        })
    },
    async fetchlSongMenuListDetail(id){
      const res= await getMusicPlayList(id)
      this.setData({
          showSongList:res.playlist
      })
    },
    ontaptoplay(e){
        const id=e.mark.id
        const index=e.mark.index
        wx.navigateTo({
          url: `/pages/music-player/music-player?id=${id}`,
          success:(res)=>{
              res.eventChannel.emit('setplaylist',this.data.showSongList.tracks,index)
          }
        })
    }
})