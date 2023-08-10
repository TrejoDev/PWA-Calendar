import calendarApi from "../../src/api/calendarApi"

describe('Pruebas en el calendarApi', () => { 

    test('debe de tener la configuracion por defecto', () => { 
        
        //console.log(calendarApi);
        //console.log(process.env);

        expect( calendarApi.defaults.baseURL ).toBe( process.env.VITE_API_URL )

     });

    test('debe de tener el x-token en el header de todas las peticiones ', async() => { 
        
        localStorage.setItem('token', 'ABC-123-XYZ');
        const res = await calendarApi.get('/auth');

        expect(res.config.headers['x-token']).toBe('ABC-123-XYZ') ;  //El objetivo de esta prueba es comprobar q en el header se envie correctamente el 'x-token' no importa su valor.

    })
 })