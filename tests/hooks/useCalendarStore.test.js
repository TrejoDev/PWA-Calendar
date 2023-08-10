import { configureStore } from "@reduxjs/toolkit"
import { act, renderHook } from "@testing-library/react"

import { authSlice, calendarSlice } from "../../src/store"
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../fixtures/calendarState"
import { useCalendarStore } from "../../src/hooks/useCalendarStore"
import { Provider } from "react-redux"
import { authenticatedState } from "../fixtures/authState"
import { calendarApi } from "../../src/api"
import { testUserCredentials } from "../fixtures/testUser"


jest.mock("sweetalert2", () => ({
    fire: jest.fn(),
  }));

const getMockStore = ( initialState ) => {
    return configureStore({
        reducer: {
            auth: authSlice.reducer,
            calendar: calendarSlice.reducer,
        },
        preloadedState: {
            auth: {...authenticatedState },
            calendar: { ...initialState }
        },
    })
}

describe('Pruebas en useCalendarStore.js', () => { 
    
    beforeEach( () => jest.clearAllMocks() );

    test('Debe de regresar los valores x defecto', () => { 
        
        const mockStore = getMockStore({...initialState});

        const { result } = renderHook( () => useCalendarStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current).toEqual({
            events: [],
            activeEvent: null,
            hasEventSelected: false,
            setActiveEvent: expect.any(Function),
            startSavingEvent: expect.any(Function),
            startDeletingEvent: expect.any(Function),
            startLoadingEvents: expect.any(Function),
          });

     });
     test('setActiveEvent must place the active event in the store ', async() => { 
        const mockStore = getMockStore({...calendarWithActiveEventState});
        
        const { result } = renderHook( () => useCalendarStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        expect(result.current.activeEvent).toEqual({
            ...events[0],
          });
      })
      test('startSavingEvent must create new event', async () => { 
        
        const newEvent = {
            start: new Date("2022-09-08 13:00:00"),
            end: new Date("2022-09-08 15:00:00"),
            title: "Cumplaños de Astrid",
            notes: "Alguna nota de Astrid",
          };
      
        const mockStore = getMockStore({...calendarWithEventsState});
        
        const { result } = renderHook( () => useCalendarStore(), {
            wrapper: ({ children }) => <Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi , 'post').mockResolvedValueOnce({
            data: { 
                evento: {
                    id: 3,
                    ...newEvent,
                    user: testUserCredentials.uid,
                }  
            }
          });

        await act( async () => {
            
            await result.current.startSavingEvent({...newEvent});
        } );

        console.log(result.current);
    });
        

 })
