const GitURL = "https://api.github.com/users/";

const form = document.querySelector("form");
const input = document.querySelector("input");
const main = document.querySelector("main");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = input.value;
    const profile = await fetch(`${GitURL}${user}`);
    const result = await profile.json();
    
    if(result.name){
        createCard(result)
        displayRepos(user)
    }
})

async function createCard(result){

    const date = new Date(result.created_at)
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();

    let userDesc = result.bio;
    if(!userDesc){
        userDesc = "*User has no bio*"
    }

    let userHireable = result.hireable;
    if(userHireable){
        userHireable = "Hireable"
    }else{
        userHireable = "Not hireable"
    }

    const card = `
        <div class="card">
            <img src="${result.avatar_url}">
            <div class="desc">
                <div class="desc-top">
                    <h2>${result.name}</h2>
                    <p>${day}/${month}/${year}</p>
                </div>
                <div class="desc-center">
                    <p>${userDesc}</p>
                </div>
                <div class="desc-bottom">
                    <ul class="desc-ul">
                        <li>${userHireable} <i class="fas fa-wallet"></i></li>
                        <li>Followers: ${result.followers} <i class="fas fa-walking"></i></li>
                        <li>Repos: ${result.public_repos} <i class="fas fa-cog"></i></li>
                    </ul>
                    <h2>Repositories:</h2>
                    <ul class="repos">
                    </ul>
                </div>
            </div>
        </div>
    `

    main.innerHTML = card;
}

async function displayRepos(user){
    const reposUl = document.querySelector(".repos");

    const repos = await fetch(`${GitURL}${user}/repos`);
    const result = await repos.json();

    // Organiza os repos em ordem de decrescente do star rating
    result.sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 10)
    .forEach((repo) => {
        const li = document.createElement("li");
        li.innerHTML = repo.name;
        li.addEventListener("click", () =>{
            open(repo.html_url, "_blank");
        });
        reposUl.appendChild(li);
    })
}