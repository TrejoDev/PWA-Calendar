import { onCloseDateModal, onOpenDateModal, uiSlice } from "../../../src/store/ui/uiSlice"

describe('pruebas en uiSlice.js', () => { 
    
    test('debe de regresar el estado por defecto', () => { 
        
        expect( uiSlice.getInitialState().isDateModalOpen ).toBeFalsy() ;

     })
    test('debe de cambiar el isDateModalOpen correctamente', () => { 
        let state = uiSlice.getInitialState( );
        state = uiSlice.reducer( state, onOpenDateModal() );  // uiSlice.reducer( state, actionCreator )
        
        expect( state.isDateModalOpen ).toBeTruthy() ;  
       
        state = uiSlice.reducer( state, onCloseDateModal() );

        expect( state.isDateModalOpen ).toBeFalsy();

    })
})