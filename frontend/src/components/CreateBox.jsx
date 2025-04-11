export default function CreateBox({ handleCreate, setMode}){ 
    return(
        <>
            <button onClick={() => setMode("home")}>Home</button>
            <form onSubmit={handleCreate}>
                <label>Coloque seu JSON aqui:</label>
                <textarea
                    rows="50"
                    cols="220"
                    name="create"
                ></textarea>
                <button>Enviar</button>
            </form>
        </>
    )
}