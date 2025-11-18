import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/profile', authenticate, async (req, res) => {
    try {
        res.json(req.user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })
            .select('-password')
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:username/follow', authenticate, async (req, res) => {
    try {
        const userToFollow = await User.findOne({ username: req.params.username });

        if (!userToFollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (userToFollow._id.equals(req.user._id)) {
            return res.status(400).json({ error: 'Cannot follow yourself' });
        }

        const currentUser = await User.findById(req.user._id);

        if (currentUser.following.includes(userToFollow._id)) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        currentUser.following.push(userToFollow._id);
        userToFollow.followers.push(currentUser._id);

        await currentUser.save();
        await userToFollow.save();

        res.json({ message: 'Successfully followed user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:username/follow', authenticate, async (req, res) => {
    try {
        const userToUnfollow = await User.findOne({ username: req.params.username });

        if (!userToUnfollow) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = await User.findById(req.user._id);

        currentUser.following = currentUser.following.filter(id => !id.equals(userToUnfollow._id));
        userToUnfollow.followers = userToUnfollow.followers.filter(id => !id.equals(currentUser._id));

        await currentUser.save();
        await userToUnfollow.save();

        res.json({ message: 'Successfully unfollowed user' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
