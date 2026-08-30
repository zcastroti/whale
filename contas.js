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

listarMeses()
function listarMeses() {
  let menuContas = document.querySelector('.menuContas')
  menuContas.onclick = async (e) => {
    if (!e.target.classList.contains('mes')) return

    let usuarioREF = doc(db, "usuarios", USUARIO)
    
    loop()
    let consulta = await getDoc(usuarioREF)
    removeLoop()

    let dados = consulta.data()
    let ano = dados.anoVisaoContas || 2026
    
    let mes = e.target.id
    carregarMes(ano, mes)
  }
}

async function carregarMes(a, m) {
  let ano = String(a)
  let mes = String(m)

  let contasREF = collection(db, "usuarios", USUARIO, "contas", ano, mes)
  
  loop()
  let consulta = await getDocs(contasREF)
  removeLoop()

  modal(mes , 800)
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
      tr.innerHTML = 
      `
        <td>${dados.nome || ''}</td>
        <td>${dados.valor || 0}</td>
        <td>${dados.vencimento || 0}</td>
        <td>${dados.parcela || 0}</td>
        <td><i class="fa-solid fa-gear"></i></td>
        `
      tbody.appendChild(tr)
      document.querySelector('.fa-gear').onclick = ()=> { alerta('fa-gear') } 
    })
    paginarTabela('.tabelaContas' , 8)

  } else { tbody.innerHTML = `<tr><td colspan="2">Nenhuma Conta</td></tr>` }

  
  adicionarConta(a, m)
}

function adicionarConta(a, m) {

  let ano = String(a)
  let mes = String(m)

  let btnAddConta = document.createElement('button')
  btnAddConta.innerHTML = `Adicionar Conta <i class="fa-solid fa-circle-plus"></i>`
  document.querySelector('.bodyModal').appendChild(btnAddConta)

  btnAddConta.onclick = ()=> {
    modal("Adicionar Conta")
    document.querySelector('.bodyModal').innerHTML =
    `
    <div class="grid5">
        <div>
            <label for="nome">Nome</label>
            <input type="text" class="nome">
        </div>
        <div>
            <label for="valor">Valor</label>
            <input type="text" class="valor">
        </div>
        <div>
            <label for="vencimento">Dia Vencimento</label>
            <input type="text" class="vencimento">
        </div>
        <div>
            <label for="parcela">Parcela</label>
            <input type="text" class="parcela">
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
        carregarMes(ano, mes)
    }

    // Confirmar
    document.querySelector('.btnConfirmar').onclick = async ()=> {
        let nome = document.querySelector('.nome').value.trim()
        let valor = document.querySelector('.valor').value.trim()
        let vencimento = document.querySelector('.vencimento').value.trim()
        let parcela = document.querySelector('.parcela').value.trim()

        if (!nome || !valor || !vencimento || !parcela) {
          alerta('Preencha todos os dados!') 
          return }

        let id = gerarIdentificador()
        let contaREF = doc(db, "usuarios", USUARIO, "contas", ano, mes, id)

        
        loop()
        await setDoc(contaREF, { 
          nome: nome,
          valor: valor,
          vencimento: vencimento,
          parcela: parcela
        })
        

        document.querySelector('.modal')?.remove()
        document.querySelector('.overlay')?.remove()

        await carregarMes(ano, mes)
        removeLoop()
        alerta('Conta cadastrada com sucesso!')
    }
  }
}

async function editarConta(id, a, m) {
  let ano = String(a)
  let mes = String(m)

  let contaREF = doc(db, "usuarios", USUARIO, "contas", ano, mes, id)

  loop()
  let docSnap = await getDoc(contaREF)
  removeLoop()

  if (!docSnap.exists()) {
    alerta("Conta não encontrada!")
    return
  }

  let dados = docSnap.data()

  modal("Editar Conta", 800)
  document.querySelector('.bodyModal').innerHTML =
  `
  <div class="grid5">
      <div>
          <label for="nome">Nome</label>
          <input type="text" class="nome" value="${dados.nome || ''}">
      </div>
      <div>
          <label for="valor">Valor</label>
          <input type="text" class="valor" value="${dados.valor || ''}">
      </div>
      <div>
          <label for="vencimento">Dia Vencimento</label>
          <input type="text" class="vencimento" value="${dados.vencimento || ''}">
      </div>
      <div>
          <label for="parcela">Parcela</label>
          <input type="text" class="parcela" value="${dados.parcela || ''}">
      </div>
  </div>
  <div style="display: flex; gap: 10px; justify-content: space-between; margin-top: 20px;">
    <button class="btnDeletar" style="background-color: #ff4d4d; color: white; border: none; padding: 10px; cursor: pointer; border-radius: 4px;">Excluir <i class="fa-regular fa-trash-can"></i></button>
    <div style="display: flex; gap: 10px;">
      <button class="btnCancelar">Cancelar <i class="fa-regular fa-circle-xmark"></i></button>
      <button class="btnSalvar">Salvar <i class="fa-regular fa-circle-check"></i></button>
    </div>
  </div>
  `

  // Cancelar
  document.querySelector('.btnCancelar').onclick = ()=> {
      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()
      carregarMes(ano, mes)
  }

  // Salvar alterações
  document.querySelector('.btnSalvar').onclick = async ()=> {
      let nome = document.querySelector('.nome').value.trim()
      let valor = document.querySelector('.valor').value.trim()
      let vencimento = document.querySelector('.vencimento').value.trim()
      let parcela = document.querySelector('.parcela').value.trim()

      if (!nome || !valor || !vencimento || !parcela) {
        alerta('Preencha todos os dados!') 
        return 
      }

      loop()
      await updateDoc(contaREF, { 
        nome: nome,
        valor: valor,
        vencimento: vencimento,
        parcela: parcela
      })

      document.querySelector('.modal')?.remove()
      document.querySelector('.overlay')?.remove()

      await carregarMes(ano, mes)
      removeLoop()
      alerta('Conta atualizada com sucesso!')
  }

  // Deletar conta (Opcional, mas muito útil junto com a edição)
  document.querySelector('.btnDeletar').onclick = async () => {
      if (confirm("Deseja realmente excluir esta conta?")) {
          loop()
          await deleteDoc(contaREF)
          
          document.querySelector('.modal')?.remove()
          document.querySelector('.overlay')?.remove()

          await carregarMes(ano, mes)
          removeLoop()
          alerta('Conta excluída com sucesso!')
      }
  }
}
  



