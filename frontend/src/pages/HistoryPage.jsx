import { useEffect, useState } from "react";
import { fetchHistory } from "../api/client.js";
import DetailModal from "../components/DetailModal.jsx";
import HistoryTable from "../components/HistoryTable.jsx";

function HistoryPage() {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchHistory(filter)
      .then((data) => { if (!ignore) setRows(data); })
      .catch(() => { if (!ignore) setRows([]); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [filter]);

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
        <div className="card flex h-48 items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <svg className="h-4 w-4 animate-spin text-primary" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            Memuat riwayat prediksi…
          </div>
        </div>
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
