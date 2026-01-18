@echo off
echo ==========================================
echo      STARTING AI ENGINE
echo ==========================================

cd /d "%~dp0"

echo [1/3] Activating virtual environment...
if exist ai_env\Scripts\activate.bat (
    call ai_env\Scripts\activate.bat
) else (
    echo ERROR: ai_env not found! Please ensure you are in the correct directory.
    pause
    exit /b
)

echo [2/3] Checking Dependencies...
python -c "import mediapipe" 2>NUL
if %errorlevel% neq 0 (
    echo Dependencies not found. Installing...
    pip install "numpy<2.0.0"
    pip install -r requirements.txt
    pip install "protobuf>=3.20.3,<4.0"
)

echo [3/3] Starting Server...
python main.py
pause
