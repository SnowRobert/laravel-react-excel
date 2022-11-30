const labels = [
    "İstaç A.Ş","İgdaş A.Ş","Avrupa yakası Zabıta","Avrupa yakası Mezarlıklar",
    "Makine ikmal","Destek Hizmetleri","İsbak A.Ş","Anadolu yakası Zabıta",
    "Anadolu yakası Mezarlıklar","Ağaç A.Ş","İsfalt A.Ş",
];
export const garage_status_state = {
    labels: labels,
    datasets: [
      {
        label: 'Birim Garaj Sayisi',
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 2,
        data: labels.map(()=>0)
      }
    ]
  }