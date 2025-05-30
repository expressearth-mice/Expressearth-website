import React from 'react';
import './AchievementPage.css';
import { Link } from 'react-router-dom';

const achievements = [
    {
        id: 1,
        title: "Qualified & Incubated",
        description: "Recognized by NASSCOM 10K Startups Program for innovation in travel tech.",
        imageUrl: "https://d3r3sr3o54kk15.cloudfront.net/s3fs-public/styles/webp/public/media/media_kit/media_kit_2_7.jpg.webp?itok=9XtNFpgJ",
    },
    {
        id: 2,
        title: "Top Startup in Haryana",
        description: "Selected by Government of Haryana as one of the best startups.",
        imageUrl: "https://startupera.co.in/wp-content/uploads/2024/03/Teal-Illustration-Digital-Business-Blog-Banner-11.png",
    },
    {
        id: 3,
        title: "Top 25 - Innopreneurs",
        description: "Ranked among the Top 25 startups in the Innopreneurs Startup Contest by Lemon Ideas.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToZ7QJAZHlXjGDrpnZRAUZiQugc47WO4K8jA&s",
    },
    {
        id: 4,
        title: "WTFL Innovation Camp 2019",
        description: "Selected by World Tourism Forum Lucerne for Startup Innovation Camp 2019.",
        imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbhcL5jxiRL1Vis8c52GMwNSkfT1xTpVwGqg&s",
    },
    {
        id: 5,
        title: "Times SheUnltd Finalist",
        description: "Finalist in Times SheUnltd 2020 Entrepreneur Awards in Travel & Experience category.",
        imageUrl: "https://static.toiimg.com/thumb/width-400,resizemode-4,msid-77287144/77287144.jpg",
    },
];

const AchievementPage = () => {
    return (
        <div className="achievement-page">
            <header className="hero-section">
                <h1>Our Achievements</h1>
            </header>

            <section className="achievements-list">
                {achievements.map((achievement, index) => (
                    <div
                        className={`achievement-card ${index === 3 || index === 4 ? 'center-card' : ''}`}
                        key={achievement.id}
                    >
                        <img src={achievement.imageUrl} alt={achievement.title} />
                        <h3>{achievement.title}</h3>
                        <p>{achievement.description}</p>
                    </div>
                ))}

            </section>

            <section className="cta">
                <h3>Want to be part of our success?</h3>
                <Link to ="/careers">
                <button>Join Us</button></Link> 
            </section>
        </div>
    );
};

export default AchievementPage;
