import { useState } from "react";
import { PessoasPage } from "./pages/PessoasPage";
import { CategoriasPage } from "./pages/CategoriasPage";
import { TransacoesPage } from "./pages/TransacoesPage";
import { RelatoriosPage } from "./pages/RelatoriosPage";

type Tab = "pessoas" | "categorias" | "transacoes" | "relatorios";

export default function App() {
  const [tab, setTab] = useState<Tab>("pessoas");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Financeiro</h1>
        <div className="nav">
          <button
            className={tab === "pessoas" ? "active" : ""}
            onClick={() => setTab("pessoas")}
          >
            Pessoas
          </button>
          <button
            className={tab === "categorias" ? "active" : ""}
            onClick={() => setTab("categorias")}
          >
            Categorias
          </button>
          <button
            className={tab === "transacoes" ? "active" : ""}
            onClick={() => setTab("transacoes")}
          >
            Transações
          </button>
          <button
            className={tab === "relatorios" ? "active" : ""}
            onClick={() => setTab("relatorios")}
          >
            Relatórios
          </button>
        </div>
      </aside>
      <main className="content">
        {tab === "pessoas" && <PessoasPage />}
        {tab === "categorias" && <CategoriasPage />}
        {tab === "transacoes" && <TransacoesPage />}
        {tab === "relatorios" && <RelatoriosPage />}
      </main>
    </div>
  );
}

