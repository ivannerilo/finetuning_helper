import {useState, useEffect} from 'react';

export default function MessagesBox({text, role, id, handleChange}){
    const [textState, setTextState] = useState(text)
    const [roleState, setRoleState] = useState(role)

    useEffect(() => {
        setTextState(text);
        setRoleState(role);
    }, [text, role]);

    return(
        <div className="message-item">
        <input className="edit-item-input" defaultValue={roleState} onChange={(event) => handleChange(`jsonline.messages[${id}].role`, event.target.value)}></input>
        <textarea 
            className="edit-item-textarea"
            name={id}
            defaultValue={textState}
            onChange={(event) => handleChange(`jsonline.messages[${id}].content`, event.target.value)}
            rows='20'
            cols='200'
        ></textarea>
        </div>
    )
}