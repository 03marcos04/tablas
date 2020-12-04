// =================== NECESARIO ======================
// validacion para obtener el path relation cuando se ejecuta mi aplicacion
// path puede ser de github otro servidor o local host
var NombreCarpertaProyecto = 'tablas';


var url = window.location.href;
var swLocation = '/' + NombreCarpertaProyecto + '/sw.js';


if (navigator.serviceWorker) {
    if (url.includes('localhots')) {
        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register(swLocation);
}
// =================== NECESARIO ======================