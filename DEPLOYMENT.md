# VitaInspire Website - Deployment Guide

This guide will help you deploy your VitaInspire website to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [x] All files are properly organized
- [x] CSS and JS are in separate files
- [x] Images are optimized
- [x] README.md is complete
- [x] .gitignore is configured
- [ ] Test website locally
- [ ] Update contact email addresses
- [ ] Add analytics code (optional)

## 🚀 Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

Perfect for static websites. Free hosting with HTTPS.

#### Steps:

1. **Initialize Git repository** (if not already done):
   ```bash
   cd "/Users/ramanatumuluri/Desktop/Vita website"
   git init
   git add .
   git commit -m "Initial commit: VitaInspire website"
   ```

2. **Create GitHub repository**:
   - Go to [github.com](https://github.com)
   - Click "New repository"
   - Name it `vita-website` or `vitainspire`
   - Don't initialize with README (we already have one)
   - Click "Create repository"

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/vita-website.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: Select `main` branch
   - Folder: Select `/ (root)`
   - Click Save
   - Your site will be live at: `https://YOUR-USERNAME.github.io/vita-website/`

5. **Custom Domain (Optional)**:
   - Add a `CNAME` file with your domain
   - Configure DNS settings with your domain provider

---

### Option 2: Netlify (Recommended - Free)

Simple drag-and-drop deployment with continuous deployment from Git.

#### Steps:

1. **Sign up** at [netlify.com](https://netlify.com)

2. **Deploy via Git**:
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings: Leave empty (static site)
   - Click "Deploy site"

3. **Or Deploy via Drag & Drop**:
   - Simply drag the entire "Vita website" folder to Netlify dashboard
   - Site goes live immediately!

4. **Custom Domain**:
   - Go to Site Settings → Domain Management
   - Add custom domain
   - Follow DNS configuration instructions

#### Netlify Features:
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Form handling (for your idea submission form)
- ✅ Free custom domain support

---

### Option 3: Vercel (Alternative - Free)

Similar to Netlify, optimized for frontend projects.

#### Steps:

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   cd "/Users/ramanatumuluri/Desktop/Vita website"
   vercel
   ```
   - Follow the prompts
   - Your site goes live immediately

3. **Or Deploy via Dashboard**:
   - Go to [vercel.com](https://vercel.com)
   - Import your Git repository
   - Automatic deployment on every push

---

### Option 4: Traditional Web Hosting

If you have cPanel or traditional hosting:

1. **Compress files**:
   ```bash
   cd "/Users/ramanatumuluri/Desktop"
   zip -r vitainspire-website.zip "Vita website"
   ```

2. **Upload via FTP/cPanel**:
   - Connect to your hosting via FTP or cPanel File Manager
   - Upload all files to `public_html` or `www` directory
   - Ensure `index.html` is in the root

3. **File permissions**:
   - Set folders to 755
   - Set files to 644

---

## 🔧 Post-Deployment Configuration

### 1. Form Submission Setup

The contact form currently logs to console. To enable real submissions:

#### Using Netlify Forms (Easiest):
Add `netlify` attribute to your form in `index.html`:
```html
<form name="idea-submission" method="POST" data-netlify="true" onsubmit="submitIdea(event)">
```

#### Using Formspree (Alternative):
1. Sign up at [formspree.io](https://formspree.io)
2. Update form action:
```html
<form action="https://formspree.io/f/YOUR-FORM-ID" method="POST">
```

#### Using Custom Backend:
Update `js/main.js` to point to your API endpoint.

### 2. Analytics Setup (Optional)

Add Google Analytics to track visitors:

1. Get tracking ID from [analytics.google.com](https://analytics.google.com)
2. Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 3. Email Addresses

Update email addresses in `index.html`:
- Line with `mailto:info@vitainspire.org`
- Line with `mailto:careers@vitainspire.org`
- Line with `mailto:partners@vitainspire.org`

Replace with your actual email addresses.

### 4. SEO Optimization

After deployment:
- Submit sitemap to Google Search Console
- Add `robots.txt` file
- Create `sitemap.xml`
- Verify social media meta tags

---

## ✅ Testing Your Deployment

1. **Open your live URL**
2. **Test all links** (navigation, buttons, forms)
3. **Test on mobile devices**
4. **Check page load speed**:
   - Use [PageSpeed Insights](https://pagespeed.web.dev/)
   - Should score 90+ on all metrics

5. **Verify SEO**:
   - Check meta tags are loading
   - Verify Open Graph tags for social sharing
   - Test with [SEO Checker](https://www.seobility.net/en/seocheck/)

---

## 🔄 Updating Your Website

### If using GitHub Pages/Netlify/Vercel:
```bash
# Make your changes to files
git add .
git commit -m "Description of changes"
git push origin main
# Site automatically updates!
```

### If using traditional hosting:
- Make changes locally
- Re-upload changed files via FTP/cPanel

---

## 🆘 Troubleshooting

### CSS/JS not loading?
- Check file paths are correct
- Ensure files are uploaded to correct folders
- Clear browser cache

### Form not working?
- Enable Netlify forms or
- Set up Formspree or
- Configure custom backend

### Images not showing?
- Verify images are in `assets/images/` folder
- Check image file names match HTML references
- Ensure proper file permissions (644)

---

## 📱 Custom Domain Setup

### For GitHub Pages:
1. Add CNAME file with your domain
2. In domain registrar, add DNS records:
   ```
   Type: A
   Host: @
   Value: 185.199.108.153
   
   Type: CNAME
   Host: www
   Value: YOUR-USERNAME.github.io
   ```

### For Netlify/Vercel:
Follow in-dashboard instructions for custom domains.

---

## 🎉 You're Live!

Once deployed, share your website:
- Social media
- Email signatures
- Business cards
- NGO directories

**Your VitaInspire website is now ready to make an impact! 🚀❤️**

---

## Need Help?

- GitHub Pages: [docs.github.com/pages](https://docs.github.com/pages)
- Netlify Support: [docs.netlify.com](https://docs.netlify.com)
- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
