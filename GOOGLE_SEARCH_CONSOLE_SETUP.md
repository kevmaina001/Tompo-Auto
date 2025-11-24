# Google Search Console Setup Guide for Tompo's Auto

This guide will help you set up Google Search Console for **tomposauto.com** to improve your SEO and monitor your site's performance in Google Search.

## Prerequisites

- A Google account
- Access to your domain's DNS settings OR ability to add files to your website
- Your website deployed at `https://www.tomposauto.com`

---

## Step 1: Access Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Sign in with your Google account
3. Click **"Add Property"**

---

## Step 2: Add Your Property

You'll see two options:

### Option A: Domain Property (Recommended)
- Enter: `tomposauto.com`
- This covers all subdomains (www, blog, etc.) and both http/https

### Option B: URL Prefix Property
- Enter: `https://www.tomposauto.com`
- Only covers this specific URL pattern

**Recommendation:** Choose **Domain Property** for comprehensive coverage.

---

## Step 3: Verify Ownership

### Method 1: DNS Verification (For Domain Property)

1. Google will provide a TXT record like:
   ```
   google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```

2. Add this TXT record to your domain's DNS settings:
   - Log into your domain registrar (e.g., GoDaddy, Namecheap, Cloudflare)
   - Go to DNS Management
   - Add a new TXT record:
     - **Type:** TXT
     - **Host/Name:** @ (or leave blank)
     - **Value:** The verification string from Google
     - **TTL:** 3600 (or default)

3. Click **Verify** in Google Search Console
4. DNS changes may take up to 48 hours to propagate

### Method 2: HTML Meta Tag (For URL Prefix)

1. Google will provide a meta tag like:
   ```html
   <meta name="google-site-verification" content="XXXXXXXXXXXX" />
   ```

2. Add this to your `app/layout.tsx` in the metadata:
   ```typescript
   export const metadata: Metadata = {
     // ... existing metadata
     verification: {
       google: "XXXXXXXXXXXX", // Your verification code
     },
   };
   ```

3. Deploy your site and click **Verify**

### Method 3: HTML File Upload

1. Download the HTML verification file from Google
2. Place it in your `public` folder:
   ```
   frontend/public/googleXXXXXXXXXXXX.html
   ```
3. Deploy and verify

---

## Step 4: Submit Your Sitemap

Once verified:

1. In Google Search Console, go to **Sitemaps** (left sidebar)
2. Enter your sitemap URL: `sitemap.xml`
3. Click **Submit**

Your sitemap is automatically generated at:
```
https://www.tomposauto.com/sitemap.xml
```

This includes:
- Homepage and static pages
- All product pages
- All category pages
- All published blog posts

---

## Step 5: Set Up Environment Variable

Add this environment variable to your Vercel project:

1. Go to [Vercel Dashboard](https://vercel.com)
2. Select your project
3. Go to **Settings** > **Environment Variables**
4. Add:
   - **Name:** `NEXT_PUBLIC_SITE_URL`
   - **Value:** `https://www.tomposauto.com`
5. Redeploy your site

---

## Step 6: Request Indexing (Optional)

To speed up indexing of important pages:

1. Go to **URL Inspection** in Search Console
2. Enter a URL (e.g., `https://www.tomposauto.com`)
3. Click **Request Indexing**

Do this for:
- Homepage
- Main category pages
- Key product pages
- Blog posts

---

## Step 7: Monitor Performance

After a few days, check:

### Performance Report
- **Queries:** What people search to find your site
- **Pages:** Which pages get the most clicks
- **Countries:** Where your visitors come from
- **Devices:** Mobile vs desktop traffic

### Coverage Report
- **Valid:** Pages successfully indexed
- **Errors:** Pages with indexing issues
- **Excluded:** Pages intentionally not indexed

### Core Web Vitals
- **LCP:** Largest Contentful Paint (loading)
- **FID:** First Input Delay (interactivity)
- **CLS:** Cumulative Layout Shift (visual stability)

---

## Recommended Actions After Setup

### 1. Link Google Analytics
Connect Search Console to Google Analytics for combined insights:
- In Search Console: **Settings** > **Associations** > **Google Analytics**

### 2. Add Users (If Needed)
Share access with team members:
- **Settings** > **Users and permissions** > **Add user**

### 3. Set Up Email Alerts
Stay informed about issues:
- **Settings** > **Email preferences** > Enable notifications

### 4. Create Social Media Profiles
Claim your business on:
- Google Business Profile (for local SEO)
- Facebook Business
- LinkedIn Company Page

---

## Troubleshooting

### Sitemap Not Found
- Ensure `NEXT_PUBLIC_SITE_URL` is set in Vercel
- Check `https://www.tomposauto.com/sitemap.xml` is accessible
- Redeploy after adding environment variable

### Pages Not Indexing
- Check robots.txt isn't blocking: `https://www.tomposauto.com/robots.txt`
- Ensure pages don't have `noindex` meta tags
- Request indexing manually in URL Inspection

### Verification Failing
- Wait 24-48 hours for DNS propagation
- Double-check the verification code is correct
- Try an alternative verification method

---

## SEO Features Already Implemented

Your website already has:

- [x] Dynamic sitemap with all pages
- [x] robots.txt configuration
- [x] JSON-LD structured data (Organization, Product, Blog)
- [x] Open Graph meta tags for social sharing
- [x] Twitter Card meta tags
- [x] Dynamic page titles
- [x] Meta descriptions with keywords
- [x] Canonical URLs

---

## Next Steps for Better SEO

1. **Create quality content** - Regular blog posts about auto parts
2. **Build backlinks** - Get listed on Kenya business directories
3. **Optimize images** - Add alt text to all product images
4. **Get reviews** - Encourage customers to leave Google reviews
5. **Local SEO** - Set up Google Business Profile for Nairobi location

---

## Useful Links

- [Google Search Console](https://search.google.com/search-console)
- [Google Search Central Documentation](https://developers.google.com/search/docs)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [PageSpeed Insights](https://pagespeed.web.dev/)

---

*Last updated: November 2025*
