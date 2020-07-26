
// add(1); 	// 1
// add(1)(2);  	// 3
// add(1)(2)(3)  // 6
// add(1)(2, 3);   // 6
// add(1, 2)(3);   // 6
// add(1, 2, 3);   // 6

function add(){
    let args = [...arguments];
    
	let addfun = function(){
		args.push(...arguments);
		return addfun;
    }
    
	addfun.toString = function(){
		return args.reduce((a,b)=>{
			return a + b;
		});
    }
    
	return addfun;
}

console.log(add(1)(2));

console.log(add(1)(2)(3));