import Image from "next/image";

interface LogoUTProps {
  className?: string;
  width?: number;
  height?: number;
}

export function LogoUT({
  className = "h-7 w-auto object-contain",
  width = 34,
  height = 27,
}: LogoUTProps) {
  return (
    <Image
      src="/logo-ut.svg"
      alt="Logo Resmi Universitas Terbuka"
      width={width}
      height={height}
      className={`shrink-0 ${className}`}
      priority
    />
  );
}
