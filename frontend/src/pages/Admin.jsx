import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Car, Clock, CheckCircle, DollarSign, 
  Activity, MapPin, Navigation, User, RefreshCw, TrendingUp,
  AlertCircle, PlayCircle, Pause, Eye
} from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { rideService } from '../services/api';
import './Admin.css';

const Admin = () => {
  const { socket, isConnected, addNotification } = useSocket();
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    cancelled: 0,
    totalRevenue: 0,
    activeDrivers: 0,
    activePassengers: 0
  });
  
  const [rides, setRides] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Carregar dados iniciais
  useEffect(() => {
    loadDashboardData();
  }, []);

  // Auto-refresh a cada 10 segundos
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadDashboardData();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Escutar eventos em tempo real
  useEffect(() => {
    if (!socket) return;

    // Nova corrida solicitada
    socket.on('ride_request', (data) => {
      addActivity('new', `Nova corrida: ${data.passengerId} solicitou viagem`, new Date());
      loadDashboardData(); // Atualizar stats
    });

    // Corrida aceita
    socket.on('ride_accepted', (data) => {
      addActivity('accept', `Corrida aceita pelo motorista ${data.driverId}`, new Date());
      loadDashboardData();
    });

    // Atualização de status
    socket.on('status_update', (data) => {
      const statusMessages = {
        'DRIVER_ARRIVED': `Motorista chegou ao local de coleta`,
        'IN_PROGRESS': `Viagem iniciada`,
        'COMPLETED': `Corrida finalizada com sucesso`,
        'CANCELLED': `Corrida cancelada`
      };
      
      if (statusMessages[data.status]) {
        addActivity(
          data.status === 'COMPLETED' ? 'complete' : 
          data.status === 'CANCELLED' ? 'cancel' : 'accept',
          statusMessages[data.status],
          new Date()
        );
        loadDashboardData();
      }
    });

    return () => {
      socket.off('ride_request');
      socket.off('ride_accepted');
      socket.off('status_update');
    };
  }, [socket]);

  const loadDashboardData = async () => {
    try {
      const [statsData, ridesData] = await Promise.all([
        rideService.getStats(),
        rideService.getRides({ limit: 20 })
      ]);

      setStats(statsData.stats || {});
      setRides(ridesData.rides || []);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    }
  };

  const addActivity = (type, message, time) => {
    const newActivity = {
      id: Date.now(),
      type,
      message,
      time: time.toLocaleTimeString('pt-BR'),
      timestamp: time.toISOString()
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 19)]); // Manter apenas 20 itens
  };

  const handleRefresh = async () => {
    setLoading(true);
    await loadDashboardData();
    addNotification('📊 Dashboard atualizado!', 'success');
    setLoading(false);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    const statusMap = {
      'PENDING': 'Pendente',
      'ACCEPTED': 'Aceita',
      'DRIVER_ARRIVED': 'Motorista no local',
      'IN_PROGRESS': 'Em andamento',
      'COMPLETED': 'Finalizada',
      'CANCELLED': 'Cancelada'
    };
    return statusMap[status] || status;
  };

  const getActivityIcon = (type) => {
    const icons = {
      'new': PlayCircle,
      'accept': CheckCircle,
      'complete': CheckCircle,
      'cancel': AlertCircle
    };
    return icons[type] || Activity;
  };

  const statCards = [
    {
      title: 'Total de Corridas',
      value: stats.total || 0,
      icon: BarChart3,
      type: 'total',
      change: '+12% vs ontem'
    },
    {
      title: 'Pendentes',
      value: stats.pending || 0,
      icon: Clock,
      type: 'pending',
      change: `${stats.pending > 0 ? 'Aguardando motorista' : 'Tudo atendido'}`
    },
    {
      title: 'Em Andamento',
      value: stats.inProgress || 0,
      icon: Car,
      type: 'active',
      change: 'Tempo real'
    },
    {
      title: 'Finalizadas',
      value: stats.completed || 0,
      icon: CheckCircle,
      type: 'completed',
      change: '+8% vs ontem'
    },
    {
      title: 'Faturamento',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: DollarSign,
      type: 'revenue',
      change: '+15% vs ontem'
    },
    {
      title: 'Usuários Online',
      value: (stats.activeDrivers || 0) + (stats.activePassengers || 0),
      icon: Users,
      type: 'users',
      change: `${stats.activeDrivers || 0} motoristas, ${stats.activePassengers || 0} passageiros`
    }
  ];

  return (
    <div className="admin">
      <div className="admin-standalone">
        <div className="standalone-header">
          <h1>📊 Sistema de Corridas - Admin</h1>
          <div className="connection-status">
            {isConnected ? (
              <div className="status-connected">🟢 Conectado ao servidor</div>
            ) : (
              <div className="status-disconnected">🔴 Desconectado do servidor</div>
            )}
          </div>
        </div>
        
        <div className="container">
          <div className="admin-header">
            <h1>📊 Dashboard Administrativo</h1>
            <p>Monitoramento em tempo real do sistema de corridas</p>
          </div>

          <div className="admin-content">
          {/* Cards de Estatísticas */}
          <div className="stats-grid">
            {statCards.map((card) => {
              const IconComponent = card.icon;
              return (
                <div key={card.title} className={`stat-card ${card.type}`}>
                  <div className="stat-header">
                    <div>
                      <h3 className="stat-title">{card.title}</h3>
                      <p className="stat-value">{card.value}</p>
                    </div>
                    <div className="stat-icon">
                      <IconComponent size={24} />
                    </div>
                  </div>
                  <div className="stat-change neutral">
                    <TrendingUp size={14} />
                    {card.change}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Seção Live */}
          <div className="live-section">
            {/* Monitor de Corridas */}
            <div className="rides-monitor">
              <div className="monitor-header">
                <h2 className="monitor-title">
                  <Eye size={20} />
                  Corridas em Tempo Real
                </h2>
                <button 
                  className="refresh-btn"
                  onClick={handleRefresh}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'spinning' : ''} />
                  Atualizar
                </button>
              </div>

              <div className="rides-list">
                {rides.length === 0 ? (
                  <div className="empty-state">
                    <Car size={48} />
                    <h3>Nenhuma corrida encontrada</h3>
                    <p>As corridas aparecerão aqui em tempo real</p>
                  </div>
                ) : (
                  rides.map((ride) => (
                    <div key={ride.id} className="ride-item">
                      <div className="ride-item-header">
                        <div className="ride-id">
                          {ride.id?.substring(0, 12)}...
                        </div>
                        <div className={`ride-status ${ride.status.toLowerCase().replace('_', '-')}`}>
                          {getStatusText(ride.status)}
                        </div>
                      </div>

                      <div className="ride-details">
                        <div className="ride-route">
                          <div className="route-point">
                            <MapPin size={14} />
                            <span>{ride.pickup}</span>
                          </div>
                          <div className="route-point">
                            <Navigation size={14} />
                            <span>{ride.destination}</span>
                          </div>
                        </div>

                        <div className="ride-meta">
                          <div className="ride-price">
                            {formatCurrency(ride.estimatedPrice)}
                          </div>
                          <div className="ride-time">
                            {formatTime(ride.timestamp)}
                          </div>
                        </div>
                      </div>

                      <div className="ride-users">
                        <div className="ride-user">
                          <User size={14} />
                          <span>Passageiro: {ride.passengerId}</span>
                        </div>
                        {ride.driverId && (
                          <div className="ride-user">
                            <Car size={14} />
                            <span>Motorista: {ride.driverId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {autoRefresh && (
                <div className="auto-refresh">
                  <div className="refresh-dot"></div>
                  <span>Atualizando automaticamente</span>
                </div>
              )}
            </div>

            {/* Feed de Atividades */}
            <div className="activity-feed">
              <div className="activity-header">
                <Activity size={20} />
                <h2 className="activity-title">Atividade Recente</h2>
              </div>

              <div className="activity-list">
                {activities.length === 0 ? (
                  <div className="empty-state">
                    <Activity size={48} />
                    <h3>Nenhuma atividade</h3>
                    <p>As atividades aparecerão aqui em tempo real</p>
                  </div>
                ) : (
                  activities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="activity-item">
                        <div className={`activity-icon ${activity.type}`}>
                          <ActivityIcon size={18} />
                        </div>
                        <div className="activity-content">
                          <p className="activity-text">{activity.message}</p>
                          <span className="activity-time">{activity.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;