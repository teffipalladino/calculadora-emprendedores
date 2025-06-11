export function renderCalculadoraPrecioVenta(container) {
  container.innerHTML = `
    <form id="formulario" style="max-width: 500px; margin: auto;">
      <label>
        Costo del producto:
        <input type="number" id="costo" step="0.01" style="color: black;" required />
      </label>

      <fieldset style="margin: 1rem 0; padding: 1rem; border: 1px solid #ccc; border-radius: 8px;">
        <legend><strong>Elegí cómo calcular la ganancia:</strong></legend>
        <label style="display: block; margin-bottom: 0.5rem;">
          <input type="radio" name="tipoMargen" value="venta" checked />
          Margen sobre <strong>precio de venta</strong>
        </label>
        <label style="display: block;">
          <input type="radio" name="tipoMargen" value="costo" />
          Markup sobre <strong>costo</strong>
        </label>
      </fieldset>

      <label>
        Porcentaje (%):
        <input type="number" id="porcentaje" step="0.01" style="color: black;" required />
      </label>

      <button type="submit" style="margin-top: 1rem; background-color: #000; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 6px; cursor: pointer;">
        Calcular precio de venta
      </button>
    </form>

    <div id="resultado" style="margin-top: 2rem; font-size: 1.2rem; color: black; text-align: center;"></div>
  `;

  document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();

    const costo = parseFloat(document.getElementById('costo').value);
    const porcentaje = parseFloat(document.getElementById('porcentaje').value);
    const tipoMargen = document.querySelector('input[name="tipoMargen"]:checked').value;
    const resultado = document.getElementById('resultado');

    if (isNaN(costo) || isNaN(porcentaje)) {
      resultado.textContent = "Por favor completá ambos campos correctamente.";
      return;
    }

    let precioVenta;

    if (tipoMargen === 'venta') {
      if (porcentaje >= 100) {
        resultado.textContent = "El porcentaje no puede ser igual o mayor al 100% cuando es sobre venta.";
        return;
      }
      precioVenta = costo / (1 - porcentaje / 100);
    } else {
      precioVenta = costo * (1 + porcentaje / 100);
    }

    resultado.textContent = `Precio de venta sugerido: $${precioVenta.toLocaleString('es-AR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  });
}
