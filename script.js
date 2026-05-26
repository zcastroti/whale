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

// Header
let header = document.createElement('header')
document.body.prepend(header)
header.innerHTML = 
`
<a href='index.html'><img src="whale.png" width="200px"></a>
`

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

    // Função - Fechar Modal
    function fecharModal() {
        overlay.remove()
        modal.remove()
    }

    // Overlay - Fechar Modal
    overlay.onclick = ()=> { fecharModal() }
    
}

// Função - Confirm
export function confirm(texto) {
    if (document.querySelector('.confirm')) return

    // Criar Overlay Two
    let overlayTwo = document.createElement('div')
    overlayTwo.classList.add('overlayTwo')
    document.body.prepend(overlayTwo)

    // Cria Confirm
    let confirm = document.createElement('div')
    confirm.classList.add('confirm')
    document.body.prepend(confirm)
    
    confirm.innerHTML = 
    `
    <div class='cBody'>${texto}</div>
    <div class='cFooter'>
      <button>Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button>Confirmar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    `

    // Função - Fechar Modal
    function fecharModal() {
        overlayTwo.remove()
        confirm.remove()
    }

    // Overlay - Fechar Modal
    overlayTwo.onclick = ()=> { fecharModal() }
}

