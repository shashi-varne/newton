// Function to create randomized data based on investment values
export const createGrowthData = (dataObj) => {
  const obj = {
    current_amount: [],
    invested_amount: [],
  };
  const percentages = [0.50, 0.60, 0.70, 0.80, 0.90, 1.00, 1.2, 1.3, 1.5];
  for (let dataOb of dataObj) {
    const { data } = dataOb;
    if (dataOb.id === 'current_amount') {
      data.map(point => obj[dataOb.id].push({
        x: point.date,
        y: point.value,
      }));
    } else {
      data.map((point, idx) => {
        const rand = Math.floor(Math.random() * Math.floor(9));

        obj[dataOb.id].push({
          x: point.date,
          y: obj['current_amount'][idx].y * percentages[rand],
        });
      });
    }
    
  }
  return [{
    id: 'current_amount',
    data: obj.current_amount,
  }, {
    id: 'invested_amount',
    data: obj.invested_amount,
  }];
};
export const genericErrMsg = 'Something went wrong. Please try again';

export const dummyAlloc = [{
  id: 'Large Cap',
  label: 'Large Cap',
  value: 43,
  "color": "#856cc1"
}, {
  id: 'Mid Cap',
  label: 'Mid Cap',
  value: 12,
  "color": "#7458b9",
}, {
  id: 'Small Cap',
  label: 'Small Cap',
  value: 45,
  "color": "#512ea7",
}];

const sectorObj = {
  "Others": "0.0698989",
    "Basic Materials": "0.422978",
      "Financial Services": "0.446535",
        "Healthcare": "0.771251",
          "Energy": "0.932876",
            "Technology": "0.969383",
              "Consumer Cyclical": "0.0211980",
                "Consumer Defensive": "0.0951220",
                  "Utilities": "1.08820",
                    "Real Estate": "0.0122845",
                      "Communication Services": "0.254756",
                        "Industrials": "0.390771"
};

export const dummySector = Object.entries(sectorObj).map(([key, val]) => ({
  'id': key,
  'label': key,
  'value': val,
}));

export const dummyGrowth = [
  {
    "id": "japan",
    "color": "hsl(224, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 24
      },
      {
        "x": "helicopter",
        "y": 29
      },
      {
        "x": "boat",
        "y": 280
      },
      {
        "x": "train",
        "y": 230
      },
      {
        "x": "subway",
        "y": 120
      },
      {
        "x": "bus",
        "y": 94
      },
      {
        "x": "car",
        "y": 193
      },
      {
        "x": "moto",
        "y": 129
      },
      {
        "x": "bicycle",
        "y": 41
      },
      {
        "x": "horse",
        "y": 121
      },
      {
        "x": "skateboard",
        "y": 34
      },
      {
        "x": "others",
        "y": 287
      }
    ]
  },
  {
    "id": "norway",
    "color": "hsl(61, 70%, 50%)",
    "data": [
      {
        "x": "plane",
        "y": 72
      },
      {
        "x": "helicopter",
        "y": 214
      },
      {
        "x": "boat",
        "y": 226
      },
      {
        "x": "train",
        "y": 292
      },
      {
        "x": "subway",
        "y": 149
      },
      {
        "x": "bus",
        "y": 246
      },
      {
        "x": "car",
        "y": 251
      },
      {
        "x": "moto",
        "y": 98
      },
      {
        "x": "bicycle",
        "y": 248
      },
      {
        "x": "horse",
        "y": 217
      },
      {
        "x": "skateboard",
        "y": 82
      },
      {
        "x": "others",
        "y": 293
      }
    ]
  }
];

export const growthObjYear = {
  "2019-09-10": {
    "current_amount": "26093.49",
    "invested_amount": "987458.99"
  },
  "2019-10-10": {
    "current_amount": "27185.95",
    "invested_amount": "1031359.08"
  },
  "2019-11-10": {
    "current_amount": "28554.45",
    "invested_amount": "1076859.06"
  },
  "2019-12-10": {
    "current_amount": "30825.13",
    "invested_amount": "1159459.04"
  },
  "2020-01-10": {
    "current_amount": "32266.00",
    "invested_amount": "1214258.98"
  },
  "2020-02-09": {
    "current_amount": "38632.30",
    "invested_amount": "1393234.06"
  },
  "2020-03-10": {
    "current_amount": "39894.76",
    "invested_amount": "1436134.03"
  },
  "2020-04-10": {
    "current_amount": "41624.31",
    "invested_amount": "1483234.01"
  },
  "2020-05-10": {
    "current_amount": "42750.94",
    "invested_amount": "1518334.07"
  },
  "2020-06-10": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-07-10": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-08-09": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  }
};

