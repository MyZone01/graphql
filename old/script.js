const getToken = () => {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", `Basic c2VyaWdubWJheWU6TUBya2NoM2w=`);

    let requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
    };

    return fetch("https://learn.zone01dakar.sn/api/auth/signin", requestOptions)
        .then((response) => response.text())
        .then((result) => result);
};

let graphql = JSON.stringify({
    query: /*graphql*/`{
      user(where:{login:{_eq:"serignmbaye"}}){
        login
          transactions(where:{_or: [{_and: [{type: {_eq: "xp"}}, {object: {type: {_eq: "bonus"}}}]},{
            _and: [{type:{_eq:"xp"}}, {createdAt:{_gte:"2021-10-01"}}, {amount:{_gte:"5000"}}]}]} order_by:{createdAt: desc}){
            object{
              name
            }
            amount type
          }
          progresses(where:{
            _and: [{object:{type:{_eq:"project"}}}, {isDone: {_eq: true}}]}){
              createdAt
              updatedAt
              object {
                name
              }
              grade
            }
          }
        }`,
});

(async () => {
    const token = await getToken();
    console.log(token);

    let requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token.slice(1, token.length - 1),
        },
        body: graphql,
    };
    console.log(requestOptions);

    fetch(
        "https://learn.zone01dakar.sn/api/graphql-engine/v1/graphql",
        requestOptions
    )
        .then((response) => response.json())
        .then((result) => {
            console.log(result)
            if (result && result.data) {
                sortTransaction(result.data);
                sortProgress(result.data);
            } else {
                console.log("Invalid response data:", result);
            }
        })
        .catch((error) => console.log("error", error));

})();


const msToDays = (ms) => {
    return Math.trunc(ms / (1000 * 60 * 60 * 24));
};

const sortTransaction = (data) => {

    if (data && data.user) {
        //console.log("Data from fetch for serignmbaye", data);
        for (let obj of data.user) {
            //  console.log(obj.transactions)

            const res = Object.values(
                obj.transactions.reduce((acc, obj) => {
                    const curr = acc[obj.object.name];
                    acc[obj.object.name] = curr
                        ? curr.amount < obj.amount
                            ? obj
                            : curr
                        : obj;
                    return acc;
                }, {})
            );

            res.sort(function (a, b) {
                return new Date(b.object.createdAt) - new Date(a.object.createdAt);
            });

            let sum = 0;
            let xpPie = {};

            for (let subj of Object.values(res)) {
                console.log(subj.object.name, subj.amount / 1000);
                subj.amount = subj.amount / 1000;
                sum += subj.amount;
                xpPie[subj.object.name] = subj.amount;
            }

            createPie(sum, xpPie);
            console.log("SUM", sum);
            console.log("XPPIE", xpPie);

            Object.entries(xpPie).forEach(([key]) => {
                let a = document.createElement("a");
                let linkText = document.createTextNode(`${key}`);
                a.appendChild(linkText);
                a.title = key;
            });

            let totalXP = Math.round(sum) + "kB";
            console.log(totalXP);

            xp.innerHTML = totalXP;
        }
    } else {
        console.log("Invalid data object:", data);
    }
};

let yAxis = 9;
let startY = 1;
const yRow = 25;

const createBar = (days, subject) => {
    let barWidth = days * 5;
    let barSpace = 200;

    return ` <g class="bar">
    <rect width="${barWidth}" height="19" y="${startY}"></rect>
    <text x="${barSpace}" y="${yAxis}" dy=".35em">${subject}</text>
    <text x="10" y="${yAxis}" dy=".35em">${days} days</text>

  </g>`;
};

let strokeDOF = 0;

const createPie = (totalXP, subjData) => {
    Object.entries(subjData).forEach(([key, value]) => {
        console.log(value);
        let slice = (value / totalXP) * 31.4;

        let randomColor = Math.floor(Math.random() * 16777215).toString(16);

        pieChart.innerHTML += `
            <circle r="5" cx="10" cy="10" fill="transparent"
            stroke=#${randomColor}
            stroke-width="10"
            stroke-dasharray="${slice} 31.4"
            stroke-dashoffset="-${strokeDOF}"
            data-name="${key}"
            data-value="${value}"
            />	
             `;

        strokeDOF += slice;
    });

    let children = document.querySelectorAll("#pie-chart > circle");

    for (let first of children) {
        first.addEventListener("mouseover", (e) => {
            pieSubject.innerHTML = e.target.dataset.name;
            pieXP.innerHTML =
                ((e.target.dataset.value / totalXP) * 100).toFixed(2) + "%";
        });
    }

    console.log("children", children);
};

const createTable = (subjData) => {
    console.log(subjData);

    Object.entries(subjData).forEach(([key, value]) => {
        let tr = "<tr>";

        tr += "<td>" + key + "</td>" + "<td>" + value.toString() + "</td></tr>";

        /* We add the table row to the table body */
        tbody.innerHTML += tr;
    });
};

const sortProgress = (data) => {
    console.log("Data from fetch for serignmbaye", data);
    let projBar = {};
    let grade = {};

    for (let obj of data.user) {
        console.log(obj.progresses);
        obj.progresses.sort(function (a, b) {
            return new Date(a.createdAt) - new Date(b.createdAt);
        });
        console.log("where is go--reloaded", obj.progresses);

        for (let i = 0; i < obj.progresses.length; i++) {
            projBar[obj.progresses[i].object.name] = msToDays(
                new Date(obj.progresses[i].updatedAt) -
                new Date(obj.progresses[i].createdAt)
            );
            grade[obj.progresses[i].object.name] =
                obj.progresses[i].grade.toFixed(2);
        }
    }
    console.log("where is go--reloaded", projBar);

    createTable(grade);

    Object.entries(projBar).forEach(([key, value]) => {
        let barDiv = createBar(value, key);

        barChart.innerHTML += barDiv;
        yAxis += yRow;
        startY += yRow;
    }),
        (yAxis = 9);
    startY = 0;
};
