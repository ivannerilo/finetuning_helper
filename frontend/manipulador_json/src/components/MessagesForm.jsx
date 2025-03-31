import {useState, useEffect} from 'react';

export default function MessagesBox({text, role, name, handleChange}){
    const [textState, setTextState] = useState(text)

    useEffect(() => {
        setTextState(text);
    }, [text]);

    const changeInputValue = (value) => {
        console.log("ChangeInput value:")
        console.log(value)
        setTextState(value)
        handleChange(name, value)
    }

    return(
        <>
            <h1>{role}</h1>
            <span>{name}</span>
            <textarea 
                name={name}
                onChange={(event) => changeInputValue(event.target.value)}
                defaultValue={textState}
                rows='20'
                cols='200'
            ></textarea>
        </>
    )
}