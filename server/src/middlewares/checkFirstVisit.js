const visitorIPs = new Map();

const normalizeIP = (ip) => {
    // Check if IPv6 format like ::ffff:192.168.1.1
    if (ip.startsWith('::ffff:')) {
      // Extract the IPv4 part
      return ip.substring(7);
    }
    return ip;
  };
  

const checkFirstTimeVisitor = (req, res, next) => {
    const userIP = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const id = req.params.id;

    console.log(userIP, id);

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