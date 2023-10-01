class CalorieTracker {
  constructor() {
    this._calorieLimit = 2000;
    this._totalCalories = 0;
    this._meals = [];
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
    this._render();
  }

  addWorkout(workout) {
    this._workouts.push(workout);
    this._totalCalories -= workout.calories;
    this._render();
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


class App {
    constructor() {
        this._tracker = new CalorieTracker();

        // all event listeners go in here
        document.getElementById('meal-form').addEventListener('submit', this._newMeal.bind(this))
        document.getElementById('workout-form').addEventListener('submit', this._newWorkout.bind(this))
    }

    _newMeal(e) {
        e.preventDefault();

        const name = document.getElementById('meal-name');
        const calories = document.getElementById('meal-calories');

        // validation for inputs
        if(name.value == '' || calories.value == '') {
            alert('Please fill in all fields');
            return;
        }

        const meal = new Meal(name.value, Number(calories.value));

        this._tracker.addMeal(meal);

        name.value = '';
        calories.value = '';

        const collapseMeal = document.getElementById('collapse-meal');
        const bsCollapse = new bootstrap.Collapse(collapseMeal, {
            toggle: true
        });
    }
    
    _newWorkout(e) {
        e.preventDefault();
        
        const name = document.getElementById('workout-name');
        const calories = document.getElementById('workout-calories');
        
        // validation for inputs
        if(name.value == '' || calories.value == '') {
            alert('Please fill in all fields');
            return;
        }
        
        const workout = new Workout(name.value, Number(calories.value));
        
        this._tracker.addWorkout(workout);

        name.value = '';
        calories.value = '';
        const collapseWorkout = document.getElementById('collapse-workout');
        const bsCollapse = new bootstrap.Collapse(collapseWorkout, {
            toggle: true
        });
    }
}

const app = new App()
