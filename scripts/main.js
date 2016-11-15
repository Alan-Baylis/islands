requirejs(["helper/perlin-noise-simplex"], function (SimplexNoise) {
    var s = new SimplexNoise();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    
    var width = context.canvas.width;
    var height = context.canvas.height;
    // how many times to run simplex noise at reducing amplitude and scale
    var iterations = 5;

    // initialize an empty 2-dimensional array to store the elevation of each pixel
    var elevations = new Array(width);
    for (i = 0; i < width; i++) {
        elevations[i] = new Array(height);
        for (j = 0; j < height; j++) {
            elevations[i][j] = 0;
        }
    }

    // determine how high the pixel would be if every iteration's noise value were 1
    var maxElevationBeforeRescaling = 0;
    for (var i = 0; i < iterations; i++) {
        maxElevationBeforeRescaling += Math.pow(3, iterations - i);
    }

    // each time we run the tectonics function, we determine how much elevation to add
    // or subtract from the pixel at x, y, for the scale in question
    var tectonics = function (x, y, scale) {
        var effectiveX = x / scale;
        var effectiveY = y / scale;
        // 255 is the maximum elevation, since it's the maximum intensity of a channel in RGB
        return Math.floor((255 * (scale / maxElevationBeforeRescaling)) * s.noise(effectiveX, effectiveY));
    }

    // scale is the scale at which we're running our simplex noise - we run it over and over,
    // and our smaller and smaller simplex worm makes smaller and smaller changes to the elevation
    for (var scale = (Math.pow(3, iterations)); scale > 1; scale = scale / 3) {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var newElevation = tectonics(x, y, scale);
                elevations[x][y] = elevations[x][y] + newElevation;
            }
        }
    }

    // finally, with the elevation of each pixel established, we color the canvas: green at elevations above 127 for land, 
    // blue at elevations below 127 for water, and brighter color for higher elevation.
    for (x = 0; x < width; x++) {
        for (y = 0; y < height; y++) {
            if (elevations[x][y] > 127) {
                context.fillStyle = 'rgb(0,' + elevations[x][y] + ',' + Math.floor(elevations[x][y] / 4) + ')';
            } else {
                context.fillStyle = 'rgb(0,' + Math.floor(elevations[x][y] / 4) + ',' + elevations[x][y] + ')';
            }
            context.fillRect(x, y, 1, 1);
        }
    }
});