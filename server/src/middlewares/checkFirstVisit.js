const checkFirstTimeVisitor = (req, res, next) => {
    const id = req.params.id;
    
    // Check if user has a visited cookie for this specific ID
    const visitedPages = req.cookies.visitedPages || {};
    
    if (!visitedPages[id]) {
      visitedPages[id] = true;
      
      res.cookie('visitedPages', visitedPages, {
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'lax'
      });
      
      req.isFirstVisit = true;
    } else {
      req.isFirstVisit = false;
    }
    
    next();
  };


module.exports = checkFirstTimeVisitor;