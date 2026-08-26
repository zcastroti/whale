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
  appId: "1:7604977733:web:26c3b831bf961530bea32c" };

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

// --------------------------------------------------------------------------

// Função - Criar Barra de Navegação
export function navegacao() {
  let nav = document.createElement('nav')
  document.body.prepend(nav)

  nav.innerHTML =
  `
  <a href="">Home</a>
  <a href="notas.html" class="notas">Notas</a>
  <a href="contas.html" class="contas">Contas</a>
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
  setTimeout(() => { document.querySelector('.alerta').remove() }, tempo || 1500)
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