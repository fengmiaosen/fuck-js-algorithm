

sticky
元素根据正常文档流进行定位，然后相对它的最近滚动祖先（nearest scrolling ancestor）和 containing block (最近块级祖先 nearest block-level ancestor)，包括 table-related 元素，基于top, right, bottom, 和 left的值进行偏移。偏移值不会影响任何其他元素的位置。

该值总是创建一个新的层叠上下文（stacking context）。注意，一个 sticky 元素会“固定”在离它最近的一个拥有“滚动机制”的祖先上（当该祖先的overflow 是 hidden, scroll, auto, 或 overlay时），即便这个祖先不是最近的真实可滚动祖先。这有效地抑制了任何“sticky”行为（详情见Github issue on W3C CSSWG）。


* [position](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position)
* [说说position:sticky](https://www.zhangxinxu.com/wordpress/2018/12/css-position-sticky/)