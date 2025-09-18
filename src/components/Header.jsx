import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="app-header">
      <div className="logo-container">
        <h1 className="logo-title">GiroPro</h1>
      </div>
      <nav className="navigation">
        <a href="#" className="nav-link">Dashboard</a>
        <a href="#" className="nav-link">Despesas</a>
        <a href="#" className="nav-link">Abastecimentos</a>
        <a href="#" className="nav-link">Relatórios</a>
      </nav>
      <div className="profile-container">
        <span className="profile-name">Usuário</span>
      </div>
    </header>
  );
};

export default Header;
