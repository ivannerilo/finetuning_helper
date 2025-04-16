export default function HomeView({userFiles, openFile, handleDownload, handleDelete, handleRename}) {

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

                    <span key={fileId++} onClick={() => openFile(file)}>{file}</span>

                    <div className="file-item-buttons">
                        <button title="Download" className="file-item-buttons-download-button" onClick={() => handleDownload(file)}></button>
                        <button title="Delete" className="file-item-buttons-delete-button" onClick={() => handleDelete(file)}></button>
                        <button title="Rename" className="file-item-buttons-rename-button" onClick={() => openForm(index)}></button>
                    </div>

                    <div className="file-item-form">
                        <form id={index} style={{display: 'none'}} method="post" onSubmit={(event) => handleRename(event, file)}>
                            <input name="new" type="text"></input>
                            <span>.jsonl</span>
                            <button type="submit">Submit</button>
                        </form>
                    </div>

                </div>
            )
        })
    } 
    catch {
        files = <span className="file-item">Você não tem arquivos ainda!</span>
    }
    return (
        <div className="file-container">
            <h1 className="file-title">Acessar arquivo:</h1>
            <div className="file-list">
                {files}
            </div>
        </div>
    )
}
