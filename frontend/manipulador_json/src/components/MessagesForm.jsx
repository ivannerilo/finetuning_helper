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
        <>
            <h1>{role}</h1>
            <span>{name}</span>
            <textarea 
                name={name}
                onChange={(event) => changeInputValue(event.target.value, "content")}
                defaultValue={textState}
                rows='20'
                cols='200'
            ></textarea>
        </>
    )
}