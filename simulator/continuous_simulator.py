import requests
import random
from datetime import datetime
import time

URL = "http://localhost:5001/api/detection"

species_list = ["Elephant", "Tiger", "Rhino", "Leopard"]
locations = ["Barrier B1", "Barrier B2", "Barrier B3"]
directions = ["North", "South", "East", "West"]

def send_detection():
    data = {
        "species": random.choice(species_list),
        "location": random.choice(locations),
        "direction": random.choice(directions),
        "timestamp": datetime.now().isoformat()
    }

    try:
        response = requests.post(URL, json=data)
        print("Sent:", data)
    except Exception as e:
        print("Error:", e)

for i in range(10):
    send_detection()
    time.sleep(3)
