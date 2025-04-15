from django.urls import path
from . import views


app_name = "manipulador"
urlpatterns = [
    path("", views.index, name="index"),
    path("list", views.lsfiles, name="lsfiles"), #antigo lsfiles
    path("acess/<str:file_name>/<int:line_number>", views.acess, name="acess"),
    path("edit/<str:file_name>/<int:line_number>", views.edit, name="edit"),
    path("append/<str:file_name>", views.append, name="append"),
    path("create", views.create, name="create"),
    path("drd/<str:file_name>", views.download_rename_delete_json, name="download_rename_delete_json"),
    path("import", views.import_json, name="import_json")
]