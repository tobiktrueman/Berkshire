

function initMap() {

// Create an array of styles.

  var styles = [{
  			stylers: [{ saturation: -100 }]
  	}];
  
  var coordinates = [
    [53.574769, 17.088244, 7],
    [52.383802, 16.900905, 12]
  ];

  var maps = [];
  var positions = [];


  for (i=0; i<document.getElementsByClassName('googleMap').length; i++) 
  {
    	var mapCanvas=document.getElementsByClassName('googleMap')[i];
      var pos = new google.maps.LatLng(coordinates[i][0], coordinates[i][1])
      positions.push(pos);

      var mapOptions = {
        center: pos,
        zoom: coordinates[i][2],
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        scrollwheel: false,
        draggable: true
      };
    	
      var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
      var map = new google.maps.Map(mapCanvas, mapOptions);
      maps.push(map);
      map.mapTypes.set('map_style', styledMap);
      map.setMapTypeId('map_style');
  }

      window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: positions[0],
            map: maps[0],
            animation: google.maps.Animation.DROP
        }) 
      }, 1000);

      window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: positions[1],
            map: maps[1],
            animation: google.maps.Animation.DROP
        }) 
      }, 1500);

      window.setTimeout(function() {
        var marker = new google.maps.Marker({
            position: positions[2],
            map: maps[2],
            animation: google.maps.Animation.DROP
        }) 
      }, 2000);


}
            
$(document).ready( function () {
//   initialize();
});
