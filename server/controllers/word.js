import db from '../db/connectDB.js';
import { ObjectId } from 'mongodb';

const { words, users } = db;

export const getWords = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await users.findOne({ _id: new ObjectId(id) });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid user ID format' });
    }

    const currentCategory = user.currentCategory;
    if (currentCategory === undefined || currentCategory === null) {
      return res.status(400).json({ error: 'No category selected' });
    }

    let userWords = user.words || [];

    const userWordsInCategory = userWords.filter(
      (word) => word.category === currentCategory
    );
    const wordStatusNew = userWordsInCategory.filter(
      (word) => word.status === 'new'
    );
    const newWordsAmount = 10 - wordStatusNew.length;
    let updatedWords = [...userWords];

    let userWordsUpdatedFlag = false;

    if (newWordsAmount > 0) {
      const existingIdsSet = new Set(userWords.map((w) => String(w._id)));

      const potentialNewWords = await words
        .find({
          category: currentCategory,
          _id: { $nin: Array.from(existingIdsSet).map((id) => new ObjectId(id)) },
        })
        .sort({ _id: 1 })
        .limit(newWordsAmount)
        .toArray();

      const filteredNewWords = potentialNewWords
        .filter((word) => !existingIdsSet.has(String(word._id)))
        .slice(0, newWordsAmount);

      if (filteredNewWords.length > 0) {
        updatedWords = [
          ...userWords,
          ...filteredNewWords.map((word) => ({
            ...word,
            status: 'new',
            counter: 0,
            stage: 0,
            category: currentCategory,
          })),
        ];

        await users.updateOne(
          { _id: new ObjectId(id) },
          {
            $set: {
              words: updatedWords,
              lastView_date: new Date(),
            },
          }
        );
        userWordsUpdatedFlag = true;
      }
    }

    if (userWordsUpdatedFlag) {
      user = await users.findOne({ _id: new ObjectId(id) });
      userWords = user.words || [];
    }

    const totalWordsInGlobalCategory = await words.countDocuments({
      category: currentCategory,
    });
    const userWordsAtStage8InCategory = userWords.filter(
      (word) => word.category === currentCategory && word.stage === 8
    );

    if (
      userWordsAtStage8InCategory.length === totalWordsInGlobalCategory &&
      totalWordsInGlobalCategory > 0
    ) {
      const updatedLearnedCategories = new Set(user.learnedCategories || []);
      updatedLearnedCategories.add(currentCategory);

      await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: { learnedCategories: Array.from(updatedLearnedCategories) } }
      );
      return res.json({
        message: 'category completed',
        needToUpdate: true,
      });
    }

    const wordsAtStage8 = userWords.filter(
      (word) => word.category === currentCategory && word.stage === 8
    );
    const activeWords = userWords.filter(
      (word) =>
        word.category === currentCategory &&
        (word.status === 'new' || word.status === 'familiar') &&
        word.stage < 8
    );

    if (wordsAtStage8.length > 0 && activeWords.length === 0) {
      return res.json({
        message: 'finished set',
        needToUpdate: true,
      });
    }

    const nextWord = user.words
      .filter(
        (word) =>
          word.category === currentCategory &&
          (word.status === 'new' || word.status === 'familiar')
      )
      .sort((a, b) => a.stage - b.stage)[0];

    if (!nextWord) {
      return res
        .status(404)
        .json({ error: 'No active word found for learning in this category.' });
    }

    const frontBack = await words.findOne({
      _id: new ObjectId(nextWord._id),
    });

    if (!frontBack) {
      return res
        .status(404)
        .json({ error: 'Word data not found in words collection' });
    }

    nextWord.front = frontBack.front;
    nextWord.back = frontBack.back;

    const totalWordsWithStageNew = user.words.filter(
      (word) =>
        word.category === currentCategory &&
        word.status === 'new' &&
        word.stage === nextWord.stage
    );

    let totalWordsWithStage = [...totalWordsWithStageNew];

    if (nextWord.stage >= 5) {
      const familiarWords = user.words.filter(
        (word) =>
          word.category === currentCategory &&
          word.status === 'familiar' &&
          word.stage === nextWord.stage
      );

      const slotsLeft = 15 - totalWordsWithStage.length;
      if (slotsLeft > 0) {
        totalWordsWithStage = totalWordsWithStage.concat(
          familiarWords.slice(0, slotsLeft)
        );
      }
    }

    res.json({
      word: nextWord,
      totalWordsWithStageNew: totalWordsWithStageNew.length,
      totalWordsWithStage: totalWordsWithStage.length,
    });
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWord = async (req, res) => {
  try {
    const { userId, wordId } = req.params;
    const updateData = req.body;

    if (updateData.counter === undefined && updateData.stage === undefined) {
      return res
        .status(400)
        .json({ error: "Both 'counter' and 'stage' are missing" });
    }

    const updateFields = {};
    if (updateData.counter !== undefined)
      updateFields['words.$[elem].counter'] = updateData.counter;
    if (updateData.stage !== undefined)
      updateFields['words.$[elem].stage'] = updateData.stage;

    const result = await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      {
        arrayFilters: [{ 'elem._id': new ObjectId(wordId) }],
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: 'Word not updated' });
    }

    res.json({ message: 'Word updated successfully' });
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateWords = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) return res.status(400).json({ error: 'Missing user ID' });

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user || !user.words) {
      return res.status(404).json({ error: 'User or words not found' });
    }

    const updatedWords = user.words.map((word) => {
      if (word.status !== 'new') return word;

      let updatedData = { ...word };

      if (word.status === 'new') {
        if (word.counter === 0 || word.counter === 1) {
          updatedData.status = 'learned';
        } else if (word.counter === 2 || word.counter === 3) {
          updatedData.status = 'familiar';
          updatedData.counter = 0;
          updatedData.stage = 3;
        } else if (word.counter === 4 || word.counter === 5) {
          updatedData.status = 'new';
          updatedData.counter = 0;
          updatedData.stage = 0;
        }
      } else if (word.status === 'familiar') {
        if (word.counter === 0 || word.counter === 1) {
          updatedData.status = 'learned';
        } else if (word.counter === 2 || word.counter === 3) {
          updatedData.status = 'familiar';
          updatedData.counter = 0;
          updatedData.stage = 3;
        } else if (word.counter === 4 || word.counter === 5) {
          updatedData.status = 'new';
          updatedData.counter = 0;
          updatedData.stage = 0;
        }
      }

      return updatedData;
    });

    await users.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { words: updatedWords } }
    );

    res.json({ message: 'User words updated successfully' });
  } catch (error) {
    console.error('Error updating user words:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizTwo = async (req, res) => {
  try {
    const { userId, wordId } = req.params;

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wordEntry = user.words.find((word) => word._id.toString() === wordId);
    if (!wordEntry) {
      return res.status(404).json({ error: "Word not found in user's list" });
    }

    const currentWord = await words.findOne({ _id: new ObjectId(wordId) });
    if (!currentWord) {
      return res
        .status(404)
        .json({ error: 'Word not found in words collection' });
    }

    const suitableWordIds = user.words
      .filter((w) => w.status === 'new' && w._id.toString() !== wordId)
      .map((w) => new ObjectId(w._id));

    if (suitableWordIds.length < 1) {
      return res
        .status(404)
        .json({ error: "Not enough alternative words with status 'new'" });
    }

    const [wrongWord] = await words
      .aggregate([
        { $match: { _id: { $in: suitableWordIds } } },
        { $sample: { size: 1 } },
      ])
      .toArray();

    const options = [currentWord.back, wrongWord.back].sort(
      () => Math.random() - 0.5
    );

    res.json({
      question: currentWord.front,
      options,
      correctAnswer: currentWord.back,
      wordId: currentWord._id,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuizFour = async (req, res) => {
  try {
    const { userId, wordId } = req.params;
    const direction = req.query.direction || 'front-to-back';

    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const wordEntry = user.words.find((word) => word._id.toString() === wordId);
    if (!wordEntry) {
      return res.status(404).json({ error: "Word not found in user's list" });
    }

    const currentWord = await words.findOne({ _id: new ObjectId(wordId) });
    if (!currentWord) {
      return res
        .status(404)
        .json({ error: 'Word not found in words collection' });
    }

    let suitableWordIds = user.words
      .filter(
        (w) =>
          (w.status === 'new' || w.status === 'familiar') &&
          w._id.toString() !== wordId
      )
      .map((w) => new ObjectId(w._id));

    if (suitableWordIds.length < 3) {
      const additionalIds = user.words
        .filter(
          (w) =>
            w.status === 'learned' &&
            w._id.toString() !== wordId &&
            !suitableWordIds.some((id) => id.toString() === w._id.toString())
        )
        .map((w) => new ObjectId(w._id));

      suitableWordIds = [...suitableWordIds, ...additionalIds].slice(0, 10);
    }

    if (suitableWordIds.length < 3) {
      return res.status(404).json({ error: 'Not enough alternative words' });
    }

    const wrongAnswers = await words
      .aggregate([
        { $match: { _id: { $in: suitableWordIds } } },
        { $sample: { size: 3 } },
      ])
      .toArray();

    const questionField = direction === 'front-to-back' ? 'front' : 'back';
    const answerField = direction === 'front-to-back' ? 'back' : 'front';

    const incorrectOptions = wrongAnswers.map((word) => word[answerField]);
    const correctAnswer = currentWord[answerField];

    const options = [correctAnswer, ...incorrectOptions].sort(
      () => Math.random() - 0.5
    );

    res.json({
      question: currentWord[questionField],
      options,
      correctAnswer,
      wordId: currentWord._id,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getWordById = async (req, res) => {
  const { id } = req.params;

  try {
    const word = await words.findOne({ _id: new ObjectId(id) });
    if (!word) {
      return res.status(404).json({ error: 'Word not found' });
    }
    res.json(word);
  } catch (error) {
    console.error('Error fetching word:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
