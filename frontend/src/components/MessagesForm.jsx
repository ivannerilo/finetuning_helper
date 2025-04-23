import {useState, useEffect} from 'react';

export default function MessagesBox({text, role, name, handleChange}){
    const [textState, setTextState] = useState(text)
    const [roleState, setRoleState] = useState(role)

    useEffect(() => {
        setTextState(text);
        setRoleState(role);
    }, [text]);

    function changeInputValue(value, key){
        console.log("ChangeInput value:")
        console.log(value)
        setTextState(value)
        handleChange(name, key, value)
    }

    return(
        <div className="message-item">
        <h1>{role}</h1>
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