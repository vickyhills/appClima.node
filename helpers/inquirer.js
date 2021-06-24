const inquirer = require('inquirer');
require('colors');

const leerInput = async(mensaje) => {
      const question = [
    {
        type: 'input',
        name: 'desc',
        message: mensaje,
        validate(value) {
            if(value.length === 0) {
                return 'Por favor ingrese un lugar'
            } return true
        }
    }
];

const {desc} = await inquirer.prompt(question);
return desc;
}


const inquirerMenu = async() => {
    console.clear();
    console.log('====================='.blue);
    console.log('      BIENVENIDOS    '.white);
    console.log('=====================\n'.blue);


    const {opt} = await inquirer.prompt(preguntas);


    return opt; 
}

const pausa = async() => {
    const question = [
        {
         type: 'input',
         name: 'enter',
         message: `\nPresione ${'ENTER'.green} para continuar\n`
        }
    ]
    console.log('\n');

     await inquirer.prompt(question);

}

const preguntas = [
{
    type: 'list',
    name: 'opt',
    message: 'Aplicación del clima',
    choices: [
        {
            value: 1,
            name: `${'1.'.magenta} Buscar ciudad`
        
        }, 
        {
            value: 2,
            name: `${'2.'.magenta} Historial`
        },
        {
            value: 0,
            name: `${'0.'.magenta} Salir`
        }]
}
];

const listarLugares = async( lugares = [] ) => {
    
    const choices = lugares.map( (lugar, i) => {
       const idx = `${i + 1}`;
       
       return {
            value: lugar.id,
            name: `${idx.green}. ${lugar.nombre}`
        }
        
        });

        choices.unshift({
            value: '0',
            name: '0 ' + 'CANCELAR'

        });
    
        const preguntas = [
            {
            type: 'list',
            name: 'id',
            message: 'Seleccione su lugar:',
            choices  
                  }
        ]
        const { id } = await inquirer.prompt(preguntas);
        return id;
}


  
module.exports = {
    inquirerMenu,
    pausa,
    leerInput, 
    listarLugares
}