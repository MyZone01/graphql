const displayGradeData = (gradeData) => {
    let progressArray = gradeData.data.user[0].progresses;
    let dataResult = document.getElementById("grades");
    for (let i = 0; i < progressArray.length; i++) {
        let projectNameAndGrade = document.createElement("p");

        projectNameAndGrade.innerHTML = `${progressArray[i].object.name
            }: ${progressArray[i].grade.toFixed(2)}&nbsp`;

        dataResult.appendChild(projectNameAndGrade);
    }
};

const displayUserIdData = (userIdData) => {
    let userInfoDiv = document.getElementById("user-identification");
    let userID = document.createElement("p");
    let userLogin = document.createElement("p");
    let userCampus = document.createElement("p");

    userID.innerHTML = `User ID: ${userIdData.data.user[0].id}`;
    userLogin.innerHTML = `Username: ${userIdData.data.user[0].login}`;
    userCampus.innerHTML = `Campus: ${userIdData.data.user[0].progresses[0].campus}`;

    userInfoDiv.appendChild(userID);
    userInfoDiv.appendChild(userLogin);
    userInfoDiv.appendChild(userCampus);
};

const displayTotalXpData = (totalXpData) => {
    let xpArray = totalXpData.data.user[0].transactions;
    let totalXpFromProject = 0;
    let maxXpFromProject = xpArray[0].amount;
    let minXpFromProject = xpArray[0].amount;
    let maxXP = document.createElement("p");
    let minXP = document.createElement("p");
    //for (let i = 0; i < xpArray.length; i++) {
    xpArray.forEach((elem) => {
        if (elem.amount >= maxXpFromProject) {
            maxXpFromProject = elem.amount;
            maxXP.innerHTML = `Max: ${elem.object.name} ${maxXpFromProject / 1000}KB`;
        }
        if (elem.amount < minXpFromProject && elem.amount >= 5000) {
            minXpFromProject = elem.amount;
            minXP.innerHTML = `Min: ${elem.object.name} ${minXpFromProject / 1000}KB`;
        }
        if (
            elem.amount > 9000 ||
            (elem.amount >= 5000 && elem.object.name !== "forum")
        ) {
            totalXpFromProject += elem.amount;
        }
    });

    //}
    let avgXpPerProject = totalXpFromProject / xpArray.length;

    let totalXpDiv = document.getElementById("xp");

    let totalXP = document.createElement("p");

    let avgXP = document.createElement("p");

    totalXP.innerHTML = `Total: ${totalXpFromProject / 1000}KB`;
    avgXP.innerHTML = `Avg: ${(avgXpPerProject / 1000).toFixed(2)}KB`;
    totalXpDiv.appendChild(totalXP);
    totalXpDiv.appendChild(avgXP);
    totalXpDiv.appendChild(maxXP);
    totalXpDiv.appendChild(minXP);
};

const displaySkillData = (skillData) => {
    let skillDataArray = skillData.data.user[0].transactions;
    let skills = {
        go: {
            amount: 0,
        },
        backEnd: {
            amount: 0,
        },
        frontEnd: {
            amount: 0,
        },
        js: {
            amount: 0,
        },
        game: {
            amount: 0,
        },
        html: {
            amount: 0,
        },
        sysAdmin: {
            amount: 0,
        },
        docker: {
            amount: 0,
        },
        sql: {
            amount: 0,
        },
        stats: {
            amount: 0,
        },
        algo: {
            amount: 0,
        },
        css: {
            amount: 0,
        },
    };
    console.log({ skillDataArray });
    let totalSkillAmount = 0;
    skillDataArray.forEach((skill) => {
        switch (skill.type) {
            case "skill_go":
                totalSkillAmount += skill.amount;
                skills.go.amount += skill.amount;
            case "skill_js":
                totalSkillAmount += skill.amount;

                skills.js.amount += skill.amount;
            case "skill_back-end":
                totalSkillAmount += skill.amount;

                skills.backEnd.amount += skill.amount;
            case "skill_front-end":
                totalSkillAmount += skill.amount;

                skills.frontEnd.amount += skill.amount;
            case "skill_game":
                totalSkillAmount += skill.amount;

                skills.game.amount += skill.amount;
            case "skill_algo":
                totalSkillAmount += skill.amount;

                skills.algo.amount += skill.amount;
            case "skill_stats":
                totalSkillAmount += skill.amount;

                skills.stats.amount += skill.amount;

            case "skill_sql":
                totalSkillAmount += skill.amount;

                skills.sql.amount += skill.amount;
            case "skill_sys-admin":
                totalSkillAmount += skill.amount;

                skills.sysAdmin.amount += skill.amount;
            case "skill_docker":
                totalSkillAmount += skill.amount;

                skills.docker.amount += skill.amount;
            case "skill_html":
                totalSkillAmount += skill.amount;

                skills.html.amount += skill.amount;
            case "skill_css":
                totalSkillAmount += skill.amount;

                skills.css.amount += skill.amount;
        }
    });

    let skillResult = document.getElementById("skill");

    // for (const skill in skills) {
    //   console.log(skill.amount);
    //   let skillAndAmount = document.createElement("p");
    //   skillAndAmount.innerHTML += `${skill} + ${skill.amount}`;
    //   skillResult.appendChild(skillAndAmount);
    // }

    Object.entries(skills).forEach((skill) => {
        let skillAndAmount = document.createElement("p");
        skillAndAmount.innerHTML += ` ${skill[0]}: ${skill[1].amount}`;
        skillResult.appendChild(skillAndAmount);
    });

    console.log({ totalSkillAmount });
    console.log({ skills });
};

export {
    displayGradeData,
    displayUserIdData,
    displayTotalXpData,
    displaySkillData,
};
