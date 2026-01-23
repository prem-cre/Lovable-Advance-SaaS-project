# Pro Plan Upgrade System 🚀

## Overview

Your SaaS now has a complete upgrade system that allows users to get more credits by upgrading to Pro or Enterprise plans.

---

## How It Works

### **Free Plan**
- **Credits**: 2 free credits
- **Resets**: Every 30 days
- **Cost**: Free

### **Pro Plan**
- **Credits**: 100 credits per month
- **Resets**: Every 30 days
- **Cost**: Set your own pricing

### **Enterprise Plan**
- **Credits**: 500 credits per month
- **Resets**: Every 30 days
- **Cost**: Set your own pricing

---

## Implementation

### **1. TRPC Endpoints**

Two new endpoints are available in `src/modules/upgrade/server/procedures.ts`:

#### **`upgrade.upgradeToPro`**
Upgrades a user to Pro or Enterprise plan:
```typescript
await trpc.upgrade.upgradeToPro.mutate({
    userId: "user_123",
    plan: "pro" // or "enterprise"
});
```

#### **`upgrade.addCredits`**
Manually add credits to a user (admin function):
```typescript
await trpc.upgrade.addCredits.mutate({
    userId: "user_123",
    credits: 50
});
```

---

## Testing the Upgrade System

### **Option 1: Using the Test Script**

Run the upgrade script with a user ID:

```bash
# Upgrade to Pro (100 credits)
npx tsx scripts/upgrade-user.ts user_YOUR_CLERK_ID pro

# Upgrade to Enterprise (500 credits)
npx tsx scripts/upgrade-user.ts user_YOUR_CLERK_ID enterprise
```

**To find your Clerk User ID:**
1. Sign in to your app
2. Open browser console
3. The userId is visible in network requests or you can add `console.log(userId)` in your code

### **Option 2: Via Prisma Studio**

1. Open Prisma Studio: `http://localhost:5555`
2. Click on "Usage" table
3. Find your user's record (key = your Clerk userId)
4. Manually update:
   - `points`: 100 (for Pro) or 500 (for Enterprise)
   - `consumedPoints`: 0

---

## Integration with Payment Systems

### **Stripe Webhook Example**

When a user successfully pays for Pro plan via Stripe:

```typescript
// In your Stripe webhook handler
import { updateUsagePoints } from "@/lib/usage";

export async function POST(req: Request) {
    const event = await stripe.webhooks.constructEvent(
        await req.text(),
        req.headers.get("stripe-signature")!,
        process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan; // "pro" or "enterprise"

        // Upgrade user
        const credits = plan === "pro" ? 100 : 500;
        await updateUsagePoints(userId, credits);

        console.log(`✅ User ${userId} upgraded to ${plan} with ${credits} credits`);
    }

    return new Response(JSON.stringify({ received: true }));
}
```

---

## UI Integration

### **Update the Pricing Page**

The "Upgrade" button in the Usage component already links to `/home/pricing`.

Update your pricing page to:
1. Show different plans (Free, Pro, Enterprise)
2. Integrate Stripe Checkout or your payment provider
3. Pass the userId in metadata
4. Call the upgrade endpoint after successful payment

### **Example Pricing Page Button**

```typescript
<Button onClick={async () => {
    // Create Stripe checkout session
    const session = await createCheckoutSession({
        priceId: "price_pro_monthly",
        userId: user.id,
        plan: "pro"
    });
    
    // Redirect to Stripe
    window.location.href = session.url;
}}>
    Upgrade to Pro - $29/month
</Button>
```

---

## Configuration

### **Adjust Credit Amounts**

Edit `src/modules/upgrade/server/procedures.ts`:

```typescript
const PRO_PLAN_CREDITS = 100;     // Change this
const ENTERPRISE_PLAN_CREDITS = 500; // Change this
```

Also update `src/lib/usage.ts` if you want to change free credits:

```typescript
const FREE_POINTS = 2; // Change this
```

---

## Database Schema

The Usage table tracks:

```prisma
model Usage {
  key            String   @id          // User ID
  points         Int      @default(0)  // Total credits
  consumedPoints Int      @default(0)  // Credits used
  expire         BigInt?               // Expiration timestamp
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## Automatic Credit Renewal

### **Monthly Renewal (Future Enhancement)**

To implement automatic monthly credit renewal:

1. **Create a cron job** (using Vercel Cron or similar):

```typescript
// app/api/cron/renew-credits/route.ts
export async function GET(req: Request) {
    // Verify cron secret
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", { status: 401 });
    }

    // Get all users with expired credits
    const now = BigInt(Date.now());
    const expiredUsers = await prisma.usage.findMany({
        where: {
            expire: {
                lte: now
            }
        }
    });

    // Renew credits for each user
    for (const user of expiredUsers) {
        const newExpire = BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000);
        
        await prisma.usage.update({
            where: { key: user.key },
            data: {
                consumedPoints: 0,
                expire: newExpire
            }
        });
    }

    return new Response(JSON.stringify({ renewed: expiredUsers.length }));
}
```

2. **Set up Vercel Cron** in `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/renew-credits",
    "schedule": "0 0 * * *"
  }]
}
```

---

## Summary

✅ **Upgrade System**: TRPC endpoints for upgrading users  
✅ **Test Script**: Easy testing with `upgrade-user.ts`  
✅ **Flexible Credits**: Pro (100) and Enterprise (500) plans  
✅ **Payment Ready**: Easy integration with Stripe/other providers  
✅ **Database Tracking**: All upgrades stored in PostgreSQL  

**Your upgrade system is ready to use!** 🎉

Next steps:
1. Test the upgrade script with your user ID
2. Integrate with your payment provider (Stripe recommended)
3. Update the pricing page UI
4. Set up automatic credit renewal (optional)
