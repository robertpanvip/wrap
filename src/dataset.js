import Proxy from './proxy'

if(!window.Element.prototype.dataset ){
    Object.defineProperty(window.Element.prototype, 'dataset', {
        get: function () {
            let self=this;
            let attrs = this.attributes,//元素的属性集合
                dataset ={},
                name,
                matchStr;
            for(let i = 0;i<attrs.length;i++){
                //是否是data- 开头
                matchStr = attrs[i].name.match(/^data-(.+)/);
                if(matchStr){
                    //data-auto-play 转成驼峰写法 autoPlay
                    name = matchStr[1].replace(/-([\da-z])/gi,function(all,letter){
                        return letter.toUpperCase();
                    });
                    dataset[name] = attrs[i].value;
                }
            }


            return new Proxy(dataset, {
                get:function(target, key) {
                    return target[key];
                },
                set:function(target, key, value) {
                    //  驼峰写法 autoPlay转成 data-auto-play
                    const name=key.replace(/([A-Z])/g,"-$1").toLowerCase();
                    self.setAttribute(`data-${name}`,value)
                    target[key] = value;
                }
            });
        }
    })
}

