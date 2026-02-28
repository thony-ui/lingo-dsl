import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FEATURES, Feature } from "@/constants/features";

export function Features() {
  return (
    <div className="mt-32 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {FEATURES.map((feature) => (
        <FeatureCard key={feature.title} feature={feature} />
      ))}
    </div>
  );
}

interface FeatureCardProps {
  feature: Feature;
}

function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = feature.icon;
  const { iconBg, iconColor, borderHover } = feature.colorScheme;

  return (
    <Card
      className={`border-2 ${borderHover} transition-all hover:shadow-xl`}
    >
      <CardHeader>
        <FeatureIcon iconBg={iconBg} iconColor={iconColor}>
          <Icon className="w-6 h-6" />
        </FeatureIcon>
        <CardTitle className="text-2xl">{feature.title}</CardTitle>
        <CardDescription className="text-base">
          {feature.description}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

interface FeatureIconProps {
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
}

function FeatureIcon({ iconBg, iconColor, children }: FeatureIconProps) {
  return (
    <div
      className={`w-12 h-12 rounded-lg ${iconBg} flex items-center justify-center mb-4`}
    >
      <div className={iconColor}>{children}</div>
    </div>
  );
}
