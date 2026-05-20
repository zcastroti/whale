// Header
let header = document.createElement('header')
document.body.prepend(header)
header.textContent = 'Sistema'

// Footer
let footer = document.createElement('footer')
document.body.appendChild(footer)
footer.innerHTML = `
    <i class="fa-solid fa-house"></i>
    <i class="fa-solid fa-pen-to-square"></i>
    <i class="fa-solid fa-sliders"></i>
`

document.querySelector('.btnModal').onclick = ()=> { modal('Janela do Sistema') }

function modal(titulo) {
    if (document.querySelector('.overlay')) return

    // Criar Overlay
    let overlay = document.createElement('div')
    overlay.classList.add('overlay')
    document.body.prepend(overlay)

    // Cria Modal
    let modal = document.createElement('div')
    modal.classList.add('modal')
    document.body.prepend(modal)
    
    modal.innerHTML = 
    `
    <div class='mHeader'>
        ${titulo}
        <i class="fa-solid fa-circle-xmark" style="cursor:pointer"></i>
    </div>
    <div class='mBody'>
        Conteúdo do Modal aqui...
    </div>
    <div class='mFooter'>
        <button>Confirmar</button>
    </div>
    `

    // Função - Fechar Modal
    function fecharModal() {
        overlay.remove()
        modal.remove()
    }

    // Overlay - Fechar Modal
    overlay.onclick = ()=> { fecharModal() }
    
    // Icone - Fechar Modal
    let ico_FecharModal = modal.querySelector('.fa-circle-xmark')
    ico_FecharModal.onclick = ()=> { fecharModal() }
}