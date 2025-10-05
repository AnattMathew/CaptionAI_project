# Deploy CaptionAI Backend to Render

1) Push this `backend/` folder to a Git repo (or keep monorepo and set rootDir to backend).

2) Create a new Web Service in Render:
- Select your repo
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- Start Command: `gunicorn captionai_backend.wsgi:application --preload --log-file -`

3) Environment variables (at minimum):
- `DEBUG=False`
- `SECRET_KEY` (use Render's Generate Random Value)
- `SERVE_MEDIA=true`
- `ALLOWED_HOSTS=<your-service.onrender.com>`
- Optional: `OPENAI_API_KEY`, `OPENAI_MODEL`, `IG_BUSINESS_ACCOUNT_ID`, `INSTAGRAM_ACCESS_TOKEN`, `GOOGLE_APPLICATION_CREDENTIALS`

4) Persistent media:
- Add a Render Disk named `media`, mount path `/opt/render/project/src/media`, size 1GB+.

5) After deploy:
- Media URLs: `https://<service>.onrender.com/media/...`
- Update the frontend API base to your Render URL.

Note: For production scale, move media to S3 and serve via CDN.
