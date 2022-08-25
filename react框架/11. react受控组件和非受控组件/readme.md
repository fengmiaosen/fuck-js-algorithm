
### 什么是受控组件/非受控组件

在 HTML 中，表单元素如 `<input>，<textarea> 和 <select> `表单元素通常保持自己的状态，并根据用户输入进行更新。而在 React 中，可变状态一般保存在组件的 state(状态) 属性中，并且只能通过 setState() 更新。

我们可以通过使 React 的 state 成为 “单一数据源原则” 来结合这两个形式。然后渲染表单的 React 组件也可以控制在用户输入之后的行为。

这种形式，其值由 React 控制的输入表单元素称为“受控组件”。

那么相反的，值并不由 React 进行控制，该组件自己输入，减少等等，该元素成为非受控组件。

关于什么时候使用受控组件，什么时候使用非受控组件，可以查看这一篇文章：

Controlled and uncontrolled form inputs in React don't have to be complicated - Gosha Arinich (goshakkk.name)


### 参考资料

* [非受控组件](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)
* [受控组件和非受控组件](https://segmentfault.com/a/1190000040308582)