import "./features.css";
import { Diamond, Shield, Clock, Check, Star, Award, Heart, ThumbsUp } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Coûts abordables",
      desc: "Nous proposons les meilleures offres de voyage aux coûts les plus bas, afin que vous puissiez profiter de votre voyage sans grever votre budget.",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
          <path d="M160,128a32,32,0,1,1-32-32A32,32,0,0,1,160,128Zm40-64a48.85,48.85,0,0,0,40,40V64Zm0,128h40V152A48.85,48.85,0,0,0,200,192ZM16,152v40H56A48.85,48.85,0,0,0,16,152Zm0-48A48.85,48.85,0,0,0,56,64H16Z" opacity="0.2"></path>
          <path d="M128,88a40,40,0,1,0,40,40A40,40,0,0,0,128,88Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,152ZM240,56H16a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H240a8,8,0,0,0,8-8V64A8,8,0,0,0,240,56ZM24,72H45.37A40.81,40.81,0,0,1,24,93.37Zm0,112V162.63A40.81,40.81,0,0,1,45.37,184Zm208,0H210.63A40.81,40.81,0,0,1,232,162.63Zm0-38.35A56.78,56.78,0,0,0,193.65,184H62.35A56.78,56.78,0,0,0,24,145.65v-35.3A56.78,56.78,0,0,0,62.35,72h131.3A56.78,56.78,0,0,0,232,110.35Zm0-52.28A40.81,40.81,0,0,1,210.63,72H232Z"></path>
        </svg>
      ),
    },
    {
      title: "Confiance et sécurité",
      desc: "Votre voyage est entre de bonnes mains. Nous garantissons des services fiables et un voyage sûr de la réservation au retour.",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
      ),
    },
    {
      title: "Ponctualité",
      desc: "Nous respectons les horaires fixés avec précision car votre temps est précieux et l'organisation est le secret du confort.",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
        </svg>
      ),
    },
    {
      title: "Facilité du processus",
      desc: "Nous vous offrons une expérience de réservation fluide et rapide via notre site web sans complications ni retards.",
      icon: (
        <svg className="w-8 h-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" fill="currentColor">
          <path d="M183,113.65l30.1-28.32.13-.13A30,30,0,0,0,170.8,42.77l-.13.13L142.35,73,58.05,42.35a6,6,0,0,0-6.29,1.39l-24,24A6,6,0,0,0,28.67,77l65.92,43.94L77.52,138H56a6,6,0,0,0-4.24,1.76l-24,24a6,6,0,0,0,2,9.82l37.62,15,15,37.56,0,.12a6,6,0,0,0,7.81,3.27,5.94,5.94,0,0,0,2.07-1.41l23.91-23.91A6,6,0,0,0,118,200V178.48l17.07-17.07L179,227.33a6,6,0,0,0,9.23.91l24-24a6,6,0,0,0,1.39-6.29Zm1.94,100.93L141,148.66a6,6,0,0,0-4.4-2.64l-.59,0a6,6,0,0,0-4.24,1.76l-24,24A6,6,0,0,0,106,176v21.52L90.2,213.32,77.57,181.77a6,6,0,0,0-3.34-3.35L42.68,165.8,58.49,150H80a6,6,0,0,0,4.25-1.76l24-24a6,6,0,0,0-.92-9.23L41.42,71.06,57.54,54.93,142,85.63a6,6,0,0,0,6.42-1.53l31-32.9A18,18,0,0,1,204.8,76.66l-32.9,31a6,6,0,0,0-1.53,6.42l30.7,84.41Z"></path>
        </svg>
      ),
    }
  ];

  return (
    <section className="features-section">
      <div className="features-container">

        {/* Header */}
        <div className="features-header">
          <div className="features-header-left">
            <h2 className="features-title">
              Réservez et profitez de la meilleure expérience de voyage
            </h2>
          </div>
          <div className="features-header-right">
            <p className="features-description">
              Nous offrons les meilleures offres et installations sur les destinations
              de voyage dans le monde entier afin que vous puissiez profiter d'une
              expérience de voyage inégalée.
            </p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card group">
              <div className="feature-icon-wrapper">
                <div className="feature-icon">
                  {feature.icon}
                </div>
              </div>
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-description">{feature.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
