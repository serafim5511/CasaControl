import { useEffect, useState } from "react";
import {
  TotaisPorPessoaDTO,
  TotaisPorCategoriaDTO,
  api
} from "../api/client";

type TotaisPessoaResponse = {
  pessoas: TotaisPorPessoaDTO[];
  totalGeral: {
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
  };
};

type TotaisCategoriaResponse = {
  categorias: TotaisPorCategoriaDTO[];
  totalGeral: {
    totalReceitas: number;
    totalDespesas: number;
    saldoLiquido: number;
  };
};

export function RelatoriosPage() {
  const [pessoas, setPessoas] = useState<TotaisPorPessoaDTO[]>([]);
  const [totaisPessoas, setTotaisPessoas] =
    useState<TotaisPessoaResponse["totalGeral"] | null>(null);
  const [categorias, setCategorias] = useState<TotaisPorCategoriaDTO[]>([]);
  const [totaisCategorias, setTotaisCategorias] =
    useState<TotaisCategoriaResponse["totalGeral"] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    setError(null);
    try {
      const [p, c] = await Promise.all([
        api.totaisPorPessoa(),
        api.totaisPorCategoria()
      ]);
      const tp = p as unknown as TotaisPessoaResponse;
      const tc = c as unknown as TotaisCategoriaResponse;
      setPessoas(tp.pessoas);
      setTotaisPessoas(tp.totalGeral);
      setCategorias(tc.categorias);
      setTotaisCategorias(tc.totalGeral);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function formatMoney(v: number) {
    return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  return (
    <>
      <div className="grid-two">
        <div className="card">
          <h2>Totais por pessoa</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : pessoas.length === 0 ? (
            <div>Nenhuma informação ainda.</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Pessoa</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {pessoas.map((p) => (
                    <tr key={p.pessoaId}>
                      <td>{p.nome}</td>
                      <td>{formatMoney(p.totalReceitas)}</td>
                      <td>{formatMoney(p.totalDespesas)}</td>
                      <td>{formatMoney(p.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totaisPessoas && (
                <div className="metrics">
                  <div className="metric-pill">
                    <strong>Total receitas:</strong>{" "}
                    {formatMoney(totaisPessoas.totalReceitas)}
                  </div>
                  <div className="metric-pill">
                    <strong>Total despesas:</strong>{" "}
                    {formatMoney(totaisPessoas.totalDespesas)}
                  </div>
                  <div className="metric-pill">
                    <strong>Saldo líquido:</strong>{" "}
                    {formatMoney(totaisPessoas.saldoLiquido)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="card">
          <h2>Totais por categoria</h2>
          {loading ? (
            <div>Carregando...</div>
          ) : categorias.length === 0 ? (
            <div>Nenhuma informação ainda.</div>
          ) : (
            <>
              <table>
                <thead>
                  <tr>
                    <th>Categoria</th>
                    <th>Receitas</th>
                    <th>Despesas</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr key={c.categoriaId}>
                      <td>{c.descricao}</td>
                      <td>{formatMoney(c.totalReceitas)}</td>
                      <td>{formatMoney(c.totalDespesas)}</td>
                      <td>{formatMoney(c.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {totaisCategorias && (
                <div className="metrics">
                  <div className="metric-pill">
                    <strong>Total receitas:</strong>{" "}
                    {formatMoney(totaisCategorias.totalReceitas)}
                  </div>
                  <div className="metric-pill">
                    <strong>Total despesas:</strong>{" "}
                    {formatMoney(totaisCategorias.totalDespesas)}
                  </div>
                  <div className="metric-pill">
                    <strong>Saldo líquido:</strong>{" "}
                    {formatMoney(totaisCategorias.saldoLiquido)}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </>
  );
}

