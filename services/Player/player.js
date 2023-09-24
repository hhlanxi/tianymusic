import { musicRequest } from "../request"

export const getPlayDetail=(ids)=>{
    return musicRequest.get({
        url:"song/detail",
        data:{
            ids
        }
    })
}

export const getPlayLyric=(id)=>{
    return musicRequest.get({
        url:"lyric",
        data:{
            id
        }
    })
}