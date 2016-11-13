requirejs(["helper/perlin-noise-simplex"], function (SimplexNoise) {
    var s = new SimplexNoise();
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.canvas.width = window.innerWidth * 0.8;
    context.canvas.height = window.innerHeight * 0.8;
    var width = context.canvas.width;
    var height = context.canvas.height;

    var elevations = new Array(width);
    for (i = 0; i < width; i++) {
        elevations[i] = new Array(height);
        for (j = 0; j < height; j++) {
            elevations[i][j] = 0;
        }
    }

    var tectonics = function (x, y, scale) {
        var effectiveX = x / scale;
        var effectiveY = y / scale;
        return Math.floor((255 * (scale / 381)) * s.noise(effectiveX, effectiveY));
    }

    for (var z = 255; z > 1; z = z / 3) {
        for (var x = 0; x < width; x++) {
            for (var y = 0; y < height; y++) {
                var newElevation = tectonics(x, y, z);
                elevations[x][y] = elevations[x][y] + newElevation;
            }
        }
    }


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