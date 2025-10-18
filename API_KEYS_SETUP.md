# 🔑 API Keys Setup Guide for CaptionAI

## Where to Add Your API Keys

### **1. Render Dashboard (Production) - MAIN LOCATION**

When you create your web service on Render:

1. **Go to your web service** in Render Dashboard
2. **Click "Environment" tab**
3. **Add these environment variables one by one:**

```
DEBUG=False
SECRET_KEY=<generate a secure key>
ALLOWED_HOSTS=captionai-project-1.onrender.com
RENDER_EXTERNAL_URL=https://captionai-project-1.onrender.com
OPENAI_API_KEY=sk-your-actual-openai-key-here
GOOGLE_APPLICATION_CREDENTIALS=<your-google-credentials-json>
IG_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
```

### **2. Local Development (Optional)**

If you want to test locally, create a `.env` file in your `backend` folder:

```bash
# Create .env file in backend folder
cd backend
touch .env
```

Add this content to `.env`:
```
DEBUG=True
SECRET_KEY=your-local-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
OPENAI_API_KEY=sk-your-openai-api-key-here
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/google-credentials.json
IG_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
```

## 🔒 Security Notes

### **✅ DO:**
- Add keys in Render Dashboard environment variables
- Use different keys for development and production
- Keep your keys secret and never share them

### **❌ DON'T:**
- Never commit API keys to GitHub
- Never put keys directly in your code
- Never share your keys publicly

## 📋 Step-by-Step Process

### **Step 1: Get Your API Keys**
1. **OpenAI API Key**: Go to [platform.openai.com](https://platform.openai.com) → API Keys
2. **Google Credentials** (optional): Go to [console.cloud.google.com](https://console.cloud.google.com)
3. **Instagram API** (optional): Go to [developers.facebook.com](https://developers.facebook.com)

### **Step 2: Add to Render Dashboard**
1. Go to your web service in Render
2. Click "Environment" tab
3. Add each key as a separate environment variable
4. Click "Save Changes"
5. Your service will automatically redeploy

### **Step 3: Test Your Application**
1. Go to your deployed URL
2. Upload an image
3. Generate a caption
4. Check if it works!

## 🎯 **Minimum Required Keys**

For basic functionality, you only need:
- ✅ **OPENAI_API_KEY** - For AI caption generation

Optional keys:
- 🔄 **GOOGLE_APPLICATION_CREDENTIALS** - For translation
- 📱 **IG_BUSINESS_ACCOUNT_ID** - For Instagram posting
- 📱 **INSTAGRAM_ACCESS_TOKEN** - For Instagram posting

## 🚀 **Quick Start**

1. **Get OpenAI API key** (5 minutes)
2. **Add it to Render Dashboard**
3. **Deploy your app**
4. **Test it works!**

Your CaptionAI will work perfectly with just the OpenAI key!
