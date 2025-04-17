export default function Navbar({ setMode }){
    return(
        <nav className="navbar">
            <h2 className="nav-title">Fine Tuning Helper</h2>
            <a className="nav-anchor" onClick={() => setMode("home")}>Home</a>
        </nav>
    )
}