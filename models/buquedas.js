const fs = require ('fs');

const axios = require('axios');


class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor( ) {
    //Lectura de DB 
     this.leerDB();
    }
    // Letras del historial mas prolijas
    get historialCapitalizado() {
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));

            return palabras.join( ' ')
        })
    }
    //Parametros APIGEO 
    get paramsMapbox() {
        return  {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 6,
            'lenguaje': 'es'
       
    }
    }
    //Utilizar APIGEO
    async ciudad( lugar = '') {
        try {
          const instance = axios.create({
              baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
              params: this.paramsMapbox
             });
            const resp = await instance.get();
            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
        } catch (error) {
            return [];
        }
    }
    //Parametros APIWEATHER
    get paramsClima() {
        return  {
            appid: process.env.OPENWEATHER_KEY,
            lang: 'es',
            units: 'metric' 
    }
    }
    //Utilizar APIWEATHER
    async climaxLugar( lat, lon) {
        try {
            const instance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: {...this.paramsClima, lat, lon}
           })

           const resp = await instance.get();
           const {weather, main} = resp.data;

           return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
            }
        } catch (error) {
            console.log('No pudimos encontrar el clima para tu ciudad');
            
        }
    }

    grabarHistorial( lugar = '') {
        // prevenir duplicados
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial.unshift(lugar.toLocaleLowerCase());

        // grabar en data base
        this.guardarDB();
   

    }

    guardarDB() {
        const payload = {
            historial: this.historial
        };

        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
        
    }

    leerDB(){
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'});

        const data = JSON.parse(info);
        console.log(data);
    
        this.historial = data.historial;

    }

}


module.exports = Busquedas;