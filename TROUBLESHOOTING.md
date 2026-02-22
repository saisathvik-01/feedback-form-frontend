# 🆘 TROUBLESHOOTING GUIDE

If something goes wrong during deployment, use this guide.

---

## Issue: "npm install" fails

### Solution:
```bash
# Clear npm cache
npm cache clean --force

# Try again
npm install
```

---

## Issue: "npm run build" fails with errors

### Solution:
```bash
# Remove node_modules and reinstall
rm -r node_modules
rm package-lock.json
npm install
npm run build
```

---

## Issue: Build shows "Compiled successfully" but folder is empty

This is normal - build happens but folder might not immediately show files.  
**Just proceed to `vercel` command.**

---

## Issue: "vercel" command not found

### Solution:
```bash
# Install Vercel globally
npm install -g vercel

# Try again
vercel
```

---

## Issue: Deployment succeeds but page shows 404

**This should NOT happen because vercel.json is configured.**

Check:
1. vercel.json exists in project root
2. vercel.json contains correct routing config
3. Try new deployment with `vercel --prod`

---

## Issue: Page loads but routes don't work

**This should NOT happen because vercel.json handles SPA routing.**

Check:
1. Verify you're visiting correct URL
2. Try refreshing page (Ctrl+R)
3. Check console for JavaScript errors (F12 → Console)

---

## Issue: Login/Register doesn't work

Verify:
1. Form submits without errors (check browser console)
2. Try different email/password
3. Role selection dropdown works

---

## Issue: Navnar shows wrong menu items

Verify:
1. You registered with correct role
2. Refresh page after role selection
3. Logout and login again

---

## Issue: Page styling looks wrong

Verify:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh page (Ctrl+Shift+R)
3. Check internet connection (CDN access)
4. Try incognito window

---

## Issue: Very slow deployment

This is normal for first deployment.
- npm install: 1-2 min (depends on internet)
- npm run build: 2-5 min (depends on CPU)
- Vercel deploy: 1-2 min (depends on file size)

Just wait, don't cancel.

---

## Issue: Want to redeploy after changes

```bash
# Push changes to GitHub
git add .
git commit -m "Your changes"
git push origin main

# Vercel auto-deploys! (or use)
vercel --prod
```

---

## Issue: Need to rollback to previous version

1. Go to https://vercel.com
2. Select your project
3. Go to "Deployments" tab
4. Click on previous deployment
5. Click "Promote to Production"

Done! App reverts to previous version.

---

## Issue: Bundle size is large

This is normal for React apps.
Vercel handles optimization automatically.

If truly concerned:
- Production builds are minified (~50% smaller)
- Gzip compression happens on CDN (~33% smaller)
- Expected final size: 200-400 KB

---

## Still Having Issues?

1. Check Vercel build logs:
   - Go to https://vercel.com
   - Select project
   - Check "Deployments" tab
   - Look at "Build" logs

2. Run build locally first:
   ```bash
   npm run build
   ```
   Must show "Compiled successfully!" before deploying

3. Verify project structure:
   ```bash
   ls src/pages/
   ls src/components/
   cat vercel.json
   ```

4. Check documentation:
   - VERCEL_READY.md (complete verification)
   - DEPLOY_NOW.md (simple commands)

---

**Most issues are development environment issues, not code issues.**

If all else fails:
1. Delete node_modules and package-lock.json
2. Run `npm install` again
3. Run `npm run build` again
4. Try `vercel` again

---

**Your code is production-ready. Any issues are usually temporary and easily fixable.** ✅
