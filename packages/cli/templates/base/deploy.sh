#!/bin/bash

# ============================================
# Docker Deployment Script (Production)
# ============================================
# Usage: ./deploy.sh [OPTIONS]
#
# Options:
#   -a, --action ACTION     Action: build, up, down, restart, logs, ps (default: up)
#   -p, --port PORT         Port to expose (default: 80)
#   -n, --name NAME         Project name (default: from .env)
#   -b, --build             Rebuild images before starting
#   -f, --force             Force recreation of containers
#   -v, --verbose           Enable verbose output
#   -h, --help              Show this help message
#
# Examples:
#   ./deploy.sh                                    # Start production
#   ./deploy.sh -a build                           # Build production images
#   ./deploy.sh -a logs -v                         # View logs (verbose)
#   ./deploy.sh -a down                           # Stop services
#   ./deploy.sh -a restart -f                     # Force restart
# ============================================

set -e

# ============================================
# Default values
# ============================================
ACTION="up"
PROJECT_NAME=""
PORT=""
BUILD=false
FORCE=false
VERBOSE=false

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================
# Helper functions
# ============================================
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    sed -n '/^# Usage:/,/^#/p' "$0" | sed 's/^# //g' | sed 's/^#//g' | head -n -1
    exit 0
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not available"
        exit 1
    fi
}

check_env_file() {
    if [ ! -f ".env" ]; then
        log_warning ".env file not found"
        if [ -f ".env.example" ]; then
            log_info "Creating .env from .env.example"
            cp .env.example .env
            log_warning "Please edit .env with your production configuration"
            return 1
        else
            log_error "Neither .env nor .env.example found"
            exit 1
        fi
    fi
}

parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -a|--action)
                ACTION="$2"
                shift 2
                ;;
            -p|--port)
                PORT="$2"
                shift 2
                ;;
            -n|--name)
                PROJECT_NAME="$2"
                shift 2
                ;;
            -b|--build)
                BUILD=true
                shift
                ;;
            -f|--force)
                FORCE=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                ;;
        esac
    done
}

validate_action() {
    case $ACTION in
        build|up|down|restart|logs|ps)
            ;;
        *)
            log_error "Invalid action: $ACTION (must be: build, up, down, restart, logs, ps)"
            exit 1
            ;;
    esac
}

build_compose_cmd() {
    local cmd="docker compose"

    # Production profile
    cmd="$cmd --profile prod"

    # Add project name if specified
    if [ -n "$PROJECT_NAME" ]; then
        cmd="$cmd -p $PROJECT_NAME"
    fi

    # Add env file
    if [ -f ".env" ]; then
        cmd="$cmd --env-file .env"
    fi

    echo "$cmd"
}

# ============================================
# Action handlers
# ============================================
action_build() {
    log_info "Building production images..."
    local cmd=$(build_compose_cmd)
    $cmd build

    if [ $? -eq 0 ]; then
        log_success "Build completed"
    else
        log_error "Build failed"
        exit 1
    fi
}

action_up() {
    log_info "Starting production environment..."

    local cmd=$(build_compose_cmd)
    local compose_cmd="$cmd up -d"

    if [ "$BUILD" = true ]; then
        log_info "Building images before starting..."
        compose_cmd="$cmd up -d --build"
    fi

    if [ "$FORCE" = true ]; then
        compose_cmd="$compose_cmd --force-recreate"
    fi

    if [ "$VERBOSE" = true ]; then
        compose_cmd="$compose_cmd --verbose"
    fi

    $compose_cmd

    if [ $? -eq 0 ]; then
        log_success "Production services started"

        # Get port from .env or default
        local prod_port=$(grep "^PROD_PORT=" .env 2>/dev/null | cut -d'=' -f2)
        local port=${PORT:-${prod_port:-80}}

        local project_name=$(grep "^PROJECT_NAME=" .env 2>/dev/null | cut -d'=' -f2)
        local service_name="${project_name:-frontier-fe}-prod"

        log_info "Application running at: http://localhost:${port}"
        log_info "Service name: ${service_name}"
        log_info ""
        log_info "To view logs: ./deploy.sh -a logs"
        log_info "To stop: ./deploy.sh -a down"
    else
        log_error "Failed to start services"
        exit 1
    fi
}

action_down() {
    log_info "Stopping production environment..."
    local cmd=$(build_compose_cmd)

    $cmd down

    if [ $? -eq 0 ]; then
        log_success "Production services stopped"
    else
        log_error "Failed to stop services"
        exit 1
    fi
}

action_restart() {
    log_info "Restarting production environment..."
    action_down
    sleep 2
    action_up
}

action_logs() {
    local cmd=$(build_compose_cmd)

    # Get service name
    local project_name=$(grep "^PROJECT_NAME=" .env 2>/dev/null | cut -d'=' -f2)
    local service_name="${project_name:-frontier-fe}-prod"

    log_info "Showing logs for production environment..."
    log_info "Press Ctrl+C to exit"
    echo ""

    $cmd logs -f "$service_name"
}

action_ps() {
    local cmd=$(build_compose_cmd)

    log_info "Production container status:"
    echo ""
    $cmd ps
}

# ============================================
# Main execution
# ============================================
main() {
    parse_args "$@"
    check_docker
    validate_action

    log_info "Action: ${ACTION}"

    if [ "$ACTION" != "build" ]; then
        check_env_file || {
            log_error "Please configure .env file before deploying"
            exit 1
        }
    fi

    case $ACTION in
        build)
            action_build
            ;;
        up)
            action_up
            ;;
        down)
            action_down
            ;;
        restart)
            action_restart
            ;;
        logs)
            action_logs
            ;;
        ps)
            action_ps
            ;;
    esac
}

# Run main function
main "$@"
