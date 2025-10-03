#!/bin/bash

# Script to run all services for the Learn Language App in separate terminals

# Function to run Python AI service in a new terminal
run_python_service() {
    echo "Starting Python AI service in a new terminal..."
    if [ -f "src/LearnLanguage.AI/server.py" ]; then
        # Check for available terminal emulators and run the Python service
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="Python AI Service" -- bash -c "
                cd src/LearnLanguage.AI;
                if [ -d 'venv' ]; then
                    source ./venv/bin/activate;
                    echo 'Python virtual environment activated';
                elif [ -d 'env' ]; then
                    source ./env/bin/activate;
                    echo 'Python virtual environment activated';
                else
                    echo 'Warning: No virtual environment found in src/LearnLanguage.AI';
                fi;
                if command -v python3 &> /dev/null; then
                    python3 server.py;
                elif command -v python &> /dev/null; then
                    python server.py;
                else
                    echo 'Error: Neither python3 nor python found';
                    read -p 'Press Enter to close...'
                fi"
        elif command -v xterm &> /dev/null; then
            xterm -title "Python AI Service" -e "bash -c '
                cd src/LearnLanguage.AI;
                if [ -d \"venv\" ]; then
                    source ./venv/bin/activate;
                    echo \"Python virtual environment activated\";
                elif [ -d \"env\" ]; then
                    source ./env/bin/activate;
                    echo \"Python virtual environment activated\";
                else
                    echo \"Warning: No virtual environment found in src/LearnLanguage.AI\";
                fi;
                if command -v python3 &> /dev/null; then
                    python3 server.py;
                elif command -v python &> /dev/null; then
                    python server.py;
                else
                    echo \"Error: Neither python3 nor python found\";
                    read -p \"Press Enter to close...\"; 
                fi'" &
        elif command -v konsole &> /dev/null; then
            konsole --title="Python AI Service" -e "bash -c '
                cd src/LearnLanguage.AI;
                if [ -d \"venv\" ]; then
                    source ./venv/bin/activate;
                    echo \"Python virtual environment activated\";
                elif [ -d \"env\" ]; then
                    source ./env/bin/activate;
                    echo \"Python virtual environment activated\";
                else
                    echo \"Warning: No virtual environment found in src/LearnLanguage.AI\";
                fi;
                if command -v python3 &> /dev/null; then
                    python3 server.py;
                elif command -v python &> /dev/null; then
                    python server.py;
                else
                    echo \"Error: Neither python3 nor python found\";
                    read -p \"Press Enter to close...\"; 
                fi'" &
        else
            echo "Error: No compatible terminal emulator found (gnome-terminal, xterm, or konsole)"
            exit 1
        fi
    else
        echo "Error: server.py not found in src/LearnLanguage.AI"
        exit 1
    fi
}

# Function to run pnpm mobile service in a new terminal
run_pnpm_service() {
    echo "Starting pnpm mobile service in a new terminal..."
    if [ -f "src/LearnLanguage.Mobile/package.json" ] && [ -f "src/LearnLanguage.Mobile/pnpm-lock.yaml" ]; then
        # Check for available terminal emulators and run the pnpm service
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="PNPM Mobile Service" -- bash -c "
                cd src/LearnLanguage.Mobile;
                if command -v pnpm &> /dev/null; then
                    pnpm install;
                    pnpm start;
                else
                    echo 'Error: pnpm not found';
                    read -p 'Press Enter to close...'
                fi"
        elif command -v xterm &> /dev/null; then
            xterm -title "PNPM Mobile Service" -e "bash -c '
                cd src/LearnLanguage.Mobile;
                if command -v pnpm &> /dev/null; then
                    pnpm install;
                    pnpm start;
                else
                    echo \"Error: pnpm not found\";
                    read -p \"Press Enter to close...\";
                fi'" &
        elif command -v konsole &> /dev/null; then
            konsole --title="PNPM Mobile Service" -e "bash -c '
                cd src/LearnLanguage.Mobile;
                if command -v pnpm &> /dev/null; then
                    pnpm install;
                    pnpm start;
                else
                    echo \"Error: pnpm not found\";
                    read -p \"Press Enter to close...\";
                fi'" &
        else
            echo "Error: No compatible terminal emulator found (gnome-terminal, xterm, or konsole)"
            exit 1
        fi
    else
        echo "Error: package.json or pnpm-lock.yaml not found in src/LearnLanguage.Mobile"
        exit 1
    fi
}

# Function to run dotnet API service in a new terminal
run_dotnet_service() {
    echo "Starting dotnet API service in a new terminal..."
    if [ -f "src/LearnLanguage.API/LearnLanguage.API.csproj" ]; then
        # Check for available terminal emulators and run the dotnet service
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="DotNet API Service" -- bash -c "
                cd src/LearnLanguage.API;
                if command -v dotnet &> /dev/null; then
                    dotnet run;
                else
                    echo 'Error: dotnet not found';
                    read -p 'Press Enter to close...'
                fi"
        elif command -v xterm &> /dev/null; then
            xterm -title "DotNet API Service" -e "bash -c '
                cd src/LearnLanguage.API;
                if command -v dotnet &> /dev/null; then
                    dotnet run;
                else
                    echo \"Error: dotnet not found\";
                    read -p \"Press Enter to close...\";
                fi'" &
        elif command -v konsole &> /dev/null; then
            konsole --title="DotNet API Service" -e "bash -c '
                cd src/LearnLanguage.API;
                if command -v dotnet &> /dev/null; then
                    dotnet run;
                else
                    echo \"Error: dotnet not found\";
                    read -p \"Press Enter to close...\";
                fi'" &
        else
            echo "Error: No compatible terminal emulator found (gnome-terminal, xterm, or konsole)"
            exit 1
        fi
    else
        echo "Error: LearnLanguage.API.csproj not found in src/LearnLanguage.API"
        exit 1
    fi
}

# Main execution
echo "Starting all services for Learn Language App in separate terminals..."

# Run services in separate terminals
run_python_service
sleep 3 # Brief pause to allow Python terminal to open
run_dotnet_service
sleep 3  # Brief pause to allow .NET terminal to open
run_pnpm_service

echo "All services have been started in separate terminals!"
echo "Each service is running in its own terminal window/tab."