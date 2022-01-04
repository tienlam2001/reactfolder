AOS.init({
  duration: 1200,
})

$(document).ready(function(){
  $("#menu").click(function(){
    $("#menu_component").stop(true,true);
    var x = $("#menu_component").css("display");
    if(x === "none"){

      $("#menu_component").slideDown("slow");
      $("#menu_component").css("display","block");

    }else if (x === "block"){

      $("#menu_component").slideUp("slow");
      $("#menu_component").css("display","none");

    }
  });



});
