$(document).ready(function (){
    let body=$("body");
    body.mouseover(function (){
        console.log("mouse");
    });

    window.addEventListener("resize", function() {
        console.log("resized");
    });

});