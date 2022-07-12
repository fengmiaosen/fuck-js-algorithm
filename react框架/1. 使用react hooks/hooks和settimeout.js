// function组件和class组件本质的区别
//  示例代码
// https://codesandbox.io/s/hardcore-framework-c5rtwr?file=/src/App.js


// class 组件
class Index1 extends React.Component{
    constructor(props){
        super(props)
        this.state={
            number:0
        }
    }
    handerClick=()=>{
       for(let i = 0 ;i<5;i++){
           setTimeout(()=>{
               this.setState({ number:this.state.number+1 })
               console.log(this.state.number)
           },1000)
       }
    }

    render(){
        return <div>
            <button onClick={ this.handerClick } >num++</button>
        </div>
    }
}


// function组件
function Index2(){
    const [ num ,setNumber ] = React.useState(0)
    const handerClick=()=>{
        for(let i=0; i<5;i++ ){
           setTimeout(() => {
                setNumber(num+1)
                console.log(num)
           }, 1000)
        }
    }
    return <button onClick={ handerClick } >{ num }</button>
}
