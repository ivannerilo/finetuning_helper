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
        <div className="central-container">
            <h1>Line: {lineNumber}</h1>
            <div className="acess-buttons">
                <div className="acess-options-buttons">
                    <button className="acess-json-options-button" onClick={() => setMode("acess")}>View</button>
                    <button className="acess-json-options-button" onClick={() => setMode("append")}>Append</button>
                </div>
            </div>
            <form onSubmit={handleEdit}>
                {messagesForm ? messagesForm : "Carregando..."}
                <button type='submit' className="submit-form-button">Edit</button>
            </form>
        </div>
    )
}