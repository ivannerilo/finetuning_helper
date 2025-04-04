import MessagesBox from "./MessagesBox";


export default function AcessView({apiData, lineNumber, setMode, changeLineNumber}){
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
                <button onClick={() => setMode("home")}>Home</button>
            </div>
            <div>
                <button onClick={() => changeLineNumber('-')}>Back</button>
                <button onClick={() => changeLineNumber('+')}>Next</button>                
            </div>
            {messagesComponents ? messagesComponents.slice(1) : "Carregando..."}
        </div>
    )
}