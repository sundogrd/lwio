
这个组件分为表现层(index.vue) 和 数据获取层 (smart.vue).

表现层只做界面展示和事件冒泡通知(通过EventBus)。其中数据共享使用Vue.observable()来实现，通过mixins将各个属性和相关方法注入各个子组件。(不使用provide和inject--都可以吧)

数据获取层主要响应表现层事件并处理api调用后返回数据，将表现层所需要的数据正确的传递给表现层即可，这里简单的使用$attr调用调用方传入的api方法

注意：本组件由于视图需要，所以数据结构已经固定，你需要在你自己的api方法里构造本组件所需数据结构。或者你可以重写数据层


```javascript
// 获取列表类接口返回格式
{
  list:[],
  total: 20,
  page: 2,
  pageSize: 10
}
```

```javascript
// 登录接口返回格式
{
  id: '',
  avatar: '',
  nick: ''
}
```

```javascript
// 主评论数据格式
const comment = {
  id: '2435',
  creator: {
    id: 678,
    nick: '昵称',
    imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4'
  },
  targetId: '4567', // 评论对象、文章id
  content: '测试代码',
  like: 45,
  hate: 9,
  createTime: Date.now(),
  floor: 6,
  // subComments?: SubComment[],
  extra: '{platform: "小米6"}'
}
```

```javascript
// 子评论数据格式
const subComment = {
  id: '2435',
  creator: {
    id: 678,
    nick: '字逆臣',
    imgUrl: 'https://avatars3.githubusercontent.com/u/12684886?s=40&v=4'
  },
  targetId: '4567', // 评论对象、文章id
  content: '字回复',
  commentId: '2345',
  like: 45,
  createTime: Date.now()
}
```




