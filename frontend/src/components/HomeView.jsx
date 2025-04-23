export default function HomeView({userFiles, openFile, handleDownload, handleDelete, handleRename, setMode}) {

    function openForm(index){
        const form = document.getElementById(index)
        if (form.style.display === 'none'){
            form.style.display = 'block'
        } else {
            form.style.display = 'none'
        }
    }

    let files; 
    try {
        let fileId = 0
        files = userFiles.map((file, index)=> {
            return (
                <div className="file-item">

                    <div className="file-item-central-div">
                        <span key={fileId++} onClick={() => openFile(file)}>{file}</span>

                        <div className="file-item-buttons">
                            <button title="Download" className="file-item-buttons-download-button" onClick={() => handleDownload(file)}></button>
                            <button title="Delete" className="file-item-buttons-delete-button" onClick={() => handleDelete(file)}></button>
                            <button title="Rename" className="file-item-buttons-rename-button" onClick={() => openForm(index)}></button>
                        </div>
                    </div>

                    <div className="file-item-form-div">
                        <form id={index} style={{display: 'none'}} method="post" onSubmit={(event) => handleRename(event, file)}>
                            <div className="file-item-form">
                                <input name="new" type="text"></input>
                                <span>.jsonl</span>
                                <button type="submit" className="file-item-form-button" >Submit</button>
                            </div>
                        </form>
                    </div>

                </div>
            )
        })
    } 
    catch {
        files = <h3>Você não tem arquivos ainda!</h3>
    }
    return (
        <div className="central-container">

            <h1 className="file-title">Acessar arquivo:</h1>
            <div className="file-list">
                {files}
            </div>

            <div className="file-options-container">
                <button title="Criar JSON" className="file-options-container-button" onClick={() => setMode("create")}>Criar um novo JSON</button>
                <button title="Importar JSON" className="file-options-container-button" onClick={() => setMode("import")}>Importar um arquivo JSON</button>
            </div>

        </div>
    )
}
