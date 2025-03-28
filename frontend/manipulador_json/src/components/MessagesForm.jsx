import {useState} from 'react';

export default function MessagesBox({text, role, name, onChange}){
    const [textState, setTextState] = useState(text)

    return(
        <>
            <h1>{role}</h1>
            <textarea 
                name={name}
                onChange={(event) => onChange(event.target.value)}
                value={textState}
                rows='20'
                cols='200'
            ></textarea>
        </>
    )
}