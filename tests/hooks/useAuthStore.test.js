import { act, renderHook, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux";

import { authSlice } from "../../src/store"
import { useAuthStore } from "../../src/hooks/useAuthStore";
import { initialState, notAuthenticatedState } from "../fixtures/authState";
import { testUserCredentials } from "../fixtures/testUser";
import { calendarApi } from "../../src/api";


const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
        },
        preloadedState: {
            auth: { ...initialState }
        }
    })
};

describe('Pruebas en useAuthStore.js', () => { 

    beforeEach( () => localStorage.clear() ); //Debemos 1ramente limpiar el localStorage paro no tener falsos +, ya q pueda estar almacenado algun token previo.

    test('Debe de regresar los valores x defecto', () => { 

        const mockStore = getMockStore({...initialState});

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );

        expect( result.current ).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startLogout: expect.any(Function),
            startRegister: expect.any(Function),
          }) ;
     });
     test('startLogin debe de realizar el login correctamente ', async () => { 
        
        const mockStore = getMockStore({...notAuthenticatedState});

        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );

        await act( async () => {                                        //startLogin es async, por tanto debemos esperar su result,
            await result.current.startLogin( testUserCredentials )     //Para ello debemos utilizar el async await en todo su scope
        } )

        const { user, status, errorMessage } = result.current;

        expect({ user, status, errorMessage }).toEqual({
            errorMessage: undefined,
            status: 'authenticated',
            user: { name: 'Test User', uid: '647db8b7f0c1cd6f75c02bfa' },  
        });

        expect( localStorage.getItem('token')).toEqual( expect.any( String ) ) ;  //Todo lo que guardamos en el localStorage termina siendo string.
        expect( localStorage.getItem('token-init-date')).toEqual( expect.any( String ) ) ;

      });
      test('startLogin debe de fallar la autenticacion', async () => { 
        
        const mockStore = getMockStore({...notAuthenticatedState});
 
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );
 
        await act( async () => {                                      
            await result.current.startLogin({ email: "algo@google.com", password: "123456" })    
        } )
 
        const { user, status, errorMessage } = result.current;
 
        expect(localStorage.getItem('token')).toBe( null );
        expect({ user, status, errorMessage }).toEqual({
            user: {},
            status: 'not-authenticated',
            errorMessage: 'Credenciales incorrectas'
          });
 
          await waitFor(   //Espera por:
            () => expect( result.current.errorMessage ).toBe( undefined )
          )
 
      });
    test('startRegister debe de crear un usuario', async () => { 

        const newUser = { email: "test@google.com", password: "123456", name: 'Test User' };

        const mockStore = getMockStore({...notAuthenticatedState});
 
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );
 
        const spy = jest.spyOn( calendarApi, 'post' ).mockReturnValue({ //Hacemos un mock de la respuesta a la peticion post del calendarApi.
            data: {                                                     //Simulamos la creacion de user para evitar almacenar basura en nuestra DB, q a su vez influiria de manera - en pruebas anteriormente realizadas.
                ok: true,
                uid: "647db8b7f0c1cd6f75c02bfa",
                name: "Test User",
                token: "ALGUN-TOKEN"
            }
        })

        await act( async () => {                                      
            await result.current.startRegister( newUser )    
        } )
        
        const { user, status, errorMessage } = result.current;

        expect({ user, status, errorMessage }).toEqual({
            user: { name: 'Test User', uid: '647db8b7f0c1cd6f75c02bfa' },
            status: 'authenticated',
            errorMessage: undefined
          });

        spy.mockRestore(); //Destruye el spy, por si es necesario implementarlo en otra prueba.  

     });
     test('startRegister debe de fallar la autenticacion', async () => { 
        
        const mockStore = getMockStore({...notAuthenticatedState});
 
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );
 
        await act( async () => {                                      
            await result.current.startRegister( testUserCredentials )    
        } )
 
        const { user, status, errorMessage } = result.current;
 
        expect(localStorage.getItem('token')).toBe( null );
        expect({ user, status, errorMessage }).toEqual({
            errorMessage: "Un usario ya existe con ese correo", 
            status: "not-authenticated", 
            user: {}
        });
 
          await waitFor(   //Espera por:
            () => expect( result.current.errorMessage ).toBe( undefined )
          )
 
      });
    test('checkAuthToken debe de fallar si no hay token ', async() => { 
        
        const mockStore = getMockStore({...initialState});
 
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );

        await act( async () => {                                      
            await result.current.checkAuthToken( )    
        } )

        const { user, status, errorMessage,  } = result.current;

        expect({ user, status, errorMessage }).toEqual({
             user: {}, 
             status: 'not-authenticated', 
             errorMessage: undefined 
            });
        

     })
    test('checkAuthToken debe de autenticar el user si hay token ', async() => { 
        
        const { data } = await calendarApi.post('/auth', testUserCredentials);
        localStorage.setItem( 'token', data.token );
        localStorage.setItem('token-init-date', new Date().getTime() );

        const mockStore = getMockStore({...initialState});
 
        const { result } = renderHook( () => useAuthStore(), {
            wrapper: ( { children } ) => <Provider store={mockStore}>{children}</Provider>
        } );

        await act( async () => {                                      
            await result.current.checkAuthToken( )    
        } )

        const { user, status, errorMessage,  } = result.current;

        expect({ user, status, errorMessage }).toEqual({
            errorMessage: undefined, 
            status: "authenticated", 
            user: {name: "Test User", uid: "647db8b7f0c1cd6f75c02bfa"}
        });
        

     })
     
     
    


 })