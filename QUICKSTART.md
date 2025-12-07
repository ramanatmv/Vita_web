# 🚀 Quick Start Guide - VitaInspire Website

Welcome! This guide will help you get your VitaInspire website live in minutes.

## ⚡ Fastest Way to Go Live (5 minutes)

### Using Netlify (Drag & Drop):

1. **Go to** [netlify.com](https://app.netlify.com/drop)
2. **Drag** the entire "Vita website" folder onto the page
3. **Done!** Your site is live with a URL like `random-name-123.netlify.app`
4. **Optional**: Change site name in Settings → Site details

---

## 🌐 Using GitHub Pages (Free Forever)

### Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Repository name: `vitainspire-website`
3. Set to Public
4. **Don't** check "Add README"
5. Click "Create repository"

### Step 2: Push Your Code

Open Terminal and run these commands:

```bash
# Navigate to your website folder
cd "/Users/ramanatumuluri/Desktop/Vita website"

# Connect to your GitHub repository (replace YOUR-USERNAME)
git remote add origin https://github.com/YOUR-USERNAME/vitainspire-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Source", select: **main** branch
4. Click **Save**
5. Wait 2-3 minutes
6. Your site is live at: `https://YOUR-USERNAME.github.io/vitainspire-website/`

---

## 🧪 Test Locally First

Before deploying, test on your computer:

### Option 1: Simple Double-Click
- Just double-click `index.html`
- Opens in your default browser

### Option 2: Local Server (Better)

```bash
# Using Python (Mac/Linux - already installed)
cd "/Users/ramanatumuluri/Desktop/Vita website"
python3 -m http.server 8000

# Then open: http://localhost:8000
```

---

## ✏️ Making Changes

### Update Content:
1. Edit `index.html` for text changes
2. Edit `css/styles.css` for styling
3. Edit `js/main.js` for functionality

### Update & Redeploy:
```bash
cd "/Users/ramanatumuluri/Desktop/Vita website"
git add .
git commit -m "Updated content"
git push origin main
# Site updates automatically!
```

---

## 📧 Important: Update Email Addresses

Before going live, update these in `index.html`:

- `info@vitainspire.org` → Your actual email
- `careers@vitainspire.org` → Your careers email
- `partners@vitainspire.org` → Your partnerships email
- `donate@vitainspire.org` → Your donation email

**Find & Replace** is your friend! (Cmd+Shift+F in most editors)

---

## 🎨 Customization Quick Tips

### Change Colors:
Edit `css/styles.css`, lines 17-23:
```css
:root {
    --primary: #667eea;    /* Main purple */
    --secondary: #764ba2;   /* Second purple */
    --accent: #f093fb;      /* Pink accent */
}
```

### Add Your Logo:
1. Replace `assets/images/favicon.png` with your logo
2. Update line 62 in `index.html` if needed

### Update Stats:
Edit lines 85-104 in `index.html`

---

## 📱 Custom Domain Setup

### If you have a domain (like vitainspire.org):

#### For GitHub Pages:
1. Create file `CNAME` in root folder with your domain:
   ```
   vitainspire.org
   ```
2. In your domain registrar's DNS settings:
   - Add A record pointing to: `185.199.108.153`
   - Add CNAME for www pointing to: `YOUR-USERNAME.github.io`

#### For Netlify:
1. Go to Site Settings → Domain Management
2. Click "Add custom domain"
3. Follow the instructions

---

## ✅ Pre-Launch Checklist

- [ ] Test on Chrome, Safari, Firefox
- [ ] Test on mobile device
- [ ] Update all email addresses
- [ ] Check all links work
- [ ] Test form submission
- [ ] Add Google Analytics (optional)
- [ ] Update social media links
- [ ] Proofread all content

---

## 🆘 Need Help?

### Common Issues:

**CSS not loading?**
- Clear browser cache (Cmd+Shift+R on Mac)
- Check file paths in index.html

**Images not showing?**
- Verify images are in `assets/images/` folder
- Check filenames match exactly

**Form not working?**
- See DEPLOYMENT.md for form setup instructions
- Consider using Netlify Forms (easiest)

### Resources:
- Full deployment guide: See `DEPLOYMENT.md`
- README: See `README.md`
- GitHub Pages docs: [docs.github.com/pages](https://docs.github.com/pages)

---

## 🎉 You're Ready!

Your website is production-ready and optimized. Choose a deployment method above and go live!

**Questions?** Check the DEPLOYMENT.md file for more detailed instructions.

**Good luck with VitaInspire! 🚀❤️**
