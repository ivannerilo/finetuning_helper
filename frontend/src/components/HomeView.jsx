export default function HomeView({userFiles, openFile}){
    try{
        let fileId = 0;
        const files = userFiles.map(file => {
            if (file !== null){
                return <li key={fileId++} onClick={() => openFile(file)}>{file}</li>
            }
            return "Você não tem arquivos ainda!"
        })
        return(
            <>
                <h1>O que deseja fazer?</h1>
                <button>Criar novo JSON</button>
                <p>Acessar arquivo:</p>
                <ul>
                    {files}
                </ul>
            </>
        )
    }
    catch{
        return(
            <>
                <h1>O que deseja fazer?</h1>
                <button>Criar novo JSON</button>
                <p>Acessar arquivo:</p>
                <ul>
                    No files Found.
                </ul>
            </>
        )
    }
}