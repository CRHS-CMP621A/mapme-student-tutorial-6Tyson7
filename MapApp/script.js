"use strict";

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

let map;
let mapEvent;
let workouts = [];

class Workout {
  date = new Date();
  id = (Date.now() + "").slice(-10);

  constructor(coords, distance, duration) {}
}

class Running extends Workout {
  constructor(coords, distance, duration, cadence) {
    super();
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.cadence = cadence;
  }
}

class Cycling extends Workout {
  constructor(coords, distance, duration, elevationGain) {
    super();
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.elevationGain = elevationGain;
  }
}

let lat;
let lng;

navigator.geolocation.getCurrentPosition(
  function (position) {
    console.log(position);
    const latitude = position.coords.latitude;
    const longtitude = position.coords.longitude;

    map = L.map("map").setView([latitude, longtitude], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker([latitude, longtitude])
      .addTo(map)
      .bindPopup(`${latitude}, ${longtitude}`)
      .openPopup();

    console.log(map);

    map.on("click", function (mapEvent) {
      console.log(mapEvent);
      lat = mapEvent.latlng.lat;
      lng = mapEvent.latlng.lng;
    });

    map.on("click", function (mapEvent) {
      form.classList.remove("hidden");
      inputDistance.focus();
    });
  },
  function () {
    console.log("Could not get position.");
  }
);

inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});

form.addEventListener("submit", function (e) {
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "running-popup",
      })
    )
    .setPopupContent("Workout")
    .openPopup();
  e.preventDefault();

  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);
  const lat = mapEvent.latlng.lat;
  const lng = mapEvent.latlng.lng;
  let workout;

  if (inputType.value == "running") {
    // This code will reset back to running with the correct cadence/elevation options.
    const cadence = Number(inputCadence.value);

    workout = new Running([lat, lng], distance, duration, cadence);
    workouts.push(workout);
  }

  if (inputType.value == "cycling") {
    // This code will reset back to running with the correct cadence/elevation options.
    const elevationGain = +Number(inputElevation.value);

    workout = new Running([lat, lng], distance, duration, elevationGain);
    workouts.push(workout);
  }
  form.reset();
});

const run1 = new Running([39, -12], 5.2, 24, 148);
const cycl1 = new Cycling([39, -12], 53, 44, 518);
console.log(run1, cycl1);
