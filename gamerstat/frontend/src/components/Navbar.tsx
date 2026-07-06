import { useEffect, useRef, useState } from "react";
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

const navItems = [
    { label: "Home", id: "overview" },
    { label: "Stats", id: "advanced-stats" },
    { label: "Library", id: "library" },
];

function Navbar() {
    const intervalRef = useRef<number | null>(null);

    const [letterColors, setLetterColors] = useState(
        logo.map(() => defaultColor)
    );

    const [activeSection, setActiveSection] = useState("overview");

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

    function scrollToSection(sectionId: string) {
        const section = document.getElementById(sectionId);

        if (!section) return;

        const navbarOffset = 130;
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const targetTop = Math.max(sectionTop - navbarOffset, 0);

        window.scrollTo({
            top: targetTop,
            behavior: "smooth",
        });

        setActiveSection(sectionId);
    }

    useEffect(() => {
        function updateActiveSection() {
            const navbarOffset = 160;
            let currentSection = "overview";

            for (const item of navItems) {
                const section = document.getElementById(item.id);

                if (!section) continue;

                const sectionTop = section.offsetTop - navbarOffset;

                if (window.scrollY >= sectionTop) {
                    currentSection = item.id;
                }
            }

            setActiveSection(currentSection);
        }

        updateActiveSection();

        window.addEventListener("scroll", updateActiveSection);
        window.addEventListener("resize", updateActiveSection);

        return () => {
            window.removeEventListener("scroll", updateActiveSection);
            window.removeEventListener("resize", updateActiveSection);
        };
    }, []);

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
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={activeSection === item.id ? "active" : ""}
                        onClick={() => scrollToSection(item.id)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <div className="navbar-actions">
                <button className="signup-button">Sign Up</button>
                <button className="login-button">Login</button>
            </div>
        </nav>
    );
}

export default Navbar;