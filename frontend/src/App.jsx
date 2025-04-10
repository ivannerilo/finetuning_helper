import {useEffect, useState} from 'react'
import {jsonFormater, getCookie} from './utils.js';
import HomeView from './components/HomeView.jsx';
import AcessView from './components/AcessView.jsx';
import EditView from './components/EditView.jsx';
import AppendView from './components/AppendView.jsx';
import CreateBox from './components/CreateBox.jsx';

export default function App() {

    // States -----------
    const [userFiles, setUserFiles] = useState(null)
    const [lineNumber, setLineNumber] = useState(0);
    const [apiData, setApiData] = useState({});
    const [mode, setMode] = useState('home');

    // Effects -----------
    useEffect(() => { // No começo do renderização do componente, ele verifica se o user já tem uma sessionKey.
        let sessionKey = getCookie("sessionKey")
        let csrfToken = getCookie("csrfToken")

        if (!sessionKey || !csrfToken){
            fetch("http://127.0.0.1:8000", {
                method: "GET",
                credentials: 'include'
            })
            .then(response => response.json())
        }
    },[])

    useEffect(() => { // No começo do renderização do componente, ele verifica se o user já tem uma sessionKey.
        fetch("http://127.0.0.1:8000/list", { // Agora o user tendo uma sessionKey, fazemos o fetch para ver quais arquivos ele tem guardado.
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setUserFiles(data.user_files ? data.user_files : null)
            
        })
    },[])

    useEffect(() => {
        if (mode !== "home") {
            console.log(`Irei fazer o fetch no modo: ${mode}`)
            console.log(apiData)
            fetch(`http://127.0.0.1:8000/acess/${apiData.filename}/${lineNumber}`, {
                method: "GET",
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                console.log("Data:")
                console.log(data)
                setApiData(data ? data : null)
                setMode("acess")
            })
            .catch(err => console.log(err));
        }
    },[lineNumber])

    // Functions -----------
    function openFile(fileName){
        fetch(`http://127.0.0.1:8000/acess/${fileName}/${lineNumber}`, {
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data:")
            console.log(data)
            setApiData(data ? data : null)
            setMode("acess")
        })
        .catch(err => console.log(err));
    }

    function changeLineNumber(op) {
        const newLineNumber = op === '+' ? lineNumber + 1: lineNumber - 1;
        const endLineIndex = apiData.filesize - 1;
        if (newLineNumber > endLineIndex) {
            setLineNumber(0);
        }
        else if (newLineNumber < 0) {
            setLineNumber(endLineIndex)
        }
        else {
            setLineNumber(newLineNumber)
        }
    }


    // Handlers ---------
    function handleEdit(event) {
        event.preventDefault()

        fetch(`http://127.0.0.1:8000/edit/${apiData.filename}/${lineNumber}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrfToken")
            },  
            body: JSON.stringify({
                "jsonline": apiData.jsonline
            })
        })

        setMode("acess")
    }

    function handleAppend(event) {
        event.preventDefault()
        const form = event.currentTarget;
        const formData = form.append.value
        const formatedJson = jsonFormater(formData.toString())
        
        fetch(`http://127.0.0.1:8000/append/${apiData.filename}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrfToken")
            },
            body: JSON.stringify({
                "jsonline_string": formatedJson
            })
        })
        .then(response => console.log(response));

        setMode("acess")
    }

    function handleCreate(event) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = form.create.value
        const formatedJson = jsonFormater(formData.toString())
        
        fetch(`http://127.0.0.1:8000/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrfToken")
            },
            body: JSON.stringify({
                "jsonline_string": formatedJson
            })
        })
        .then(response => response.json())
        .then(data => {
            openFile(data.new_file)
            setUserFiles([
                ...userFiles,
                data.new_file
            ])
        });


    }

    function handleChange(name, key, value) {
        console.log(name)
        console.log(value)
        console.log(key)

        function processContent(messageContent, value) {
            if (Array.isArray(messageContent)){
                return [{
                    ...messageContent[0],
                    text: value
                }]
            }
            return value
        }

        setApiData((prev) => { 
            return { 
                ...prev,
                jsonline:{
                    ...prev.jsonline, 
                    messages: prev.jsonline.messages.map((message, index) => { 
                        return index === name ? { 
                            ...message, 
                            content: processContent(message.content, value)
                        } : { 
                            ...message,
                            content: message.content
                        };  
                    })
                }
            }
        })   
    }

    //renderização final.
    switch (mode) {
        case "home":
            return(
                <HomeView
                    apiData={apiData}
                    openFile={openFile}
                    setMode={setMode}
                    userFiles={userFiles}
                ></HomeView>
            )
        case "acess":
            return(
                <AcessView
                    apiData={apiData}
                    lineNumber={lineNumber}
                    setMode={setMode}
                    changeLineNumber={changeLineNumber}
                ></AcessView>
            )
        case "edit":
            return(
                <EditView
                    apiData={apiData}
                    lineNumber={lineNumber}
                    handleChange={handleChange}
                    setMode={setMode}
                    changeLineNumber={changeLineNumber}
                    handleEdit={handleEdit}
                ></EditView>
            )
        case "append":
            return(
                <AppendView
                    handleAppend={handleAppend}
                    setMode={setMode}
                ></AppendView>
            )
        case "create":
            return(
                <CreateBox
                    handleCreate={handleCreate}
                ></CreateBox>
            )
        default:
            return(
                <h1>Erro ao carregar...</h1>
            )
    }

}
