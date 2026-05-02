import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchHistory } from "../api/client.js";
import DetailModal from "../components/DetailModal.jsx";
import HistoryTable from "../components/HistoryTable.jsx";
import { HistorySkeleton } from "../components/ui/Skeleton.jsx";

function HistoryPage() {
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const { data: rows = [], isLoading: loading } = useQuery({
    queryKey: ["history", filter],
    queryFn: () => fetchHistory(filter),
  });

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <span className="section-label">History</span>
        <h1 className="mt-1 text-2xl font-black text-ink">
          Riwayat Prediksi
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Klik baris untuk melihat detail input dan output model.
        </p>
      </div>

      {loading ? (
        <HistorySkeleton />
      ) : (
        <>
          <HistoryTable
            rows={rows}
            filter={filter}
            setFilter={setFilter}
            page={page}
            setPage={setPage}
            onOpenDetail={setSelected}
          />
          <DetailModal item={selected} onClose={() => setSelected(null)} />
        </>
      )}
    </div>
  );
}

export default HistoryPage;
