/* import */
import geoBuilding from "./geodata/campus_building.geojson"
import geoRoadPath from './geodata/road_network.geojson';
import geoSlopePath from './geodata/path_slope_network.geojson';
import { lineString } from "@turf/turf";


class Drawer{
    constructor (L, map){
        this.L = L;
        this.map = map;

        // list storing information
        this.markers = new Array();
        this.pathList = new Array();
        this.clicks = new Array();
    }

    removeThirdMarker(){
        this.map.removeLayer(this.markers[this.markers.length - 2]);
    };

    getOriDest(){
        return [this.clicks[0], this.clicks[this.clicks.length-1]];
    }
    
    removeMarkers(){
        this.map.removeLayer(this.markers[0]);
        this.map.removeLayer(this.markers[this.markers.length - 1]);
        this.markers = new Array();
        this.clicks = new Array();
    }

    removeRoutes(){
        console.log(this.pathList);
        if (this.pathList){
            for (let path of this.pathList){
                let lineString = path[1];
                console.log(lineString);
                this.map.removeLayer(lineString);
            };
        };
        this.pathList = new Array();
    };

    // addition functions
    addMarker(e) {
        this.clicks.push(e);
        let marker = new this.L.Marker(e.latlng);
        this.map.addLayer(marker);
        this.markers.push(marker);
    };

    addGeoJSON(transpo){
        this.L.geoJSON(geoBuilding).addTo(this.map);
        if (transpo == 'wheelchair'){
            this.L.geoJSON(geoSlopePath).addTo(this.map);
        }else if(transpo == 'car'){
            this.L.geoJSON(geoRoadPath).addTo(this.map);
        }
        // else if(transpo='walking'){}
    };

    addNewRoute(path){
        let pointList = new Array();
        path.path.forEach((e) => {
            let point = new L.LatLng(e[1], e[0]);
            pointList.push(point);
        });
        let line = L.polyline(pointList, {
            color: 'red',
            fillopacity: 0.3
        });
        this.map.addLayer(line);
        this.pathList.push([pointList, line]);
    }
}


export default Drawer;