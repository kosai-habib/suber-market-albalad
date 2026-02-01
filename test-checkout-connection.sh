#!/bin/bash

echo "🔍 Testing Checkout Connection..."
echo ""

# Test 1: Check if backend is running
echo "1️⃣ Checking if backend is running on port 5001..."
if lsof -i :5001 | grep LISTEN > /dev/null; then
    echo "   ✅ Backend is running"
else
    echo "   ❌ Backend is NOT running"
    echo "   Please start the backend with: cd backend && python run.py"
    exit 1
fi

# Test 2: Check if frontend is running
echo ""
echo "2️⃣ Checking if frontend is running on port 3000..."
if lsof -i :3000 | grep LISTEN > /dev/null; then
    echo "   ✅ Frontend is running"
else
    echo "   ❌ Frontend is NOT running"
    echo "   Please start the frontend with: cd apps/web && npm run dev"
fi

# Test 3: Check health endpoint
echo ""
echo "3️⃣ Testing backend health endpoint..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:5001/api/health)
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Health endpoint responding (HTTP $HTTP_CODE)"
else
    echo "   ❌ Health endpoint failed (HTTP $HTTP_CODE)"
fi

# Test 4: Test CORS preflight
echo ""
echo "4️⃣ Testing CORS preflight for checkout endpoint..."
CORS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" \
    -X OPTIONS http://localhost:5001/api/orders/checkout \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type,Authorization")
if [ "$CORS_RESPONSE" = "200" ]; then
    echo "   ✅ CORS preflight successful (HTTP $CORS_RESPONSE)"
else
    echo "   ❌ CORS preflight failed (HTTP $CORS_RESPONSE)"
fi

# Test 5: Check environment variables
echo ""
echo "5️⃣ Checking frontend environment variables..."
if [ -f "apps/web/.env.local" ]; then
    API_URL=$(grep NEXT_PUBLIC_API_URL apps/web/.env.local | cut -d'=' -f2)
    echo "   API URL: $API_URL"
    if [ "$API_URL" = "http://localhost:5001" ]; then
        echo "   ✅ API URL is correct"
    else
        echo "   ⚠️  API URL might be incorrect (expected: http://localhost:5001)"
    fi
else
    echo "   ⚠️  No .env.local file found"
fi

echo ""
echo "📋 Summary:"
echo "   If all checks pass, the connection should work."
echo "   If you still see Network Error, check the browser console for detailed logs."
echo ""
echo "💡 Next steps:"
echo "   1. Restart the backend server to pick up the new changes"
echo "   2. Try placing an order and check both browser console and backend logs"
echo "   3. Look for logs starting with 🛒, ✅, or ❌"
