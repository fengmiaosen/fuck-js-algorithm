//三个任务发起的时候没有await，可以认为是同时发起了三个异步。
//之后各自await任务的结果。结果按最高耗时计算，由于三个耗时一样。所以结果是 10 * 1000ms多
// 情形1
function wait() {
    return new Promise(resolve =>
        setTimeout(resolve, 10 * 1000)
    )
}

async function main() {
    console.time();
    const x = wait();
    const y = wait();
    const z = wait();
    await x;
    await y;
    await z;
    console.timeEnd();
}
main();


//情形2：
function wait2() {
    return new Promise(resolve =>
      setTimeout(resolve, 10 * 1000)
    )
  }
  
  async function main2() {
    console.time('2');
    await wait2();
    await wait2();
    await wait2();
    console.timeEnd('2');
  }
  main2();

//   大概30秒多点，30秒是因为每个等待10秒，同步执行