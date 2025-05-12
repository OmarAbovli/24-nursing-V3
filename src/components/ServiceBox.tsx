
import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface ServiceBoxProps {
  title: string;
  icon: LucideIcon;
  comingSoon?: boolean;
  onClick?: () => void;
  className?: string;
}

const ServiceBox = ({
  title,
  icon: Icon,
  comingSoon = false,
  onClick,
  className,
}: ServiceBoxProps) => {
  return (
    <div
      className={cn(
        "service-box",
        comingSoon ? "disabled" : "cursor-pointer",
        className
      )}
      onClick={comingSoon ? undefined : onClick}
    >
      <Icon className="w-10 h-10 mb-2 text-primary" />
      <h3 className="text-sm font-medium text-center">{title}</h3>
      {comingSoon && (
        <span className="mt-1 text-xs text-muted-foreground">Coming Soon</span>
      )}
    </div>
  );
};

export default ServiceBox;
