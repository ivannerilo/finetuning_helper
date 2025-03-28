
document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:8000/acess/treinamento_final31.jsonl/0", {
        method: "GET",
        credentials: "include"
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        messages = data.jsonline.messages.map(message => {
            if (message.constructor === Array){
                return `<h3>${message.role}</h3>\n<p>${message.content[1].text}</p>`
            }
            return `<h3>${message.role}</h3>\n<p>${message.content}</p>`
        })
        document.getElementById("root").innerHTML = messages;

    })
    .catch(error => {
        document.getElementById("root").innerHTML = `Error: ${error.message}`;
    });
});