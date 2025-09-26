import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Car, Users, BarChart3, Home } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/passenger', icon: Users, label: 'Passageiro' },
    { path: '/driver', icon: Car, label: 'Motorista' },
    { path: '/admin', icon: BarChart3, label: 'Admin' }
  ];

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <Car size={32} />
          <h1>Sistema de Corridas</h1>
        </div>
        
        <nav className="header-nav">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;