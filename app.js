require('dotenv').config()

const {  inquirerMenu, pausa, leerInput, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/buquedas");


const main = async() => {
   console.clear();
    const busquedas = new Busquedas();
    let opt;
  
    do { 
        // Menu
        opt = await inquirerMenu();
       
        switch (opt) {
            case 1:
        const lugar = await leerInput('Ciudad:');
        // Busqueda de lugares
        const lugares = await busquedas.ciudad(lugar);
        // Seleccion de cada lugar
        const id = await listarLugares(lugares);
        if (id === '0') continue;

        const lugarSel = lugares.find(l => l.id === id);

         // Guardar en Database
         busquedas.grabarHistorial(lugarSel.nombre);
        // Obtener el clima
        const clima = await busquedas.climaxLugar(lugarSel.lat, lugarSel.lng);
         // Mostrar resultados
         console.clear();
         console.log('\nInformación del lugar\n'.green );
         console.log('Ciudad:', lugarSel.nombre.green);
        console.log('Latitud:', lugarSel.lat);
         console.log('Longitud:', lugarSel.lng);
        console.log('Temperatura actual:', clima.temp);
         console.log('Actualmente:', clima.desc.green);
        console.log('Mínima:', clima.min );
        console.log('Máxima:', clima.max );

         break;

         case 2:
        //Mostrar historial 
        busquedas.historialCapitalizado.forEach( (lugar, i) => {
        // Como se ve el historial
        const idx = `${i + 1}.`.green;
        console.log(`${idx} ${lugar}`);
                      
        })

                break;
           }
        
        if (opt !== 0) await pausa(); 
        
    } while (opt !== 0)

}

main ();