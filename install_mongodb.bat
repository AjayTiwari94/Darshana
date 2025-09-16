@echo off
echo Installing MongoDB Community Server...

echo Downloading MongoDB installer...
powershell -Command "Invoke-WebRequest -Uri 'https://fastdl.mongodb.org/windows/mongodb-windows-x86_64-7.0.11-signed.msi' -OutFile 'mongodb-installer.msi'"

echo Installing MongoDB...
msiexec /i mongodb-installer.msi /quiet /norestart

echo Creating data directories...
mkdir "C:\data\db" 2>nul
mkdir "C:\data\log" 2>nul

echo Setting up MongoDB as Windows service...
"C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --logpath "C:\data\log\mongod.log" --dbpath "C:\data\db"

echo Starting MongoDB service...
net start MongoDB

echo MongoDB installation complete!
echo You can now connect to MongoDB at: mongodb://localhost:27017

pause