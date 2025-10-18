# CaptionAI Deployment Guide for Render

## Prerequisites

1. **Render Account**: Sign up at [render.com](https://render.com)
2. **GitHub Repository**: Push your code to GitHub
3. **API Keys**: Have your OpenAI API key ready

## Step 1: Prepare Your Repository

Your repository should have the following structure:
```
CaptionAI/
├── backend/
│   ├── requirements.txt
│   ├── Procfile
│   ├── build.sh
│   ├── manage.py
│   └── captionai_backend/
├── frontend/
│   ├── package.json
│   └── src/
├── render.yaml
└── README.md
```

## Step 2: Deploy Backend (Django API)

1. **Go to Render Dashboard**
   - Log in to [render.com](https://render.com)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Connect your GitHub account
   - Select your CaptionAI repository

3. **Configure Backend Service**
   - **Name**: `captionai-backend`
   - **Environment**: `Python 3`
   - **Region**: Choose closest to your users
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
   - **Start Command**: `gunicorn captionai_backend.wsgi:application`

4. **Environment Variables**
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

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://captionai-backend.onrender.com`)

## Step 3: Deploy Frontend (React App)

1. **Create New Static Site**
   - In Render Dashboard, click "New +" → "Static Site"

2. **Configure Frontend Service**
   - **Name**: `captionai-frontend`
   - **Repository**: Same CaptionAI repository
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. **Environment Variables**
   Add this environment variable:
   ```
   REACT_APP_API_URL=https://captionai-backend.onrender.com
   ```

4. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment to complete
   - Note the URL (e.g., `https://captionai-frontend.onrender.com`)

## Step 4: Update Frontend API Configuration

1. **Update API Base URL**
   - In your frontend code, update the API base URL to point to your deployed backend
   - Example: `const API_BASE_URL = 'https://captionai-backend.onrender.com/api'`

2. **Redeploy Frontend**
   - Push changes to GitHub
   - Render will automatically redeploy

## Step 5: Configure Custom Domain (Optional)

1. **Add Custom Domain**
   - In Render Dashboard, go to your service
   - Click "Settings" → "Custom Domains"
   - Add your domain and configure DNS

## Step 6: Set Up Database (PostgreSQL)

1. **Create PostgreSQL Database**
   - In Render Dashboard, click "New +" → "PostgreSQL"
   - Choose plan (Free tier available)
   - Note the connection details

2. **Update Environment Variables**
   - Add `DATABASE_URL` environment variable to your backend service
   - Use the connection string from your PostgreSQL service

## Step 7: Test Your Deployment

1. **Test Backend API**
   - Visit `https://captionai-backend.onrender.com/api/`
   - Should return API documentation or health check

2. **Test Frontend**
   - Visit `https://captionai-frontend.onrender.com`
   - Should load your React application

3. **Test Full Flow**
   - Upload an image
   - Generate caption
   - Test all features

## Troubleshooting

### Common Issues:

1. **Build Failures**
   - Check build logs in Render Dashboard
   - Ensure all dependencies are in requirements.txt
   - Verify Python version compatibility

2. **Database Issues**
   - Ensure DATABASE_URL is set correctly
   - Run migrations: `python manage.py migrate`

3. **Static Files Issues**
   - Ensure `python manage.py collectstatic` runs during build
   - Check STATIC_ROOT and STATIC_URL settings

4. **CORS Issues**
   - Update CORS settings to allow your frontend domain
   - Check ALLOWED_HOSTS setting

### Useful Commands:

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

## Environment Variables Reference

### Backend (Django)
- `DEBUG`: Set to `False` for production
- `SECRET_KEY`: Django secret key (generate a secure one)
- `ALLOWED_HOSTS`: Comma-separated list of allowed hosts
- `DATABASE_URL`: PostgreSQL connection string
- `OPENAI_API_KEY`: Your OpenAI API key
- `GOOGLE_APPLICATION_CREDENTIALS`: Google Cloud credentials
- `IG_BUSINESS_ACCOUNT_ID`: Instagram Business Account ID
- `INSTAGRAM_ACCESS_TOKEN`: Instagram Access Token

### Frontend (React)
- `REACT_APP_API_URL`: Backend API URL

## Security Notes

1. **Never commit API keys** to your repository
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** (Render provides this automatically)
4. **Keep dependencies updated** regularly
5. **Use strong secret keys** for production

## Monitoring

1. **Render Dashboard**: Monitor service health and logs
2. **Logs**: Check application logs for errors
3. **Metrics**: Monitor CPU, memory, and response times

## Scaling

1. **Upgrade Plan**: Move from free tier to paid plans for better performance
2. **Database**: Upgrade PostgreSQL plan for better performance
3. **CDN**: Use Render's CDN for static assets

## Support

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Django Deployment**: [docs.djangoproject.com/en/stable/howto/deployment/](https://docs.djangoproject.com/en/stable/howto/deployment/)
- **React Deployment**: [create-react-app.dev/docs/deployment/](https://create-react-app.dev/docs/deployment/)
