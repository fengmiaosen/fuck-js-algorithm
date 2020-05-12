
function checkUrl(url){

    try {
        new URL(url);
        return true;
    } catch(err){
        console.log('不合法的url地址');
        return false;
    }
}

let str = 'https://www.baidu.com';

console.log('is url:', checkUrl(str));