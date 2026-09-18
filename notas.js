import {
  db,
  doc,
  collection,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy
} from './script.js'

import { navegacao , gerarIdentificador , modal , alerta , loop, removeLoop } from './script.js'

navegacao()
document.querySelector('.notas').classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')
if (!USUARIO) window.location.href = 'index.html'

let menuNotas = document.querySelector('.menuNotas')
let categoriaNotas = document.querySelector('.categoriaNotas')


// Carregar categorias
carregarCategorias()
async function carregarCategorias() {
    loop()
    categoriaNotas.innerHTML =
    `
    <div class="categoria categoriaAtiva">Todos</div>
    `

    let categoriasREF = collection(db, 'usuarios', USUARIO, 'categoriaNotas')
    let consulta = await getDocs(categoriasREF)
    if (!consulta.empty) {
        consulta.forEach(e => {
            let dados = e.data()
            let categoria = document.createElement('div')
            categoria.classList.add('categoria')
            categoria.innerHTML = `${dados.nome}`
            categoriaNotas.appendChild(categoria)
        })
    }
    removeLoop()
}


// identificar click (Categoria)
categoriaNotas.addEventListener('click', (e) => {
    if (e?.target) e.target.blur()
    e.preventDefault()

    let categoria = e.target.closest('.categoria')

    if (categoria) {
        let valor = categoria.textContent
        document.querySelectorAll('.categoriaAtiva').forEach(e => {
            e.classList.remove('categoriaAtiva')
            categoria.classList.add('categoriaAtiva')
        })
        filtrarNotas(valor) 
    }
})

// Filtrar notas por categoria
async function filtrarNotas(categoria) {
    loop()
    menuNotas.innerHTML = ''

    if (categoria == "Todos") {
        carregarNotas()
        removeLoop()
        return }

    let notasREF = collection(db, 'usuarios', USUARIO, 'notas')
    let consultaQ = query(notasREF, where('categoria', '==', categoria))
    let consulta = await getDocs(consultaQ)
    if (!consulta.empty) {
        consulta.forEach(e => {
            let dados = e.data()
            let nota = document.createElement('div')
            nota.classList.add('nota')
            nota.id = e.id
            nota.innerHTML = `${dados.nome}`
            menuNotas.prepend(nota)
        })
    } else { menuNotas.innerHTML = `<p style='text-align: center; grid-column: span 10;'>Nenhuma nota cadastrada!</p>`}
    removeLoop()
}


// Carregar  notas
carregarNotas()
async function carregarNotas() {
    loop()
    menuNotas.innerHTML = ''

    let notasREF = collection(db, 'usuarios', USUARIO, 'notas')
    let consulta = await getDocs(notasREF)
    if (!consulta.empty) {
        consulta.forEach(e => {
            let dados = e.data()
            let nota = document.createElement('div')
            nota.classList.add('nota')
            nota.id = e.id
            nota.innerHTML = `${dados.nome}`
            menuNotas.prepend(nota)
        })
    } else { menuNotas.innerHTML = `<p style='text-align: center; grid-column: span 10; '>Nenhuma nota cadastrada!</p>`}
    removeLoop()
}

// Adicionar nota
adicionarNota()
function adicionarNota() {
    let btnAdicionarNota = document.querySelector('.btnAdicionarNota')
    btnAdicionarNota.onclick = () => {
        modal('Adicionar Nota')
        let bodyModal = document.querySelector('.bodyModal')
        bodyModal.innerHTML =
        `
        <p>Nova Nota:</p>
        <input type="text" class="nome" maxlength="15">

        <div style=" display: flex; gap: 10px; ">
            <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
            <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
        </div>
        `

        document.querySelector('.nome').focus()

        // Cancelar
        document.querySelector('.btnCancelar').onclick = ()=> {
            document.querySelector('.modal')?.remove()
            document.querySelector('.overlay')?.remove()
        }

        // Confirmar
        document.querySelector('.btnConfirmar').onclick = async ()=> {
            let nome = document.querySelector('.nome').value.trim()
            if (!nome) return

            let id = gerarIdentificador()
            let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
            
            loop()
            await setDoc(notaREF, { nome: nome })
            removeLoop()

            document.querySelector('.modal')?.remove()
            document.querySelector('.overlay')?.remove()

            await listarNotas()
            
            alerta('Nota cadastrada com sucesso!')
            abrirNota(id)
        }
    }
}

