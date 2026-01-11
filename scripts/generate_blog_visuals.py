"""
Daily Blog Visual Generator

Generates infographic images and audio files for each daily blog post.
These are stored in assets/blog/ and can be displayed on the website.
"""

import os
import re
from pathlib import Path
import json

SCRIPT_DIR = Path(__file__).parent
BLOG_FILE_PATH = SCRIPT_DIR.parent / "js" / "blog-posts.js"
ASSETS_DIR = SCRIPT_DIR.parent / "assets" / "blog"
INFOGRAPHICS_DIR = ASSETS_DIR / "infographics"
AUDIO_DIR = ASSETS_DIR / "audio"


def parse_blog_posts():
    """Parse blog posts from blog-posts.js."""
    with open(BLOG_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    posts = []
    pattern = re.compile(
        r'\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*'
        r'date:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*'
        r'author:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*'
        r'content:\s*`([^`]+)`', re.DOTALL
    )
    
    for m in pattern.finditer(content):
        posts.append({
            'id': m.group(1), 'title': m.group(2), 'date': m.group(3),
            'category': m.group(4), 'author': m.group(5),
            'excerpt': m.group(6), 'content': m.group(7).strip()
        })
    return posts


def strip_html(text):
    """Remove HTML tags from text."""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean


def get_category_colors():
    """Rich, professional deep color palette."""
    return {
        'Health': '#00695C',      # Deep Teal
        'Education': '#4527A0',   # Deep Purple
        'Agriculture': '#2E7D32', # Forest Green
        'Environment': '#33691E', # Olive Green
        'Technology': '#1565C0',  # Rich Blue
        'Social Impact': '#B71C1C', # Deep Red
        'Governance': '#E65100',  # Dark Orange
        'default': '#37474F'      # Slate Grey
    }

def create_blog_infographic(post, filename):
    """Generate a clean 'Split Card' style infographic."""
    try:
        from PIL import Image, ImageDraw, ImageFont
        import textwrap
        import random
        
        # Landscape Aspect Ratio (approx 16:9) matching Wadhwani style headers
        width, height = 1200, 675
        
        # Get category colors (Deep, professional tones)
        from random import choice
        
        def get_theme_colors(category):
            themes = {
                'Health': ['#00695C', '#004D40', '#00897B', '#E0F2F1'],
                'Education': ['#4527A0', '#311B92', '#5E35B1', '#EDE7F6'],
                'Agriculture': ['#2E7D32', '#1B5E20', '#43A047', '#E8F5E9'],
                'Environment': ['#33691E', '#1B5E20', '#558B2F', '#F1F8E9'],
                'Technology': ['#1565C0', '#0D47A1', '#1976D2', '#E3F2FD'],
                'Social Impact': ['#C62828', '#B71C1C', '#D32F2F', '#FFEBEE'],
                'Governance': ['#EF6C00', '#E65100', '#F57C00', '#FFF3E0'],
                'default': ['#37474F', '#263238', '#455A64', '#ECEFF1']
            }
            return themes.get(category, themes['default'])

        colors = get_theme_colors(post['category'])
        base_color = colors[0]
        accent_color = colors[2]
        
        # Load Base Image based on Category
        # Define Header Images Dir
        header_images_dir = SCRIPT_DIR.parent / "assets" / "images" / "blog_headers"

        # Load Base Image based on Category or Title keywords
        text_to_check = (post['category'] + " " + post['title']).title()
        
        base_image_name = "technology_community.png" # Default
        
        if 'Woman' in text_to_check or 'Women' in text_to_check or 'Empowerment' in text_to_check or 'Gender' in text_to_check:
             base_image_name = "woman_empowerment.png"
        elif 'Health' in text_to_check:
             base_image_name = "health.png"
        elif 'Agriculture' in text_to_check:
             base_image_name = "agriculture.png"
        elif 'Education' in text_to_check or 'Learning' in text_to_check:
             base_image_name = "education.png"
        elif 'Governance' in text_to_check:
             base_image_name = "governance.png"
        elif 'Environment' in text_to_check or 'Climate' in text_to_check:
             base_image_name = "environment.png"
        elif 'Social' in text_to_check or 'Impact' in text_to_check:
             base_image_name = "social_impact.png"
        
        base_image_path = header_images_dir / base_image_name

        try:
            img = Image.open(base_image_path).convert('RGB')
            img = img.resize((width, height), Image.Resampling.LANCZOS)
        except Exception as e:
            print(f"Could not load base image {base_image_path}: {e}")
            # Fallback to solid color
            img = Image.new('RGB', (width, height), color=base_color)

        # No text overlay - Clean Image
        img.save(filename)
        print(f"✅ Blog Cover: {filename}")
        return True
    except Exception as e:
        print(f"Infographic generation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def create_blog_audio(post, filename):
    """Generate audio file for a blog post."""
    try:
        from gtts import gTTS
        
        content_clean = strip_html(post['content'])
        
        # Build audio script
        script = f"""
        {post['title']}.
        
        Category: {post['category']}.
        By {post['author']}.
        
        {post['excerpt']}
        
        {content_clean[:1500]}
        
        This article was brought to you by VitaInspire, building AI careers and transforming social impact.
        """
        
        tts = gTTS(text=script, lang='en', slow=False)
        tts.save(filename)
        print(f"✅ Audio: {filename}")
        return True
        
    except ImportError:
        print("gTTS not installed. Run: pip install gtts")
        return False
    except Exception as e:
        print(f"Audio generation failed: {e}")
        return False


def generate_blog_assets(post_ids=None, regenerate=False):
    """
    Generate infographic and audio for blog posts.
    
    Args:
        post_ids: List of post IDs to generate (None = all new posts)
        regenerate: If True, regenerate even if assets exist
    """
    # Create directories
    INFOGRAPHICS_DIR.mkdir(parents=True, exist_ok=True)
    AUDIO_DIR.mkdir(parents=True, exist_ok=True)
    
    posts = parse_blog_posts()
    
    if post_ids:
        posts = [p for p in posts if p['id'] in post_ids]
    
    generated = {'infographics': 0, 'audio': 0}
    
    for post in posts:
        post_id = post['id']
        
        # Infographic
        infographic_path = INFOGRAPHICS_DIR / f"{post_id}.png"
        if regenerate or not infographic_path.exists():
            if create_blog_infographic(post, str(infographic_path)):
                generated['infographics'] += 1
        
        # Audio
        audio_path = AUDIO_DIR / f"{post_id}.mp3"
        if regenerate or not audio_path.exists():
            if create_blog_audio(post, str(audio_path)):
                generated['audio'] += 1
    
    print(f"\n📊 Generated {generated['infographics']} infographics, {generated['audio']} audio files")
    return generated


def generate_assets_manifest():
    """Create a JSON manifest of available assets for the website."""
    manifest = {}
    
    for infographic in INFOGRAPHICS_DIR.glob("*.png"):
        post_id = infographic.stem
        if post_id not in manifest:
            manifest[post_id] = {}
        manifest[post_id]['infographic'] = f"assets/blog/infographics/{infographic.name}"
    
    for audio in AUDIO_DIR.glob("*.mp3"):
        post_id = audio.stem
        if post_id not in manifest:
            manifest[post_id] = {}
        manifest[post_id]['audio'] = f"assets/blog/audio/{audio.name}"
    
    manifest_path = ASSETS_DIR / "manifest.json"
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"✅ Manifest saved: {manifest_path}")
    return manifest


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate blog infographics and audio")
    parser.add_argument('--all', action='store_true', help='Generate for all posts')
    parser.add_argument('--regenerate', action='store_true', help='Regenerate existing assets')
    parser.add_argument('--posts', nargs='+', help='Specific post IDs to generate')
    
    args = parser.parse_args()
    
    if args.posts:
        generate_blog_assets(post_ids=args.posts, regenerate=True)
    elif args.all or args.regenerate:
        generate_blog_assets(regenerate=args.regenerate)
    else:
        # Just generate for new posts (ones without assets)
        generate_blog_assets(regenerate=False)
    
    generate_assets_manifest()
