import express from 'express';
import controller from '../controllers/requests';
const router = express.Router();

router.get('/albums', controller.getAlbums);
router.get('/albums/:id', controller.getAlbum);
router.put('/albums/:id', controller.updateAlbum);
router.delete('/albums/:id', controller.deleteAlbum);
router.post('/albums', controller.addAlbum);

export = router;
