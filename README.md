Sure, here's a sample README file for the project:

---

# XP Transaction Analyzer

The XP Transaction Analyzer is a JavaScript utility that analyzes XP transactions and displays the data using interactive charts.

## Features

- Calculate the ratio of "down" and "up" transactions.
- Display the ratio using a pie chart.
- Simple and intuitive interface.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/xp-transaction-analyzer.git
```

2. Navigate to the project directory:

```bash
cd xp-transaction-analyzer
```

3. Open the `index.html` file in your web browser.

## Usage

1. Provide XP transactions data in the format specified.
2. Call the `displayDownUpRatio` function with the XP transactions data as an argument.
3. The pie chart will be displayed with the ratio of "down" and "up" transactions.

```javascript
// Example usage
const downUpTransactions = [
  {
    "type": "down",
    "amount": 5000,
    "path": "/dakar/div-01/go-reloaded",
    "createdAt": "2023-03-08T15:25:02.818932+00:00"
  },
  // Add more transactions here
  {
    "type": "up",
    "amount": 5000,
    "path": "/dakar/div-01/go-reloaded",
    "createdAt": "2023-03-09T13:49:28.065884+00:00"
  }
];

displayDownUpRatio(downUpTransactions);
```
