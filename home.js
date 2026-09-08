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

let contasREF = collection(db, "usuarios", USUARIO, "contas", '2026', 'Setembro')
let consulta = await getDocs(contasREF)

let conteudo = document.querySelector('.conteudo')
let total = 0


consulta.forEach(docSnap => {
    let dados = docSnap.data()
    total = total + dados.valor
})
conteudo.innerHTML = `R$ ${total}`