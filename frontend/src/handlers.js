import { getCookie } from "./utils"

export function handleEdit(event, apiData, lineNumber, setMode) {
    event.preventDefault()

    fetch(`http://127.0.0.1:8000/edit/${apiData.filename}/${lineNumber}`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFtoken": getCookie("csrftoken")
        },  
        body: JSON.stringify({
            "jsonline": apiData.jsonline
        })
    })

    setMode("acess")
}

export function handleAppend(event) {
    event.preventDefault()
    const form = event.currentTarget;
    const formData = form.append.value
    const formatedJson = jsonFormater(formData.toString())
    
    fetch(`http://127.0.0.1:8000/append/${apiData.filename}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFtoken": getCookie("csrftoken")
        },
        body: JSON.stringify({
            "jsonline_string": formatedJson
        })
    })
    .then(response => console.log(response));

    setMode("acess")
}

export function handleCreate(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = form.create.value
    const formatedJson = jsonFormater(formData.toString())
    
    fetch(`http://127.0.0.1:8000/create`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFtoken": getCookie("csrftoken")
        },
        body: JSON.stringify({
            "jsonline_string": formatedJson
        })
    })
    .then(response => response.json())
    .then(data => {
        openFile(data.new_file)
        setUserFiles([
            ...userFiles,
            data.new_file
        ])
    });


}

export function handleChange(name, key, value) {
    console.log(name)
    console.log(value)
    console.log(key)

    function processContent(messageContent, value) {
        if (Array.isArray(messageContent)){
            return [{
                ...messageContent[0],
                text: value
            }]
        }
        return value
    }

    setApiData((prev) => { 
        return { 
            ...prev,
            jsonline:{
                ...prev.jsonline, 
                messages: prev.jsonline.messages.map((message, index) => { 
                    return index === name ? { 
                        ...message, 
                        content: processContent(message.content, value)
                    } : { 
                        ...message,
                        content: message.content
                    };  
                })
            }
        }
    })   
}

export function handleImport(event){
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)       
    fetch("http://127.0.0.1:8000/import", {
        method: "POST",
        credentials: 'include',
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: formData
    })
    .then(response => {
        window.location.reload()
    })
}

export function handleDownload(fileName){
    fetch(`http://127.0.0.1:8000/drd/${fileName}`, {
        method: "GET",
        credentials: 'include'
    })
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${fileName}`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    })
}

export function handleRename(event, fileName){
    event.preventDefault()

    const form = event.currentTarget
    const formData = form.new.value
    const new_name = `${formData}.jsonl`

    console.log("Eu escrevi ", formData)
    fetch(`http://127.0.0.1:8000/drd/${fileName}`, {
        method: "POST",
        credentials: 'include',
        headers: {
            "X-CSRFtoken": getCookie("csrftoken"),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            "newname": new_name,
        })
    })
    .then(response => {
        window.location.reload()
    })
}

export function handleDelete(fileName){
    fetch(`http://127.0.0.1:8000/drd/${fileName}`, {
        method: "DELETE",
        credentials: 'include',
        headers: {
            "X-CSRFtoken": getCookie("csrftoken")
        }
    })
    .then(response => {
        window.location.reload()
    })
}