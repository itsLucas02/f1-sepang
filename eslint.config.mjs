import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypeScript,
  {
    files: [
      "components/learn/learn-experience.tsx",
      "components/circuit/sepang-explorer.tsx",
      "components/circuit/sepang-circuit-stage.tsx",
      "components/prediction/prediction-experience.tsx",
      "components/prediction/prediction-summary.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts"],
  },
];

export default config;
