import MessagesForm from "./MessagesForm"

export default function EditView({apiData, lineNumber, handleChange, setMode, changeLineNumber, handleEdit}){
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
                <button onClick={() => setMode("acess")}>View</button>
                <button onClick={() => setMode("append")}>Append</button>
                <button onClick={() => setMode("home")}>Home</button>
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
}