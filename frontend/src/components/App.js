import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useHistory} from 'react-router-dom';
import CurrentUserContext from "../contexts/CurrentUserContext";
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import * as auth from '../utils/Auth';
import PopupWithForm from './PopupWithForm';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRoute from './ProtectedRoute';
import InfoTooltip from './InfoTooltip';

function App() {

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([ ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const history = useHistory();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isInfoPopupOpen, setIsInfoPopupOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getUserData(token)
      .then((res) => {
        if (res) {
          const email = {
            email: res.data.email
          };
          setIsLoggedIn(true);
          setEmail(email);
          history.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      api.getUserInfo()
        .then((result) => {
          setCurrentUser(result)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  function handleSubmitRegistration(password, email) {
      auth.register(password, email)
        .then((res) => {
          if (res.statusCode !== 400) {
            const email = {
              email: res.email
            }
            setEmail(email);
            history.push('/sign-in')
            setIsInfoPopupOpen(true);
            handleTooltipOpen();
          } else {
            setEmail(email);
            setIsInfoPopupOpen(false);
            handleTooltipOpen();
          }
        })
        .catch((error) => {
          console.log(error);
        });
  };

  function handleSubmitSignIn(password, email) {
    auth.signin(password, email)
      .then((res) => {
        if (res.token) {
          localStorage.setItem('token', res.token)
          const email = {
            email: res.email
          }
          setIsLoggedIn(true);
          setEmail(email);
          history.push('/');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(data) {
    api.editUserInfo(data.name, data.about)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function handleUpdateAvatar(data) {
    api.editAvatar(data.avatar)
    .then((result) => {
      setCurrentUser(result);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  useEffect(() => {
    if (isLoggedIn) {
      api.getInitialCards()
        .then((result) => {
          setCards(result)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [isLoggedIn]);

  function handleCardLike(card) {
    if(card.likes.some(i => i._id === currentUser._id)) {
      api.removeLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((error) => {
        console.log(error);
      });
    } else {
      api.addLike(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  function handleCardDelete(card) {
    if(card.owner._id === currentUser._id) {
      api.removeCard(card._id)
        .then((newCard) => {
          setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
          cards.filter(item => item._id !== newCard)
        })
       .catch((error) => {
         console.log(error);
       });
    }
};

  function handleAddPlaceSubmit(data) {
    api.addNewCard(data.title, data.url)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleTooltipOpen() {
    setIsTooltipOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsTooltipOpen(false);
  }

  function signOut() {
    localStorage.removeItem('token');
    setIsLoggedIn(false)
    history.push('/sign-in');
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <div className="page__container">
          <Header email={email.email} signOut={signOut}/>
          <Switch>
            <ProtectedRoute 
              exact path="/"
              loggedIn={isLoggedIn}
              component={() => (<div>
               <Main 
                  onEditProfile={handleEditProfileClick} 
                  onEditAvatar={handleEditAvatarClick} 
                  onAddPlace={handleAddPlaceClick} 
                  onCardClick={handleCardClick} 
                  cards={cards} 
                  onCardLike={handleCardLike} 
                  onCardDelete={handleCardDelete} 
                />
              </div>)}
            >
            </ProtectedRoute>
            <Route path="/sign-up">
              <Register tooltipOpen={handleTooltipOpen} handleSubmitRegistration={handleSubmitRegistration}/>
            </Route>
            <Route path="/sign-in">
              <Login handleSubmitSignIn={handleSubmitSignIn}/>
            </Route>
            <Route>
              {isLoggedIn ? (<Redirect to="/"/> ) : (<Redirect to="/sign-in"/>)}
            </Route>
          </Switch>
          <Footer />
          <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser}/>
          <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar}/>
          <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit}/>
          <ImagePopup card={selectedCard} onClose={closeAllPopups}/>
          <PopupWithForm name="delete" title="Вы уверены?" onClose={closeAllPopups}/>
          <InfoTooltip isOpen={isTooltipOpen} isSuccessOpen={isInfoPopupOpen} onClose={closeAllPopups}/>
        </div>
      </div>
    </CurrentUserContext.Provider>
  )
}

export default App;