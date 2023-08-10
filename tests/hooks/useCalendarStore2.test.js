import { configureStore } from "@reduxjs/toolkit";
import { act, renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import Swal from "sweetalert2";

import { calendarApi } from "../../src/api";
import { useCalendarStore } from "../../src/hooks";
import { authSlice, calendarSlice } from "../../src/store";

import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../fixtures/calendarState"
 
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
}));

const getMockStore = (initalState) => {
  return configureStore({
    reducer: {
      calendar: calendarSlice.reducer,
      auth: authSlice.reducer,
    },
    preloadedState: {
      calendar: { ...initalState },
      auth: {
        status: "authenticated",
        user: {
          uid: "123123123123",
          name: "Test",
        },
        errorMessage: undefined,
      },
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};
describe("test in useCalendarStore", () => {
  beforeEach(() => jest.clearAllMocks());
 
  test("must return initalState", () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
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
 
  test("setActiveEvent must place the active event in the store  ", () => {
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    act(() => {
      result.current.setActiveEvent({ ...events[0] });
    });
 
    expect(result.current.activeEvent).toEqual({
      ...events[0],
    });
  });
 
  test("startSavingEvent must create new event", async () => {
    const newEvent = {
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños de Astrid",
      notes: "Alguna nota de Astrid",
    };
 
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    const spy = jest.spyOn(calendarApi, "post").mockReturnValue({
      data: {
        event: {
          id: "testid",
          ...newEvent,
        },
      },
    });
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });
 
    expect(result.current.events.length).toBe(3);
    expect(result.current.events[result.current.events.length - 1]).toEqual({
      id: "testid",
      ...newEvent,
      user: {
        uid: "123123123123",
        name: "Test",
      },
    });
 
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Creacion",
      "Se ha creado correctamente",
      "success"
    );
    spy.mockRestore();
  });
 
  test("startSavingEvent must fail ", async () => {
    const newEvent = {
      start: new Date("2022-09-08 13:00:00"),
    };
 
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });
 
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error en el Evento",
      expect.any(String),
      "error"
    );
  });
 
  test("startSavingEvent must edit event", async () => {
    const newEvent = {
      id: "1",
      start: new Date("2022-09-08 13:00:00"),
      end: new Date("2022-09-08 15:00:00"),
      title: "Cumplaños de Astrid",
      notes: "Alguna nota de Astrid",
    };
 
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    const spy = jest.spyOn(calendarApi, "put").mockReturnValue({
      data: {
        event: {
          ...newEvent,
        },
      },
    });
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });
 
    expect(result.current.events).toEqual([
      {
        ...newEvent,
        user: {
          uid: "123123123123",
          name: "Test",
        },
      },
      events[1],
    ]);
 
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Edicion",
      "Se ha Editado correctamente",
      "success"
    );
 
    spy.mockRestore();
  });
 
  test("startSavingEvent must fail edit", async () => {
    const newEvent = {
      id: "1",
    };
 
    const mockStore = getMockStore({ ...calendarWithEventsState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    await act(async () => {
      await result.current.startSavingEvent({ ...newEvent });
    });
 
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error en el Evento",
      expect.any(String),
      "error"
    );
  });
 
  test("startDeletingEvent must delete event", async () => {
    const mockStore = getMockStore({ ...calendarWithActiveEventState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    const spy = jest.spyOn(calendarApi, "delete").mockReturnValue({
      data: {
        ok: true,
        event: {
          ...events[0],
        },
      },
    });
 
    await act(async () => {
      await result.current.startDeletingEvent();
    });
 
    expect(result.current.events.length).toBe(events.length - 1);
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Eliminacion",
      "Se ha eliminado correctamente",
      "success"
    );
    spy.mockRestore();
  });
 
  test("startDeletingEvent must fail delete", async () => {
    const mockStore = getMockStore({ ...calendarWithActiveEventState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    await act(async () => {
      await result.current.startDeletingEvent();
    });
 
    expect(Swal.fire).toHaveBeenCalledTimes(1);
    expect(Swal.fire).toHaveBeenCalledWith(
      "Error en la Eliminacion",
      expect.any(String),
      "error"
    );
  });
 
  test("startLoadingEvents must loading events", async () => {
    const getevents = [
      {
        id: "1",
        start: "2022-10-21 13:00:00",
        end: "2022-10-21 15:00:00",
        title: "testing 1",
        notes: "Alguna nota",
      },
      {
        id: "2",
        start: "2022-11-09 13:00:00",
        end: "2022-11-09 15:00:00",
        title: "testing 2",
        notes: "Alguna nota de Melissa",
      },
    ];
 
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    const spy = jest.spyOn(calendarApi, "get").mockReturnValue({
      data: {
        ok: true,
        events: getevents,
      },
    });
 
    await act(async () => {
      await result.current.startLoadingEvents();
    });
 
    expect(result.current.events).toEqual([
      {
        id: "1",
        start: expect.any(Object),
        end: expect.any(Object),
        title: "testing 1",
        notes: "Alguna nota",
      },
      {
        id: "2",
        start: expect.any(Object),
        end: expect.any(Object),
        title: "testing 2",
        notes: "Alguna nota de Melissa",
      },
    ]);
 
    spy.mockRestore();
  });
 
  test("startLoadingEvents must fail", async () => {
    const mockStore = getMockStore({ ...initialState });
    const { result } = renderHook(() => useCalendarStore(), {
      wrapper: ({ children }) => (
        <Provider store={mockStore}>{children}</Provider>
      ),
    });
 
    await act(async () => {
      await result.current.startLoadingEvents();
    });
 
    expect(result.current.events.length).toBe(0)
  });
});