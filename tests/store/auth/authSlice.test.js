import { authSlice, clearErrorMessage, onChecking, onLogin, onLogout } from "../../../src/store/auth/authSlice"
import { authenticatedState, initialState } from "../../fixtures/authState"
import { testUserCredentials } from "../../fixtures/testUser";

describe('Pruebas en el authSlice', () => { 
    
    test('Debe de regresar el estado inicial ', () => { 
        
        expect( authSlice.getInitialState() ).toEqual( initialState );

     })
    test('debe de realizar un login ', () => { 

        const state = authSlice.reducer( initialState, onLogin( testUserCredentials ) );
        expect( state ).toEqual({
            status: 'authenticated',
            user: testUserCredentials,
            errorMessage: undefined
          });
     })
    test('Debe de realizar el logout', () => { 
        
        const state = authSlice.reducer( authenticatedState, onLogout() );
        expect(state).toEqual({ 
            status: 'not-authenticated', 
            user: {}, 
            errorMessage: undefined 
        });
     })
    test('Debe de realizar el logout con un payload', () => { 
        const errorMessage = 'Credenciales incorrectas'
        const state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        expect(state).toEqual({ 
            status: 'not-authenticated', 
            user: {}, 
            errorMessage 
        });
     })
    test('debe de limpiar el de error ', () => { 
        const errorMessage = 'Credenciales incorrectas'
        let state = authSlice.reducer( authenticatedState, onLogout( errorMessage ) );
        
        state = authSlice.reducer( authenticatedState, clearErrorMessage() )
        
        expect( state.errorMessage ).toBe( undefined );
     })
     test('debe de realizar el checkquing', () => { 
        
        const state = authSlice.reducer( authenticatedState, onChecking() );
        expect( state ).toEqual({ 
            status: 'checking', 
            user: {}, 
            errorMessage: undefined 
        });

      })
 })