import express from 'express';
import File from '../models/File.js';
import Repository from '../models/Repository.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/:username/:reponame/files', authenticate, async (req, res) => {
    try {
        const { path, name, content } = req.body;

        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        if (!repository.owner._id.equals(req.user._id)) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        const file = new File({
            repository: repository._id,
            path: path || '/',
            name,
            content,
            size: Buffer.byteLength(content, 'utf8')
        });

        await file.save();
        res.status(201).json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:username/:reponame/files', async (req, res) => {
    try {
        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        const files = await File.find({ repository: repository._id });
        res.json(files);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:username/:reponame/files/*', async (req, res) => {
    try {
        const filePath = req.params[0];

        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        const file = await File.findOne({
            repository: repository._id,
            path: `/${filePath}`
        });

        if (!file) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json(file);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
