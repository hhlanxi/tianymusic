
import { getPlayDetail,getPlayLyric } from "../../services/Player/player" 
import { parseLyric } from "../../utils/parse-lyric"
const App=getApp()
const audioContext = wx.createInnerAudioContext()
const circulateEnum=['play_order','play_random','play_repeat']
Page({
    data:{
        //当前播放歌曲id
        id:0,
        //播放歌单列表
        playList:[],
        //当前播放歌曲详细
        currentPlayInfo:{},
        //滚动视口高度
        scrollHeight:500,
        //导航点击索引
        activeNumber:0,
        //导航列表
        navTitleList:['歌曲','歌词'],
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
        //当前循环模式索引
        circulateNumber:0,
        //循环模式图片
        circulateImg:circulateEnum[0],
        //全部歌词
        lyricInfos: [],
        //当前显示歌词索引
        currentLyricIndex: 0,
        //当前显示歌词
        currentLyricText: "",
        //滚动位置
        lyricScrollTop:0,
        //歌单列表播放索引
        playListIndex:0
    },
    onLoad(options){
        const eventChannel = this.getOpenerEventChannel()
        const id=options.id
       
        eventChannel.on('setplaylist',this.setplaylistfn)
        this.setData({
            id,
            scrollHeight:App.globalData.scrollHeight
        })
        this.fetchPlayDetail()
        this.fetchPlayLyric()
        this.playaduio()
        audioContext.onTimeUpdate(()=>{
            if(!this.data.isClickSlider){
                const currentTime= audioContext.currentTime*1000
                const sliderValue= currentTime / this.data.durationTime * 100
                 this.setData({
                     currentTime,sliderValue
                 })
                // 匹配歌词
                if (!this.data.lyricInfos.length) return
                let index = this.data.lyricInfos.length - 1
                for (let i = 0; i < this.data.lyricInfos.length; i++) {
                    const lyricItem = this.data.lyricInfos[i]
                    if (lyricItem.time >= this.data.currentTime) {
                    index = i - 1
                    break
                    }
                }
                if (index === this.data.currentLyricIndex) return
                this.setData({ 
                    currentLyricIndex: index, 
                    currentLyricText: this.data.lyricInfos[index].text,
                    lyricScrollTop:index*35
                    })
            }
        })
        audioContext.onEnded(()=>{
            this.setData({isPlaying:false})
            this.circulateSwitch()
        })
        //点击进度条后先暂停
        audioContext.onWaiting(()=>{
            audioContext.pause()
            this.setData({
                isPlaying:false
            })
        })
        //点击进度条后先暂停后播放，这样才会被监听到
        audioContext.onCanplay(()=>{
            audioContext.play()
            this.setData({
                isPlaying:true
            })
        })
    },
    //播放音频
    playaduio(){
        const id=this.data.id
        audioContext.src=`https://music.163.com/song/media/outer/url?id=${id}.mp3`
        audioContext.autoplay=true
    },
    //获取从歌单页面跳转传入的数据函数
    setplaylistfn(data,playListIndex){
        
        this.setData({
            playList:data,
            playListIndex
        })
    },
    //请求当前播放歌曲信息
    async fetchPlayDetail(){
        const res= await getPlayDetail(this.data.id)
        this.setData({
            currentPlayInfo:res.songs[0],
            durationTime:res.songs[0].dt
        })
    },
    //请求当前播放歌曲歌词
    async fetchPlayLyric(){
        const res = await getPlayLyric(this.data.id)
        const lyricInfos=parseLyric(res.lrc.lyric)
        this.setData({lyricInfos})
    },
    //返回
    goback(){
        wx.navigateBack()
    },
    //轮播切换触发
    swiperchange(e){
        this.setData({
            activeNumber:e.detail.current
        })
    },
    //点击导航触发
    onNavTapActive(e){
        const index=e.currentTarget.dataset.index
        this.setData({
            activeNumber:index
        })
    },
    //进度条点击值改变触发函数
    sliderChange(e){
        this.data.isClickSlider=false
        const currentTime= e.detail.value / 100 * this.data.durationTime
        if(audioContext.paused) this.setData({isPlaying:true})
        this.setData({
            currentTime,
            sliderValue:e.detail.value
        })
        audioContext.seek(currentTime / 1000)
    },
    //播放按钮切换状态
    bindPlayBack(){
        if(!audioContext.paused){
            audioContext.pause()
            this.setData({
                isPlaying:false
            })
        }else{
             audioContext.play()
             this.setData({
                 isPlaying:true
             })
        }
    },
    //进度条拖动触发
    sliderChanging(e){
        this.data.isClickSlider = true
        const sliderValue = e.detail.value
        const currentTime = sliderValue / 100 * this.data.durationTime
        this.setData({
            currentTime,
            sliderValue
        })
    },
    //歌单列表
    onTapPlayList(){
        this.setData({
            popupShow:true
        })
    },
    //弹出层
    onClosePopup(){this.setData({popupShow:false
    })},
    //循环模式切换
    onTapCirculateImg(){
        const index = this.data.circulateNumber
        if(index >= circulateEnum.length -1 ){
            this.setData({
                circulateNumber:0
            })
        }else{
            this.setData({
                circulateNumber:index + 1
            })
        }
        const circulateImg=circulateEnum[this.data.circulateNumber]
        this.setData({
            circulateImg
        })
    },
    //切换歌曲
    onSwitchMusic(e){
        let index=0
        if(e.type==='determine'){
            index=e.index
        }else{
            index=e.mark.index
        }
        if(index === this.data.playListIndex) return;
        if(index === this.data.playList.length) index = 0;
        console.log(index);
        const id = this.data.playList[index].id
        
        this.setData({id,playListIndex:index})
        this.fetchPlayDetail()
        this.fetchPlayLyric()
        this.playaduio()
        
    },
    //上一首、下一首
    determineSwitch(e){
       const type = e.mark.type;
       let index=this.data.playListIndex;
       if(index === 0 && type === 'prev'){
                index=this.data.playList.length-1
       }else if(index === this.data.playList.length -1 && type === 'next'){
                index=0
       }else if( type === 'prev'){
                index--
       }else{
                index++
       }
        this.onSwitchMusic({type:'determine',index})
    },
    circulateSwitch(){
        const type = this.data.circulateImg
        if(type==='play_order'){ 
            this.audioEndSwitchStatus('circulate')
        }else if(type === 'play_random'){
                let index;
                index = Math.floor(Math.random()*(this.data.playList.length - 1))
                if(index === this.data.playListIndex) index=index+1;
                this.audioEndSwitchStatus('random',index)
        }
        else if(type === 'play_repeat'){
            this.setData({
                currentTime:0,
                sliderValue:0
            })
            audioContext.play()
        }
    },
    audioEndSwitchStatus(type,index){
        const obj={mark:{}}
              if(type==='random'){
                obj.mark.index=index;
                this.onSwitchMusic(obj)
        }else if(type==='circulate'){
            obj.mark.type='next';
            this.determineSwitch(obj)
        }
    },
    onTapLyricToPalyTime(e){
        const time=e.mark.item.time
        const sliderValue = time / this.data.durationTime *100
        this.setData({
            currentTime:time,
            sliderValue
        })
        audioContext.seek(time / 1000)
    },
    onUnload(){
        audioContext.pause()
        // audioContext.destroy()
    }
    
})