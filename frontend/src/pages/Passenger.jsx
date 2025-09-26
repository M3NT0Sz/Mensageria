import React, { useState, useEffect } from 'react';
import { User, MapPin, Navigation, DollarSign, Clock, CheckCircle, AlertCircle, Car } from 'lucide-react';
import { useSocket } from '../context/SocketContext';
import { rideService } from '../services/api';
import './Passenger.css';

const Passenger = () => {
  const { socket, isConnected, user, registerUser, addNotification } = useSocket();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passengerId, setPassengerId] = useState('');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [currentRide, setCurrentRide] = useState(null);
  const [loading, setLoading] = useState(false);

  const locations = [
    'Shopping Ibirapuera',
    'Estação da Sé', 
    'Aeroporto de Guarulhos',
    'Shopping Center Norte',
    'Universidade de São Paulo',
    'Teatro Municipal',
    'Shopping Vila Olímpia',
    'Parque do Ibirapuera',
    'Centro Empresarial',
    'Hospital das Clínicas',
    'Shopping Eldorado',
    'Memorial da América Latina'
  ];

  useEffect(() => {
    if (!socket) return;

    // Escutar corrida aceita
    socket.on('ride_accepted', (data) => {
      addNotification(`✅ Corrida aceita pelo motorista ${data.driverId}!`, 'success');
      setCurrentRide(prev => ({ ...prev, status: 'ACCEPTED', driverId: data.driverId }));
    });

    // Escutar atualizações de status
    socket.on('status_update', (data) => {
      addNotification(`📊 ${data.message}`, 'info');
      setCurrentRide(prev => prev ? { ...prev, status: data.status } : null);
      
      // Se corrida finalizada, limpar após 5 segundos
      if (data.status === 'COMPLETED' || data.status === 'CANCELLED') {
        setTimeout(() => {
          setCurrentRide(null);
        }, 5000);
      }
    });

    return () => {
      socket.off('ride_accepted');
      socket.off('status_update');
    };
  }, [socket, addNotification]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!passengerId.trim()) {
      addNotification('Por favor, digite seu nome/ID', 'warning');
      return;
    }

    registerUser('passenger', passengerId, {
      name: `Passageiro ${passengerId}`,
      joinedAt: new Date().toISOString()
    });

    setIsLoggedIn(true);
    addNotification(`Bem-vindo, ${passengerId}! Você pode solicitar corridas agora.`, 'success');
  };

  const handleRequestRide = async (e) => {
    e.preventDefault();
    
    if (!pickup || !destination) {
      addNotification('Por favor, selecione origem e destino', 'warning');
      return;
    }

    if (pickup === destination) {
      addNotification('Origem e destino devem ser diferentes', 'warning');
      return;
    }

    setLoading(true);

    try {
      const result = await rideService.requestRide(passengerId, pickup, destination);
      
      if (result.success) {
        setCurrentRide(result.ride);
        addNotification(`🚗 Corrida solicitada! ID: ${result.ride.id}`, 'success');
        addNotification(`💰 Preço estimado: R$ ${result.ride.estimatedPrice}`, 'info');
        
        // Limpar formulário
        setPickup('');
        setDestination('');
      }
    } catch (error) {
      addNotification(`❌ ${error.message}`, 'warning');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'PENDING': { text: 'Procurando motorista', icon: Clock, color: 'yellow' },
      'ACCEPTED': { text: 'Motorista a caminho', icon: CheckCircle, color: 'blue' },
      'DRIVER_ARRIVED': { text: 'Motorista chegou', icon: Navigation, color: 'green' },
      'IN_PROGRESS': { text: 'Em andamento', icon: Navigation, color: 'blue' },
      'COMPLETED': { text: 'Finalizada', icon: CheckCircle, color: 'green' },
      'CANCELLED': { text: 'Cancelada', icon: AlertCircle, color: 'red' }
    };
    return displays[status] || { text: status, icon: Clock, color: 'gray' };
  };

  if (!isLoggedIn) {
    return (
      <div className="passenger">
        <div className="passenger-standalone">
          <div className="standalone-header">
            <h1>🚗 Sistema de Corridas - Passageiro</h1>
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
                  <User size={48} />
                  <h1>👤 Área do Passageiro</h1>
                  <p>Faça login para solicitar corridas</p>
                </div>
                
                <form onSubmit={handleLogin} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Seu Nome/ID:</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Ex: joao_silva"
                      value={passengerId}
                      onChange={(e) => setPassengerId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!isConnected}
                  >
                    <User size={20} />
                    Entrar como Passageiro
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
    <div className="passenger">
      <div className="passenger-standalone">
        <div className="standalone-header">
          <h1>🚗 Sistema de Corridas - Passageiro</h1>
          <div className="connection-status">
            {isConnected ? (
              <div className="status-connected">🟢 Conectado ao servidor</div>
            ) : (
              <div className="status-disconnected">🔴 Desconectado do servidor</div>
            )}
          </div>
        </div>
        
        <div className="container">
          <div className="passenger-header">
            <h1>Olá, {passengerId}!</h1>
            <p>Vá onde quiser, quando quiser</p>
          </div>

            <div className="passenger-content">
              {/* Formulário de Solicitação */}
              <div className="card ride-request-card">
                <h2>
                  <Navigation size={24} />
                  Para onde você quer ir?
                </h2>
                
                <form onSubmit={handleRequestRide} className="ride-form">
                  <div className="form-group location-input">
                    <label className="form-label">Local de Coleta</label>
                    <MapPin className="location-icon" size={20} />
                    <select 
                      className="form-input"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      required
                    >
                      <option value="">De onde você está saindo?</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group location-input">
                    <label className="form-label">Destino</label>
                    <Navigation className="location-icon" size={20} />
                    <select 
                      className="form-input"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                    >
                      <option value="">Para onde você vai?</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading || currentRide}
                  >
                    {loading ? (
                      <>
                        <div className="spinner-small"></div>
                        Procurando motorista...
                      </>
                    ) : (
                      <>
                        <Car size={20} />
                        Solicitar Uber
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Status da Corrida */}
              {currentRide && (
                <div className="card ride-status-card">
                  <h2>🚗 Sua Corrida</h2>
                  
                  <div className="ride-info">
                    <div className="ride-id">
                      <strong>ID da Corrida:</strong> {currentRide.id?.substring(0, 12)}...
                    </div>
                    
                    <div className="ride-route">
                      <div className="route-item">
                        <MapPin size={16} />
                        <span><strong>De:</strong> {currentRide.pickup}</span>
                      </div>
                      <div className="route-item">
                        <Navigation size={16} />
                        <span><strong>Para:</strong> {currentRide.destination}</span>
                      </div>
                    </div>

                    <div className="ride-price">
                      <DollarSign size={24} />
                      <span>R$ {currentRide.estimatedPrice}</span>
                    </div>

                    {currentRide.driverId && (
                      <div className="driver-info">
                        <strong>Motorista:</strong> {currentRide.driverId}
                      </div>
                    )}
                  </div>

                  <div className="ride-status">
                    {(() => {
                      const statusInfo = getStatusDisplay(currentRide.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <div className={`status-indicator status-${statusInfo.color}`}>
                          <StatusIcon size={24} />
                          <span>{statusInfo.text}</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Passenger;