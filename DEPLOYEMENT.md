# CODARA Deployment Guide

## Pre-Deployment Checklist

- [ ] All API keys added to `.env` files
- [ ] Both frontend and backend tested locally
- [ ] No console errors or warnings
- [ ] All static analyzers working
- [ ] AI integration complete
- [ ] Database setup (if using)

## Deployment Options

### Option 1: Vercel + Railway (Recommended for MVP)

**Frontend (Vercel)**

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repo
4. Set environment variables:
REACT_APP_API_URL=https://your-api-url.com/api
5. Deploy

**Backend (Railway)**

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repo
4. Set environment variables in Railway dashboard:
PORT=5000
GITHUB_TOKEN=xxx
GEMINI_API_KEY=xxx
GROQ_API_KEY=xxx
NODE_ENV=production
5. Deploy

### Option 2: Self-Hosted (VPS)

1. Get a VPS (DigitalOcean, Linode, AWS EC2)
2. Install Node.js and npm
3. Clone repo
4. Install dependencies: `npm install:all`
5. Set `.env` files
6. Use PM2 for process management:
```bash
   npm install -g pm2
   pm2 start backend/src/index.js --name codara-api
```
7. Use Nginx as reverse proxy
8. Get SSL cert (Let's Encrypt)

### Option 3: Docker (Advanced)

Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

Build and deploy:
```bash
docker build -t codara-api .
docker run -p 5000:5000 --env-file .env codara-api
```

## Post-Deployment

1. Test all endpoints
2. Monitor logs
3. Set up error tracking (Sentry)
4. Configure auto-scaling if needed
5. Setup backups (if using database)

## Scaling Considerations

- Add Redis caching for AI responses
- Implement request queuing for large repos
- Use CDN for static frontend assets
- Database indexing for frequently queried data

## Monitoring

```bash
# Check backend health
curl https://your-api.com/api/health

# Monitor logs
# In Railway: View logs in dashboard
# In self-hosted: tail -f ~/.pm2/logs/codara-api-error.log
```

## Rollback Plan

1. Keep previous deployment running
2. Switch DNS/load balancer if issues
3. Have database backups ready
4. Document all changes

## Security in Production

- [ ] Enable CORS only for frontend domain
- [ ] Validate all inputs strictly
- [ ] Rotate API keys regularly
- [ ] Use HTTPS everywhere
- [ ] Rate limiting on all endpoints
- [ ] WAF protection
- [ ] Keep dependencies updated

## Cost Estimation

- **Vercel (Frontend)**: Free tier or ~$20/month
- **Railway (Backend)**: ~$5-20/month depending on usage
- **Database**: ~$15/month (MongoDB Atlas)
- **Total**: ~$40/month for production

## Troubleshooting

### API calls timing out
- Increase timeout in frontend API client
- Optimize static analyzer
- Check AI API rate limits

### Memory issues
- Reduce max file size limits
- Implement streaming for large responses
- Add caching layer

### CORS errors
- Verify frontend URL in backend CORS config
- Check that credentials are being sent
- Test with curl first