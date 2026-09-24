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
if (!USUARIO) window.location.href = 'index.html'

loopTempo(400)

const hoje = new Date()
const diaAtual = hoje.getDate()
const mesAtual = hoje.getMonth() + 1
const anoAtual = hoje.getFullYear()

exibirMeses()
function exibirMeses() {
  document.querySelector('.meses').innerHTML =
  `
    <div class="mes" id="Janeiro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Janeiro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalJaneiro">Carregando</p>
    </div>
    <div class="mes" id="Fevereiro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Fevereiro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalFevereiro">Carregando</p>
    </div>
    <div class="mes" id="Março">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Março <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalMarço">Carregando</p>
    </div>
    <div class="mes" id="Abril">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Abril <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalAbril">Carregando</p>
    </div>
    <div class="mes" id="Maio">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Maio <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalMaio">Carregando</p>
    </div>
    <div class="mes" id="Junho">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Junho <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalJunho">Carregando</p>
    </div>
    <div class="mes" id="Julho">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Julho <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalJulho">Carregando</p>
    </div>
    <div class="mes" id="Agosto">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Agosto <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalAgosto">Carregando</p>
    </div>
    <div class="mes" id="Setembro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Setembro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalSetembro">Carregando</p>
    </div>
    <div class="mes" id="Outubro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Outubro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalOutubro">Carregando</p>
    </div>
    <div class="mes" id="Novembro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Novembro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalNovembro">Carregando</p>
    </div>
    <div class="mes" id="Dezembro">
      <div style="display: flex; align-items: center; flex-flow: row-reverse; gap: 5px;">Dezembro <i class="fa-solid fa-calendar-week"></i></div>
      <p style="font-size: 13px;" class="totalDezembro">Carregando</p>
    </div>
  `
  carregarQtdDespesas()

  document.querySelector('.meses').onclick = async (e) => {
    const mesElemento = e.target.closest('.mes')

    if (!mesElemento) return

    let usuarioREF = doc(db, "usuarios", USUARIO)
    
    loop()
    let consulta = await getDoc(usuarioREF)
    removeLoop()

    let dados = consulta.data()
    let ano = dados.anoDespesas || "2026"

    let mes = mesElemento.id
    listarDespesas(ano, mes)
  }

}

async function carregarQtdDespesas() {

  let usuarioREF = doc(db, "usuarios", USUARIO)
    
  loop()
  let consulta = await getDoc(usuarioREF)
  removeLoop()

  let dados = consulta.data()
  let ano = dados.anoDespesas || "2026"


  // Total Janeiro
  let colecaoJaneiro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Janeiro')
  loop()
  let despesasJaneiro = await getDocs(colecaoJaneiro)
  removeLoop()
  let totalJaneiro = 0
  despesasJaneiro.forEach( () => { totalJaneiro = totalJaneiro + 1 })
  document.querySelector('.totalJaneiro').innerHTML = `${totalJaneiro} Despesas`


  // Total Fevereiro
  let colecaoFevereiro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Fevereiro')
  loop()
  let despesasFevereiro = await getDocs(colecaoFevereiro)
  removeLoop()
  let totalFevereiro = 0
  despesasFevereiro.forEach( () => { totalFevereiro = totalFevereiro + 1 })
  document.querySelector('.totalFevereiro').innerHTML = `${totalFevereiro} Despesas`

  // Total Março
  let colecaoMarço = collection(db, "usuarios", USUARIO, "despesas", ano, 'Março')
  loop()
  let despesasMarço = await getDocs(colecaoMarço)
  removeLoop()
  let totalMarço = 0
  despesasMarço.forEach( () => { totalMarço = totalMarço + 1 })
  document.querySelector('.totalMarço').innerHTML = `${totalMarço} Despesas`

  // Total Abril
  let colecaoAbril = collection(db, "usuarios", USUARIO, "despesas", ano, 'Abril')
  loop()
  let despesasAbril = await getDocs(colecaoAbril)
  removeLoop()
  let totalAbril = 0
  despesasAbril.forEach( () => { totalAbril = totalAbril + 1 })
  document.querySelector('.totalAbril').innerHTML = `${totalAbril} Despesas`

  // Total Maio
  let colecaoMaio = collection(db, "usuarios", USUARIO, "despesas", ano, 'Maio')
  loop()
  let despesasMaio = await getDocs(colecaoMaio)
  removeLoop()
  let totalMaio = 0
  despesasMaio.forEach( () => { totalMaio = totalMaio + 1 })
  document.querySelector('.totalMaio').innerHTML = `${totalMaio} Despesas`

  // Total Junho
  let colecaoJunho = collection(db, "usuarios", USUARIO, "despesas", ano, 'Junho')
  loop()
  let despesasJunho = await getDocs(colecaoJunho)
  removeLoop()
  let totalJunho = 0
  despesasJunho.forEach( () => { totalJunho = totalJunho + 1 })
  document.querySelector('.totalJunho').innerHTML = `${totalJunho} Despesas`

  // Total Julho
  let colecaoJulho = collection(db, "usuarios", USUARIO, "despesas", ano, 'Julho')
  loop()
  let despesasJulho = await getDocs(colecaoJulho)
  removeLoop()
  let totalJulho = 0
  despesasJulho.forEach( () => { totalJulho = totalJulho + 1 })
  document.querySelector('.totalJulho').innerHTML = `${totalJulho} Despesas`

  // Total Agosto
  let colecaoAgosto = collection(db, "usuarios", USUARIO, "despesas", ano, 'Agosto')
  loop()
  let despesasAgosto = await getDocs(colecaoAgosto)
  removeLoop()
  let totalAgosto = 0
  despesasAgosto.forEach( () => { totalAgosto = totalAgosto + 1 })
  document.querySelector('.totalAgosto').innerHTML = `${totalAgosto} Despesas`

  // Total Setembro
  let colecaoSetembro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Setembro')
  loop()
  let despesasSetembro = await getDocs(colecaoSetembro)
  removeLoop()
  let totalSetembro = 0
  despesasSetembro.forEach( () => { totalSetembro = totalSetembro + 1 })
  document.querySelector('.totalSetembro').innerHTML = `${totalSetembro} Despesas`

  // Total Outubro
  let colecaoOutubro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Outubro')
  loop()
  let despesasOutubro = await getDocs(colecaoOutubro)
  removeLoop()
  let totalOutubro = 0
  despesasOutubro.forEach( () => { totalOutubro = totalOutubro + 1 })
  document.querySelector('.totalOutubro').innerHTML = `${totalOutubro} Despesas`

  // Total Novembro
  let colecaoNovembro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Novembro')
  loop()
  let despesasNovembro = await getDocs(colecaoNovembro)
  removeLoop()
  let totalNovembro = 0
  despesasNovembro.forEach( () => { totalNovembro = totalNovembro + 1 })
  document.querySelector('.totalNovembro').innerHTML = `${totalNovembro} Despesas`

  // Total Dezembro
  let colecaoDezembro = collection(db, "usuarios", USUARIO, "despesas", ano, 'Dezembro')
  loop()
  let despesasDezembro = await getDocs(colecaoDezembro)
  removeLoop()
  let totalDezembro = 0
  despesasDezembro.forEach( () => { totalDezembro = totalDezembro + 1 })
  document.querySelector('.totalDezembro').innerHTML = `${totalDezembro} Despesas`

}

