/* import */
import geoBuilding from "./geodata/campus_building.geojson"
import geoRoadPath from "./geodata/road_network.geojson";
import geoSlopePath from './geodata/path_slope_network.geojson';

import testNetwork from "./geodata/test.geojson"

import PathFinder from "geojson-path-finder";
import point from "turf-point";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import nearestPoint from "@turf/nearest-point";
import nearest from "turf-nearest";
import explode from "@turf/explode";


import PathFinderHelper from './helper';
import Drawer from './drawer';


// Create a basic map
const map = L.map('map').setView([33.553936, -117.735088], 18);

// Add OSM layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

// interpolate routes and set up basic information
let pfh = new PathFinderHelper();
let drawer = new Drawer(L, map);
geoRoadPath = pfh.interpolate(geoRoadPath);
geoSlopePath = pfh.interpolate(geoSlopePath);

// transportation = [wheelchair, walking, car]
// initialize transportaiton to be wheelchair
var transportation = 'wheelchair';


// Ready funciton
map.whenReady(()=>{
    drawer.addGeoJSON(transportation);
});

// Referenced from https://codesandbox.io/s/cranky-bas-cb35u?file=/src/route.js:465-503
function getPath(startE, endE) {
    /* 
    Caution!!

    Leaflet uses LAT | LNG
    Turf uses    LNG | LAT
    GeoJSON uses LNG | LAT

    Use the GeoJSON format  (LNG | LAT)
    */

    let startCoor = [startE.latlng.lng, startE.latlng.lat];
    let endCoor = [endE.latlng.lng, endE.latlng.lat];
    console.log(`startPoint type: ${startCoor}`);
    console.log(`endPoint type: ${endCoor}`);

    let approproateNetwork;
    if (transportation == 'car'){
        approproateNetwork = geoRoadPath;
    }else if(transportation == 'wheelchair'){
        approproateNetwork = geoSlopePath;
    };

    let startPoint = pfh.getNearestPoint(point(startCoor), approproateNetwork);
    let endPoint = pfh.getNearestPoint(point(endCoor), approproateNetwork);
    console.log(
        `nearest Point in the graph is:
        [${startPoint.geometry.coordinates}]
        and
        [${endPoint.geometry.coordinates}]`
    );

    /* Initialize path finder */
    let tolerance = pfh.getTolerance(approproateNetwork);
    let pathFinder = new PathFinder(approproateNetwork, {
        tolerance: tolerance,
    });
    let path = pathFinder.findPath(startPoint, endPoint);
    return path;
}



map.on('dblclick', (e) => {
    drawer.addMarker(e);
    // when the # of rutes so far exceed 2, delete all the routes drawn on map
    if (drawer.pathList.length >= 1){
        drawer.removeRoutes();
    };
    if (drawer.clicks.length >= 2){
        let path = getPath(drawer.clicks[0], drawer.clicks[drawer.clicks.length - 1], transportation);
        drawer.addNewRoute(path);
    }
});


document.addEventListener('DOMContentLoaded', ()=>{
    // ボタンの要素を取得
    let reset = document.getElementById('reset');

    // ボタンにクリックイベントリスナーを設定
    reset.addEventListener('click', ()=>{
        // ここにクリックされた時の処理を記述
        drawer.removeRoutes();
        if (drawer.markers){
            drawer.removeMarkers();
        };
        drawer.addGeoJSON(transportation);
    });
});

// function getTranspo(){
//     // ボタンの要素を取得
//     let radios = document.getElementsByName("tranpo");
//     // ボタンにクリックイベントリスナーを設定
//     for (let i = 0; i < radios.length; i++) {
//         if (radios[i].checked) {
//             transportation = radios[i].value
//             break;
//         }
//     }
//     drawer.removeRoutes();
//     drawer.addGeoJSON(transportation);
// };

const radios = document.getElementsByName('transpo');
for (let i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
        if (this.checked) {
            transportation = this.value;
            console.log(`Transportation selected: ${transportation}`);
            
        };
        drawer.removeRoutes();
        drawer.addGeoJSON(transportation);
        if (drawer.clicks.length>=2){
            let oridest = drawer.getOriDest();
            let path = getPath(oridest[0], oridest[1]);
            drawer.addNewRoute(path);
        };
    });
}
