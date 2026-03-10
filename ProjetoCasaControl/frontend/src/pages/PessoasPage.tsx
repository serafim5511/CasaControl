import { FormEvent, useEffect, useState } from "react";
import { api, Pessoa } from "../api/client";

const emptyForm: Omit<Pessoa, "id"> = {
  nome: "",
  idade: 0
};

export function PessoasPage() {
  const [pessoas, setPessoas] = useState<Pessoa[]>([]);
  const [form, setForm] = useState<Omit<Pessoa, "id">>(emptyForm);
  const [editing, setEditing] = useState<Pessoa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function carregar() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listarPessoas();
      setPessoas(data);
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
    if (!form.nome.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    if (form.nome.length > 200) {
      setError("Nome deve ter no máximo 200 caracteres.");
      return;
    }
    if (form.idade < 0) {
      setError("Idade não pode ser negativa.");
      return;
    }
    setError(null);
    if (editing) {
      api
        .atualizarPessoa(editing.id, form)
        .then(() => {
          setForm(emptyForm);
          setEditing(null);
          carregar();
        })
        .catch((err) => setError(err.message));
    } else {
      api
        .criarPessoa(form)
        .then(() => {
          setForm(emptyForm);
          carregar();
        })
        .catch((err) => setError(err.message));
    }
  }

  function startEdit(p: Pessoa) {
    setEditing(p);
    setForm({ nome: p.nome, idade: p.idade });
  }

  function cancelarEdicao() {
    setEditing(null);
    setForm(emptyForm);
  }

  function remover(id: number) {
    if (!confirm("Remover pessoa e todas as suas transações?")) return;
    api
      .excluirPessoa(id)
      .then(() => carregar())
      .catch(async (err) => setError(err.message));
  }

  return (
    <>
      <div className="card">
        <h2>{editing ? "Editar pessoa" : "Nova pessoa"}</h2>
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>Nome</label>
              <input
                value={form.nome}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nome: e.target.value }))
                }
                maxLength={200}
              />
            </div>
            <div className="field">
              <label>Idade</label>
              <input
                type="number"
                value={form.idade}
                onChange={(e) =>
                  setForm((f) => ({ ...f, idade: Number(e.target.value) }))
                }
                min={0}
              />
            </div>
          </div>
          <div className="actions-row">
            <button className="btn btn-primary" type="submit">
              {editing ? "Salvar" : "Adicionar"}
            </button>
            {editing && (
              <button
                className="btn btn-secondary"
                type="button"
                onClick={cancelarEdicao}
              >
                Cancelar
              </button>
            )}
          </div>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      <div className="card">
        <h2>Pessoas cadastradas</h2>
        {loading ? (
          <div>Carregando...</div>
        ) : pessoas.length === 0 ? (
          <div>Nenhuma pessoa cadastrada.</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Idade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pessoas.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.idade}</td>
                  <td>
                    <div className="actions-row">
                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => startEdit(p)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() => remover(p.id)}
                      >
                        Excluir
                      </button>
                    </div>
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

