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
document.querySelector('.config').classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')

let usuarioREF = doc(db, "usuarios", USUARIO)
let consulta = await getDoc(usuarioREF)
let dados = consulta.data()

document.querySelector('.nomeUsuario').innerHTML += `${dados.login}`


// Função - Encerrar Sessão
let btnEncerrarSessao = document.querySelector('.btnEncerrarSessao')
btnEncerrarSessao.onclick = ()=> {
  window.location.href = 'index.html'
  localStorage.removeItem('usuario')
}

// Função - Atualização Cadastral
let btnAtualizarDados = document.querySelector('.btnAtualizarDados')
btnAtualizarDados.onclick = ()=> {
  modal('Atualização Cadastral')
  document.querySelector('.bodyModal').innerHTML =
  `
  <label for="login">Login</label>
  <input type="text" class="login" value="${dados.login}">
  <label for="senha">Senha</label>
  <input type="text" class="senha" value="${dados.senha}">

  <div style=" display: flex; gap: 10px; ">
    <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
    <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
  </div>
  `

  // Cancelar
  document.querySelector('.btnCancelar').onclick = ()=> {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove() }

  // Confirmar
  document.querySelector('.btnConfirmar').onclick = async ()=> {
    let login = document.querySelector('.login').value.trim()
    let senha = document.querySelector('.senha').value.trim()

    loop()

    await updateDoc(usuarioREF, { 
      login: login,
      senha: senha
    })
    removeLoop()

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    alerta('Dados alterados com sucesso!')
  }
}

// Função - Visão Das Contas
let btnVisaoContas = document.querySelector('.btnVisaoContas')
btnVisaoContas.onclick = ()=> {
  modal('Visão Das Contas')
  document.querySelector('.bodyModal').innerHTML =
  `
  <input type="text" class="anoVisaoContas" value="${dados.anoVisaoContas}">
  <div style=" display: flex; gap: 10px; ">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
  </div>
  `

  // Cancelar
  document.querySelector('.btnCancelar').onclick = ()=> {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove() }

  // Confirmar
  document.querySelector('.btnConfirmar').onclick = async ()=> {
    let anoVisaoContas = document.querySelector('.anoVisaoContas').value

    loop()
    await updateDoc(usuarioREF, { 
      anoVisaoContas: anoVisaoContas
    })
    removeLoop()

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()
    alerta('Dados alterados com sucesso!')
  }

}