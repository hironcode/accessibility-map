/* import */
// import geoRoadPath from "/geodata/road_network.geojson";
import geoRoadPath from "./geodata/test.geojson"
import point from "turf-point";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import explode from "@turf/explode";
import featureCollection from "turf-featurecollection";
import nearestPoint from "@turf/nearest-point";
import bezierSpline from '@turf/bezier-spline';
import bbox from '@turf/bbox';
import * as d3 from "d3";
import lineInterpolatePoints from 'line-interpolate-points';
import Heap from "heap-js";

class PathFinderHelper {
    getNearestPoint (point, network) {
        /* get a point (type = Point) and network (type = GeoJSON) and return the nearest point in the GeoJSON data*/
        let pointsExploded = explode(network)
        let nearestP = nearestPoint(point, pointsExploded)
        return nearestP;
    };

    _getDistance(e1, e2) {
        return Math.sqrt((e1[0]-e2[0])**2 + (e1[1]-e2[1])**2);
    };

    _updateArray(array, e) {
        if (array.includes(e)){
            return array;
        };
        if (e < Math.max(...array)) {
            // mins に e を追加
            array.push(e);
        
            // mins 内の最大値を削除
            array.sort((a, b)=>{
            return a - b;
            });
            array.pop();
        };
        // e が mins の最大値よりも小さい場合に処理を行う
        return array;
    }

    getTolerance (network){
        let endpoints = [];
        for (let feature of network.features){
            let coor = feature.geometry.coordinates
            endpoints.push(coor[0]);
            endpoints.push(coor[coor.length-1]);
        }
        
        const minHeap = new Heap();
        minHeap.init([]);
        let minDistances = [];
        for (let i = 0; i < endpoints.length - 1; i++) {
            let e1 = endpoints[i];
            // This is where you'll capture that last value
            for (let j = i + 1; j < endpoints.length; j++) {
                let e2 = endpoints[j];
                minHeap.push(this._getDistance(e1, e2))
            };
        };

        // Each endpoint has basically one adjacent endpoint
        // もっと数学的に考えられる
        let len = endpoints.length
        for (let i=0; i<=len; i++){
            minDistances.push(minHeap.pop())
        };
        let fraction = 1/3;
        // 基本的なadjacent endpointsのdistancesのうち大きい上位1/3の平均を取る
        // 数学的にもっと考える about the value of the fraction
        let tolerance = d3.mean(minDistances.slice(Math.ceil(len*fraction)));
        return tolerance;
    };

    getSmoothCurve(network) {
        for (let i=0;i<network.features.length;i++){
            network.features[i] = bezierSpline(network.features[i]);
        }
        return network;
    };

    interpolate(network){
        for (let i=0;i<network.features.length;i++){
            let linestrings = network.features[i].geometry.coordinates;
            let distance = this._getDistance(linestrings[0], linestrings[linestrings.length-1]);
            let point_num = Math.ceil(distance*10000 + 30)
            network.features[i].geometry.coordinates = lineInterpolatePoints(linestrings, point_num);
        }
        return network;
    }
};

export default PathFinderHelper;
