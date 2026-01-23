# Complete Upgrade Flow - User Guide 🚀

## How It Works Now

### **For Users (Frontend Experience)**

1. **User runs out of credits**
   - Tries to send a message
   - Gets a beautiful toast notification: "You've run out of credits!"
   - Toast shows "Upgrade to Pro to get 100 more credits per month"
   - **"Upgrade Now" button** in the toast

2. **User clicks "Upgrade Now"**
   - Redirected to `/home/pricing`
   - Sees 3 beautiful pricing cards:
     - **Free**: 2 credits/month - $0
     - **Pro**: 100 credits/month - $29/month (MOST POPULAR)
     - **Enterprise**: 500 credits/month - $99/month

3. **User clicks "Upgrade to Pro"**
   - Button shows loading state: "Processing..."
   - Credits are instantly updated in database
   - Success toast: "Upgrade Successful! 🎉 You now have 100 credits!"
   - User can immediately go back and send messages

4. **Credits update everywhere**
   - Usage widget updates automatically
   - Shows: "100 / 100 free credits remaining"
   - User can now send 100 messages!

---

## Current Implementation (Demo Mode)

### **What Happens When User Clicks Upgrade:**

```typescript
// In pricing-cards.tsx
const handleUpgrade = async (planName: string) => {
    // 1. Check if user is signed in
    if (!user) {
        toast.error("Please sign in to upgrade");
        return;
    }

    // 2. Show loading state
    setLoading(planName);

    // 3. Call TRPC mutation to upgrade
    await upgradeMutation.mutateAsync({
        userId: user.id,
        plan: planName.toLowerCase() // "pro" or "enterprise"
    });

    // 4. Credits are updated in database
    // 5. UI refreshes automatically
    // 6. Success toast shown
};
```

### **Backend (TRPC)**

```typescript
// In src/modules/upgrade/server/procedures.ts
upgradeToPro: protectedProcedure
    .mutation(async ({ input }) => {
        const credits = input.plan === "pro" ? 100 : 500;
        
        // Update user's credits in database
        await updateUsagePoints(input.userId, credits);
        
        return {
            success: true,
            credits: credits,
            message: `Successfully upgraded to ${input.plan} plan!`
        };
    })
```

---

## For Production: Add Stripe Payment

### **Step 1: Install Stripe**

```bash
npm install stripe @stripe/stripe-js
```

### **Step 2: Add Environment Variables**

```bash
# .env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Step 3: Create Stripe Checkout Session**

Update `pricing-cards.tsx`:

```typescript
const handleUpgrade = async (planName: string) => {
    if (!user) {
        toast.error("Please sign in to upgrade");
        return;
    }

    setLoading(planName);

    try {
        // Create Stripe checkout session
        const response = await fetch("/api/create-checkout-session", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                plan: planName.toLowerCase(),
                priceId: planName === "Pro" ? "price_pro_xxx" : "price_enterprise_xxx"
            }),
        });

        const { url } = await response.json();
        
        // Redirect to Stripe Checkout
        window.location.href = url;
    } catch (error) {
        toast.error("Failed to start checkout");
        setLoading(null);
    }
};
```

### **Step 4: Create Checkout API Route**

```typescript
// app/api/create-checkout-session/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-10-16",
});

export async function POST(req: Request) {
    const { userId, plan, priceId } = await req.json();

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: "subscription",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/home/pricing?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/home/pricing?canceled=true`,
        metadata: {
            userId,
            plan,
        },
    });

    return NextResponse.json({ url: session.url });
}
```

### **Step 5: Create Webhook Handler**

```typescript
// app/api/webhooks/stripe/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { updateUsagePoints } from "@/lib/usage";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (userId && plan) {
            // Upgrade user's credits
            const credits = plan === "pro" ? 100 : 500;
            await updateUsagePoints(userId, credits);

            console.log(`✅ User ${userId} upgraded to ${plan} with ${credits} credits`);
        }
    }

    return NextResponse.json({ received: true });
}
```

---

## Testing the Current Demo

### **1. Run Out of Credits**

```bash
# In Prisma Studio (http://localhost:5555)
# Find your user in Usage table
# Set: points = 0, consumedPoints = 2
```

### **2. Try to Send a Message**

- Go to a project
- Try to send a message
- You'll see the error toast with "Upgrade Now" button

### **3. Click "Upgrade Now"**

- Redirected to pricing page
- Click "Upgrade to Pro"
- Instantly get 100 credits!
- Go back and send messages

### **4. Verify in Prisma Studio**

- Check Usage table
- You'll see: points = 100, consumedPoints = 0

---

## Summary

### **Current Demo Mode:**
✅ User clicks "Upgrade to Pro"  
✅ Credits instantly updated (100 or 500)  
✅ UI refreshes automatically  
✅ User can immediately use new credits  

### **For Production (Add Stripe):**
1. Install Stripe SDK
2. Create checkout session API
3. Add webhook handler
4. Update `handleUpgrade` to redirect to Stripe
5. After payment → webhook → credits updated

---

## Files Modified

1. **`src/modules/projects/ui/components/message-form.tsx`**
   - Better error handling
   - Toast with "Upgrade Now" button

2. **`src/modules/home/ui/components/pricing-cards.tsx`** (NEW)
   - Beautiful pricing cards
   - Instant upgrade functionality
   - Loading states

3. **`src/app/home/pricing/page.tsx`**
   - Uses new PricingCards component
   - Integrated with credit system

4. **`src/modules/upgrade/server/procedures.ts`**
   - TRPC endpoints for upgrades
   - Credit management

---

**Your upgrade system is now fully functional with instant credit updates!** 🎉

For production, just add Stripe integration following the guide above.
