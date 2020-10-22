import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonContent,
  IonRow,
  IonCol,
} from '@ionic/react';
import { Accordion, Card, Button } from 'react-bootstrap';
import '../theme/Style.css';

const Orders: React.FC = (props: any) => {
  const [orders, setOrders] = useState<Array<any>>([]);
  const user = props.location.state.user;

  useEffect(() => {
    let mounted = true;
    axios
      .get(process.env.REACT_APP_API_URL + '/orders/' + user['_id'], {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (mounted) {
          setOrders(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    return () => {
      mounted = false;
    };
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Narudžbine</IonTitle>
          <IonButtons slot="start">
            <IonBackButton> </IonBackButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRow>
          <IonCol>
            <h3 id="totalCost" className="ion-text-center">
              Narudžbine
            </h3>
          </IonCol>
        </IonRow>
        <Accordion>
          {orders.map((order, i) => (
            <Card key={order['_id'] + 'card'}>
              <Card.Header>
                <Accordion.Toggle
                  as={Button}
                  variant="link"
                  eventKey={i.toString()}
                >
                  <IonRow>
                    <IonCol>
                      <h5
                        style={{
                          color: 'black',
                          fontWeight: 'bold',
                          fontSize: '16px',
                        }}
                      >
                        {order['createdAt'].replace('T', ' ').substring(0, 19)}
                        {' - '}
                        Iznos: {order['price']} RSD (klik za detalje)
                      </h5>
                    </IonCol>
                  </IonRow>
                </Accordion.Toggle>
              </Card.Header>

              <Accordion.Collapse eventKey={i.toString()}>
                <Card.Body>
                  <h3>
                    Datum:{' '}
                    {order['createdAt'].replace('T', ' ').substring(0, 19)}
                  </h3>
                  {order['products'].map((product: any) => (
                    <h5 key={order['_id'] + product['_id']}>
                      {product['productName']} x {product['count']}
                    </h5>
                  ))}
                  <h3>Cena: {order['price']} RSD</h3>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ))}
        </Accordion>
      </IonContent>
    </IonPage>
  );
};

export default Orders;
