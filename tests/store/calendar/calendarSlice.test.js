import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarState"


describe('Pruebas en calendarSlice.js', () => { 

    test('debe de regresar el estado por defecto', () => { 
        
        const state = calendarSlice.getInitialState();

        expect( state ).toEqual( initialState );
     });
    test('onSetActiveEvent debe de activar el evento', () => { 
        
        const state = calendarSlice.reducer( calendarWithEventsState, onSetActiveEvent( events[0] ) )
        
        expect( state.activeEvent ).toEqual( events[0] );
     });
    test('onAddNewEvent debe de agregar un nuevo evento', () => { 
        
        const newEvent = {
            _id: '3',
            start: new Date('2023-08-05 17:00:00'),
            end: new Date('2023-08-05 19:00:00'),
            title: 'Cumpleaños de Eduardo',
            notes: 'Alguna nota de Eduardo',
       };
        const state = calendarSlice.reducer( calendarWithEventsState, onAddNewEvent( newEvent )  );
       expect( state.events ).toEqual([...events, newEvent ]);

     });
    test('onUpdateEvent debe de actualizar el evento', () => { 
        
        const updatedEvent = {
            id: '1',
            start: new Date('2023-08-05 17:00:00'),
            end: new Date('2023-08-05 19:00:00'),
            title: 'Cumpleaños de Eduardo',
            notes: 'Alguna nota de Eduardo',
       };
        const state = calendarSlice.reducer( calendarWithEventsState, onUpdateEvent( updatedEvent )  );
        
        expect( state.events ).toContainEqual( updatedEvent ) ;

     });
     test('onDeleteEvent debe de eliminar el evento activo', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onDeleteEvent() );
        expect( state.activeEvent ).toBe( null );
        expect( state.events ).not.toContain( events[0] );
      });
      test('onLoadEvents debe de establecer los nuevos eventos', () => { 
        
        const state = calendarSlice.reducer( initialState, onLoadEvents( events ) )
        expect( state.events ).toEqual( events );

        const newEvents = [
            ...events,  
            {
                _id: '3',
                start: new Date('2023-08-05 17:00:00'),
                end: new Date('2023-08-05 19:00:00'),
                title: 'Cumpleaños de Eduardo',
                notes: 'Alguna nota de Eduardo',
           }
        ]

        const newState = calendarSlice.reducer( calendarWithEventsState, onLoadEvents( newEvents )  );
        expect( newState.events ).toEqual( newEvents )  ;    


       })
      test('onLogoutCalendar debe de limpiar el estado', () => { 
        
        const state = calendarSlice.reducer( calendarWithActiveEventState, onLogoutCalendar() );
        expect( state ).toEqual( initialState )  ;

       })
 })