
var animLoop = false,
    animIndex = 0,
    planePath = false,
    trailPath = false;

const lineSymbol = {
    strokeColor: '#0f0',
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4,
};

var position1, position2, mapObject;

function loadMap() {
    var centerOfMap = new google.maps.LatLng(23.2, 77.4);
    var options = {
        center: centerOfMap,
        zoom: 7
    };
    mapObject = new google.maps.Map(document.getElementById('mapCanvas'), options);
    google.maps.event.addListener(mapObject, 'click', function (event) {
        if (position1 != null) {
            position2 = position1;
        }
        position1 = event.latLng;
        
        // if (position2 != null) {
        //     animate([position2.lat(), position2.lng()], [position1.lat(), position1.lng()]);
        // }
       

        marker = new google.maps.Marker({
            position: position1,
            map: mapObject,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
            markerLocation();
        });

    });
}

var planeSymbol = {
    path: 'M22.1,15.1c0,0-1.4-1.3-3-3l0-1.9c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.7c-0.5-0.5-1.1-1.1-1.6-1.6l0-1.5c0-0.2-0.2-0.4-0.4-0.4l-0.4,0c-0.2,0-0.4,0.2-0.4,0.4l0,0.3c-1-0.9-1.8-1.7-2-1.9c-0.3-0.2-0.5-0.3-0.6-0.4l-0.3-3.8c0-0.2-0.3-0.9-1.1-0.9c-0.8,0-1.1,0.8-1.1,0.9L9.7,6.1C9.5,6.2,9.4,6.3,9.2,6.4c-0.3,0.2-1,0.9-2,1.9l0-0.3c0-0.2-0.2-0.4-0.4-0.4l-0.4,0C6.2,7.5,6,7.7,6,7.9l0,1.5c-0.5,0.5-1.1,1-1.6,1.6l0-0.7c0-0.2-0.2-0.4-0.4-0.4l-0.5,0c-0.2,0-0.4,0.2-0.4,0.4l0,1.9c-1.7,1.6-3,3-3,3c0,0.1,0,1.2,0,1.2s0.2,0.4,0.5,0.4s4.6-4.4,7.8-4.7c0.7,0,1.1-0.1,1.4,0l0.3,5.8l-2.5,2.2c0,0-0.2,1.1,0,1.1c0.2,0.1,0.6,0,0.7-0.2c0.1-0.2,0.6-0.2,1.4-0.4c0.2,0,0.4-0.1,0.5-0.2c0.1,0.2,0.2,0.4,0.7,0.4c0.5,0,0.6-0.2,0.7-0.4c0.1,0.1,0.3,0.1,0.5,0.2c0.8,0.2,1.3,0.2,1.4,0.4c0.1,0.2,0.6,0.3,0.7,0.2c0.2-0.1,0-1.1,0-1.1l-2.5-2.2l0.3-5.7c0.3-0.3,0.7-0.1,1.6-0.1c3.3,0.3,7.6,4.7,7.8,4.7c0.3,0,0.5-0.4,0.5-0.4S22,15.3,22.1,15.1z',
    fillColor: '#000',
    fillOpacity: 1.5,
    scale: 1,
    anchor: new google.maps.Point(11,11),
    strokeWeight: 0
};
function flyplane(){
    if(position1!=null&&position2!=null){
        var speed = parseFloat(document.getElementById('speed').value ?? "0");
        console.log(speed)
        animate([position2.lat(), position2.lng()], [position1.lat(), position1.lng()],speed);  
    }
}

function animate(startPoint, endPoint,speed) {

    console.log(startPoint,endPoint,speed)
    var sP = new google.maps.LatLng(startPoint[0], startPoint[1]);
    var eP = new google.maps.LatLng(endPoint[0], endPoint[1]);

 

    planePath = new google.maps.Polyline({
        path: [sP, eP],

        strokeWeight: 0,
        icons: [{
            icon: planeSymbol,
            offset: '0%'
        }],
        map: mapObject,
        geodesic: true
    });

    trailPath = new google.maps.Polyline({
        path: [sP, sP],
        strokeOpacity: 0,
        strokeColor: '#61b33b',
        map: mapObject,
        icons: [
            {
                icon: lineSymbol,
                offset: "0",
                repeat: "20px",
            },
        ],
        geodesic: true
    });


    animLoop = window.requestAnimationFrame(function () {
        tick(sP, eP,speed);
    });
}


function tick(startPoint, endPoint,speed) {
    animIndex += speed/10;

   
    var nextPoint = google.maps.geometry.spherical.interpolate(startPoint, endPoint, animIndex / 100);
    trailPath.setPath([startPoint, nextPoint]);

  
    planePath.icons[0].offset = Math.min(animIndex, 100) + '%';
    planePath.setPath(planePath.getPath());

    
    mapObject.panTo(nextPoint);

  
    if (animIndex >= 100) {
        window.cancelAnimationFrame(animLoop);
        animIndex = 0;
    } else {
        animLoop = window.requestAnimationFrame(function () {
            tick(startPoint, endPoint,speed);
        });
    }
}

