$(document).foundation();

// SMOOTH SCROLL

const lenis = new Lenis()
lenis.on('scroll', (e) => {
    console.log(e)
})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)



// FILTRO DE CATEGORIAS (LEGACY)

var classes = ["tag-gato", "tag-perro", "tag-pollo"];
var elms = {};
var n = {}, nclasses = classes.length;
function changeColor(classname, color) {
    var curN = n[classname];
    for (var i = 0; i < curN; i++) {
        elms[classname][i].style.color = color;
    }
}
for (var k = 0; k < nclasses; k++) {
    var curClass = classes[k];
    elms[curClass] = document.getElementsByClassName(curClass);
    n[curClass] = elms[curClass].length;
    var curN = n[curClass];
    for (var i = 0; i < curN; i++) {
        elms[curClass][i].onmouseout = function () {
            changeColor(this.className, "DimGray");
        };
        elms[curClass][i].onmouseover = function () {
            changeColor(this.className, "white");
        };
    }
};

