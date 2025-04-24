import bot from "../static-icons/bot.png"

export default function Navbar({ setMode }){
    return(
        <nav className="navbar">
            <img src={bot} width="50px" style={{ filter: "invert(1)"}}></img>
            <h2 className="nav-title">Fine Tuning Helper</h2>
            <a className="nav-anchor" onClick={() => setMode("home")}>Home</a>
        </nav>
    )
}