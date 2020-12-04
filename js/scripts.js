document.querySelector('#SelecTabla').addEventListener('submit', cargarContenido);



function cargarContenido(e) {
    e.preventDefault();

    // const origen = document.getElementById('origen');
    // const origenSeleccionado = origen.options[origen.selectedIndex].value;

    const tabla_select = document.getElementById('tablacalcular');
    const tabla_seleccionada = tabla_select[tabla_select.selectedIndex].value;
    // console.log(tabla_seleccionada);

    // generar html
    let listo = `<br>
             <h2>Tabla generada</h2>
             <br>`;

    listo += `
    <table class="table table-striped table-warning">
    <thead>
    <tr>
        <th>Tabla</th>
        <th>Por</th>
        <th>Numero</th>
        <th>Igual</th>
        <th>Resultado</th>
    </tr>
    </thead>
`;

    for (x = 1; x <= 1; x++) {

        for (y = 1; y <= 10; y++) {

            listo += `
                <tr>
                    <th>` + tabla_seleccionada + `</th>
                    <th>x</th>
                    <th>` + y + `</th>
                    <th>=</th>
                    <th>` + (tabla_seleccionada * y) + `</th>
                </tr>
        `;
        }
    }

    listo += `
        </tbody>    
    </table>
    `;
    document.getElementById('resultado').innerHTML = listo;
}