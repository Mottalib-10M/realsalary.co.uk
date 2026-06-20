#!/usr/bin/env bash
# ── Submit URLs to Bing IndexNow ─────────────────────────────────────
# Usage: ./scripts/submit-bing.sh
# Requires: BING_API_KEY in scripts/.env

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE not found. Create it with BING_API_KEY=your_key"
  exit 1
fi

# shellcheck source=/dev/null
source "$ENV_FILE"

if [[ -z "${BING_API_KEY:-}" ]]; then
  echo "Error: BING_API_KEY not set in $ENV_FILE"
  exit 1
fi

DOMAIN="realsalary.co.uk"
HOST="https://${DOMAIN}"
KEY_LOCATION="${HOST}/${BING_API_KEY}.txt"

URLS=(
  "${HOST}/"
  "${HOST}/take-home-pay/"
  "${HOST}/income-tax/"
  "${HOST}/national-insurance/"
  "${HOST}/student-loan/"
  "${HOST}/pension-contribution/"
  "${HOST}/bonus/"
  "${HOST}/hourly-rate/"
  "${HOST}/pro-rata/"
  "${HOST}/required-salary/"
  "${HOST}/two-jobs/"
  "${HOST}/calculators/"
  "${HOST}/about/"
  "${HOST}/glossary/"
  "${HOST}/news/"
  "${HOST}/widget/"
  "${HOST}/contact/"
  "${HOST}/salary/"
  "${HOST}/guides/"
  "${HOST}/guides/uk-tax-year-2026-27/"
  "${HOST}/guides/how-paye-works/"
  "${HOST}/guides/income-tax-bands-explained/"
  "${HOST}/guides/national-insurance-explained/"
  "${HOST}/guides/student-loan-repayment-guide/"
  "${HOST}/guides/pension-salary-sacrifice-explained/"
)

# Build JSON payload
URL_LIST=""
for url in "${URLS[@]}"; do
  URL_LIST="${URL_LIST}\"${url}\","
done
URL_LIST="${URL_LIST%,}"

PAYLOAD=$(cat <<EOF
{
  "host": "${DOMAIN}",
  "key": "${BING_API_KEY}",
  "keyLocation": "${KEY_LOCATION}",
  "urlList": [${URL_LIST}]
}
EOF
)

echo "Submitting ${#URLS[@]} URLs to Bing IndexNow..."
echo ""

RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" \
  -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d "$PAYLOAD")

HTTP_BODY=$(echo "$RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$RESPONSE" | tail -1 | sed 's/HTTP_STATUS://')

echo "Status: $HTTP_STATUS"
if [[ "$HTTP_STATUS" == "200" || "$HTTP_STATUS" == "202" ]]; then
  echo "Success: URLs submitted to Bing IndexNow."
else
  echo "Response: $HTTP_BODY"
  echo "Warning: Unexpected status code. Check your API key and URLs."
fi
