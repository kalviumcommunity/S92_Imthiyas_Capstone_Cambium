# Conversation Persistence & Memory Governance

## Normalized Storage (`ai_conversations` & `ai_messages`)
Defined in `server/src/database/migrations/003_ai_rag_and_memory.sql` and TypeORM entities (`AiConversation`, `AiMessage`):
- **Session Metadata**: Stores `user_id`, optional `workspace_id`, `persona`, `title`, and timestamps.
- **Message Audit Trail**: Stores `role`, `content`, verified `citations` JSONB, `prompt_version`, `model_used`, and `abstained` boolean per assistant turn.

## Ownership Enforcement & Retention Control
- Calling an existing `conversationId` verifies `existing.userId === caller.id` (`ForbiddenException` on mismatch, `NotFoundException` on missing UUID).
- `GET /api/v1/assistant/conversations`, `GET /conversations/:id`, and `DELETE /conversations/:id` enforce strict `userId` scoping plus Supabase RLS policies in migration `003`.
- Deleting a conversation removes both child `ai_messages` rows and the parent `ai_conversations` record.
