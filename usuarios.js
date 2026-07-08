/* ==========================================================================
   usuarios.js — "banco de dados" de alunos da plataforma
   --------------------------------------------------------------------------
   IMPORTANTE PRA VOCÊ (professor/dono do site):
   Isso NÃO é um banco de dados de verdade (tipo os que ficam num servidor).
   É uma lista simples que vive no navegador de quem acessa o site, usando
   o localStorage. Funciona bem pra uma turma pequena e pra você testar e
   publicar rápido, mas tem 2 limitações importantes:

   1) Cada aluno só enxerga os dados no PRÓPRIO navegador/dispositivo dele.
      Se o aluno limpar o cache do navegador, o progresso dele reseta.
   2) Você (professor) NÃO consegue ver os dados de todos os alunos de um
      lugar só (tipo um painel admin) — cada navegador guarda só o que é
      dele. Pra ter isso de verdade (multi-dispositivo, painel de aluno
      centralizado), você vai precisar de um backend com banco de dados
      real (ex: Firebase, Supabase, ou um servidor próprio).

   COMO ADICIONAR / EDITAR ALUNOS:
   Edite a lista USUARIOS_PADRAO abaixo. Cada aluno tem:
     id      -> número único (não repita)
     usuario -> nome de usuário/login (sem espaço, tudo minúsculo é mais seguro)
     senha   -> senha de acesso
     nome    -> nome completo, aparece na saudação e no perfil
     email   -> e-mail do aluno
     curso   -> nome do curso que ele comprou
   ========================================================================== */

const USUARIOS_PADRAO = [
  { id: 1, usuario: "joaozinho",  senha: "123456",     nome: "João Silva",     email: "joao.silva@email.com",   curso: "Matemática: Reforço ao ENEM" },
  { id: 2, usuario: "maria123",   senha: "senha2024",   nome: "Maria Souza",    email: "maria.souza@email.com",  curso: "Matemática: Reforço ao ENEM" },
  { id: 3, usuario: "pedro_dev",  senha: "pedro@2024",  nome: "Pedro Andrade",  email: "pedro.andrade@email.com",curso: "Matemática: Reforço ao ENEM" },
];

const DB_KEY = "usuariosDB";
const SESSION_KEY = "usuarioLogado";

// Lê a lista de usuários (do localStorage, ou cria a partir da lista padrão acima)
function getUsuariosDB(){
  try{
    const raw = localStorage.getItem(DB_KEY);
    if(raw) return JSON.parse(raw);
  }catch(e){ /* localStorage indisponível — segue com a lista padrão */ }
  try{ localStorage.setItem(DB_KEY, JSON.stringify(USUARIOS_PADRAO)); }catch(e){}
  return USUARIOS_PADRAO;
}

function salvarUsuariosDB(lista){
  try{ localStorage.setItem(DB_KEY, JSON.stringify(lista)); }catch(e){}
}

// Confere usuário + senha. Retorna o objeto do usuário ou null.
function autenticar(usuario, senha){
  const lista = getUsuariosDB();
  const encontrado = lista.find(u =>
    u.usuario.toLowerCase() === usuario.trim().toLowerCase() && u.senha === senha
  );
  return encontrado || null;
}

function salvarSessao(usuarioObj){
  try{ localStorage.setItem(SESSION_KEY, JSON.stringify(usuarioObj)); }catch(e){}
}

function getUsuarioLogado(){
  try{
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  }catch(e){ return null; }
}

function encerrarSessao(){
  try{ localStorage.removeItem(SESSION_KEY); }catch(e){}
}

// Atualiza os dados de um usuário (usado na página de Perfil)
function atualizarUsuario(id, novosDados){
  const lista = getUsuariosDB();
  const idx = lista.findIndex(u => u.id === id);
  if(idx === -1) return null;
  lista[idx] = { ...lista[idx], ...novosDados };
  salvarUsuariosDB(lista);
  salvarSessao(lista[idx]);
  return lista[idx];
}

// Protege páginas internas: redireciona pro login se ninguém estiver logado.
// Chame no topo do <script> de dashboard.html, curso.html, perfil.html, duvidas.html
function exigirLogin(){
  const user = getUsuarioLogado();
  if(!user){
    window.location.href = "login.html";
    return null;
  }
  return user;
}
