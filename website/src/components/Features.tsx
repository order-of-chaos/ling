import {
  Zap,
  Scan,
  HardDrive,
  Type,
  Puzzle,
  Boxes,
  ShieldCheck,
  Globe,
  LucideIcon,
} from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Features");

interface FeatureCardProps {
  icon: LucideIcon;
  color: string;
  name: string;
  description: string;
}

function FeatureCard({
  icon: Icon,
  color,
  name,
  description,
}: FeatureCardProps) {
  return (
    <div className="group relative glass rounded-2xl p-6 transition-all hover:bg-white/10 hover:scale-105">
      <div
        className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${color}`}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white">{name}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  );
}

export function Features() {
  const { t } = useI18n();

  return (
    <section id="features" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </p>
          <p className="mt-6 text-lg text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Type}
              color="from-orange-500 to-amber-500"
              name={t("typeSafe")}
              description={t("typeSafeDesc")}
            />
            <FeatureCard
              icon={Zap}
              color="from-pink-500 to-rose-500"
              name={t("lightweight")}
              description={t("lightweightDesc")}
            />
            <FeatureCard
              icon={Scan}
              color="from-blue-500 to-cyan-500"
              name={t("autoExtract")}
              description={t("autoExtractDesc")}
            />
            <FeatureCard
              icon={HardDrive}
              color="from-violet-500 to-purple-500"
              name={t("pluggable")}
              description={t("pluggableDesc")}
            />
            <FeatureCard
              icon={Puzzle}
              color="from-emerald-500 to-teal-500"
              name={t("modular")}
              description={t("modularDesc")}
            />
            <FeatureCard
              icon={Boxes}
              color="from-indigo-500 to-blue-500"
              name={t("reactIntegration")}
              description={t("reactIntegrationDesc")}
            />
            <FeatureCard
              icon={ShieldCheck}
              color="from-red-500 to-orange-500"
              name={t("eslintPlugin")}
              description={t("eslintPluginDesc")}
            />
            <FeatureCard
              icon={Globe}
              color="from-cyan-500 to-sky-500"
              name={t("flexibleLangs")}
              description={t("flexibleLangsDesc")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
