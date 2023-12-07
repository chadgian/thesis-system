import os
import re
import socket

import nltk
import docx
from PIL import Image
import pytesseract
from nltk import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from pdf2image import convert_from_path
from flask import Flask, request, render_template, render_template_string, jsonify
# import docx2pdf
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import string
# import pythoncom
#import aspose.words as aw

# pytesseract.pytesseract.tesseract_cmd = r'libraries\Tesseract-OCR\tesseract.exe'
poppler_path = r"libraries\poppler-0.68.0\bin"

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/docvsmulti')
def docvsmulti():
    return render_template('option1.html')

@app.route('/multifile')
def multifile():
    return render_template('option2.html')

@app.route('/docretrieval')
def docretrieval():
    return render_template('option3.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    if 'file' in request.files:
        preprocessedTextFirst = ''
        file = request.files['file']

        # saving the file that will be used to compare for all files
        fname = 'file/' + file.filename.split('/')[-1]
        file.save(fname)

        # Extracting the text and saving it in the variable
        print(f"{file.filename} is extracting texts.")
        extractedTextFirst = extractText(fname)
        print(f"{file.filename} has been extracted.")
        print(f"\n---------------------------------\n{extractedTextFirst}\n-----------------------------\n")

        # Preprocess Data
        if extractedTextFirst == 'Unidentified file.':
            preprocessedTextFirst = 'Unidentified file.'
            print(f"\n---------------------------------\n{preprocessedTextFirst}\n-----------------------------\n")
            print("\n\n\nMULTIPLE DOCUMENTS\n\n")
        else:
            print(f"{file.filename} is preprocessing texts.")
            preprocessedTextFirst = preprocessText(extractedTextFirst)
            print(f"{file.filename} has been preprocessed.")
            print(f"\n---------------------------------\n{preprocessedTextFirst}\n-----------------------------\n")
            print("\n\n\nMULTIPLE DOCUMENTS\n\n")

        return jsonify({file.filename: preprocessedTextFirst})

    elif 'files' in request.files:
        uploaded_files = request.files['files']
        firstDoc = request.form.get('file')
        fnames = uploaded_files.filename.split('/')[-1]
        uploaded_files.save('files/'+fnames)

        print(f"-------------------------------------------------\n{fnames}\n\nExtracting texts...")
        toExtract = 'files/' + fnames
        toPreprocess = extractText(toExtract)
        print("\nEXTRACTED TEXTS:\n")
        print(f"{toPreprocess}\n\n")

        if toPreprocess == 'Unidentified file.':
            toCalculate = 'Unidentified file.'
            print("\nPREPROCESSED TEXTS:\n")
            print(f"{toCalculate}\n\n")
        else:
            print("Preprocessing texts...")
            toCalculate = preprocessText(toPreprocess)
            print("\nPREPROCESSED TEXTS:\n")
            print(f"{toCalculate}\n\n")

        if firstDoc == 'Unidentified file.':
            calculation_result = 'Unidentified file.'
        elif firstDoc != "":
            if toCalculate == 'Unidentified file.':
                 calculation_result = 'Unidentified file.'
            elif toCalculate != "":
                print("Calculating similarity...")
                calculation_result = cosTFID(firstDoc, toCalculate)
                print(f"Similarity rate: {calculation_result}")
            else:
                calculation_result = "Empty document"
        else:
            calculation_result = "Empty document"

        return jsonify({fnames: calculation_result})
    elif 'documents' in request.files:
        fileArray = request.files.getlist('documents')
        validFormats = ['pdf','doc','docx','jpg','jpeg','png','gif','webp','tiff','ppm','pgm','pbm']
        print(fileArray)
        extractedJson = {}
        for file in fileArray:
            filename = file.filename.split('/')[-1].lower()
            fileFormat = filename.split('.')[-1]

            if fileFormat in validFormats:
                print(filename)
                file.save('files/'+filename)
                extractedText = extractText('files/'+filename)
                readyText = preprocessText(extractedText)
                extractedJson[filename] = readyText

        print(extractedJson)
        return jsonify(extractedJson)

    elif 'keyword' in request.form:
        readyJson = {}
        keyword = request.form.get('keyword')
        preprocessedKeyword = preprocessText(keyword)
        print(preprocessedKeyword)
        readyJson['keyword'] = preprocessedKeyword
        return jsonify(readyJson)

    else:
        status = request.form.get('status')
        if status == 'done':
            deleteFiles()
        return 'Success!'


def deleteFiles():
    for file_name in os.listdir('imgs'):
        file_path = os.path.join('imgs', file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)

    for file_name in os.listdir('files'):
        file_path = os.path.join('files', file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)

    for file_name in os.listdir('file'):
        file_path = os.path.join('file', file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)

    for file_name in os.listdir('converts'):
        file_path = os.path.join('converts', file_name)
        if os.path.isfile(file_path):
            os.remove(file_path)

def extractText(file):
    img_formats = ['jpeg','jpg','png','gif','webp','tiff','ppm','pgm','pbm']
    format = file.split(".")
    if format[-1].lower() == "pdf":
        return extractPDF(file)
    elif format[-1].lower() == "doc" or format[-1] == "docx":
        return extractDOC(file)
    elif format[-1].lower() in img_formats:
        try:
            text = pytesseract.image_to_string(file)
        except Exception as e:
            print("Error: \n",e)
            text = 'Unidentified image file.'
        return text
    else:
        print(f'format: {format[-1]}')
        return "Unidentified file."

def extractDOC(file):
    doc = docx.Document(file)
    text = '\n'.join([paragraph.text for paragraph in doc.paragraphs])
    return text


def extractPDF(file):
    doc = ""
    pdf_file = open(file, 'rb')
    pages = convert_from_path(file, poppler_path=poppler_path)
    for i in range(len(pages)):
        image_data = pages[i].tobytes()
        text = pytesseract.image_to_string(Image.frombytes(pages[i].mode, pages[i].size, image_data))
        doc += text
    pdf_file.close()
    return doc

def preprocessText(doc): #Remove stopwords such as 'the', 'as', 'is', etc.
    # nltk.download('stopwords')
    # nltk.download('punkt')
    tokens = word_tokenize(doc.lower())
    stop_words = set(stopwords.words('english'))
    tokens = [token for token in tokens if token not in stop_words]
    text = ' '.join(tokens)
    translator = str.maketrans('', '', string.punctuation)
    text1 = text.translate(translator)
    pattern = r'[^a-zA-Z0-9\s]'
    res = re.sub(pattern, '', text1)
    res1 = ''.join(res).replace(' ', ' ')
    res2 = res1.split()
    stemmer = PorterStemmer()
    stemmed_words = [stemmer.stem(word) for word in res2]
    result = ' '.join(stemmed_words)
    while '  ' in result:
        result = result.replace('  ', ' ')
    return result


def cosTFID(doc1, doc2):
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([doc1, doc2])
    cosine_similarities = cosine_similarity(tfidf_matrix, tfidf_matrix)
    return f'{round(cosine_similarities[0][1]*100, 2)}%'

# def get_local_ip():
#     hostname = socket.gethostname()
#     local_ip = socket.gethostbyname(hostname)
#     return local_ip

if __name__ == "__main__"   :
    app.run(host="0.0.0.0", port="5000")
