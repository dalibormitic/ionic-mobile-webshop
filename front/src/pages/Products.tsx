import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenu,
  IonList,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPopover,
  IonRadioGroup,
  IonListHeader,
  IonRadio,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import {
  logOut,
  cart,
  cardOutline,
  personCircleOutline,
  filter,
} from 'ionicons/icons';
import { Redirect, withRouter } from 'react-router';
import Product from './Product';
import { UserContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import '../theme/Style.css';

const Products: React.FC = (props) => {
  const [products, setProducts] = useState<Array<any>>([]);
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [cartProduct, setCartProduct] = useState<Array<any>>([]);
  const [sort, setSort] = useState<string>('asc');
  const [showPopover, setShowPopover] = useState<boolean>(false);
  const [category, setCategory] = useState<string>('torte');

  const { user, setUser } = useContext(UserContext);

  const addToCart = (product: any) => {
    const cartItems = cartProduct.slice();
    let inCart = false;
    cartItems.forEach((item: any) => {
      if (item['_id'] === product['_id']) {
        item.count++;
        inCart = true;
      }
    });
    if (!inCart) {
      cartItems.push({ ...product, count: 1 });
    }
    setCartProduct(cartItems);
  };

  useEffect(() => {
    let mounted = true;
    if (localStorage.getItem('token')) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }

    axios
      .get(process.env.REACT_APP_API_URL + '/products', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
      .then((response) => {
        if (mounted) {
          setProducts(response.data);
        }
      })
      .catch((error) => {
        console.log(error.response);
      });

    return () => {
      mounted = false;
    };
  }, [loggedOut, authorized]);

  function compare(a: any, b: any) {
    if (a['price'] < b['price']) {
      return -1;
    }
    if (a['price'] > b['price']) {
      return 1;
    }
    return 0;
  }

  if (sort === 'asc') {
    products.sort(compare);
  } else if (sort === 'desc') {
    products.sort(compare).reverse();
  }

  const logout = async () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    if (!loggedOut) {
      await axios
        .post(
          process.env.REACT_APP_API_URL + '/users/logout',
          {},
          {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
          }
        )
        .then((response) => {
          localStorage.removeItem('token');
          setLoggedOut(true);
          setUser({});
        })
        .catch((error) => {
          console.log('Greska', error);
        });
      source.cancel();
    }
  };

  return localStorage.getItem('token') && !loggedOut ? (
    <IonPage>
      <IonMenu side="start" contentId="main-content">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Menu</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonItem>
              <IonIcon
                slot="start"
                ios={personCircleOutline}
                md={personCircleOutline}
              ></IonIcon>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to={{
                  pathname: '/profile',
                  state: {
                    user: user,
                  },
                }}
              >
                Moji podaci: {user['name']}
              </Link>
            </IonItem>
            <IonItem>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to={{
                  pathname: '/cart',
                  state: {
                    productsForCart: cartProduct,
                    user: user,
                  },
                }}
              >
                Korpa
              </Link>
              <IonIcon slot="start" ios={cart} md={cart}></IonIcon>
            </IonItem>
            <IonItem>
              <IonIcon
                slot="start"
                ios={cardOutline}
                md={cardOutline}
              ></IonIcon>
              <Link
                style={{ textDecoration: 'none', color: 'black' }}
                to={{
                  pathname: '/orders',
                  state: {
                    user: user,
                  },
                }}
              >
                Moje porudžbine
              </Link>
            </IonItem>
            <IonItem onClick={() => logout()}>
              <IonIcon slot="start" ios={logOut} md={logOut}></IonIcon>
              <IonLabel>Izloguj se</IonLabel>
            </IonItem>
          </IonList>
        </IonContent>
      </IonMenu>

      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle className="ion-text-center">Proizvodi</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowPopover(true)}>
              <IonIcon slot="icon-only" ios={filter} md={filter}></IonIcon>
            </IonButton>
            <IonButton
              onClick={() => {
                logout();
              }}
            >
              <IonIcon slot="icon-only" ios={logOut} md={logOut}></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent id="main-content">
        <p className="ion-text-center" id="title">
          Proizvodi
        </p>

        <IonPopover
          isOpen={showPopover}
          onDidDismiss={(e) => setShowPopover(false)}
          animated
        >
          <IonRadioGroup
            value={sort}
            onIonChange={(e) => setSort(e.detail.value)}
          >
            <IonListHeader>
              <IonLabel style={{ fontSize: '18px' }}>Sortiraj prema</IonLabel>
            </IonListHeader>

            <IonItem>
              <IonLabel>Ceni - rastuće</IonLabel>
              <IonRadio
                slot="start"
                value="asc"
                onClick={() => setShowPopover(false)}
              />
            </IonItem>

            <IonItem>
              <IonLabel>Ceni - opadajuće</IonLabel>
              <IonRadio
                slot="start"
                value="desc"
                onClick={() => setShowPopover(false)}
              />
            </IonItem>
          </IonRadioGroup>
        </IonPopover>

        <IonSegment
          id="segment"
          value={category}
          onIonChange={(e) => setCategory(e.detail.value!)}
          color="secondary"
        >
          <IonSegmentButton value="torte">
            <IonLabel>Torte</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="kolaci">
            <IonLabel>Kolači</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {products
          .filter((product) => product['category'] === category)
          .map((product) => (
            <Product
              key={product['_id']}
              product={product}
              addToCart={addToCart}
            />
          ))}
      </IonContent>
    </IonPage>
  ) : (
    <Redirect to="/login" />
  );
};

export default withRouter(Products);
