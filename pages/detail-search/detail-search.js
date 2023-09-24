import {getsearchMusic,getHotSearchTap} from "../../services/Music/index"
import {getSearchHistoryStorage,setSearchHistoryStorage} from "../../utils/Storage"
const App=getApp()
Page({
    data:{
        focus:false,
        availableHeight:600,
        isSearch:false,
        searchMusicList:[],
        HotSearchTap:[],
        searchValue:"",
        SearchHistory:[]
    },
    onLoad(options){
      const availableHeight=App.globalData.windowHeight - 54;
      this.setData({
          availableHeight
      }),
      this.fetchHotSearchTap()
      this.getStorage()
    },
    async getStorage(){
        try{
            const res= await getSearchHistoryStorage()
            this.setData({
                SearchHistory:res
            })
        }catch(err){
            return;
        }
    },

    onSearchChange(e){
        this.timer && clearTimeout(this.timer)
        const value = e.detail
        if(value === '' || value === null){
            this.setData({
                isSearch:false
            })
            this.getStorage()
            return;
        }
        this.timer=setTimeout(()=>{
            this.setData({
                isSearch:true
            })
            setSearchHistoryStorage(value)
           this.fetchSearchMusic(value);
        },500)
    },
    async fetchSearchMusic(value){
      const res = await getsearchMusic(value)
      this.setData({
        searchMusicList:res.result.songs
      })
    },
    async fetchHotSearchTap(){
        const res= await getHotSearchTap()
        this.setData({
            HotSearchTap:res.result.hots
        })
    },
    ontaptoplay(e){
        const id = e.mark.id
        wx.navigateTo({
          url: `/pages/music-player/music-player?id=${id}`,
          success:(res)=>{
              res.eventChannel.emit('setplaylist',this.data.searchMusicList)
          }
        })
    },
    tapSearch(e){
        const searchValue = e.mark.value
        this.setData({
            searchValue
        })
        this.onSearchChange({detail:searchValue})
        
    },
    
})