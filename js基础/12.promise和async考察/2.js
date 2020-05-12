//情形2：
function wait() {
    return new Promise(resolve =>
      setTimeout(resolve, 10 * 1000)
    )
  }
  
  async function main() {
    console.time('2');
    await wait();
    await wait();
    await wait();
    console.timeEnd('2');
  }
  main();

//   大概30秒多点，30秒是因为每个等待10秒，同步执行