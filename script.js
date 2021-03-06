import getGoogleMaps from './getMaps.js';
import getPlaces from './getPlaces.js';

function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.15334, lng: -118.761676},
    zoom: 12
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed.");
  let googleMapsPromise = getGoogleMaps();
  let placesPromise = getPlaces();

  Promise.all([
    googleMapsPromise,
    placesPromise
    ])
    .then((values) => {
      console.log(values);
    })
    .catch((error) => {
      console.log(error);
    })
})

function populateInfoWindow(marker, infowindow, locationData) {
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    let streetViewService = new google.maps.StreetViewService();
    let radius = 50;


    function getStreetView(data, status) {
      let infowindowContent = `
          <h3 class="markerTitle">${marker.title}</h3>
          <div id="pano"></div>
          <div class="details">
            <div>${locationData.location.formattedAddress[0]}</div>
            <div>${locationData.location.formattedAddress[1]}</div>
            <div class="likes"></div>
          </div>
          `;
      let locationID = locationData.id;
      let likes = getLikes(locationID);
      likes.then(function(response) {
        document.querySelector('.likes').innerHTML = response + ' by FourSquare users';
      });
      let noStreetViewMessage = '<div class ="details">No street view found.</div>';
      if (status == google.maps.StreetViewStatus.OK) {
        let nearStreetViewLocation = data.location.latLng;
        let heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        infowindow.setContent(infowindowContent);
        let panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        }
        let panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent(noStreetViewMessage + infowindowContent);
      }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
}

function populateMarkersArray (locationData, map) {
    let responseLength = locationData.length;
    let markers = [];

      for (let i = 0; i < responseLength; i++) {
      let lat = locationData[i].location.lat;
      let lng = locationData[i].location.lng;
      let position = {lat: lat, lng: lng};
      let title = locationData[i].name;

      let marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
      });

      markers.push(marker);
      marker.addListener('click', () => {
        populateInfoWindow(marker, largeInfoWindow, locationData[i]);
      });
    }

    let largeInfoWindow = createInfoWindow();

    return markers;
  }



