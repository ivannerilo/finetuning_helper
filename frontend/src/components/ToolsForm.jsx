export default function ToolsForm({name, properties, description, handleChangeTools, id}){

    function changeNameState(value, id){
        handleChangeTools(`[${id}].function.name`, value)
    }

    function changePropertiesState(value, id){
        console.log(value)
        try {
            handleChangeTools(`[${id}].function.parameters.properties`, JSON.parse(value))
        } catch{
            handleChangeTools(`[${id}].function.parameters.properties`, value)
        }
    }

    function changeDescriptionState(value, id){
        handleChangeTools(`[${id}].function.description`, value)
    }

    return(
        <div className="edit-all-item">
            <input className="edit-item-input" defaultValue={name} onChange={(event) => changeNameState(event.target.value, id)} name={`name${id}`}></input>
            <textarea 
                className="edit-all-item-textarea"
                name={`properties${id}`}
                defaultValue={JSON.stringify(properties)}
                onChange={(event) => changePropertiesState(event.target.value, id)}
                rows='30'
                cols='200'
            ></textarea>
            <textarea 
                className="edit-all-item-textarea"
                name={`description${id}`}
                defaultValue={description}
                onChange={(event) => changeDescriptionState(event.target.value, id)}
                rows='20'
                cols='200'
            ></textarea>
        </div>
    )
}