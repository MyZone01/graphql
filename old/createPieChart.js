const xpPieChart = (xpPerTypeData) => {
    let xpTypeArray = [];
    let typeName = document.getElementById("type-name");
    let typeAmount = document.getElementById("type-xp");
    console.log(typeName);

    xpPerTypeData.data.user[0].a.forEach((obj) => {
        xpTypeArray.push(obj);
    });
    xpPerTypeData.data.user[0].b.forEach((obj) => {
        xpTypeArray.push(obj);
    });
    xpPerTypeData.data.user[0].c.forEach((obj) => {
        xpTypeArray.push(obj);
    });
    xpPerTypeData.data.user[0].d.forEach((obj) => {
        xpTypeArray.push(obj);
    });
    xpPerTypeData.data.user[0].e.forEach((obj) => {
        xpTypeArray.push(obj);
    });

    let totalXPAmount = 0;

    xpTypeArray.forEach((elem) => {
        {
            totalXPAmount += elem.amount;
        }
    });

    let totalXpPerTypeArray = [];

    let projectXPObject = {
        type: "project",
        amount: 0,
    };
    let exerciseXPObject = {
        type: "exercise",
        amount: 0,
    };

    let piscineXPObject = {
        type: "piscine",
        amount: 0,
    };

    let raidXPObject = {
        type: "raid",
        amount: 0,
    };
    xpTypeArray.forEach((task) => {
        if (
            (task.object.type === "project" && task.amount > 9000) ||
            (task.object.type === "project" &&
                task.amount >= 5000)
        ) {
            projectXPObject.amount += task.amount;
        } else if (task.object.type === "exercise") {
            exerciseXPObject.amount += task.amount;
        } else if (task.object.type === "piscine") {
            piscineXPObject.amount += task.amount;
        } else {
            raidXPObject.amount += task.amount;
        }
    });

    totalXpPerTypeArray.push(
        projectXPObject,
        exerciseXPObject,
        piscineXPObject,
        raidXPObject
    );

    let graphDiv = document.getElementById("graphs");

    let pieChart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    pieChart.setAttribute("id", "pie-chart");
    pieChart.setAttribute("viewBox", `0 0 20 20`);
    let backgroundCircle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
    );

    backgroundCircle.setAttribute("r", "10");
    backgroundCircle.setAttribute("fill", "white");
    backgroundCircle.setAttribute("cx", "10");
    backgroundCircle.setAttribute("cy", "10");

    pieChart.appendChild(backgroundCircle);
    let i = 0;
    let sliceOffset = 0;

    totalXpPerTypeArray.forEach((elem, index) => {
        let xpPercentage = (((100 / totalXPAmount) * elem.amount) / 100) * 31.42;

        let pieSlice = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );
        let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const labelText = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );
        let proportion = (elem.amount / totalXPAmount) * 31.4;

        pieSlice.setAttribute("r", "5");
        pieSlice.setAttribute("class", "pie-slice");

        pieSlice.setAttribute("fill", "transparent");

        pieSlice.setAttribute("cx", "10");
        pieSlice.setAttribute("cy", "10");
        pieSlice.setAttribute("stroke", CSS_COLOR_NAMES[i]);

        pieSlice.setAttribute("stroke-width", "10");
        pieSlice.setAttribute("stroke-dasharray", `${xpPercentage} 31.42`);

        pieSlice.setAttribute("stroke-dashoffset", `${-sliceOffset}`);
        pieSlice.setAttribute("data-name", `${elem.type}`);
        pieSlice.setAttribute("data-value", `${elem.amount}`);
        console.log(elem.amount);

        g.addEventListener("mousedown", function (e) {
            typeName.innerHTML = e.target.dataset.name;
            console.log(e.target.dataset.name);
            typeAmount.innerHTML = e.target.dataset.value / 1000 + "KB";
        });

        g.addEventListener("mouseleave", function (e) {
            typeName.innerHTML = "";

            typeAmount.innerHTML = "";
        });

        g.appendChild(pieSlice);

        pieChart.appendChild(g);
        i++;
        sliceOffset += proportion;

        graphDiv.appendChild(pieChart);
    });
};

const CSS_COLOR_NAMES = ["Yellow", "Green", "OrangeRed", "Gray"];

export { xpPieChart };
