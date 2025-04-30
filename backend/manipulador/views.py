from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse, FileResponse
from django import forms
from . import util
import json
from .models import FileUser
from random import randint
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from django.middleware.csrf import get_token

DEFAULT_FILE_NUM = 0
DEFAULT_FILE_NAME = "jsonfile.jsonl"
DEFAULT_WRITE_FILE = "jsonfile1.jsonl"
# DEFAUL_FILE_ROUTE = "json_files/"
DEFAUL_FILE_ROUTE = "json_files/files/" 
UPLOAD_TO = "files/"

@ensure_csrf_cookie
@api_view(['GET'])
def index(request):
    if not request.session.session_key:
        request.session.create()

    return Response({"succes": True})


@api_view(['GET'])
def lsfiles(request):
    file_user_arr = FileUser.objects.filter(user_session=request.session.session_key).values_list("file_name", flat=True)
    print(file_user_arr)

    return Response({
        "user_files": file_user_arr if file_user_arr.exists() else "No files found!",
    })


@api_view(['GET'])
def acess(request, file_name, line_number):
    # Verifica o tamnho do arquivo.
    file_size = util.json_file_size(file_name)

    # Carrega a linha do json selecionado no json_dict
    json_line = util.json_reader(line_number, file_name) # Implementar o upload de arquivos.
    
    # content_list = util.formatador_html(json_dict) anstes formatava-mos esse json em caixas, agora iremos mandar para ser props no react!
    return Response({
        "jsonline": json_line,
        "linenumber": line_number,
        "filename": file_name,
        "filesize": file_size
    }) # mudar o número da linha e verificar para não acessar um idex out of range no front.

@api_view(['POST'])
def edit(request, file_name, line_number):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})
        
    
    user_file = FileUser.objects.filter(user_session=request.session.session_key, file_name=file_name)
    if user_file:
        new_json_dict = request.data
        print("Porcodiu")
        print(new_json_dict)
        util.json_file_editor(new_json_dict["jsonline"], line_number, file_name)

        return Response({"message": "success"})

    return Response({"message": "You dont have acess!"})

@api_view(['POST'])
def edit_all(request, file_name):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})
        
    
    user_file = FileUser.objects.filter(user_session=request.session.session_key, file_name=file_name)
    if user_file:
        request_body = request.data
        new_value = request_body["new_value"]

        for i in range(util.json_file_size(file_name)):
            json_line = util.json_reader(i, file_name)

            if isinstance(json_line["messages"][0]["content"], list):
                json_line["messages"][0]["content"][0]["text"] = new_value
            else:
                json_line["messages"][0]["content"] = new_value
            
            util.json_file_editor(json_line, i, file_name)
            

        return Response({"message": "success"})

    return Response({"message": "You dont have acess!"})

@api_view(['POST'])
def append(request, file_name):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})

    user_file = FileUser.objects.filter(user_session=request.session.session_key, file_name=file_name)
    if user_file:
        # Recebendo o JSON já formatado.
        request_body = request.data
        new_json_string = request_body["jsonline_string"]
        json_dict = json.loads(new_json_string)

        # Escrevendo no arquivo destino, modo append.
        util.json_writer(json_dict, file_name, 'a')

        return Response({"message": "success"})

    return Response({"message": "You dont have acess!"})

@api_view(['POST'])
def create(request):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})

    # Recebimento do JSON já formatado.
    request_body = request.data
    new_json_string = request_body["jsonline_string"]
    json_dict = json.loads(new_json_string)

    # Escrevendo o JSON no novo arquivo.
    random_json_name = util.random_file_name_gen()
    util.json_writer(json_dict, random_json_name, "w")

    # Salvando no DB a relação file/user.
    created_file = UPLOAD_TO + random_json_name
    data = FileUser(
        file = created_file,
        user_session = request.session.session_key
    )
    data.save()
    
    return Response({"message": "success", "new_file": random_json_name})

DRD_JSON_METHODS = ['GET', 'DELETE', 'POST']
@api_view(DRD_JSON_METHODS)
def download_rename_delete_json(request, file_name):
    if request.method not in DRD_JSON_METHODS:
        return Response({"message": "This view acepts only GET, POST and DELETE requests. To Download, Rename and Delete the JSON File."})
    
    match request.method:
        case 'GET':
            file = FileUser.objects.get(file_name=file_name, user_session=request.session.session_key)
            response = FileResponse(open(f"{DEFAUL_FILE_ROUTE}{file.file_name}", "rb"), as_attachment=True)
            response["content-disposition"] =  f'attachment; filename="{file_name}"'
            return response
        
        case 'POST':
            request_body = request.data
            new_name = request_body["newname"]
            file_user = FileUser.objects.get(file_name=file_name, user_session=request.session.session_key)
            util.json_renamer(file_user, new_name)

            return Response({"message": "Renomeou papai", "newname": new_name})
        

        case 'DELETE':
            try:
                file = FileUser.objects.get(file_name=file_name, user_session=request.session.session_key)
                file.delete()
                return Response({"message": "File Deleted!"})
            except:
                return Response({"message": "Delete forbidden!"})

@api_view(['POST'])
def import_json(request):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})
    
    uploaded_file = request.FILES
    if uploaded_file:
        data = FileUser(
            file = uploaded_file["file"],
            user_session = request.session.session_key
        )
        data.save()
    
    return Response({"message": "demonho"})

