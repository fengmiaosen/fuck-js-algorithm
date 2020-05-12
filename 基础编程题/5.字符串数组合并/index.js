var arr1 = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D'];
var arr2 = ['A', 'B', 'C'];

var arr3 = arr1.concat(arr2);
var arr4 = arr3.sort();

console.log('arr4 old:', arr4);

var res = arr4.sort((a,b) => {
    if(a.charAt(0) === b.charAt(0) && a.length > b.length){
        return -1;
    } else {
        return 1;
    }
});

console.log('arr res:', res);
