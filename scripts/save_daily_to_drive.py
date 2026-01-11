"""
Save Daily AI Research Reports to Google Drive
"""

import os
import re
import datetime
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).parent))

from google_drive_config import (
    get_google_drive_service,
    setup_vitainspire_folders,
    upload_content_to_drive
)

SCRIPT_DIR = Path(__file__).parent
BLOG_FILE_PATH = SCRIPT_DIR.parent / "js" / "blog-posts.js"


def parse_blog_posts():
    """Parse blog posts from blog-posts.js file."""
    with open(BLOG_FILE_PATH, 'r', encoding='utf-8') as f:
        content = f.read()
    
    posts = []
    post_pattern = re.compile(
        r'\{\s*id:\s*"([^"]+)",\s*title:\s*"([^"]+)",\s*'
        r'date:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*'
        r'author:\s*"([^"]+)",\s*excerpt:\s*"([^"]+)",\s*'
        r'content:\s*`([^`]+)`',
        re.DOTALL
    )
    
    for match in post_pattern.finditer(content):
        posts.append({
            'id': match.group(1), 'title': match.group(2),
            'date': match.group(3), 'category': match.group(4),
            'author': match.group(5), 'excerpt': match.group(6),
            'content': match.group(7).strip()
        })
    return posts


def get_todays_posts(posts):
    """Filter posts from today."""
    today = datetime.datetime.now()
    today_str = today.strftime("%B %d, %Y").replace(" 0", " ")
    return [p for p in posts if p['date'] == today_str or p['date'] == today.strftime("%B %d, %Y")]


def create_daily_report_html(posts, date_str):
    """Create a formatted HTML report for daily posts."""
    html = f'''<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>VitaInspire Daily Report - {date_str}</title>
<style>body{{font-family:sans-serif;background:#1a1a2e;color:#e0e0e0;padding:40px;}}
.container{{max-width:900px;margin:auto;}}.header{{text-align:center;background:linear-gradient(135deg,#667eea,#764ba2);
padding:40px;border-radius:20px;margin-bottom:40px;}}h1{{font-size:2rem;}}
.post{{background:#2a2a4e;padding:30px;border-radius:15px;margin-bottom:25px;}}
.category{{background:#667eea;padding:5px 15px;border-radius:15px;font-size:0.85rem;}}
h2{{color:#fff;margin:15px 0;}}.excerpt{{color:#a0a0a0;font-style:italic;padding:15px;
background:rgba(0,0,0,0.2);border-left:3px solid #00d4aa;margin-bottom:20px;}}
.content h3{{color:#00d4aa;margin-top:20px;}}.footer{{text-align:center;padding:30px;color:#888;}}
</style></head><body><div class="container"><div class="header">
<h1>🧠 VitaInspire Daily AI Research</h1><p>{date_str}</p>
<p>{len(posts)} Research Articles</p></div>'''
    
    for post in posts:
        html += f'''<article class="post"><span class="category">{post['category']}</span>
<h2>{post['title']}</h2><div class="excerpt">{post['excerpt']}</div>
<div class="content">{post['content']}</div></article>'''
    
    html += '''<footer class="footer"><p><strong>VitaAInspire</strong></p>
<p>© 2026 VitaInspire Private Limited</p></footer></div></body></html>'''
    return html


def save_daily_report_to_drive(date_str=None):
    """Save today's posts to Google Drive."""
    print("Connecting to Google Drive...")
    service = get_google_drive_service()
    folders = setup_vitainspire_folders(service)
    
    all_posts = parse_blog_posts()
    if date_str:
        posts = [p for p in all_posts if p['date'] == date_str]
    else:
        posts = get_todays_posts(all_posts)
        date_str = datetime.datetime.now().strftime("%B %d, %Y")
    
    if not posts:
        print(f"No posts found for {date_str}")
        return None
    
    print(f"Found {len(posts)} post(s) for {date_str}")
    html_content = create_daily_report_html(posts, date_str)
    filename = f"VitaInspire_Daily_Report_{date_str.replace(',','').replace(' ','_')}.html"
    
    result = upload_content_to_drive(service, html_content, filename, folders['daily'], 'text/html')
    print(f"✅ Uploaded: {result.get('webViewLink')}")
    return result


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--date', type=str, help='Date to upload')
    args = parser.parse_args()
    save_daily_report_to_drive(date_str=args.date)
