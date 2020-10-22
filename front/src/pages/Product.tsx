import React, { useState } from 'react';
import {
  IonCard,
  IonImg,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonButton,
  IonRow,
  IonCol,
  IonList,
  IonBadge,
  IonToast,
  IonIcon,
} from '@ionic/react';
import '../theme/Style.css';
import { informationCircle } from 'ionicons/icons';

interface ChildProps {
  addToCart: (prod: any) => void;
  product: any;
}

const Product: React.FC<ChildProps> = (props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>();

  const ings = props.product['ingredients'];

  const addToCart = () => {
    props.addToCart(props.product);
    setToastMessage('Dodato u korpu!');
    setShowToast(true);
  };

  return (
    <>
      <IonCard key={props.product['_id']}>
        <IonImg
          src={
            'data:image/png;base64,' +
            Buffer.from(props.product['image']['data']).toString('base64')
          }
          alt="Product"
          id="product-img"
          className="ion-align-items-center"
        />
        <IonCardHeader>
          <IonCardSubtitle className="ion-text-right">
            <IonBadge color="secondary" id="cardPrice">
              Cena: {props.product['price']} RSD
            </IonBadge>
          </IonCardSubtitle>
          <IonCardTitle id="cardName">
            {props.product['productName']}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent id="cardDesc">
          {props.product['description']}
          <IonRow>
            <IonCol>
              <IonButton
                color="secondary"
                className="customButton"
                size="small"
                fill="clear"
                onClick={() => setShowModal(true)}
              >
                <IonIcon
                  slot="start"
                  ios={informationCircle}
                  md={informationCircle}
                ></IonIcon>
                Detaljnije
              </IonButton>
            </IonCol>
          </IonRow>
        </IonCardContent>

        <IonRow>
          <IonCol className="ion-text-center">
            <IonButton
              color="secondary"
              id="addButton"
              onClick={() => addToCart()}
              className="customButton"
            >
              Dodaj u korpu
            </IonButton>
          </IonCol>
        </IonRow>
      </IonCard>

      <IonModal isOpen={showModal} id="productModal">
        <IonList>
          <h3 className="ion-text-center" id="modalName">
            {props.product['productName']}
          </h3>
          <IonImg
            src={
              'data:image/png;base64,' +
              Buffer.from(props.product['image']['data']).toString('base64')
            }
            alt="Product"
            id="modal-img"
            className="ion-align-items-center"
            onClick={() => setShowModal(true)}
          />
          <p id="price">Sastojci:</p>
          <ul style={{ marginTop: '16px' }}>
            {ings.map((ing: any, i: number) => (
              <li key={ing['ingredient']}>{ing['ingredient']}</li>
            ))}
          </ul>
          <p id="price">Cena: {props.product['price']} RSD</p>
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton onClick={() => setShowModal(false)} color="secondary">
                Zatvori detalje
              </IonButton>
            </IonCol>
          </IonRow>
        </IonList>
      </IonModal>

      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={100}
      />
    </>
  );
};

export default Product;
