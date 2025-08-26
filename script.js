document.addEventListener('DOMContentLoaded', function() {
            const startButton = document.getElementById('start-button');
            const introScreen = document.getElementById('intro-screen');
            const gameContainer = document.getElementById('game-container');

            gameContainer.style.display = 'none';

            startButton.addEventListener('click', function() {
                introScreen.style.display = 'none';
                gameContainer.style.display = 'flex';
            });
        });
       
        const gameSeries = [
            {
                id: 'series1',
                initialParasites: [
                    { id: 'svulgaris', name: 'Strongylus vulgaris' },
                    { id: 'sequinus', name: 'Strongylus equinus' },
                    { id: 'sedentatus', name: 'Strongylus edentatus' },
                    { id: 'dimmitis', name: 'Dirofilaria immitis' },
                    { id: 'acaninum', name: 'Ancylostoma caninum' }
                ],
                rounds: [
                    {
                        consigna: '¿Cuál de los siguientes parásitos no tiene cápsula bucal desarrollada?',
                        eliminatedId: 'dimmitis',
                        feedback: '¡Correcto!'
                    },
                    {
                        consigna: '¿Cuál de estos parásitos no afecta al equino?',
                        eliminatedId: 'acaninum',
                        feedback: '¡Exacto!'
                    },
                    {
                        consigna: '¿Cuál de estos parásitos no tiene dientes en su cápsula bucal?',
                        eliminatedId: 'sedentatus',
                        feedback: '¡Muy bien!'
                    },
                    {
                        consigna: 'De los dos parásitos restantes, ¿cuál migra por arterias pudiendo producir tromboembolismo?',
                        eliminatedId: 'sequinus',
                        correctPickId: 'svulgaris',
                        feedback: 'Strongylus vulgaris es el parásito que migra por la arteria mesentérica craneal, causando arteritis y potencial tromboembolismo. Posee 2 dientes con forma de oreja de ratón en su cápsula bucal, y afecta al equino'
                    }
                ]
            },
            {
                id: 'series2',
                initialParasites: [
                    { id: 'acaninum', name: 'Ancylostoma caninum' },
                    { id: 'dimmitis', name: 'Dirofilaria immitis' },
                    { id: 'tserratus', name: 'Triodontophorus serratus' },
                    { id: 'sstercoralis', name: 'Strongyloides stercoralis' },
                    { id: 'svulgaris', name: 'Strongylus vulgaris' }
                ],
                rounds: [
                    {
                        consigna: '¿Cual de los siguientes parásitos no tiene ciclo directo?',
                        eliminatedId: 'dimmitis',
                        feedback: '¡Correcto!'
                    },
                    {
                        consigna: '¿Cuál de los siguientes parásitos no tiene cápsula bucal desarrollada con dientes?',
                        eliminatedId: 'sstercoralis',
                        feedback: '¡Exacto!'
                    },
                    {
                        consigna: '¿Cuál de los siguientes parásitos no realiza migraciones por órganos internos (extraintestinal)?',
                        eliminatedId: 'tserratus',
                        feedback: '¡Muy bien!'
                    },
                    {
                        consigna: '¿Cuál de los siguientes parásitos se encuentra en Intestino delgado en su estadio adulto?',
                        eliminatedId: 'svulgaris',
                        correctPickId: 'acaninum',
                        feedback: 'Ancylostoma caninum se encuentra en el intestino delgado en su estadio adulto. Presenta una cápsula bucal con dientes bien desarrollados y placas cortantes. Es de ciclo directo y puede realizar migraciones a lo largo de su ciclo biológico.'
                    }
                ]
            }
        ];

        
        let currentSeriesIndex = 0; 
        let currentRoundIndex = 0; // Índice de la ronda actual dentro de la serie actual
        let activeParasites = []; // Almacena los parásitos activos en la ronda actual
        let gameActive = false; // Bandera para controlar si el juego está activo o no

        const consignaEl = document.getElementById('consigna');
        const parasiteGridEl = document.getElementById('parasite-grid');
        const gameMessageEl = document.getElementById('game-message');
        const restartButtonEl = document.getElementById('restart-button');
        const gameTitleEl = document.getElementById('game-title');

        /**
         * Mezcla los elementos de un array de forma aleatoria.
         * @param {Array} array - El array a mezclar.
         * @returns {Array} El array mezclado.
         */
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]]; // Intercambia elementos
            }
            return array;
        }

        
        function initializeGame() {
            currentSeriesIndex = 0; // Siempre comienza desde la primera serie
            startNewSeries(currentSeriesIndex);
        }

        /**
         * Inicia una nueva serie del juego con sus parásitos y rondas correspondientes.
         * @param {number} seriesIndex - El índice de la serie a iniciar.
         */
        function startNewSeries(seriesIndex) {
            if (seriesIndex >= gameSeries.length) {
                gameMessageEl.textContent = '¡Error en el juego! Por favor, reinicia.';
                gameMessageEl.classList.remove('hidden');
                restartButtonEl.textContent = 'Reiniciar Juego';
                restartButtonEl.onclick = initializeGame;
                restartButtonEl.classList.remove('hidden');
                gameActive = false;
                return;
            }

            currentSeriesIndex = seriesIndex; // Actualiza la variable global para la serie actual

            const seriesConfig = gameSeries[currentSeriesIndex];
            activeParasites = [...seriesConfig.initialParasites]; // Restablece los parásitos para la nueva serie
            currentRoundIndex = 0;
            gameActive = true;
            gameMessageEl.classList.add('hidden');
            restartButtonEl.classList.add('hidden');
            gameTitleEl.textContent = 'Descarta uno';
            renderGame();
        }

        
        function renderGame() {
            if (!gameActive) return;

            const currentSeriesConfig = gameSeries[currentSeriesIndex];
            const currentRound = currentSeriesConfig.rounds[currentRoundIndex];

            const isLastRoundInSeries = (currentRoundIndex === currentSeriesConfig.rounds.length - 1);
            if (isLastRoundInSeries) {
                gameTitleEl.textContent = 'Elige el correcto';
            } else {
                gameTitleEl.textContent = 'Descarta uno';
            }

            consignaEl.textContent = currentRound.consigna;

            // Limpia las tarjetas de parásitos anteriores
            parasiteGridEl.innerHTML = '';

            // Mezcla los parásitos activos para un orden de visualización aleatorio
            const shuffledParasites = shuffleArray([...activeParasites]);

            shuffledParasites.forEach(parasite => {
                const parasiteCard = document.createElement('div');
                parasiteCard.id = parasite.id; // Asigna un ID al elemento para referencia fácil
                parasiteCard.dataset.id = parasite.id; // Almacena el ID en un atributo de datos para el manejo de eventos
                parasiteCard.className = `
                    parasite-card
                    bg-indigo-700
                    p-6
                    rounded-lg
                    shadow-xl
                    cursor-pointer
                    hover:bg-indigo-600
                    text-xl
                    font-semibold
                    text-center
                    flex items-center justify-center
                    min-h-[120px]
                    transition-all duration-500 ease-in-out
                    transform hover:scale-105
                    border-2 border-transparent hover:border-indigo-400
                    m-2
                `;
                parasiteCard.textContent = parasite.name;
                parasiteCard.addEventListener('click', handleParasiteClick);
                parasiteGridEl.appendChild(parasiteCard);
            });
        }

        /**
         * Maneja el evento de clic en una tarjeta de parásito.
         * Verifica si la elección es correcta, anima la eliminación o muestra feedback.
         * @param {Event} event - El evento de clic.
         */
        async function handleParasiteClick(event) {
            if (!gameActive) return;

            const clickedParasiteCard = event.target;
            const clickedParasiteId = clickedParasiteCard.dataset.id;
            const currentSeriesConfig = gameSeries[currentSeriesIndex];
            const currentRound = currentSeriesConfig.rounds[currentRoundIndex];

            const isLastRoundInSeries = (currentRoundIndex === currentSeriesConfig.rounds.length - 1);

            let isCorrectSelection = false;

            if (isLastRoundInSeries) {
                isCorrectSelection = (clickedParasiteId === currentRound.correctPickId);
            } else {
                isCorrectSelection = (clickedParasiteId === currentRound.eliminatedId);
            }

            if (isCorrectSelection) {
                // Si NO es la última ronda, muestra el feedback y anima la eliminación.
                if (!isLastRoundInSeries) {
                    gameMessageEl.textContent = currentRound.feedback;
                    gameMessageEl.classList.remove('hidden');
                    gameMessageEl.classList.remove('bg-red-700', 'text-red-200');
                    gameMessageEl.classList.add('bg-green-700', 'text-green-200', 'rounded-xl', 'py-4', 'px-6', 'inline-block', 'mx-auto', 'mt-4');
                    clickedParasiteCard.classList.remove('bg-indigo-700', 'hover:bg-indigo-600');
                    clickedParasiteCard.classList.add('bg-green-600', 'text-white');
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    gameMessageEl.classList.add('hidden');
                    clickedParasiteCard.classList.remove('bg-green-600', 'text-white');
                    clickedParasiteCard.classList.add('eliminated');
                    await new Promise(resolve => setTimeout(resolve, 500));
                    activeParasites = activeParasites.filter(p => p.id !== clickedParasiteId);
                } else {
                    // Si es la ÚLTIMA ronda y la selección es correcta, no hay animación de eliminación
                    // y pasamos directamente a la pantalla de fin de serie.
                    activeParasites = activeParasites.filter(p => p.id === currentRound.correctPickId);
                }

                currentRoundIndex++;

                if (currentRoundIndex >= currentSeriesConfig.rounds.length) {
                    gameActive = false;

                    const finalParasite = activeParasites[0];
                    consignaEl.textContent = `¡Serie ${currentSeriesIndex + 1} completada! El parásito es:`;
                    parasiteGridEl.innerHTML = `
                        <div class="col-span-full
                            bg-green-700
                            p-8
                            rounded-lg
                            shadow-2xl
                            text-3xl
                            font-bold
                            text-center
                            flex items-center justify-center
                            min-h-[150px]
                            border-4 border-green-400
                            animate-pulse
                        ">
                            ${finalParasite.name}
                        </div>
                    `;
                    gameMessageEl.textContent = `¡Felicidades! ${currentRound.feedback}`;
                    gameMessageEl.classList.remove('hidden', 'bg-red-700', 'text-red-200');
                    gameMessageEl.classList.add('bg-green-700', 'text-green-200', 'rounded-xl', 'py-4', 'px-6', 'inline-block', 'mx-auto', 'mt-4');

                  
                    if (currentSeriesIndex + 1 < gameSeries.length) {
                        restartButtonEl.textContent = 'Siguiente Serie';
                        restartButtonEl.onclick = () => startNewSeries(currentSeriesIndex + 1);
                        restartButtonEl.classList.remove('hidden');
                    } else {
                        consignaEl.textContent = '¡Juego Completado!';
                        gameMessageEl.textContent = '¡Felicidades por completar todas las series!';
                        restartButtonEl.textContent = 'Reiniciar Juego';
                        restartButtonEl.onclick = initializeGame;
                        restartButtonEl.classList.remove('hidden');
                    }
                } else {
                    // Si no es el final de la serie, continúa con la siguiente ronda
                    renderGame();
                }
            } else {
                // Elección incorrecta
                clickedParasiteCard.classList.remove('bg-green-600', 'bg-indigo-700', 'hover:bg-indigo-600');
                clickedParasiteCard.classList.add('bg-red-600', 'text-white');

                gameMessageEl.textContent = '¡Incorrecto! Intenta de nuevo.';
                gameMessageEl.classList.remove('hidden', 'bg-green-700', 'text-green-200');
                gameMessageEl.classList.add(
                    'bg-red-700',
                    'text-red-200',
                    'rounded-xl',
                    'py-4',
                    'px-6',
                    'inline-block',
                    'mt-4'
                );
                // Centrado horizontal
                gameMessageEl.style.display = 'flex';
                gameMessageEl.style.justifyContent = 'center';

                setTimeout(() => {
                    clickedParasiteCard.classList.remove('bg-red-600', 'text-white');
                    gameMessageEl.classList.add('hidden');
                    gameMessageEl.style.display = '';
                    gameMessageEl.style.justifyContent = '';
                }, 1500);
            }
        }

        restartButtonEl.addEventListener('click', initializeGame);

        window.onload = initializeGame;
