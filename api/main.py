from fastapi import FastAPI, File, Form, Query, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import mysql.connector
from fastapi.responses import JSONResponse
# import requests

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://192.168.117.84:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


MODEL = tf.keras.models.load_model("./saved_models/6")

CLASS_NAMES = ["Amropolli", "Asina", "Fajli", "Funia", "Gulabkhas",
               "Gutthi", "Khirsapoti", "Langra", "Lokhna", "Totapuri"]

# Database connection configuration
# db = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="",
#     database="mango_price_dataset"
# )
# Define MySQL database configuration
config = {
    'user': 'root',
    'password': '',
    'host': 'localhost',
    'database': 'mango_price_dataset'
}


@app.get('/priceData')
async def get_price_data(mango_name: str = Query(...)):
    # Connect to MySQL
    conn = mysql.connector.connect(**config)

    # Execute SQL query
    cursor = conn.cursor()
    query = f"SELECT * FROM tbl_mango_price WHERE mango_name='{mango_name}' ORDER BY id DESC LIMIT 6"
    cursor.execute(query)

    # Retrieve data
    data = cursor.fetchall()

    # Close connection
    conn.close()

    # Return data as JSON response
    return {'data': data}


@app.get('/dateandprice')
async def get_dateandprice(mango_name: str = Query(...)):
    # Connect to MySQL
    conn = mysql.connector.connect(**config)

    # Execute SQL query
    cursor = conn.cursor()
    query = f"SELECT date FROM tbl_mango_price WHERE mango_name='{mango_name}'"
    cursor.execute(query)

    # Retrieve data
    data = cursor.fetchall()

    # Close connection
    conn.close()

    # Return data as JSON response
    return {'data': data}


@app.get('/dateandpriceprice')
async def get_dateandpriceprice(mango_name: str = Query(...)):
    # Connect to MySQL
    conn = mysql.connector.connect(**config)

    # Execute SQL query
    cursor = conn.cursor()
    query = f"SELECT price FROM tbl_mango_price WHERE mango_name='{mango_name}'"
    cursor.execute(query)

    # Retrieve data
    data = cursor.fetchall()

    # Close connection
    conn.close()

    # Return data as JSON response
    return {'data': data}


@app.get('/mango_list')
async def get_mango_list():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    query = "SELECT mango_name FROM mango_name_list"
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return {'data': data}


@app.get('/all_mano_list')
async def get_all_mano_list():
    conn = mysql.connector.connect(**config)
    cursor = conn.cursor()
    query = "SELECT * FROM tbl_mango_price"
    cursor.execute(query)
    data = cursor.fetchall()
    conn.close()
    return {'data': data}


@app.post('/insertPriceData')
async def post_insert_price_data(mango_name: str = Form(...), district: str = Form(...), date: str = Form(...), price: float = Form(...)):
    conn = mysql.connector.connect(**config)

    cursor = conn.cursor()
    query = "INSERT INTO tbl_mango_price (mango_name, district, date, price) VALUES (%s, %s, %s, %s)"
    values = (mango_name, district, date, price)
    cursor.execute(query, values)

    conn.commit()

    conn.close()

    return {'message': 'Data inserted successfully'}


@app.get("/ping")
async def ping():
    return "hello"


def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)))
    return image


def resize_image(image: np.ndarray, target_size: tuple) -> np.ndarray:
    # Convert image to a TensorFlow tensor
    tensor = tf.convert_to_tensor(image)

    # Resize the image using TensorFlow
    resized = tf.image.resize(tensor, target_size)

    # Convert the resized image back to a NumPy array
    resized_np = resized.numpy()

    return resized_np


@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):
    image = read_file_as_image(await file.read())
    # image = image.np.resize((256, 256))
    image = np.array(image)
    # image = resize_image(image, (150, 150)) # for model 2
    image = resize_image(image, (224, 224))  # for model 6

    img_batch = np.expand_dims(image, 0)

    predictions = MODEL.predict(img_batch)
    print(predictions)

    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = np.max(predictions[0])
    return {
        'class': predicted_class,
        'confidence': float(confidence)
    }

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
