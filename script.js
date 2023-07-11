const categoriaSelect = document.getElementById('categoria-select');
const dificultadSelect = document.getElementById('dificultad-select');
const tipoSelect = document.getElementById('tipo-select');
const generarBtn = document.getElementById('generar-btn');
const triviaContenedor = document.getElementById('trivia-contenedor');
const preguntaContenedor = document.getElementById('pregunta-contenedor');
const puntajeContenedor = document.getElementById('puntaje-contenedor');
const puntajeJuego = document.getElementById('puntaje');
const nuevaTriviaBtn = document.getElementById('nueva-trivia-btn');

fetch('https://opentdb.com/api_category.php')
  .then(response => response.json())
  .then(data => {
    data.trivia_categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categoriaSelect.classList.add('form-select');
      categoriaSelect.appendChild(option);
    });
  });

generarBtn.addEventListener('click', generateTrivia);

nuevaTriviaBtn.addEventListener('click', () => {
  triviaContenedor.style.display = 'none';
  puntajeContenedor.style.display = 'none';
  preguntaContenedor.innerHTML = '';
});

function generateTrivia() {
    const categoria = categoriaSelect.value;
    const dificultad = dificultadSelect.value;
    const tipo = tipoSelect.value;
  
    const url = `https://opentdb.com/api.php?amount=2&category=${categoria}&difficulty=${dificultad}&type=${tipo}`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        triviaContenedor.style.display = 'block';
        puntajeContenedor.style.display = 'none';
        preguntaContenedor.innerHTML = '';
  
        let puntaje = 0;
        let numPregunta = 0;
  
        data.results.forEach((question, index) => {
          const preguntaElemento = document.createElement('div');
          preguntaElemento.classList.add('question');
  
          const preguntaTexto = document.createElement('h4');
          preguntaTexto.textContent = `Pregunta ${index + 1}: ${question.question}`;
  
          const opciones = question.incorrect_answers.map(answer => {
            return { text: answer, correct: false };
          });
  
          opciones.push({ text: question.correct_answer, correct: true });
  
          opciones.sort(() => Math.random() - 0.5);
  
          opciones.forEach(option => {
            const opcionElemento = document.createElement('div');
            opcionElemento.classList.add('option');
            opcionElemento.textContent = option.text;
  
            opcionElemento.addEventListener('click', () => {
              if (option.correct) {
                puntaje += 100;
                numPregunta++;
                console.log(puntaje);
                console.log(data.results.length);
                console.log(numPregunta);
                opcionElemento.classList.add('correct');
              } else {
                numPregunta++;
                console.log(puntaje);
                console.log(data.results.length);
                console.log(numPregunta);
                opcionElemento.classList.add('incorrect');
              }
              console.log(typeof(numPregunta));
              console.log(typeof(data.results.length));
              console.log(numPregunta === data.results.length)
              
              const optionElements = preguntaElemento.querySelectorAll('.option');
              optionElements.forEach(element => {
                element.style.pointerEvents = 'none';
              });
  
              if (numPregunta == data.results.length) {
                console.log("Si entro")
                console.log(numPregunta);
                puntajeContenedor.style.display = 'block';
                puntajeJuego.textContent = puntaje;
              }
            });
  
            preguntaElemento.appendChild(opcionElemento);
          });
  
          preguntaContenedor.appendChild(preguntaTexto);
          preguntaContenedor.appendChild(preguntaElemento);
        });
        console.log(puntaje);
        
      })
      .catch(error => {
        console.error('Error al generar la trivia:', error);
      });
  }
  