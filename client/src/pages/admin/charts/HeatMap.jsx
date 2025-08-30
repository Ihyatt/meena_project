import GoogleMapReact from "google-map-react";

const googleMapsApi = import.meta.env.VITE_GOOGLE_MAPS_API;

const DonationsHeatmap = ({ donations }) => {
  const center = { lat: 37.80341, lng: -122.274666 };
  const zoom = 11;

  const convertedData = {
    positions: donations.map((point) => ({
      lat: parseFloat(point.lat),
      lng: parseFloat(point.lng),
    })),
  };

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: googleMapsApi }}
      defaultCenter={center}
      defaultZoom={zoom}
      heatmapLibrary={true}
      heatmap={{
        positions: convertedData.positions,
        options: {
          radius: 20,
          opacity: 0.7,
          gradient: [
            "rgba(0, 255, 255, 0)",
            "rgba(0, 255, 255, 1)",
            "rgba(0, 191, 255, 1)",
            "rgba(0, 127, 255, 1)",
            "rgba(0, 63, 255, 1)",
            "rgba(0, 0, 255, 1)",
            "rgba(0, 0, 223, 1)",
            "rgba(0, 0, 191, 1)",
            "rgba(0, 0, 159, 1)",
            "rgba(0, 0, 127, 1)",
            "rgba(63, 0, 91, 1)",
            "rgba(127, 0, 63, 1)",
            "rgba(191, 0, 31, 1)",
            "rgba(255, 0, 0, 1)",
          ],
        },
      }}
    ></GoogleMapReact>
  );
};

export default DonationsHeatmap;
