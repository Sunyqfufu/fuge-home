import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "福哥的家", description: "全家的数字收纳地图" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN"><body>{children}</body></html>
  );
}
