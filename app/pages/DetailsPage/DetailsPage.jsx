import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { baseUrl, getData } from 'utils/api';
import { Button } from 'primereact/button';
import {Growl} from "primereact/growl";

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

  onDelete = event => {
    // event.preventDefault();
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
        return resp.json();
      })
      .then(data => {
        if (data.message) {
          this.growl.show({severity: 'success', summary: `${data.message}`});
          this.setState({
            responseStatusVisible: true,
            responseText: data.message
          });
        }
        else {
          this.growl.show({severity: 'error', summary: `${data.cause}`});
          this.setState({
            responseStatusVisible: true,
            responseText: data.cause
          });
        }
      })
      .catch(error => {
        this.growl.show({severity: 'error', summary: `${error.message}`});
      })

      };

  render() {
    const { styles, isLogged } = this.props;
    const { lot: { id, price, coordinates: { address, longitude, latitude }, description: { lotName, lotDescription, pictureIds, urls } }, responseStatusVisible } = this.state;
    return (
      <div className={styles.detailsPage}>
        <Growl ref={(el) => this.growl = el} />
        {responseStatusVisible &&
          <div>
            <h2>
              {this.state.responseText}
            </h2>
          </div>
        }
          <h1>{id} . {lotName}</h1>
          <div className={styles.imagesWrapper}>{urls.map(item => <div key={item}><img src={item} /></div>)}</div>
          <h2>Price:</h2>
          <div>{price}$</div>
          <hr />
          <h2>Lot address:</h2>
          <div>Address: {address}</div>
          <div>Longitude: {longitude}</div>
          <div>Latitude: {latitude}</div>
          <hr />
          <h2>Lot Description:</h2>
          <div>{lotDescription}</div>
          <hr />
          <h2>Pictures:</h2>
          <div>{pictureIds.map(item => <div key={item}>picture id {item} </div>)}</div>
          <hr />
          {isLogged ?
          <div>
            <Button onClick={() => {
              this.onDelete();
              setTimeout(() => {
                this.props.history.push('/user/lots');
              }, 3000);
            }} label="Delete" className="btn" />
          </div> : null
          }
      </div>

    );
  }
}
