@echo off

rmdir /s /q data 2>nul
xcopy /s /e /y /i dataBackup data

echo data Restore completed