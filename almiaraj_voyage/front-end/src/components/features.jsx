import { Check, Clock, Diamond } from "lucide-react";

export default function Features() {
  const features = [
    {
      title: "Coûts abordables",
      desc: "Nous proposons les meilleures offres de voyage aux coûts les plus bas.",
      icon: <Diamond className="w-6 h-6" />,
    },
    {
      title: "Confiance et sécurité",
      desc: "Des services fiables et un voyage sûr du début à la fin.",
      icon: <Check className="w-6 h-6" />,
    },
    {
      title: "Ponctualité",
      desc: "Respect total des horaires pour votre confort.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Facilité du processus",
      desc: "Réservation simple, rapide et sans stress.",
      icon: <Diamond className="w-6 h-6" />,
    },
  ];

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* HEADER */}
        <div className="mb-16 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">

          <div className="lg:w-1/2">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">
              Réservez et profitez de la meilleure expérience de voyage
            </h2>
            <div className="w-20 h-1 bg-orange-500 mx-auto lg:mx-0 rounded-full"></div>
          </div>

          <div className="lg:w-1/2">
            <p className="text-gray-600 text-lg leading-relaxed">
              Nous offrons les meilleures offres et installations sur les destinations
              de voyage dans le monde entier afin que vous puissiez profiter d'une
              expérience de voyage inégalée.
            </p>
          </div>

        </div>

        {/* CARDS */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((item, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-orange-100 text-orange-500 mb-5 group-hover:bg-orange-500 group-hover:text-white transition">
                {item.icon}
              </div>

              <h4 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-orange-500 transition">
                {item.title}
              </h4>

              <p className="text-sm text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
