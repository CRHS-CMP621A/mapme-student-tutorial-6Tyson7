navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(position);
    const latitude = position.coords.latitude;
    const longtitude = position.coords.longitude;

    var map = L.map("map").setView([latitude, longtitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longtitude])
      .addTo(map)
      .bindPopup(`${latitude}, ${longtitude}`)
      .openPopup();
  },
  function () {
    console.log("Could not get position.");
  }
);
