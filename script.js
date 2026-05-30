import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query, 
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAzChmCdzNXfSx5x_gL8m69ohYcVSdfagA",
  authDomain: "projeto-bc2b5.firebaseapp.com",
  projectId: "projeto-bc2b5",
  storageBucket: "projeto-bc2b5.firebasestorage.app",
  messagingSenderId: "7604977733",
  appId: "1:7604977733:web:26c3b831bf961530bea32c" };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy };

// --------------------------------------------------------------------------

// Gerar ID
export function gerarID() { return Math.random().toString(36).substring(2, 6); }

// Função - Modal
export function modal(titulo) {
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
    <i class="fa-regular fa-font-awesome"></i>
    ${titulo}
  </div>
  <div class='mBody'>
      Conteúdo do Modal aqui...
  </div>
  <div class='mFooter'>
  </div>
  `

// Função - Fechar Confirm
  function fecharModal() {
    overlay.remove()
    modal.remove()
  }

  // Clique no Overlay - Fechar Modal
  overlay.onclick = fecharModal

}

// Função - Confirm
export function confirm(texto) {
    if (document.querySelector('.confirm')) return

    // Criar Overlay Confirm
    let overlayConfirm = document.createElement('div')
    overlayConfirm.classList.add('overlayConfirm')
    document.body.prepend(overlayConfirm)

    // Cria Confirm
    let confirm = document.createElement('div')
    confirm.classList.add('confirm')
    document.body.prepend(confirm)
    
    confirm.innerHTML = 
    `
    <div class='cBody'>${texto}</div>
    <div class='cFooter'>
      <button class='cancelar' title='Tecle ESC'>Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class='confirmar'>Confirmar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    `

  // Função - Fechar Confirm
  function fecharConfirm() {
    overlayConfirm.remove()
    confirm.remove()
  }

  // Botão Cancelar - Fechar Confirm
  document.querySelector('.cancelar').onclick = fecharConfirm

  // Clique no Overlay - Fechar Confirm
  overlayConfirm.onclick = fecharConfirm 

  // Clique na Tecla ESC - Fechar Confirm
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') fecharConfirm() })

}

// Header
let header = document.createElement('header')
document.body.prepend(header)
header.innerHTML = 
`
<a href='index.html'><img src="whale.png" width="250px"></a>
`

// Navegação
let nav = document.createElement('nav')
document.body.prepend(nav)
nav.innerHTML = 
`
<button class='gerencial'><i class="fa-solid fa-gear"></i></button>
`

function categoria() {
  modal('Gerencial')

  document.querySelector('.mBody').innerHTML = 
  `
  <div class="categoriaHeader">
    <span class='categoria'>Categoria A</span>
    <span class='categoria'>Categoria B</span>
    <span class='categoria ativo'>Categoria C</span>
    <span class='categoria'>Categoria D</span>
  </div>
  <div class="categoriaBody">
    Lorem ipsum, dolor sit amet consectetur adipisicing elit. Excepturi accusantium omnis sapiente quam! Voluptates ad unde fuga sapiente officiis, adipisci fugit recusandae reprehenderit saepe eveniet, dolore voluptas inventore ut possimus?
  </div>
  `
exibirCategoria();

function exibirCategoria() {
  let categorias = document.querySelectorAll('.categoria')

  categorias.forEach((botao) => {
    botao.addEventListener('click', (e) => {

      let categoria = e.target.textContent



      console.log(categoria)
    })
  })
}


}

document.querySelector('.gerencial').onclick = categoria