#!/bin/bash

# Create base directory
mkdir -p backend/app/routes
mkdir -p backend/app/services
mkdir -p backend/app/middleware
mkdir -p backend/app/utils

# Create files
touch backend/app/main.py
touch backend/app/config.py

touch backend/app/routes/chat.py

touch backend/app/services/gemini_service.py
touch backend/app/services/memory.py

touch backend/app/middleware/rate_limiter.py
touch backend/app/middleware/logger.py

touch backend/app/utils/stream.py

touch backend/requirements.txt
touch backend/.env

echo "✅ Backend structure created successfully!"