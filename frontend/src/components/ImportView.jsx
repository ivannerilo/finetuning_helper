export default function ImportView({ handleImport }){
    return (
        <div>
            <h1>Import</h1>
            <form method="post" onSubmit={(event) => handleImport(event)}>
                <input type="file" name="file"></input>
                <button type="submit">Enviar arquivo</button>
            </form>
        </div>
    )
}