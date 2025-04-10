export function jsonFormater(jsonString){
    try {
        let jsonDict = JSON.parse(jsonString);
        return JSON.stringify(jsonDict);
    } catch (error) {
        let pattern = /response_format=\s*{\s*"type":\s*"text"\s*},?/g;
        let pattern2 = /,\s*"additionalProperties": False?/g;

        jsonString = jsonString.replace("messages=", '{"messages": ');
        jsonString = jsonString.replace(pattern, '');
        jsonString = jsonString.replace(pattern2, '');
        jsonString = jsonString.replace('tools=', '"tools": ');
        jsonString = jsonString.replace('"strict": False,', "");
        jsonString = jsonString.replace('"strict": True,', "");
        jsonString = jsonString + '}';
        
        let jsonDict = JSON.parse(jsonString);
        console.log(jsonDict);

        jsonDict.messages.forEach(message => {
            if (Array.isArray(message.content) && message.role === "tool") {
                message.content = message.content[0].text;
            }
            if (!Array.isArray(message.content)) {
                message.content = [{ type: "text", text: `${message.content}` }];
            }
        });

        return JSON.stringify(jsonDict);
    }
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
