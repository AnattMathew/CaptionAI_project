# 🚀 CaptionAI Render Deployment - Step by Step

## Prerequisites ✅
- [x] GitHub repository with your CaptionAI code
- [x] Render account (sign up at [render.com](https://render.com))
- [x] OpenAI API key (for caption generation)

## Step 1: Push Code to GitHub

First, make sure your code is pushed to GitHub:

```bash
# If you haven't already, initialize git and push to GitHub
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account
3. Authorize Render to access your repositories

## Step 3: Deploy Backend (Django API)

### 3.1 Create Web Service
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select your **CaptionAI** repository

### 3.2 Configure Backend
- **Name**: `captionai-backend`
- **Environment**: `Python 3`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: 
  ```bash
  pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
  ```
- **Start Command**: 
  ```bash
  gunicorn captionai_backend.wsgi:application
  ```

### 3.3 Environment Variables
Add these environment variables in Render:

```
DEBUG=False
SECRET_KEY=<generate a secure secret key>
ALLOWED_HOSTS=captionai-backend.onrender.com
RENDER_EXTERNAL_URL=https://captionai-backend.onrender.com
OPENAI_API_KEY=<your_openai_api_key>
GOOGLE_APPLICATION_CREDENTIALS=<your_google_credentials_json>
IG_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token
```

**Important**: Replace `<your_openai_api_key>` with your actual OpenAI API key.

### 3.4 Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Note the URL: `https://captionai-backend.onrender.com`

## Step 4: Create PostgreSQL Database

### 4.1 Create Database
1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. **Name**: `captionai-database`
3. **Plan**: Free (for testing)
4. **Region**: Same as your backend
5. Click **"Create Database"**

### 4.2 Get Database URL
1. Go to your database service
2. Copy the **"External Database URL"**
3. It looks like: `postgresql://user:password@host:port/database`

### 4.3 Update Backend Environment Variables
1. Go back to your backend service
2. Go to **"Environment"** tab
3. Add new environment variable:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste the database URL from step 4.2
4. Click **"Save Changes"**
5. The service will automatically redeploy

## Step 5: Deploy Frontend (React App)

### 5.1 Create Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Select your **CaptionAI** repository

### 5.2 Configure Frontend
- **Name**: `captionai-frontend`
- **Repository**: Same CaptionAI repository
- **Root Directory**: `frontend`
- **Build Command**: 
  ```bash
  npm install && npm run build
  ```
- **Publish Directory**: `build`

### 5.3 Environment Variables
Add this environment variable:
```
REACT_APP_API_URL=https://captionai-backend.onrender.com
```

### 5.4 Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete
3. Note the URL: `https://captionai-frontend.onrender.com`

## Step 6: Test Your Deployment

### 6.1 Test Backend API
1. Visit: `https://captionai-backend.onrender.com/api/`
2. Should return API documentation or health check

### 6.2 Test Frontend
1. Visit: `https://captionai-frontend.onrender.com`
2. Should load your React application

### 6.3 Test Full Flow
1. Go to your frontend URL
2. Register/Login
3. Upload an image
4. Generate caption
5. Test all features

## Step 7: Create Admin User

### 7.1 Access Backend Shell
1. Go to your backend service in Render
2. Go to **"Shell"** tab
3. Run these commands:

```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin user.

## Step 8: Verify Image URLs

After deployment, your images will be publicly accessible at:
- `https://captionai-backend.onrender.com/media/images/...`

This solves the image visibility issue for social media sharing!

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render Dashboard
   - Ensure all dependencies are in requirements.txt

2. **Database Connection Issues**
   - Verify DATABASE_URL is set correctly
   - Check database service is running

3. **Static Files Issues**
   - Ensure collectstatic runs during build
   - Check STATIC_ROOT and STATIC_URL settings

4. **CORS Issues**
   - Update CORS settings to allow your frontend domain
   - Check ALLOWED_HOSTS setting

### Useful Commands in Render Shell:

```bash
# Check Django configuration
python manage.py check

# Run migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic

# Create superuser
python manage.py createsuperuser
```

## Final URLs

After successful deployment:
- **Frontend**: `https://captionai-frontend.onrender.com`
- **Backend API**: `https://captionai-backend.onrender.com/api/`
- **Admin Panel**: `https://captionai-backend.onrender.com/admin/`

## Security Notes

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** (Render provides this automatically)
4. **Keep dependencies updated** regularly
5. **Use strong secret keys** for production

## Next Steps

1. **Custom Domain**: Add your own domain in Render settings
2. **Monitoring**: Set up monitoring and alerts
3. **Scaling**: Upgrade to paid plans for better performance
4. **Backup**: Set up database backups

Your CaptionAI application will now be live and accessible worldwide! 🌍
