// your code here, it may be worth it to ensure this file only runs AFTER the dom has loaded.

const calorieList = document.querySelector("#calories-list")
const progressBar = document.querySelector('.uk-progress')

fetchCalories()

function fetchCalories(){
    
    fetch("http://localhost:3000/api/v1/calorie_entries")
    .then(resp => resp.json())
    .then(objs => {
        objs.forEach(obj => {
            renderFood(obj)
        })
    })
}


function renderFood(foodObj){
    const liTag = document.createElement("li")
    liTag.className = "calories-list-item"

    liTag.innerHTML = `
    <div class="uk-grid">
        <div class="uk-width-1-6">
        <strong>${foodObj.calorie}</strong>
        <span>kcal</span>
        </div>
        <div class="uk-width-4-5">
        <em class="uk-text-meta">${foodObj.note}</em>
        </div>
    </div>
    <div class="list-item-menu">
        <a class="edit-button" uk-toggle="target: #edit-form-container" uk-icon="icon: pencil"></a>
        <a class="delete-button" uk-icon="icon: trash"></a>
    </div>
    `


    liTag.querySelector('.edit-button').addEventListener('click', e => {
        updateForm(foodObj, liTag)
    })

    calorieList.prepend(liTag)
    deleteButton(liTag, foodObj)
    updateProgressBar(foodObj.calorie)

}

function updateForm(foodObj, liTag){
    const editForm = document.querySelector("#edit-calorie-form")

    editForm.calorie.value = foodObj.calorie
    editForm.note.value = foodObj.note

 
    editForm.addEventListener('submit', e => {
        e.preventDefault()
        const newValues = {
            calorie: editForm.calorie.value,
            note: editForm.note.value
        }
        updateFood(foodObj, newValues, liTag)

    })
}


function deleteButton(liTag, foodObj){
    const deleteBtn = liTag.querySelector('.delete-button')
    deleteBtn.addEventListener('click', e => {
        deleteFood(foodObj, liTag)
    })
}

function updateProgressBar(calories){   
    progressBar.value += calories
}

function deleteFood(foodObj, liTag){

    const config = {
        method: "delete",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    }

    fetch(`http://localhost:3000/api/v1/calorie_entries/${foodObj.id}`, config)
    .then(resp => resp.json())
    .then(objs => {
       liTag.remove()
    })
}


function updateFood(foodObj, newValues, liTag){

    const config = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        }, 
        body: JSON.stringify(newValues)
    }

    fetch(`http://localhost:3000/api/v1/calorie_entries/${foodObj.id}`, config)
    .then(resp => resp.json())
    .then(obj => {
       liTag.querySelector('strong').innerText = obj.calorie
       liTag.querySelector('em').innerText = obj.note

    })
}

const bmrForm = document.querySelector('#bmr-calulator')
bmrForm.addEventListener('submit', e => {
    e.preventDefault()
    calculateBmr(e.target.weight.value, e.target.height.value, e.target.age.value)
})


function calculateBmr(weight, height, age){
    const lowerBmr = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age)
    const upperBmr = 66 + (6.23 * weight) + (12.7 * height) - (6.8 * age)
    const average = (lowerBmr + upperBmr) /2

    progressBar.max = average

    document.querySelector('#lower-bmr-range').innerText = lowerBmr
    document.querySelector('#higher-bmr-range').innerText = upperBmr
}