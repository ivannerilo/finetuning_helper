export default function MessagesBox(props){
    return(
        <>
            <h1>{props.role}</h1>
            <textarea 
                name={props.name}
                value={props.text}
                rows='20'
                cols='200'
            ></textarea>
        </>
    )
}