export default function CreateBox({ handleCreate, setMode}){ 
    return(
        <div className="central-container">
            <h1 className="file-title">Coloque seu JSON aqui:</h1>
            <div className="create-json">
                <form onSubmit={handleCreate} className="create-json-form">
                    <textarea
                        className="create-json-textarea"
                        rows="20"
                        cols="130"
                        name="create"
                    ></textarea>
                    <button className="submit-form-button">Enviar</button>
                </form>
            </div>

            <div className="file-options-container">
                <button title="Criar JSON" className="file-options-container-button" onClick={() => setMode("create")}>Criar um novo JSON</button>
                <button title="Importar JSON" className="file-options-container-button" onClick={() => setMode("import")}>Importar um arquivo JSON</button>
            </div>

        </div>
    )
}