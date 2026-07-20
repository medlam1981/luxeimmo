import json
import os

translations = {
    'en': 'Share this post:',
    'fr': 'Partager cet article :',
    'es': 'Compartir este artículo:',
    'ar': 'شارك هذا المقال:'
}

for lang, text in translations.items():
    filepath = f'messages/{lang}.json'
    if os.path.exists(filepath):
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if 'Blog' not in data:
            data['Blog'] = {}
        
        data['Blog']['shareThisPost'] = text
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
