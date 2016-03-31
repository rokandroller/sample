var animArray = [];
var count = 0;
var seq = 0;
$('[data-animation]').each(function () {
    seq++;
    $(this).attr('data-seq', seq);
    animArray.push({seq: $(this).attr('data-seq'), fun: $(this).attr('data-animation')});
});
function RunArray(count) {
    if (typeof animArray[count] !== 'undefined') {
        var _temp = animArray[count].seq;
        var _fun = eval(animArray[count].fun);
        var obj = $("[data-seq=" + _temp + "]");
        eval(_fun.call(obj));
    }
}
function OnAnimDone() {
    count++;
    if (count < animArray.length) {
        RunArray(count);
    } else {
        donewithslide();
    }
}
RunArray(0);