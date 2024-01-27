import { getGroups, countInteractions, getXPS } from "./utils.js";

const graphqlEndpoint = "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql";

// Function to handle login
export async function login(evt) {
  evt.preventDefault()
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const credentials = btoa(`${username}:${password}`);

  try {
    const response = await fetch("https://learn.zone01dakar.sn/api/auth/signin", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${credentials}`
      }
    });

    if (!response.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await response.json();

    // Store the authToken in local storage
    localStorage.setItem("authToken", data);

    // Redirect to the profile page after successful login
    window.location.href = "profile.html";
  } catch (error) {
    document.getElementById("error-message").innerText = error.message;
  }
}

// Function to handle logout
export function logout() {
  // Remove the authToken from local storage
  localStorage.removeItem("authToken");

  // Redirect to the login page after logout
  window.location.href = "index.html";
}

// Function to fetch user data using GraphQL query
export async function fetchUserData() {
  const authToken = localStorage.getItem("authToken");
  // try {
  const response = await fetch(graphqlEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authToken}`, // Ensure authToken is available from login
    },
    body: JSON.stringify({
      query: `{
            user {
              id
              login
              firstName
              lastName
              campus
              auditRatio
              totalUp
              totalDown
              attrs
              groups {
                group {
                  members {
                    user {
                      login
                    }
                  }
                  object {
                    name
                  }
                  auditors(where:{grade: {_is_null: false}}) {
                    auditor {
                      login
                    }
                    grade
                  }
                }
              }
            }
            audits: transaction(
              order_by: {createdAt: asc}
              where: {type: {_regex: "up|down"}}
            ) {
              type
              amount
              path
              createdAt
            }
            xp: transaction(
              order_by: {createdAt: asc}
              where: {type: {_eq: "xp"}, eventId: {_eq: 56}}
            ) {
              createdAt
              amount
              path
            }
            skills: transaction(order_by: {createdAt: asc}, where: {eventId: {_eq: 56}}) {
              type
              amount
              path
            }
            xpTotal: transaction_aggregate(where: {type: {_eq: "xp"}, eventId: {_eq: 56}}) {
              aggregate {
                sum {
                  amount
                }
              }
            }
          }`
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user data");
  }

  const result = (await response.json()).data;
  const user = {
    id: result.user[0].id,
    login: result.user[0].login,
    email: result.user[0].attrs.email,
    campus: result.user[0].campus,
    ratio: result.user[0].auditRatio,
    firstName: result.user[0].firstName,
    lastName: result.user[0].lastName,
    xp: result.xpTotal.aggregate.sum.amount
  }

  const groups = getGroups(result.user[0].groups);
  const interactions = countInteractions(groups, user);
  const xps = getXPS(result.xp, user.xp)
  const audit = result.audits;
  const test = result.skills;
  const preElement = document.getElementById('json-data');
  preElement.style.fontSize = '18px';
  preElement.innerHTML = JSON.stringify(test, undefined, 2);
  if (result.errors) {
    logout();
    throw new Error(result.errors[0]);
  }
  displayUserData(user);
  displayRadarData(interactions);
  displayXp(xps);
  displayDownUpRatio(audit);
}

function displayDownUpRatio(downUpTransactions) {
  // Count the number of "down" and "up" transactions
  const downCount = downUpTransactions.filter((transaction) => transaction.type === "down").length;
  const upCount = downUpTransactions.filter((transaction) => transaction.type === "up").length;

  // Calculate the ratio
  const total = downCount + upCount;
  const downRatio = (downCount / total) * 100;
  const upRatio = (upCount / total) * 100;

  // Display the pie chart
  const dataString = `${downRatio.toFixed(2)};${upRatio.toFixed(2)}`;
  const labelsString = "Down;Up";

  document.getElementById("pie").innerHTML = `<pie-chart id="demo" data="${dataString}" gap="0.06" donut="0.2" labels="${labelsString}"></pie-chart>`;
}

function displayXp(data) {
  // Sorting data by score
  const sortedData = data.sort((a, b) => parseFloat(b.score) - parseFloat(a.score)).slice(0, 10);

  // Creating a color for each bar (you can customize this logic)
  const colors = getRandomColors(sortedData.length);

  // Creating the data string for the bar chart
  const dataString = sortedData.map((entry) => entry.score).join(';');
  const colorsString = colors.join(';');
  const labelsString = sortedData.map((entry) => entry.name).join(';');

  // Displaying the bar chart
  document.getElementById("bar").innerHTML = `<bar-chart data="${dataString}" colors="${colorsString}" labels="${labelsString}"></bar-chart>`;
}

// Function to generate random colors
function getRandomColors(count) {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const color = getRandomColor();
    colors.push(color);
  }
  return colors;
}

// Function to generate a random color
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function displayRadarData(interactions) {
  // Get the top 5 users based on interaction count
  const topUsers = Object.entries(interactions)
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, 10);

  // Extract labels, scores, ids, and max from the top 5 users
  const labels = topUsers.map(([user]) => user);
  const scores = topUsers.map(([, count]) => count);
  const ids = labels.map(label => `input_${label}`);
  const max = Math.max(...scores) + 1;

  // Generate the HTML for the radar chart
  const radarHTML = `<radar-chart scores="${scores.join(';')}" labels="${labels.join(';')}" ids="${ids.join(';')}" max="${max}"></radar-chart>`;

  // Display the radar chart in the "radar" element
  document.getElementById("radar").innerHTML = radarHTML;
}

function formatByteSize(bytes) {
  const kilobyte = 1000;
  const megabyte = kilobyte * 1000;
  const gigabyte = megabyte * 1000;

  if (bytes >= gigabyte) {
    return (bytes / gigabyte).toFixed() + ' GB';
  } else if (bytes >= megabyte) {
    return (bytes / megabyte).toFixed() + ' MB';
  } else if (bytes >= kilobyte) {
    return (bytes / kilobyte).toFixed() + ' KB';
  } else {
    return bytes + ' Bytes';
  }
}

// Function to display user data on the profile page
function displayUserData(user) {
  document.getElementById("welcome").innerText += ` ${user.firstName} ${user.lastName} 😁`;
  document.getElementById("email").innerText = `📧 ${user.email}`;
  document.getElementById("login").innerText = `👤 ${user.login}`;
  document.getElementById("campus").innerText = `${user.campus}`;
  document.getElementById("ratio").innerText = `🖊️ ${user.ratio.toFixed(1)}`;
  document.getElementById("xp").innerText = `⭐ ${formatByteSize(user.xp)}`;
}