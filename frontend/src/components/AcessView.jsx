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
        <div className="central-container">
            <h1>Line: {lineNumber}</h1>
            <div className="acess-buttons">

                <div className="acess-options-buttons">
                    <button className="acess-json-options-button" onClick={() => setMode("edit")}>Edit</button>
                    <button className="acess-json-options-button" onClick={() => setMode("append")}>Append</button>
                    <button className="acess-json-options-button" onClick={() => setMode("edit-all")}>Edit All</button>
                </div>

                <div className="acess-back-next-buttons">
                    <button className="acess-json-options-button" onClick={() => changeLineNumber('-')}> ⬅️ Back</button>
                    <button className="acess-json-options-button" onClick={() => changeLineNumber('+')}>Next ➡️ </button>                
                </div>
            </div>
            {messagesComponents ? messagesComponents.slice(1) : "Carregando..."}
        </div>
    )
}