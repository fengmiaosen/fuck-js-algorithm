
function promisify(func){

    return (...args) => {

        return new Promise((resolve, reject) => {
            
            func(...args, (err, res) => {
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            })
        });
    }
}
