import { ProspectTable } from "@/components/prospect-table";

export default function ProspectsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-bold">Prospecção B2B</h2>
        <p className="text-zinc-500 text-xs mt-1">Encontre imobiliárias por cidade e classifique por presença digital</p>
      </div>
      <ProspectTable />
    </div>
  );
}
