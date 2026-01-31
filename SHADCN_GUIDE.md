# 🚀 دليل إضافة shadcn/ui

## Step 1: التثبيت

```bash
cd apps/web
npx shadcn@latest init
```

### الأسئلة المتوقعة:
```
? Would you like to use TypeScript? › Yes
? Which style would you like to use? › New York
? Which color would you like to use as base color? › Slate
? Where is your global CSS file? › src/app/globals.css
? Would you like to use CSS variables for colors? › Yes
? Where is your tailwind.config.js located? › tailwind.config.ts
? Configure the import alias for components? › @/components
? Configure the import alias for utils? › @/lib/utils
? Are you using React Server Components? › Yes
```

---

## Step 2: إضافة Components الأساسية

```bash
# للـ Modals/Dialogs
npx shadcn@latest add dialog

# للـ Dropdowns
npx shadcn@latest add dropdown-menu

# للـ Forms
npx shadcn@latest add form

# للـ Toasts
npx shadcn@latest add toast

# للـ Buttons (optional - لديك بالفعل)
npx shadcn@latest add button

# للـ Input
npx shadcn@latest add input

# للـ Select
npx shadcn@latest add select

# للـ Command Palette
npx shadcn@latest add command

# للـ Sheet (Mobile Drawer)
npx shadcn@latest add sheet
```

---

## Step 3: تحديث Colors

في `globals.css`:

```css
@layer base {
  :root {
    /* الألوان الحالية */
    --primary: 221 83% 53%;        /* #2563EB */
    --primary-foreground: 0 0% 100%;
    
    --accent: 38 92% 50%;          /* #F59E0B */
    --accent-foreground: 0 0% 100%;
    
    --background: 210 20% 98%;     /* #F9FAFB */
    --foreground: 222 47% 11%;     /* #111827 */
    
    --muted: 220 13% 91%;          /* #E5E7EB */
    --muted-foreground: 215 16% 47%; /* #6B7280 */
    
    /* إضافة shadcn colors */
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 221 83% 53%;
    
    --radius: 0.75rem;             /* 12px */
  }
}
```

---

## Step 4: مثال - تحويل AuthModal لـ shadcn

### Before (Custom):
```jsx
// Custom modal
const AuthModal = () => {
  return (
    <div className="fixed inset-0 bg-black/50">
      <div className="modal-content">
        {/* content */}
      </div>
    </div>
  );
};
```

### After (shadcn):
```jsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AuthModal = () => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="login">
          <TabsList>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Input type="email" placeholder="Email" />
            <Input type="password" placeholder="Password" />
            <Button>Login</Button>
          </TabsContent>
          
          <TabsContent value="register">
            {/* Register form */}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
```

---

## Step 5: Migration Strategy

### النهج التدريجي (Recommended):

#### Week 1: أساسيات
```bash
✅ Dialog (للـ modals)
✅ Sheet (للـ mobile drawer)
✅ Toast (للـ notifications)
```

#### Week 2: Forms
```bash
✅ Input
✅ Select
✅ Form (مع validation)
```

#### Week 3: Advanced
```bash
✅ Command (search)
✅ Combobox
✅ Data Table
```

---

## ⚠️ Migration Checklist

### قبل البدء:
- [ ] Commit كل التغييرات
- [ ] Test كل الـ features
- [ ] Backup قاعدة البيانات

### أثناء Migration:
- [ ] Component واحد في المرة
- [ ] Test بعد كل تغيير
- [ ] Keep custom components كـ fallback

### بعد Migration:
- [ ] Full testing
- [ ] Performance check
- [ ] Accessibility audit

---

## 📊 Expected Bundle Size Impact

```
Current:  ~150KB (gzipped)
+ Dialog:  +15KB
+ Sheet:   +12KB
+ Form:    +20KB
+ Command: +25KB
Total:     ~220KB (gzipped)

Impact: +47% bundle size
```

---

## 🎯 توصيتي النهائية:

**لا تضف shadcn الآن!**

ركز على:
1. إضافة محتوى (products)
2. إضافة features (search, filters)
3. تحسين UX

**أضف shadcn فقط إذا:**
- احتجت admin dashboard
- احتجت complex forms
- عندك وقت للـ migration