import React from 'react';
import { Users, Car, BarChart3, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
  const accessLinks = [
    {
      href: '/passenger',
      icon: Users,
      title: 'Solicitar Corrida',
      description: 'Reserve uma corrida rapidamente e acompanhe em tempo real',
      color: 'blue',
      emoji: '🚶'
    },
    {
      href: '/driver', 
      icon: Car,
      title: 'Dirigir com Uber',
      description: 'Ganhe dinheiro dirigindo quando e onde quiser',
      color: 'green',
      emoji: '🚗'
    },
    {
      href: '/admin',
      icon: BarChart3,
      title: 'Painel Admin',
      description: 'Monitore operações e analise dados do sistema',
      color: 'purple',
      emoji: '📊'
    }
  ];

  return (
    <div className="home">
      <div className="home-standalone">
        {/* Hero Section estilo Uber */}
        <div className="uber-hero">
          <div className="container">
            <div className="uber-hero-content">
              <h1>Vá a qualquer lugar</h1>
              <p>Solicite uma corrida, suba e relaxe</p>
            </div>
          </div>
        </div>
        
        <div className="access-section">
          <div className="container">
            <h2>Como você quer usar o Uber?</h2>
            <p className="subtitle">Escolha a experiência perfeita para você</p>
            
            <div className="access-grid">
              {accessLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`access-card access-card-${link.color}`}
                  >
                    <div className="access-icon">
                      <Icon size={48} />
                    </div>
                    <h3>{link.title}</h3>
                    <p>{link.description}</p>
                    <div className="access-arrow">
                      <ArrowRight size={20} />
                    </div>
                  </a>
                );
              })}
            </div>
            
            <div className="direct-links">
              <h3>Acesso Direto</h3>
              <ul>
                <li>
                  <a href="/passenger">
                    <span className="link-emoji">🚶</span>
                    <span>localhost:3000/passenger</span>
                  </a>
                </li>
                <li>
                  <a href="/driver">
                    <span className="link-emoji">🚗</span>
                    <span>localhost:3000/driver</span>
                  </a>
                </li>
                <li>
                  <a href="/admin">
                    <span className="link-emoji">📊</span>
                    <span>localhost:3000/admin</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;