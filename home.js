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
  orderBy,
  getCountFromServer
} from './script.js'

import { navegacao , gerarIdentificador , modal , alerta , loop, removeLoop, loopTempo, paginarTabela } from './script.js'


loopTempo(500)
navegacao()

const USUARIO = localStorage.getItem('usuario')
if (!USUARIO) window.location.href = 'index.html'

// Função - Encerrar Sessão
let btnEncerrarSessao = document.querySelector('.btnEncerrarSessao')
btnEncerrarSessao.onclick = ()=> {
  window.location.href = 'index.html'
  localStorage.removeItem('usuario')
}

if (USUARIO == 'eukn') {
  let botoesFooter = document.querySelector('.botoesFooter')
  let botaoCadastrarUsuario = document.createElement('button')
  botaoCadastrarUsuario.innerHTML = `Cadastrar Usuário <i class="fa-solid fa-user-plus"></i>`
  botoesFooter.appendChild(botaoCadastrarUsuario)


  botaoCadastrarUsuario.onclick = ()=> {
    modal('Cadastrar Usuário')
    document.querySelector('.bodyModal').innerHTML =
    `
    <p>Nome</p>
    <input type="text" class="nome">
    <p>Senha</p>
    <input type="text" class="senha">
    <div><button id="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button></div>
    `

    document.querySelector('.nome').focus()

    let btnConfirmar = document.querySelector('#btnConfirmar')
    btnConfirmar.onclick = async ()=> {
      let nome = document.querySelector('.nome').value.trim()
      let senha = document.querySelector('.senha').value.trim()

      if (!nome) {
        alerta('Preencha o nome!')
        return
      }
      if (!senha) {
        alerta('Preencha a senha!')
        return
      }

      let id = gerarIdentificador()
      let usuarioREF = doc(db, 'usuarios', id)

      loop()
      await setDoc(usuarioREF, { 
        id: id,
        login: nome,
        senha: senha })
      removeLoop()

      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()

      alerta('Usuário cadastrado com sucesso!')
    }
  }
}