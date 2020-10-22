import React, { useState, useContext } from 'react';
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
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import logo from '../logo-velika.png';
import axios from 'axios';
import { Redirect } from 'react-router';
import { UserContext } from '../context/UserContext';
import '../theme/Style.css';

const Register: React.FC = (props) => {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [name, setName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [number, setNumber] = useState<string>();
  const [toastMessage, setToastMessage] = useState<string>();
  const [showToast, setShowToast] = useState(false);

  const { setUser } = useContext(UserContext);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axios
      .post(process.env.REACT_APP_API_URL + '/users/', {
        email: email,
        password: password,
        name: name,
        phone: number,
        address: address,
      })
      .then((response) => {
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

  return !localStorage.getItem('token') ? (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonBackButton> </IonBackButton>
          </IonButtons>
          <IonTitle>Registracija</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <p className="ion-text-center" id="title">
            Registrujte se
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

              <IonRow className="ion-align-items-center">
                <IonCol size="8" offset="2">
                  <IonItem>
                    <IonLabel position="floating">Ime i prezime</IonLabel>
                    <IonInput
                      value={name}
                      onIonChange={(e) => setName(e.detail.value!)}
                      type="text"
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow className="ion-align-items-center">
                <IonCol size="8" offset="2">
                  <IonItem>
                    <IonLabel position="floating">Adresa</IonLabel>
                    <IonInput
                      value={address}
                      onIonChange={(e) => setAddress(e.detail.value!)}
                      type="text"
                    ></IonInput>
                  </IonItem>
                </IonCol>
              </IonRow>

              <IonRow className="ion-align-items-center">
                <IonCol size="8" offset="2">
                  <IonItem>
                    <IonLabel position="floating">Broj telefona</IonLabel>
                    <IonInput
                      value={number}
                      onIonChange={(e) => setNumber(e.detail.value!)}
                      type="text"
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
                    Potvrdi
                  </IonButton>
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

export default Register;
