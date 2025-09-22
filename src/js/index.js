/// <reference types="../@types/jquery" />
let mealTitle = document.getElementById("mealTitle");
let parentHome = document.getElementById("parentHome");
let mealPage = document.getElementById("mealPage");
let mealImg = document.getElementById("mealImg");
let mealTitleImg = document.getElementById("mealTitleImg");
let pInst = document.getElementById("pInst");
let areaSpan = document.getElementById("areaSpan");
let catSpan = document.getElementById("catSpan");
let recList = document.getElementById("recList");
let tagList = document.getElementById("tagList");
let srcBtn = document.getElementById("srcBtn");
let ytbBtn = document.getElementById("ytbBtn");
let searchLink = document.getElementById("searchLink");
let inputName = document.getElementById("searchName");
let inputLetter = document.getElementById("searchLetter");

async function getMealByID(id) {
    let idApi = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    let mealData = await idApi.json(); 
    return mealData;      
}
async function mealDetails(id){
        let meal = await getMealByID(id);
        let obj = meal.meals[0]  
        $("#mealImg").attr("src", obj.strMealThumb)
        $("#mealTitleImg").html(obj.strMeal)
        $("#pInst").html(obj.strInstructions)

        $("#areaSpan").html(obj.strArea)
        $("#catSpan").html(obj.strCategory)
        
        let strTag =String(obj.strTags)        
        let tagArr = strTag.split(",");
        let liTag = "";
        for (let i = 0; i < tagArr.length; i++) {
            liTag += `<li class="bg-[#F8D7DA] text-[#842029] rounded-md py-1 px-2">${tagArr[i]}</li>`
        }
        if(tagArr.length>0 && strTag != "null"){
            $("#tagList").html(liTag)
        }
        
        let liRec = "";
        for (let i = 0; i < 20; i++) {
            let str = "strIngredient"+(i+1)
            let str1 = "strMeasure"+(i+1)
            if(obj[str] != "")
                liRec += `<li class="bg-[#CFF4FC] text-[#055160] rounded-md py-1 px-2">${obj[str1] + " " + obj[str]}</li>`
            else
                break;
        }
        if(liRec != "")
            $("#recList").html(liRec)


        $("#srcBtn").attr("href", obj.strSource)
        $("#ytbBtn").attr("href", obj.strYoutube)

        
        $("#mealPage").removeClass("hidden");
        $("header").addClass("hidden");
        $(".search-title").addClass("hidden");
}
$(document).on("click", ".meal-box", (e)=>{
    let id = e.target.getAttribute("id") //id
    mealDetails(id)

})



startApp()

async function startApp(input = "", num = 1){
    
    
    let mealsSearchedName = await getApiDataName(input);
    let mealsSearchedLetter = await getApiDataLetter(input);
    
    if(num == 1)
        searchByNameDisplay(mealsSearchedName)
    else
        searchByLetterDisplay(mealsSearchedLetter)
}
async function getApiDataName(name) {
    let searchApi = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`)
    let searchData = await searchApi.json(); 
    
    return searchData;      
}
async function getApiDataLetter(char) {
    let searchApiLetter = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${char}`)
    let searchDataLetter = await searchApiLetter.json(); 
    
    return searchDataLetter;      
}

// filter by cat Name
async function getApiByCatName(catName) {
    let searchCatName = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${catName}`)
    let searchNameCat = await searchCatName.json(); 
    
    return searchNameCat;      
}
async function displayMealsByCat(catName){
    let mealsList = await getApiByCatName(catName);
    searchByNameDisplay(mealsList)
}
$(document).on("click", ".item-cat .layer", (e)=> {
    let item = e.target.closest(".layer"); 
    let heading = item.querySelector("h2").textContent; 
    $("#category").addClass("hidden") 
    displayMealsByCat(heading) // Beef
});


// filter by area Name
async function getApiByAreaName(areaName) {
    let searchAreaName = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaName}`)
    let searchNameArea = await searchAreaName.json(); 
    
    return searchNameArea;      
}
async function displayMealsByArea(areaName){
    let mealsList = await getApiByAreaName(areaName);
    searchByNameDisplay(mealsList)
}
$(document).on("click", ".item-area", (e)=> {
    let item = e.target.closest(".item-area"); 
    let heading = item.querySelector("h3").textContent; 
    $("#area").addClass("hidden")
    displayMealsByArea(heading)
});


