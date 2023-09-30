import {observable,action} from "mobx-miniprogram"
import {getPlayLyric,getPlayDetail} from "../services/Player/player"
import {parseLyric} from "../utils/parse-lyric"
const audioContext = wx.createInnerAudioContext()
const circulateEnum=['play_order','play_random','play_repeat']
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
     //当前循环模式索引
     circulateNumber:0,
     //循环模式图片
     circulateImg:circulateEnum[0],
     playMediaqRequest:action(function(id){
        
        if(this.id !== id){
            this.id =id
            
            this.fetchPlayDetail(id)
            this.fetchPlayLyric(id)
            this.playAudio()
            audioContext.onCanplay(()=>{
                audioContext.play()
            })
        }
        
        audioContext.onTimeUpdate(()=>{
            if(!this.isClickSlider){
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
            if (index === this.currentLyricIndex) return
            this.currentLyricIndex= index, 
            this.currentLyricText=this.lyricInfos[index].text,
            this.lyricScrollTop=index*35 
            }
        })
        audioContext.onEnded(()=>{
            this.isPlaying=false
            this.circulateSwitch()
        })
         audioContext.onWaiting(()=>{
            audioContext.pause()
            this.isPlaying=false
        })
        //点击进度条后先暂停后播放，这样才会被监听到
        audioContext.onCanplay(()=>{
            audioContext.play()
            this.isPlaying=true
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
        this.currentPlayInfo=res.songs[0]
        this.durationTime=res.songs[0].dt
        
    }),
    //进度条点击值改变触发函数
    setsliderChange:action(function(value){
        this.isClickSlider=false
        const currentTime= value / 100 * this.durationTime
        if(audioContext.paused)  this.isPlaying=true
       
        this.currentTime=currentTime
        this.sliderValue=value
        audioContext.seek(currentTime / 1000)
    }),
    //播放按钮切换状态
    setbindPlayBack:action(function(){
        if(!audioContext.paused){
            audioContext.pause()
            this.isPlaying=false
        }else{
             audioContext.play()
            this.isPlaying=true
        }
    }),
    //进度条拖动触发
    setsliderChanging:action(function(value){
        this.isClickSlider = true
        const sliderValue =value
        const currentTime = sliderValue / 100 * this.durationTime
        this.currentTime=currentTime
        this.sliderValue=sliderValue
    }),
    playAudio(){
        const id = this.id
        const playSrc=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.src=playSrc
    },
    //循环模式图片切换
    circulateImgSwitch:action(function(){
        const index = this.circulateNumber
        if(index >= circulateEnum.length -1 ){
            this.circulateNumber=0            
        }else{
            this.circulateNumber=index + 1
        }
        const circulateImg=circulateEnum[this.circulateNumber]
        this.circulateImg=circulateImg
    }),
    //切换歌曲
    switchMusic:action(function(index){
        if(index === this.playListIndex) return;
        if(index === this.playList.length) index = 0;
        console.log(index);
        const id = this.playList[index].id
        
        this.id=id
        this.playListIndex=index

        this.fetchPlayDetail(id)
        this.fetchPlayLyric(id)
        this.playAudio()
    }),
    //上下首切换
    setdetermineSwitch:action(function(type){
            let index=this.playListIndex;
            if(index === 0 && type === 'prev'){
                index=this.playList.length-1
            }else if(index === this.playList.length -1 && type === 'next'){
                index=0
            }else if( type === 'prev'){
                index--
            }else{
                index++
            }
            this.switchMusic(index)
    }),
    //循环模式
    circulateSwitch(){
        const type = this.circulateImg
        if(type==='play_order'){ 
            this.audioEndSwitchStatus('circulate')
        }else if(type === 'play_random'){
            let index;
            index = Math.floor(Math.random()*(this.playList.length - 1))
            if(index === this.playListIndex) index=index+1;
            this.audioEndSwitchStatus('random',index)
        }
        else if(type === 'play_repeat'){
            this.currentTime=0
            this.sliderValue=0
            audioContext.play()
        }
    },
    //歌曲播放结束判断下一首播放模式
    audioEndSwitchStatus(type,index){
        if(type==='random'){
            this.switchMusic(index)
        }else if(type==='circulate'){
            this.setdetermineSwitch('next')
        }
    },
    //点击歌词切换
    tapLyricToPalyTime:action(function(time){
        const sliderValue = time / this.durationTime *100
        this.currentTime=time,
        this.sliderValue=sliderValue
        audioContext.seek(time / 1000)
    }),
    //设置歌曲列表
    setPlayList:action(function(data,playListIndex){
        this.playList=data
        this.playListIndex=playListIndex
    }),
    destroyAudio:action(function(){
        audioContext.destroy()
    })
})