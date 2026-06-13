# GPBS PMS — Deployment Notes

Side-by-side deployment with the existing `true-visions-pms` on `ibsdo.com`. Nothing in true-visions changes; GPBS gets its own URL paths, port, DB, and PM2 process.

## Allocation summary

| Item | Value |
|---|---|
| Frontend URL | `https://ibsdo.com/gpbs-pms/` |
| API URL (public) | `https://ibsdo.com/gpbs-api/` |
| Backend port (internal) | `8081` |
| Web root (Apache serves from) | `/var/www/html/gpbs-pms/` |
| Git checkout (SSH) | `/home/kittinv/gpbs-pms/` |
| MySQL database | `gpbs_db` |
| PM2 process name | `gpbs-pms-api` |
| GitHub repo | `https://github.com/Kittinske15/gpbs-pms.git` |
| Default admin password | `Gpbs2026!` (must change on first login) |
| Default admin reset key | `gpbs2026admin` (override via `ADMIN_RESET_KEY` env) |

## 1. First-time SSH setup

SSH in as `kittinv@ibsdo.com` then:

```bash
cd /home/kittinv
git clone https://github.com/Kittinske15/gpbs-pms.git
cd gpbs-pms/server
cp .env.example .env
nano .env          # fill in DB_PASSWORD, JWT_SECRET, ADMIN_RESET_KEY, SMTP creds
npm install --production
```

## 2. Create the database

```bash
mysql -u ibsdo -p
```

```sql
CREATE DATABASE gpbs_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

Either import a schema dump from `tvs_db_dup` (structure only) or let the app
auto-create tables on first run (it creates the security tables automatically;
the main `cwr038_member` and project tables you may need to seed manually).

The fastest path:

```bash
mysqldump -u ibsdo -p --no-data tvs_db_dup > /tmp/schema.sql
mysql -u ibsdo -p gpbs_db < /tmp/schema.sql
```

Seed an admin user. First generate a bcrypt hash for the default password:

```bash
cd /home/kittinv/gpbs-pms/server
node -e "console.log(require('bcrypt').hashSync('Gpbs2026!', 12))"
```

Copy the hash, then:

```bash
mysql -u ibsdo -p gpbs_db
```

```sql
INSERT INTO cwr038_member (c_emp_id, c_username, c_password, c_name, c_lastname, c_email, c_permission_group_id, c_must_change_password)
VALUES (1, 'admin', '<PASTE_BCRYPT_HASH_HERE>', 'GPBS', 'Admin', 'admin@example.com', 10, 1);
```

## 3. Apache reverse-proxy block

Edit (with sudo) the existing SSL vhost for `ibsdo.com` and add inside `<VirtualHost *:443>`:

```apache
ProxyPass        "/gpbs-api/" "http://127.0.0.1:8081/"
ProxyPassReverse "/gpbs-api/" "http://127.0.0.1:8081/"
<Location "/gpbs-api/">
    Require all granted
</Location>

Alias /gpbs-pms /var/www/html/gpbs-pms
<Directory /var/www/html/gpbs-pms>
    Options -Indexes +FollowSymLinks
    AllowOverride All
    Require all granted
</Directory>
```

Then:

```bash
sudo apache2ctl configtest
sudo systemctl reload apache2
```

(The `proxy` and `proxy_http` modules are already enabled — used by true-visions.)

## 4. Deploy the frontend build

The repo already contains `client/build/` (committed for this exact reason).
Copy the build into the web root:

```bash
sudo mkdir -p /var/www/html/gpbs-pms
sudo cp -r /home/kittinv/gpbs-pms/client/build/. /var/www/html/gpbs-pms/
sudo chown -R www-data:www-data /var/www/html/gpbs-pms
```

## 5. Start the backend with PM2

```bash
cd /home/kittinv/gpbs-pms/server
pm2 start app.js --name "gpbs-pms-api"
pm2 save
pm2 logs gpbs-pms-api --lines 30   # verify it connected to MySQL
```

You should see `Connected to MySQL database (using connection pool)` in the logs.

## 6. Smoke test

- Open `https://ibsdo.com/gpbs-pms/` — should show login with GPBS blue/green gradient and GPBS logo.
- Log in as `admin` / `Gpbs2026!` — should force a password change on first login.
- Network tab: API requests should go to `https://ibsdo.com/gpbs-api/...` and return 200.

## Re-deploy after an update

On your dev machine:

```powershell
cd client
npm run build
cd ..
git add .
git commit -m "..."
git push
```

On the server:

```bash
cd /home/kittinv/gpbs-pms
git pull
sudo cp -r client/build/. /var/www/html/gpbs-pms/
pm2 restart gpbs-pms-api   # only if server/ changed
```

That's it — no FileZilla needed for routine updates once SSH is set up.
