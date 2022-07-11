* 普通的for 等于同一个块作用域连续await
* forEach的回调是一个个单独的函数，跟其他回调同时执行，互不干扰

```js
function test() {
    list.forEach(async x=> {
      const res = await square(x)
      console.log(res)
    })

    //forEach循环等于三个匿名函数;
    (async (x) => {
        const res = await square(x)
        console.log(res)
    })(1);
    (async (x) => {
        const res = await square(x)
        console.log(res)
    })(2);
    (async (x) => {
        const res = await square(x)
        console.log(res)
    })(3);

    // 上面的任务是同时进行
  }

  async function test() {
    for (let x of list) {
      const res = await square(x)
      console.log(res)
    }
  }
  //等价于

  async function test() {
      const res = await square(1)
      console.log(res)
      const res2 = await square(2)
      console.log(res)
      const res3 = await square(3)
      console.log(res)
  }
```