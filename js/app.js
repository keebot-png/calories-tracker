class CalorieTracker {
    constructor(){
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
        const totalCaloriesElement = document.getElementById('calories-total');
        totalCaloriesElement.innerHTML = this._totalCalories;
    }
    
    _displayCaloriesLimit() {
        const totalCaloriesLimitElement = document.getElementById('calories-limit');
        totalCaloriesLimitElement.innerHTML = this._calorieLimit;
    }

    _displayCaloriesConsumed() {
        const caloriesConsumed = document.getElementById('calories-consumed');
        const consumed = this._meals.reduce((total, meal) => total + meal.calories, 0);
        caloriesConsumed.innerHTML = consumed;
    }

    _displayCaloriesBurned() {
        const caloriesBurned = document.getElementById('calories-burned');
        const burned = this._workouts.reduce((total, workout) => total + workout.calories, 0);
        caloriesBurned.innerHTML = burned;
    }

    _displayCaloriesRemaining() {
        const caloriesRemainingElement = document.getElementById('calories-remaining');
        const remaining = this._calorieLimit - this._totalCalories;
        caloriesRemainingElement.innerHTML = remaining;
    }

    _render() {
        //putting this method in here because it will change based on the various meals and workouts
        // that you give it
        this._displayCaloriesTotal();
        this._displayCaloriesConsumed();
        this._displayCaloriesBurned();
        this._displayCaloriesRemaining();
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

// start the calculation
const tracker = new CalorieTracker();

const breakfast = new Meal('Breakfast', 400);
const lunch = new Meal('Lunch', 300)
tracker.addMeal(breakfast);
tracker.addMeal(lunch);

const run = new Workout('Morning run', 200);
const boxing = new Workout('Boxing', 400);
tracker.addWorkout(run);
tracker.addWorkout(boxing)

console.log(tracker._meals);
console.log(tracker._workouts);
console.log(tracker._totalCalories);