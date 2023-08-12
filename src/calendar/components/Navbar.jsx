import { useAuthStore } from "../../hooks/useAuthStore"
import { useOnlineStatus } from "../../hooks/useOnlineStatus";


export const Navbar = () => {

  const { startLogout, user } = useAuthStore();
  const { isOnline } =  useOnlineStatus();
  
  return (
    <div className="navbar navbar-dark bg-dark mb-4 px-4">
        <span className="navbar-brand">
            <i className="fas fa-calendar-alt"></i>
            &nbsp;
            { user.name }
        </span>
        {
          isOnline 
          ? <span className="text-success">Online</span>
          : <span className="text-danger">Offline</span>
        }
        

        <button 
          className="btn btn-outline-danger"
          onClick={ startLogout }
        >
            <i className="fas fa-sign-out-alt"></i>
            &nbsp;
            <span>Salir</span>
        </button>
    </div>
  )
}
