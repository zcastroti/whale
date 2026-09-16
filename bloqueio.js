
(function () { setTimeout(()=> { TestaSeAbriuDevToolsEBloqueia(); }, 1000); })();

function TestaSeAbriuDevToolsEBloqueia() {
    const tempoMinimoQueOUsuarioLevaParaResponderEmMilisegundos = 100;
    const antes = new Date();
    
    eval("debugger");
    const depois = new Date();

    if (depois - antes > tempoMinimoQueOUsuarioLevaParaResponderEmMilisegundos) {
        document.querySelector("html").remove();
    }
    else {
        setTimeout(()=> { TestaSeAbriuDevToolsEBloqueia(); }, 1000);
    }
}