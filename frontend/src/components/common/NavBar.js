import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './NavBar.scss';
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBContainer,
  MDBNavbarToggler,
} from 'mdb-react-ui-kit';
import ConnectInLogo from '../../assets/ConnectIn.png';
import { useAuth } from '../../context/AuthContext';

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const { logout } = useAuth();

  const isActivePage = (path) => location.pathname === path;
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/network', icon: 'users', label: 'Network' },
    { path: '/jobs', icon: 'suitcase', label: 'Jobs' },
    { path: '/messaging', icon: 'message', label: 'Messaging' },
    {
      path: '/notifications',
      icon: 'bell',
      label: 'Notifications',
      hasBadge: true,
    },
    { path: '/profile', icon: 'user-circle', label: 'Profile' },
    { path: '/settings', icon: 'cog', label: 'Settings' },
  ];

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer className="navbar-container w-100">
        <div className="d-flex align-items-center justify-content-between w-100">
          <img
            src={ConnectInLogo}
            alt="ConnectIn Logo"
            className="navbar-logo"
            onClick={() => navigate('/home')}
          />
          <MDBNavbarToggler
            aria-expanded={openNavSecond}
            aria-label="Toggle navigation"
            onClick={() => setOpenNavSecond(!openNavSecond)}
          >
            <MDBIcon fas icon="bars" style={{ color: '#333' }} />
          </MDBNavbarToggler>
          <div className={`nav-menu${openNavSecond ? ' nav-menu--open' : ''}`}>
            <button
              className="mobile-close-btn"
              onClick={() => setOpenNavSecond(false)}
              aria-label="Close menu"
            >
              <MDBIcon fas icon="times" />
            </button>
            <MDBNavbarNav className="navbar-nav">
              {navItems.map((item) => {
                const active = isActivePage(item.path);
                const iconComponent = (
                  <MDBIcon
                    fas
                    icon={item.icon}
                    style={{
                      fontSize: '1.4rem',
                      color: active ? 'black' : 'gray',
                    }}
                  />
                );

                return (
                  <MDBNavbarItem
                    key={item.path}
                    className={`d-flex flex-column align-items-center navbar-nav-item${active ? ' nav-item-active' : ''}`}
                  >
                    <MDBNavbarLink
                      onClick={() => {
                        navigate(item.path);
                        setOpenNavSecond(false);
                      }}
                      className="d-flex flex-column align-items-center"
                    >
                      {item.hasBadge ? (
                        <div
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                          }}
                        >
                          {iconComponent}
                        </div>
                      ) : (
                        iconComponent
                      )}
                      <div>
                        <span
                          style={{
                            fontSize: '0.9rem',
                            fontWeight: active ? 'bold' : 'normal',
                          }}
                        >
                          {item.label}
                        </span>
                      </div>
                    </MDBNavbarLink>
                  </MDBNavbarItem>
                );
              })}
              <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
                <MDBNavbarLink
                  onClick={() => {
                    handleLogout();
                    setOpenNavSecond(false);
                  }}
                  className="d-flex flex-column align-items-center"
                >
                  <MDBIcon
                    fas
                    icon="sign-out-alt"
                    style={{
                      fontSize: '1.4rem',
                      color: 'red',
                    }}
                  />
                  <span style={{ fontSize: '0.9rem', color: 'red' }}>
                    Logout
                  </span>
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </div>
        </div>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavbarComponent;
