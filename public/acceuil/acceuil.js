$(document).ready(function (){
   //menu bar
   let detail=$('#detail');
   detail.click(function (){

      document.location.href = '/mon-url.html';
      console.log("ok");
   });
   let nav=$('.navP');
   nav.css("background-color","green solid 3px");
   nav.mouseover(function() { console.log("hello mouseover on"); });
   nav.css("background-color","red");

});