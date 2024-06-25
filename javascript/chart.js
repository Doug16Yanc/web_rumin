document.addEventListener('DOMContentLoaded', function () {
  const ctx = document.getElementById('myChart').getContext('2d');
  
  const dataBase = {
    Animais: [120, 115, 132, 140],
    Caprinos: [60, 57, 64, 75],
    Ovinos: [60, 58, 68, 65],
  };

  const labels = ['2022', '2023', '2024'];
  const colors = ['red', 'blue', 'green'];

  const datasets = Object.keys(dataBase).map((key, index) => ({
    label: key,
    data: dataBase[key],
    backgroundColor: colors[index],
  }));
  
  const chartConfig = {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: {
      responsive: true, 
      scales: {
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Quantitativo Animal',
        },
      },
    },
  }
  
  new Chart(ctx, chartConfig);
});