// filter by Ingredient
async function getApiByIngName(ingName) {
    let searchIngName = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingName}`)
    let searchNameIng = await searchIngName.json(); 
    
    return searchNameIng;      
}
async function displayMealsByIng(ingName){
    let mealsList = await getApiByIngName(ingName);
    searchByNameDisplay(mealsList)
}
$(document).on("click", ".item-ing", (e)=> {
    let item = e.target.closest(".item-ing"); 
    let heading = item.querySelector("h3").textContent;
    $("#ing").addClass("hidden")
    displayMealsByIng(heading)
});

// CATEGORY
async function getApiDataCategory() {
    let searchApiCat = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    let searchDataCat = await searchApiCat.json(); 
    
    return searchDataCat;      
}
async function displayCategories(){
    let catList = await getApiDataCategory();
    // console.log(catList);
    let cartona = ""
        for (let i = 0; i < catList.categories.length; i++) {
            let desc = catList.categories[i].strCategoryDescription.split(" ");
            if(desc.length > 25){
                desc = desc.slice(0, 25).join(" ") + "..."
            }
                cartona += `<div class="item-cat relative cursor-pointer group/menu-item rounded-lg overflow-hidden ">
                            <img src=${catList.categories[i].strCategoryThumb} alt="meal">
                            <div class="layer text-center bg-white/80 absolute h-[100%] bottom-[-100%] start-0 end-0 group-hover/menu-item:bottom-0 transition-all duration-500 p-2">
                                <h2 id="mealTitle" class="mb-2 meal-title text-3xl font-medium">${catList.categories[i].strCategory}</h2>
                                <p id="mealParag" class="meal-parag ">${desc}</p>
                            </div>
                            </div>`
        }
        catDiv.innerHTML = cartona
        // $("header").removeClass("hidden")
    
}
$("#categoryLink").on("click", ()=>{
    $("header").addClass("hidden")
    $(".search-title").addClass("hidden")
    $("#area").addClass("hidden")
    $("#ing").addClass("hidden")
    $("#contact").addClass("hidden")
    $("#mealPage").addClass("hidden")
    $("#category").removeClass("hidden")
    displayCategories()
})

// AREA
async function getApiDataArea() {
    let searchApiArea = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
    let searchDataArea = await searchApiArea.json(); 
    
    return searchDataArea;      
}
async function displayAreas(){
    let areaList = await getApiDataArea();
    console.log(areaList);
    let cartona = ""
        for (let i = 0; i < areaList.meals.length; i++) {
                cartona += `<div class="item-area text-center cursor-pointer">
            <span class=" text-7xl"><i class="fa-solid fa-house-laptop"></i></span>
            <h3 class="font-semibold text-3xl">${areaList.meals[i].strArea}</h3>
          </div>`
        }
        areaDiv.innerHTML = cartona
        // $("header").removeClass("hidden")
    
}
$("#areaLink").on("click", ()=>{
    $("header").addClass("hidden")
    $(".search-title").addClass("hidden")
    $("#category").addClass("hidden")
    $("#ing").addClass("hidden")
    $("#contact").addClass("hidden")
    $("#mealPage").addClass("hidden")
    $("#area").removeClass("hidden")
    displayAreas()
})

// Ingrediants
async function getApiDataIng() {
    let searchApiIng = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
    let searchDataIng = await searchApiIng.json(); 
    
    return searchDataIng;      
}
async function displayIngredients(){
    let ingList = await getApiDataIng();
    console.log(ingList);
    let cartona = ""
        for (let i = 0; i < ingList.meals.length; i++) {
            let desc = ingList.meals[i].strDescription;
            if(desc == null)
                break;
            else{
                desc = desc.split(" ")
            }
            if(desc.length > 25){
                desc = desc.slice(0, 25).join(" ") + "..."
            }
            else{
                desc = desc.join(" ");
            }
                cartona += `<div class="item-ing text-center cursor-pointer">
                                <span class=" text-7xl"><i class="fa-solid fa-drumstick-bite"></i></span>
                                <h3 class="font-semibold text-3xl">${ingList.meals[i].strIngredient}</h3>
                                <p class="mt-2">${desc}</p>
                            </div>`
        }
        ingDiv.innerHTML = cartona
        // $("header").removeClass("hidden")
    
}
$("#ingredientsLink").on("click", ()=>{
    $("header").addClass("hidden")
    $(".search-title").addClass("hidden")
    $("#area").addClass("hidden")
    $("#category").addClass("hidden")
    $("#contact").addClass("hidden")
    $("#mealPage").addClass("hidden")
    $("#ing").removeClass("hidden")
    displayIngredients()
})

//CONTACT
$("#contactLink").on("click", ()=>{
    $("header").addClass("hidden")
    $(".search-title").addClass("hidden")
    $("#area").addClass("hidden")
    $("#category").addClass("hidden")
    $("#ing").addClass("hidden")
    $("#mealPage").addClass("hidden")
    $("#contact").removeClass("hidden")
    displayIngredients()
})
$("#searchName").on("input", ()=>{
    startApp(inputName.value, 1)
})
function searchByNameDisplay(meal){
        let cartona = ""
        for (let i = 0; i < meal.meals.length; i++) {
                cartona += `<div class="item relative cursor-pointer group/menu-item rounded-lg overflow-hidden ">
                            <img src=${meal.meals[i].strMealThumb} alt="meal">
                            <div id="${meal.meals[i].idMeal}" class="meal-box flex items-center bg-white/80 absolute h-[100%] bottom-[-100%] start-0 end-0 group-hover/menu-item:bottom-0 transition-all duration-500">
                                <h2 id="mealTitle" class="meal-title ms-1 text-3xl font-medium">${meal.meals[i].strMeal}</h2>
                            </div>
                            </div>`
        }
        parentHome.innerHTML = cartona
        $("header").removeClass("hidden")
        // mealDetailsPage(meals)
}
$("#searchLetter").on("input", () => {
    if (inputLetter.value.length > 1) {
      inputLetter.value = inputLetter.value.charAt(0); // keep only first character
    }
    if(inputLetter.value != "")
        startApp(inputLetter.value, 2)
});
function searchByLetterDisplay(meal){
        let cartona = ""
        for (let i = 0; i < meal.meals.length; i++) {
                if(meal.meals[i].strMeal.charAt(0).toLowerCase() == inputLetter.value){
                    cartona += `<div class="item relative cursor-pointer group/menu-item rounded-lg overflow-hidden ">
                            <img src=${meal.meals[i].strMealThumb} alt="meal">
                            <div class="flex items-center bg-white/80 absolute h-[100%] bottom-[-100%] start-0 end-0 group-hover/menu-item:bottom-0 transition-all duration-500">
                                <h2 id="mealTitle" class="meal-title ms-1 text-3xl font-medium">${meal.meals[i].strMeal}</h2>
                            </div>
                            </div>`
                }
        }
        parentHome.innerHTML = cartona
        $("header").removeClass("hidden")
        // mealDetailsPage(meals)
}
$("#searchLink").on("click", ()=>{
    $("header").addClass("hidden")
    $("#category").addClass("hidden")
    $("#area").addClass("hidden")
    $("#ing").addClass("hidden")
    $("#contact").addClass("hidden")
    $("#mealPage").addClass("hidden")
    $(".search-title").removeClass("hidden")
})
$("aside #sideLinks a").on("click", ()=>{
    $("#sideLinks").animate({width: "0px"});
        $("#sideLinks").addClass("w-[0]");
        $("#sideMenu i").removeClass("fa-xmark");
        $("#sideMenu i").addClass("fa-bars");
})
$("#sideMenu").on("click", () => {
    if($("#sideLinks").hasClass("w-[0]")){
        $("#sideLinks").animate({width: "250px"});
        $("#sideLinks").removeClass("w-[0]");
        $("#sideMenu i").removeClass("fa-bars");
        $("#sideMenu i").addClass("fa-xmark");
    }
    else{
        $("#sideLinks").animate({width: "0px"});
        $("#sideLinks").addClass("w-[0]");
        $("#sideMenu i").removeClass("fa-xmark");
        $("#sideMenu i").addClass("fa-bars");
    }
});



