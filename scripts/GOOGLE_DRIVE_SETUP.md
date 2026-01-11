# VitaInspire Google Drive Automation Setup Guide

This guide explains how to set up automated saving of daily AI research and weekly summaries to Google Drive.

## 📋 Features

1. **Daily Reports**: Automatically saves each day's AI research to Google Drive as formatted HTML
2. **Weekly Summaries** (every Sunday):
   - 📄 **HTML Report**: Comprehensive summary with stats and key themes
   - 🎧 **Audio (Read Aloud)**: MP3 audio version for listening on the go
   - 📊 **Slide Deck**: PowerPoint presentation with key highlights
   - 🎨 **Infographic**: Visual summary image (PNG)

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
cd /Users/ramanatumuluri/Desktop/Vita\ website/scripts
pip install -r requirements.txt
```

### Step 2: Set Up Google Cloud Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable the **Google Drive API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Desktop app" as application type
   - Download the JSON file
5. Save the downloaded JSON file as:
   ```
   /Users/ramanatumuluri/Desktop/Vita website/scripts/credentials.json
   ```

### Step 3: First-Time Authentication

Run the setup script to authenticate and create folder structure:

```bash
cd /Users/ramanatumuluri/Desktop/Vita\ website/scripts
python google_drive_config.py
```

This will:
- Open a browser window for Google sign-in
- Create a `token.pickle` file for future authentication
- Create the folder structure in Google Drive:
  ```
  VitaInspire AI Reports/
  ├── Daily Reports/
  └── Weekly Summaries/
      ├── HTML/
      ├── Audio/
      ├── Slide Decks/
      └── Infographics/
  ```

### Step 4: Set Environment Variable

Make sure GEMINI_API_KEY is set for AI-powered summaries:

```bash
export GEMINI_API_KEY="your-api-key-here"
```

Add this to your `~/.zshrc` or `~/.bash_profile` for persistence.

## 📁 File Structure

```
scripts/
├── google_drive_config.py      # Google Drive authentication & utilities
├── save_daily_to_drive.py      # Daily report uploader
├── weekly_summary_generator.py # Weekly summary with all formats
├── run_automation.py           # Main orchestration script
├── daily_researcher.py         # Original daily research generator
├── requirements.txt            # Python dependencies
├── credentials.json            # Google OAuth credentials (you create)
└── token.pickle               # Auth token (auto-generated)
```

## 🔧 Usage

### Manual Run

```bash
cd /Users/ramanatumuluri/Desktop/Vita\ website/scripts

# Smart mode: daily always, weekly on Sundays
python run_automation.py --smart

# Just daily research
python run_automation.py --daily

# Just weekly summary (any day)
python run_automation.py --weekly

# Both
python run_automation.py --all
```

### Automated Schedule (Cron)

Edit your crontab:
```bash
crontab -e
```

Add these lines:
```cron
# Set environment variables
GEMINI_API_KEY=your-api-key-here

# Daily AI research at 8 AM
0 8 * * * cd /Users/ramanatumuluri/Desktop/Vita\ website/scripts && /usr/bin/python3 run_automation.py --daily >> /tmp/vitainspire_daily.log 2>&1

# Weekly summary on Sundays at 9 AM
0 9 * * 0 cd /Users/ramanatumuluri/Desktop/Vita\ website/scripts && /usr/bin/python3 run_automation.py --weekly >> /tmp/vitainspire_weekly.log 2>&1
```

### Using launchd (macOS recommended)

Create a plist file at `~/Library/LaunchAgents/com.vitainspire.automation.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.vitainspire.automation</string>
    <key>ProgramArguments</key>
    <array>
        <string>/usr/bin/python3</string>
        <string>/Users/ramanatumuluri/Desktop/Vita website/scripts/run_automation.py</string>
        <string>--smart</string>
    </array>
    <key>EnvironmentVariables</key>
    <dict>
        <key>GEMINI_API_KEY</key>
        <string>your-api-key-here</string>
    </dict>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>8</integer>
        <key>Minute</key>
        <integer>0</integer>
    </dict>
    <key>StandardOutPath</key>
    <string>/tmp/vitainspire.log</string>
    <key>StandardErrorPath</key>
    <string>/tmp/vitainspire_error.log</string>
</dict>
</plist>
```

Load it:
```bash
launchctl load ~/Library/LaunchAgents/com.vitainspire.automation.plist
```

## 📊 Google Drive Output

After running, you'll find:

### Daily Reports Folder
- `VitaInspire_Daily_Report_January_11_2026.html`
- `VitaInspire_Daily_Report_January_10_2026.html`
- ...

### Weekly Summaries
- **HTML/**: `Weekly_Summary_20260111.html`
- **Audio/**: `Weekly_Summary_20260111.mp3`
- **Slide Decks/**: `Weekly_Summary_20260111.pptx`
- **Infographics/**: `Weekly_Summary_20260111.png`

## 🔍 Troubleshooting

### "Credentials file not found"
- Make sure you downloaded the OAuth credentials from Google Cloud Console
- Save it as `credentials.json` in the scripts folder

### "Token expired"
- Delete `token.pickle` and run `python google_drive_config.py` again

### "gTTS/python-pptx/Pillow not installed"
- Run: `pip install -r requirements.txt`

### "No posts found for this week"
- Check that `blog-posts.js` has recent entries
- Verify date formats match (e.g., "January 11, 2026")

## 🎯 Next Steps

1. Set up Google Cloud credentials ✅
2. Run first-time authentication ✅  
3. Test manual run with `python run_automation.py --smart`
4. Set up automated scheduling with cron or launchd
5. Check Google Drive for uploaded reports

---

**Questions?** The automation is flexible - you can run individual components or the full pipeline as needed!
