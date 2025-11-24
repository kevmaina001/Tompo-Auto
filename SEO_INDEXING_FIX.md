# SEO Indexing Fix - X-Robots-Tag noindex Issue

## Problem Identified

Google Search Console reported that your site pages have:
- **Status**: Page is not indexed: Excluded by 'noindex' tag
- **Issue**: No: 'noindex' detected in 'X-Robots-Tag' http header

This means an HTTP header was preventing Google from indexing your pages, even though your code had `index: true` in the metadata.

---

## Root Cause

The issue was likely caused by **Vercel deployment configuration**:

1. **Preview Deployments**: Vercel automatically adds `X-Robots-Tag: noindex` to preview deployments
2. **Production Configuration**: The site may have been deployed to a preview URL or the production environment wasn't properly configured

---

## Solution Applied

Updated `next.config.mjs` to explicitly control indexing headers:

```javascript
const nextConfig = {
  async headers() {
    // Only add noindex header on preview deployments, not production
    const isProduction = process.env.VERCEL_ENV === 'production';

    if (isProduction) {
      return []; // No noindex in production
    }

    // For preview/development, add noindex
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};
```

---

## Deployment Steps

### 1. Verify Production Environment Variables

In your Vercel dashboard:

1. Go to **Settings** > **Environment Variables**
2. Ensure these are set for **Production** only:
   - `NEXT_PUBLIC_SITE_URL` = `https://www.tomposauto.com`
   - `VERCEL_ENV` should automatically be set to `production` by Vercel

### 2. Deploy to Production

**Option A: Deploy from main/master branch**
```bash
git add .
git commit -m "Fix: Remove noindex header from production"
git push origin main
```

**Option B: Deploy specific branch to production**
1. In Vercel Dashboard: **Settings** > **Git**
2. Set **Production Branch** to your main branch (e.g., `main` or `master`)
3. Push your changes to that branch

### 3. Ensure Correct Domain Configuration

1. In Vercel: **Settings** > **Domains**
2. Confirm `www.tomposauto.com` is set as your **Primary Domain**
3. Ensure it's assigned to the **Production** environment (not Preview)

### 4. Force a Production Deployment

After pushing your changes:
1. Go to **Deployments** in Vercel
2. Find the latest deployment for `www.tomposauto.com`
3. Confirm it shows **Production** (not Preview)
4. If it shows "Preview", manually promote it:
   - Click the deployment
   - Click **Promote to Production**

---

## Verification Steps

After deploying, verify the fix:

### 1. Check Headers Directly

Use curl to check the headers:
```bash
curl -I https://www.tomposauto.com
```

Look for `X-Robots-Tag` in the response. It should **NOT** be present or should **NOT** contain `noindex`.

### 2. Test with Online Tools

- **Chrome DevTools**: Network tab > Select page > Headers > Response Headers
- **SEO Checker**: https://www.seobility.net/en/seocheck/
- **Header Checker**: https://www.webconfs.com/http-header-check.php

### 3. Request Re-indexing in Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property (`tomposauto.com`)
3. Go to **URL Inspection**
4. Test your URLs:
   - `https://www.tomposauto.com/`
   - `https://www.tomposauto.com/about`
   - Key product and category pages
5. For each URL:
   - Click **Test Live URL**
   - Once it passes, click **Request Indexing**

---

## Timeline for Changes

- **Header change**: Immediate after deployment
- **Google re-crawl**: 1-7 days (can request expedited crawling)
- **Full indexing**: 1-4 weeks for all pages

---

## Monitoring

Check these regularly in Google Search Console:

### Coverage Report
- **Path**: Index > Coverage
- **Watch for**: Pages moving from "Excluded" to "Indexed"

### URL Inspection
- Test individual URLs to see current indexing status
- Look for: "Page is indexed" instead of "Page is not indexed"

### Performance Report
- Monitor organic search traffic growth
- Check which queries bring users to your site

---

## Additional Recommendations

### 1. robots.txt Configuration
Your `robots.ts` is correctly configured. It allows Googlebot to crawl all public pages.

### 2. Sitemap Submission
Already done! Your sitemap at `https://www.tomposauto.com/sitemap.xml` includes:
- Homepage
- Product pages
- Category pages
- Blog posts
- Static pages (About, Contact, etc.)

### 3. Structured Data
Your site already has excellent structured data:
- Organization schema (JSON-LD)
- Product schemas
- Blog post schemas

### 4. Monitor Core Web Vitals
Keep track of:
- **LCP** (Largest Contentful Paint) - should be < 2.5s
- **FID** (First Input Delay) - should be < 100ms
- **CLS** (Cumulative Layout Shift) - should be < 0.1

---

## Troubleshooting

### If pages still show noindex after deployment:

1. **Clear Vercel cache**:
   ```bash
   # In Vercel Dashboard
   Settings > Functions > Clear Cache
   ```

2. **Verify environment**:
   - Check deployment logs for `VERCEL_ENV` value
   - Should be `production` for your main domain

3. **Check domain assignment**:
   - Ensure `www.tomposauto.com` isn't assigned to a Preview deployment
   - Only production deployments should use your main domain

4. **Redeploy**:
   ```bash
   # Trigger a fresh deployment
   git commit --allow-empty -m "Trigger redeploy"
   git push origin main
   ```

### If Google still reports noindex after 2 weeks:

1. **Manual review request**: Submit a reconsideration request in Search Console
2. **Check for conflicts**: Ensure no other plugins/middleware are adding headers
3. **Contact support**: Reach out to Vercel support if the issue persists

---

## Summary

**Changes made**:
- ✅ Updated `next.config.mjs` to prevent noindex headers in production
- ✅ Configuration now only adds noindex to preview/development deployments

**Next steps**:
1. Deploy these changes to production
2. Verify headers using curl or online tools
3. Request re-indexing in Google Search Console
4. Monitor indexing status over the next 1-2 weeks

**Expected outcome**:
- Production site at `www.tomposauto.com` will no longer send noindex headers
- Google will re-crawl and index your pages
- Your site will start appearing in Google search results

---

*Fix applied: November 2025*
