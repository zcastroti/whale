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

navegacao()
document.querySelector('.despesas')?.classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')

loopTempo(400)

const hoje = new Date()
const diaAtual = hoje.getDate()
const mesAtual = hoje.getMonth() + 1
const anoAtual = hoje.getFullYear()

exibirMeses()
function exibirMeses() {
  document.querySelector('.conteudo').innerHTML =
  `
  <div class="meses">
    <div class="mes" id="Janeiro">Janeiro <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Fevereiro">Fevereiro <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Março">Março <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Abril">Abril <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Maio">Maio <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Junho">Junho <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Julho">Julho <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Agosto">Agosto <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Setembro">Setembro <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Outubro">Outubro <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Novembro">Novembro <i class="fa-solid fa-calendar-week"></i></div>
    <div class="mes" id="Dezembro">Dezembro <i class="fa-solid fa-calendar-week"></i></div>
  </div>
  `

  document.querySelector('.meses').onclick = async (e) => {
    if (!e.target.classList.contains('mes')) return

    let usuarioREF = doc(db, "usuarios", USUARIO)
    
    loop()
    let consulta = await getDoc(usuarioREF)
    removeLoop()

    let dados = consulta.data()
    let ano = dados.anoVisaoContas || 2026

    let mes = e.target.id
    listarDespesas(ano, mes)
  }

}

async function listarDespesas(a, m) {
  let ano = a
  let mes = m

  let despesasREF = collection(db, "usuarios", USUARIO, "despesas", ano, mes)
  
  loop()
  let consulta = await getDocs(despesasREF)
  removeLoop()

  modal(`${mes} de ${ano}` , 800)
  document.querySelector('.bodyModal').innerHTML = 
  `
  <div class="tabela-container">
    <table class="tabelaDespesas">
      <thead>
        <th class='col-nome'>Nome</th>
        <th class='col-valor'>Valor</th>
        <th class='col-vencimento'>Venc.</th>
        <th class='col-parcela'>Parcela</th>
        <th class='col-acao'>Ação</th>
      </thead>
      <tbody></tbody>
    </table>
  </div>
  `

  let tbody = document.querySelector('tbody')

  if (!consulta.empty) {
    consulta.forEach(docSnap => {
      let dados = docSnap.data()
      let tr = document.createElement('tr')

      let numMes;

      if (mes == 'Janeiro') { numMes = 1; }
      if (mes == 'Fevereiro') { numMes = 2 }
      if (mes == 'Março') { numMes = 3 }
      if (mes == 'Abril') { numMes = 4 }
      if (mes == 'Maio') { numMes = 5 }
      if (mes == 'Junho') { numMes = 6 }
      if (mes == 'Julho') { numMes = 7 }
      if (mes == 'Agosto') { numMes = 8 }
      if (mes == 'Setembro') { numMes = 9 }
      if (mes == 'Outubro') { numMes = 10 }
      if (mes == 'Novembro') { numMes = 11 }
      if (mes == 'Dezembro') { numMes = 12 }

      if (ano < anoAtual) 
        { tr.classList.add('corVermelho') }

      if (numMes < mesAtual) 
        { tr.classList.add('corVermelho') }

      if (numMes <= mesAtual && dados.diaVencimento < diaAtual) 
        { tr.classList.add('corVermelho') }
      
      if (dados.status == "Pago") { tr.classList.add('corVerde')}

      tr.innerHTML = 
      `
      <td class="col-nome">${dados.nome}</td>
      <td class="col-valor">R$ ${dados.valor}</td>
      <td class="col-vencimento">${dados.diaVencimento}</td>
      <td class="col-parcela">${dados.parcela}</td>
      <td class="col-acao"><button class="btnEditarDespesa" style="border: none; background: none; padding: 0px; height: auto;"><i class="fa-solid fa-gear"></i></button></td>
      `

      tr.querySelector('.btnEditarDespesa').onclick = () => { 
        editarDespesa(docSnap.id, ano, mes) 
      }

      tbody.appendChild(tr)
    })
    paginarTabela('.tabelaDespesas' , 8)

  } else { tbody.innerHTML = `<tr><td colspan="5">Nenhuma despesa em ${mes}</td></tr>` }

  adicionarDespesa(a, m)
}

function adicionarDespesa(a, m) {
  let ano = a
  let mes = m

  let btnAdicionarDespesa = document.createElement('button')
  btnAdicionarDespesa.innerHTML = `Adicionar Despesa <i class="fa-solid fa-circle-plus"></i>`
  document.querySelector('.bodyModal').appendChild(btnAdicionarDespesa)

  btnAdicionarDespesa.onclick = ()=> {
    modal("Adicionar Despesa" , 600)
    document.querySelector('.fecharModal').style.display = 'none'
    document.querySelector('.bodyModal').innerHTML =
    `
    <div class="grid10">
      <div style=" grid-column: span 10; ">
        <label>Nome</label>
        <input type="text" class="nome">
      </div>
      <div style=" grid-column: span 3; ">
        <label>Valor</label>
        <input type="number" class="valor">
      </div>
      <div style=" grid-column: span 4; ">
        <label>Dia Vencimento</label>
        <input type="number" class="diaVencimento" maxlength="2">
      </div>
      <div style=" grid-column: span 3; ">
        <label>Parcela</label>
        <input type="text" class="parcela">
      </div>
      <div style=" grid-column: span 10; ">
        <label>Observação</label>
        <input type="text" class="obs">
      </div>
    </div>
    <div style=" display: flex; gap: 10px; ">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    `

    // Cancelar
    document.querySelector('.btnCancelar').onclick = ()=> {
      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()
      listarDespesas(ano, mes) }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
      let nome = document.querySelector('.nome').value.trim()
      let valor = document.querySelector('.valor').value.trim()
      let diaVencimento = document.querySelector('.diaVencimento').value.trim()
      let parcela = document.querySelector('.parcela').value.trim()
      let obs = document.querySelector('.obs').value.trim()

      if (!nome || !valor || !diaVencimento) {
        alerta('Nome valor e dia do vencimento são obrigatórios!') 
        return }

      if (diaVencimento > 31 || diaVencimento < 1) {
        alerta('Dia de vencimento inválido!') 
        return }
    
      let id = gerarIdentificador()
      let despesaREF = doc(db, "usuarios", USUARIO, "despesas", ano, mes, id)

      loop()
      await setDoc(despesaREF, { 
        nome: nome,
        valor: valor,
        diaVencimento: diaVencimento,
        parcela: parcela || 0,
        obs: obs || '',
        status: "Pendente"
      })
        
      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()

      await listarDespesas(ano, mes)
      removeLoop()
      alerta('Despesa cadastrada com sucesso!')
    }
  }
}

