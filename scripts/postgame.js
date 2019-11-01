function setUser() {
    let userForm = document.getElementById("userForm");
    let name = userForm.elements[0].value;
    localStorage.setItem("currentUser", name);

    let score = JSON.parse(localStorage.getItem("Score"));
    let user = {name: name, score: score};
    let userJSON = JSON.stringify(user);

    const options = {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json'
        },
        body: userJSON
    }
    fetch('/add', options)
    .then(res => {console.log(res)});
}

async function getCurrentUser() {
    // let userScore = JSON.parse(localStorage.getItem("Score"));

    // let userForm = document.getElementById("userForm");
    // let userName = userForm.elements[0].value;

    // return({name: userName, score: userScore});

    let res = await fetch('/currentUser');
    const current = await res.json();
    return current;
}

async function getTopUsers() {
    let res = await fetch('/topUsers');
    const topUsers = await res.json();
    return topUsers;
}

function createLeaderBoard() {
    let currentUser = document.getElementById("current");
    let userInfo = getCurrentUser();
    userInfo.then((current) => {
        currentUser.innerText = current[0].name + " : " + current[0].score;
    })
    

    let leaderContainer = document.getElementById("board");
    let usersString = getTopUsers();

    usersString.then((topList) => {
        for (let i = 0; i < topList.length; i++) {
            let user = document.createElement("li");
            user.innerText = topList[i].name + " : " + topList[i].score;
            leaderContainer.appendChild(user);
        }
    });
}

// window.addEventListener('load', () => {
//     createLeaderBoard();
// });
// function addUserToDB(user){
//     var userArr = [];
//     if(!!localStorage.getItem("userList")) {
//         userArr = JSON.parse(localStorage.getItem("userList"));
//     }
//     userArr.push(user);
//     localStorage.setItem("userList", JSON.stringify(userArr));
// }