import express from 'express';
import { 
    createMessage, getAllMessages, 
    markMessageRead, deleteMessage 
} from '../controllers/messageController.mjs';
import { authenticateToken, authorizeRole } from '../middlewares/auth.mjs';

const router = express.Router();

router.post('/', createMessage);
router.get('/', authenticateToken, authorizeRole(['owner', 'admin']), getAllMessages);
router.put('/:id/read', authenticateToken, authorizeRole(['owner', 'admin']), markMessageRead);
router.delete('/:id', authenticateToken, authorizeRole(['owner', 'admin']), deleteMessage);

export default router;
