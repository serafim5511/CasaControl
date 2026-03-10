import { FormEvent, useEffect, useState } from "react";
import { api, Categoria, Finalidade } from "../api/client";

const emptyForm: Omit<Categoria, "id"> = {
  descricao: "",
  finalidade: Finalidade.Ambas
};

export function CategoriasPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [form, setForm] = useState<Omit<Categoria, "id">>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarCategorias();
      setCategorias(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.descricao.trim()) {
      setError("Descrição é obrigatória.");
      return;
    }
    if (form.descricao.length > 400) {
      setError("Descrição deve ter no máximo 400 caracteres.");
      return;
    }
    setError(null);
    try {
      const created = await api.criarCategoria(form);

      setCategorias((prev) => [...prev, created]);
      setForm(emptyForm);
    } catch (err: any) {
      setError(err.message);
    }
  }

  function finalidadeTag(finalidade: Categoria["finalidade"]) {
    if (finalidade === Finalidade.Despesa) return "tag tag-despesa";
    if (finalidade === Finalidade.Receita) return "tag tag-receita";
    return "tag tag-ambas";
  }

  return (
    <>
      <div className="card">
        <h2>Nova categoria</h2>
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
              <label>Finalidade</label>
              <select
                value={form.finalidade}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    finalidade: Number(e.target.value) as Categoria["finalidade"]
                  }))
                }
              >
                <option value={Finalidade.Despesa}>Despesa</option>
                <option value={Finalidade.Receita}>Receita</option>
                <option value={Finalidade.Ambas}>Ambas</option>
              </select>
            </div>
          </div>
          <div className="actions-row">
            <button className="btn btn-primary" type="submit">
              Adicionar
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <div className="card">
        <h2>Categorias cadastradas</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : categorias.length === 0 ? (
          <div>Nenhuma categoria cadastrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Descrição</th>
                <th>Finalidade</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.descricao}</td>
                  <td>
                    <span className={finalidadeTag(c.finalidade)}>
                      {Finalidade[c.finalidade]}
                    </span>
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

