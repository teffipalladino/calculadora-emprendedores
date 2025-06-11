export function renderCalculadoraPrecioVenta(container) {
  container.innerHTML = `
    <section class="wrapper style1">
      <div class="inner">
        <h2>Calculadora Precio de Venta</h2>
        
        <section>
          <h3>Ingresá tus costos:</h3>
          <div id="lista-costos" class="costos-list" style="margin-bottom: 1em;"></div>
          <ul class="actions small">
            <li><a href="#" id="agregarCostoBtn" class="button small icon solid fa-plus">Agregar otro costo</a></li>
          </ul>
          <p><strong>Costo total:</strong> $<span id="total-costos">0.00</span></p>
        </section>

        <section>
          <h3>¿Querés aplicar margen de ganancia o markup?</h3>
          <label><input type="radio" name="margenMarkup" value="margen" checked /> Margen de ganancia (%)</label><br/>
          <label><input type="radio" name="margenMarkup" value="markup" /> Markup (%)</label><br/>
          <input id="porcentajeGanancia" type="number" min="0" max="100" placeholder="Ej: 30" style="margin-top: 0.5em;" />
          <p id="precioVentaResult"><strong>Precio de venta sugerido:</strong> $0.00</p>
        </section>

        <section>
          <h3>¿Necesitás sumar IVA?</h3>
          <input id="ivaInput" type="number" min="0" max="100" placeholder="Ej: 21" />
          <p id="precioConIvaResult"><strong>Precio final con IVA:</strong> $0.00</p>
        </section>

        <ul class="actions">
          <li><a href="#" id="reiniciarBtn" class="button alt icon solid fa-trash">Borrar todo</a></li>
        </ul>
      </div>
    </section>
  `;

  const listaCostos = container.querySelector('#lista-costos');
  const totalCostosEl = container.querySelector('#total-costos');
  const precioVentaResult = container.querySelector('#precioVentaResult');
  const precioConIvaResult = container.querySelector('#precioConIvaResult');
  const porcentajeGananciaInput = container.querySelector('#porcentajeGanancia');
  const ivaInput = container.querySelector('#ivaInput');
  const agregarCostoBtn = container.querySelector('#agregarCostoBtn');
  const reiniciarBtn = container.querySelector('#reiniciarBtn');

  function formatearNumero(num) {
    return num.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function calcularTotalCostos() {
    let total = 0;
    container.querySelectorAll('.costo-input').forEach(input => {
      const val = parseFloat(input.value);
      if (!isNaN(val)) total += val;
    });
    totalCostosEl.textContent = formatearNumero(total);
    return total;
  }

  function calcularPrecioVenta() {
    const totalCostos = calcularTotalCostos();
    const porcentaje = parseFloat(porcentajeGananciaInput.value) || 0;
    const tipo = container.querySelector('input[name="margenMarkup"]:checked').value;

    let precioVenta = 0;
    if (tipo === 'margen') {
      precioVenta = totalCostos / (1 - porcentaje / 100);
    } else {
      precioVenta = totalCostos * (1 + porcentaje / 100);
    }
    precioVentaResult.innerHTML = `<strong>Precio de venta sugerido:</strong> $${formatearNumero(precioVenta)}`;
    return precioVenta;
  }

  function calcularPrecioConIVA(precioVenta) {
    const iva = parseFloat(ivaInput.value) || 0;
    const precioConIVA = precioVenta * (1 + iva / 100);
    precioConIvaResult.innerHTML = `<strong>Precio final con IVA:</strong> $${formatearNumero(precioConIVA)}`;
  }

  function actualizarCalculos() {
    const precioVenta = calcularPrecioVenta();
    calcularPrecioConIVA(precioVenta);
  }

  function agregarCosto(nombre = '', monto = '') {
    const div = document.createElement('div');
    div.style.marginBottom = '0.5em';

    const inputNombre = document.createElement('input');
    inputNombre.type = 'text';
    inputNombre.placeholder = 'Descripción (opcional)';
    inputNombre.value = nombre;
    inputNombre.style = 'margin-right: 1em; width: 40%;';

    const inputMonto = document.createElement('input');
    inputMonto.type = 'number';
    inputMonto.min = '0';
    inputMonto.step = '0.01';
    inputMonto.placeholder = 'Monto $';
    inputMonto.value = monto;
    inputMonto.className = 'costo-input';
    inputMonto.style = 'width: 20%;';
    inputMonto.addEventListener('input', actualizarCalculos);

    div.appendChild(inputNombre);
    div.appendChild(inputMonto);
    listaCostos.appendChild(div);

    actualizarCalculos();
  }

  function reiniciarFormulario() {
    listaCostos.innerHTML = '';
    porcentajeGananciaInput.value = '';
    ivaInput.value = '';
    totalCostosEl.textContent = '0.00';
    precioVentaResult.innerHTML = '<strong>Precio de venta sugerido:</strong> $0.00';
    precioConIvaResult.innerHTML = '<strong>Precio final con IVA:</strong> $0.00';
    agregarCosto();
  }

  agregarCostoBtn.addEventListener('click', e => {
    e.preventDefault();
    agregarCosto();
  });
  porcentajeGananciaInput.addEventListener('input', actualizarCalculos);
  ivaInput.addEventListener('input', actualizarCalculos);
  reiniciarBtn.addEventListener('click', e => {
    e.preventDefault();
    reiniciarFormulario();
  });
  container.querySelectorAll('input[name="margenMarkup"]').forEach(radio => {
    radio.addEventListener('change', actualizarCalculos);
  });

  reiniciarFormulario();
}
