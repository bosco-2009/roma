/* ==========================================================================
   curso-data.js — conteúdo do curso (módulos, aulas, vídeos) + progresso
   --------------------------------------------------------------------------
   COMO TROCAR OS VÍDEOS:
   Cada aula tem um campo "videoId". Esse é o código que fica na URL do
   YouTube depois de "v=". Exemplo: em
   https://www.youtube.com/watch?v=ABC123xyz  o videoId é "ABC123xyz".
   Troque pelos vídeos reais das suas aulas quando gravar. Por enquanto,
   os vídeos estão com um ID de exemplo só pra você ver como vai aparecer
   na tela.
   ========================================================================== */

const CURSO = {
  titulo: "Matemática: Reforço ao ENEM",
  modulos: [
    {
      titulo: "Módulo 1 — Equações",
      aulas: [
        { id: "m1a1", nome: "Introdução às Equações", dur: "10 min", videoId: "M7lc1UVf-VE",
          desc: "Você vai entender o que é uma equação, como montar uma a partir de um problema do dia a dia, e os primeiros passos para isolar o x." },
        { id: "m1a2", nome: "Equações do 1º grau", dur: "14 min", videoId: "M7lc1UVf-VE",
          desc: "Como resolver equações do primeiro grau passo a passo, com exemplos práticos." },
        { id: "m1a3", nome: "Equações do 2º grau", dur: "18 min", videoId: "M7lc1UVf-VE",
          desc: "Fórmula de Bhaskara, discriminante e como interpretar as raízes de uma equação." },
        { id: "m1a4", nome: "Exercícios comentados", dur: "12 min", videoId: "M7lc1UVf-VE",
          desc: "Resolução comentada de exercícios de prova sobre equações." },
      ]
    },
    {
      titulo: "Módulo 2 — Funções",
      aulas: [
        { id: "m2a1", nome: "O que é uma função", dur: "11 min", videoId: "M7lc1UVf-VE",
          desc: "Conceito de função, domínio e imagem, com exemplos do cotidiano." },
        { id: "m2a2", nome: "Função afim", dur: "15 min", videoId: "M7lc1UVf-VE",
          desc: "Gráfico, coeficiente angular e linear, e como interpretar uma função afim." },
        { id: "m2a3", nome: "Função quadrática", dur: "16 min", videoId: "M7lc1UVf-VE",
          desc: "Parábolas, vértice e como a função quadrática aparece em problemas de otimização." },
        { id: "m2a4", nome: "Exercícios comentados", dur: "13 min", videoId: "M7lc1UVf-VE",
          desc: "Resolução comentada de exercícios de prova sobre funções." },
      ]
    },
    {
      titulo: "Módulo 3 — Geometria",
      aulas: [
        { id: "m3a1", nome: "Áreas e perímetros", dur: "12 min", videoId: "M7lc1UVf-VE",
          desc: "Cálculo de área e perímetro das principais figuras planas." },
        { id: "m3a2", nome: "Teorema de Pitágoras", dur: "14 min", videoId: "M7lc1UVf-VE",
          desc: "Quando e como aplicar o Teorema de Pitágoras em problemas de prova." },
        { id: "m3a3", nome: "Trigonometria básica", dur: "17 min", videoId: "M7lc1UVf-VE",
          desc: "Seno, cosseno e tangente no triângulo retângulo, com aplicações práticas." },
        { id: "m3a4", nome: "Simulado final", dur: "20 min", videoId: "M7lc1UVf-VE",
          desc: "Simulado com questões de todos os módulos, no estilo ENEM." },
      ]
    },
  ]
};

// Retorna todas as aulas numa lista só (sem separar por módulo)
function todasAsAulas(){
  return CURSO.modulos.flatMap(m => m.aulas);
}

function chaveProgresso(userId){
  return "progresso_" + userId;
}

// Lê o array de ids de aulas assistidas por um usuário
function getProgresso(userId){
  try{
    const raw = localStorage.getItem(chaveProgresso(userId));
    return raw ? JSON.parse(raw) : [];
  }catch(e){ return []; }
}

function salvarProgresso(userId, listaIds){
  try{ localStorage.setItem(chaveProgresso(userId), JSON.stringify(listaIds)); }catch(e){}
}

// Marca ou desmarca uma aula como assistida, e devolve a lista atualizada
function alternarAulaAssistida(userId, aulaId){
  const atual = getProgresso(userId);
  const idx = atual.indexOf(aulaId);
  if(idx === -1) atual.push(aulaId);
  else atual.splice(idx, 1);
  salvarProgresso(userId, atual);
  return atual;
}

// Calcula o percentual concluído (0 a 100, arredondado)
function calcularPercentual(userId){
  const total = todasAsAulas().length;
  const feitas = getProgresso(userId).length;
  if(total === 0) return 0;
  return Math.round((feitas / total) * 100);
}

// Acha a próxima aula ainda não assistida (pra botão "continuar assistindo")
function proximaAulaNaoAssistida(userId){
  const progresso = getProgresso(userId);
  const todas = todasAsAulas();
  return todas.find(a => !progresso.includes(a.id)) || todas[0];
}
