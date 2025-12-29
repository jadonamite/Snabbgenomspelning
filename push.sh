#!/bin/bash

# Check for commit message
if [ -z "$1" ]
then
  echo "❌ Error: You must provide a commit message."
  echo "Usage: ./push.sh \"Your message here\""
  exit 1
fi

echo "🚀 Adding files..."
git add .

echo "📦 Committing..."
git commit -m "$1"

echo "☁️  Pushing to 'origin'..."
git push origin main

echo "☁️  Pushing to 'github'..."
git push github main

echo "✅ Done! Pushed to both remotes."