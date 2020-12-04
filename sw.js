// =================== NECESARIO ======================
var NombreProyecto = 'tablas';
// cache estatico que son los archivos necesarios
const STATIC_CACHE = NombreProyecto + '-static-v1';
// cache dinamico archivos no tan necesarios como imagenes
const DYNAMIC_CACHE = NombreProyecto + '-dynamic-v1';
// cache con archivos de librerias 
const INMUTABLE_CACHE = NombreProyecto + '-inmutable-v1';
// =================== NECESARIO ======================


// funcion para actualizar cache dinamico
function actualizaCacheDinamico(dynamicCache, req, res) {
    // si la peticion se hizo correctamente significa que tenemos datos
    if (res.ok) {
        // regresamos la respuesta
        // abrimos el cache dinamico y si abre el cache
        return caches.open(dynamicCache).then(cache => {
            // vamos a almacenar la peticion y la respuesta la clonamos
            cache.put(req, res.clone());
            // ahora tenemos que regresar algo por que si no no hizo nada y retornamos un clone de la respuesta
            return res.clone();
        })
    } else { // si la peticion fallo 
        console.error(res); // imprimimos en consola el error para verificar 
        return res; // regresamos la respuesta de la peticion
    }
}

// corazon de la aplicacion
// app shell normal es un arreglo de direcciones de archivos para que funcione mi aplicacion 
const APP_SHELL = [
        // '/',
        'index.html',
        "css/bootstrap.min.css",
        "css/fontello.css",
        "css/estilos.css",
        "css/pwa.css",
        "img/favicon.ico",
        "img/logo.png",
        "js/jquery.min.js",
        "js/bootstrap.min.js",
        "js/scripts.js",
        "js/pwa.js"
    ]
    // app shell inmutable es un arreglo de direcciones de archivos que no son mios, librerias etc.
const APP_SHELL_INMUTABLE = [

    ]
    // instalacion de service worker
self.addEventListener('install', e => {
    // en una constante estamos grabando la instruccion de registrar los arreglos de caches en el cache del navegador
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL)).catch(err => console.log('error ', err));

    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE)).catch(err => console.log('error ', err));

    // los 2 caches los meto a una promesa all para recibir un arreglo de promesas
    const promesas = Promise.all([cacheStatic, cacheInmutable]);

    //espera a que terminen de ejecutarse las promesas
    e.waitUntil(promesas);
});

// instruccion para que cada que se haga un cambio en el service worker se borre el cache viejo
self.addEventListener('activate', e => {
    // si el cache es diferente lo borramos si no no
    const respuesta = caches.keys().then(keys => { // asi obtengo todos los caches
        keys.forEach(key => { // vamos a recorrer todos los keys del cache
            if ((key != STATIC_CACHE) && (key != DYNAMIC_CACHE) && (key != INMUTABLE_CACHE)) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
    // si el cache es diferente lo borramos si no no
});


// implementacion de estrategia de cache
// estrategia cache only
self.addEventListener('fetch', e => {
    // buscaremos en el cache algo que coincida con la peticion que se esta realizando para verificar si tenemos el archivo en el cache
    const respuesta = caches.match(e.request).then(res => { // el resultado de la busqueda del recurso en cache guardalo en la constante respuesta
        // una vez que ejecute la funcion vamos entrar en condiciones
        console.error(e.request);
        if (res) return res; // si la respuesta al archivo o la peticion existe regresala al navegador
        else {
            // console.error(e.request); // si el recurso solicitado no se encuentra en los caches retorta la peticion en un console.error para mostrar la pecicion en la pantalla
            return fetch(e.request).then(newRes => { // solicitamos el recurso que no tenemos en cache
                // llamos al service worker auxiliar
                return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);
            });
        }
    });
    // retorna la respuesta
    e.respondWith(respuesta);
})