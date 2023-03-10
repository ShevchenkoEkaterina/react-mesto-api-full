import React from 'react';

function PopupWithForm(props) {

  return (
    <div className={`popup popup_${props.name} ${props.isOpen ? 'popup_opened' : ' '}`}>
      <div className="popup__container">
        <button onClick={props.onClose} type="button" className="popup__close"></button>
        <form className={`input input_${props.name}`} onSubmit={props.onSubmit}>
          <h2 className="popup__title">{props.title}</h2>
          {props.children}
          
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;