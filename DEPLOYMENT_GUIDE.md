# Environment Configuration & Deployment

## Development Environment Setup

### Backend Environment Variables (.env)

Located at: `C:\CampusEventManagement\backend\.env`

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://Sravani:Campus1234@cluster0.o6tnv0h.mongodb.net/campus_event_db?retryWrites=true&w=majority&tls=true

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=campus_event_secret_change_in_production
JWT_EXPIRY=24h

# Notification Settings
ENABLE_SCHEDULED_TASKS=true

# CORS Settings (Development)
CORS_ORIGIN=*
```

### Frontend Environment Variables (.env)

Optional - Create at: `C:\CampusEventManagement\frontend\.env`

```env
# API Configuration
REACT_APP_API_URL=http://localhost:5000/api

# App Configuration
REACT_APP_NAME=Campus Events
REACT_APP_VERSION=1.0.0
```

---

## Production Environment Setup

### Backend Production Configuration

Update `.env` for production:

```env
# MongoDB Atlas (Same or different cluster)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campus_event_prod?retryWrites=true&w=majority&tls=true

# Server Configuration
PORT=5000
NODE_ENV=production

# JWT Configuration (Change this!)
JWT_SECRET=your-very-long-secret-key-here-minimum-32-characters
JWT_EXPIRY=24h

# Notification Settings
ENABLE_SCHEDULED_TASKS=true

# CORS Settings (Production)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Email Notifications (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@campusevents.com

# Analytics (Optional)
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Frontend Production Configuration

Update `.env` for production:

```env
# API Configuration
REACT_APP_API_URL=https://api.yourdomain.com/api

# App Configuration
REACT_APP_NAME=Campus Events
REACT_APP_VERSION=1.0.0

# Analytics (Optional)
REACT_APP_GOOGLE_ANALYTICS_ID=UA-XXXXXXXXX-X
```

---

## MongoDB Atlas Setup Guide

### Current Database Information

**Cluster**: `cluster0.o6tnv0h.mongodb.net`  
**Database Name**: `campus_event_db`  
**Username**: `Sravani`  
**Status**: ✅ Connected and Working

### Backup & Restore

```bash
# Export data
mongodump --uri="mongodb+srv://Sravani:Campus1234@cluster0.o6tnv0h.mongodb.net/campus_event_db"

# Import data
mongorestore --uri="mongodb+srv://Sravani:Campus1234@cluster0.o6tnv0h.mongodb.net/campus_event_db" ./dump/campus_event_db
```

### Create Database Indexes

Run these commands in MongoDB Atlas console:

```javascript
// Collections and indexes
use campus_event_db;

// Users collection
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ department: 1 });

// Events collection
db.events.createIndex({ createdBy: 1 });
db.events.createIndex({ eventDate: 1 });
db.events.createIndex({ department: 1 });
db.events.createIndex({ status: 1 });

// Registrations collection
db.registrations.createIndex({ student: 1, event: 1 }, { unique: true });
db.registrations.createIndex({ event: 1 });
db.registrations.createIndex({ createdAt: 1 });

// Notifications collection
db.notifications.createIndex({ recipient: 1, createdAt: -1 });
db.notifications.createIndex({ type: 1 });

// Attendance collection
db.attendance.createIndex({ event: 1, student: 1 }, { unique: true });
db.attendance.createIndex({ eventDate: 1 });
```

---

## Deployment Options

### Option 1: Heroku (Recommended for Beginners)

**Backend Deployment**:

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=mongodb+srv://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set CORS_ORIGIN=https://your-frontend-domain.com

# Deploy
git push heroku main
```

**Frontend Deployment** (using Vercel):

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard
REACT_APP_API_URL=https://your-app-name.herokuapp.com/api
```

### Option 2: AWS (Scalable)

**EC2 for Backend**:
1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and npm
3. Clone repository
4. Install dependencies: `npm install`
5. Install PM2: `npm install -g pm2`
6. Start server: `pm2 start server.js`
7. Configure security groups for ports 5000
8. Update Elastic IP and DNS

**S3 + CloudFront for Frontend**:
1. Build frontend: `npm run build`
2. Upload build folder to S3
3. Configure CloudFront distribution
4. Update DNS records

### Option 3: DigitalOcean

**App Platform** (Easiest):
1. Connect GitHub repository
2. Select Node.js runtime
3. Set environment variables
4. Deploy automatically
5. Works for both frontend and backend

**Droplet** (More Control):
1. Create Ubuntu droplet
2. Install Node.js, npm, MongoDB
3. Clone and setup code
4. Configure Nginx as reverse proxy
5. Setup SSL with Let's Encrypt
6. Monitor with PM2

### Option 4: Docker & Kubernetes

**Dockerfile for Backend**:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

