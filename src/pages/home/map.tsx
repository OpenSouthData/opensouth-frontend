import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOXGL_ACCESS_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current || "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 9,
      scrollZoom: false,
    });

    map.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="w-full">
      <div ref={mapContainerRef} id="map" className="w-full h-[70vh]" />
    </div>
  );
}
