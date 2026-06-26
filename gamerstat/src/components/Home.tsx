import bgImage from "../assets/bg.jpg";
import "./Home.css";

function Home() {
    return (
        <main className="home">
            <img src={bgImage} className="home-bg" alt="" />
            <img src={bgImage} className="home-bg-glow" alt="" />

            <section className="hero-content"></section>
        </main>
    );
}

export default Home;