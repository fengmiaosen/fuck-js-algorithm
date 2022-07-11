
function create(proto){

    function F(){

    }

    F.prototype = proto;

    return new F();
}