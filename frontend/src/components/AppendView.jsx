export default function AppendView({handleAppend, setMode}){
    return(
        <div>
            <div>
                <button onClick={() => setMode("acess")}>View</button>
                <button onClick={() => setMode("edit")}>Edit</button>
                <button onClick={() => setMode("home")}>Home</button>
            </div>
            <form onSubmit={handleAppend}>
                <label>Coloque seu JSON aqui:</label>
                <textarea
                    rows="50"
                    cols="220"
                    name="append"
                ></textarea>
                <button>Enviar</button>
            </form>
        </div>
    )
}