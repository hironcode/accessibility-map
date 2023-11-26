Follow the rules below for the sake of a successful operation of the map when you create a GeoJSON file.

1. A LineString should be drawn between points where multiple paths meet.
2. At an intersection, the endpoints of LineStrings gathering should be placed AS NEARLY AS POSSIBLE.
3. After drawing all the LineStrings, put Points at every intersections in order to compute the optimal torelance
    value backend.