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

import { navegacao , gerarIdentificador , modal , alerta , loop, removeLoop, loopTempo, paginarTabela } from './script.js'


loopTempo(500)
navegacao()
document.querySelector('.home').classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')
let usuarioREF = doc(db, "usuarios", USUARIO)
let consulta = await getDoc(usuarioREF)
let dados = consulta.data()

paginarTabela('.tabelaPessoas', 5)