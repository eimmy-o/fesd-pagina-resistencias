document.addEventListener('DOMContentLoaded', function() {
    const calcularBtn = document.getElementById('calcularBtn');
    const circuitoImg = document.getElementById('circuito-img');
    const resultadosFinales = document.getElementById('resultados-finales');
    const inputs = document.querySelectorAll('.circuito-input');
    
    const imagenesPasos = [
        'imgs/circuito-paso1.png',
        'imgs/circuito-paso2.png',
        'imgs/circuito-paso3.png',
        'imgs/circuito-final.png'
    ];
    
    calcularBtn.addEventListener('click', function() {
        const Vt = parseFloat(document.getElementById('Vt').value);
        const resistencias = [];
        let hayError = false;

        for (let i = 1; i <= 9; i++) {
            const valor = parseFloat(document.getElementById(R${i}).value);
            if (isNaN(valor)) {
                hayError = true;
                mostrarInputs();
                alert(Ingresa un valor válido para R${i});
                return;
            }
            resistencias.push(valor);
        }

        if (isNaN(Vt) || Vt <= 0) {
            hayError = true;
            mostrarInputs();
            alert("Ingresa un voltaje válido > 0");
            return;
        }

        if (!hayError) {
            ocultarInputs();
            transformarCircuito(Vt, resistencias);
        }
    });

    function ocultarInputs() {
        inputs.forEach(input => {
            input.style.opacity = '0';
            input.style.pointerEvents = 'none';
        });
    }

    function mostrarInputs() {
        inputs.forEach(input => {
            input.style.opacity = '1';
            input.style.pointerEvents = 'auto';
        });
    }

    function transformarCircuito(Vt, resistencias) {
        let pasoActual = 0;
        resultadosFinales.innerHTML = '<p class="calculando">Calculando...</p>';
        
        function mostrarSiguientePaso() {
            if (pasoActual >= imagenesPasos.length) {
                const Req = calcularResistenciaEquivalente(resistencias);
                const Itotal = Vt / Req;
                
                resultadosFinales.innerHTML = `
                    <p>Resistencia equivalente: <span class="resultado-destacado">${Req.toFixed(2)} Ω</span></p>
                    <p>Intensidad total: <span class="resultado-destacado">${Itotal.toFixed(4)} A</span></p>
                `;
                return;
            }
            
            circuitoImg.style.opacity = 0;
            
            setTimeout(() => {
                circuitoImg.src = imagenesPasos[pasoActual];
                circuitoImg.style.opacity = 1;
                pasoActual++;
                setTimeout(mostrarSiguientePaso, 1500);
            }, 500);
        }
        
        mostrarSiguientePaso();
    }
    
    function calcularResistenciaEquivalente(resistencias) {
        // Implementa tu lógica real aquí
        const Rserie = resistencias[0] + resistencias[1];
        const Rparalelo = 1 / (1/resistencias[2] + 1/resistencias[3]);
        return Rserie + Rparalelo + resistencias[4];
    }
});