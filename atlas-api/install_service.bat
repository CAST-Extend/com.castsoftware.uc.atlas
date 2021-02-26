@echo off
cd /D "%~dp0"

set HOME=%CD%
goto check_Permissions

:check_Permissions
    echo Administrative permissions required. Detecting permissions...

    net session >nul 2>&1
    if %errorLevel% == 0 (
        echo Success: Administrative permissions confirmed. Starting config tool
        goto startInstallation
    ) else (
        echo Failure: Current permissions inadequate. Please right click bat and run as Administrator.
        pause
        exit /B 1
    )
    pause

:startInstallation
  echo Installing service
  set SERVICE_NAME=Atlas
  set SERVICE_DESCRIPTION=Web server for Demeter and Artemis

  nssm.exe install %SERVICE_NAME% "C:\Program Files\nodejs\node.exe"
  nssm.exe set %SERVICE_NAME% Description "%SERVICE_DESCRIPTION%"
  nssm.exe set %SERVICE_NAME% AppDirectory "%HOME%"

  nssm.exe set %SERVICE_NAME% AppParameters "-r module-alias/register ./dist --env=production"


  nssm.exe set %SERVICE_NAME% AppStdout "%HOME%\out.log"
  nssm.exe set %SERVICE_NAME% AppStderr "%HOME%\error.log"

  :: Start the service
  nssm.exe start %SERVICE_NAME%
  echo Successfully installed and started service %SERVICE_NAME%
  pause