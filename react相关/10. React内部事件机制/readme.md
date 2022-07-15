在v17发布时，React内部重构了「事件机制」。

React事件不会冒泡到统一的根节点，而是每个应用（即调用ReactDOM.render的节点）的根节点。

![react V17事件机制](https://mmbiz.qpic.cn/mmbiz_png/5Q3ZxrD2qNAnVhPJT1qibFyMj8iazB6s6cjggLEicIexvsZ2c9d3ZqrpHUxw15Z9NVU8TpnslPpWQpboCMmMcic91A/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)