export const displayMap = locations => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoicGhpemVyY29zdCIsImEiOiJjazYxemxjM3kwODd4M2lwZXg0a3hjbXdlIn0.u-Sli9VIflAGJRpgIOCheQ';

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/phizercost/ck6235zra0oyx1jtgxjrodkaq',
    scrollZoom: false
    // center: [30.055666444, -1.939662908],
    // zoom: 10,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    //Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    //   new mapboxgl.Popup({
    //     offset: 30
    //   })
    //     .setLngLat(loc.coordinates)
    //     .setHtml(`<p>Day ${loc.day}: ${loc.description}</p>`)
    //     .addTo(map);

    //Extend map bounds to include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
};
