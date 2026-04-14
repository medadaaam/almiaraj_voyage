import FuzzyText from "@/components/FuzzyText";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#2f6f85]/5 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#fb923c]/5 rounded-full blur-2xl"></div>

          <FuzzyText
             className="text-9xl md:text-9xl font-bold text-[#fb923c]"
            baseIntensity={0.12}
            hoverIntensity={0.5}
            enableHover={true}
          >
            404
          </FuzzyText>
        </div>

        <div className="mt-8 space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Oups ! Page introuvable
          </h1>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            La page que vous recherchez semble avoir disparu ou n'existe pas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link to="/">
              <Button className="bg-[#2f6f85] hover:bg-[#25596b] text-white px-6 py-5 rounded-xl flex items-center gap-2 text-base">
                <Home className="w-5 h-5" />
                Accueil
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="border-[#2f6f85] text-[#2f6f85] hover:bg-[#2f6f85] hover:text-white px-6 py-5 rounded-xl flex items-center gap-2 text-base"
            >
              <ArrowLeft className="w-5 h-5" />
              Page précédente
            </Button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-400 text-sm">
            Besoin d'aide ? <Link to="/contact" className="text-[#2f6f85] hover:underline">Contactez-nous</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
