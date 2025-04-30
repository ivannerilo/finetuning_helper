import {useState, useEffect} from 'react';

export default function ToolsForm({name, parameters, description, id}){
    const [nameState, setNameState] = useState(name)
    const [parametersState, setParametersState] = useState(parameters)
    const [descriptionState, setDescriptionState] = useState(description)

    useEffect(() => {
        setNameState(name);
        setParametersState(parameters);
        setDescriptionState(description)
    }, [name, parameters, description]);

    return(
        <div className="edit-all-item">
            <input className="edit-item-input" defaultValue={nameState} onChange={(event) => setNameState(event.target.value)}></input>
            <textarea 
                className="edit-all-item-textarea"
                name={id}
                defaultValue={parametersState}
                onChange={(event) => setParametersState(event.target.value)}
                rows='10'
                cols='200'
            ></textarea>
            <textarea 
                className="edit-all-item-textarea"
                name={id}
                defaultValue={descriptionState}
                onChange={(event) => setDescriptionState(event.target.value)}
                rows='20'
                cols='200'
            ></textarea>
        </div>
    )
}