import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonCol,
  IonRow,
  IonToast,
} from '@ionic/react';
import { withRouter } from 'react-router';
import axios from 'axios';
import '../theme/Style.css';

const Cart: React.FC = (props: any) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();

  const products = props.location.state.productsForCart;
  const newProducts: any = [];

  products.forEach((product: any) => {
    const { image, ...rest } = product;
    newProducts.push(rest);
  });

  const user = props.location.state.user;
  let totalCost = 0;

  const confirmOrder = (user: any, products: any) => {
    axios
      .post(
        process.env.REACT_APP_API_URL + '/orders',
        {
          orderedBy: user['_id'],
          products: newProducts,
          price: totalCost,
        },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      )
      .then((response) => {
        setToastMessage('Uspešno naručeno!');
        setShowToast(true);
        setTimeout(() => {
          props.history.goBack();
        }, 2000);
      })
      .catch((error) => {
        setToastMessage('Došlo je do greške! Pokušajte ponovo!');
        setShowToast(true);
      });
  };

  products.forEach((item: any) => {
    totalCost += item['price'] * item['count'];
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Korpa</IonTitle>
          <IonButtons slot="start">
            <IonBackButton> </IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p className="ion-text-center" id="title">
          Korpa
        </p>
        <p id="cartProducts">Proizvodi u korpi:</p>
        <ul>
          {products.map((item: any) => (
            <li key={item['_id']} id="cartProduct">
              {item['productName']} x {item['count']}
            </li>
          ))}
        </ul>

        <p id="totalCost">
          Ukupno košta: <span id="totalCostSpan">{totalCost} RSD</span>
        </p>
        <p id="cartUser">Naručilac: {user['name']}</p>
        <IonRow>
          <IonCol offset="1" size="5">
            <IonButton
              disabled={newProducts.length === 0}
              color="secondary"
              onClick={() => confirmOrder(user, products)}
              className="customButton"
            >
              Potvrdi kupovinu
            </IonButton>
          </IonCol>
          <IonCol offset="2">
            <IonButton
              color="secondary"
              onClick={() => props.history.goBack()}
              className="customButton"
            >
              Otkaži
            </IonButton>
          </IonCol>
        </IonRow>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default withRouter(Cart);
