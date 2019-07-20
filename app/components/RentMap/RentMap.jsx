import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Map as LeafletMap, TileLayer, Marker, Popup
} from 'react-leaflet';
const RentMap = ({ styles, lots }) => {
  return (
      <LeafletMap
        center={[50.436795, 30.5305163]}
        zoom={10}
        maxZoom={20}
        attributionControl
        zoomControl
        doubleClickZoom
        scrollWheelZoom
        dragging
        animate
        easeLinearity={0.35}
        className={styles.leaflet_container}
      >
        <TileLayer
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {lots.map((item) => {
            if (!(item && item.lotName && item.address && item.price && item.id && item.description && item.coordinates.latitude && item.coordinates.longitude)) {
              item.lotName = 'Default name';
              item.coordinates.latitude = 50.436795;
              item.coordinates.longitude = 30.5305163;
            }
          return (
          <Marker key={item.id} position={[item.coordinates.latitude, item.coordinates.longitude]}>
            <Popup>
              {item.id} <Link to={`user/lot/${item.id}`}>{item.lotName}</Link>
            </Popup>
          </Marker>
          )}
/*          <Marker key={item.id} position={[50.436795, 30.5305163]}>
            <Popup>
              {item.id} {item.lotName}
            </Popup>
          </Marker> */
        )}
      </LeafletMap>
);
};

RentMap.propTypes = {
  styles: PropTypes.object.isRequired,
  lots: PropTypes.array.isRequired,
};

export default RentMap;
