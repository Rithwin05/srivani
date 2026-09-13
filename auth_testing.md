# Auth-Gated App Testing Playbook (Srivani — Next.js variant)

The app uses Emergent-managed Google Auth. The admin area (/admin) is gated server-side by an httpOnly `session_token` cookie
looked up in Mongo collections `users` + `sessions` (fields: userId, sessionToken, expiresAt). Only emails in ADMIN_EMAILS are admins.

## Step 1: Create test user & session (already created; re-run if missing)
mongosh --quiet --eval "
use('test_database');
db.users.updateOne({email:'emergentttt.2@gmail.com'},{\$set:{userId:'user_admin_test01',email:'emergentttt.2@gmail.com',name:'Srivani Admin',createdAt:new Date()}},{upsert:true});
db.sessions.insertOne({userId:'user_admin_test01',sessionToken:'test_session_admin_srivani',expiresAt:new Date(Date.now()+30*24*3600*1000),createdAt:new Date()});
"

## Step 2: Test with curl
curl -s -b "session_token=test_session_admin_srivani" https://<host>/admin | grep -o 'data-testid="admin-dashboard"'
# Without cookie → shows login page: data-testid="admin-login-page"

## Step 3: Browser testing (Playwright)
await page.context.add_cookies([{ "name": "session_token", "value": "test_session_admin_srivani", "domain": "<host>", "path": "/", "httpOnly": True, "secure": True, "sameSite": "None" }])
await page.goto("https://<host>/admin")

## Success indicators
- /admin renders dashboard (data-testid="admin-dashboard"), sidebar shows emergentttt.2@gmail.com
- Admin server actions (save product, offers, settings, import) succeed
## Failure indicators
- Login page shown with cookie set → session/user mismatch
- "Unauthorized" thrown from server actions → cookie not sent
## Cleanup
mongosh --quiet --eval "use('test_database'); db.sessions.deleteMany({sessionToken:'test_session_admin_srivani'});"
