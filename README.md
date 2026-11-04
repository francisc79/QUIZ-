# Quiz Bíblico — Desafio da Palavra

Aplicação interativa para testar conhecimentos sobre o **Antigo e o Novo Testamento**. Desenvolvida com HTML, CSS e JavaScript puro, com suporte a instalação como Progressive Web App (PWA).

<p align="center">
  <a href="https://francisc79.github.io/QUIZ-/"><strong>▶ JOGAR ONLINE</strong></a>
</p>

## Funcionalidades

- Dois modos de jogo: Antigo Testamento e Novo Testamento.
- Banco com **300 perguntas** (150 por testamento).
- Rodadas de até 10 questões, sem repetir perguntas na mesma partida.
- Pontuação de 10 pontos por resposta correta.
- Feedback imediato com indicação da alternativa correta.
- Resumo por rodada e resultado final com aproveitamento.
- Efeitos sonoros e música de fundo.
- Layout responsivo para celular, tablet e desktop.
- PWA com cache dos arquivos essenciais para acesso offline após a instalação.

## Tecnologias

| Tecnologia | Aplicação |
| --- | --- |
| HTML5 | Estrutura semântica e acessível |
| CSS3 | Layout responsivo, animações e identidade visual |
| JavaScript ES6+ | Lógica do quiz, pontuação e manipulação do DOM |
| JSON | Armazenamento das perguntas |
| Service Worker | Cache e experiência offline |
| Web App Manifest | Instalação como aplicativo |

## Executar localmente

1. Clone o repositório.
2. Abra a pasta no Visual Studio Code.
3. Inicie um servidor local, como Live Server.
4. Acesse o endereço local fornecido pelo servidor.

O Service Worker funciona em HTTPS ou localhost. Para testar a instalação PWA, utilize um navegador compatível.

## Estrutura do projeto

```text
QUIZ-/
├── img/              # Ícones e imagens
├── sound/            # Música e efeitos sonoros
├── index.html        # Estrutura da aplicação
├── style.css         # Estilos e responsividade
├── script.js         # Lógica do quiz
├── questions.json    # Banco de 300 perguntas
├── manifest.json     # Configuração PWA
└── sw.js              # Cache offline
```

## Regras do jogo

- Escolha o testamento que deseja estudar.
- Informe seu nome.
- Cada rodada apresenta até 10 perguntas.
- Cada acerto soma 10 pontos.
- Ao final da rodada, você pode continuar ou encerrar a jornada.
- O resultado apresenta a pontuação e o percentual de aproveitamento.

## Créditos e observações

Projeto independente com finalidade educativa. As perguntas são organizadas por tema bíblico e podem ser ampliadas ou revisadas no arquivo `questions.json`.

---

Desenvolvido por **Francisco Antônio** · Projeto de portfólio ADS
