# UmojaHub - Troubleshooting Guide

## 🔧 Common Setup Issues and Solutions

### Issue 1: "A 'tsconfig.json' file is already defined"

**Error Message:**
```
error TS5054: A 'tsconfig.json' file is already defined at: 'C:/LocalProjects/umojaHub/tsconfig.json'.
```

**Solution:**
✅ **This is NOT an error!** The tsconfig.json file is already created and properly configured. You don't need to run `npx tsc --init` again.

---

### Issue 2: "Cannot find module 'tailwindcss'"

**Error Message:**
```
Error: Cannot find module 'tailwindcss'
```

**Root Cause:**
The development dependencies (TypeScript, Tailwind CSS, etc.) were not installed.

**Solution:**
Run this command in your terminal:

```bash
npm install -D typescript @types/react @types/node @types/react-dom tailwindcss postcss autoprefixer eslint eslint-config-next
```

**Wait for installation to complete** (this may take 2-5 minutes depending on your internet speed).

**Verify installation:**
After installation, check that `node_modules` folder exists and contains the packages. Your `package.json` should now have a `devDependencies` section:

```json
"devDependencies": {
  "@types/node": "^...",
  "@types/react": "^...",
  "@types/react-dom": "^...",
  "autoprefixer": "^...",
  "eslint": "^...",
  "eslint-config-next": "^...",
  "postcss": "^...",
  "tailwindcss": "^...",
  "typescript": "^..."
}
```

---

### Issue 3: "Invalid next.config.js options detected"

**Error Message:**
```
⚠ Invalid next.config.js options detected: 
⚠     Unrecognized key(s) in object: 'swcMinify'
```

**Solution:**
✅ **Already fixed!** The `swcMinify` option has been removed from `next.config.js`. This option is enabled by default in Next.js 15 and doesn't need to be specified.

---

### Issue 4: Watchpack Errors (Windows System Files)

**Error Messages:**
```
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\hiberfil.sys'
Watchpack Error (initial scan): Error: EINVAL: invalid argument, lstat 'C:\pagefile.sys'
```

**Solution:**
✅ **These warnings can be safely ignored.** They occur because Next.js tries to watch system files that are locked by Windows. They don't affect functionality.

**Optional Fix (to hide warnings):**
Create/update `next.config.js` with:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true,
  // Ignore Windows system files
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        '**/node_modules',
        '**/.git',
        '**/C:/hiberfil.sys',
        '**/C:/pagefile.sys',
        '**/C:/swapfile.sys',
        '**/C:/DumpStack.log.tmp',
        '**/C:/System Volume Information',
      ],
    };
    return config;
  },
}

module.exports = nextConfig
```

---

### Issue 5: Port 3000 Already in Use

**Error Message:**
```
⚠ Port 3000 is in use by process 2884, using available port 3001 instead.
```

**Solution:**
This is normal! Next.js automatically uses port 3001 instead. Just open:
- http://localhost:3001

**To free port 3000 (optional):**

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace 2884 with actual PID)
taskkill /PID 2884 /F
```

---

## 📋 Complete Setup Checklist

Follow these steps in order:

### Step 1: Fix Configuration ✅
- [x] Remove `swcMinify` from next.config.js (already done)

### Step 2: Install Dependencies
```bash
npm install -D typescript @types/react @types/node @types/react-dom tailwindcss postcss autoprefixer eslint eslint-config-next
```

**Expected output:**
```
added X packages, and audited Y packages in Zs
```

### Step 3: Verify Installation
Check that these files/folders exist:
- [x] `node_modules/` folder (should be large, ~200MB+)
- [x] `package-lock.json` file
- [x] `devDependencies` section in `package.json`

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Starting...
✓ Ready in 2-5s
○ Compiling / ...
✓ Compiled / in 3s
```

### Step 5: Test in Browser
Open http://localhost:3000 (or 3001)

**You should see:**
- ✅ Green hero section with "UmojaHub" title
- ✅ Three hub cards (Education, Employment, Food Security)
- ✅ Integration examples section
- ✅ Call-to-action sections
- ✅ Footer

---

## 🚨 Still Having Issues?

### Quick Diagnostic Commands

```bash
# Check Node.js version (should be 18+)
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s /q node_modules
del package-lock.json
npm install
```

### TypeScript Errors in VS Code

If you see red squiggly lines in VS Code after setup:

1. **Restart VS Code**
   - Close and reopen VS Code
   - Or press `Ctrl+Shift+P` → "Developer: Reload Window"

2. **Restart TypeScript Server**
   - Press `Ctrl+Shift+P`
   - Type "TypeScript: Restart TS Server"
   - Press Enter

3. **Wait for Installation**
   - TypeScript definitions take time to install
   - Wait 1-2 minutes after `npm install` completes

---

## 📞 Getting Help

If issues persist after following this guide:

1. **Check versions:**
   ```bash
   node --version  # Should be v18 or higher
   npm --version   # Should be v9 or higher
   ```

2. **Check installation log:**
   - Look for errors in the `npm install` output
   - Share the error messages

3. **Verify file structure:**
   ```bash
   dir src\app
   dir src\components
   dir src\lib
   ```
   
   Should show:
   - `src/app/` with layout.tsx, page.tsx, globals.css
   - `src/components/` with subdirectories
   - `src/lib/` with subdirectories

4. **Check dependencies:**
   ```bash
   npm list tailwindcss
   npm list typescript
   npm list next
   ```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ `npm run dev` starts without errors
2. ✅ Browser shows the UmojaHub landing page
3. ✅ No TypeScript errors in VS Code (after restart)
4. ✅ Tailwind CSS classes are working (green hero section visible)
5. ✅ Hot reload works (edit page.tsx and see changes)

---

## 🎯 Next Steps After Successful Setup

Once everything is working:

1. Review `DEVELOPMENT_ROADMAP.md` for Week 2 tasks
2. Start implementing authentication (NextAuth.js)
3. Set up the database (LowDB)
4. Create role-based routing

Happy coding! 🚀
