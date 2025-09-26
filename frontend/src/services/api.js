import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para log de requests (opcional)
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const rideService = {
  // Solicitar corrida
  async requestRide(passengerId, pickup, destination) {
    try {
      const response = await api.post('/rides/request', {
        passengerId,
        pickup,
        destination
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao solicitar corrida');
    }
  },

  // Aceitar corrida
  async acceptRide(rideId, driverId) {
    try {
      const response = await api.post('/rides/accept', {
        rideId,
        driverId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao aceitar corrida');
    }
  },

  // Atualizar status da corrida
  async updateRideStatus(rideId, status, driverId) {
    try {
      const response = await api.post('/rides/update-status', {
        rideId,
        status,
        driverId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao atualizar status');
    }
  },

  // Listar corridas
  async getRides(filters = {}) {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });

      const response = await api.get(`/rides?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar corridas');
    }
  },

  // Obter estatísticas
  async getStats() {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Erro ao carregar estatísticas');
    }
  }
};

export default api;