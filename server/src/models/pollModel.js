// Sample data with IDs added
let polls = [
    {
        id: "h347hd839bd73",
        question: "What's your favorite JS framework?",
        theme: "strawberry",
        options: [
            { text: "React", votes: 12 },
            { text: "Vue", votes: 5 },
            { text: "Svelte", votes: 3 },
        ],
        createdBy: "605c5d8e8f1a4b0022bc1f9f",
        createdAt: "2025-04-10T12:00:00.000Z",
        updatedAt: "",
        accepting: true,
    },
    {
        id: "dh3u4e32y6h2f42834d2",
        question: "Which cloud provider do you prefer?",
        theme: "blueberry",
        options: [
            { text: "AWS", votes: 24 },
            { text: "Azure", votes: 18 },
            { text: "Google Cloud", votes: 15 },
            { text: "DigitalOcean", votes: 7 },
        ],
        createdBy: "605c5d8e8f1a4b0022bc1f9f",
        createdAt: "2025-04-08T09:15:33.000Z",
        updatedAt: "2025-04-09T14:22:45.000Z",
        accepting: true,
    },
    {
        id: "d3y2885yb85386639825",
        question: "Best programming language for beginners?",
        theme: "lime",
        options: [
            { text: "Python", votes: 42 },
            { text: "JavaScript", votes: 28 },
            { text: "Java", votes: 16 },
            { text: "C#", votes: 11 },
        ],
        createdBy: "60a72f4e9d8e3c0034b21caa",
        createdAt: "2025-04-05T18:30:00.000Z",
        updatedAt: "2025-04-09T22:15:10.000Z",
        accepting: true,
    },
    {
        id: "dny58689682cb5238bt5c",
        question: "Favorite code editor?",
        theme: "grape",
        options: [
            { text: "VS Code", votes: 38 },
            { text: "JetBrains IDEs", votes: 22 },
            { text: "Vim/Neovim", votes: 15 },
            { text: "Sublime Text", votes: 8 },
            { text: "Emacs", votes: 6 },
        ],
        createdBy: "61b3d45fc78aa20045def123",
        createdAt: "2025-04-02T10:45:22.000Z",
        updatedAt: "2025-04-08T16:33:40.000Z",
        accepting: true,
    },
    {
        id: "dn3u4yr8765169b16158",
        question: "Most exciting tech trend for 2025?",
        theme: "tangerine",
        options: [
            { text: "AI/ML advances", votes: 34 },
            { text: "Web3/decentralized apps", votes: 16 },
            { text: "AR/VR development", votes: 23 },
            { text: "Edge computing", votes: 12 },
            { text: "Quantum computing", votes: 19 },
        ],
        createdBy: "605c5d8e8f1a4b0022bc1f9f",
        createdAt: "2025-03-28T14:20:15.000Z",
        updatedAt: "2025-04-07T08:12:30.000Z",
        accepting: true,
    },
];

module.exports = {
    getAll: () => polls,
    getById: (id) => polls.find((p) => p.id === id),
    getByCreator: (email) => polls.filter((p) => p.createdBy === email),
    findIndex: (id) => polls.findIndex((p) => p.id === id),
    create: (poll) => {
        polls.push(poll);
        return poll;
    },
    update: (index, poll) => {
        polls[index] = poll;
        return poll;
    },
    delete: (index) => {
        return polls.splice(index, 1)[0];
    },
};
