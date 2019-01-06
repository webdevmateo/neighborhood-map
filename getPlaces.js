function getPlaces() {
  return fetch('https://api.foursquare.com/v2/venues/explore?client_id=JEASTQIYAOQHC5EJ45NM4QUSD2AS11EADPF51VDM42O4Q13A&client_secret=GEMFOAQ5IBMRS1ROLEFMRMNEZSV0R3QYPZEMLALQJNUFANCH&v=20180323&limit=15&ll=40.7243,-74.0018&near=Agoura Hills, CA');
}

export default getPlaces;
