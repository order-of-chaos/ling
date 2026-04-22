import { Check, X } from "lucide-react";
import { initI18nModule } from "@orderofchaos/ling-react";

const { useI18n } = initI18nModule("Comparison");

const libraries = [
  {
    name: "Ling",
    highlight: true,
    features: {
      size: "~3kb",
      typescript: true,
      autoExtract: true,
      namespaces: true,
      hooks: true,
      pluggableStorage: true,
      dependencies: 0,
      learning: "Low",
    },
  },
  {
    name: "i18next",
    highlight: false,
    features: {
      size: "~40kb",
      typescript: true,
      autoExtract: "plugin",
      namespaces: true,
      hooks: true,
      pluggableStorage: true,
      dependencies: 3,
      learning: "Medium",
    },
  },
  {
    name: "react-intl",
    highlight: false,
    features: {
      size: "~25kb",
      typescript: true,
      autoExtract: "plugin",
      namespaces: false,
      hooks: true,
      pluggableStorage: false,
      dependencies: 2,
      learning: "High",
    },
  },
  {
    name: "react-i18next",
    highlight: false,
    features: {
      size: "~45kb",
      typescript: true,
      autoExtract: "plugin",
      namespaces: true,
      hooks: true,
      pluggableStorage: true,
      dependencies: 4,
      learning: "Medium",
    },
  },
];

interface FeatureRowProps {
  label: string;
  values: (boolean | string | number)[];
  pluginLabel: string;
}

function FeatureRow({ label, values, pluginLabel }: FeatureRowProps) {
  return (
    <tr className="hover:bg-slate-800/30 transition-colors">
      <td className="py-4 px-6 text-sm font-medium text-slate-300">{label}</td>
      {values.map((value, idx) => (
        <td
          key={idx}
          className={`py-4 px-6 text-center ${idx === 0 ? "bg-primary-500/5" : ""}`}
        >
          <div className="flex items-center justify-center">
            <FeatureValue value={value} pluginLabel={pluginLabel} />
          </div>
        </td>
      ))}
    </tr>
  );
}

function FeatureValue({
  value,
  pluginLabel,
}: {
  value: boolean | string | number;
  pluginLabel: string;
}) {
  if (value === true) {
    return <Check className="h-5 w-5 text-emerald-400" />;
  }
  if (value === false) {
    return <X className="h-5 w-5 text-red-400" />;
  }
  if (value === "plugin") {
    return <span className="text-yellow-400 text-sm">{pluginLabel}</span>;
  }
  return <span className="text-slate-300">{value}</span>;
}

export function Comparison() {
  const { t } = useI18n();

  return (
    <section id="comparison" className="py-24 sm:py-32 bg-slate-900/50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold text-primary-400">
            {t("feature")}
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t("title")}
          </p>
          <p className="mt-6 text-lg text-slate-400">{t("subtitle")}</p>
        </div>

        <div className="mt-16 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="py-4 px-6 text-left text-sm font-semibold text-slate-400">
                  {t("feature")}
                </th>
                {libraries.map((lib) => (
                  <th
                    key={lib.name}
                    className={`py-4 px-6 text-center text-sm font-semibold ${
                      lib.highlight
                        ? "text-primary-400 bg-primary-500/10 rounded-t-xl"
                        : "text-slate-400"
                    }`}
                  >
                    {lib.name}
                    {lib.highlight && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary-500/20 px-2 py-0.5 text-xs text-primary-300">
                        {t("recommended")}
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <FeatureRow
                label={t("bundleSize")}
                values={libraries.map((l) => l.features.size)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("typescript")}
                values={libraries.map((l) => l.features.typescript)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("autoExtraction")}
                values={libraries.map((l) => l.features.autoExtract)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("namespaces")}
                values={libraries.map((l) => l.features.namespaces)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("reactHooks")}
                values={libraries.map((l) => l.features.hooks)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("pluggableStorage")}
                values={libraries.map((l) => l.features.pluggableStorage)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("dependencies")}
                values={libraries.map((l) => l.features.dependencies)}
                pluginLabel={t("plugin")}
              />
              <FeatureRow
                label={t("learningCurve")}
                values={libraries.map((l) => l.features.learning)}
                pluginLabel={t("plugin")}
              />
            </tbody>
          </table>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-400">
              {t("whyLing")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {t("whyLingPoints")
                .split("|")
                .map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-400">
              {t("whenI18next")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {t("whenI18nextPoints")
                .split("|")
                .map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
            </ul>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-400">
              {t("whenReactIntl")}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              {t("whenReactIntlPoints")
                .split("|")
                .map((point, i) => (
                  <li key={i}>• {point}</li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
