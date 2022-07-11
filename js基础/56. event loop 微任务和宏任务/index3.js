
// async函数在await之前的代码都是同步执行的，
// 可以理解为await之前的代码属于new Promise时传入的代码，await之后的所有代码都是在Promise.then中的回调

//题目2：
async function async1(){
    console.log('async1 start');
     await async2();
     console.log('async1 end')
 }
 async function async2(){
     console.log('async2')
 }
 
 console.log('script start');
 async1();
 console.log('script end')

 /**
  * script start
  * async1 start
  * async2
  * script end
  * async1 end
  * 
  */