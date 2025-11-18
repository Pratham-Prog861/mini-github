import express from 'express';
import Repository from '../models/Repository.js';
import File from '../models/File.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
    try {
        const { name, description, isPrivate, language, topics } = req.body;

        const existingRepo = await Repository.findOne({
            owner: req.user._id,
            name
        });

        if (existingRepo) {
            return res.status(400).json({ error: 'Repository already exists' });
        }

        const repository = new Repository({
            name,
            description,
            owner: req.user._id,
            isPrivate,
            language,
            topics
        });

        await repository.save();
        await repository.populate('owner', 'username avatar');

        res.status(201).json(repository);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const repositories = await Repository.find({ isPrivate: false })
            .populate('owner', 'username avatar')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(repositories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:username/:reponame', async (req, res) => {
    try {
        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username avatar');

        if (!repository) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        if (repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        res.json(repository);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:username/:reponame/star', authenticate, async (req, res) => {
    try {
        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        if (repository.stars.includes(req.user._id)) {
            return res.status(400).json({ error: 'Already starred' });
        }

        repository.stars.push(req.user._id);
        await repository.save();

        res.json({ message: 'Repository starred', stars: repository.stars.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:username/:reponame/star', authenticate, async (req, res) => {
    try {
        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        repository.stars = repository.stars.filter(id => !id.equals(req.user._id));
        await repository.save();

        res.json({ message: 'Repository unstarred', stars: repository.stars.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:username/:reponame', authenticate, async (req, res) => {
    try {
        const repository = await Repository.findOne({
            name: req.params.reponame
        }).populate('owner', 'username');

        if (!repository || repository.owner.username !== req.params.username) {
            return res.status(404).json({ error: 'Repository not found' });
        }

        if (!repository.owner._id.equals(req.user._id)) {
            return res.status(403).json({ error: 'Not authorized to delete this repository' });
        }

        // Delete all files associated with this repository
        await File.deleteMany({ repository: repository._id });

        // Delete the repository
        await Repository.findByIdAndDelete(repository._id);

        res.json({ message: 'Repository deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
