const list = [1, 2, 3]
const square = num => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(num * num)
        }, 1000)
    })
}

async function test1() {
    for (let x of list) {
        const res = await square(x)
        console.log(res)
    }
}

test1()


// async function test2() {
//     for (let i = 0; i < list.length; i++) {
//         let x = list[i]
//         const res = await square(x)
//         console.log(res)
//     }
// }

// test2()