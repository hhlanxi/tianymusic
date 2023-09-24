import { getSongMenuTag,getHotSongList } from "../../services/Music/index"
Page({
    data:{
        songMenu:[]
    },
    onLoad(){
        this.fetchSongMenuTag()
    },
    async fetchSongMenuTag(){
        const res= await getSongMenuTag()
        const tags=res.tags
        const allPromise = []
        for(const tag of tags){
            const promise= getHotSongList(tag.name)
            allPromise.push(promise)
        }
        Promise.all(allPromise).then(res=>{
            this.setData({
                songMenu:res
            })
        })
    }
})