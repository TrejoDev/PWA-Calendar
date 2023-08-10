import { render, screen } from "@testing-library/react";

import { useAuthStore } from "../../src/hooks/useAuthStore"
import { authenticatedState, initialState, notAuthenticatedState } from "../fixtures/authState"
import { AppRouter } from "../../src/router/AppRouter";
import { MemoryRouter } from "react-router-dom";
import { CalendarPage } from "../../src/calendar/pages/CalendarPage";

jest.mock("../../src/hooks/useAuthStore");

jest.mock("../../src/calendar/pages/CalendarPage", ()=> ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Pruebas en <AppRouter />', () => { 
    
    const mockCheckAuthToken = jest.fn();
    beforeEach( () => jest.clearAllMocks() );

    test('debe de mostrar la pantalla de carga y llamar checkAuthToken', () => { 
        
        useAuthStore.mockReturnValue({
            status: initialState.status,
            checkAuthToken: mockCheckAuthToken
        });

        render( <AppRouter /> );
        expect( screen.getByText('Cargando...') ).toBeTruthy();
        expect( mockCheckAuthToken ).toHaveBeenCalled();
        

     })
     test('Debe de mostrar el login en caso de no estar autenticado ', () => { 
        useAuthStore.mockReturnValue({
            status: notAuthenticatedState.status,
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render( 
            <MemoryRouter initialEntries={['/auth2/cualquierUrl']}>  
                <AppRouter /> 
            </MemoryRouter>
        ); {/* Al agregar initialEntries verificamos que funciona la proteccion de ruta, ya q al ingresar una url cualquiera esta es atrapada y redireccionada al LoginPage */}
        
        expect(screen.getByText('Ingreso')).toBeTruthy();
        expect( container ).toMatchSnapshot();

      })
     test('Debe de mostrar el calendarPage si estamos autenticados', () => { 
        useAuthStore.mockReturnValue({
            status: authenticatedState.status,
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render( 
            <MemoryRouter initialEntries={['/auth2/cualquierUrl']}>  
                <AppRouter /> 
            </MemoryRouter>
        ); 
        
        expect(screen.getByText('CalendarPage')).toBeTruthy(); 
        expect( container ).toMatchSnapshot();
       
      })

 })