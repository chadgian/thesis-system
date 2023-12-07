import mimetypes
import os
from PIL import Image
import pytesseract
from nltk.corpus import stopwords
from pdf2image import convert_from_path
from flask import Flask, request, render_template
import docx2pdf

pytesseract.pytesseract.tesseract_cmd = r'libraries\Tesseract-OCR\tesseract.exe'
poppler_path = r"libraries\poppler-0.68.0\bin"

def extractPDF(file):
    doc = ""
    pdf_file = open(file, 'rb')
    pages = convert_from_path(file, poppler_path=poppler_path)
    for i in range(len(pages)):
        pages[i].save(f'converts/image_{i}.png', 'PNG')
        text = pytesseract.image_to_string(Image.open(f'converts/image_{i}.png'))
        doc += text
    pdf_file.close()
    return doc

file = "samples/test.docx"
format = file.split(".")
if format[-1] == "pdf":
    extractPDF(file)
elif format[-1] == "doc" or format[-1] == "docx":
    pdf_path = "files/converted.pdf"
    docx2pdf.convert(file, pdf_path)
    print(extractPDF(pdf_path))
elif format[-1] == "jpg" or format[-1] == "jpeg" or format[-1] == "png":
    text = pytesseract.image_to_string(file)
    print(text)