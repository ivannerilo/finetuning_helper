from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
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
DEFAUL_FILE_ROUTE = "json_files/"
# DEFAUL_FILE_ROUTE = "json_files/files/" Antigo e certo

@ensure_csrf_cookie
@api_view(['GET'])
def index(request):
    print(request)
    if not request.session.session_key:
        request.session.create()

    return Response({"succes": True})

@api_view(['GET'])
def lsfiles(request):
    print(request)
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
        new_json_dict = json.loads(request.body)
        print(new_json_dict)
        util.json_file_editor(new_json_dict["jsonline"], line_number, file_name)

        return Response({"message": "success"})

    return Response({"message": "You dont have acess!"})

@api_view(['POST'])
def append(request, file_name):
    if request.method != 'POST':
        return Response({"message": "Need to be POST!!!"})

    user_file = FileUser.objects.filter(user_session=request.session.session_key, file_name=file_name)
    if user_file:
        # Recebendo o JSON já formatado.
        request_body = json.loads(request.body)
        print(request_body)
        new_json_string = request_body["jsonline_string"]
        print(new_json_string)
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
    request_body = json.loads(request.body)
    new_json_string = request_body["jsonline_string"]
    json_dict = json.loads(new_json_string)

    # Escrevendo o JSON no novo arquivo.
    random_json_name = util.random_file_name_gen()
    util.json_writer(json_dict, random_json_name, "w")

    # Salvando no DB a relação file/user.
    created_file = DEFAUL_FILE_ROUTE + random_json_name
    data = FileUser(
        file = created_file,
        user_session = request.session.session_key
    )
    data.save()
    
    return Response({"message": "success", "new_file": random_json_name})




    
    

























["jsonline"]
# FUNÇÕES ANTIGAS ------------------
# class editForm(forms.Form): 
#     new_content = forms.CharField(
# 		widget=forms.Textarea(attrs={'rows': 10, 'cols': 220}),
# 	)

# class createForm(forms.Form):
#     new_content = forms.CharField(
#         widget=forms.Textarea(attrs={'rows': 100, 'cols': 220})
#     )

# class fileForm(forms.Form):
#     new_file = forms.FileField()

# # @api_view(['GET', 'POST'])
# # def index(request):
# #     if request.method == 'POST':
# #         uploaded_file = request.FILES["new_file"]
# #         data = FileUser(
# #             file = uploaded_file,
# #             user_session = request.session.session_key
# #         )
# #         data.save()
# #     user_files = FileUser.objects.filter(user_session=request.session.session_key)
# #     return render(request, "manipulador/home.html", {
# #         "DEFAULT_FILE_NUM": DEFAULT_FILE_NUM,
# #         "DEFAULT_FILE_NAME": DEFAULT_FILE_NAME,
# #         "form": fileForm(),
# #         "user_files": user_files
# #     })

# @api_view(['GET'])
# def download_json(request, archive_name):
#     uf = FileUser.objects.filter(user_session=request.session.session_key)
#     # files_names = list(uf.file_name)
#     # if not archive_name in files_names:
#     #     pass #fazer verifcação para que o usário não faça downlaod de arquivos que não são dele.
#     downlaod_file = util.file_reader(archive_name)
#     response = HttpResponse(downlaod_file, content_type="aplication/jsonline")
#     response["content-disposition"] =  f'attachment; filename="{archive_name}"'
#     return response

# @api_view(['GET'])
# def delete_json(request, archive_name):
#     util.delete_file(archive_name)
#     FileUser.objects.get(file_name=archive_name).delete()
#     return HttpResponseRedirect("/")

# @api_view(['GET'])
# def show_json(request, archive_num, archive_name):
#     file_size = util.json_file_size(archive_name)
#     # if request.method == 'POST':
#     #     match request.POST['ação']:
#     #         case 'next':
#     #             archive_num += 1
#     #         case 'back':
#     #             archive_num -= 1
#     #     if archive_num < 0:
#     #         archive_num = file_size - 1
#     #     elif archive_num > file_size -1:
#     #         archive_num = 0
#     #     return HttpResponseRedirect(f'/{archive_num}/{archive_name}')

#     json_dict = util.json_reader(archive_num, archive_name) # Implementar o upload de arquivos.
#     content_list = util.formatador_html(json_dict)
#     return render(request, "manipulador/index.html", {
#         "correct_content": content_list[1:],
#         "archive_num": archive_num,
#         "archive_name": archive_name
#     })
        
# @api_view(['GET', 'POST'])
# def edit_json(request, archive_num, archive_name):
#     if request.method == 'POST':
#         json_dict = util.json_reader(archive_num, archive_name)
#         for i in range(len(request.POST) - 1):
#             if isinstance(json_dict["messages"][i]["content"], list):
#                 json_dict["messages"][i]["content"][0]["text"] = request.POST[f"{i}"]
#             else:
#                 json_dict["messages"][i]["content"] = request.POST[f"{i}"]
#         util.json_file_editor(json_dict, archive_num, archive_name)
#         return HttpResponseRedirect(f"/{archive_num}/{archive_name}")
    
#     json_dict = util.json_reader(archive_num, archive_name)
#     lista_forms = util.formatador_formulario(json_dict)
#     return render(request, "manipulador/edit.html", {
#         "lista_forms": lista_forms
#     })

# @api_view(['GET', 'POST'])
# def create_json(request): 
#     random_json_name = util.random_file_name_gen()
#     if request.method == 'POST':
#         form = createForm(request.POST)
#         if form.is_valid():
#             new_json_string = request.POST.get("new_content")
#             formated_json = util.json_formater(new_json_string) # json vem formatado aleluia
#             print(formated_json)
#             json_dict = json.loads(formated_json)
#             util.json_writer(json_dict, random_json_name, "w")
#             created_file = DEFAUL_FILE_ROUTE + random_json_name
#             data = FileUser(
#                 file = created_file,
#                 user_session = request.session.session_key
#             )
#             data.save()
#             return HttpResponseRedirect(f"/") #rota antiga /{DEFAULT_FILE_NUM}/{created_file}
#     return render(request, "manipulador/create.html", {
#         "form": createForm()
#     })
    
# @api_view(['GET', 'POST'])
# def append_json(request, archive_name):
#     if request.method == 'POST':
#         form = createForm(request.POST)
#         if form.is_valid():
#             new_json_string = request.POST.get("new_content")
#             formated_json = util.json_formater(new_json_string) 
#             json_dict = json.loads(formated_json)
#             util.json_writer(json_dict, archive_name, 'a')
#             return HttpResponseRedirect(f"/{DEFAULT_FILE_NUM}/{archive_name}") #rota antiga /{DEFAULT_FILE_NUM}/{created_file}
#     return render(request, "manipulador/create.html", {
#         "form": createForm()
#     })
