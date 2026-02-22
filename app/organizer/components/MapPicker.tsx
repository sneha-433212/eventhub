"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import styles from "../styles/map.module.css";

const customIcon = L.icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function SearchAndClick({
  setLocation,
  value,
}: {
  setLocation: (val: string) => void;
  value?: string;
}) {
  const map = useMap();
  const [markerPos, setMarkerPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!value) return;

    const provider = new OpenStreetMapProvider();

    async function loadOldLocation() {
      try {
        const results = await provider.search({
          query: value,
        } as any);

        if (results && results.length > 0) {
          const { x, y } = results[0];

          setMarkerPos([y, x]);
          map.setView([y, x], 13);
        }
      } catch (error) {
        console.error("Failed to restore location", error);
      }
    }

    loadOldLocation();
  }, [value, map]);

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new (GeoSearchControl as any)({
      provider,
      style: "bar",
      showMarker: false,
      autoClose: true,
      retainZoomLevel: false,
    });

    map.addControl(searchControl);

    map.on("geosearch/showlocation", (result: any) => {
      const { x, y, label } = result.location;

      setMarkerPos([y, x]);
      setLocation(label);
    });

    return () => {
      map.removeControl(searchControl);
    };
  }, [map, setLocation]);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

 
      setMarkerPos([lat, lng]);

      try {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );

  if (!res.ok) return; 

  const data = await res.json();

  if (data?.display_name) {
    setLocation(data.display_name);
  }
} catch {

}
    },
  });

  return markerPos ? <Marker position={markerPos} icon={customIcon} /> : null;
}

export default function MapPicker({
  setLocation,
  value,
}: {
  setLocation: (val: string) => void;
  value?: string;
}) {
  return (
    <div className={styles.mapWrapper}>
      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={13}
        className={styles.mapContainer}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SearchAndClick setLocation={setLocation} value={value} />
      </MapContainer>
    </div>
  );
}