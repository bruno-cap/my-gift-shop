

/* --- check if modals should be opened on page load --- */
/*
var test = 1;

if (test == 2) {

    window.onload = function() {
        modal.style.display = "block";
    }

}
*/

/*
var test = document.getElementById("loginErrors");

if (test != null) {
    window.onload = function() {
        modal.style.display = "block";
    }
}
*/


/* --- modal 1 - Log in --- */
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");

var submitBtn = document.getElementById("loginsubmit");

var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

/* --- modal 2 - Sign up --- */
var modal2 = document.getElementById("myModal2");
var btn2 = document.getElementById("myBtn2");
var span2 = document.getElementsByClassName("close2")[0];

btn2.onclick = function() {
    modal2.style.display = "block";
}

span2.onclick = function() {
    modal2.style.display = "none";
}

// close whatever modal is open if user clicks outside the modal
window.onclick = function(event) {
    if (event.target == modal || event.target == modal2) {
    modal.style.display = "none";
    modal2.style.display = "none";
    }
}

// show or hide hamburger menu

let hamburgerMenu = document.querySelector("#hamburgerLink");
let menuToShowOrHide = document.querySelector("#menu-to-show-or-hide");

hamburgerMenu.addEventListener("click", ()=>{

    if(menuToShowOrHide.style.display === 'block') {
        menuToShowOrHide.style.display = 'none';
    }
    else {
        menuToShowOrHide.style.display = 'block';
    }
});

// show or hide product filter by menu

let filterByMenu = document.querySelector("#productsFilterByLink");
let filterByToShowOrHide = document.querySelector("#filter-by-to-show-or-hide");

filterByMenu.addEventListener("click", ()=>{

    if(filterByToShowOrHide.style.display === 'block') {
        filterByToShowOrHide.style.display = 'none';
    }
    else {
        filterByToShowOrHide.style.display = 'block';
    }
});