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
  type = "Running";

  constructor(coords, distance, duration, cadence) {
    super();
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.cadence = cadence;
    this.calcPace();
    this.setDescription();
  }

  calcPace() {
    this.pace = this.duration / this.distance;
    return this.pace.toFixed(2);
  }

  setDescription() {
    this.description = `${this.type} on ${this.date.toDateString()}`;
  }
}

class Cycling extends Workout {
  type = "Cycling";

  constructor(coords, distance, duration, elevationGain) {
    super();
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
    this.elevationGain = elevationGain;
    this.calcSpeed();
    this.setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);
    return this.speed.toFixed(2);
  }

  setDescription() {
    this.description = `${this.type} on ${this.date.toDateString()}`;
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

    const data = JSON.parse(localStorage.getItem("workouts"));

    if (data) {
      workouts = data;
      console.log(data);

      for (const workout of workouts) {
        let lat = workout.coords[0];
        let lng = workout.coords[1];
        let html;

        if (workout.type == "Running") {
          html = ` <li class="workout workout--running" data-id=${workout.id}>
                <h2 class="workout__title">${workout.description}</h2>
                <div class="workout__details">
                  <span class="workout__icon">🏃‍♂️</span>
                  <span class="workout__value">${workout.distance}</span>
                  <span class="workout__unit">km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⏱</span>
                  <span class="workout__value">${workout.duration}</span>
                  <span class="workout__unit">min</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">⚡️</span>
                  <span class="workout__value">${workout.pace}</span>
                  <span class="workout__unit">min/km</span>
                </div>
                <div class="workout__details">
                  <span class="workout__icon">🦶🏼</span>
                  <span class="workout__value">${workout.cadence}</span>
                  <span class="workout__unit">spm</span>
                </div>
              </li>`;
        } else if (workout.type == "Cycling") {
          html = ` <li class="workout workout--cycling" data-id=${workout.id}>
                  <h2 class="workout__title">Cycling on April 5</h2>
                  <div class="workout__details">
                    <span class="workout__icon">🚴‍♀️</span>
                    <span class="workout__value">${workout.distance}</span>
                    <span class="workout__unit">km</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⏱</span>
                    <span class="workout__value">${workout.duration}</span>
                    <span class="workout__unit">min</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⚡️</span>
                    <span class="workout__value">${workout.speed}</span>
                    <span class="workout__unit">km/h</span>
                  </div>
                  <div class="workout__details">
                    <span class="workout__icon">⛰</span>
                    <span class="workout__value">${workout.elevationGain}</span>
                    <span class="workout__unit">m</span>
                  </div>;`;
        }

        form.insertAdjacentHTML("afterend", html);
      }
    }

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
  const cadenceRow = inputCadence.closest(".form__row");
  const elevationRow = inputElevation.closest(".form__row");

  // 2. Explicitly add/remove classes based on the actual value
  if (inputType.value === "running") {
    cadenceRow.classList.remove("form__row--hidden");
    elevationRow.classList.add("form__row--hidden");
  }

  if (inputType.value === "cycling") {
    cadenceRow.classList.add("form__row--hidden");
    elevationRow.classList.remove("form__row--hidden");
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const type = inputType.value;
  const distance = Number(inputDistance.value);
  const duration = Number(inputDuration.value);

  let workout;

  if (inputType.value == "running") {
    // This code will reset back to running with the correct cadence/elevation options.
    const cadence = Number(inputCadence.value);

    workout = new Running([lat, lng], distance, duration, cadence);
  }

  if (inputType.value == "cycling") {
    const elevationGain = +Number(inputElevation.value);

    workout = new Cycling([lat, lng], distance, duration, elevationGain);
  }

  workouts.push(workout);

  console.log(workouts);

  localStorage.setItem("workouts", JSON.stringify(workouts));

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

  let html;

  if (workout.type == "Running") {
    html = ` <li class="workout workout--running" data-id=${workout.id}>
          <h2 class="workout__title">${workout.description}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.pace}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workout.cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>`;

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
  } else if (workout.type == "Cycling") {
    html = ` <li class="workout workout--cycling" data-id=${workout.id}>
          <h2 class="workout__title">Cycling on April 5</h2>
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workout.speed}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>;`;

    L.marker([latitude, longtitude])
      .addTo(map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "cycling-popup",
        })
      )

      .setPopupContent("Workout")
      .openPopup();
  }

  form.insertAdjacentHTML("afterend", html);

  form.reset();

  containerWorkouts.addEventListener("click", function (e) {
    const workoutEl = e.target.closest(".workout");

    if (!workoutEl) return;

    const workout = workouts.find((work) => work.id === workoutEl.dataset.id);

    map.setView(workout.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  });
});
