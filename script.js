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
<img src="whale.png" width="200px">
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
      ${titulo}
    </div>
    <div class='mBody'>
        Conteúdo do Modal aqui...
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


