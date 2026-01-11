"""
VitaInspire AI Research Automation Runner

This script orchestrates all automated tasks:
1. Daily: Generate AI research and save to Google Drive
2. Weekly (Sunday): Generate weekly summary with all formats

Setup:
1. Install dependencies: pip install -r requirements.txt
2. Set up Google Drive credentials (see google_drive_config.py)
3. Set environment variable: GEMINI_API_KEY

Scheduling (cron examples):
# Daily at 8 AM
0 8 * * * cd /path/to/scripts && python run_automation.py --daily

# Weekly on Sunday at 9 AM
0 9 * * 0 cd /path/to/scripts && python run_automation.py --weekly

# Both (recommended for Sunday)
0 8 * * * cd /path/to/scripts && python run_automation.py --daily
0 9 * * 0 cd /path/to/scripts && python run_automation.py --weekly
"""

import argparse
import datetime
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).parent


def run_daily_research():
    """Generate daily AI research and save to Drive."""
    print("\n" + "="*60)
    print("🌅 RUNNING DAILY AI RESEARCH PIPELINE")
    print("="*60 + "\n")
    
    # Step 1: Generate new blog post
    print("Step 1: Generating new AI research post...")
    try:
        import daily_researcher
        daily_researcher.main()
        print("✅ New research post generated\n")
    except Exception as e:
        print(f"❌ Failed to generate research: {e}\n")
        return False
    
    # Step 2: Generate infographic and audio for new posts
    print("Step 2: Generating blog visuals (infographic + audio)...")
    try:
        from generate_blog_visuals import generate_blog_assets, generate_assets_manifest
        generated = generate_blog_assets(regenerate=False)  # Only generate for new posts
        generate_assets_manifest()
        print(f"✅ Generated {generated['infographics']} infographics, {generated['audio']} audio files\n")
    except Exception as e:
        print(f"⚠️ Blog visuals generation failed (non-critical): {e}\n")
    
    # Step 3: Save to Google Drive
    print("Step 3: Uploading to Google Drive...")
    try:
        from save_daily_to_drive import save_daily_report_to_drive
        result = save_daily_report_to_drive()
        if result:
            print("✅ Daily report uploaded to Google Drive\n")
        else:
            print("⚠️ No posts found for today\n")
    except Exception as e:
        print(f"❌ Failed to upload to Drive: {e}\n")
        return False
    
    return True


def run_weekly_summary():
    """Generate weekly summary with all formats."""
    print("\n" + "="*60)
    print("📊 RUNNING WEEKLY SUMMARY PIPELINE")
    print("="*60 + "\n")
    
    try:
        from weekly_summary_generator import generate_weekly_summary_and_upload
        generate_weekly_summary_and_upload()
        print("✅ Weekly summary complete\n")
        return True
    except Exception as e:
        print(f"❌ Failed to generate weekly summary: {e}\n")
        return False


def run_smart():
    """
    Smart mode: Run daily always, run weekly on Sundays.
    """
    today = datetime.datetime.now()
    is_sunday = today.weekday() == 6
    
    print(f"\n🗓️ Today is {today.strftime('%A, %B %d, %Y')}")
    
    # Always run daily
    daily_success = run_daily_research()
    
    # Run weekly on Sundays
    if is_sunday:
        print("\n📅 It's Sunday! Generating weekly summary...")
        weekly_success = run_weekly_summary()
    else:
        print("\n📅 Weekly summary runs on Sundays only.")
        weekly_success = True
    
    return daily_success and weekly_success


def main():
    parser = argparse.ArgumentParser(
        description="VitaInspire AI Research Automation",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python run_automation.py --smart     # Daily always, weekly on Sundays
  python run_automation.py --daily     # Just daily research
  python run_automation.py --weekly    # Just weekly summary
  python run_automation.py --all       # Both daily and weekly
        """
    )
    
    parser.add_argument('--daily', action='store_true', 
                        help='Run daily research generation and upload')
    parser.add_argument('--weekly', action='store_true',
                        help='Run weekly summary generation')
    parser.add_argument('--all', action='store_true',
                        help='Run both daily and weekly')
    parser.add_argument('--smart', action='store_true',
                        help='Smart mode: daily always, weekly on Sundays')
    
    args = parser.parse_args()
    
    # Default to smart mode if no args
    if not (args.daily or args.weekly or args.all or args.smart):
        args.smart = True
    
    print("\n" + "🚀"*20)
    print("\n  VITAINSPIRE AI RESEARCH AUTOMATION")
    print(f"  Started at: {datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n" + "🚀"*20)
    
    success = True
    
    if args.smart:
        success = run_smart()
    elif args.all:
        success = run_daily_research() and run_weekly_summary()
    else:
        if args.daily:
            success = run_daily_research() and success
        if args.weekly:
            success = run_weekly_summary() and success
    
    print("\n" + "="*60)
    if success:
        print("✅ ALL TASKS COMPLETED SUCCESSFULLY")
    else:
        print("⚠️ SOME TASKS FAILED - Check logs above")
    print("="*60 + "\n")
    
    return 0 if success else 1


if __name__ == "__main__":
    sys.exit(main())
