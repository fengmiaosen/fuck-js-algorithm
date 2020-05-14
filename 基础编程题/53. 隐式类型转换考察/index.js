// 下面代码中 a 在什么情况下会打印 1

// var a = ?;
// if(a == 1 && a == 2 && a == 3){
//  	console.log(1);
// }

// 这题考察的应该是类型的隐式转换,考引用类型在比较运算符时候,隐式转换会调用本类型toString或valueOf方法.
function print(a){

    if(a == 1 && a == 2 && a == 3){
        console.log(1);
   }
}


var a = {
    num:0,
    // valueOf(){
    //     return ++this.num;
    // },
    toString(){
        return ++this.num;
    }
};

console.log('print:', print(a));