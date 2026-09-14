import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js"

import { 
  getFirestore, 
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
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js"

const firebaseConfig = {
  apiKey: "AIzaSyAzChmCdzNXfSx5x_gL8m69ohYcVSdfagA",
  authDomain: "projeto-bc2b5.firebaseapp.com",
  projectId: "projeto-bc2b5",
  storageBucket: "projeto-bc2b5.firebasestorage.app",
  messagingSenderId: "7604977733",
  appId: "1:7604977733:web:26c3b831bf961530bea32c" }

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export {
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
}

// Função - Criar Barra de Navegação
export function navegacao() {
  let nav = document.createElement('nav')
  document.body.prepend(nav)

  nav.innerHTML =
  `
  <a href="home.html" class="home">Home</a>
  <a href="notas.html" class="notas">Notas</a>
  <a href="despesas.html" class="despesas">Despesas</a>
  <a href="config.html" class="config">Config.</a>
  `
}

// Função - Gerar Identificador Aleatório
export function gerarIdentificador() { 
  return Math.random().toString(36).substring(2, 6) 
}

// Função - Modal
export function modal(titulo, tamMax ) {
  document.querySelector('.modal')?.remove()
  document.querySelector('.overlay')?.remove()
  
  let overlay = document.createElement('div')
  overlay.classList.add('overlay')
  document.body.prepend(overlay)

  let modal = document.createElement('div')
  modal.classList.add('modal')
  modal.style.maxWidth = `${tamMax}px`
  overlay.prepend(modal)

  modal.innerHTML = 
  `
  <div class="headModal">
    <h1>${titulo}</h1>
    <button class="fecharModal">Fechar <i class="fa-regular fa-circle-xmark"></i></button>
  </div>
  <div class="bodyModal"></div>
  <div class="footerModal"></div>
  `

  document.querySelector('.fecharModal').onclick = ()=> {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove() }
}

// Função - Alerta
export function alerta(texto , tempo) {
  document.querySelector('.alerta')?.remove()
  let alerta = document.createElement('div')
  alerta.classList.add('alerta')
  document.body.prepend(alerta)

  alerta.innerHTML = `<i class="fa-solid fa-info"></i> ${texto}`
  setTimeout(() => { document.querySelector('.alerta')?.remove() }, tempo || 1500)
}

// Função - Loop de Carregamento
export function loop() {
  let loop = document.createElement('div')
  loop.classList.add('loop')
  loop.innerHTML = '<img src="carregando.gif" class="gif" width="120px">'
  document.body.prepend(loop)
}

// Função - Remover Loop de Carregamento
export function removeLoop() { 
  document.querySelector('.loop')?.remove() 
}

// Função - Loop com Tempo
export function loopTempo(tempo) {
  let loop = document.createElement('div')
  loop.classList.add('loop')
  loop.innerHTML = '<img src="carregando.gif" class="gif" width="120px">'
  document.body.prepend(loop)
  setTimeout(() => { document.querySelector('.loop')?.remove() }, tempo)
}

// Função - Paginar Tabela
export function paginarTabela(tabelaREF, itensPorPagina = 10) {
    let tabela = document.querySelector(tabelaREF)
    if (!tabela) return

    let tbody = tabela.querySelector('tbody')
    if (!tbody) return

    const linhas = Array.from(tbody.querySelectorAll('tr'))
    let paginaAtual = 1
    const totalPaginas = Math.ceil(linhas.length / itensPorPagina) || 1

    // Encontra os botões e o texto dentro do mesmo container da tabela
    const container = document.querySelector('.tabela-container')
    let btnsPaginacaoTabela = document.createElement('div')
    btnsPaginacaoTabela.classList.add('btnsPaginacaoTabela')

    btnsPaginacaoTabela.innerHTML = 
    `
    <button class="btnVoltar">Voltar</button>
    <span class="nomePagina">Página 1 de 1</span>
    <button class="btnAvancar">Avançar</button>
    `
    container.appendChild(btnsPaginacaoTabela)
    
    let btnVoltar = container.querySelector('.btnVoltar')
    let nomePagina = container.querySelector('.nomePagina')
    let btnAvancar = container.querySelector('.btnAvancar')
    
    function atualizarExibicao() {
        const inicio = (paginaAtual - 1) * itensPorPagina
        const fim = inicio + itensPorPagina

        // Mostra apenas as linhas da página atual e oculta o restante
        linhas.forEach((linha, indice) => {
            linha.style.display = (indice >= inicio && indice < fim) ? '' : 'none'
        })

        // Atualiza o texto da página
        if (nomePagina) {
            nomePagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`
        }

        // Controla o estado visual dos botões (opcional: desativa nos limites)
        if (btnVoltar) btnVoltar.disabled = (paginaAtual === 1)
        if (btnAvancar) btnAvancar.disabled = (paginaAtual === totalPaginas)
    }

    // Evento de Voltar
    if (btnVoltar) {
      btnVoltar.addEventListener('click', () => {
          if (paginaAtual > 1) {
              paginaAtual--
              loopTempo(200)
              atualizarExibicao()
          }
      })
    }

    // Evento de Avançar
    if (btnAvancar) {
      btnAvancar.addEventListener('click', () => {
          if (paginaAtual < totalPaginas) {
              paginaAtual++
              loopTempo(200)
              atualizarExibicao()
          }
      })
    }

    // Executa a primeira vez para aplicar a paginação inicial
    atualizarExibicao()
}