async function editarDespesa(id, a, m) {
  let ano = a
  let mes = m

  let despesaREF = doc(db, "usuarios", USUARIO, "despesas", ano, mes, id)

  loop()
  let docSnap = await getDoc(despesaREF)
  removeLoop()

  let dados = docSnap.data()

  modal("Editar Despesa", 600)
  document.querySelector('.fecharModal').style.display = 'none'
  document.querySelector('.bodyModal').innerHTML =
  `
  <div class="grid10">
    <div style=" grid-column: span 10; ">
      <label>Nome</label>
      <input type="text" class="nome" value="${dados.nome}">
    </div>
    <div style=" grid-column: span 3; ">
      <label>Valor</label>
      <input type="number" class="valor" value="${dados.valor}">
    </div>
    <div style=" grid-column: span 4; ">
      <label>Dia Vencimento</label>
      <input type="number" class="diaVencimento" value="${dados.diaVencimento}" maxlength="2">
    </div>
    <div style=" grid-column: span 3; ">
      <label>Parcela</label>
      <input type="text" class="parcela" value="${dados.parcela}">
    </div>
    <div style=" grid-column: span 10; ">
      <label>Observação</label>
      <input type="text" class="obs" value="${dados.obs}">
    </div>
    <div style=" grid-column: span 10; flex-flow: row; gap: 20px">
      <div style=" display: flex; align-items: center; gap: 5px; " class="divStatusPendente">
        <input type="radio" name="status" value="Pendente">Pendente
      </div>
      <div style=" display: flex; align-items: center; gap: 5px; " class="divStatusPago">
        <input type="radio" name="status" value="Pago">Pago
        </div>
    </div>
  </div>

  <div class="btnsEditarConta" style="display: flex; gap: 10px; justify-content: space-between;">
    <div style="display: flex; gap: 10px;">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnSalvar">Salvar <i class="fa-regular fa-circle-check"></i></button>
    </div>
    <div style="display: flex; gap: 10px;">
      <button class="btnDeletar" style="background: #414141; color: white; border: none;">Excluir <i class="fa-regular fa-trash-can"></i></button>
    </div>
  </div>
  `

    if (dados.status == 'Pago') {
      document.querySelector('.divStatusPago').innerHTML =
      `
      <input type="radio" name="status" value="Pago" checked>Pago
      `
    } else {
      document.querySelector('.divStatusPendente').innerHTML =
      `
      <input type="radio" name="status" value="Pendente" checked>Pendente
      `
    }


  // Cancelar
  document.querySelector('.btnCancelar').onclick = ()=> {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()
    listarDespesas(ano, mes)
  }

  // Salvar alterações
  document.querySelector('.btnSalvar').onclick = async ()=> {
    let nome = document.querySelector('.nome').value.trim()
    let valor = document.querySelector('.valor').value.trim()
    let diaVencimento = document.querySelector('.diaVencimento').value.trim()
    let parcela = document.querySelector('.parcela').value.trim()
    let obs = document.querySelector('.obs').value.trim()
    let status = document.querySelector('input[name="status"]:checked').value

    if (!nome || !valor || !diaVencimento) {
        alerta('Nome valor e dia do vencimento são obrigatórios!') 
        return }

    if (diaVencimento > 31 || diaVencimento < 1) {
        alerta('Dia de vencimento inválido!') 
        return }


    loop()
    await updateDoc(despesaREF, { 
      nome: nome,
      valor: valor,
      diaVencimento: diaVencimento || 0,
      parcela: parcela || 0,
      obs: obs || '',
      status: status
    })

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    await listarDespesas(ano, mes)
    removeLoop()
    alerta('Despesa atualizada com sucesso!')
  }

  // Chamando Função - Deletar despesa
  document.querySelector('.btnDeletar').onclick = ()=> { deletarDespesa(docSnap.id, ano, mes) }

}

async function deletarDespesa(id, a, m){
  let ano = a
  let mes = m

  let despesaREF = doc(db, "usuarios", USUARIO, "despesas", ano, mes, id)

  modal("Deletar Despesa" , 600)
  document.querySelector('.fecharModal').style.display = 'none'
  document.querySelector('.bodyModal').innerHTML =
  `
  <p>Tem certeza que deseja deletar?</p>

  <div style=" display: flex; gap: 10px; ">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
  </div>
  `

  // Cancelar
    document.querySelector('.btnCancelar').onclick = ()=> {
      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()
      editarDespesa(id, a, m) }

  // Confirmar
  document.querySelector('.btnConfirmar').onclick = async ()=> {
    loop()
    await deleteDoc(despesaREF)
    removeLoop()
    alerta('Despesa excluída com sucesso!')

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()
    listarDespesas(ano, mes)
  }

}

