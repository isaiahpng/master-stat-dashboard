import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">GAMESTAT<span className="period">.</span></div>

            <div className="navbar-links">
                <a href="/">Home</a>
                <a href="/Dashboard">Dashboard</a>
                <a href="/Library">Library</a>
            </div>

            <div className="navbar-actions">
                <button className="signup-button">Sign Up</button>
                <button className="login-button">Login</button>
            </div>
        </nav>
    );
}

export default Navbar;