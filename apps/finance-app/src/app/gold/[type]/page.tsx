import GoldDetailClient from "./GoldDetailClient";
import { GOLD_NAMES } from "@/lib/gold";

interface Props {
  params: Promise<{ type: string }>;
}

export default async function GoldDetailPage({ params }: Props) {
  const { type } = await params;
  const validTypes = Object.keys(GOLD_NAMES);
  if (!validTypes.includes(type)) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-slate-400">
        Không tìm thấy loại vàng &quot;{type}&quot;
      </div>
    );
  }
  return <GoldDetailClient typeCode={type} />;
}
