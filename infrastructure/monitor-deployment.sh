#!/bin/bash

# Configuration
URL="http://localhost:80"
INTERVAL=0.1  # Check every 100ms
TIMEOUT=1  # 1 second timeout for each request
LOG_FILE="deployment-monitor.log"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Initialize counters
total_requests=0
failed_requests=0
start_time=$(date +%s.%N)
downtime_start=""
total_downtime=0
is_down=false

echo "Starting deployment monitoring..."
echo "Monitoring URL: $URL"
echo "Check interval: ${INTERVAL}s"
echo "----------------------------------------"

# Function to check response
check_response() {
    local response
    local status
    local time
    local current_time
    
    # Make request and capture response time with verbose output
    response=$(curl -v -s -w "\n%{http_code}\n%{time_total}" -o /dev/null --max-time $TIMEOUT $URL 2>&1)
    
    # Extract status code from the HTTP response line
    status=$(echo "$response" | grep -oP '^< HTTP/1\.1 \K\d{3}')
    time=$(echo "$response" | grep -oP '\d+\.\d+$' | tail -n1)
    current_time=$(date +%s.%N)
    
    total_requests=$((total_requests + 1))
    
    if [ -z "$status" ]; then
        failed_requests=$((failed_requests + 1))
        if [ "$is_down" = false ]; then
            downtime_start=$current_time
            is_down=true
            echo -e "${RED}✗${NC} Downtime started at $(date)"
        fi
        echo -e "${RED}✗${NC} Request failed - No status code received"
        return 1
    elif [ "$status" = "200" ]; then
        if [ "$is_down" = true ]; then
            local downtime_duration=$(echo "$current_time - $downtime_start" | awk '{print $1 - $3}')
            total_downtime=$(echo "$total_downtime + $downtime_duration" | awk '{print $1 + $3}')
            echo -e "${GREEN}✓${NC} Service recovered. Downtime duration: ${downtime_duration}s"
            is_down=false
        fi
        echo -e "${GREEN}✓${NC} Request successful (${time}s)"
        return 0
    else
        failed_requests=$((failed_requests + 1))
        if [ "$is_down" = false ]; then
            downtime_start=$current_time
            is_down=true
            echo -e "${RED}✗${NC} Downtime started at $(date)"
        fi
        echo -e "${RED}✗${NC} Request failed (${time}s) - Status: $status"
        return 1
    fi
}

# Function to calculate statistics
calculate_stats() {
    local end_time=$(date +%s.%N)
    local duration=$(echo "$end_time - $start_time" | awk '{print $1 - $3}')
    local success_count=$((total_requests - failed_requests))
    local success_rate=$((success_count * 100 / total_requests))
    
    # If service is still down, add the current downtime to total
    if [ "$is_down" = true ]; then
        local current_downtime=$(echo "$end_time - $downtime_start" | awk '{print $1 - $3}')
        total_downtime=$(echo "$total_downtime + $current_downtime" | awk '{print $1 + $3}')
    fi
    
    echo "----------------------------------------"
    echo "Deployment Monitoring Results:"
    echo "Total duration: ${duration}s"
    echo "Total requests: $total_requests"
    echo "Failed requests: $failed_requests"
    echo "Success rate: ${success_rate}%"
    echo "Total downtime: ${total_downtime}s"
    echo "Downtime percentage: $(echo "$total_downtime * 100 / $duration" | awk '{print $1 * 100 / $3}')%"
    
    # Log results
    echo "$(date) - Duration: ${duration}s - Total: $total_requests - Failed: $failed_requests - Success: ${success_rate}% - Downtime: ${total_downtime}s" >> $LOG_FILE
}

# Trap to handle script interruption
trap 'echo -e "\nMonitoring stopped by user"; calculate_stats; exit 0' INT

# Main monitoring loop
echo "Press Ctrl+C to stop monitoring..."
while true; do
    check_response
    sleep $INTERVAL
done 