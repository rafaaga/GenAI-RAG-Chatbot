import os
import requests
from docx import Document
import PyPDF2
from bs4 import BeautifulSoup

n8n_webhook_url = "http://localhost:5678/webhook-test/documentos"

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return '\n'.join([p.text for p in doc.paragraphs])

def extract_text_from_pdf(file_path):
    with open(file_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        return '\n'.join([page.extract_text() for page in reader.pages if page.extract_text()])

def extract_text_from_url(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, 'lxml')
    return soup.get_text()

def extract_text(file_path_or_url):
    if file_path_or_url.startswith('http://') or file_path_or_url.startswith('https://'):
        return extract_text_from_url(file_path_or_url)

    if not os.path.exists(file_path_or_url):
        raise FileNotFoundError("El archivo no existe.")

    if file_path_or_url.endswith('.docx'):
        return extract_text_from_docx(file_path_or_url)
    elif file_path_or_url.endswith('.pdf'):
        return extract_text_from_pdf(file_path_or_url)
    else:
        raise ValueError("Formato de archivo no soportado. Usa .docx, .pdf o URL.")

#Cambia esto según lo que quieras enviar
#entrada = "C:/Users/Rafa/Downloads/folleto_ingenieria_de_sistemas_javeriana_Cali.pdf"

entrada = "https://www.javerianacali.edu.co/programas/carreras/ingenieria-de-sistemas-y-computacion"
# entrada = "/content/documento.docx"

text_content = extract_text(entrada)

# Enviar a n8n
data = {'text': text_content}
response = requests.post(n8n_webhook_url, json=data)

print(response.status_code)
try:
    print(response.json())
except:
    print(response.text)
