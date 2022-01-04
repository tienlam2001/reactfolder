var w = window.innerWidth;
var h = window.innerHeight;
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



  $("#ShowNews").click(function(){
    $("#Stock-News").slideDown("slow");
      $("#Stock-News").css("width","100vw");
      $("#Stock-News").css("height","100vh");
      $("#stockFrame").css("width","0");
      $('.information-data').css("width","45vw");
      $('.information-data').css("max-width","600px");
      $('.newsClass').css("min-width","47vw");
      $('.newsClass').css("width","47vw");
      $('#TheNews').css("width","100vw");
      $('#TheNews').css("min-width","100vw");
      $(".newsClass").css("display","inline-block");
  });
  // This is only for tablet devices
  $("#ShowNewsTrigger").click(function(){
    $("#Stock-News").css("display","block");
    $("#Stock-News").css("min-height","100vh");
    $("#Stock-News").css("height","auto");
    $("#Stock-News").css("width","100vw");
    $("#stockFrame").css("display","none");
    $("#menu_component").slideUp("slow");
    $("#menu_component").css("display","none");
    $('.information-data').css("width","100vw");
    $('.newsClass').css("width","100vw");
    // $(".title-news").css("font-size","25px");
    // $(".source-news").css("font-size","20px")
  });
  //
  // $(".seeFullMode").click(function(){
  //   $('.Chart_Stock_Wrapper').css('width','100vw');
  //   $('.container').css('width','70vw');
  //   $('.Chart_Stock_Wrapper').css('border','none');
  //
  //   // $(".source-news").css("font-size","20px")
  // });


});
