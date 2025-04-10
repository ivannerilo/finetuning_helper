export default function HomeView({userFiles, openFile, setMode}) {
    let files; 
    try {
        let fileId = 0
        files = userFiles.map(file => {
            if (file !== null) {
                return <li key={fileId++} onClick={() => openFile(file)}>{file}</li>
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
            <button>Importar arquivo JSON</button>
            <p>Acessar arquivo:</p>
            <ul>
                {files}
            </ul>
        </>
    )
}
