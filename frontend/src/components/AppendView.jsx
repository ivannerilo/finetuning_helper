export default function AppendView({handleAppend, setMode}){
    return(
        <div className="central-container">
            <h1 className="file-title">Coloque seu JSON aqui:</h1>

            <div className="append-buttons">
                <div className="acess-options-buttons">
                    <button className="acess-json-options-button" onClick={() => setMode("acess")}>View</button>
                    <button className="acess-json-options-button" onClick={() => setMode("edit")}>Edit</button>
                </div>
            </div>

            <div className="create-json">
                <form onSubmit={handleAppend} className="create-json-form">
                    <textarea
                        className="create-json-textarea"
                        rows="20"
                        cols="130"
                        name="append"
                    ></textarea>
                    <button className="submit-form-button">Enviar</button>
                </form>
            </div>

        </div>
    )
}