function initMap() {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.15334, lng: -118.761676},
    zoom: 12
  });

  let fetchedLocations = fetchLocations();
  fetchedLocations
  .then(function(locationData) {
    setMarkers(locationData, map);
    populateLocationList(locationData, map);
  })
  .catch(function(error) {
    console.log(error);
  });

  // let likes = getLikes(locationID);
  // likes.then(function(response) {
  //   console.log(response);
  //   return response;
  // });

}

function fetchLocations() {
   return fetch(
    'https://api.foursquare.com/v2/venues/explore?client_id=JEASTQIYAOQHC5EJ45NM4QUSD2AS11EADPF51VDM42O4Q13A&client_secret=GEMFOAQ5IBMRS1ROLEFMRMNEZSV0R3QYPZEMLALQJNUFANCH&v=20180323&limit=15&ll=40.7243,-74.0018&near=Agoura Hills, CA'
    )
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
          let locations = populateLocationsArray(data);
          return locations;
        })
        .catch(function(error) {
            console.log(error);
        });
}

function getLikes(venueID) {
  return fetch(
    'https://api.foursquare.com/v2/venues/' + venueID + '/likes?client_id=JEASTQIYAOQHC5EJ45NM4QUSD2AS11EADPF51VDM42O4Q13A&client_secret=GEMFOAQ5IBMRS1ROLEFMRMNEZSV0R3QYPZEMLALQJNUFANCH&v=20180323'
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        let likes = data.response.likes.summary;
        return likes;
      })
      .catch(function(error) {
        console.log(error);
      })

}

function populateLocationsArray(locationsData) {
  let responseLength = locationsData.response.groups[0].items.length;
  let locations = [];
  for (let i = 0; i < responseLength; i++) {
    let location = locationsData.response.groups[0].items[i].venue;
    locations.push(location);
  }
  return locations;
}

function setMarkers (locationData, map) {
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
      marker.addListener('click', function() {
        populateInfoWindow(this, largeInfoWindow, locationData[i]);
      });
    }
    let largeInfoWindow = createInfoWindow();
    return markers;
}

function createInfoWindow() {
  return new google.maps.InfoWindow();
}

function populateInfoWindow(marker, infowindow, locationData) {
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    let streetViewService = new google.maps.StreetViewService();
    let radius = 50;
    let locationID = locationData.id;
    let likes = getLikes(locationID);
    likes.then(function(response) {
      document.querySelector('.likes').innerHTML = response + ' by FourSquare users';
    })

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

function populateLocationList(locations, map) {
  const ul = document.querySelector('.results');
  let markers = setMarkers(locations, map);
  let infowindow = createInfoWindow();
  for (i = 0; i < locations.length; i++) {
    let li = document.createElement('li');
    li.classList.value = 'locationLink';
    li.innerHTML = locations[i].name;
    ul.appendChild(li);
    ul.onclick = function(event) {
      let marker = markers.filter(function(marker){
        return marker.title == event.target.innerText;
      });
      let location = locations.filter(function(location) {
        return location.name == event.target.innerText;
      })
      populateInfoWindow(marker[0], infowindow, location[0]);
    }
  }
}















