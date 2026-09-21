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

// Configurações da categoria
let btnConfigCategoria = document.querySelector('.btnConfigCategoria')
btnConfigCategoria.onclick = async () => {

    modal('Categorias de Notas')

    let bodyModal = document.querySelector('.bodyModal')

    bodyModal.innerHTML = 
    `
        <div style="
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        ">

            <button class="btnNovaCategoria">
                Adicionar
                <i class="fa-solid fa-plus"></i>
            </button>
        </div>

        <div class="listaCategorias" style="
            display: flex;
            flex-direction: column;
            gap: 5px;
            max-height: 350px;
            overflow-y: auto;
        ">
            <p style="text-align: center;">Carregando...</p>
        </div>
    `

    await listarCategoriasConfig()

    // Adicionar categoria
    document.querySelector('.btnNovaCategoria').onclick = () => {
        adicionarCategoria()
    }
}

// Listar categorias dentro do modal de configuração
async function listarCategoriasConfig () {

    let lista = document.querySelector('.listaCategorias')

    lista.innerHTML = ''

    let categoriasREF = collection(
        db,
        'usuarios',
        USUARIO,
        'categoriaNotas'
    )

    loop()
    let consulta = await getDocs(categoriasREF)
    removeLoop()

    if (consulta.empty) {
        lista.innerHTML = `
            <p style="text-align: center; padding: 20px;">
                Nenhuma categoria cadastrada.
            </p>
        `
        return
    }

    consulta.forEach(e => {

        let dados = e.data()

        let item = document.createElement('div')

        item.className = 'itemCategoria'

        item.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            padding: 8px 10px;
            background: white;
            border: 1px solid #e2e2e2;
            border-radius: 6px;
        `

        item.innerHTML = `
            <span class="nomeCategoria" style="
                flex: 1;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            ">
                ${dados.nome}
            </span>

            <div style="
                display: flex;
                gap: 5px;
            ">
                <button
                    class="btnRenomearCategoria"
                    title="Renomear">
                    <i class="fa-solid fa-pen"></i>
                </button>

                <button
                    class="btnExcluirCategoria"
                    title="Excluir">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `

        // Renomear
        item.querySelector('.btnRenomearCategoria').onclick = () => {
            renomearCategoria(e.id, dados.nome)
        }

        // Excluir
        item.querySelector('.btnExcluirCategoria').onclick = () => {
            excluirCategoria(e.id, dados.nome)
        }

        lista.appendChild(item)
    })
}

// Adicionar categoria
async function adicionarCategoria () {

    modal('Adicionar Categoria')

    let bodyModal = document.querySelector('.bodyModal')

    bodyModal.innerHTML = `
        <p>Nova Categoria:</p>

        <input
            type="text"
            class="nome"
            maxlength="15"
            placeholder="Nome da categoria"
        >

        <div style="
            display: flex;
            gap: 10px;
        ">
            <button class="btnCancelar">
                Cancelar
                <i class="fa-regular fa-circle-xmark"></i>
            </button>

            <button class="btnConfirmar">
                Confirmar
                <i class="fa-regular fa-circle-check"></i>
            </button>
        </div>
    `

    let input = document.querySelector('.nome')

    input.focus()

    // Cancelar
    document.querySelector('.btnCancelar').onclick = () => {

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        // Volta para configuração das categorias
        btnConfigCategoria.click()
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async () => {

        let nome = input.value.trim()

        if (!nome) {
            alerta('Informe o nome da categoria!')
            input.focus()
            return
        }

        // Verificar categoria duplicada
        let categoriasREF = collection(
            db,
            'usuarios',
            USUARIO,
            'categoriaNotas'
        )

        let consulta = await getDocs(categoriasREF)

        let existe = consulta.docs.some(e => {
            return e.data().nome.toLowerCase() === nome.toLowerCase()
        })

        if (existe) {
            alerta('Essa categoria já existe!')
            input.focus()
            return
        }

        let id = gerarIdentificador()

        let categoriaREF = doc(
            db,
            'usuarios',
            USUARIO,
            'categoriaNotas',
            id
        )

        loop()

        await setDoc(categoriaREF, {
            nome: nome
        })

        removeLoop()

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await carregarCategorias()

        alerta('Categoria cadastrada com sucesso!')

        // Abrir novamente configuração
        btnConfigCategoria.click()
    }
}

// Renomear categoria
async function renomearCategoria(id, nomeAtual) {

    modal('Renomear Categoria')

    document.querySelector('.bodyModal').innerHTML = `
        <p>Renomear Categoria:</p>

        <input
            type="text"
            value="${nomeAtual}"
            class="novoNome"
            maxlength="15"
        >

        <div style="
            display: flex;
            gap: 10px;
        ">
            <button class="btnCancelar">
                Cancelar
                <i class="fa-regular fa-circle-xmark"></i>
            </button>

            <button class="btnConfirmar">
                Confirmar
                <i class="fa-regular fa-circle-check"></i>
            </button>
        </div>
    `

    let input = document.querySelector('.novoNome')

    input.focus()
    input.select()

    // Cancelar
    document.querySelector('.btnCancelar').onclick = () => {

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        btnConfigCategoria.click()
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async () => {

        let novoNome = input.value.trim()

        if (!novoNome) {
            alerta('Informe o novo nome!')
            input.focus()
            return
        }

        if (novoNome === nomeAtual) {
            document.querySelector('.modal')?.remove()
            document.querySelector('.overlay')?.remove()

            btnConfigCategoria.click()
            return
        }

        // Verificar duplicidade
        let categoriasREF = collection(
            db,
            'usuarios',
            USUARIO,
            'categoriaNotas'
        )

        let categorias = await getDocs(categoriasREF)

        let existe = categorias.docs.some(e => {
            return e.data().nome.toLowerCase() === novoNome.toLowerCase()
                && e.id !== id
        })

        if (existe) {
            alerta('Essa categoria já existe!')
            input.focus()
            return
        }

        loop()

        // Atualizar nome da categoria
        let categoriaREF = doc(
            db,
            'usuarios',
            USUARIO,
            'categoriaNotas',
            id
        )

        await updateDoc(categoriaREF, {
            nome: novoNome
        })

        // Atualizar as notas que utilizam essa categoria
        let notasREF = collection(
            db,
            'usuarios',
            USUARIO,
            'notas'
        )

        let consultaNotas = await getDocs(
            query(
                notasREF,
                where('categoria', '==', nomeAtual)
            )
        )

        let atualizacoes = []

        consultaNotas.forEach(e => {

            let notaREF = doc(
                db,
                'usuarios',
                USUARIO,
                'notas',
                e.id
            )

            atualizacoes.push(
                updateDoc(notaREF, {
                    categoria: novoNome
                })
            )
        })

        await Promise.all(atualizacoes)

        removeLoop()

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await carregarCategorias()

        alerta('Categoria renomeada com sucesso!')

        btnConfigCategoria.click()
    }
}

// Excluir categoria
async function excluirCategoria(id, nome) {

    modal('Excluir Categoria')

    document.querySelector('.bodyModal').innerHTML = `
        <p>
            Tem certeza que deseja excluir a categoria
            <b>"${nome}"</b>?
        </p>

        <p style="
            font-size: 13px;
            color: #666;
        ">
            As notas dessa categoria não serão excluídas.
        </p>

        <div style="
            display: flex;
            gap: 10px;
        ">
            <button class="btnCancelar">
                Cancelar
                <i class="fa-regular fa-circle-xmark"></i>
            </button>

            <button class="btnConfirmar">
                Excluir
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `

    // Cancelar
    document.querySelector('.btnCancelar').onclick = () => {

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        btnConfigCategoria.click()
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async () => {

        loop()

        // Excluir categoria
        let categoriaREF = doc(
            db,
            'usuarios',
            USUARIO,
            'categoriaNotas',
            id
        )

        await deleteDoc(categoriaREF)

        // Limpar categoria das notas
        let notasREF = collection(
            db,
            'usuarios',
            USUARIO,
            'notas'
        )

        let consultaNotas = await getDocs(
            query(
                notasREF,
                where('categoria', '==', nome)
            )
        )

        let atualizacoes = []

        consultaNotas.forEach(e => {

            let notaREF = doc(
                db,
                'usuarios',
                USUARIO,
                'notas',
                e.id
            )

            atualizacoes.push(
                updateDoc(notaREF, {
                    categoria: ''
                })
            )
        })

        await Promise.all(atualizacoes)

        removeLoop()

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await carregarCategorias()
        await carregarNotas()

        alerta('Categoria excluída com sucesso!')

        btnConfigCategoria.click()
    }
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
        <input type="text" class="nome" maxlength="15" placeholder="Nome da anotação">

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

            carregarNotas()
            
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
    <div class="botoes" style=" display: flex; gap: 10px; ">
        <button class='btnSalvarNota'>Salvar <i class="fa-solid fa-sd-card"></i></button>
        <button class='btnRenomearNota'>Renomear <i class="fa-solid fa-feather"></i></button>
        <button class='btnDeletarNota'>Deletar <i class="fa-solid fa-trash"></i></button>
        <select id="selectCategorias" style='margin-left: auto'>
           <option value="${dados.categoria || ''}">${dados.categoria || ''}</option>
        </select>
    </div>
    `

    let selectCategorias = document.querySelector('#selectCategorias')
    let categoriasREF = collection(db, 'usuarios', USUARIO, 'categoriaNotas')
    let consultaCategorias = await getDocs(categoriasREF)
    if (!consultaCategorias.empty) {
        consultaCategorias.forEach(e => {
            let dadosCategoria = e.data()
            let categoria = document.createElement('option')
            categoria.value = dadosCategoria.nome
            categoria.innerHTML = `${dadosCategoria.nome}`
            selectCategorias.appendChild(categoria)

            if (categoria.value == dados.categoria) {
                categoria.remove()
            }
        })
    }

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
    const select = document.getElementById('selectCategorias');

    // Pega o valor da opção selecionada
    const valorSelecionado = select.value;
    let novoConteudo = document.querySelector('.editor').innerHTML

    // Remove todos os atributos style="..." das tags HTML antes de salvar
    novoConteudo = novoConteudo.replace(/style="[^"]*"/gi, '')
    
    loop()
    await updateDoc(notaREF, {
        categoria:  valorSelecionado,
        conteudo: novoConteudo })
    await carregarNotas()
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

        await carregarNotas()
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

        await carregarNotas()
        removeLoop()
        alerta('Nota deletada com sucesso!')
    }
}
