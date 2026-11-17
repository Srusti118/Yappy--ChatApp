# VAPID Keys Quick Note

### What are they?
A Public/Private keypair that acts as an ID card for our backend when sending Web Push Notifications.

### How it works:
1. **Public Key (Browser)**:
   - Shared with the user's browser during push subscription.
   - Tells the push service (Google/Apple) that subscriptions belong to our app.

2. **Private Key (Server)**:
   - Stays secret on our backend.
   - Generates an unforgeable digital signature for each outgoing notification.

3. **Verification (Push Service)**:
   - The push service verifies the server's signature using the Public Key.
   - If valid, the notification is delivered to the user.

### Golden Rule:
The **Private Key is never shared**. Only the **signature** it generates is sent.
