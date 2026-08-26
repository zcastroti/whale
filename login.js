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

import { navegacao , gerarIdentificador , modal , alerta , loop , removeLoop } from './script.js'


document.querySelector('.inputUsuario').focus()

let btnLogin = document.querySelector('.btnLogin')
btnLogin.onclick = ()=> { login() }
window.addEventListener('keydown', (e) => { if (e.key === 'Enter') login() })

async function login() {
  let inputUsuario = document.querySelector('.inputUsuario').value.trim().toLowerCase()
  let inputSenha = document.querySelector('.inputSenha').value.trim().toLowerCase()

  if (!inputUsuario || !inputSenha){
    alerta('Preencha todos os campos!')
    return
  }

  loop()
  let usuarios = collection(db, 'usuarios')
  let filtro = query(usuarios, where("login", "==", inputUsuario) , where("senha", "==", inputSenha))
  let consulta = await getDocs(filtro)

  if (!consulta.empty) {
    let docSnap = consulta.docs[0]
    let usuario = docSnap.data()

    localStorage.setItem('usuario', usuario.id)
    window.location.href = 'notas.html'
  } else { alerta('Usuário não encontrado ou senha incorreta!') }

}