"use client";

import { cn } from "@/lib/utils";
import {
  Users,
  BarChart3,
  Key,
  Shield,
  Zap,
  Palette,
  CalendarClock,
  BellRing,
} from "lucide-react";

const features = [
  {
    title: "B2B2C Integrado",
    description:
      "Conecta operadores, empresas y conductores en una sola plataforma con roles personalizados, facturación automatizada y visibilidad total de cada operación.",
    icon: Users,
  },
  {
    title: "Dashboard en vivo",
    description:
      "Monitorea ocupación, ingresos, desempeño de valets y tiempos de servicio con paneles interactivos que se actualizan en tiempo real.",
    icon: BarChart3,
  },
  {
    title: "Gestión digital de llaves",
    description:
      "Digitaliza la entrega y devolución de llaves con registro fotográfico, firma electrónica y auditoría completa de cada movimiento.",
    icon: Key,
  },
  {
    title: "Seguridad y cumplimiento",
    description:
      "Protege la información de tus clientes con encriptación de extremo a extremo, auditoría forense y cumplimiento con estándares internacionales.",
    icon: Shield,
  },
  {
    title: "Integración API",
    description:
      "Conecta Parkit con tu ecosistema tecnológico actual mediante una API robusta, webhooks en vivo y documentación lista para implementar.",
    icon: Zap,
  },
  {
    title: "App white-label",
    description:
      "Ofrece una aplicación móvil con la identidad visual de tu marca para que tus clientes soliciten y gestionen el servicio de valet sin fricciones.",
    icon: Palette,
  },
  {
    title: "Gestión de turnos",
    description:
      "Organiza el horario de tu equipo de valets con asignación inteligente, control de asistencia en tiempo real y optimización de cobertura.",
    icon: CalendarClock,
  },
  {
    title: "Notificaciones inteligentes",
    description:
      "Mantén a conductores, valets y administradores informados al instante con alertas automáticas por SMS, correo y notificaciones push.",
    icon: BellRing,
  },
];

export function FeaturesHover() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon: Icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        <Icon className="size-6" />
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
