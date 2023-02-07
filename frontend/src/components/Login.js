import React, { useState } from 'react';

function Login(props) {
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
    if (!userData.password || !userData.email) {
      return;
    }
    const { password, email } = userData;
    props.handleSubmitSignIn(password, email);
  }

  return(
    <div className="login">
      <p className="login__welcome">Вход</p>
      <form onSubmit={handleSubmit} className="login__form">
        <label htmlFor="email" className="login__input">
          <input 
            required id="email" 
            name="email" 
            className="login__input-text" 
            type="email" 
            placeholder="E-mail" 
            value={userData.email} 
            onChange={handleChange} />
        </label>
        <label htmlFor="password" className="login__input">
          <input 
            required 
            id="password" 
            name="password" 
            className="login__input-text" 
            type="password" 
            placeholder="Пароль" 
            value={userData.password} 
            onChange={handleChange} />
        </label>
          <button type="submit" onSubmit={handleSubmit} className="login__link login__button">Войти</button>
      </form>
    </div>
    )
  }

export default Login;