// Initialise le client Auth0 dès que le script est chargé
auth0.createAuth0Client({
    domain: "dev-803h8czxtknd38dx.us.auth0.com",
    clientId: "oDWpWZdDQ0LMS1hcw3PIfsEzdLzfoyQQ",
    authorizationParams: {
        redirect_uri: window.location.href,
    },

}).then(async (auth0Client) => {
    // Vérifie si une redirection après l'authentification a eu lieu
    if (
        location.search.includes("state=") &&
        (location.search.includes("code=") || location.search.includes("error="))
    ) {
        console.log(auth0Client);
        const userProfile = await auth0Client.getUser();
        console.log(userProfile);

        try {
            await auth0Client.handleRedirectCallback();
            window.history.replaceState({}, document.title, "/");
        } catch (err) {
            console.error("Erreur lors de la redirection :", err);
        }
    }

    // Vérifie si l'utilisateur est authentifié
    const isAuthenticated = await auth0Client.isAuthenticated();
    console.log(isAuthenticated);
    // Met à jour l'interface en fonction de l'état de l'authentification
    // const updateUI = async () => {
    //     const profileElement = document.getElementById("profile");
    //     if (isAuthenticated) {
    //         const userProfile = await auth0Client.getUser();
    //         profileElement.style.display = "block";
    //         profileElement.innerHTML = `
    //             <p>${userProfile.name}</p>
    //             <img src="${userProfile.picture}" alt="Photo de profil" />
    //         `;
    //     } else {
    //         profileElement.style.display = "none";
    //     }
    // };

    // Attache les événements aux boutons
    const loginButton = document.getElementById("login-glass");
    if (loginButton) {
        loginButton.addEventListener("click", async (e) => {
            e.preventDefault();
            await auth0Client.loginWithRedirect();
        });
    }

    // const logoutButton = document.getElementById("logout");
    // if (logoutButton) {
    //     logoutButton.addEventListener("click", async (e) => {
    //         e.preventDefault();
    //         await auth0Client.logout({ returnTo: window.location.origin });
    //     });
    // }

    // Appelle la mise à jour de l'interface
    // updateUI();
});

document.getElementById("angelin").addEventListener('input', function () {
    const value = this.value;
    console.log(value);
    localStorage.setItem("email", value);
    localStorage.setItem("nickname", value);
    document.getElementById("play-button").classList.remove('disabled');
});

const saveNewPlayer = async (email, nickname, score) => {
    try {
        console.log("Enregistrement du joueur :", { email, nickname, score });

        const response = await fetch('http://localhost:1337/api/game-projets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer 22a68b33eee5249cce9a2dbf856ee251b43733ae80fbe32d4042771ec408e55457a2ca85b753494d0db844ae184324d28f074e69c165b755e71d85377de2f823f05e1b26ba66f5d77f0cc07d3e2077546b493efb1c60cb142fd567412e46caaf22a9075e72f68bc7a22505e5aec5677318b150302993cbab22628bbc92ce3a50',
            },
            body: JSON.stringify({
                data: {
                    email: email,
                    nickname: nickname,
                    score: score,
                },
            }),
        });

        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
        const result = await response.json();

        console.log("Réponse de l'API :", result);
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
    }
};

const score = [
    { name: "", score: 85 },
    { name: "", score: 92 },
    { name: "", score: 78 },
];

const fetchAndSortScores = async () => {
    try {
        // Récupération des scores depuis votre API
        const response = await fetch('http://localhost:1337/api/game-projets'); // URL de votre API
        const { data } = await response.json();

        // Tri des scores du plus grand au plus petit
        const sortedScore = data.sort((a, b) => b.score - a.score);

        console.log("Scores triés :", sortedScore);

        // Met à jour l'interface utilisateur (par exemple, un tableau HTML)
        const leaderboard = document.getElementById("leaderboard");
        if (leaderboard) {
            leaderboard.innerHTML = sortedScore.map((player, index) => `
                <tr>
                    <td>${index + 1}</td>
                    <td>${player.email}</td>
                    <td>${player.nickname}</td>
                    <td>${player.score}</td>
                </tr>
            `).join("");
        }
    } catch (error) {
        console.error('Erreur lors de la récupération et du tri des scores :', error);
    }
};



const handleGameEnd = async (score) => {
    const email = localStorage.getItem("email");
    const nickname = localStorage.getItem("nickname");

    if (!email || !nickname) {
        console.error("Les informations du joueur sont manquantes.");
        return;
    }

    await saveNewPlayer(email, nickname, score);
};


document.getElementById("play-button").addEventListener("click", async () => {
    const email = localStorage.getItem("email");
    const nickname = localStorage.getItem("nickname");

    if (!email || !nickname) {
        alert("Veuillez saisir un email et un nickname !");
        return;
    }

    const score = Math.floor(Math.random() * 100); // Remplacez par le vrai score
    await saveNewPlayer(email, nickname, score);
});


const fetchArticles = async () => {
    try {
        const response = await fetch('http://localhost:1337/api/game-projets'); // Remplace "articles" par ta collection
        const data = await response.json();
        console.log(data); // Affiche les données de la collection
    } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
    }
};

fetchArticles();

// Appelez cette fonction pour récupérer et afficher les scores
fetchAndSortScores();
