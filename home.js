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
document.querySelector('.home').classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')
