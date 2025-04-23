export default function MessagesBox(props){
    return(
        <div className="message-item">
            <h1>{props.role}</h1>
            <textarea 
                className="message-item-textarea"
                name={props.name}
                value={props.text}
                rows='20'
                cols='200'
                readOnly={true}
            ></textarea>
        </div>
    )
}