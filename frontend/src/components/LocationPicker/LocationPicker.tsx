import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { AimOutlined, LoadingOutlined } from "@ant-design/icons";
import "./LocationPicker.css";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface LocationPickerProps {
  value: { lat: number | null; lng: number | null };
  onChange: (location: { lat: number; lng: number }) => void;
}

function LocationMarker({
  position,
  setPosition,
}: {
  position: L.LatLng | null;
  setPosition: (pos: L.LatLng) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(
    value.lat && value.lng ? L.latLng(value.lat, value.lng) : null,
  );
  const [gettingLocation, setGettingLocation] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    41.2995, 69.2401,
  ]); // Tashkent default

  useEffect(() => {
    if (position) {
      onChange({ lat: position.lat, lng: position.lng });
    }
  }, [position]);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos = L.latLng(pos.coords.latitude, pos.coords.longitude);
        setPosition(newPos);
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setGettingLocation(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  return (
    <div className="location-picker">
      <div className="location-header">
        <span className="location-label">Choose delivery location</span>
        <button
          type="button"
          className="gps-btn"
          onClick={handleGetLocation}
          disabled={gettingLocation}
        >
          {gettingLocation ? <LoadingOutlined spin /> : <AimOutlined />}
          {gettingLocation ? "Detecting..." : "Use GPS"}
        </button>
      </div>
      <div className="map-container">
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="leaflet-map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>
      {position && (
        <div className="location-info">
          📍 {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
        </div>
      )}
      <p className="location-hint">
        Click on the map to select your delivery location
      </p>
    </div>
  );
}
