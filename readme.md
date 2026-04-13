Use this launch-day checklist for Railway + Cloudflare + `.org` with low risk of downtime.

**Before You Touch DNS**
1. Deploy app on Railway and confirm the Railway URL works.
2. In Railway, add both custom domains:
1. `yourdomain.org`
2. `www.yourdomain.org`
3. Keep Railway’s required DNS values open (you’ll copy them into Cloudflare).

**Cloudflare Setup**
1. Add domain to Cloudflare.
2. At registrar, change nameservers to Cloudflare nameservers.
3. Wait until Cloudflare shows domain as active.

**DNS Records (Cloudflare)**
1. Add exactly what Railway tells you:
1. `www` as `CNAME` to Railway target (common case).
2. Apex/root (`@`) record per Railway instructions (A, ALIAS/flattened CNAME, etc.).
2. Set both records to `DNS only` (gray cloud) initially.
3. TTL can stay `Auto`.

**Domain Verification + SSL**
1. Go back to Railway and wait for domain verification.
2. In Cloudflare SSL/TLS, set mode to `Full (strict)`.
3. Test:
1. `http://yourdomain.org`
2. `https://yourdomain.org`
3. `http://www.yourdomain.org`
4. `https://www.yourdomain.org`

**Pick Canonical Domain**
1. Choose one main URL:
1. `https://yourdomain.org` or
2. `https://www.yourdomain.org`
2. Add permanent 301 redirect for the other version.
3. Re-test all four URL variants.

**Then Turn On Cloudflare Proxy**
1. Switch records from gray cloud to orange cloud one at a time.
2. Re-test site after each switch.
3. If anything breaks, switch that record back to gray and debug safely.

**Security Must-Haves**
1. Enable `Always Use HTTPS`.
2. Enable `Automatic HTTPS Rewrites`.
3. Turn on 2FA for Cloudflare and domain registrar.
4. Keep registrar/domain lock enabled.

**Email Safety (if using domain email)**
1. Add/verify `MX` records.
2. Configure `SPF`, `DKIM`, `DMARC`.
3. Double-check Cloudflare didn’t proxy mail-related records (mail records should be DNS only).

**Final Verification**
1. Check homepage + key routes.
2. Check API endpoints from frontend.
3. Test from mobile network (not just your Wi-Fi).
4. Run a DNS checker to confirm global propagation.
5. Keep Railway URL bookmarked as fallback while DNS settles.

If you want, I can give you a copy-paste DNS template with placeholders (name, type, target, proxy status) so you just fill Railway values and apply.



************************************************************************************************


Perfect. Here is a copy-paste DNS template for Cloudflare + Railway.

Replace the placeholder values with what Railway gives you.

Cloudflare DNS Template (start with Proxy status = DNS only)

Record 1
- Type: CNAME
- Name: www
- Target: YOUR-RAILWAY-CNAME-TARGET
- Proxy status: DNS only (gray cloud)
- TTL: Auto

Record 2 (choose one based on Railway instructions)

Option A (if Railway gives an A record for apex/root)
- Type: A
- Name: @
- IPv4 address: YOUR-RAILWAY-IP
- Proxy status: DNS only (gray cloud)
- TTL: Auto

Option B (if Railway gives a CNAME/ALIAS style value for apex/root)
- Type: CNAME
- Name: @
- Target: YOUR-RAILWAY-ROOT-TARGET
- Proxy status: DNS only (gray cloud)
- TTL: Auto

Canonical redirect rule (after SSL works)

If your primary is https://yourdomain.org
- Redirect: https://www.yourdomain.org/* -> https://yourdomain.org/$1
- Status: 301 Permanent

If your primary is https://www.yourdomain.org
- Redirect: https://yourdomain.org/* -> https://www.yourdomain.org/$1
- Status: 301 Permanent

After verification
1. Wait until Railway marks both domains verified.
2. Set SSL/TLS mode in Cloudflare to Full (strict).
3. Test all 4 URLs:
- http://yourdomain.org
- https://yourdomain.org
- http://www.yourdomain.org
- https://www.yourdomain.org
4. Then switch records to Proxied (orange cloud), one at a time, and retest.

If you paste your actual Railway domain targets here, I can fill this template exactly for your setup.