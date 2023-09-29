import {observable,action} from "mobx-miniprogram"
import {getPlayLyric,getPlayDetail} from "../services/Player/player"
import {parseLyric} from "../utils/parse-lyric"
const audioContext = wx.createInnerAudioContext()

export const playerStore=observable({
    //当前播放歌曲id
    id:0,
    //播放歌单列表
    playList:[],
    //当前播放歌曲详细
    currentPlayInfo:{},
    //当前播放时间
    currentTime:0,
    //歌曲总时间
    durationTime:0,
    //滑动比例
    sliderValue:0,
    //是否在滑动进度
    isClickSlider:false,
    //弹出层
    popupShow:false,
    //是否在播放
    isPlaying:true,
    //全部歌词
    lyricInfos: [],
    //当前显示歌词索引
    currentLyricIndex: 0,
    //当前显示歌词
    currentLyricText: "",
    //滚动位置
    lyricScrollTop:0,
    //歌单列表播放索引
    playListIndex:0,
    playMediaqRequest:action(function(id){
        if(id){ this.id=id;}
        id =this.id
        this.fetchPlayDetail(id)
        this.fetchPlayLyric(id)
        const playSrc=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.src=playSrc
        audioContext.onCanplay(()=>{
            audioContext.play()
        })
        
        audioContext.onTimeUpdate(()=>{
            const currentTime= audioContext.currentTime*1000
            const sliderValue= currentTime / this.durationTime * 100

            this.currentTime=currentTime
            this.sliderValue=sliderValue

            if (!this.lyricInfos.length) return
            let index = this.lyricInfos.length - 1
            for (let i = 0; i < this.lyricInfos.length; i++) {
                const lyricItem = this.lyricInfos[i]
                if (lyricItem.time >= this.currentTime) {
                index = i - 1
                break
                }
            }
            if (index === this.data.currentLyricIndex) return
            this.currentLyricIndex= index, 
            this.currentLyricText=this.lyricInfos[index].text,
            this.lyricScrollTop=index*35
        })
        // console.log(this.id);
    }),
    //请求播放歌曲歌词详情
    fetchPlayLyric:action(async function(id){
        const res= await getPlayLyric(id)
        const lyricInfos=parseLyric(res.lrc.lyric)
        this.lyricInfos=lyricInfos
    }),
    //请求播放歌曲详情信息
    fetchPlayDetail:action(async function(id){
        const res= await getPlayDetail(id)
        this.setData({
            currentPlayInfo:res.songs[0],
            durationTime:res.songs[0].dt
        })
    }),
    //进度条点击值改变触发函数
    sliderChange:action(function(value){
        this.isClickSlider=false
        const currentTime= value / 100 * this.durationTime
        if(audioContext.paused)  this.isPlaying=true
       
        this.currentTime=currentTime
        this.sliderValue=value
        audioContext.seek(currentTime / 1000)
    }),
    //播放按钮切换状态
    bindPlayBack:action(function(){
        if(!audioContext.paused){
            audioContext.pause()
            this.isPlaying=false
        }else{
             audioContext.play()
            this.isPlaying=true
        }
    }),
    //进度条拖动触发
    sliderChanging:action(function(value){
        this.isClickSlider = true
        const sliderValue =value
        const currentTime = sliderValue / 100 * this.durationTime
        this.currentTime=currentTime
        this.sliderValue=sliderValue
    })
})