import db from '../db/connectDB.js';
import { ObjectId } from 'mongodb';

const {words, users, categories} = db;

export const getCategories = async (req, res) => {
  try {
    const categoryIds = await words.distinct('category');

    const categoryCollection  = await categories
      .find({ category: { $in: categoryIds } })
      .toArray();

    console.log("categoryCollection:", categoryCollection);
    res.json(categoryCollection);
  } catch (error) {
    console.error('Error when receiving categories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const setCategory =  async (req, res) => {
    const { userId } = req.params;
    const { category } = req.body;
    
    try {
      if (!ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }
    
      if (category === undefined || category === null) {
        return res.status(400).json({ error: 'Category is required' });
      }
    
      const user = await users.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      if (user.currentCategory !== undefined && user.words) {
        const unfinishedWords = user.words.filter(
          (word) =>
            word.category === user.currentCategory &&
            (word.status === 'new' || word.status === 'familiar') &&
            word.stage < 8
        );
    
        if (unfinishedWords.length > 0) {
          return res.status(400).json({
            error: 'You must finish the current category before switching',
          });
        }
      }
    
      await users.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: { currentCategory: category },
        }
      );
    
      res.json({ message: 'Category updated successfully', category });
    } catch (error) {
      console.error('Error setting category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
