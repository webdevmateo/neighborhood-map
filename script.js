
function initMap() {
  let markers = [];
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 34.15334, lng: -118.761676},
    zoom: 12
  });

  fetchLocations();

  let locations = [
    {title: 'Sumac Elementary School', location: {lat: 34.161085, lng: -118.755882}},
    {title: 'Costco', location: {lat: 34.151917, lng: -118.797079}},
    {title: 'Target', location: {lat: 34.147689, lng: -118.793616}},
    {title: 'Trader Joe\'s', location: {lat: 34.146443, lng: -118.756649}},
    {title: 'Yarrow Family YMCA', location: {lat: 34.158963, lng: -118.800003}},
    {title: 'Oak Canyon Splash Pad', location: {lat: 34.184542, lng: -118.770962}}
  ]

  let largeInfoWindow = new google.maps.InfoWindow();

  for (let i = 0; i < locations.length; i++) {
    let position = locations[i].location;
    let title = locations[i].title;
    let marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

    markers.push(marker);
    marker.addListener('click', function() {
      populateInfoWindow(this, largeInfoWindow);
    });
  }
}

function populateInfoWindow(marker, infowindow) {
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });
    let streetViewService = new google.maps.StreetViewService();
    let radius = 50;
    function getStreetView(data, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        console.log(data);
        console.log(status);
        let nearStreetViewLocation = data.location.latLng;
        let heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
        let panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        }
        let panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
                '<div>No Street View Found</div>');
      }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
}

function fetchLocations() {
  return fetch('https://api.foursquare.com/v2/venues/explore?client_id=JEASTQIYAOQHC5EJ45NM4QUSD2AS11EADPF51VDM42O4Q13A&client_secret=GEMFOAQ5IBMRS1ROLEFMRMNEZSV0R3QYPZEMLALQJNUFANCH&v=20180323&limit=20&ll=40.7243,-74.0018&near=Agoura HIlls, CA')
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
      populateLocationsArray(data);
    })
    .catch(function(e) {
        console.log(e);
    });
}

function populateLocationsArray(locationsData) {
  let responseLength = locationsData.response.groups[0].items.length;
  let locations = [];
  for (let i = 0; i < responseLength; i++) {
    let location = locationsData.response.groups[0].items[i].venue;
    locations.push(location);
  }

  console.log(locations);
  // let locations = [
  //   {title: 'Sumac Elementary School', location: {lat: 34.161085, lng: -118.755882}},
  //   {title: 'Costco', location: {lat: 34.151917, lng: -118.797079}},
  //   {title: 'Target', location: {lat: 34.147689, lng: -118.793616}},
  //   {title: 'Trader Joe\'s', location: {lat: 34.146443, lng: -118.756649}},
  //   {title: 'Yarrow Family YMCA', location: {lat: 34.158963, lng: -118.800003}},
  //   {title: 'Oak Canyon Splash Pad', location: {lat: 34.184542, lng: -118.770962}}
  // ]
}

















