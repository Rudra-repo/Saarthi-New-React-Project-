import requests
from bs4 import BeautifulSoup
import json
import uuid
import re

# -----------------------------------------------------------------------------------------
# SAARTHI AUTOMATED SCHEME CRAWLER
# -----------------------------------------------------------------------------------------
# NOTE: This crawler is a modular template designed to demonstrate scraping structure.
# Government directories like myscheme.gov.in frequently change their structural classes.
# You will need to update the `find()` classes based on the live DOM of the target site.
# -----------------------------------------------------------------------------------------

TARGET_URLS = [
    # Add your target scheme directory URIs here
    # "https://www.myscheme.gov.in/search/agriculture",
    # "https://www.myscheme.gov.in/search/health"
]

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Connection': 'keep-alive'
}

def clean_text(text):
    if not text:
        return ""
    # Remove awkward spacing/newlines
    return re.sub('\s+', ' ', text).strip()

def map_category(raw_tags):
    # Maps raw scraped tags to Saarthi's strict internal DB schema Categories
    text = " ".join(raw_tags).lower()
    if 'farm' in text or 'agri' in text or 'crop' in text: return 'farmer'
    if 'health' in text or 'medical' in text: return 'health'
    if 'house' in text or 'home' in text: return 'housing'
    if 'student' in text or 'education' in text: return 'education'
    if 'woman' in text or 'women' in text or 'girl' in text: return 'women'
    if 'loan' in text or 'credit' in text or 'business' in text: return 'loan'
    if 'senior' in text or 'old age' in text: return 'senior'
    return 'financial' # fallback

def scrape_schemes():
    scraped_data = []

    print(f"🤖 Booting up Saarthi Scraper Engine...")
    
    # ── MOCK SAMPLE (To demonstrate mapping pipeline locally without hitting captchas) ──
    # If TARGET_URLS is empty, we process a simulated scrape buffer.
    # In production, replace `mock_dom_elements` with `soup.find_all('div', class_='scheme-card')`
    
    mock_dom_elements = [
        {
            "title": "PM Vishwakarma Yojana",
            "benefit": "Collateral free credit support up to ₹3 lakh with 5% concessional interest.",
            "amount_str": "300000",
            "tags": "Business, Artisan, Credit"
        },
        {
            "title": "PM Matru Vandana Yojana",
            "benefit": "Maternity benefit of ₹5,000 for first living child.",
            "amount_str": "5000",
            "tags": "Women, Health, Maternity"
        }
    ]

    for url in TARGET_URLS:
        try:
            print(f"📡 Fetching: {url}")
            response = requests.get(url, headers=HEADERS, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            # DOM SEARCH GOES HERE
            # items = soup.find_all('div', class_='scheme-list-item')
            # for item in items:
            #     title = clean_text(item.find('h2').text)
            #     benefit = clean_text(item.find('p', class_='description').text)
            #     ...
            
        except Exception as e:
            print(f"❌ Failed to scrape {url}: {e}")

    # For demonstration, we process the mock DOM array 
    # (Matches the behavior of what the loop above would yield)
    for raw in mock_dom_elements:
        title = raw['title']
        benefit = raw['benefit']
        tags_raw = raw['tags'].split(',')
        amount = int(raw['amount_str']) if raw['amount_str'].isdigit() else 0

        # Transform to Saarthi DB Schema
        scheme_obj = {
            "id": title.lower().replace(' ', '-'),
            "nameEn": title,
            "nameHi": f"{title} (अनुवाद लंबित)", # Translation would require GTranslate API, handled on client
            "category": map_category(tags_raw),
            "type": "central",
            "benefitEn": benefit,
            "benefitHi": f"{benefit} (अनुवाद लंबित)",
            "amount": amount,
            "interestRate": None,
            "eligibility": {
                "maxIncome": None,
                "states": "all",
                "gender": "female" if "Women" in tags_raw else "all",
                "occupation": "all",
                "maxAge": None,
                "minAge": 18
            },
            "documentsEn": ["Aadhar Card", "Bank Account Details"],
            "documentsHi": ["आधार कार्ड", "बैंक खाते का विवरण"],
            "stepsEn": ["Check eligibility online", "Register at nearest CSC center", "Submit necessary documents"],
            "stepsHi": ["ऑनलाइन पात्रता जांचें", "निकटतम सीएससी केंद्र पर पंजीकरण करें", "आवश्यक दस्तावेज जमा करें"],
            "officialUrl": "https://www.india.gov.in",
            "deadlineDays": None,
            "icon": "✨",
            "tags": [t.strip().lower() for t in tags_raw]
        }
        
        scraped_data.append(scheme_obj)

    # ── Exporting Payload ──
    output_filename = "scraped_schemes.json"
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(scraped_data, f, ensure_ascii=False, indent=2)
        
    print(f"✅ Successfully compiled {len(scraped_data)} schemes!")
    print(f"💾 Saved to {output_filename}")
    print(f"👉 To use this data, copy the JSON objects from {output_filename} directly into your src/constants/schemes.js SCHEMES array!")

if __name__ == "__main__":
    scrape_schemes()
