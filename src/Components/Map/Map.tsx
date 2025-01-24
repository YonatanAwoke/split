import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
    const map = new mapboxgl.Map({
      container: 'map', // ID of the container element
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-74.5, 40], // Initial center [lng, lat]
      zoom: 9 // Initial zoom level
    });

    return () => map.remove(); // Cleanup on component unmount
  }, []);

  return <div id="map" style={{ width: '100%', height: '400px' }} />;
};

export default Map;
