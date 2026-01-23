# Usage Credit System - Setup Complete ✅

## Overview
Your SaaS application now has a complete credit/usage tracking system that:
- ✅ Tracks user credits in the PostgreSQL database
- ✅ Automatically initializes new users with **2 free credits**
- ✅ Decrements credits when messages are sent
- ✅ Displays remaining credits in the UI
- ✅ Prevents usage when credits run out
- ✅ Resets credits after 30 days

---

## Database Schema

The `Usage` model in Prisma tracks:

```prisma
model Usage {
  key            String   @id          // User ID from Clerk
  points         Int      @default(0)  // Remaining credits
  consumedPoints Int      @default(0)  // Credits used
  expire         BigInt?               // Expiration timestamp
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

---

## How It Works

### 1. **User Gets Credits**
When a user first interacts with the system (sends their first message), they automatically receive **2 free credits**.

### 2. **Credits Are Consumed**
Every time a user sends a message:
- The system checks if they have credits (`src/modules/messages/server/procedures.ts`)
- If yes, 1 credit is consumed via `consumeCredits()`
- The message is processed
- If no credits remain, an error is shown

### 3. **UI Updates**
The `Usage` component displays:
- Remaining credits (e.g., "1 / 2 free credits remaining")
- Time until reset (30 days)
- Upgrade button

### 4. **Database Storage**
All usage data is stored in PostgreSQL and visible in Prisma Studio at `http://localhost:5555`

---

## Files Modified/Created

### **Core Files**
1. **`prisma/schema.prisma`** - Updated Usage model with all required fields
2. **`src/lib/usage.ts`** - Credit tracking logic with auto-initialization
3. **`src/lib/init-usage.ts`** - Helper functions for user initialization
4. **`src/modules/messages/server/procedures.ts`** - Consumes credits on message creation
5. **`src/modules/projects/ui/components/message-form.tsx`** - Invalidates usage query after messages
6. **`src/modules/projects/ui/components/usage.tsx`** - Displays credit status

### **Test Files**
7. **`scripts/test-usage.ts`** - Test script to verify the system works

---

## Next Steps - IMPORTANT! 🚨

### **Step 1: Stop All Servers**
Press `Ctrl+C` in all terminal windows to stop:
- `npm run dev`
- `npx inngest dev`
- `npx prisma studio`

### **Step 2: Regenerate Prisma Client**
```bash
npx prisma generate
```

This will update the Prisma Client with the new Usage model fields.

### **Step 3: Restart Servers**
```bash
# Terminal 1
npm run dev

# Terminal 2
npx inngest dev

# Terminal 3 (optional)
npx prisma studio
```

### **Step 4: Test the System**
1. Open your app at `http://localhost:3000`
2. Sign in with Clerk
3. Create a project
4. Send a message
5. Watch the credits decrease from 2 → 1
6. Check Prisma Studio to see the Usage table populated

### **Step 5: Run Test Script (Optional)**
```bash
npx tsx scripts/test-usage.ts
```

This will verify the database operations are working correctly.

---

## Configuration

### **Adjust Free Credits**
Edit `src/lib/usage.ts`:
```typescript
const FREE_POINTS = 2; // Change this number
```

### **Adjust Reset Duration**
Edit `src/lib/usage.ts`:
```typescript
const DURATION = 30 * 24 * 60 * 60; // 30 days in seconds
```

### **Adjust Credit Cost Per Message**
Edit `src/lib/usage.ts`:
```typescript
const GENERATION_COST = 1; // Credits per message
```

---

## Troubleshooting

### **TypeScript Errors**
If you see TypeScript errors about `bigint` or `consumedPoints`:
1. Stop all servers
2. Run `npx prisma generate`
3. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
4. Restart `npm run dev`

### **No Credits Showing**
1. Check Prisma Studio at `http://localhost:5555`
2. Look for your user ID in the Usage table
3. If not there, send a message - it will auto-initialize

### **Credits Not Decreasing**
1. Check browser console for errors
2. Verify `consumeCredits()` is being called in `src/modules/messages/server/procedures.ts`
3. Check Prisma Studio to see if `consumedPoints` is incrementing

---

## Future Enhancements

### **Add Premium Plans**
Use the `updateUsagePoints()` function in `src/lib/usage.ts`:
```typescript
await updateUsagePoints(userId, 100); // Give 100 credits
```

### **Track Different Actions**
Create separate cost constants for different features:
```typescript
const MESSAGE_COST = 1;
const IMAGE_GENERATION_COST = 2;
const EXPORT_COST = 5;
```

---

## Summary

✅ **Database**: Usage table with all required fields
✅ **Auto-initialization**: New users get 2 free credits automatically  
✅ **Credit consumption**: 1 credit per message sent
✅ **UI display**: Shows remaining credits and reset time
✅ **Database persistence**: All data stored in PostgreSQL
✅ **Query invalidation**: UI updates automatically after message sent

**Your usage system is fully implemented and ready to use!** 🎉

Just follow the "Next Steps" above to restart your servers with the updated Prisma Client.
