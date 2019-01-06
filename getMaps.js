function getGoogleMaps() {
  return new Promise((resolve, reject) => {
    window.resolveGoogleMapsPromise = () => {
      resolve(window.google);
      delete window.resolveGoogleMapsPromise;
    };
    const script = document.createElement('script');
    const API = 'AIzaSyBYxtGxA3B4KgCSBExLmK_lD_lq5u-xkMA';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
}

export default getGoogleMaps;
