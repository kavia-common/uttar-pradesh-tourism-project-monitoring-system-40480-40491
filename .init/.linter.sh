#!/bin/bash
cd /home/kavia/workspace/code-generation/uttar-pradesh-tourism-project-monitoring-system-40480-40491/upstdc_backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

