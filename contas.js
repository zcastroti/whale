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
document.querySelector('.contas')?.classList.add('destaque')

const USUARIO = localStorage.getItem('usuario')

loopTempo(400)

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
    listarContas(ano, mes)
  }

}

async function listarContas(a, m) {
  let ano = a
  let mes = m

  let contasREF = collection(db, "usuarios", USUARIO, "contas", ano, mes)
  
  loop()
  let consulta = await getDocs(contasREF)
  removeLoop()

  modal(`${mes} de ${ano}` , 800)
  document.querySelector('.bodyModal').innerHTML = 
  `
  <div class="tabela-container">
    <table class="tabelaContas">
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

      if (dados.status == "Pago") {
        tr.classList.add('corVerde')
      }

      tr.innerHTML = 
      `
      <td class="col-nome">${dados.nome}</td>
      <td class="col-valor">${dados.valor}</td>
      <td class="col-vencimento">${dados.vencimento}</td>
      <td class="col-parcela">${dados.parcela}</td>
      <td class="col-acao"><button class="btnEditarConta" style="border: none; background: none; padding: 0px; height: auto;"><i class="fa-solid fa-gear"></i></button></td>
      `

      tr.querySelector('.btnEditarConta').onclick = () => { 
        editarConta(docSnap.id, ano, mes) 
      }

      tbody.appendChild(tr)
    })
    paginarTabela('.tabelaContas' , 8)

  } else { tbody.innerHTML = `<tr><td colspan="5">Nenhuma Conta em ${mes}</td></tr>` }

  addConta(a, m)
}

function addConta(a, m) {
  let ano = a
  let mes = m

  let btnAddConta = document.createElement('button')
  btnAddConta.innerHTML = `Adicionar Conta <i class="fa-solid fa-circle-plus"></i>`
  document.querySelector('.bodyModal').appendChild(btnAddConta)

  btnAddConta.onclick = ()=> {
    modal("Adicionar Conta" , 600)
    document.querySelector('.fecharModal').style.display = 'none'
    document.querySelector('.bodyModal').innerHTML =
    `
    <div class="grid10">
      <div style=" grid-column: span 10; ">
        <label for="nome">Nome</label>
        <input type="text" class="nome">
      </div>
      <div style=" grid-column: span 3; ">
        <label for="valor">Valor</label>
        <input type="number" class="valor">
      </div>
      <div style=" grid-column: span 4; ">
        <label for="vencimento">Dia Vencimento</label>
        <input type="number" class="vencimento" maxlength="2">
      </div>
      <div style=" grid-column: span 3; ">
        <label for="parcela">Parcela</label>
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
      listarContas(ano, mes)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
      let nome = document.querySelector('.nome').value.trim()
      let valor = document.querySelector('.valor').value.trim()
      let vencimento = document.querySelector('.vencimento').value.trim()
      let parcela = document.querySelector('.parcela').value.trim()
      let obs = document.querySelector('.obs').value.trim()

      if (!nome || !valor) {
        alerta('Nome e Valor são obrigatórios!') 
        return }
    

      let id = gerarIdentificador()
      let contaREF = doc(db, "usuarios", USUARIO, "contas", ano, mes, id)

      loop()
      await setDoc(contaREF, { 
        nome: nome,
        valor: valor,
        vencimento: vencimento || 0,
        parcela: parcela || 0,
        obs: obs || '',
        status: "Pendente"
      })
        
      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()

      await listarContas(ano, mes)
      removeLoop()
      alerta('Conta cadastrada com sucesso!')
    }
  }
}

async function editarConta(id, a, m) {
  let ano = a
  let mes = m

  let contaREF = doc(db, "usuarios", USUARIO, "contas", ano, mes, id)

  loop()
  let docSnap = await getDoc(contaREF)
  removeLoop()

  if (!docSnap.exists()) {
    alerta("Conta não encontrada!")
    return }

  let dados = docSnap.data()

  modal("Editar Conta", 600)
  document.querySelector('.fecharModal').style.display = 'none'
  document.querySelector('.bodyModal').innerHTML =
  `
  <div class="grid10">
    <div style=" grid-column: span 10; ">
      <label for="nome">Nome</label>
      <input type="text" class="nome" value="${dados.nome}">
    </div>
    <div style=" grid-column: span 3; ">
      <label for="valor">Valor</label>
      <input type="number" class="valor" value="${dados.valor}">
    </div>
    <div style=" grid-column: span 4; ">
      <label for="vencimento">Dia Vencimento</label>
      <input type="number" class="vencimento" value="${dados.vencimento}" maxlength="2">
    </div>
    <div style=" grid-column: span 3; ">
      <label for="parcela">Parcela</label>
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
    listarContas(ano, mes)
  }

  // Salvar alterações
  document.querySelector('.btnSalvar').onclick = async ()=> {
    let nome = document.querySelector('.nome').value.trim()
    let valor = document.querySelector('.valor').value.trim()
    let vencimento = document.querySelector('.vencimento').value.trim()
    let parcela = document.querySelector('.parcela').value.trim()
    let obs = document.querySelector('.obs').value.trim()
    let status = document.querySelector('input[name="status"]:checked').value

    if (!nome || !valor) {
      alerta('Preencha todos os dados!') 
      return 
    }

    loop()
    await updateDoc(contaREF, { 
      nome: nome,
      valor: valor,
      vencimento: vencimento || 0,
      parcela: parcela || 0,
      obs: obs || '',
      status: status
    })

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()

    await listarContas(ano, mes)
    removeLoop()
    alerta('Conta atualizada com sucesso!')
  }

  // Chamando Função - Deletar Conta
  document.querySelector('.btnDeletar').onclick = ()=> { deletarConta(docSnap.id, ano, mes) }

}
  


// Funcção - Deletar Conta
async function deletarConta(id, a, m){
  let ano = a
  let mes = m

  let contaREF = doc(db, "usuarios", USUARIO, "contas", ano, mes, id)

  modal("Deletar Conta" , 600)
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
      editarConta(id, a, m)
    }

  // Confirmar
  document.querySelector('.btnConfirmar').onclick = async ()=> {
    loop()
    await deleteDoc(contaREF)
    removeLoop()
    alerta('Conta excluída com sucesso!')

    document.querySelector('.modal')?.remove()
    document.querySelector('.overlay')?.remove()
    listarContas(ano, mes)
  }

}

