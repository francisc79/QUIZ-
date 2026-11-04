# Quiz Bíblico

Aplicação web de perguntas e respostas para testar conhecimentos sobre a Bíblia. O jogador pode escolher entre **Antigo Testamento** e **Novo Testamento**, responder às questões e acumular pontos ao longo das rodadas.

<p align="center">
  <a href="https://francisc79.github.io/QUIZ-/"><strong>▶ ACESSAR O QUIZ ONLINE</strong></a>
</p>

## Sobre o projeto

O Quiz Bíblico foi desenvolvido como uma aplicação leve, com tecnologias web fundamentais. As perguntas ficam organizadas em um arquivo JSON separado da lógica do jogo, facilitando a manutenção e a ampliação do conteúdo.

O banco atual contém **300 perguntas**:
- 150 perguntas do Antigo Testamento.
- 150 perguntas do Novo Testamento.

## Funcionalidades

- Escolha entre os modos Antigo Testamento e Novo Testamento.
- Identificação do participante por nome.
- Perguntas com quatro alternativas.
- Indicação visual da resposta correta e da resposta selecionada incorretamente.
- Pontuação acumulada durante a partida.
- Rodadas com 10 perguntas.
- Resumo da pontuação ao final de cada rodada.
- Opção para continuar para a próxima rodada ou encerrar a partida.
- Opção para iniciar uma nova partida.
- Música de fundo e efeitos sonoros para respostas corretas e incorretas.
- Layout adaptado para uso em dispositivos móveis.
- Manifesto PWA e Service Worker para suporte à instalação como aplicativo.

## Tecnologias utilizadas

| Tecnologia | Finalidade |
| --- | --- |
| HTML5 | Estrutura da aplicação e componentes da interface |
| CSS3 | Estilização, cores, organização dos elementos e responsividade |
| JavaScript | Controle das perguntas, respostas, pontuação e navegação entre rodadas |
| JSON | Armazenamento e organização das perguntas |
| Web Audio / HTML Audio | Reprodução de música e efeitos sonoros |
| PWA | Manifesto de instalação e Service Worker |

## Como jogar

1. Acesse o [Quiz Bíblico](https://francisc79.github.io/QUIZ-/).
2. Informe o nome do participante.
3. Escolha Antigo Testamento ou Novo Testamento.
4. Leia a pergunta e selecione uma das quatro alternativas.
5. Confira o feedback visual e sonoro.
6. Cada resposta correta acrescenta 10 pontos.
7. Ao concluir as 10 perguntas da rodada, escolha continuar ou encerrar.
8. Ao finalizar, confira sua pontuação e, se desejar, inicie uma nova partida.

## Executar localmente

É possível executar o projeto sem instalar frameworks ou dependências.

1. Faça o clone do repositório:

   ```bash
   git clone https://github.com/francisc79/QUIZ-.git
   ```

2. Abra a pasta do projeto no Visual Studio Code.
3. Inicie um servidor local, por exemplo, usando a extensão Live Server.
4. Abra o endereço local apresentado pelo servidor.

> O uso de um servidor local (localhost) é recomendado para testar o carregamento do JSON e os recursos de PWA. O Service Worker requer HTTPS ou localhost.

## Estrutura de arquivos

```text
QUIZ-/
├── img/
│   ├── biblia.png
│   ├── icon.png
│   └── justica.png
├── sound/
│   ├── amazing-grace-instrumental-145357.mp3
│   ├── correct-156911.mp3
│   └── error-08-206492.mp3
├── index.html
├── style.css
├── script.js
├── questions.json
├── manifest.json
└── sw.js
```

## Banco de perguntas

O arquivo `questions.json` armazena os conjuntos de questões separados pelas propriedades `antigo` e `novo`. Cada questão contém:
- `question`: enunciado.
- `options`: lista com quatro alternativas.
- `answer`: índice da alternativa correta, começando em zero.

Exemplo de estrutura:

```json
{
  "antigo": [
    {
      "question": "Exemplo de pergunta?",
      "options": ["Alternativa A", "Alternativa B", "Alternativa C", "Alternativa D"],
      "answer": 0
    }
  ],
  "novo": []
}
```

## Instalação como aplicativo

O projeto inclui `manifest.json` e `sw.js`, utilizados pelo navegador para oferecer recursos de Progressive Web App (PWA). Em navegadores compatíveis, o usuário pode adicionar o quiz à tela inicial.

## Melhorias futuras

- Adicionar níveis de dificuldade.
- Criar histórico local de partidas e pontuações.
- Permitir filtrar perguntas por livro ou assunto.
- Ampliar o banco de perguntas com revisão das referências bíblicas.

## Créditos

Projeto independente e educativo, desenvolvido para estudo e prática de desenvolvimento web.

---

Desenvolvido por **Francisco Antônio**.
