import os
import datetime
import json
import random
import re
import textwrap

# You need these libraries: 
# pip install google-generativeai duckduckgo-search

try:
    import google.generativeai as genai
    try:
        from duckduckgo_search import DDGS # Old package
    except ImportError:
        from ddgs import DDGS # New package possibly? Or maybe the package name is ddgs but module is different?
        # Actually, let's just stick to the specific error: "Error: Missing libraries..."
        # This catch-all except marks it as missing. 
        # I want to see the REAL error.
except ImportError as e:
    print(f"Error: Missing libraries. {e}")
    exit(1)

# Configuration
API_KEY = os.environ.get("GEMINI_API_KEY")
BLOG_FILE_PATH = "js/blog-posts.js"

TOPICS = [
    "AI in Agriculture India",
    "AI in Healthcare India Rural",
    "AI in Education India Schools",
    "AI for Women Safety India",
    "AI for Climate Change India",
    "AI in Governance India",
    "AI for Disabilities India"
]

def search_web(query):
    """Searches the web for recent results."""
    print(f"Searching for: {query}...")
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, region='in-en', max_results=5, timelimit='m'))
            return results
    except Exception as e:
        print(f"Search failed: {e}")
        return []

def generate_blog_content(topic, search_results):
    """Uses Gemini to generate the blog post content."""
    if not API_KEY:
        print("Error: GEMINI_API_KEY environment variable not set.")
        return None

    genai.configure(api_key=API_KEY)
    print("Initializing GenerativeModel with: gemini-2.5-flash")
    model = genai.GenerativeModel('gemini-2.5-flash')

    search_context = "\n".join([f"- {r['title']}: {r['body']} (Link: {r['href']})" for r in search_results])
    
    today = datetime.datetime.now().strftime("%B %d, %Y")
    
    prompt = f"""
    You are an expert AI journalist for 'VitaInspire', a social impact organization.
    Write a short, inspiring blog post about '{topic}'.
    
    Use these recent search results for context (cite specific examples if possible):
    {search_context}
    
    Format the output EXACTLY as a JSON object with the following fields:
    - title: A catchy, inspiring title.
    - excerpt: A 1-2 sentence summary.
    - content: The full blog post as an HTML string (no markdown, just tags like <h3>, <p>, <ul>, <li>). Do NOT include the title in the content.
    - category: The broad sector (e.g., "Health", "Agriculture").
    
    Keep the tone professional, optimistic, and focused on social impact in India.
    The 'content' HTML should use <h3> for subheadings.
    """

    print("Generating content with AI...")
    response = model.generate_content(prompt, generation_config={"response_mime_type": "application/json"})
    
    try:
        return json.loads(response.text)
    except Exception as e:
        print(f"JSON parsing failed: {e}")
        print("Raw response:", response.text)
        return None

def update_blog_file(post_data):
    """Updates the blog-posts.js file."""
    if not post_data:
        return

    today_str = datetime.datetime.now().strftime("%B %d, %Y")
    id_str = f"post-{datetime.datetime.now().strftime('%Y%m%d')}-{random.randint(100,999)}"
    
    # Create the JS object string
    new_entry = f"""
    {{
        id: "{id_str}",
        title: "{post_data['title']}",
        date: "{today_str}",
        category: "{post_data['category']}",
        author: "VitaInspire AI",
        excerpt: "{post_data['excerpt']}",
        content: `
{textwrap.indent(post_data['content'], '            ')}
        `
    }},"""

    try:
        with open(BLOG_FILE_PATH, 'r') as f:
            content = f.read()
        
        # Look for the insertion marker
        marker = "// INSERT_NEW_POST_HERE"
        if marker in content:
            updated_content = content.replace(marker, f"{marker}\n{new_entry}")
            
            with open(BLOG_FILE_PATH, 'w') as f:
                f.write(updated_content)
            print("Successfully updated blog-posts.js")
        else:
            print("Error: Insertion marker not found in blog-posts.js")
            
    except Exception as e:
        print(f"File update failed: {e}")

def main():
    # 1. Pick a random topic to ensure variety
    topic = random.choice(TOPICS)
    
    # 2. Search for recent news
    search_results = search_web(f"latest {topic} case studies 2024 2025")
    
    if not search_results:
        # Fallback if search fails
        search_results = [{"title": "General Knowledge", "body": "Uses general knowledge about AI impact.", "href": "#"}]

    # 3. Generate content
    content = generate_blog_content(topic, search_results)
    
    # 4. Update file
    if content:
        update_blog_file(content)

if __name__ == "__main__":
    main()
