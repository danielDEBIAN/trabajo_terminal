var canvas = document.getElementById('miCanvas');
var contexto = canvas.getContext('2d');
var th = 0;
contexto.lineWidth = 1;
function rotX(x, y, z, th) {
    yr = y * Math.cos(th) - z * Math.sin(th);
    zr = y * Math.sin(th) + z * Math.cos(th);
    return [yr, zr];
}
function rotY(x, y, z, th) {
    xr = x * Math.cos(th) - z * Math.sin(th);
    zr = x * Math.sin(th) + z * Math.cos(th);
    return [xr, zr];
}
function rotZ(x, y, z, th) {
    xr = x * Math.cos(th) - y * Math.sin(th);
    yr = x * Math.sin(th) + y * Math.cos(th);
    return [xr, yr];
}
function xyz2XY(x, y, z, DX, DY, th) {
    //DX=500;
    //DY=500;
    d = 20000;
    [y, z] = rotX(x, y, z, th);
    [x, z] = rotY(x, y, z, th);
    [x, y] = rotZ(x, y, z, th);
    X = d * xr / (-zr + d) + DX;
    Y = -(d * yr / (-zr + d)) + DY;
}
function nextTh() {
    canvas.width = canvas.width;//contexto.clearRect(0, 0, canvas.width, canvas.height);
    contexto.beginPath();
    contexto.strokeStyle = "#FF0000";
    xyz2XY(0, 0, 0, 550, 550, th);
    contexto.moveTo(X, Y);
    xyz2XY(500, 0, 0, 550, 550, th);
    contexto.lineTo(X, Y);
    contexto.stroke();

    contexto.beginPath();
    contexto.strokeStyle = "#00FF00";
    xyz2XY(0, 0, 0, 550, 550, th);
    contexto.moveTo(X, Y);
    xyz2XY(0, 500, 0, 550, 550, th);
    contexto.lineTo(X, Y);
    contexto.stroke();

    contexto.beginPath();
    contexto.strokeStyle = "#0000FF";
    xyz2XY(0, 0, 0, 550, 550, th);
    contexto.moveTo(X, Y);
    xyz2XY(0, 0, 500, 550, 550, th);
    contexto.lineTo(X, Y);
    contexto.stroke();

    contexto.beginPath();
    contexto.strokeStyle = "#00FF00";
    for (x = -200; x <= 200; x += 15) {
        y = -200;
        z = 100 * Math.sin(x * x + y * y) / (x * x + y * y);
        xyz2XY(x, y, z, 550, 550, th);
        contexto.moveTo(X, Y);
        for (y = -200; y <= 200; y += 15) {
            z = (100 * Math.sin(0.001 * (x * x + y * y))) / (0.001 * (x * x + y * y));
            xyz2XY(x, y, z, 550, 550, th);
            contexto.lineTo(X, Y);
        }
        contexto.stroke();
    }
    contexto.stroke();
    th = th + .01;
    if (th <= 2 * Math.PI)
        setTimeout(function () { nextTh() }, 10);
}
if (th == 0) { nextTh(); }