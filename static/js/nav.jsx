function UserLogin(props) {
    const [loggedIn, setLoggedIn] = React.useState(false);

    React.useEffect(() => {
        fetch('/api/check-login-status')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            setLoggedIn(data);
        });
    }, []);

function processLogout() {
    fetch('/api/logout')
    .then(response => response.json())
    .then(data => {
        console.log(data);
        setLoggedIn(false);
    });
};
