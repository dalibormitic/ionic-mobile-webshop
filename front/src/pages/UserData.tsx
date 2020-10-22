import React, { useState } from 'react';
import {
  IonItem,
  IonLabel,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonPage,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonContent,
  IonButtons,
  IonBackButton,
  IonToast,
} from '@ionic/react';
import axios from 'axios';

const UserData: React.FC = (props: any) => {
  const user = props.location.state.user;
  const [disabled, setdisabled] = useState<boolean>(true);
  const [email, setEmail] = useState<string>(user['email']);
  const [name, setName] = useState<string>(user['name']);
  const [address, setAddress] = useState<string>(user['address']);
  const [number, setNumber] = useState<string>(user['phone']);
  const [toastMessage, setToastMessage] = useState<string>();
  const [showToast, setShowToast] = useState(false);

  const changeDisabled = (e: React.FormEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    setdisabled(!disabled);
  };

  const updateData = (e: React.FormEvent<HTMLIonButtonElement>) => {
    e.preventDefault();
    axios
      .patch(
        process.env.REACT_APP_API_URL + '/users/me',
        {
          email: email,
          name: name,
          phone: number,
          address: address,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
      .then((response) => {
        setToastMessage('Uspešno izmenjeni podaci!');
        setShowToast(true);
        setTimeout(() => {
          props.history.goBack();
        }, 2000);
      })
      .catch((error) => {
        setToastMessage('Proverite podatke!');
        setShowToast(true);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Moji podaci</IonTitle>
          <IonButtons slot="start">
            <IonBackButton> </IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-text-center" id="title">
          Moji podaci
        </p>
        <form>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="8" offset="2">
                <IonItem>
                  <IonLabel position="floating">Email</IonLabel>
                  <IonInput
                    disabled={disabled}
                    value={email}
                    onIonChange={(e) => setEmail(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-align-items-center">
              <IonCol size="8" offset="2">
                <IonItem>
                  <IonLabel position="floating">Ime i prezime</IonLabel>
                  <IonInput
                    disabled={disabled}
                    value={name}
                    type="text"
                    onIonChange={(e) => setName(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-align-items-center">
              <IonCol size="8" offset="2">
                <IonItem>
                  <IonLabel position="floating">Adresa</IonLabel>
                  <IonInput
                    disabled={disabled}
                    value={address}
                    type="text"
                    onIonChange={(e) => setAddress(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow className="ion-align-items-center">
              <IonCol size="8" offset="2">
                <IonItem>
                  <IonLabel position="floating">Broj telefona</IonLabel>
                  <IonInput
                    disabled={disabled}
                    value={number}
                    type="text"
                    onIonChange={(e) => setNumber(e.detail.value!)}
                  ></IonInput>
                </IonItem>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton
                  color="secondary"
                  className="customButton"
                  onClick={(e: any) => changeDisabled(e)}
                  disabled={!disabled}
                >
                  Izmeni
                </IonButton>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="ion-text-center">
                <IonButton
                  color="secondary"
                  className="customButton"
                  disabled={disabled}
                  onClick={(e) => updateData(e)}
                >
                  Sačuvaj izmene
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
      </IonContent>
    </IonPage>
  );
};

export default UserData;
