export default function Navbar({ setMode }){
    return(
        <nav className="navbar">
            <a className="nav-anchor" onClick={() => setMode("create")}>Criar novo JSON</a>
            <a className="nav-anchor" onClick={() => setMode("import")}>Importar arquivo JSON</a>
        </nav>
    )
}