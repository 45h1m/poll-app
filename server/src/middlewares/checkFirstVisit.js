const visitorIPs = new Map();

const checkFirstTimeVisitor = (req, res, next) => {
    const userIP = req.ip;
    const id = req.params.id;

    if (visitorIPs.has(userIP + id)) {

        req.isFirstVisit = false;

        const visitorData = visitorIPs.get(userIP + id);
        visitorData.visits += 1;
        visitorData.lastVisit = new Date().toISOString();
        visitorIPs.set(userIP + id, visitorData);
    } else {

        req.isFirstVisit = true;
        visitorIPs.set(userIP + id, {
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString(),
            visits: 1,
        });
    }

    next();
};


module.exports = checkFirstTimeVisitor;