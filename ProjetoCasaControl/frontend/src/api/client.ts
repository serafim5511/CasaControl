const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL ?? "https://localhost:7295";

async function request<T>(input: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${input}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...init
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Erro HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

export interface Pessoa {
  id: number;
  nome: string;
  idade: number;
}

export enum Finalidade {
  Despesa = 1,
  Receita = 2,
  Ambas = 3
}

export interface Categoria {
  id: number;
  descricao: string;
  finalidade: Finalidade;
}

export interface Transacao {
  id: number;
  descricao: string;
  valor: number;
  tipo: "Despesa" | "Receita";
  categoriaId: number;
  pessoaId: number;
  categoria?: Categoria;
  pessoa?: Pessoa;
}

export interface TotaisPorPessoaDTO {
  pessoaId: number;
  nome: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export interface TotaisPorCategoriaDTO {
  categoriaId: number;
  descricao: string;
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export const api = {
  // Pessoas
  listarPessoas: () => request<Pessoa[]>("/api/pessoas"),
  criarPessoa: (p: Omit<Pessoa, "id">) =>
    request<Pessoa>("/api/pessoas", {
      method: "POST",
      body: JSON.stringify({
        nome: p.nome,
        idade: p.idade
      })
    }),
  atualizarPessoa: (id: number, p: Omit<Pessoa, "id">) =>
    request<Pessoa>(`/api/pessoas/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        id: id,
        nome: p.nome,
        idade: p.idade
      })
    }),
  excluirPessoa: (id: number) =>
    fetch(`${API_BASE_URL}/api/pessoas/${id}`, { method: "DELETE" }),

  // Categorias
  listarCategorias: () => request<Categoria[]>("/api/categorias"),
  criarCategoria: (c: Omit<Categoria, "id">) =>
    request<Categoria>("/api/categorias", {
      method: "POST",
      body: JSON.stringify({
      descricao: c.descricao,
      finalidade: c.finalidade as number
      })
    }),

  // Transações
  listarTransacoes: () => request<Transacao[]>("/api/transacoes"),
  criarTransacao: (t: Omit<Transacao, "id" | "categoria" | "pessoa">) =>
    request<Transacao>("/api/transacoes", {
      method: "POST",
      body: JSON.stringify({
        descricao: t.descricao,
        valor: t.valor,
  tipo: t.tipo === "Despesa" ? 1 : 2,
        categoriaId: t.categoriaId,
        pessoaId: t.pessoaId
      })
    }),

  // Relatórios
  totaisPorPessoa: () =>
    request<{ pessoas: TotaisPorPessoaDTO[]; totalGeral: any }>(
      "/api/relatorios/totais-por-pessoa"
    ),
  totaisPorCategoria: () =>
    request<{ categorias: TotaisPorCategoriaDTO[]; totalGeral: any }>(
      "/api/relatorios/totais-por-categoria"
    )
};

