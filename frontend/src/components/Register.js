import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Register(props) {
  const [userData, setUserData] = useState({password: '', email: ''});

  function handleChange(e) {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  function handleSubmit(e) {
    e.preventDefault();
    const { password, email } = userData;
    props.handleSubmitRegistration(password, email);
  }

  return (
    <div className="register">
        <p className="register__welcome">Регистрация</p>
        <form onSubmit={handleSubmit} className="register__form">
          <label htmlFor="email" className="register__input">
            <input 
              required 
              id="email" 
              name="email" 
              className="register__input-text" 
              type="email" 
              autoComplete="email" 
              placeholder="E-mail" 
              value={userData.email} 
              onChange={handleChange} />
            </label>
            <label htmlFor="password" className="register__input">
              <input 
                required 
                id="password" 
                name="password" 
                className="register__input-text" 
                type="password" 
                autoComplete="new-password" 
                placeholder="Пароль" 
                value={userData.password} 
                onChange={handleChange} />
            </label>
              <button 
                type="submit" 
                onSubmit={handleSubmit} 
                className="register__link register__button" 
                onClick={props.tooltipOpen}>
                  Зарегистрироваться
              </button>
          </form>
          <div className="register__signin">
            <Link to="/sign-in" className="register__login-link">Уже зарегистрированы? Войти</Link>
          </div>
        </div>
  );
  }

export default Register;