import * as React from "react";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const components = [
  {
    title: "Circuits",
    href: "/services",
    description: "Découvrez nos circuits touristiques exceptionnels au Maroc.",
  },
  {
    title: "Vols",
    href: "/services",
    description: "Réservation de billets d'avion aux meilleurs prix.",
  },
  {
    title: "Hôtels",
    href: "/services",
    description: "Hébergements de qualité pour un séjour agréable.",
  },
  {
    title: "Voyages sur mesure",
    href: "/services",
    description: "Créez votre propre itinéraire selon vos envies.",
  },
  {
    title: "Séjours",
    href: "/services",
    description: "Formules tout compris pour des vacances réussies.",
  },
  {
    title: "Transferts",
    href: "/services",
    description: "Service de navette et transport personnalisé.",
  },
];

export function NavigationMenuDemo() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Nos Services</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Accueil</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/about">À propos</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/contact">Contact</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href} className="block p-3 rounded-lg hover:bg-gray-100 transition">
          <div className="flex flex-col gap-1 text-sm">
            <div className="leading-none font-medium text-[#2f6f85]">{title}</div>
            <div className="line-clamp-2 text-gray-500 text-xs">{children}</div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
