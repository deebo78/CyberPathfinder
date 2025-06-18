# Admin Access Control

## Overview

The CyberPathfinder application implements environment-based access control to hide administrative features from regular users while maintaining access for developers and administrators.

## Security Implementation

### Client-Side Protection
- Admin button hidden based on `VITE_ENABLE_ADMIN` environment variable
- Admin tools (search, import, user menu) only visible when admin access is enabled
- Route-based filtering for user-facing pages (Career Mapping, Map Vacancy, Career Tracks)

### Server-Side Protection
- `requireAdminAccess` middleware validates environment configuration
- Protected endpoints return 403 Forbidden when admin access is disabled
- All administrative API endpoints are secured

## Protected Endpoints

The following endpoints require admin access:

```
GET  /api/statistics              - Database statistics
GET  /api/search                  - Global search functionality
GET  /api/import-history          - Import operation history
POST /api/import/nice-framework   - NICE Framework automated import
POST /api/import                  - File upload and data import
```

## Configuration

### For Production (Default - Admin Hidden)
```bash
# Admin access disabled for regular users
VITE_ENABLE_ADMIN=false
```

### For Developers/Administrators
```bash
# Enable admin access for development and administration
VITE_ENABLE_ADMIN=true
```

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Set admin access based on user type:
   - **Production**: Keep `VITE_ENABLE_ADMIN=false`
   - **Development**: Set `VITE_ENABLE_ADMIN=true`

3. Restart the application for changes to take effect

## Security Benefits

- **Defense in Depth**: Both client and server-side protection
- **Environment-Based**: Easy to configure per deployment
- **Access Control**: Prevents unauthorized administrative operations
- **User Experience**: Clean interface for regular users without admin clutter

## Usage

### For Regular Users
- Admin button is completely hidden
- Access to admin routes returns 403 Forbidden
- Clean interface focused on core functionality

### For Developers/Administrators
- Full admin button visibility when not on user-facing pages
- Complete access to administrative features
- Import/export capabilities
- Database statistics and search functionality

## Best Practices

1. **Never enable admin access in production** unless specifically needed for administrative tasks
2. **Use secure deployment practices** to protect environment variables
3. **Monitor admin access** through application logs
4. **Regularly review** who has admin access capabilities
5. **Document any temporary admin access** for audit purposes