import { useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [numPedido, setNumPedido] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [filaStatus, setFilaStatus] = useState(null)

  const enviarMensagem = async (e) => {
    e.preventDefault()
    
    if (!numPedido || !mensagem) {
      setStatus('Por favor, preencha todos os campos')
      return
    }

    setLoading(true)
    setStatus('')

    try {
      const response = await axios.post('/api/enviar-mensagem', {
        numPedido,
        mensagem,
        tipo: 'PEDIDO'
      })

      setStatus(`Mensagem enviada com sucesso! ID: ${response.data.data.id}`)
      setNumPedido('')
      setMensagem('')
      obterStatusFila()
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error)
      setStatus(`Erro ao enviar mensagem: ${error.response?.data?.error || error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const obterStatusFila = async () => {
    try {
      const response = await axios.get('/api/status-fila')
      setFilaStatus(response.data)
    } catch (error) {
      console.error('Erro ao obter status da fila:', error)
      setFilaStatus({ 
        connected: false, 
        status: 'Erro de conexão',
        messageCount: 0,
        consumerCount: 0 
      })
    }
  }

  const reconectarRabbitMQ = async () => {
    try {
      setLoading(true)
      const response = await axios.post('/api/reconectar-rabbitmq')
      
      if (response.data.success) {
        setStatus('✅ Reconectado ao RabbitMQ com sucesso!')
        obterStatusFila()
      } else {
        setStatus('❌ Falha ao reconectar ao RabbitMQ')
      }
    } catch (error) {
      console.error('Erro ao reconectar:', error)
      setStatus('❌ Erro ao tentar reconectar ao RabbitMQ')
    } finally {
      setLoading(false)
    }
  }

  const gerarMensagemRapida = () => {
    const pedidoId = Math.floor(Math.random() * 10000)
    setNumPedido(pedidoId.toString())
    setMensagem(`Pedido número ${pedidoId} foi criado e está sendo processado!`)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>📤 Produtor de Mensagens</h1>
        <p>Sistema de Mensageria - Envio de Notificações</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Enviar Nova Mensagem</h2>
          
          <form onSubmit={enviarMensagem} className="form">
            <div className="form-group">
              <label htmlFor="numPedido">Número do Pedido:</label>
              <input
                type="text"
                id="numPedido"
                value={numPedido}
                onChange={(e) => setNumPedido(e.target.value)}
                placeholder="Ex: 12345"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="mensagem">Mensagem:</label>
              <textarea
                id="mensagem"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                placeholder="Digite sua mensagem aqui..."
                rows={4}
                disabled={loading}
              />
            </div>

            <div className="button-group">
              <button 
                type="button" 
                onClick={gerarMensagemRapida}
                className="btn btn-secondary"
                disabled={loading}
              >
                🎲 Gerar Exemplo
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? '⏳ Enviando...' : '📤 Enviar Mensagem'}
              </button>
            </div>
          </form>

          {status && (
            <div className={`status-message ${status.includes('Erro') ? 'error' : 'success'}`}>
              {status}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Status da Fila</h2>
          <button 
            onClick={obterStatusFila}
            className="btn btn-secondary"
            disabled={loading}
          >
            🔄 Atualizar Status
          </button>
          
          {filaStatus && (
            <div className="status-info">
              <div className={`connection-status ${filaStatus.connected ? 'connected' : 'disconnected'}`}>
                <span className="status-indicator"></span>
                <strong>Status: </strong>
                {filaStatus.status || (filaStatus.connected ? 'Conectado' : 'Desconectado')}
              </div>
              
              <p><strong>Fila:</strong> {filaStatus.queue || 'N/A'}</p>
              <p><strong>Mensagens na fila:</strong> {filaStatus.messageCount}</p>
              <p><strong>Consumidores ativos:</strong> {filaStatus.consumerCount}</p>
              
              {!filaStatus.connected && (
                <div className="reconnect-section">
                  <p className="warning-text">⚠️ RabbitMQ não está conectado</p>
                  <button 
                    onClick={reconectarRabbitMQ}
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    🔄 Tentar Reconectar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App