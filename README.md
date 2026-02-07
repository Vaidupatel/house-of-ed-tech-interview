# Alerqis - Chatbot as a service (Admin + User)

A full-stack application that allows users to upload documents, and chat with them using API keys.  
Includes a complete **Admin dashboard**, **Document management**, and **Chat testing flow**.

---

## Project Structure

```
root/
├── frontend/ → Next.js (App Router) UI
└── backend/ → Node.js + Express + MongoDB API
```

---

## Features Overview

### User Side

- Upload documents (TXT)
- Automatic chunking & embedding generation
- Secure API key generation per document
- Test API key directly in chat
- Masked / copyable API keys
- Usage tracking

### Admin Side

- Admin login & protected routes
- View all documents
- View document owner details
- API usage insights
- Pagination-supported document listing

---

## Admin Login Credentials

> Use the following credentials to access the Admin dashboard:

- **Email:** `vaid@yopmail.com`
- **Password:** `Abcd@123`

---

## Frontend (Next.js)

### Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- MUI (Dialog, Loader)
- RTK Query
- React Hook Form
- React Icons

### Key UI Highlights

- Global & page-level loading states
- Animated processing overlay during document upload
- Safe UX for long-running tasks (do not refresh warning)
- Not-found page with router.back()
- Per-page dynamic titles using Metadata API
- Clean admin & user separation

### Important Pages

- `/documents` → Manage uploaded documents
- `/chat` → Test document API key in real time
- `/admin` → Admin dashboard
- `/admin/login` → Admin authentication

---

## Backend (Node.js + MongoDB)

### Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- qdrant - Vector data base
- Aggregation Pipelines
- JWT Authentication
- Netlify - Frontend deploy
- Railways - Backend + Embedding server deploy


### Core APIs

- Admin login
- Document upload
- API key generation
- Document listing with pagination
- Usage tracking

### Pagination Implementation

- Aggregation-based pagination using \`$facet\`
- Single-query data + total count
- Supports page & limit parameters

Example response:
```json
{
"documents": [...],
"pagination": {
"page": 1,
"limit": 10,
"total": 42,
"totalPages": 5
}
}
```

---

## Document Lifecycle

1. User uploads document
2. Backend chunks content
3. Embeddings are generated
4. API key is created
5. User tests API key via Chat page
6. Usage is tracked per document

---

## UX Considerations

- Long-running operations show animated status messages
- Upload modal is locked during processing
- Clear user guidance to avoid refresh/close
- API keys are masked by default
- Copy & test actions are explicit and safe

---

## How to Run Locally

### Backend

```bash
cd backend
npm install
npm run start
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---
 


## Future Enhancements

- Real-time embedding progress
- Document reprocessing
- Role-based access
- Advanced analytics
- Rate limiting per API key
- CRM support with MCP server
- Voice agent

---

## Author

```
Ghelani vaidik
vaidpatel11@gmail.com`
```
