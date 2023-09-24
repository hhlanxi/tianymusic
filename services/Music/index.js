import { musicRequest } from "../request"

export const getMusicBanners=()=>{
    return musicRequest.get({
        url:"banner",
    })
}

export const getMusicPlayList=(musicId)=>{
    return musicRequest.get({
        url:'playlist/detail',
        data:{
            id:musicId
        }
    })
}

export const getHotSongList=(cat="全部",offset=0,limit=6)=>{
    return musicRequest.get({
        url:"top/playlist",
        data:{
            cat,
            offset,
            limit
        }
    })
}

export const getSongMenuTag=()=>{
    return musicRequest.get({
        url:'playlist/hot'
    })
}

export const getsearchMusic=(keywords,limit=30,offset=0)=>{
    return musicRequest.get({
        url:'search',
        data:{
            keywords,
            limit,
            offset
        }
    })
}

export const getHotSearchTap=()=>{
    return musicRequest.get({
        url:"search/hot"
    })
}