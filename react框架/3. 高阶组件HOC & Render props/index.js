// 返回一个无状态的函数组件
function HOC(WrappedComponent) {
    const newProps = { type: 'HOC' };
    return props => <WrappedComponent {...props} {...newProps}/>;
  }
  
  // 返回一个有状态的 class 组件
  function HOC(WrappedComponent) {
    return class extends React.Component {
      render() {
        const newProps = { type: 'HOC' };
        return <WrappedComponent {...this.props} {...newProps}/>;
      }
    };
  }
  