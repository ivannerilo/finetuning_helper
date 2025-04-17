import { useState } from "react"

export default function ImportView({ handleImport, setMode}){
    const [fileName, setFileName] = useState("")
    const [file, setFile] = useState(null)
    
    function handleDrop(event){
        event.preventDefault()
        const dropedFile = event.dataTransfer.files[0]
        setFile(dropedFile)
        setFileName(dropedFile.name)
    }

    function handleSubmit(event){
        event.preventDefault()
        if (!file) {
            alert("Nenhum arquivo selecionado.");
            return;
        }
        let formData = new FormData()
        formData.append("file", file)
        handleImport(formData)
    }

    function handleChange(event){
        const inputedFile = event.target.files[0]
        setFile(inputedFile)
        setFileName(inputedFile.name)
    }



    return (
        <div className="central-container">

        <h1 className="file-title">Importar arquivos:</h1>

        <div className="import-file">
            <form className="import-file-form" method="post" onSubmit={(event) => handleSubmit(event)}>
                <div className="import-file-input" onDrop={handleDrop} onDragOver={(e) => e.preventDefault()}>
                    <label htmlFor="file-input" id="file-input-label">
                        {fileName ? `Arquivo ${fileName} selecionado.` : "Clique ou solte o arquivo JSONL aqui:" }
                    </label>
                </div>
                <input id="file-input" type="file" name="file" onChange={handleChange}></input>
                <button className="import-file-button" type="submit">Enviar arquivo</button>
            </form>
        </div>

        <div className="file-options-container">
            <button title="Criar JSON" className="file-options-container-button" onClick={() => setMode("create")}>Criar um novo JSON</button>
            <button title="Importar JSON" className="file-options-container-button" onClick={() => setMode("import")}>Importar um arquivo JSON</button>
        </div>

        </div>

    )



}