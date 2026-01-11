import requests
import re
import os

def analyze_receipt_image(IMAGE_PATH):
    """
    Analyze a receipt image using OCR and return CO2 data for food items.
    Returns: List of [food_name, co2_value] pairs
    """
    API_KEY = "K82519318188957" #TODO obscure w/ a hash and decode on runtime
    FOOD_ABBR = {
        "APPL": "apple",
        "APL": "apple",
        "BANA": "banana",
        "BNA": "banana",
        "ORNG": "orange",
        "GRAP": "grapes",
        "STRWB": "strawberry",
        "BLUBRY": "blueberries",
        "LMN": "lemon",
        "LIME": "lime",
        "AVOC": "avocado",
        "TOM": "tomato",
        "POT": "potato",
        "ONIN": "onion",
        "GRLC": "garlic",
        "LETT": "lettuce",
        "SPNCH": "spinach",
        "BRCC": "broccoli",
        "CRRT": "carrot",
        "CRT": "carrot",
        "CUC": "cucumber",
        "MUSH": "mushrooms",
        "PEPR": "bell pepper",
        "CELRY": "celery",
        "CRN": "corn",
        "PEAS": "peas",
        "BNS": "beans",
        "CHKN": "chicken",
        "BEEF": "beef",
        "PORK": "pork",
        "TURKY": "turkey",
        "BACN": "bacon",
        "HAM": "ham",
        "SAUS": "sausage",
        "SALMN": "salmon",
        "TUNA": "tuna",
        "SHRMP": "shrimp",
        "EGGS": "eggs",
        "MLK": "milk",
        "SKIMMLK": "skim milk",
        "SKMMLK": "skim milk",
        "WHLMLK": "whole milk",
        "CRM": "cream",
        "YOG": "yogurt",
        "CHZ": "cheese",
        "BTR": "butter",
        "BRD": "bread",
        "BAGEL": "bagel",
        "TORT": "tortillas",
        "RICE": "rice",
        "PASTA": "pasta",
        "NOOD": "noodles",
        "OATS": "oats",
        "CRL": "cereal",
        "FLOUR": "flour",
        "SUG": "sugar",
        "SALT": "salt",
        "PEPRN": "pepper (black)",
        "OIL": "cooking oil",
        "OLIVOIL": "olive oil",
        "VIN": "vinegar",
        "KETCH": "ketchup",
        "MAYO": "mayonnaise",
        "MUST": "mustard",
        "SALSA": "salsa",
        "SOUP": "soup",
        "CHPS": "chips",
        "CRKRS": "crackers",
        "NUTS": "nuts",
        "CHOC": "chocolate",
        "ICECRM": "ice cream",
        "SDA": "soda",
        "JCE": "juice",
        "WTR": "water",
        "COF": "coffee",
        "TEA": "tea",
    }
    url = "https://api.ocr.space/parse/image"

    payload = {
        "apikey": API_KEY,
        "language": "eng",
        "isOverlayRequired": False,
        # optional helpers for receipts:
        "isTable": True,               # “receipt/table-like” output
        "detectOrientation": True,     # auto-rotate if needed
        "scale": True,                # upscale low DPI images
        "OCREngine": 2,               # try engine 2
    }

    with open(IMAGE_PATH, "rb") as f:
        r = requests.post(url, files={"file": f}, data=payload, timeout=120)

    r.raise_for_status()
    data = r.json()

    # Extract text
    parsed = data["ParsedResults"][0]["ParsedText"] if data.get("ParsedResults") else ""
    #print(parsed) #og receipt

    # Debug errors
    if data.get("IsErroredOnProcessing"):
        print("Errors:", data.get("ErrorMessage"))

    parsed = re.sub(r'.\d\d', '}', parsed)
    parsed = parsed.split('}')
    for idx, item in enumerate(parsed):
        if "subtotal" in item.lower():
            parsed = parsed[:idx]
            break
    parsed = [re.sub(r'\d+', '', i) for i in parsed]
    parsed = [item.strip() for item in parsed if item.strip() != ""]  # strips whitespace and removes empty items
    parsed = [i.upper() for i in parsed]

    for current_abr in FOOD_ABBR:
        for i in range(len(parsed)):
            if current_abr in parsed[i] and not FOOD_ABBR[current_abr].upper() in parsed[i].upper():
                parsed[i]=parsed[i].replace(current_abr,FOOD_ABBR[current_abr])
    #print(parsed)
    # Get the directory where this script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, "food price FINAL(food price FINAL).csv")
    food_file = open(csv_path, 'r')
    food_list = []
    for food in food_file:
        current_food = food.strip().split(",")
        food_list.append(current_food)
    #print(food_list)
    carbon_list = []
    receipt = parsed


    # Track words we've already added and their max CO2 value
    word_to_co2 = {}
    for food in food_list:
        for word in receipt:
            if food[0].lower() in word.lower():
                current_co2 = float(food[2])
                if word in word_to_co2:
                    # If duplicate, store the maximum CO2 value
                    word_to_co2[word] = max(word_to_co2[word], current_co2)
                else:
                    word_to_co2[word] = current_co2
    for word, co2 in word_to_co2.items():
        carbon_list.append([word, str(co2)])
    
    
    
    return carbon_list
