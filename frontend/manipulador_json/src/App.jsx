import React from 'react'
import {jsonFormater, getCookie} from './utils.js';
import HomeView from './components/HomeView.jsx';
import AcessView from './components/AcessView.jsx';
import EditView from './components/EditView.jsx';
import AppendView from './components/AppendView.jsx';

export default function App() {
    const [userFiles, setUserFiles] = React.useState(null)
    const [lineNumber, setLineNumber] = React.useState(0);
    const [apiData, setApiData] = React.useState({});
    const [mode, setMode] = React.useState('home');

    React.useEffect(() => { // No começo do renderização do componente, ele verifica se o user já tem uma sessionKey.
        let sessionKey = getCookie("sessionKey")
        let csrfToken = getCookie("csrfToken")

        if (!sessionKey || !csrfToken){ // Caso o user não tiver, ele faz uma solicitação para o servidor para criar uma e a armazena no localStorage.
            fetch("http://127.0.0.1:8000", {
                method: "GET",
                credentials: 'include'
            })
            .then(response => response.json())
        }

        fetch("http://127.0.0.1:8000/list", { // Agora o user tendo uma sessionKey, fazemos o fetch para ver quais arquivos ele tem guardado.
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setUserFiles(data.user_files ? data.user_files : null)
            
        })
    },[])

    React.useEffect(() => {
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
    }

    function handleChange(name, key, value) {
        console.log(name)
        console.log(value)
        console.log(key)

        function processContent(messageContent, value) {
            if (Array.isArray(messageContent)){
                return messageContent.content.map(contentDict => {
                    return{
                        ...contentDict,
                        text: value
                    }
                })
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
        default:
            return(
                <h1>Erro ao carregar...</h1>
            )
    }

}
