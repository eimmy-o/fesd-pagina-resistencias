from flask import Flask, render_template, request
app = Flask(__name__)

def paralelo(*resistencias):
    if any(r <= 0 for r in resistencias):
        raise ValueError("Las resistencias en paralelo deben ser mayores que cero.")
    return 1 / sum(1/r for r in resistencias)

def resistencia_equivalente(R1, R2, R3, R4, R5, R6, R7, R8, R9):
    R89 = paralelo(R8, R9)
    R12 = R1 + R2
    R34 = R3 + R4
    R67 = paralelo(R6, R7)
    R675 = paralelo(R67, R5)
    R67589 = R675 + R89
    R6758934 = paralelo(R34, R67589)
    Req = R12 + R6758934
    return Req

@app.route('/', methods=['GET', 'POST'])
def index():
    resultado = None
    intensidad = None
    error = None
    if request.method == 'POST':
        try:
            Vt = float(request.form['Vt'])
            resistencias = [float(request.form[f'R{i}']) for i in range(1, 10)]
            for r in resistencias:
                if r <= 0:
                    raise ValueError("Todas las resistencias deben ser mayores que cero.")
            R1, R2, R3, R4, R5, R6, R7, R8, R9 = resistencias
            resultado = resistencia_equivalente(R1, R2, R3, R4, R5, R6, R7, R8, R9)
            intensidad = Vt / resultado
        except Exception as e:
            error = f"Error: {e}"

    return render_template('index.html', resultado=resultado, intensidad=intensidad, error=error)

if __name__ == '__main__':
    app.run(debug=True)
