import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonToast,
  IonImg,
} from '@ionic/react';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../theme/Style.css';
import logo from '../logo-velika.png';
import { Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Login: React.FC = (props) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();
  const [success, setSuccess] = useState<boolean>(false);

  const { setUser } = useContext(UserContext);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios
      .post(process.env.REACT_APP_API_URL + '/users/login', {
        email: email,
        password: password,
      })
      .then((response) => {
        setSuccess(true);
        saveTokenToLS(response.data.token);
        setUser(response.data.user);
      })
      .catch((error) => {
        setToastMessage('Proverite podatke!');
        setShowToast(true);
      });
  };

  const saveTokenToLS = (token: string) => {
    localStorage.setItem('token', token);
  };

  return !localStorage.getItem('token') && !success ? (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle className="ion-text-center">Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <p className="ion-text-center" id="title">
            Prijavite se za nastavak
          </p>
          <IonImg src={logo} id="logo" />
          <form
            onSubmit={(e) => {
              onFormSubmit(e);
            }}
          >
            <IonGrid>
              <IonRow className="ion-align-items-center">
                <IonCol size="8" offset="2">
                  <IonItem>
                    <IonLabel position="floating">Email</IonLabel>
                    <IonInput
                      value={email}
                      onIonChange={(e) => setEmail(e.detail.value!)}
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow className="ion-align-items-center">
                <IonCol size="8" offset="2">
                  <IonItem>
                    <IonLabel position="floating">Lozinka</IonLabel>
                    <IonInput
                      value={password}
                      onIonChange={(e) => setPassword(e.detail.value!)}
                      type="password"
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow>
                <IonCol className="ion-text-center">
                  <IonButton
                    color="secondary"
                    type="submit"
                    className="customButton"
                  >
                    Uloguj se
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol className="ion-text-center">
                  <p id="register">
                    Ukoliko nemate nalog,{' '}
                    <Link to="/register">registrujte se!</Link>
                  </p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </form>

          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={1000}
          />
        </IonList>
      </IonContent>
    </IonPage>
  ) : (
    <Redirect to="/products" />
  );
};

export default Login;
