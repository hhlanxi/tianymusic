import { musicRequest } from "../request"

export const getVideoList = (offset=0,limit=20)=>{
    return musicRequest.request({
        url:"top/mv",
        data:{
            offset,
            limit
        },
        method:"get"
    })
}

export const getMvUrl=(id)=>{
   
    return musicRequest.request({
        url:"mv/url",
        data:{
            id
        },
        method:'get'
    })
}

export const getMvDetail=(id)=>{
    return musicRequest.get({
        url:"mv/detail",
        data:{
            mvid:id
        }
    })
}

export const getRecommendVideo=(id)=>{
    return musicRequest.get({
        url:'related/allvideo',
        data:{
            id
        }
    })
}