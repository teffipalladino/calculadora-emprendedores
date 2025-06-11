export function renderCalculadoraPrecioVenta(container) {
  container.innerHTML = `
    <h3>Ingresá tus costos:</h3>
    <div id="lista-costos" style="margin-bottom: 1em;"></div>
    <button id="agregarCostoBtn" class="button small">➕ Agregar otro costo</button>
    <p style="margin-top:1em;">Costo total: $<span id="total-costos">0.00</span></p>

    <hr />

    <div>
      <label><strong>¿Querés aplicar margen de ganancia o markup?</strong></label><br />
      <label><input type="radio" name="margenMarkup" value="margen" checked /> Margen de ganancia (%)</label>
      <label style="margin-left: 1em;"><input type="radio" name="margenMarkup" value="markup" /> Markup (%)</label><br />
      <input id="porcentajeGanancia" type="number" min="0" max="100" placeholder="Ej: 30" class="input" />
      <p id="precioVentaResult" style="margin-top:0.5em;"><strong>Precio de venta sugerido:</strong> $0.00</p>
    </div>

    <hr />

    <div>
      <label><strong>¿Necesitás sumar IVA?</strong></label><br />
      <input id="ivaInput" type="number" min="0" max="100" placeholder="Ej: 21" class="input" />
      <p id="precioConIvaResult" style="margin-top:0.5em;"><strong>Precio final con IVA:</strong> $0.00</p>
    </div>

    <button id="reiniciarBtn" class="button small" style="margin-top:1.5em;background:#ff5e5e;color:white;">Borrar todo</button>
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
    precioVentaResult.textContent = `Precio de venta sugerido: $${formatearNumero(precioVenta)}`;
    return precioVenta;
  }

  function calcularPrecioConIVA(precioVenta) {
    const iva = parseFloat(ivaInput.value) || 0;
    const precioConIVA = precioVenta * (1 + iva / 100);
    precioConIvaResult.textContent = `Precio final con IVA: $${formatearNumero(precioConIVA)}`;
  }

  function actualizarCalculos() {
    const precioVenta = calcularPrecioVenta();
    calcularPrecioConIVA(precioVenta);
  }

  function agregarCosto(nombre = '', monto = '') {
    const div = document.createElement('div');
    div.className = 'row';
    div.innerHTML = `
      <div class="col-6 col-12-small"><input type="text" placeholder="Descripción (opcional)" class="input" value="${nombre}"></div>
      <div class="col-6 col-12-small"><input type="number" min="0" step="0.01" placeholder="Monto $" class="costo-input input" value="${monto}"></div>
    `;
    listaCostos.appendChild(div);
    div.querySelector('.costo-input').addEventListener('input', actualizarCalculos);
    actualizarCalculos();
  }

  function reiniciarFormulario() {
    listaCostos.innerHTML = '';
    porcentajeGananciaInput.value = '';
    ivaInput.value = '';
    totalCostosEl.textContent = '0.00';
    precioVentaResult.textContent = 'Precio de venta sugerido: $0.00';
    precioConIvaResult.textContent = 'Precio final con IVA: $0.00';
    agregarCosto();
  }

  agregarCostoBtn.addEventListener('click', () => agregarCosto());
  porcentajeGananciaInput.addEventListener('input', actualizarCalculos);
  ivaInput.addEventListener('input', actualizarCalculos);
  reiniciarBtn.addEventListener('click', reiniciarFormulario);
  container.querySelectorAll('input[name="margenMarkup"]').forEach(radio => {
    radio.addEventListener('change', actualizarCalculos);
  });

  reiniciarFormulario();
}
