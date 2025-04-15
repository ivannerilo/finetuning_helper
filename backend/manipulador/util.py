import json 
import re
import random
import string
import os
from .models import FileUser

DEFAULT_FILE_ROUTE = "json_files/files/" 
# UPLOAD_TO = "files/"


def json_reader(line_number, file_name):
    with open(f"{DEFAULT_FILE_ROUTE}{file_name}", "r") as file:
        json_files = list(file)
        json_file = json.loads(json_files[line_number])
        return json_file

def file_reader(file_name):
    with open(f"{DEFAULT_FILE_ROUTE}{file_name}", "r") as file:
        json_file = file.read()
        return json_file

def delete_file(file_name):
    path = DEFAULT_FILE_ROUTE + file_name
    os.remove(path)


def json_writer(json_dict, file_name, function):
    file_path = f"{DEFAULT_FILE_ROUTE}{file_name}"
    if function == 'w' and os.path.exists(file_path):
        open(file_path, 'w').close()
    with open(file_path, f"{function}", encoding="utf-8") as file:
        file.write(json.dumps(json_dict, ensure_ascii=False)+ '\n')
        file.flush()

def json_appender(json_dict, file_name):
    file_path = f"{file_name}"
    with open(file_path, 'a', encoding="utf-8") as file:
        file.write('\n' + "")
        file.flush()

def json_file_editor(json_dict, line_number, file_name):
    with open(f"{DEFAULT_FILE_ROUTE}{file_name}", "r") as file_read:
        json_files = list(file_read)
        with open(f"{DEFAULT_FILE_ROUTE}{file_name}", "w", encoding="utf-8") as file_write:
            for i in range(len(json_files)):
                if i == line_number:
                    file_write.write(json.dumps(json_dict, ensure_ascii=False)+ '\n')
                else:
                    jsonzinho = json.loads(json_files[i].strip())
                    file_write.write(json.dumps(jsonzinho, ensure_ascii=False)+ '\n')

# def delete_jsonfile(file_name):
#     file_path = os.path.join(DEFAULT_FILE_ROUTE, file_name)
#     os.remove(path)
#     f = FileUser.objects.get(file_name=file_name)
#     f.delete()

def random_file_name_gen():
    n = 10
    random_string = ''.join(random.choice(string.ascii_uppercase + string.digits) for _ in range(n))
    return f"{random_string}.jsonl"
         
def json_file_size(file_name):
    with open(f"{DEFAULT_FILE_ROUTE}{file_name}","r") as f:
        jsonfiles = list(f)
        return len(jsonfiles)

def json_renamer(file_user, new_name):
    print(f"O caminho do arquivo é {file_user.file.path}")
    caminho_antigo = file_user.file.path
    pasta = os.path.dirname(caminho_antigo)
    caminho_novo = os.path.join(pasta, new_name)

    os.rename(caminho_antigo, caminho_novo)

    file_user.file.name = os.path.join('files', new_name)
    file_user.file_name = new_name
    file_user.save()



    






# Formatadores ----
# def json_formater(json_string):
#     try:
#         json_dict = json.loads(json_string)
#     except:    
#         pattern = r'response_format=\s*{\s*"type":\s*"text"\s*},?'
#         pattern2 = r',\s*"additionalProperties": False?'
#         json_string = json_string.replace("messages=", '{"messages": ')
#         json_string = re.sub(pattern, '', json_string)
#         json_string = re.sub(pattern2, '', json_string)
#         json_string = json_string.replace('tools=', '"tools": ')
#         json_string = json_string.replace('"strict": False,', "")
#         json_string = json_string.replace('"strict": True,', "")
#         json_string = json_string + '}'
#         json_dict = json.loads(json_string)
#         print(json_dict)
#     for messages in json_dict["messages"]:
#         if isinstance(messages["content"], list) and messages["role"] == "tool":
#             messages["content"] = messages["content"][0]["text"]
#         if not isinstance(messages["content"], list):
#             type_demonio = [{"type": "text", "text": f"{messages['content']}" }]
#             messages["content"] = type_demonio
#     json_string = json.dumps(json_dict)
#     return json_string


# def formatador_html(json_dict):
#     lista_json_formatado = []
#     for messages in json_dict["messages"]:
#         if isinstance(messages["content"], list):
#             content =  f"""
#                 <div>
#                     <p><strong>{messages["role"]}</strong></p>
#                     <textarea rows="10", cols="220">{messages["content"][0]["text"]}</textarea>
#                 </div>
#             """
#             lista_json_formatado.append(content)
#         else:
#             content =  f"""
#                 <div>
#                     <p><strong>{messages["role"]}</strong></p>
#                     <textarea rows="10", cols="220">{messages["content"]}</textarea>
#                 </div>
#             """
#             lista_json_formatado.append(content)
#     return lista_json_formatado


# def formatador_formulario(json_dict):
#     lista_json_formatado = []
#     id = 0
#     for messages in json_dict["messages"]:
#         if isinstance(messages["content"], list):
#             content =  f"""
#                 <p><strong>{messages["role"]}</strong></p>
#                 <textarea name="{id}" rows="10", cols="220">{messages["content"][0]["text"]}</textarea>
#             """
#             lista_json_formatado.append(content)
#         else:
#             content =  f"""
#                 <p><strong>{messages["role"]}</strong></p>
#                 <textarea name="{id}" rows="10", cols="220">{messages["content"]}</textarea>
#             """
#             lista_json_formatado.append(content)
#         id += 1
#     return lista_json_formatado
