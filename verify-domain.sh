#!/bin/bash

echo "🔍 Checking DNS Configuration for viethawaii.com..."
echo ""

echo "Current A Records for viethawaii.com:"
dig +short viethawaii.com A
echo ""

echo "Current A Records for www.viethawaii.com:"
dig +short www.viethawaii.com A
echo ""

echo "Expected value should be: 76.76.21.21"
echo ""

echo "Checking if domain is accessible:"
curl -I -s https://www.viethawaii.com | head -n 1
echo ""

echo "Vercel Domain Status:"
vercel domains inspect viethawaii.com 2>/dev/null || echo "Domain not yet verified"
echo ""

echo "✅ If you see 76.76.21.21 above, your DNS is configured correctly!"
echo "⏳ DNS changes can take 5-30 minutes to propagate."