import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  route: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: '🏠',
    route: '/dashboard'
  },
  {
    id: 'journeys',
    title: 'Jornadas',
    icon: '🚗',
    route: '/dashboard/journeys'
  },
  {
    id: 'fuelings',
    title: 'Abastecimentos',
    icon: '⛽',
    route: '/dashboard/fuelings'
  },
  {
    id: 'expenses',
    title: 'Despesas',
    icon: '💰',
    route: '/dashboard/expenses'
  },
  {
    id: 'vehicles',
    title: 'Veículos',
    icon: '🚙',
    route: '/dashboard/vehicles'
  }
];

const HTMLSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuItemClick = (route: string) => {
    navigate(route);
  };

  const isActiveRoute = (route: string) => {
    if (route === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(route);
  };

  const sidebarStyle: React.CSSProperties = {
    width: '256px',
    height: '100vh',
    backgroundColor: '#1a1d29',
    borderRight: '1px solid #2a2d3a',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 1000,
    color: '#ffffff'
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px',
    borderBottom: '1px solid #2a2d3a',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const logoIconStyle: React.CSSProperties = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#2196F320',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '16px'
  };

  const logoTextStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0
  };

  const menuContainerStyle: React.CSSProperties = {
    flex: 1,
    paddingTop: '16px',
    paddingLeft: '8px',
    paddingRight: '8px'
  };

  const getMenuItemStyle = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '4px',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? '#2196F320' : 'transparent',
    borderLeft: isActive ? '3px solid #2196F3' : '3px solid transparent',
    color: isActive ? '#2196F3' : '#9ca3af',
    textDecoration: 'none',
    fontWeight: isActive ? '600' : '500'
  });

  const footerStyle: React.CSSProperties = {
    padding: '16px',
    borderTop: '1px solid #2a2d3a'
  };

  const footerItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '8px 12px',
    gap: '12px',
    cursor: 'pointer',
    color: '#9ca3af'
  };

  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={logoIconStyle}>
          🚗
        </div>
        <h2 style={logoTextStyle}>GiroPro</h2>
      </div>

      {/* Menu Items */}
      <div style={menuContainerStyle}>
        {menuItems.map((item) => {
          const isActive = isActiveRoute(item.route);
          return (
            <div
              key={item.id}
              style={getMenuItemStyle(isActive)}
              onClick={() => handleMenuItemClick(item.route)}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
                {item.icon}
              </span>
              <span style={{ fontSize: '16px' }}>
                {item.title}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={footerStyle}>
        <div
          style={footerItemStyle}
          onClick={() => {
            console.log('Logout');
          }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>
            🚪
          </span>
          <span style={{ fontSize: '16px' }}>
            Sair
          </span>
        </div>
      </div>
    </div>
  );
};

export default HTMLSidebar;