export const growthObj1mo = {
  "2020-07-15": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-17": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-20": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-22": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-25": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-27": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-07-30": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-08-01": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-08-04": {
    "current_amount": "0.00",
    "invested_amount": "1545434.07"
  },
  "2020-08-06": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-08-09": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-08-11": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
};

export const growthObj3mo = [
  {
    "data": [
      {
        "value": 44000.0,
        "date": "17-05-2020"
      },
      {
        "value": 44000.0,
        "date": "23-05-2020"
      },
      {
        "value": 44000.0,
        "date": "25-05-2020"
      },
      {
        "value": 44000.0,
        "date": "30-05-2020"
      },
      {
        "value": 44000.0,
        "date": "02-06-2020"
      },
      {
        "value": 44000.0,
        "date": "07-06-2020"
      },
      {
        "value": 44000.0,
        "date": "14-06-2020"
      },
      {
        "value": 44000.0,
        "date": "22-06-2020"
      },
      {
        "value": 44000.0,
        "date": "29-06-2020"
      },
      {
        "value": 44000.0,
        "date": "30-06-2020"
      },
      {
        "value": 44000.0,
        "date": "07-07-2020"
      },
      {
        "value": 44000.0,
        "date": "08-07-2020"
      },
      {
        "value": 44000.0,
        "date": "14-07-2020"
      },
      {
        "value": 44000.0,
        "date": "16-07-2020"
      },
      {
        "value": 44000.0,
        "date": "22-07-2020"
      },
      {
        "value": 44000.0,
        "date": "24-07-2020"
      },
      {
        "value": 44000.0,
        "date": "29-07-2020"
      },
      {
        "value": 44000.0,
        "date": "01-08-2020"
      },
      {
        "value": 44000.0,
        "date": "06-08-2020"
      },
      {
        "value": 44000.0,
        "date": "13-08-2020"
      }
    ],
    "id": "current_amount"
  },
  {
    "data": [
      {
        "value": 1545000.0,
        "date": "17-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "23-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "25-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "30-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "02-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "07-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "14-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "22-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "29-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "30-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "07-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "08-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "14-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "16-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "22-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "24-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "29-07-2020"
      },
      {
        "value": 1545000.0,
        "date": "01-08-2020"
      },
      {
        "value": 1545000.0,
        "date": "06-08-2020"
      },
      {
        "value": 1545000.0,
        "date": "13-08-2020"
      }
    ],
    "id": "invested_amount"
  }
];

export const growthObj6mo = {
  "2020-02-28": {
    "current_amount": "0.00",
    "invested_amount": "1401634.03"
  },
  "2020-03-14": {
    "current_amount": "40005.83",
    "invested_amount": "1439234.03"
  },
  "2020-03-29": {
    "current_amount": "40135.16",
    "invested_amount": "1445234.01"
  },
  "2020-04-13": {
    "current_amount": "41912.99",
    "invested_amount": "1492334.01"
  },
  "2020-04-28": {
    "current_amount": "42045.68",
    "invested_amount": "1498334.07"
  },
  "2020-05-13": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-05-28": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-06-12": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-06-27": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-07-12": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-07-27": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
  "2020-08-11": {
    "current_amount": "43787.49",
    "invested_amount": "1545434.07"
  },
};

