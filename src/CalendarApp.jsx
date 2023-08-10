import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router';
import { store } from './store';


export const CalendarApp = () => {
  return (
    <Provider store={ store }>

      <BrowserRouter>
      {/* <HashRouter> Es una opcion para configurar */} 
        <AppRouter />
      </BrowserRouter>
    </Provider>
  )
}