// identificar click (Nota)
menuNotas.addEventListener('click', (e) => {
    if (e?.target) e.target.blur()
    e.preventDefault()

    let nota = e.target.closest('.nota')
    if (nota) { abrirNota(nota.id) }
})

// Abrir nota
async function abrirNota(id) {
    
    let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
    loop()
    let consulta = await getDoc(notaREF)
    removeLoop()
    let dados = consulta.data()
    
    modal(`<p class='identificador'>${notaREF.id}</p>`+ dados.nome)
    document.querySelector('.bodyModal').innerHTML =
    `
    <div class="editor" contenteditable="true">
        ${dados.conteudo || ''}
    </div>
    <div class="btnsabrirNota" style=" display: flex; gap: 10px; ">
        <button class='btnSalvarNota'>Salvar <i class="fa-solid fa-sd-card"></i></button>
        <button class='btnRenomearNota'>Renomear <i class="fa-solid fa-feather"></i></button>
        <button class='btnDeletarNota'>Deletar <i class="fa-solid fa-trash"></i></button>
    </div>
    `

    // Chamada - Salvar Nota
    document.querySelector('.btnSalvarNota').onclick = ()=> { salvarNota(id) }

    // Chamada - Renomear Nota
    document.querySelector('.btnRenomearNota').onclick = ()=> { renomearNota(id, dados.nome) }

    // Chamada - Deletar Nota
    document.querySelector('.btnDeletarNota').onclick = ()=> { deletarNota(id) }
}

// Salvar nota
async function salvarNota(id) {
    let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)

    let novoConteudo = document.querySelector('.editor').innerHTML

    // Remove todos os atributos style="..." das tags HTML antes de salvar
    novoConteudo = novoConteudo.replace(/style="[^"]*"/gi, '')
    
    loop()
    await updateDoc(notaREF, { conteudo: novoConteudo })
    removeLoop()
    alerta('Nota salva com sucesso!')
}

// Renomear nota
async function renomearNota(id, nome) {  
    modal('Renomear Nota')
    document.querySelector('.fecharModal').style.display = 'none'
    document.querySelector('.bodyModal').innerHTML =
    `
    <p>Renomear Nota:</p>
    <input type="text" value="${nome}" class="novoNome">

    <div style=" display: flex; gap: 10px; ">
        <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
        <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    `

    document.querySelector('.novoNome').focus()

    // Cancelar
    document.querySelector('.btnCancelar').onclick = ()=> {
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()
        abrirNota(id)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
        let novoNome = document.querySelector('.novoNome').value.trim()

        loop()
        let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)

        await updateDoc(notaREF, { nome: novoNome })
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await listarNotas()
        removeLoop()
        alerta('Nota renomeada com sucesso!')
        abrirNota(id)
    }
}

// Deletar nota
async function deletarNota(id) {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    modal('Deletar Nota')
    document.querySelector('.fecharModal').style.display = 'none'
    document.querySelector('.bodyModal').innerHTML =
    `
    <p>Tem certeza que deseja deletar?</p>

    <div style=" display: flex; gap: 10px; ">
        <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
        <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    `

    // Cancelar
    document.querySelector('.btnCancelar').onclick = ()=> {
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()
        abrirNota(id)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
        loop()
        let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)

        await deleteDoc(notaREF)
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await listarNotas()
        removeLoop()
        alerta('Nota deletada com sucesso!')
    }
}