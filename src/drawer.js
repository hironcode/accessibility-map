/* import */
import geoBuilding from "./geodata/campus_building.geojson"
import geoRoadPath from './geodata/road_network.geojson';
import geoSlopePath from './geodata/path_slope_network.geojson';
import geoWalkingPath from './geodata/path_walking_network.geojson';
import centerPoint from '@turf/center';

class Drawer{
    constructor (L, map){
        this.L = L;
        this.map = map;

        // list storing information
        this.markers = new Array();
        this.pathList = new Array();
        this.clicks = new Array();
        this.geoJSONs = {};
        
    }

    // addition functions
    addMarker(e) {
        this.clicks.push(e);
        let marker = new this.L.Marker(e.latlng);
        this.map.addLayer(marker);
        this.markers.push(marker);
    };

    addGeoJSON(transpo){
        let geoB = this.L.geoJSON(geoBuilding).addTo(this.map);
        this.geoJSONs["building"] = geoB;

        let geoNetwork;
        if (transpo == 'wheelchair'){
            geoNetwork = this.L.geoJSON(geoSlopePath).addTo(this.map);
        }else if(transpo == 'car'){
            geoNetwork = this.L.geoJSON(geoRoadPath).addTo(this.map);
        }else if(transpo='walking'){
            geoNetwork = this.L.geoJSON(geoWalkingPath).addTo(this.map);
        };
        this.geoJSONs[transpo] = geoNetwork;
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
    };
    
    addBulidingCenters(centers){
        
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
        if (this.pathList){
            for (let path of this.pathList){
                let lineString = path[1];
                this.map.removeLayer(lineString);
            };
        };
        this.pathList = new Array();
    };
    
    removeGeoJSON(transpo){
        this.map.removeLayer(this.geoJSONs['building']);
        this.map.removeLayer(this.geoJSONs[transpo]);
    };
}


export default Drawer;