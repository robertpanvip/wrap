/*
// 兼容classList
// 定义一个classList对象
function ClassList (obj) {
    this.obj = obj
}
// 提取add、remove和contains中的公共方法
function op (self, valArr, tag) {
    var className = self.obj.className
    if (tag === 2) {
        if (valArr.length === 0) throw TypeError("Failed to execute 'contains' on 'DOMTokenList': 1 argument required, but only 0 present.")
        if (typeof valArr[0] !== 'string' || !!~valArr[0].search(/\s+/g)) return false
        return !!~className.search(new RegExp(valArr[0]))
    }
    for (var i in valArr) {
        if(typeof valArr[i] !== 'string' || !!~valArr[i].search(/\s+/g)) throw TypeError('the type of value is error')
        var temp = valArr[i]
        var flag = !!~className.search(new RegExp('(\\s+)?'+temp+'(\\s+)?'))
        if (tag === 1) {
            !flag ? className += ' ' + temp : ''
        } else if (tag === 3) {
            flag ? className = className.replace(new RegExp('(\\s+)?'+temp),'') : ''
        }
    }
    self.obj.className = className
}
ClassList.prototype.add = function () {
    var self = this
    op(self, arguments, 1)
}
ClassList.prototype.contains = function () {
    var self = this
    return op(self, arguments, 2)
}
ClassList.prototype.item = function (index) {
    typeof index === 'string' ? index = parseInt(index) : ''
    if (arguments.length === 0 || typeof index !== 'number') throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument required, but only 0 present.")
    var claArr = this.obj.className.replace(/^\s+|\s+$/, '').split(/\s+/)
    var len = claArr.length
    if (index < 0 || index >= len) return null
    return claArr[index]
}
ClassList.prototype.remove = function () {
    var self = this
    op(self, arguments, 3)
}
ClassList.prototype.toggle = function (value) {
    if(typeof value !== 'string' || arguments.length === 0) throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument(string) required, but only 0 present.")
    if (arguments.length === 1) {
        this.contains(value) ? this.remove(value) : this.add(value)
        return
    }
    !arguments[1] ? this.remove(value) : this.add(value)
}
var div = document.createElement("div")
if (undefined === div.classList) {
    // 兼容ie8及以上的classList，不过对于ie8需要加上括号
    window.Element.prototype.classList = function () {
        return new ClassList(this)
    }
}*/
Object.defineProperty(window.Element.prototype, 'classList', {
    get: function () {
        var self = this

        function update(fn) {
            return function () {
                var className = self.className.replace(/^\s+|\s+$/g, ''),
                    valArr = arguments

                return fn(className, valArr)
            }
        }

        function add_rmv (className, valArr, tag) {
            for (var i in valArr) {
                if(typeof valArr[i] !== 'string' || !!~valArr[i].search(/\s+/g)) throw TypeError('the type of value is error')
                var temp = valArr[i]
                var flag = !!~className.search(new RegExp('(\\s+)?'+temp+'(\\s+)?'))
                if (tag === 1) {
                    !flag ? className += ' ' + temp : ''
                } else if (tag === 2) {
                    flag ? className = className.replace(new RegExp('(\\s+)?'+temp),'') : ''
                }
            }
            self.className = className
            return tag
        }

        return {
            add: update(function (className, valArr) {
                add_rmv(className, valArr, 1)
            }),

            remove: update(function (className, valArr) {
                add_rmv(className, valArr, 2)
            }),

            toggle: function (value) {
                if(typeof value !== 'string' || arguments.length === 0) throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument(string) required, but only 0 present.")
                if (arguments.length === 1) {
                    this.contains(value) ? this.remove(value) : this.add(value)
                    return
                }
                !arguments[1] ? this.remove(value) : this.add(value)
            },

            contains: update(function (className, valArr) {
                if (valArr.length === 0) throw TypeError("Failed to execute 'contains' on 'DOMTokenList': 1 argument required, but only 0 present.")
                if (typeof valArr[0] !== 'string' || !!~valArr[0].search(/\s+/g)) return false
                return !!~className.search(new RegExp(valArr[0]))
            }),

            item: function (index) {
                typeof index === 'string' ? index = parseInt(index) : ''
                if (arguments.length === 0 || typeof index !== 'number') throw TypeError("Failed to execute 'toggle' on 'DOMTokenList': 1 argument required, but only 0 present.")
                var claArr = self.className.replace(/^\s+|\s+$/, '').split(/\s+/)
                var len = claArr.length
                if (index < 0 || index >= len) return null
                return claArr[index]
            }
        }
    }
})