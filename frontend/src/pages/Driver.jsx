import React, { useState, useEffect } from 'react';
import { Car, User, MapPin, Navigation, DollarSign, Clock, CheckCircle, AlertCircle, PlayCircle, Pause } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { rideService } from '../services/api';
import './Driver.css';

const Driver = () => {
  const { socket, isConnected, user, registerUser, addNotification } = useSocket();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [availableRides, setAvailableRides] = useState([]);
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    // Escutar corridas disponíveis
    socket.on('ride_request', (data) => {
      if (isOnline && !currentRide) {
        addNotification(`🚗 Nova corrida disponível: ${data.pickup} → ${data.destination}`, 'info');
        setAvailableRides(prev => {
          // Evitar duplicatas
          if (prev.find(ride => ride.id === data.id)) return prev;
          return [data, ...prev];
        });
      }
    });

    // Escutar atualizações de corridas
    socket.on('ride_updates', (rides) => {
      if (isOnline && !currentRide) {
        setAvailableRides(rides.filter(ride => ride.status === 'PENDING'));
      }
    });

    // Escutar quando corrida é aceita por outro motorista
    socket.on('ride_accepted', (data) => {
      setAvailableRides(prev => prev.filter(ride => ride.id !== data.rideId));
      
      if (data.driverId === driverId) {
        addNotification(`✅ Você aceitou a corrida!`, 'success');
        const acceptedRide = availableRides.find(ride => ride.id === data.rideId);
        if (acceptedRide) {
          setCurrentRide({ ...acceptedRide, status: 'ACCEPTED', driverId: data.driverId });
          setAvailableRides(prev => prev.filter(ride => ride.id !== data.rideId));
        }
      } else {
        addNotification(`❌ Corrida aceita por outro motorista`, 'warning');
      }
    });

    // Escutar atualizações de status
    socket.on('status_update', (data) => {
      if (data.driverId === driverId) {
        setCurrentRide(prev => prev ? { ...prev, status: data.status } : null);
        
        if (data.status === 'COMPLETED') {
          addNotification(`🎉 Corrida finalizada com sucesso!`, 'success');
          setTimeout(() => {
            setCurrentRide(null);
          }, 3000);
        } else if (data.status === 'CANCELLED') {
          addNotification(`❌ Corrida cancelada`, 'warning');
          setTimeout(() => {
            setCurrentRide(null);
          }, 3000);
        }
      }
    });

    return () => {
      socket.off('ride_request');
      socket.off('ride_updates');
      socket.off('ride_accepted');
      socket.off('status_update');
    };
  }, [socket, addNotification, isOnline, currentRide, driverId, availableRides]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!driverId.trim()) {
      addNotification('Por favor, digite seu nome/ID', 'warning');
      return;
    }

    registerUser('driver', driverId, {
      name: `Motorista ${driverId}`,
      joinedAt: new Date().toISOString(),
      vehicle: 'Carro Padrão'
    });

    setIsLoggedIn(true);
    addNotification(`Bem-vindo, ${driverId}! Você pode ficar online para receber corridas.`, 'success');
  };

  const toggleOnlineStatus = () => {
    const newStatus = !isOnline;
    setIsOnline(newStatus);
    
    if (newStatus) {
      addNotification('🟢 Você está online! Aguardando corridas...', 'success');
      // Solicitar corridas disponíveis
      socket.emit('get_available_rides');
    } else {
      addNotification('🔴 Você está offline. Não receberá novas corridas.', 'warning');
      setAvailableRides([]);
    }
  };

  const handleAcceptRide = async (ride) => {
    setLoading(true);
    
    try {
      const result = await rideService.acceptRide(ride.id, driverId);
      
      if (result.success) {
        addNotification(`✅ Corrida aceita! Indo buscar ${ride.passengerId}`, 'success');
        setCurrentRide({ ...ride, status: 'ACCEPTED', driverId: driverId });
        setAvailableRides(prev => prev.filter(r => r.id !== ride.id));
      }
    } catch (error) {
      addNotification(`❌ ${error.message}`, 'warning');
    } finally {
      setLoading(false);
    }
  };

  const updateRideStatus = async (newStatus) => {
    if (!currentRide) return;
    
    setLoading(true);
    
    try {
      const result = await rideService.updateRideStatus(currentRide.id, newStatus, driverId);
      
      if (result.success) {
        const statusMessages = {
          'DRIVER_ARRIVED': '📍 Você chegou ao local de coleta!',
          'IN_PROGRESS': '🚗 Corrida iniciada! Boa viagem!',
          'COMPLETED': '✅ Corrida finalizada com sucesso!'
        };
        
        addNotification(statusMessages[newStatus] || `Status atualizado: ${newStatus}`, 'success');
        setCurrentRide(prev => ({ ...prev, status: newStatus }));
        
        if (newStatus === 'COMPLETED') {
          setTimeout(() => {
            setCurrentRide(null);
          }, 3000);
        }
      }
    } catch (error) {
      addNotification(`❌ ${error.message}`, 'warning');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'PENDING': { text: 'Aguardando', icon: Clock, color: 'yellow' },
      'ACCEPTED': { text: 'Aceita - Indo buscar', icon: Car, color: 'blue' },
      'DRIVER_ARRIVED': { text: 'Chegou ao local', icon: MapPin, color: 'green' },
      'IN_PROGRESS': { text: 'Em andamento', icon: Navigation, color: 'blue' },
      'COMPLETED': { text: 'Finalizada', icon: CheckCircle, color: 'green' },
      'CANCELLED': { text: 'Cancelada', icon: AlertCircle, color: 'red' }
    };
    return displays[status] || { text: status, icon: Clock, color: 'gray' };
  };

  const getRideSteps = (status) => {
    const steps = [
      { key: 'ACCEPTED', title: 'Corrida Aceita', description: 'Direcionando ao passageiro' },
      { key: 'DRIVER_ARRIVED', title: 'Chegou ao Local', description: 'Aguardando passageiro' },
      { key: 'IN_PROGRESS', title: 'Em Andamento', description: 'Seguindo ao destino' },
      { key: 'COMPLETED', title: 'Finalizada', description: 'Corrida concluída' }
    ];

    const statusOrder = ['ACCEPTED', 'DRIVER_ARRIVED', 'IN_PROGRESS', 'COMPLETED'];
    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
      ...step,
      status: index < currentIndex ? 'completed' : 
              index === currentIndex ? 'active' : 'pending'
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="driver">
        <div className="driver-standalone">
          <div className="standalone-header">
            <h1>🚗 Sistema de Corridas - Motorista</h1>
            <div className="connection-status">
              {isConnected ? (
                <div className="status-connected">🟢 Conectado ao servidor</div>
              ) : (
                <div className="status-disconnected">🔴 Desconectado do servidor</div>
              )}
            </div>
          </div>
          
          <div className="container">
            <div className="login-section">
              <div className="card">
                <div className="login-header">
                  <Car size={48} />
                  <h1>🚗 Área do Motorista</h1>
                  <p>Faça login para receber corridas</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Seu Nome/ID:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: motorista_joao"
                      value={driverId}
                      onChange={(e) => setDriverId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!isConnected}
                  >
                    <Car size={20} />
                    Entrar como Motorista
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="driver">
      <div className="driver-standalone">
        <div className="standalone-header">
          <h1>🚗 Sistema de Corridas - Motorista</h1>
          <div className="connection-status">
            {isConnected ? (
              <div className="status-connected">🟢 Conectado ao servidor</div>
            ) : (
              <div className="status-disconnected">🔴 Desconectado do servidor</div>
            )}
          </div>
        </div>
        
        <div className="container">
          <div className="driver-header">
            <h1>🚗 Olá, {driverId}!</h1>
            <p>Gerencie suas corridas e acompanhe solicitações</p>
        </div>

        <div className="driver-content">
          {/* Status e Controles */}
          <div className="card">
            <h2>📊 Status do Motorista</h2>
            
            <div className="status-toggle">
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={isOnline}
                  onChange={toggleOnlineStatus}
                  disabled={!!currentRide}
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">
                {isOnline ? 'Online - Recebendo corridas' : 'Offline - Não recebendo corridas'}
              </span>
            </div>

            <div className={`driver-status ${isOnline ? (currentRide ? 'busy' : 'online') : 'offline'}`}>
              {isOnline ? (
                currentRide ? (
                  <>
                    <Pause size={20} />
                    <span>Ocupado - Em corrida</span>
                  </>
                ) : (
                  <>
                    <PlayCircle size={20} />
                    <span>Online - Disponível</span>
                  </>
                )
              ) : (
                <>
                  <AlertCircle size={20} />
                  <span>Offline - Indisponível</span>
                </>
              )}
            </div>
          </div>

          {/* Corrida Atual */}
          {currentRide && (
            <div className="card current-ride-card">
              <div className="current-ride-header">
                <Car size={24} />
                <h2>Corrida Atual</h2>
              </div>

              <div className="ride-info">
                <div className="ride-id">
                  <strong>ID:</strong> {currentRide.id?.substring(0, 12)}...
                </div>
                
                <div className="ride-route">
                  <div className="route-item">
                    <MapPin size={16} />
                    <span><strong>Coleta:</strong> {currentRide.pickup}</span>
                  </div>
                  <div className="route-separator"></div>
                  <div className="route-item">
                    <Navigation size={16} />
                    <span><strong>Destino:</strong> {currentRide.destination}</span>
                  </div>
                </div>

                <div className="ride-details">
                  <div className="ride-passenger">
                    <User size={16} />
                    <span>Passageiro: {currentRide.passengerId}</span>
                  </div>
                  <div className="ride-price">
                    <DollarSign size={18} />
                    <span>R$ {currentRide.estimatedPrice}</span>
                  </div>
                </div>
              </div>

              <div className="ride-progress">
                {getRideSteps(currentRide.status).map((step, index) => (
                  <div key={step.key} className={`progress-step ${step.status}`}>
                    <div className={`step-icon ${step.status}`}>
                      {step.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div className="step-content">
                      <div className="step-title">{step.title}</div>
                      <div className="step-description">{step.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="current-ride-actions">
                {currentRide.status === 'ACCEPTED' && (
                  <button 
                    className="btn-status"
                    onClick={() => updateRideStatus('DRIVER_ARRIVED')}
                    disabled={loading}
                  >
                    <MapPin size={20} />
                    Cheguei ao Local
                  </button>
                )}
                
                {currentRide.status === 'DRIVER_ARRIVED' && (
                  <button 
                    className="btn-status"
                    onClick={() => updateRideStatus('IN_PROGRESS')}
                    disabled={loading}
                  >
                    <PlayCircle size={20} />
                    Iniciar Viagem
                  </button>
                )}
                
                {currentRide.status === 'IN_PROGRESS' && (
                  <button 
                    className="btn-status btn-complete"
                    onClick={() => updateRideStatus('COMPLETED')}
                    disabled={loading}
                  >
                    <CheckCircle size={20} />
                    Finalizar Corrida
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Corridas Disponíveis */}
          {!currentRide && (
            <div className="card">
              <h2>🎯 Corridas Disponíveis</h2>
              
              <div className="rides-section">
                {!isOnline ? (
                  <div className="empty-rides">
                    <AlertCircle size={48} />
                    <h3>Você está offline</h3>
                    <p>Ative o status online para receber corridas</p>
                  </div>
                ) : availableRides.length === 0 ? (
                  <div className="empty-rides">
                    <Clock size={48} />
                    <h3>Nenhuma corrida disponível</h3>
                    <p>Aguardando novas solicitações...</p>
                  </div>
                ) : (
                  availableRides.map((ride) => (
                    <div key={ride.id} className="ride-card">
                      <div className="ride-header">
                        <div className="ride-id">
                          {ride.id?.substring(0, 12)}...
                        </div>
                        <div className="ride-time">
                          {formatTime(ride.timestamp)}
                        </div>
                      </div>

                      <div className="ride-route">
                        <div className="route-item">
                          <MapPin size={16} />
                          <span><strong>Coleta:</strong> {ride.pickup}</span>
                        </div>
                        <div className="route-separator"></div>
                        <div className="route-item">
                          <Navigation size={16} />
                          <span><strong>Destino:</strong> {ride.destination}</span>
                        </div>
                      </div>

                      <div className="ride-details">
                        <div className="ride-passenger">
                          <User size={16} />
                          <span>{ride.passengerId}</span>
                        </div>
                        <div className="ride-price">
                          <DollarSign size={18} />
                          <span>R$ {ride.estimatedPrice}</span>
                        </div>
                      </div>

                      <div className="ride-actions">
                        <button 
                          className="btn-accept"
                          onClick={() => handleAcceptRide(ride)}
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <div className="spinner-small"></div>
                              Aceitando...
                            </>
                          ) : (
                            <>
                              <CheckCircle size={18} />
                              Aceitar Corrida
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Driver;