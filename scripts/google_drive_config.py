"""
Google Drive Configuration and Authentication Module

This module handles authentication and basic operations for Google Drive integration.
You need to set up Google Cloud Console credentials first:

1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable Google Drive API
4. Create OAuth 2.0 credentials (Desktop App)
5. Download the credentials JSON file and save as 'credentials.json' in this directory

First-time setup:
    pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib

Environment variables needed:
    GOOGLE_DRIVE_FOLDER_ID: The ID of the folder where files will be saved
"""

import os
import pickle
from pathlib import Path
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseUpload
import io

# If modifying these scopes, delete the token.pickle file
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Directory where credentials are stored
SCRIPT_DIR = Path(__file__).parent
CREDENTIALS_PATH = SCRIPT_DIR / 'credentials.json'
TOKEN_PATH = SCRIPT_DIR / 'token.pickle'


def get_google_drive_service():
    """
    Get an authenticated Google Drive service instance.
    
    Returns:
        googleapiclient.discovery.Resource: Authenticated Drive service
    """
    creds = None
    
    # Load existing token if available
    if TOKEN_PATH.exists():
        with open(TOKEN_PATH, 'rb') as token:
            creds = pickle.load(token)
    
    # If no valid credentials, get new ones
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not CREDENTIALS_PATH.exists():
                raise FileNotFoundError(
                    f"Credentials file not found at {CREDENTIALS_PATH}. "
                    "Please download OAuth credentials from Google Cloud Console."
                )
            flow = InstalledAppFlow.from_client_secrets_file(
                str(CREDENTIALS_PATH), SCOPES
            )
            creds = flow.run_local_server(port=0)
        
        # Save the credentials for next run
        with open(TOKEN_PATH, 'wb') as token:
            pickle.dump(creds, token)
    
    return build('drive', 'v3', credentials=creds)


def get_or_create_folder(service, folder_name, parent_id=None):
    """
    Get or create a folder in Google Drive.
    
    Args:
        service: Google Drive service instance
        folder_name: Name of the folder
        parent_id: Optional parent folder ID
        
    Returns:
        str: Folder ID
    """
    # Search for existing folder
    query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
    if parent_id:
        query += f" and '{parent_id}' in parents"
    
    results = service.files().list(
        q=query,
        spaces='drive',
        fields='files(id, name)'
    ).execute()
    
    files = results.get('files', [])
    
    if files:
        return files[0]['id']
    
    # Create new folder
    file_metadata = {
        'name': folder_name,
        'mimeType': 'application/vnd.google-apps.folder'
    }
    if parent_id:
        file_metadata['parents'] = [parent_id]
    
    folder = service.files().create(
        body=file_metadata,
        fields='id'
    ).execute()
    
    print(f"Created folder: {folder_name}")
    return folder.get('id')


def upload_file_to_drive(service, file_path, folder_id, mime_type=None):
    """
    Upload a file to Google Drive.
    
    Args:
        service: Google Drive service instance
        file_path: Path to the file to upload
        folder_id: Target folder ID
        mime_type: Optional MIME type (auto-detected if not provided)
        
    Returns:
        dict: File metadata including ID and webViewLink
    """
    file_path = Path(file_path)
    file_name = file_path.name
    
    if mime_type is None:
        extension = file_path.suffix.lower()
        mime_types = {
            '.pdf': 'application/pdf',
            '.html': 'text/html',
            '.json': 'application/json',
            '.txt': 'text/plain',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.mp3': 'audio/mpeg',
            '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        }
        mime_type = mime_types.get(extension, 'application/octet-stream')
    
    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }
    
    media = MediaFileUpload(str(file_path), mimetype=mime_type)
    
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, name, webViewLink'
    ).execute()
    
    print(f"Uploaded: {file_name} -> {file.get('webViewLink')}")
    return file


def upload_content_to_drive(service, content, file_name, folder_id, mime_type='text/html'):
    """
    Upload content directly to Google Drive (without saving to local file first).
    
    Args:
        service: Google Drive service instance
        content: String or bytes content to upload
        file_name: Name for the file
        folder_id: Target folder ID
        mime_type: MIME type of the content
        
    Returns:
        dict: File metadata including ID and webViewLink
    """
    if isinstance(content, str):
        content = content.encode('utf-8')
    
    file_metadata = {
        'name': file_name,
        'parents': [folder_id]
    }
    
    media = MediaIoBaseUpload(
        io.BytesIO(content),
        mimetype=mime_type
    )
    
    file = service.files().create(
        body=file_metadata,
        media_body=media,
        fields='id, name, webViewLink'
    ).execute()
    
    print(f"Uploaded: {file_name} -> {file.get('webViewLink')}")
    return file


def setup_vitainspire_folders(service, root_folder_id=None):
    """
    Create the folder structure for VitaInspire reports.
    
    Structure:
        VitaInspire AI Reports/
        ├── Daily Reports/
        └── Weekly Summaries/
            ├── HTML/
            ├── Audio/
            ├── Slide Decks/
            └── Infographics/
    
    Args:
        service: Google Drive service instance
        root_folder_id: Optional parent folder ID (uses root if not provided)
        
    Returns:
        dict: Dictionary with folder IDs
    """
    folders = {}
    
    # Main folder
    main_folder_id = get_or_create_folder(service, "VitaInspire AI Reports", root_folder_id)
    folders['main'] = main_folder_id
    
    # Daily reports folder
    folders['daily'] = get_or_create_folder(service, "Daily Reports", main_folder_id)
    
    # Weekly summaries folder
    weekly_folder_id = get_or_create_folder(service, "Weekly Summaries", main_folder_id)
    folders['weekly'] = weekly_folder_id
    
    # Sub-folders for weekly summaries
    folders['weekly_html'] = get_or_create_folder(service, "HTML", weekly_folder_id)
    folders['weekly_audio'] = get_or_create_folder(service, "Audio", weekly_folder_id)
    folders['weekly_slides'] = get_or_create_folder(service, "Slide Decks", weekly_folder_id)
    folders['weekly_infographics'] = get_or_create_folder(service, "Infographics", weekly_folder_id)
    
    return folders


if __name__ == "__main__":
    # Test the connection
    print("Testing Google Drive connection...")
    try:
        service = get_google_drive_service()
        folders = setup_vitainspire_folders(service)
        print("\n✅ Google Drive setup complete!")
        print("\nFolder IDs:")
        for name, folder_id in folders.items():
            print(f"  {name}: {folder_id}")
    except Exception as e:
        print(f"❌ Error: {e}")
