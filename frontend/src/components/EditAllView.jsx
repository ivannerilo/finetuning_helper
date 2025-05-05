import {useState} from 'react'
import ToolsForm from '../components/ToolsForm'

export default function EditView({apiData, lineNumber, handleEditAllSystem, handleEditAllTools, handleChangeTools, setMode}){

    const [system, setSystem] = useState(Array.isArray(apiData.jsonline.messages[0].content) ? apiData.jsonline.messages[0].content[0].text : apiData.jsonline.messages[0].content)
    
    let toolsForms = [];
    if (apiData && apiData.jsonline && apiData.jsonline.tools) {
        let id = 0;
        toolsForms = apiData.jsonline.tools.map(tool => {
            const comp = <ToolsForm
                name={tool.function.name}
                properties={tool.function.parameters.properties}
                description={tool.function.description}
                handleChangeTools={handleChangeTools}
                id={id++}
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
            <form onSubmit={(event) => handleEditAllSystem(event)}>
                <div className="edit-all-item">
                    <span className="edit-item-input">{apiData.jsonline.messages[0].role}</span>
                    <textarea 
                        className="edit-item-textarea"
                        name={"system"}
                        defaultValue={system}
                        onChange={(event) => setSystem(event.currentTarget.value)}
                        rows='20'
                        cols='200'
                    ></textarea>
                </div>
                <button type='submit' className="submit-form-button">Edit</button>
            </form>
            <form onSubmit={event => handleEditAllTools(event)}>
                <h1 className='edit-all-item-tool-h1 '> Tools </h1>
                {toolsForms ? toolsForms : "Carregando..."}
                <button type='submit' className="submit-form-button">Edit</button>
            </form>
        </div>  
    )
}