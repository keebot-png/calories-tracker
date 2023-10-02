class CalorieTracker {
  constructor() {
    this._calorieLimit = Storage.getCalorieLimit();
    this._totalCalories = Storage.getTotalCalories();
    this._meals = Storage.getMeals();
    this._workouts = [];

    // the below method will only change when the app is reloaded and the set limit has been changed
    this._displayCaloriesLimit();
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgressBar();
  }

  //Public methods/API
  addMeal(meal) {
    this._meals.push(meal);
    this._totalCalories += meal.calories;
    Storage.updateTotalCalories(this._totalCalories);
    Storage.saveMeal(meal);
    this._displayNewMeal(meal);
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    Storage.updateTotalCalories(this._totalCalories);
    this._displayNewWorkout(workout);
    this._render();
  }
  
  removeMeal(id) {
    const index = this._meals.findIndex((meal) => meal.id === id);
    
    if (index !== -1) {
      const meal = this._meals[index];
      this._totalCalories -= meal.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._meals.splice(index, 1);
      this._render();
    }
  }
  
  removeWorkout(id) {
    const index = this._workouts.findIndex((workout) => workout.id === id);
    
    if (index !== -1) {
      const workout = this._workouts[index];
      this._totalCalories += workout.calories;
      Storage.updateTotalCalories(this._totalCalories);
      this._workouts.splice(index, 1);
      this._render();
    }
  }

  reset() {
    this._totalCalories = 0;
    this._meals = [];
    this._workouts = [];
    this._render();
  }

  setLimit(calorieLimit) {
    this._calorieLimit = calorieLimit;
    Storage.setCalorieLimit(calorieLimit);
    this._displayCaloriesLimit();
    this._render();
  }

  loadItems() {
    this._meals.forEach(meal => {
      this._displayNewMeal(meal)
    })
  }

  // Private Methods

  _displayCaloriesTotal() {
    const totalCaloriesElement = document.getElementById("calories-total");
    totalCaloriesElement.innerHTML = this._totalCalories;
  }

  _displayCaloriesLimit() {
    const totalCaloriesLimitElement = document.getElementById("calories-limit");
    totalCaloriesLimitElement.innerHTML = this._calorieLimit;
  }

  _displayCaloriesConsumed() {
    const caloriesConsumed = document.getElementById("calories-consumed");
    const consumed = this._meals.reduce(
      (total, meal) => total + meal.calories,
      0
    );
    caloriesConsumed.innerHTML = consumed;
  }

  _displayCaloriesBurned() {
    const caloriesBurned = document.getElementById("calories-burned");
    const burned = this._workouts.reduce(
      (total, workout) => total + workout.calories,
      0
    );
    caloriesBurned.innerHTML = burned;
  }

  _displayCaloriesRemaining() {
    const caloriesRemainingElement =
      document.getElementById("calories-remaining");
    const remaining = this._calorieLimit - this._totalCalories;
    caloriesRemainingElement.innerHTML = remaining;
    const progressElement = document.getElementById("calorie-progress");
    if (remaining <= 0) {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-light"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-danger"
      );
      progressElement.classList.remove("bg-success");
      progressElement.classList.add("bg-danger");
    } else {
      caloriesRemainingElement.parentElement.parentElement.classList.remove(
        "bg-danger"
      );
      caloriesRemainingElement.parentElement.parentElement.classList.add(
        "bg-light"
      );
      progressElement.classList.remove("bg-danger");
      progressElement.classList.add("bg-success");
    }
  }

  _displayCalorieProgressBar() {
    const progressElement = document.getElementById("calorie-progress");
    const percentage = (this._totalCalories / this._calorieLimit) * 100;
    const width = Math.min(percentage, 100);
    progressElement.style.width = `${width}%`;
  }

  _displayNewMeal(meal) {
    const mealsElement = document.getElementById("meal-items");
    const mealElement = document.createElement("div");
    mealElement.classList.add("card", "my-2");
    mealElement.setAttribute("data-id", meal.id);
    mealElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${meal.name}</h4>
                  <div
                    class="fs-1 bg-primary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${meal.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
            </div>
    `;
    mealsElement.appendChild(mealElement);
  }

  _displayNewWorkout(workout) {
    const workoutsElement = document.getElementById("workout-items");
    const workoutElement = document.createElement("div");
    workoutElement.classList.add("card", "my-2");
    workoutElement.setAttribute("data-id", workout.id);
    workoutElement.innerHTML = `
            <div class="card-body">
                <div class="d-flex align-items-center justify-content-between">
                  <h4 class="mx-1">${workout.name}</h4>
                  <div
                    class="fs-1 bg-secondary text-white text-center rounded-2 px-2 px-sm-5"
                  >
                    ${workout.calories}
                  </div>
                  <button class="delete btn btn-danger btn-sm mx-2">
                    <i class="fa-solid fa-xmark"></i>
                  </button>
                </div>
            </div>
    `;
    workoutsElement.appendChild(workoutElement);
  }

  _render() {
    /* putting this method in here because it will change based on the various meals and workouts
         that you give it */
    this._displayCaloriesTotal();
    this._displayCaloriesConsumed();
    this._displayCaloriesBurned();
    this._displayCaloriesRemaining();
    this._displayCalorieProgressBar();
  }
}

class Meal {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Workout {
  constructor(name, calories) {
    this.id = Math.random().toString(16).slice(2);
    this.name = name;
    this.calories = calories;
  }
}

class Storage {
  static getCalorieLimit(defaultLimit = 2000) {
    let calorieLimit;
    if(localStorage.getItem('calorieLimit') === null){
      calorieLimit = defaultLimit;
    } else {
      calorieLimit = Number(localStorage.getItem('calorieLimit'))
    }
    return calorieLimit;
  }
  
  static setCalorieLimit(calorieLimit) {
    localStorage.setItem('calorieLimit', calorieLimit);
  }
  
  static getTotalCalories(defaultLimit = 0) {
    let totalCalories;
    if(localStorage.getItem('totalCalories') === null){
      totalCalories = defaultLimit;
    } else {
      totalCalories = Number(localStorage.getItem('totalCalories'))
    }
    return totalCalories;
  }
  
  static updateTotalCalories(calories) {
    localStorage.setItem('totalCalories', calories)
  }
  
  static getMeals() {
    let meals;
    if(localStorage.getItem('meals') === null){
      meals = [];
    } else {
      meals = JSON.parse(localStorage.getItem('meals'))
    }
    return meals;
  }

  static saveMeal(meal) {
    const meals = Storage.getMeals();
    meals.push(meal);
    localStorage.setItem('meals', JSON.stringify(meals))
  }
}

class App {
  constructor() {
    this._tracker = new CalorieTracker();

    // all event listeners go in here
      this._loadEventListeners();
      this._tracker.loadItems();
  }

 _loadEventListeners() {
    document
      .getElementById("meal-form")
      .addEventListener("submit", this._newItem.bind(this, "meal"));
    document
      .getElementById("workout-form")
      .addEventListener("submit", this._newItem.bind(this, "workout"));
    document
      .getElementById("meal-items")
      .addEventListener("click", this._removeItem.bind(this, "meal"));
    document
      .getElementById("workout-items")
      .addEventListener("click", this._removeItem.bind(this, "workout"));
    document
      .getElementById("filter-meals")
      .addEventListener("keyup", this._filterItems.bind(this, "meal"));
    document
      .getElementById("filter-workouts")
      .addEventListener("keyup", this._filterItems.bind(this, "workout"));
    document
      .getElementById("reset")
      .addEventListener("click", this._reset.bind(this));
    document
      .getElementById("limit-form")
      .addEventListener("submit", this._setLimit.bind(this));
  }

  _newItem(type, e) {
    e.preventDefault();

    const name = document.getElementById(`${type}-name`);
    const calories = document.getElementById(`${type}-calories`);

    // validation for inputs
    if (name.value == "" || calories.value == "") {
      alert("Please fill in all fields");
      return;
    }

    if (type === "meal") {
      const meal = new Meal(name.value, Number(calories.value));
      this._tracker.addMeal(meal);
    } else {
      const workout = new Workout(name.value, Number(calories.value));
      this._tracker.addWorkout(workout);
    }

    name.value = "";
    calories.value = "";

    const collapseItem = document.getElementById(`collapse-${type}`);
    const bsCollapse = new bootstrap.Collapse(collapseItem, {
      toggle: true,
    });
  }
  _removeItem(type, e) {
    if (
      e.target.classList.contains("delete") ||
      e.target.classList.contains("fa-xmark")
    ) {
      if (confirm("Are you sure?")) {
        const id = e.target.closest(".card").getAttribute("data-id");
        console.log(id);

        type === "meal"
          ? this._tracker.removeMeal(id)
          : this._tracker.removeWorkout(id);
        const item = e.target.closest(".card").remove();
      }
    }
  }
  _filterItems(type, e) {
    const text = e.target.value.toLowerCase();
    // Now we need to loop through the item
    document.querySelectorAll(`#${type}-items .card`).forEach((item) => {
      const name = item.firstElementChild.firstElementChild.textContent;
      if(name.toLowerCase().indexOf(text) !== -1){
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    })
  }
  _reset() {
    this._tracker.reset();
    document.getElementById("meal-items").innerHTML = '';
    document.getElementById("workout-items").innerHTML = '';
    document.getElementById("filter-meals").value = '';
    document.getElementById("filter-workouts").value = '';
  }

  _setLimit(e) {
    e.preventDefault();

    const limit = document.getElementById('limit');
    if(limit.value === ''){
      alert('Please add a limit');
      return;
    }

    this._tracker.setLimit(Number(limit.value));
    limit.value = '';

    const modalElement = document.getElementById('limit-modal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }
}

const app = new App();
