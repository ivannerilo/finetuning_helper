export default function HomeView({userFiles, openFile, setMode, handleDownload, handleDelete, handleRename}) {

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
            if (file !== null) {
                return (
                    <div>
                        <li key={fileId++} onClick={() => openFile(file)}>{file}</li>
                        <button onClick={() => handleDownload(file)}>Download</button>
                        <button onClick={() => handleDelete(file)}>Delete</button>
                        <button onClick={() => openForm(index)}>Rename</button>
                        <form id={index} style={{display: 'none'}} method="post" onSubmit={(event) => handleRename(event, file)}>
                            <input name="new" type="text"></input>
                            <span>.jsonl</span>
                            <button type="submit">Submit</button>
                        </form>
                    </div>
                )
            }
           return <li key={fileId++}>Você não tem arquivos ainda!</li>
        })
    } 
    catch {
        files = <li>Deu b.0 aqui</li>
    }
    return (
        <>
            <h1>O que deseja fazer?</h1>
            <button onClick={() => setMode("create")}>Criar novo JSON</button>
            <button onClick={() => setMode("import")}>Importar arquivo JSON</button>
            <p>Acessar arquivo:</p>
            <ul>
                {files}
            </ul>
        </>
    )
}
