function fib(num) {

    let dp = []
    dp[0] = 1;
    dp[1] = 1;

    for (let i = 2; i <= num; i++) {
        dp[i] = dp[i - 1] + dp[i - 2]
    }

    return dp[num]
}
console.log('f1:', fib(20))


function fib2(num) {
    if (num < 2) {
        return 1;
    }

    return fib2(num - 1) + fib2(num - 2);
}

console.log('f2:', fib2(20))