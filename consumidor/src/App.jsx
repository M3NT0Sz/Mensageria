import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [mensagens, setMensagens] = useState([])
  const [filaStatus, setFilaStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

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
        obterStatusFila()
      }
    } catch (error) {
      console.error('Erro ao reconectar:', error)
    } finally {
      setLoading(false)
    }
  }

  const simularConsumoMensagens = () => {
    // Simula o recebimento de mensagens (em um cenário real, isso seria feito via WebSocket)
    const exemploMensagens = [
      {
        id: Date.now().toString(),
        numPedido: '12345',
        mensagem: 'Pedido número 12345 foi criado e está sendo processado!',
        tipo: 'PEDIDO',
        status: 'PROCESSADO',
        timestamp: new Date().toISOString()
      },
      {
        id: (Date.now() + 1).toString(),
        numPedido: '12346',
        mensagem: 'Pedido número 12346 foi enviado para entrega!',
        tipo: 'ENTREGA',
        status: 'ENVIADO',
        timestamp: new Date(Date.now() - 60000).toISOString()
      }
    ]

    setMensagens(prev => [...exemploMensagens, ...prev])
  }

  const limparMensagens = () => {
    setMensagens([])
  }

  const formatarData = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-BR')
  }

  const obterCorPorTipo = (tipo) => {
    const cores = {
      'PEDIDO': '#007bff',
      'ENTREGA': '#28a745',
      'PAGAMENTO': '#ffc107',
      'CANCELAMENTO': '#dc3545',
      'NOTIFICACAO': '#6c757d'
    }
    return cores[tipo] || '#6c757d'
  }

  useEffect(() => {
    obterStatusFila()
  }, [])

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        obterStatusFila()
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  return (
    <div className="App">
      <header className="App-header">
        <h1>📥 Consumidor de Mensagens</h1>
        <p>Sistema de Mensageria - Monitoramento de Notificações</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Status da Fila</h2>
          
          <div className="controls">
            <button 
              onClick={obterStatusFila}
              className="btn btn-secondary"
              disabled={loading}
            >
              🔄 Atualizar Status
            </button>
            
            <label className="auto-refresh">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
              🔄 Auto-refresh (5s)
            </label>
          </div>
          
          {filaStatus && (
            <div className="status-grid">
              <div className="status-item">
                <div className={`connection-status ${filaStatus.connected ? 'connected' : 'disconnected'}`}>
                  <span className="status-indicator"></span>
                  <span className="status-text">
                    {filaStatus.status || (filaStatus.connected ? 'Conectado' : 'Desconectado')}
                  </span>
                </div>
              </div>
              <div className="status-item">
                <span className="status-label">Fila:</span>
                <span className="status-value">{filaStatus.queue || 'N/A'}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Mensagens pendentes:</span>
                <span className="status-value highlight">{filaStatus.messageCount}</span>
              </div>
              <div className="status-item">
                <span className="status-label">Consumidores ativos:</span>
                <span className="status-value">{filaStatus.consumerCount}</span>
              </div>
              
              {!filaStatus.connected && (
                <div className="status-item reconnect-item">
                  <button 
                    onClick={reconectarRabbitMQ}
                    className="btn btn-warning"
                    disabled={loading}
                  >
                    🔄 Reconectar RabbitMQ
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card">
          <div className="messages-header">
            <h2>Mensagens Recebidas</h2>
            <div className="message-controls">
              <button 
                onClick={simularConsumoMensagens}
                className="btn btn-primary"
              >
                📨 Simular Recebimento
              </button>
              <button 
                onClick={limparMensagens}
                className="btn btn-danger"
                disabled={mensagens.length === 0}
              >
                🗑️ Limpar
              </button>
            </div>
          </div>

          <div className="messages-container">
            {mensagens.length === 0 ? (
              <div className="empty-state">
                <p>🔍 Nenhuma mensagem recebida ainda</p>
                <p>Clique em "Simular Recebimento" para ver mensagens de exemplo</p>
              </div>
            ) : (
              <div className="messages-list">
                {mensagens.map((mensagem) => (
                  <div key={mensagem.id} className="message-item">
                    <div className="message-header">
                      <span 
                        className="message-type"
                        style={{ backgroundColor: obterCorPorTipo(mensagem.tipo) }}
                      >
                        {mensagem.tipo}
                      </span>
                      <span className="message-id">ID: {mensagem.id}</span>
                      <span className="message-timestamp">
                        {formatarData(mensagem.timestamp)}
                      </span>
                    </div>
                    <div className="message-content">
                      <div className="message-pedido">
                        <strong>Pedido:</strong> #{mensagem.numPedido}
                      </div>
                      <div className="message-text">
                        {mensagem.mensagem}
                      </div>
                      <div className="message-status">
                        <strong>Status:</strong> {mensagem.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <h2>📊 Estatísticas</h2>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-number">{mensagens.length}</span>
              <span className="stat-label">Total Processadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {mensagens.filter(m => m.tipo === 'PEDIDO').length}
              </span>
              <span className="stat-label">Pedidos</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {mensagens.filter(m => m.tipo === 'ENTREGA').length}
              </span>
              <span className="stat-label">Entregas</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {filaStatus?.messageCount || 0}
              </span>
              <span className="stat-label">Na Fila</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App