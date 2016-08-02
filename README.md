# web-mobile-list-index-nav
web mobile list index nav, 移动web上的字母索引导航

### 依赖
Zepto

### 参数
*   `opts` objecet
*   `opts.target` 需要导航的对象（必需）
*   `opts.onNav` 导航发生时触发，传入当前的索引
*   `opts.offset` 定位偏移量，修复某些特殊情况下页面滚动不准的问题

### 说明
indexNav工具会自动寻找目标对象中的索引（DOM元素中具有`v-nav-index`属性的值作为索引序列），自动生成索引列表，具体使用可参见demo