export const growthObj3Year = [{
  "data": [
    {
      "value": 8000.0,
      "date": "28-09-2017"
    },
    {
      "value": 8000.0,
      "date": "14-11-2017"
    },
    {
      "value": 8000.0,
      "date": "17-11-2017"
    },
    {
      "value": 8000.0,
      "date": "06-01-2018"
    },
    {
      "value": 10000.0,
      "date": "13-02-2018"
    },
    {
      "value": 10000.0,
      "date": "25-02-2018"
    },
    {
      "value": 12000.0,
      "date": "16-04-2018"
    },
    {
      "value": 12000.0,
      "date": "15-05-2018"
    },
    {
      "value": 12000.0,
      "date": "05-06-2018"
    },
    {
      "value": 14000.0,
      "date": "25-07-2018"
    },
    {
      "value": 18000.0,
      "date": "14-08-2018"
    },
    {
      "value": 18000.0,
      "date": "13-09-2018"
    },
    {
      "value": 19000.0,
      "date": "02-11-2018"
    },
    {
      "value": 19000.0,
      "date": "14-11-2018"
    },
    {
      "value": 20000.0,
      "date": "22-12-2018"
    },
    {
      "value": 20000.0,
      "date": "13-02-2019"
    },
    {
      "value": 22000.0,
      "date": "01-04-2019"
    },
    {
      "value": 23000.0,
      "date": "15-05-2019"
    },
    {
      "value": 23000.0,
      "date": "21-05-2019"
    },
    {
      "value": 24000.0,
      "date": "10-07-2019"
    },
    {
      "value": 25000.0,
      "date": "14-08-2019"
    },
    {
      "value": 25000.0,
      "date": "29-08-2019"
    },
    {
      "value": 27000.0,
      "date": "18-10-2019"
    },
    {
      "value": 29000.0,
      "date": "14-11-2019"
    },
    {
      "value": 30000.0,
      "date": "07-12-2019"
    },
    {
      "value": 33000.0,
      "date": "26-01-2020"
    },
    {
      "value": 39000.0,
      "date": "13-02-2020"
    },
    {
      "value": 40000.0,
      "date": "16-03-2020"
    },
    {
      "value": 42000.0,
      "date": "05-05-2020"
    },
    {
      "value": 44000.0,
      "date": "14-05-2020"
    },
    {
      "value": 44000.0,
      "date": "24-06-2020"
    },
    {
      "value": 44000.0,
      "date": "13-08-2020"
    }
  ],
  "id": "current_amount"
},
  {
    "data": [
      {
        "value": 318000.0,
        "date": "28-09-2017"
      },
      {
        "value": 322000.0,
        "date": "14-11-2017"
      },
      {
        "value": 322000.0,
        "date": "17-11-2017"
      },
      {
        "value": 327000.0,
        "date": "06-01-2018"
      },
      {
        "value": 394000.0,
        "date": "13-02-2018"
      },
      {
        "value": 394000.0,
        "date": "25-02-2018"
      },
      {
        "value": 456000.0,
        "date": "16-04-2018"
      },
      {
        "value": 458000.0,
        "date": "15-05-2018"
      },
      {
        "value": 486000.0,
        "date": "05-06-2018"
      },
      {
        "value": 510000.0,
        "date": "25-07-2018"
      },
      {
        "value": 602000.0,
        "date": "14-08-2018"
      },
      {
        "value": 620000.0,
        "date": "13-09-2018"
      },
      {
        "value": 640000.0,
        "date": "02-11-2018"
      },
      {
        "value": 644000.0,
        "date": "14-11-2018"
      },
      {
        "value": 685000.0,
        "date": "22-12-2018"
      },
      {
        "value": 727000.0,
        "date": "13-02-2019"
      },
      {
        "value": 806000.0,
        "date": "01-04-2019"
      },
      {
        "value": 861000.0,
        "date": "15-05-2019"
      },
      {
        "value": 863000.0,
        "date": "21-05-2019"
      },
      {
        "value": 917000.0,
        "date": "10-07-2019"
      },
      {
        "value": 962000.0,
        "date": "14-08-2019"
      },
      {
        "value": 964000.0,
        "date": "29-08-2019"
      },
      {
        "value": 1041000.0,
        "date": "18-10-2019"
      },
      {
        "value": 1103000.0,
        "date": "14-11-2019"
      },
      {
        "value": 1124000.0,
        "date": "07-12-2019"
      },
      {
        "value": 1225000.0,
        "date": "26-01-2020"
      },
      {
        "value": 1400000.0,
        "date": "13-02-2020"
      },
      {
        "value": 1444000.0,
        "date": "16-03-2020"
      },
      {
        "value": 1506000.0,
        "date": "05-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "14-05-2020"
      },
      {
        "value": 1545000.0,
        "date": "24-06-2020"
      },
      {
        "value": 1545000.0,
        "date": "13-08-2020"
      }
    ],
    "id": "invested_amount"
}];