**docker-compose.yml**:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongodb

  mongodb:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://backend:5000/api

volumes:
  mongodb_data:
```

---

## SSL/TLS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --standalone -d your-domain.com

# Configure Nginx to use certificate
# /etc/nginx/sites-available/default

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5000;
    }
}
```

---

## Performance Optimization

### Backend Optimization

```javascript
// server.js - Add compression
const compression = require('compression');
app.use(compression());

// Connection pooling
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

### Frontend Optimization

```bash
# Production build
npm run build

# Analyze bundle
npm install -g source-map-explorer
source-map-explorer 'build/static/js/*.js'
```

### Database Optimization

- Create indexes (see MongoDB section above)
- Enable compression
- Setup automatic backups
- Monitor query performance
- Use connection pooling

### Caching Strategy

```nginx
# Nginx caching for frontend
location ~* \.(js|css|png|jpg|gif|ico)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Monitoring & Logging

### PM2 Monitoring (Backend)

```bash
# Install PM2
npm install -g pm2

# Start server
pm2 start server.js --name campus-events

# Monitor
pm2 monit

# Logs
pm2 logs campus-events

# Setup auto-restart
pm2 startup
pm2 save
```

### Frontend Monitoring

```bash
# Setup error tracking
npm install @sentry/react

# Initialize in App.jsx
import * as Sentry from "@sentry/react";
Sentry.init({ dsn: "your-sentry-dsn" });
```

### Database Monitoring

- Use MongoDB Atlas dashboard
- Monitor connection count
- Track query performance
- Set up alerts for high CPU/memory

---

## Backup & Recovery

### MongoDB Backup Strategy

```bash
# Daily backup to local folder
0 2 * * * mongodump --uri="mongodb+srv://..." --out=/backups/$(date +\%Y\%m\%d)

# Upload to cloud storage (AWS S3)
aws s3 sync /backups s3://your-bucket-backups/
```

### GitHub Backup

```bash
# Ensure code is always backed up
git push origin main  # Before every deployment
```

---

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use HTTPS/SSL everywhere
- [ ] Set secure CORS origins
- [ ] Implement rate limiting
- [ ] Setup WAF (Web Application Firewall)
- [ ] Enable MongoDB IP whitelist
- [ ] Regular security audits
- [ ] Update dependencies regularly
- [ ] Implement logging and monitoring
- [ ] Backup database regularly
- [ ] Use environment variables for secrets
- [ ] Implement request validation
- [ ] Setup intrusion detection

---

## Troubleshooting Deployment

### Issue: Port Already in Use
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Issue: MongoDB Connection Failed
```bash
# Check connection string format
# Verify IP whitelist in MongoDB Atlas
# Check credentials

# Test connection
mongosh "mongodb+srv://username:password@cluster.mongodb.net/dbname"
```

### Issue: CORS Errors
```
Update CORS_ORIGIN in backend .env:
CORS_ORIGIN=https://your-frontend-domain.com
```

### Issue: High Memory Usage
```bash
# Monitor memory
pm2 monit

# Increase Node.js memory
node --max-old-space-size=4096 server.js
```

---

## Scaling Strategy

### Horizontal Scaling (Multiple Servers)
1. Use load balancer (Nginx, AWS ELB)
2. Run multiple backend instances
3. Use MongoDB Atlas (handles scaling)
4. Use CDN for static frontend assets

### Vertical Scaling (Bigger Server)
1. Upgrade server specifications
2. Increase Node.js memory
3. Optimize database queries
4. Implement caching

### Database Scaling
1. Enable MongoDB sharding
2. Create appropriate indexes
3. Archive old data
4. Use read replicas for reporting

---

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify email notifications work
- [ ] Check database backups running
- [ ] Monitor server performance
- [ ] Setup error alerting
- [ ] Configure CDN for assets
- [ ] Test payment integration (if any)
- [ ] Verify SSL certificate
- [ ] Setup automatic renewals
- [ ] Document deployment process
- [ ] Brief team on changes
- [ ] Monitor user feedback

---

## Support & Maintenance

### Regular Maintenance Tasks

**Daily**:
- Monitor error logs
- Check system uptime
- Review user feedback

**Weekly**:
- Review performance metrics
- Check security alerts
- Update dependencies (security patches)

**Monthly**:
- Full security audit
- Database optimization
- Capacity planning review
- Backup restoration test

**Quarterly**:
- Major version upgrades
- Infrastructure review
- Load testing
- Disaster recovery drill

---

## Contact & Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express Docs**: https://expressjs.com/
- **React Docs**: https://react.dev/
- **Material-UI Docs**: https://mui.com/
- **Heroku Docs**: https://devcenter.heroku.com/
- **AWS Docs**: https://docs.aws.amazon.com/

---

Your Campus Event Management System is production-ready! Deploy with confidence! 🚀
