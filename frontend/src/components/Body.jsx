import Navbar from './Navbar.jsx';

export default function Body({setMode}){
    return(
        <div className="body">
            <Navbar
                setMode={setMode}
            />
        </div>
    )
}