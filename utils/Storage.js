export const getSearchHistoryStorage=()=>{
    const searchList= wx.getStorageSync('SEARCH')
    if(searchList==null || searchList=='') return Promise.reject(0);
    return Promise.resolve(searchList);
}

export const setSearchHistoryStorage=async (value)=>{
    
    let list=[]
    try{
        const res = await getSearchHistoryStorage()
        if(res.includes(value)) return;
        if(res.length >=10){
            res.pop()
            list=res
            list.unshift(value) 
        }else{
            res.unshift(value)
            list=[...res]
        }
        wx.setStorage({
            key:'SEARCH',
            data:list
        })
    }catch(err){
        console.log("setSearchHistoryStorage-----2");

        list.push(value)
        wx.setStorage({
            key:'SEARCH',
            data:list
        })
    }
    
}