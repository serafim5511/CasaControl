import { FormEvent, useEffect, useState } from "react";
import { api, Categoria, Pessoa, Transacao, Finalidade } from "../api/client";

type FormTransacao = {
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
};

const emptyForm: FormTransacao = {
  descricao: "",
  valor: 0,
  tipo: "Despesa",
  categoriaId: 0,
  pessoaId: 0
};

export function TransacoesPage() {
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<FormTransacao>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    setError(null);
    try {
      const [t, p, c] = await Promise.all([
        api.listarTransacoes(),
        api.listarPessoas(),
        api.listarCategorias()
      ]);
      setTransacoes(t);
      setPessoas(p);
      setCategorias(c);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.descricao.trim()) {
      setError("Descrição é obrigatória.");
      return;
    }
    if (form.descricao.length > 400) {
      setError("Descrição deve ter no máximo 400 caracteres.");
      return;
    }
    if (!Number.isFinite(form.valor) || form.valor <= 0) {
      setError("Valor deve ser um número positivo.");
      return;
    }
    if (!form.pessoaId || !form.categoriaId) {
      setError("Pessoa e categoria são obrigatórias.");
      return;
    }
    setError(null);
    api
      .criarTransacao(form)
      .then(() => {
        setForm((f) => ({ ...emptyForm, tipo: f.tipo }));
        carregar();
      })
      .catch((err) => setError(err.message));
  }

  function tagTipo(tipo: Transacao["tipo"]) {
  const label = typeof tipo === "number" ? (tipo === 1 ? "Despesa" : "Receita") : tipo;
  return label === "Despesa" ? "tag tag-despesa" : "tag tag-receita";
  }

  return (
    <>
      <div className="card">
        <h2>Nova transação</h2>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Descrição</label>
              <input
                value={form.descricao}
                onChange={(e) =>
                  setForm((f) => ({ ...f, descricao: e.target.value }))
                }
                maxLength={400}
              />
            </div>
            <div className="field">
              <label>Valor</label>
              <input
                type="number"
                step="0.01"
                value={Number.isFinite(form.valor) ? form.valor : ""}
                onChange={(e) => {
                  const raw = e.target.value.replace(",", ".");
                  const parsed = raw === "" ? NaN : Number(raw);
                  setForm((f) => ({ ...f, valor: parsed }));
                }}
                min={0}
              />
            </div>
            <div className="field">
              <label>Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    tipo: e.target.value as FormTransacao["tipo"]
                  }))
                }
              >
                <option value="Despesa">Despesa</option>
                <option value="Receita">Receita</option>
              </select>
            </div>
            <div className="field">
              <label>Pessoa</label>
              <select
                value={form.pessoaId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    pessoaId: Number(e.target.value)
                  }))
                }
              >
                <option value={0}>Selecione...</option>
                {pessoas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome} ({p.idade} anos)
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Categoria</label>
              <select
                value={form.categoriaId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    categoriaId: Number(e.target.value)
                  }))
                }
              >
                <option value={0}>Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.descricao} ({Finalidade[c.finalidade]})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="actions-row">
            <button className="btn btn-primary" type="submit">
              Registrar
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <div className="card">
        <h2>Transações</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : transacoes.length === 0 ? (
          <div>Nenhuma transação cadastrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Pessoa</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {transacoes.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.descricao}</td>
                  <td>{t.pessoa?.nome ?? (pessoas.find((p) => p.id === t.pessoaId)?.nome ?? t.pessoaId)}</td>
                  <td>{t.categoria?.descricao ?? (categorias.find((c) => c.id === t.categoriaId)?.descricao ?? t.categoriaId)}</td>
                  <td>
                    <span className={tagTipo(t.tipo)}>
                      {typeof t.tipo === "number" ? (t.tipo === 1 ? "Despesa" : "Receita") : t.tipo}
                    </span>
                  </td>
                  <td>
                    {t.tipo === "Despesa" ? "-" : "+"}{" "}
                    {t.valor.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL"
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

