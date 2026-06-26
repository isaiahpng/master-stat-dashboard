import { useRef, useState } from "react";
import "./Navbar.css";

const logo = "GAMESTAT".split("");

const rainbowColors = [
    "#FF0000",
    "#FF7A00",
    "#FFFF00",
    "#00FF00",
    "#00D4FF",
    "#4B4DFF",
    "#B000FF",
    "#FF4FD8"
];

const defaultColor = "#D8FE2B";

function Navbar() {
    const intervalRef = useRef<number | null>(null);

    const [letterColors, setLetterColors] = useState(
        logo.map(() => defaultColor)
    );

    function getRandomRainbowColor() {
        return rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
    }

    function startDisco() {
        if (intervalRef.current !== null) return;

        intervalRef.current = window.setInterval(() => {
            setLetterColors(logo.map(() => getRandomRainbowColor()));
        }, 75);
    }

    function stopDisco() {
        if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        setLetterColors(logo.map(() => defaultColor));
    }

    return (
        <nav className="navbar">
            <div
                className="navbar-logo"
                onMouseEnter={startDisco}
                onMouseLeave={stopDisco}
            >
                {logo.map((letter, index) => (
                    <span key={index} style={{ color: letterColors[index] }}>
                        {letter}
                    </span>
                ))}

                <span className="period">.</span>
            </div>

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