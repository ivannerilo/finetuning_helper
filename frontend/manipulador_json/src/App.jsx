import React from 'react'
import MessagesBox from './components/MessagesBox.jsx';
import MessagesForm from './components/MessagesForm.jsx';

export default function App() {
    const [lineNumber, setLineNumber] = React.useState(0);
    const [apiData, setApiData] = React.useState({});
    const [mode, setMode] = React.useState('view');

    React.useEffect(() => {
        fetch(`http://127.0.0.1:8000/acess/treinamento_final31.jsonl/${lineNumber}`, {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            console.log("Data:")
            console.log(data)
            setApiData(data ? data : null)
        })
        .catch(err => console.log(err));
    }, [lineNumber]);

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

        fetch(`http://127.0.0.1:8000/edit/treinamento_final31.jsonl/${lineNumber}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "jsonline": apiData.jsonline
            })
        })
    }

    function handleChange(name, value) {
        console.log(name)
        console.log(value)
        setApiData((prev) => {
            return {
                ...prev,
                jsonline:{
                    ...prev.jsonline,
                    messages: prev.jsonline.messages.map((message, index) => {
                        return index === name ? value : message; // verificar se é content - text ou só content e quando tiver uma mudança só mudar o content / text.
                    })
                }
            }
        })   
    }

    //renderização final.
    switch (mode) {
        case "view":
            let messagesComponents = [];
            if (apiData && apiData.jsonline && apiData.jsonline.messages) {
                messagesComponents = apiData.jsonline.messages.map(message => {
                    const comp = <MessagesBox 
                        text={Array.isArray(message.content) ? message.content[0].text : message.content}
                        role={message.role}
                    />
                    return comp;
                })
            }
            return(
                <div>
                    <h1>Line: {lineNumber}</h1>
                    <div>
                        <button onClick={() => setMode("edit")}>Edit</button>
                        <button onClick={() => setMode("append")}>Append</button>
                    </div>
                    <div>
                        <button onClick={() => changeLineNumber('-')}>Back</button>
                        <button onClick={() => changeLineNumber('+')}>Next</button>                
                    </div>
                    {messagesComponents ? messagesComponents.slice(1) : "Carregando..."}
                </div>
            )
        case "edit":
            let messagesForm = [];
            if (apiData && apiData.jsonline && apiData.jsonline.messages) {
                let id = 0;
                messagesForm = apiData.jsonline.messages.map(message => {
                    const comp = <MessagesForm
                        text={Array.isArray(message.content) ? message.content[0].text : message.content}
                        role={message.role}
                        name={id++} // ++ no java script passa o valor e depois incrementa ele.
                        handleChange={handleChange}
                    />
                    return comp;
                })
            }
            
            return(
                <div>
                    <h1>Line: {lineNumber}</h1>
                    <div>
                        <button onClick={() => setMode("view")}>View</button>
                        <button onClick={() => setMode("append")}>Append</button>
                    </div>
                    <div>
                        <button onClick={() => changeLineNumber('-')}>Back</button>
                        <button onClick={() => changeLineNumber('+')}>Next</button>                
                    </div>
                    <form onSubmit={handleEdit}>
                        {messagesForm ? messagesForm : "Carregando..."}
                        <button type='submit'>Edit</button>
                    </form>
                </div>
            )
        case "append":
            return(
                <div>
                    <div>
                        <button onClick={() => setMode("view")}>View</button>
                        <button onClick={() => setMode("edit")}>Edit</button>
                    </div>
                    <p>Append</p>
                </div>
            )
        default:
            return(
                <h1>Erro ao carregar...</h1>
            )
    }

}
