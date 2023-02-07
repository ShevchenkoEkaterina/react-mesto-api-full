import React from 'react';
import headerLogo from '../images/Logo.svg';
import { useLocation, Link } from 'react-router-dom';

function Header(props) {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__top">
        <img className="header__logo" src={headerLogo} alt="Логотип"/>
      </div>
        {location.pathname === "/" && 
          <div className="header__user">
            <div className="header__user_information">{props.email}</div>
            <button onClick={props.signOut} className="header__user_button">Выйти</button>
          </div>
        }
        {location.pathname === "/sign-up" && <Link to="/sign-in" className="header__information">Войти</Link>}
        {location.pathname === "/sign-in" && <Link to="/sign-up" className="header__information">Регистрация</Link>}
    </header>
  );
}

export default Header;