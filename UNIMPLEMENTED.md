# AutoChat - Unimplemented Features & Placeholder Report

> Generated: March 2025
> This document tracks all placeholder buttons, unimplemented features, and links that need development.

---

## Critical Issues

### 1. Dashboard Uses Mock Data (HIGH PRIORITY)
**File**: `src/app/(dashboard)/dashboard/page.tsx`

The entire dashboard is using hardcoded mock data instead of real API calls:
- `mockMetrics` - Dashboard metrics (lines 27-41)
- `mockCustomers` - Customer data (lines 40-68)
- `mockTickets` - Ticket data (lines 70-247)
- `mockActivities` - Activity timeline (lines 251-282)
- `mockSuggestions` - AI response suggestions (lines 283-317)

**Impact**: Dashboard does not reflect real database data.

**Recommendation**: Replace all mock data with API calls to existing endpoints:
- `/api/dashboard/metrics`
- `/api/tickets`
- `/api/agents`

---

## Missing Pages (Navigation Links)

The sidebar navigation (`src/components/organisms/sidebar-nav.tsx`) references pages that don't exist:

| Route | Label | Status |
|-------|-------|--------|
| `/` | Dashboard | ✅ Exists (`/dashboard`) |
| `/tickets` | Tickets | ❌ Missing |
| `/customers` | Customers | ❌ Missing |
| `/chat` | Live Chat | ❌ Missing |
| `/knowledge` | Knowledge Base | ❌ Missing |
| `/reports` | Reports | ❌ Missing |
| `/settings` | Settings | ❌ Missing |

**Current Pages**:
- `/` → Landing page (marketing)
- `/login` → Auth page
- `/dashboard` → Dashboard (uses mock data)

---

## Placeholder Links (Footer)

**File**: `src/components/organisms/landing/footer.tsx`

### Product Section
- `#features` - Links to Features section (works)
- `#pricing` - Links to Pricing section (works)
- `#integrations` - `href="#"` **PLACEHOLDER**
- `#changelog` - `href="#"` **PLACEHOLDER**

### Company Section
- All links use `href="#"` **PLACEHOLDERS**:
  - About
  - Blog
  - Careers
  - Contact

### Resources Section
- All links use `href="#"` **PLACEHOLDERS**:
  - Documentation
  - Help Center
  - API Reference
  - Status

### Legal Section
- All links use `href="#"` **PLACEHOLDERS**:
  - Privacy
  - Terms
  - Security

### Social Media Links
- Twitter: `href="#"` **PLACEHOLDER**
- GitHub: `href="#"` **PLACEHOLDER**
- LinkedIn: `href="#"` **PLACEHOLDER**

---

## "Coming Soon" Features

### Internal Notes in Ticket Detail
**File**: `src/components/organisms/TicketDetailModal.tsx:178`
```tsx
Internal notes coming soon...
```

**Status**: Feature placeholder - needs implementation

---

## Missing API Endpoints

Currently implemented:
- `GET /api/agents` - Agent list
- `GET/POST /api/tickets` - Tickets CRUD
- `GET/PUT/DELETE /api/tickets/[id]` - Single ticket operations
- `GET /api/dashboard/metrics` - Dashboard metrics
- `POST /api/ai/chat` - AI chat
- `POST /api/ai/analyze-sentiment` - Sentiment analysis
- `POST /api/ai/suggest-response` - Response suggestions

**Missing APIs**:
| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `/api/customers` | Customer management | High |
| `/api/notifications` | User notifications | Medium |
| `/api/knowledge` | Knowledge base articles | Medium |
| `/api/reports` | Analytics & reporting | Medium |
| `/api/settings` | User/Account settings | Low |
| `/api/chat` | Live chat sessions | High |

---

## Partial Implementations

### Notification System
**Files**: 
- `src/components/organisms/header-bar.tsx`
- `src/components/molecules/NotificationItem.tsx`

**Status**: UI components exist but:
- No backend API for notifications
- Uses hardcoded `notificationCount` prop
- "View all notifications" button not functional

### AI Features
**Status**: Backend APIs exist (`/api/ai/*`) but dashboard doesn't integrate with them properly:
- Response suggestions use mock data
- Sentiment analysis not connected to ticket list
- AI Chat Widget needs real-time integration

---

## Feature Flags to Consider

1. **Live Chat** - Requires WebSocket implementation
2. **Knowledge Base** - Needs CMS-like functionality
3. **Reports** - Requires analytics aggregation
4. **Settings** - User preferences, account management

---

## Action Items

### Phase 1: Core Functionality
- [ ] Replace mock data in dashboard with real API calls
- [ ] Create `/tickets` page with real ticket list
- [ ] Implement notification API and connect to header

### Phase 2: Essential Pages
- [ ] Create `/customers` page
- [ ] Create `/settings` page
- [ ] Implement Internal Notes in Ticket Detail

### Phase 3: Advanced Features
- [ ] Create `/chat` page with WebSocket
- [ ] Create `/knowledge` page
- [ ] Create `/reports` page

### Phase 4: Landing Page Links
- [ ] Create About, Blog, Careers, Contact pages
- [ ] Create Documentation, Help Center pages
- [ ] Create Privacy, Terms, Security pages
- [ ] Add real social media links

---

## Summary

| Category | Count | Priority |
|----------|-------|----------|
| Missing Pages | 6 | High |
| Placeholder Links | 15+ | Medium |
| Mock Data Usage | 5 datasets | Critical |
| Coming Soon Features | 1 | Medium |
| Missing APIs | 6 | High |

**Total Unimplemented Items**: 28+

---

*This document should be updated as features are implemented.*
