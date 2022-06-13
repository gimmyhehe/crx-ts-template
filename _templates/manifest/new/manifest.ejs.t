---
to: public/manifest.json
force: true
---
{ 
  "manifest_version": 2,
  "name": "<%= extensionName %>",
  "version": "<%= version %>",
  "description": "<%= description %>",
  "browser_action": {
    "default_icon": {
      "19": "/logo48.png",
      "38": "/logo200.png"
    },
    "default_popup": "popup.html"
  },
  "icons": { 
    "16": "/logo48.png",
    "48": "/logo48.png",
    "128": "/logo200.png",
    "350": "/logo200.png"
  },
  "content_scripts": [ {
      "matches": [ "<all_urls>" ],
      "js": [ "static/js/runtime-content.js", "static/js/content.js"],
      "css": [],
      "run_at": "document_start"
   } ],
   "web_accessible_resources": [
    "static/js/content.js.map"
  ],
  "background": {
    "scripts": [ "static/js/runtime-background.js", "static/js/background.js" ],
    "persistent": false
  },
  "permissions": [
  "activeTab", "tabs", "http://*/*", "https://*/*", "storage", "contextMenus", "debugger", "downloads"
  ]
}


