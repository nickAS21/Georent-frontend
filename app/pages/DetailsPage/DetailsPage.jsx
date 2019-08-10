import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { baseUrl, getData } from 'utils/api';

export default class DetailsPage extends Component {
  static propTypes = {
    styles: PropTypes.object.isRequired
  }

  constructor() {
    super();
    this.state = {
      lot: {
        id: 0,
        price: 0,
        coordinates: {
          address: '',
          longitude: 0,
          latitude: 0
        },
        description: {
          lotName: '',
          lotDescription: '',
          pictureIds: [],
          urls: []
        }
      },
      responseStatusVisible: false,
      responseText: ""
    };
  };

  componentDidMount = () => {
    fetch(`${baseUrl}lot/${this.props.match.params.lotId}`)
      .then(resp => {
        console.log('resp', resp);
        return resp.json()
      })
      .then(data => {
        console.log('DATA', data);
        this.setState(prevState => ({
          ...prevState,
          lot: {
            ...prevState.lot,
            id: data.id,
            price: data.price,
            coordinates: {
              ...prevState.lot.coordinates,
              address: data.coordinates.address,
              longitude: data.coordinates.longitude,
              latitude: data.coordinates.latitude
            },
            description: {
              ...prevState.lot.description,
              lotName: data.description.lotName,
              lotDescription: data.description.lotDescription,
              pictureIds: data.description.pictureIds,
              urls: data.description.urls
            }
          },
          responseStatusVisible: false,
          responseText: ""
        }));
        console.log(this.state)
      });
  }

  onSubmit = event => {
    event.preventDefault();
    console.log("delete", this.state);
    let token = window.localStorage.getItem('jwt');
    fetch(`${baseUrl}user/lot/${this.props.match.params.lotId}`, {
      method: "DELETE",
      headers: {
        'Accept': 'application/json;charset=UTF-8',
        'Content-Type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Headers': 'authorization',
        'Authorization': `Bearer ${token || ''}`
      }
    })
      .then(resp => {
        console.log('resp', resp);
        if (resp.status == 200) {
          this.setState({
            lot: {
              id: 0,
              price: 0,
              coordinates: {
                address: '',
                longitude: 0,
                latitude: 0
              },
              description: {
                lotName: '',
                lotDescription: '',
                pictureIds: [],
                urls: []
              }
            }
          });
        }
        return resp.json()
      })
      .then(data => {
        console.log('DATA', data);
        if (data.message) {
          this.setState({
            responseStatusVisible: true,
            responseText: data.message
          });
        }
        else {
          this.setState({
            responseStatusVisible: true,
            responseText: data.cause
          });
        }
        console.log(this.state)
      });

  };

  render() {
    const { styles } = this.props;
    const { lot: { id, price, coordinates: { address, longitude, latitude }, description: { lotName, lotDescription, pictureIds, urls } }, responseStatusVisible } = this.state;
    return (
      <div className={styles.detailsPage}>
        {responseStatusVisible &&
          <div>
            <h2>
              {this.state.responseText}
            </h2>
          </div>
        }
          <h1>{id} . {lotName}</h1>
          <div className={styles.imagesWrapper}>{urls.map(item => <div key={item}><img src={item} /></div>)}</div>
          <h2>Цена:</h2>
          <div>{price} грн.</div>
          <h2>Адрес лота:</h2>
          <div>address {address}</div>
          <div>longitude {longitude}</div>
          <div>latitude {latitude}</div>
          <h2>Описание лота:</h2>
          <div>{lotDescription}</div>
          <h2>pictureIds</h2>
          <div>pictureIds {pictureIds.map(item => <div key={item}>picture id {item} </div>)}</div>
          <div>
            <button
              type="button"
              className="btn btn-primary m-2"
              onClick={this.onSubmit}
            >
              Delete
            </button>
          </div>
      </div>

    );
  }
}
