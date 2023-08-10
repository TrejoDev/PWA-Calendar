import { act, renderHook } from "@testing-library/react"
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { store, uiSlice } from "../../src/store";
import { useUiStore } from "../../src/hooks/useUiStore"

const getMockStore = ( initialState ) => {      //Nos permite configurar el store, para establecer estados determinados q queremos probar en el testing.
    return configureStore({
        reducer: {
            ui: uiSlice.reducer,
        },
        preloadedState: {
            ui: { ...initialState }
        }
    })
};

describe('Pruebas en useUiStore.js', () => { 

    test('Debe de regresar los valores x defecto', () => { 

        const mockStore = getMockStore({ isDateModalOpen: false }); 
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>   //wrapper: segundo argumento de renderHook q permite establecer el <Provider />
        } );

        expect( result.current ).toEqual({
            isDateModalOpen: false,
            closeDateModal: expect.any( Function ),
            openDateModal: expect.any( Function ),
            toggleDateModal: expect.any( Function ),
          });
     })
    test('openDateModal debe de colocar true en el isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: false }); 
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>   
        } );

        const { openDateModal } = result.current; //en este punto {isDateModalOpen: false}
        
        act( () => {
            openDateModal();
        } );
                                                                //en este punto {isDateModalOpen: true}
        //console.log({ result: result.current, isDateModalOpen }); // En este caso isDateModalOpen q se obtiene en la desestructuracion se mantiene falso despues de ejecutar openDateModal(),
                                                                 // xq contiene un valor primitivo.  
                                                                // Sin embargo, si el valor de isDateModalOpen fuera un obj, este si cambiaria.
        expect( result.current.isDateModalOpen ).toBeTruthy();
     })
    test('closeDateModal debe de colocar false en el isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: true }); 
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>   
        } );

        const { closeDateModal } = result.current;

        act( () => {
            closeDateModal();
        } ),

        expect( result.current.isDateModalOpen ).toBeFalsy();
     })
    test('toggleDateModal debe de variar el valor de isDateModalOpen', () => { 
        
        const mockStore = getMockStore({ isDateModalOpen: true }); 
        const { result } = renderHook( () => useUiStore(), {
            wrapper: ({ children }) => <Provider store={ mockStore }>{ children }</Provider>   
        } );

        act( () => {
            result.current.toggleDateModal();  
        } ),

        expect( result.current.isDateModalOpen ).toBeFalsy();
        
        act( () => {
            result.current.toggleDateModal();
        } ),
        
        expect(result.current.isDateModalOpen).toBeTruthy();
     })
 })