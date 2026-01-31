"""
اختبار سريع للـ API endpoints بعد التعديلات
يتحقق من:
1. Categories endpoint يرجع array مباشر
2. Products endpoint يرجع array مباشر
3. Auth register يرجع token + user
4. Auth login يرجع token + user
"""

import requests
import json

BASE_URL = "http://localhost:5001/api"

def test_categories():
    """اختبار GET /api/categories"""
    print("\n🧪 اختبار: GET /api/categories")
    print("-" * 50)
    
    response = requests.get(f"{BASE_URL}/categories")
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    # التحقق من أن الـ response هو array
    if isinstance(data, list):
        print("✅ Response هو array مباشر")
        print(f"✅ عدد الفئات: {len(data)}")
        if len(data) > 0:
            print(f"✅ مثال: {data[0]}")
    else:
        print("❌ Response ليس array!")
        print(f"Response: {data}")
    
    return response.status_code == 200


def test_products():
    """اختبار GET /api/products"""
    print("\n🧪 اختبار: GET /api/products")
    print("-" * 50)
    
    response = requests.get(f"{BASE_URL}/products")
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    # التحقق من أن الـ response هو array
    if isinstance(data, list):
        print("✅ Response هو array مباشر")
        print(f"✅ عدد المنتجات: {len(data)}")
        if len(data) > 0:
            print(f"✅ مثال: {data[0]}")
    else:
        print("❌ Response ليس array!")
        print(f"Response: {data}")
    
    return response.status_code == 200


def test_products_with_filter():
    """اختبار GET /api/products?category=meat"""
    print("\n🧪 اختبار: GET /api/products?category=meat")
    print("-" * 50)
    
    response = requests.get(f"{BASE_URL}/products?category=meat")
    
    print(f"Status: {response.status_code}")
    data = response.json()
    
    if isinstance(data, list):
        print("✅ Response هو array مباشر")
        print(f"✅ منتجات اللحوم: {len(data)}")
        if len(data) > 0:
            print(f"✅ مثال: {data[0]['name']}")
    else:
        print("❌ Response ليس array!")
    
    return response.status_code == 200


def test_register():
    """اختبار POST /api/auth/register"""
    print("\n🧪 اختبار: POST /api/auth/register")
    print("-" * 50)
    
    # بيانات مستخدم تجريبي
    test_user = {
        "email": f"test_{int(requests.get('https://httpbin.org/uuid').json()['uuid'][:8], 16)}@test.com",
        "password": "test123456"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/register",
        json=test_user,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 201:
        data = response.json()
        
        # التحقق من الـ structure
        if "token" in data and "user" in data:
            print("✅ Response يحتوي على token و user")
            print(f"✅ Token موجود: {bool(data['token'])}")
            print(f"✅ User data: {data['user']}")
        else:
            print("❌ Response لا يحتوي على token أو user")
            print(f"Response: {data}")
        
        return data.get("token")
    else:
        print(f"❌ فشل التسجيل: {response.text}")
        return None


def test_login():
    """اختبار POST /api/auth/login"""
    print("\n🧪 اختبار: POST /api/auth/login")
    print("-" * 50)
    
    # استخدام مستخدم موجود
    login_data = {
        "email": "test@example.com",
        "password": "password"
    }
    
    response = requests.post(
        f"{BASE_URL}/auth/login",
        json=login_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        
        # التحقق من الـ structure
        if "token" in data and "user" in data:
            print("✅ Response يحتوي على token و user")
            print(f"✅ Token موجود: {bool(data['token'])}")
            print(f"✅ User data: {data['user']}")
            return True
        else:
            print("❌ Response لا يحتوي على token أو user")
            print(f"Response: {data}")
    else:
        print(f"⚠️  المستخدم test@example.com غير موجود (طبيعي)")
        print(f"   جرب register أولاً أو استخدم المستخدم الصحيح")
    
    return False


def main():
    """تشغيل جميع الاختبارات"""
    print("\n" + "="*60)
    print("🚀 اختبار API Endpoints بعد التعديلات")
    print("="*60)
    
    results = {
        "categories": False,
        "products": False,
        "products_filter": False,
        "register": False,
        "login": False
    }
    
    try:
        # اختبار Categories
        results["categories"] = test_categories()
        
        # اختبار Products
        results["products"] = test_products()
        
        # اختبار Products مع فلتر
        results["products_filter"] = test_products_with_filter()
        
        # اختبار Register
        token = test_register()
        results["register"] = bool(token)
        
        # اختبار Login
        results["login"] = test_login()
        
    except requests.exceptions.ConnectionError:
        print("\n❌ خطأ: لا يمكن الاتصال بالـ Backend")
        print("   تأكد من أن Backend يعمل على http://localhost:5001")
        return
    
    # النتيجة النهائية
    print("\n" + "="*60)
    print("📊 ملخص الاختبارات")
    print("="*60)
    
    for test_name, passed in results.items():
        status = "✅ نجح" if passed else "❌ فشل"
        print(f"{status} - {test_name}")
    
    passed_count = sum(results.values())
    total_count = len(results)
    
    print("\n" + "="*60)
    print(f"النتيجة النهائية: {passed_count}/{total_count} اختبارات نجحت")
    print("="*60 + "\n")


if __name__ == "__main__":
    main()
