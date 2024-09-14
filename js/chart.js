import { backgroundColors, borderColors } from './colorsCharts.js';

const charts = {};
const userEmail = sessionStorage.getItem('userEmail');
const baseUrl = `http://localhost:8080/user/${userEmail}`;
const hiddenVisibleCharts = document.querySelector('.hidden-visible-charts');
function showLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'flex';
  document.querySelector('.spinner').style.display = 'block';

}

function hideLoadingSpinner() {
  document.querySelector('#loadingSpinner').style.display = 'none';
  document.querySelector('.spinner').style.display = 'none';
}

const properties = JSON.parse(sessionStorage.getItem("properties"));

function createPropertyButtons() {
  const container = document.getElementById('propertiesButtons');
  properties.forEach(property => {
    const button = document.createElement('button');
    button.innerText = property.propertyName;
    button.className = 'property-button';
    button.addEventListener('click', () => {
      loadPropertyData(property.propertyName);
      hiddenVisibleCharts.style.display = 'block';

    });
    container.appendChild(button);
  });
}

async function loadPropertyData(propId) {
  showLoadingSpinner();
  try {
    const propertyUrl = `${baseUrl}/property/${propId}/animals`;
  
    await loadTotalAnimals(propertyUrl);
    await loadCategoryData(propertyUrl);
    await loadBreedData(propertyUrl);
    await loadGenderData(propertyUrl);

  } finally {
    hideLoadingSpinner();
  }
}

async function fetchData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function renderCustomLegend(legendContainerId, labels, backgroundColors) {
  const legendContainer = document.getElementById(legendContainerId);
  legendContainer.innerHTML = '';

  labels.forEach((label, index) => {
    const colorBox = document.createElement('span');
    colorBox.style.backgroundColor = backgroundColors[index];
    colorBox.style.width = '20px';
    colorBox.style.height = '20px';
    colorBox.style.display = 'inline-block';
    colorBox.style.marginRight = '2px';

    const labelText = document.createElement('span');
    labelText.innerText = label;

    const legendItem = document.createElement('div');
    legendItem.style.display = 'inline-flex';
    legendItem.style.alignItems = 'center';
    legendItem.style.marginRight = '5px';

    legendItem.appendChild(colorBox);
    legendItem.appendChild(labelText);
    legendContainer.appendChild(legendItem);
  });
}

function renderChart(canvasId, labels, data, title, chartType = 'bar') {
  const ctx = document.getElementById(canvasId).getContext('2d');

  if (charts[canvasId]) {
    charts[canvasId].destroy();
  }

  charts[canvasId] = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: borderColors.slice(0, labels.length),
        borderWidth: 2
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });

  renderCustomLegend(`${canvasId}Legend`, labels, backgroundColors.slice(0, labels.length));
}

function changeChartType(canvasId, newType) {
  const chart = charts[canvasId];
  if (chart) {
    const labels = chart.data.labels;
    const data = chart.data.datasets[0].data;
    const title = chart.data.datasets[0].label;
    renderChart(canvasId, labels, data, title, newType);
  }
}

async function loadCategoryData(propertyUrl) {
  const data = await fetchData(`${propertyUrl}/categories`);
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) {
    document.getElementById('categoryChartContainer').innerHTML = '<p>Não há categorias de animais para esta propriedade.</p>';
  } else {
    renderChart('categoryChart', labels, values, 'Quantidade por Categoria');
  }
}

async function loadBreedData(propertyUrl) {
  const data = await fetchData(`${propertyUrl}/breeds`);
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) {
    document.getElementById('breedChartContainer').innerHTML = '<p>Não há raças de animais para esta propriedade.</p>';
  } else {
    renderChart('breedChart', labels, values, 'Quantidade por Raça');
  }
}

async function loadGenderData(propertyUrl) {
  const data = await fetchData(`${propertyUrl}/genders`);
  const labels = Object.keys(data);
  const values = Object.values(data);

  if (labels.length === 0) {
    document.getElementById('genderChartContainer').innerHTML = '<p>Não há dados de sexo dos animais para esta propriedade.</p>';
  } else {
    renderChart('genderChart', labels, values, 'Quantidade por Sexo');
  }
}

async function loadTotalAnimals(propertyUrl) {
  const data = await fetchData(`${propertyUrl}/total`);
  const totalAnimalsElement = document.getElementById('totalAnimals');

  if (data.totalAnimals === 0) {
    totalAnimalsElement.textContent = 'Total de Animais: Nenhum animal encontrado.';
    hiddenVisibleCharts.style.display = 'none';
    
  } else {
    totalAnimalsElement.textContent = `Total de Animais: ${data.totalAnimals}`;
    hiddenVisibleCharts.style.display = 'block';
  }
}

document.querySelectorAll('.btnBar').forEach((e) => {
  e.addEventListener('click', () => {
    const chartContainer = e.closest('.chart-container');
    const canvas = chartContainer.querySelector('canvas');
    const canvasId = canvas.id;
    changeChartType(canvasId, 'bar');
  });
});

document.querySelectorAll('.btnPie').forEach((e) => {
  e.addEventListener('click', () => {
    const chartContainer = e.closest('.chart-container');
    const canvas = chartContainer.querySelector('canvas');
    const canvasId = canvas.id;
    changeChartType(canvasId, 'pie');
  });
});

document.querySelectorAll('.btnLine').forEach((e) => {
  e.addEventListener('click', () => {
    const chartContainer = e.closest('.chart-container');
    const canvas = chartContainer.querySelector('canvas');
    const canvasId = canvas.id;
    changeChartType(canvasId, 'line');
  });
});

// Carregar botões de propriedades ao carregar a página
window.onload = () => {
  createPropertyButtons();
};
