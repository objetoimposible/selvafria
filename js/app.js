$(document).foundation();

// animacion de elementos

var MR = function (X) { return Math.random() * X }, TwL = TweenLite, G = document.querySelectorAll('.objeto');
function BTweens() {
    var W = window.innerWidth, H = window.innerHeight, C = 100;
    TwL.killDelayedCallsTo(BTweens);
    TwL.delayedCall(C * 4, BTweens);
    for (var i = G.length; i--;) {
        var c = C, BA = [], GWidth = G[i].offsetWidth, GHeight = G[i].offsetHeight;
        while (c--) {
            var SO = MR(1);
            BA.push({ x: MR(W - GWidth), y: MR(H - GHeight) });
        };
        if (G[i].T) {
            G[i].T.kill()
        }
        G[i].T = TweenMax.to(G[i], C * 10, { bezier: { timeResolution: 0, type: "soft", values: BA }, delay: i * 0.05, ease: Linear.easeNone });
    }
};
BTweens();
window.onresize = function () {
    TwL.killDelayedCallsTo(BTweens);
    TwL.delayedCall(0.4, BTweens);
};

// smooth scroll

const lenis = new Lenis()
lenis.on('scroll', (e) => {
    console.log(e)
})
function raf(time) {
    lenis.raf(time)
    requestAnimationFrame(raf)
}
requestAnimationFrame(raf)


// filtro de categorias

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