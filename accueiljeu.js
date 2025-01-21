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
