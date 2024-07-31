const socket = io();

// Check if the browser supports geolocation.

if(navigator.geolocation){
    // Now lets find latitude and longitude of the position.
    navigator.geolocation.watchPosition(
        (position) => {
        const {latitude , longitude} = position.coords;
        socket.emit("send-location", {latitude , longitude}); // Sent to the server.
        }, 
        (error) => {
            console.log(error);
        },
        {
            enableHighAccuracy : true, // High Accuracy.
            timeout : 5000,
            maximumAge : 0 // No caching, because we need Real Time Data.
        }
    );


}

const map = L.map("map").setView([0 , 0], 16);

const StreetMap = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

L.tileLayer(StreetMap, {
    attribution : "OpenStreetMap"
}).addTo(map);

// Create an Empty Object Marker.

const markers = {};

// Receiving the Data from the Backend.
socket.on("receive-location", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude , longitude]); // Now Current Location will be at the centre of the Map.

    // If marker is Present, update its Latitude and Longitude.
    if(markers[id]){
        markers[id].setLatLng([latitude , longitude]);
    }
    else{
        markers[id] = L.marker([latitude , longitude]).addTo(map);
    }
});

socket.on("user-disconnected", (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

