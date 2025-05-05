import {useEffect, useState} from 'react'
import {jsonFormater, getCookie} from './utils.js';
import set from 'lodash/set'

import HomeView from './components/HomeView.jsx';
import AcessView from './components/AcessView.jsx';
import EditView from './components/EditView.jsx';
import EditAllView from "./components/EditAllView.jsx"
import AppendView from './components/AppendView.jsx';
import CreateBox from './components/CreateBox.jsx';
import ImportView from './components/ImportView.jsx';
import Navbar from './components/Navbar.jsx';

export default function App() {

    // States -----------
    const [userFiles, setUserFiles] = useState(null)
    const [lineNumber, setLineNumber] = useState(0);
    const [apiData, setApiData] = useState({});
    const [mode, setMode] = useState('home');
    const [tools, setTools] = useState({})

    // Effects -----------
    useEffect(() => { // No começo do renderização do componente, ele verifica se o user já tem uma sessionKey.
        const sessionId = getCookie("sessionid")

        if (!sessionId){
            fetch("http://localhost:8000", {
                method: "GET",
                credentials: 'include'
            })
            .then(response => response.json())
        }
    },[])

    useEffect(() => { // No começo do renderização do componente, ele verifica se o user já tem uma sessionKey.
        fetch("http://localhost:8000/list", { // Agora o user tendo uma sessionKey, fazemos o fetch para ver quais arquivos ele tem guardado.
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
            fetch(`http://localhost:8000/acess/${apiData.filename}/${lineNumber}`, {
                method: "GET",
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => {
                setApiData(data ? data : null)
                setTools(data ? data.jsonline.tools : null)
                setMode("acess")
            })
            .catch(err => console.log(err));
        }
    },[lineNumber])

    // Functions -----------
    function openFile(fileName){
        setLineNumber(0)
        fetch(`http://localhost:8000/acess/${fileName}/${lineNumber}`, {
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data:")
            console.log(data)
            setApiData(data ? data : null)
            setTools(data ? data.jsonline.tools : null)
            console.log("Tools:")
            console.log(data.jsonline.tools)
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

        fetch(`http://localhost:8000/edit/${apiData.filename}/${lineNumber}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrftoken")
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
        
        fetch(`http://localhost:8000/append/${apiData.filename}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrftoken")
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
        
        fetch(`http://localhost:8000/create`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrftoken")
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
            window.location.reload()
        });


    }

    function handleChange(path, value) {
        let copy = {...apiData}
        set(copy, path, value)
        setApiData(copy)
    }

    function handleEditAllSystem(event) {
        event.preventDefault()
        const form = event.currentTarget
        const formData = new FormData(form)

        const system = formData.get("system")
        fetch(`http://localhost:8000/editall/${apiData.filename}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrftoken")
            },  
            body: JSON.stringify({
                "key": "system",
                "new_value": system
            })
        })
        .then(response => {
            window.location.reload()
        })
        console.log(system)

    }

    function handleEditAllTools(event) {
        event.preventDefault()

        fetch(`http://localhost:8000/editall/${apiData.filename}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFtoken": getCookie("csrftoken")
            },  
            body: JSON.stringify({
                "key": "tools",
                "new_value": tools
            })
        })
        .then(response => {
            window.location.reload()
        })
        console.log(tools)
    }

    function handleChangeTools(path, value) {
        let copy = [...tools]
        try {
            set(copy, path, value.json())
        } catch {
            set(copy, path, value)
        }
        setTools(copy)
        console.log(copy)
    }
    

    function handleImport(formData){ 
        fetch("http://localhost:8000/import", {
            method: "POST",
            credentials: 'include',
            headers: {
                "X-CSRFToken": getCookie("csrftoken"),
            },
            body: formData
        })
        .then(response => {
            window.location.reload()
        })
    }

    function handleDownload(fileName){
        fetch(`http://localhost:8000/drd/${fileName}`, {
            method: "GET",
            credentials: 'include'
        })
        .then(response => response.blob())
        .then(blob => {
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${fileName}`
            document.body.appendChild(a)
            a.click()
            a.remove()
            URL.revokeObjectURL(url)
        })
    }

    function handleRename(event, fileName){
        event.preventDefault()

        const form = event.currentTarget
        const formData = form.new.value
        const new_name = `${formData}.jsonl`

        console.log("Eu escrevi ", formData)
        fetch(`http://localhost:8000/drd/${fileName}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "X-CSRFtoken": getCookie("csrftoken"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                "newname": new_name,
            })
        })
        .then(response => {
            window.location.reload()
        })
    }

    function handleDelete(fileName){
        fetch(`http://localhost:8000/drd/${fileName}`, {
            method: "DELETE",
            credentials: 'include',
            headers: {
                "X-CSRFtoken": getCookie("csrftoken")
            }
        })
        .then(response => {
            window.location.reload()
        })
    }
    
    //renderização final.
    switch (mode) {
        case "home":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <HomeView
                        apiData={apiData}
                        openFile={openFile}
                        setMode={setMode}
                        userFiles={userFiles}
                        handleDownload={handleDownload}
                        handleRename={handleRename}
                        handleDelete={handleDelete}
                    />
                </div>
            )
        case "import":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <ImportView
                        handleImport={handleImport}
                        setMode={setMode}
                    />
                </div>
            )
        case "acess":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <AcessView
                        apiData={apiData}
                        lineNumber={lineNumber}
                        setMode={setMode}
                        changeLineNumber={changeLineNumber}
                    />
                </div>
            )
        case "edit":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <EditView
                        apiData={apiData}
                        lineNumber={lineNumber}
                        handleChange={handleChange}
                        setMode={setMode}
                        handleEdit={handleEdit}
                    />
                </div>
            )
        case "append":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <AppendView
                        handleAppend={handleAppend}
                        setMode={setMode}
                    />
                </div>
            )
        case "create":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <CreateBox
                        handleCreate={handleCreate}
                        setMode={setMode}
                    />
                </div>
            )

        case "edit-all":
            return(
                <div className="external-container">
                    <Navbar
                        setMode={setMode}
                    />
                    <EditAllView
                        apiData={apiData}
                        lineNumber={lineNumber}
                        setMode={setMode}
                        handleEditAllSystem={handleEditAllSystem}
                        handleChangeTools={handleChangeTools}
                        handleEditAllTools={handleEditAllTools}
                    />
                </div>
            )
        default:
            return(
                <h1>Erro ao carregar...</h1>
            )
    }

}
