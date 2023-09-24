

class Request{
    constructor(baseUrl){
        this.baseUrl=baseUrl
    }
    request(options){
        const {url} =options
        return new Promise((resovle,reject)=>{
            const thet= this
            wx.request({
                ...options,
                url:thet.baseUrl + url,
                success:(res)=>{
                    resovle(res.data)
                },
                fail:(err)=>{
                    reject(err)
                }
              })
        })
    }
    get(options){
        options={...options,method:"get"}
        return this.request(options)
    }
    post(options){
        options={...options,method:"post"}
        return this.request(options)
    }
}
export const musicRequest = new Request("http://codercba.com:9002/")
