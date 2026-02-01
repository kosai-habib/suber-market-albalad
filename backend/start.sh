#!/bin/bash

# 🚀 Quick Start Script - Backend Updates
# يشغل Backend + يضيف seed data + يختبر API

echo ""
echo "======================================"
echo "🚀 Super Market Al-Balad - Backend"
echo "======================================"
echo ""

# الخطوة 1: التحقق من Python
echo "1️⃣  التحقق من Python..."
if command -v python3 &> /dev/null; then
    echo "   ✅ Python موجود"
else
    echo "   ❌ Python غير موجود - قم بتثبيته أولاً"
    exit 1
fi

# الخطوة 2: تفعيل venv
echo ""
echo "2️⃣  تفعيل Virtual Environment..."
cd "$(dirname "$0")"
if [ -d "venv" ]; then
    source venv/bin/activate
    echo "   ✅ venv مفعّل"
else
    echo "   ❌ venv غير موجود - قم بإنشائه أولاً"
    echo "   قم بتشغيل: python3 -m venv venv"
    exit 1
fi

# الخطوة 3: تثبيت التبعيات
echo ""
echo "3️⃣  التحقق من التبعيات..."
pip install -q -r requirements.txt
echo "   ✅ التبعيات جاهزة"

# الخطوة 4: السؤال عن Seed
echo ""
echo "4️⃣  هل تريد إضافة seed data؟"
read -p "   [y/N]: " add_seed

if [[ $add_seed =~ ^[Yy]$ ]]; then
    echo ""
    echo "   🌱 إضافة seed data..."
    python seed_complete.py
    echo "   ✅ Seed data أضيفت"
fi

# الخطوة 5: تشغيل Backend
echo ""
echo "5️⃣  تشغيل Backend Server..."
echo "   📡 Backend يعمل على: http://localhost:5001"
echo "   📝 API endpoints: http://localhost:5001/api"
echo ""
echo "   للإيقاف: اضغط Ctrl+C"
echo ""
echo "======================================"
echo ""

python run.py