async function listarDespesas(a, m) {
  let ano = a
  let mes = m

  let despesasREF = collection(db, "usuarios", USUARIO, "despesas", ano, mes)
  let consultaPorStatus = query(despesasREF, 
    orderBy("status", "desc", 
    orderBy("diaVencimento", "asc")))


  loop()
  let querySnapshot = await getDocs(consultaPorStatus)
  removeLoop()

  modal(`${mes} de ${ano}` , 800)
  document.querySelector('.bodyModal').innerHTML = 
  `
  <div style="display: flex; align-items: center; justify-content: space-between;">
    <div class="tabela-container" style="width: 100%;">
      <table class="tabelaDespesas">
        <tbody></tbody>
      </table>
    </div>
    <div style="display: flex; align-items: center; justify-content: center; width: 500px;">
      Totalização
    </div>

  </div>
  `

  let tbody = document.querySelector('tbody')

  if (!querySnapshot.empty) {
    querySnapshot.forEach(docSnap => {
      let dados = docSnap.data()
      let tr = document.createElement('tr')

      let numMes

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
      <td style="padding: 5px 10px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; flex-flow: column; gap: 5px;">
            <p>${dados.nome}</p>
            <div style="display: flex; align-items: center; gap: 20px;">
              <p style="font-size: 13px;"><i class="fa-solid fa-calendar-day"></i> Dia do Vencimento: ${dados.diaVencimento}</p>
              <p style="font-size: 13px;"><i class="fa-solid fa-clone"></i> Parcela: ${dados.parcela}</p>
            </div>
          </div>
          
          <div style="display: flex; align-items: center; gap: 10px;">
             <p>R$ ${dados.valor}</p>
            <button class="btnEditarDespesa" style="border: none; background: none; padding: 0px; height: auto;"><i class="fa-solid fa-gear"></i></button>
          </div>
          

        </div>
      </td>

      `

      tr.querySelector('.btnEditarDespesa').onclick = () => { 
        editarDespesa(docSnap.id, ano, mes) 
      }

      tbody.appendChild(tr)
    })
    paginarTabela('.tabelaDespesas' , 5)

  } else { tbody.innerHTML = `<tr><td colspan="5">Nenhuma despesa em ${mes}</td></tr>` }

  adicionarDespesa(a, m)
}

function adicionarDespesa(a, m) {
  let ano = a
  let mes = m

  let botoes = document.createElement('div')
  botoes.classList.add('botoes')
  botoes.innerHTML =
  `
  <button class="btnAddDespesa">Adicionar Despesa <i class="fa-solid fa-circle-plus"></i></button>
  `
  document.querySelector('.bodyModal').appendChild(botoes)

  let btnAdicionarDespesa = document.querySelector('.btnAddDespesa')

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
      carregarQtdDespesas()
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
    carregarQtdDespesas()
  }

}

// Função - Visão Das Contas
let btnAnoDespesas = document.querySelector('.btnAnoDespesas')
btnAnoDespesas.onclick = async ()=> {

  let usuarioREF = doc(db, "usuarios", USUARIO)
  loop()
  let consulta = await getDoc(usuarioREF)
  removeLoop()
  let dados = consulta.data()

  modal('Ano das Despesas' , 600)
  document.querySelector('.bodyModal').innerHTML =
  `
  <input type="text" class="anoDespesas" value="${dados.anoDespesas}">
  <div style=" display: flex; gap: 10px; ">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnConfirmar">Confirmar <i class="fa-regular fa-circle-check"></i></button>
  </div>
  `

  // Cancelar
  document.querySelector('.btnCancelar').onclick = ()=> {
    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove() }

  // Confirmar
  document.querySelector('.btnConfirmar').onclick = async ()=> {
    let anoDespesas = document.querySelector('.anoDespesas').value

    loop()
    await updateDoc(usuarioREF, { 
      anoDespesas: anoDespesas
    })
    exibirMeses()
    removeLoop()

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()
    alerta('Dados alterados com sucesso!')
  }
}