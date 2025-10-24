import requests

API_KEY = "AIzaSyAdo8f-eryTO9Gk1Twcq8wZK02sHn2Amtc"
url = "https://generativelanguage.googleapis.com/v1beta/models?key=" + API_KEY

response = requests.get(url)
print(response.json())
