import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

4. Click **"Commit changes"** → **"Commit changes"**

---

## **Step 5: Create `src/App.jsx` File**

1. Click **"Add file"** → **"Create new file"**
2. Name it: `src/App.jsx`
3. **Copy the ENTIRE code from the artifact above** (scroll up to see the full React component code - it's very long, starts with `import React, { useState } from 'react';`)
4. Click **"Commit changes"** → **"Commit changes"**

---

## **Step 6: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** or **"Login"** (use your GitHub account)
3. Click **"Add New..."** → **"Project"**
4. Find your `apple-tv-streaming` repository
5. Click **"Import"**
6. **Framework Preset:** Should auto-detect as "Vite" (if not, select it)
7. Click **"Deploy"**
8. Wait 1-2 minutes ⏳
9. Done! 🎉

---

## **Final File Structure:**

Your GitHub repo should look like this:
```
apple-tv-streaming/
├── README.md
├── package.json
├── index.html
└── src/
    ├── main.jsx
    └── App.jsx
