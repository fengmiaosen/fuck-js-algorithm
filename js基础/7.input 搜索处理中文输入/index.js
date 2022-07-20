function jeiliu(timeout){
    var timer;
    function input(e){
    if(e.target.composing){
        return ;
    }
    if(timer){
       clearTimeout(timer);
    }
    timer = setTimeout(() => {
           console.log(e.target.value);
           timer = null;
       }, timeout); 
    }
    return input;
}

function onCompositionStart(e){
    e.target.composing = true;
}
function onCompositionEnd(e){
    //console.log(e.target)
    e.target.composing = false;
    var event = document.createEvent('HTMLEvents');
    event.initEvent('input');
    e.target.dispatchEvent(event);
}
var input_dom = document.getElementById('myinput');
input_dom.addEventListener('input',jeiliu(1000));
input_dom.addEventListener('compositionstart',onCompositionStart);
input_dom.addEventListener('compositionend',onCompositionEnd);