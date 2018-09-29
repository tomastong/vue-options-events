##vue-options-events  （基于事件总线的封装）

### 安装
```js
// 安装
npm i vue-options-events -S

```
### 引用
```js
// 引用(eg. 在工程的main.js下)
import vueOptionsEvents from 'vue-options-events'
Vue.use(vueOptionsEvents)
```
### Component A
```js
// 使用例子
new Vue({
  methods: {
    show(msg) {
      console.log('show ' + msg);
    }
  },
 
 // events 对象  推荐第一种写法，es6写法
  events: {
    hi(msg) {
      console.log(msg);
    },
    // 这里直接映射到methods中的show函数
    sayHi: 'show'
  }
  
  // events 数组 第二种写法，具名函数形式
  events: [
    function hi(msg) {
      console.log(msg);
    },
    'show'  // 去methods中寻找同名函数即可
  ]
});
```
### Component B
```js
new Vue({
  methods: {
    show(msg) {
      this.$trigger('hi', 'hello');
      // => 'hello'
      
      this.$trigger('sayHi', 'hello');
      // this.$trigger('show', 'hello'); 数组的话，直接触发函数名字即可
      // => 'show hello'
    }
  }
});
```
