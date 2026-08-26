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
let menuNotas = document.querySelector('.menuNotas')


// Adicionar Nota
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
            visualizarNota(id)
        }
    }
}


// Listar Notas
listarNotas()
async function listarNotas() {
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
    } else { menuNotas.innerHTML = `<p style='text-align: center;'>Nenhuma nota cadastrada!</p>`}
    removeLoop()
}

menuNotas.addEventListener('click', (e) => {
    if (e?.target) e.target.blur()
    e.preventDefault()

    let nota = e.target.closest('.nota')
    if (nota) { visualizarNota(nota.id) }
})

// Visualizar Notas
async function visualizarNota(id) {
    
    let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
    loop()
    let consulta = await getDoc(notaREF)
    removeLoop()
    let dados = consulta.data()
    
    modal(dados.nome)
    let bodyModal = document.querySelector('.bodyModal').innerHTML =
    `
    <div class="editor" contenteditable="true">
        ${dados.conteudo || ''}
    </div>
    <div class="btnsVisualizarNota" style=" display: flex; gap: 10px; ">
        <button class='btnSalvarNota'>Salvar <i class="fa-solid fa-sd-card"></i></button>
        <button class='btnRenomearNota'>Renomear <i class="fa-solid fa-feather"></i></button>
        <button class='btnDeletarNota'>Deletar <i class="fa-solid fa-trash"></i></button>
    </div>
    `

    // Chamada - Salvar Nota
    document.querySelector('.btnSalvarNota').onclick = (e)=> { salvarNota(id) }

    // Chamada - Renomear Nota
    document.querySelector('.btnRenomearNota').onclick = (e)=> { renomearNota(id, dados.nome) }

    // Chamada - Deletar Nota
    document.querySelector('.btnDeletarNota').onclick = (e)=> { deletarNota(id) }
}

async function salvarNota(id) {
    
    let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
    let consulta = await getDoc(notaREF)
    
    let novoConteudo = document.querySelector('.editor').innerHTML

    // Remove todos os atributos style="..." das tags HTML antes de salvar
    novoConteudo = novoConteudo.replace(/style="[^"]*"/gi, '')
    
    loop()
    await updateDoc(notaREF, { conteudo: novoConteudo })
    removeLoop()
    alerta('Nota salva com sucesso!')
}

async function renomearNota(id, nome) {  
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    modal('Renomear Nota')
    let bodyModal = document.querySelector('.bodyModal')
    bodyModal.innerHTML =
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
        visualizarNota(id)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
        let novoNome = document.querySelector('.novoNome').value.trim()

        loop()
        let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
        let consulta = await getDoc(notaREF)

        await updateDoc(notaREF, { nome: novoNome })
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await listarNotas()
        removeLoop()
        alerta('Nota renomeada com sucesso!')
        visualizarNota(id)
    }
}

async function deletarNota(id) {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    modal('Deletar Nota')
    let bodyModal = document.querySelector('.bodyModal')
    bodyModal.innerHTML =
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
        visualizarNota(id)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
        loop()
        let notaREF = doc(db, 'usuarios', USUARIO, 'notas', id)
        let consulta = await getDoc(notaREF)

        await deleteDoc(notaREF)
        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await listarNotas()
        removeLoop()
        alerta('Nota deletada com sucesso!')
    }
}