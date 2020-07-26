

async function sleep(time) {

    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, time)
    });
    
}

sleep(1000).then(() => {
    console.log('sleep:');
})