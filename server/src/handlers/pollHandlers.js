const { v4: uuidv4 } = require('uuid');
const pollModel = require('../models/pollModel');
const delay = require('../middlewares/delay');
const config = require('../config/config');

// Get all polls
exports.getAllPolls = async (req, res) => {
  await delay(config.DEMO_DELAY);

  const {user} = req;

  res.json({
    success: true,
    data: pollModel.getByCreator(user.email)
  });
};

// Get poll by ID
exports.getPollById = async (req, res) => {
  const poll = pollModel.getById(req.params.id);
  
  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  await delay(config.DEMO_DELAY);
  
  res.json({
    success: true,
    data: poll
  });
};

// Update poll (vote on an option)
exports.voteOnPoll = async (req, res) => {

    if(!req.isFirstVisit) {
        return res.status(401).json({
            success: false,
            error: 'Already Voted.'
          });
    }

  const { id } = req.params;
  const { optionIndex } = req.body;
  
  const pollIndex = pollModel.findIndex(id);
  
  if (pollIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }
  
  const poll = pollModel.getById(id);
  
  // Check if poll is still accepting votes
  if (!poll.accepting) {
    return res.status(400).json({
      success: false,
      message: 'This poll is no longer accepting votes'
    });
  }
  
  // Check if option index is valid
  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid option index'
    });
  }
  
  // Increment vote count
  poll.options[optionIndex].votes++;
  
  // Update the updatedAt timestamp
  poll.updatedAt = new Date().toISOString();
  
  // Update the polls array
  pollModel.update(pollIndex, poll);
  
  await delay(config.DEMO_DELAY);

  res.json({
    success: true,
    message: 'Vote recorded successfully',
    data: poll
  });
};

// Create a new poll
exports.createPoll = async (req, res) => {
  const { question, theme, options } = req.body;

  const createdBy = req.user.email;
  
  // Input validation
  if (!question || !theme || !options || !Array.isArray(options) || options.length < 2 || !createdBy) {
    return res.status(400).json({
      success: false,
      message: 'Invalid poll data. Required: question, theme, at least 2 options, and createdBy.'
    });
  }
  
  // Create new poll with ID
  const newId = uuidv4();
  const newPoll = {
    id: newId,
    question,
    theme,
    options: options.map(opt => ({ text: opt.text, votes: 0 })),
    createdBy,
    createdAt: new Date().toISOString(),
    updatedAt: '',
    accepting: true
  };
  
  pollModel.create(newPoll);
  
  await delay(config.DEMO_DELAY);

  res.status(201).json({
    success: true,
    message: 'Poll created successfully',
    data: newPoll
  });
};

// Toggle poll accepting status
exports.toggleAccepting = (req, res) => {
  const { id } = req.params;
  const pollIndex = pollModel.findIndex(id);
  
  if (pollIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }
  
  const poll = pollModel.getById(id);
  poll.accepting = !poll.accepting;
  poll.updatedAt = new Date().toISOString();
  
  pollModel.update(pollIndex, poll);
  
  res.json({
    success: true,
    message: `Poll is now ${poll.accepting ? 'accepting' : 'not accepting'} votes`,
    data: poll
  });
};

// Delete a poll
exports.deletePoll = (req, res) => {
  const { id } = req.params;
  const pollIndex = pollModel.findIndex(id);
  
  if (pollIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }
  
  const deletedPoll = pollModel.delete(pollIndex);
  
  res.json({
    success: true,
    message: 'Poll deleted successfully',
    data: deletedPoll
  });
};

// Update poll information (not just votes)
exports.updatePoll = async (req, res) => {
  const { id } = req.params;
  const { 
    optionIndex,           // For voting on a specific option
    question,              // Update poll question
    theme,                 // Update poll theme
    options,               // Replace options array
    accepting,             // Update accepting status
    addOption,             // Add a new option
    removeOptionIndex      // Remove an option by index
  } = req.body;
  
  const pollIndex = pollModel.findIndex(id);
  
  if (pollIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }
  
  const poll = { ...pollModel.getById(id) };  // Create a copy to modify
  let modified = false;
  
  // Handle voting on an option
  if (optionIndex !== undefined) {
    // Check if poll is still accepting votes
    if (!poll.accepting) {
      return res.status(400).json({
        success: false,
        message: 'This poll is no longer accepting votes'
      });
    }
    
    // Check if option index is valid
    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option index'
      });
    }
    
    // Increment vote count
    poll.options[optionIndex].votes++;
    modified = true;
  }
  
  // Update question
  if (question !== undefined) {
    poll.question = question;
    modified = true;
  }
  
  // Update theme
  if (theme !== undefined) {
    poll.theme = theme;
    modified = true;
  }
  
  // Update accepting status
  if (accepting !== undefined) {
    poll.accepting = Boolean(accepting);
    modified = true;
  }
  
  // Replace entire options array
  if (options !== undefined && Array.isArray(options)) {
    // Validate the new options array
    if (options.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Poll must have at least 2 options'
      });
    }
    
    // Convert options to proper format if they aren't already
    poll.options = options.map(opt => {
      if (typeof opt === 'string') {
        return { text: opt, votes: 0 };
      } else if (typeof opt === 'object' && opt.text) {
        return { 
          text: opt.text, 
          votes: opt.votes !== undefined ? opt.votes : 0 
        };
      }
      return opt;
    });
    modified = true;
  }
  
  // Add a new option
  if (addOption !== undefined) {
    const newOption = typeof addOption === 'string' 
      ? { text: addOption, votes: 0 }
      : { text: addOption.text, votes: addOption.votes || 0 };
    
    poll.options.push(newOption);
    modified = true;
  }
  
  // Remove an option
  if (removeOptionIndex !== undefined) {
    // Check if option index is valid
    if (removeOptionIndex < 0 || removeOptionIndex >= poll.options.length) {
      return res.status(400).json({
        success: false,
        message: 'Invalid option index for removal'
      });
    }
    
    // Ensure we always have at least 2 options
    if (poll.options.length <= 2) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove option: poll must have at least 2 options'
      });
    }
    
    poll.options.splice(removeOptionIndex, 1);
    modified = true;
  }
  
  // Only update timestamp if something was modified
  if (modified) {
    poll.updatedAt = new Date().toISOString();
    pollModel.update(pollIndex, poll);
  } else {
    return res.status(400).json({
      success: false,
      message: 'No valid update parameters provided'
    });
  }

  await delay(config.DEMO_DELAY);
  
  res.json({
    success: true,
    message: 'Poll updated successfully',
    data: poll
  });
};