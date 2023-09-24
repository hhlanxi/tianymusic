// components/area-header/area-header.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        title:{
            type:String,
            value:"默认内容"
        },
        hasShow:{
            type:Boolean,
            value:true
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        onclickmore(){
            this.triggerEvent("moreClick")
        }
    }
})
