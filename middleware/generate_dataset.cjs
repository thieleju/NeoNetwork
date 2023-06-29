const fs = require("fs");
const {
  uniqueNamesGenerator,
  adjectives,
  names,
} = require("unique-names-generator");
const quotes = require("quotesy");

const nameConfig = {
  dictionaries: [adjectives, names],
  separator: " ",
  length: 2,
};

function generateRandomUsername() {
  const shortName = uniqueNamesGenerator(nameConfig);
  return shortName.charAt(0).toUpperCase() + shortName.slice(1);
}

const filename = "csvs\\data.csv";
const users = [];
const sizeUsers = 20000;
const maxFriends = 20;
const maxPosts = 5;

// Generate users
for (let i = 0; i < sizeUsers; i++) {
  const user = {
    name: generateRandomUsername(),
    friends: [],
    posts: [],
  };
  users.push(user);
}

// Generate random relationships
users.forEach((user) => {
  const friendCount = Math.floor(Math.random() * maxFriends + 1);

  for (let i = 0; i < friendCount; i++) {
    const friend = users[Math.floor(Math.random() * users.length)];

    if (
      user.friends.includes(friend) ||
      friend.friends.includes(user) ||
      user === friend
    ) {
      continue;
    }
    user.friends.push(friend);
  }
});

// Generate posts
users.forEach((user) => {
  const postCount = Math.floor(Math.random() * maxPosts + 1);

  for (let i = 0; i < postCount; i++) {
    const post = {
      title: "",
      message: quotes.random().text.replace(/,/g, ""),
    };
    user.posts.push(post);
  }
});

// Generate CSV content
const csvHeaders = "user,friends,posts\n";
let row = "";

users.forEach((user) => {
  row +=
    user.name +
    "," +
    user.friends.map((friend) => friend.name).join("|") +
    "," +
    user.posts.map((post) => post.message).join("|") +
    "\n";
});

const csvContent = csvHeaders + row;

fs.writeFile(filename, csvContent, "utf8", (err) => {
  if (err) {
    console.error("Error writing CSV file:", err);
  } else {
    console.log("CSV file generated successfully!");
  }
});
