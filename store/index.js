import { observable,action } from "mobx-miniprogram"
import { getMusicPlayList,getHotSongList } from "../services/Music/index"
export  const SongStore=observable({
    recommendSongList:[],
    hotSongList:[],
    recommendSongMenu:[],
    fetchRecommendSongs:action(async function(musicId){
        try{
            const res=  await getMusicPlayList(musicId)
            this.recommendSongList=res.playlist
            return Promise.resolve("OK")
        }catch(err){
            return Promise.reject(err)
        } 
    }),
    fetchHotSongs:action(async function(){
        const res = await getHotSongList()
        this.hotSongList=res.playlists
     }),
     fetchRecommendMenu:action(async function(){
        const res = await getHotSongList("华语")
        this.recommendSongMenu=res.playlists
     })
})
const RankEnum={
    newRanking:3779629,
    originRanking:2884035,
    upRanking:19723756
}
export const RankSongStore=observable({
    newRanking:{},
    originRanking:{},
    upRanking:{},
    fetchRankingList:action(function(){
        const Promiseall=[]
        for(const rank in RankEnum){
            const id = RankEnum[rank]
            const promise= getMusicPlayList(id)
            Promiseall.push(promise)
            promise.then(res=>{
                this[rank]=res.playlist
            })
        }
        return Promise.all(Promiseall)
    })
})