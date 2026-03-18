import { Router } from 'express';
import { chatController } from '../controllers/chat.controller';

const router = Router();

// GET  /api/chat/sessions          - 세션 목록 조회
router.get('/sessions', (req, res, next) => chatController.getSessions(req, res, next));

// POST /api/chat/sessions          - 새 세션 생성
router.post('/sessions', (req, res, next) => chatController.createSession(req, res, next));

// GET  /api/chat/sessions/:id      - 세션 상세 (메시지 포함)
router.get('/sessions/:id', (req, res, next) => chatController.getSession(req, res, next));

// POST /api/chat/sessions/:id/messages - 메시지 전송
router.post('/sessions/:id/messages', (req, res, next) => chatController.sendMessage(req, res, next));

// DELETE /api/chat/sessions/:id    - 세션 삭제
router.delete('/sessions/:id', (req, res, next) => chatController.deleteSession(req, res, next));

export default router;
