import {useState, useEffect} from 'react';

export default function MessagesBox({text, role, name, handleChange}){
    const [textState, setTextState] = useState(text)
    const [roleState, setRoleState] = useState(role)

    useEffect(() => {
        setTextState(text);
        setRoleState(role);
    }, [text, role]);

    function changeInputValue(value, key){
        switch (key) {
            case "content":
                setTextState(value)
                handleChange(name, roleState, value)
                break

            case "role":
                setRoleState(value)
                handleChange(name, value, textState)
                break

            default:
                console.log("Invalid Key")
                break
        }
    }

    return(
        <div className="message-item">
        <input className="edit-item-input" defaultValue={roleState} onChange={(event) => changeInputValue(event.target.value, "role")}></input>
        <textarea 
            className="edit-item-textarea"
            name={name}
            defaultValue={textState}
            onChange={(event) => changeInputValue(event.target.value, "content")}
            rows='20'
            cols='200'
        ></textarea>
        </div>
    )
}