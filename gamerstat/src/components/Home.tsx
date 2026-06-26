import bgImage from "../assets/bg.jpg";
import BentoSection from "./BentoSection";
import "./Home.css";

function Home() {
    return (
        <main className="home">
            <img src={bgImage} className="home-bg" alt="" />

            <div className="home-overlay" />
            <BentoSection />
        </main>
    );
}

export default Home;