

export const events = [
    {
         id: '1',
         start: new Date('2023-06-05 17:00:00'),
         end: new Date('2023-06-05 19:00:00'),
         title: 'Cumpleaños del Fernando',
         notes: 'Alguna nota',
    },
    {
         id: '2',
         start: new Date('2023-07-05 17:00:00'),
         end: new Date('2023-07-05 19:00:00'),
         title: 'Cumpleaños de Melissa',
         notes: 'Alguna nota de Melissa',
    },
];

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
};

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: null
};

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [ ...events ],
    activeEvent: { ...events[0] } //Usamos operador spread para romper la referencia al obj, por si este es modificado.
};