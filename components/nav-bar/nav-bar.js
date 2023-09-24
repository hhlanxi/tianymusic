const App = getApp()

Component({
    data:{
        statusBarHeight:20
    },
    methods:{

    },
    lifetimes:{
        attached(){
            this.setData({
                statusBarHeight:App.globalData.statusBarHeight
            })
        }
    },
    options:{
        multipleSlots:true
    }
})