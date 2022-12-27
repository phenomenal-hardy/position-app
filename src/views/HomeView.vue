<script setup lang="ts">

import type { ValidationError } from '@/interfaces/validation-error';
import { ref, onMounted, type Ref } from 'vue';

// amcharts
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';


// apis
import apiDashboard from '@/api/dashboard';

// stores
import { useSessionStore } from '@/stores/session';


const sessionStore = useSessionStore();


// data
const date: Ref<string | undefined> = ref('2022-12-26');
const amount: Ref<number | undefined> = ref(60);
const errors: Ref<ValidationError[]> = ref([]);
const chartIsLoaded: Ref<boolean> = ref(false);
const saveButtonText: Ref<string> = ref('Agregar');
  



const chartData: Ref<{
  date: number,
  value: number
}[]> = ref([

  // test 

  /**
    { date: new Date(2022, 11, 1).getTime(), value: 8 },
    { date: new Date(2022, 11, 24).getTime(), value: 10 },
    { date: new Date(2022, 11, 25).getTime(), value: 12 },
    { date: new Date(2022, 11, 26).getTime(), value: 12 },
    { date: new Date(2022, 11, 26).getTime(), value: 1 },
    { date: new Date(2022, 11, 26).getTime(), value: 5 },
    */

]);

onMounted( async () => {

  await fetchDashboard();
  chartIsLoaded.value = true;

});

/**
 * handle para el submit
 */
const handleSubmit = async () => {

  // para probar la validacion por backend de laravel
  const validateFrontEnd = false;

  errors.value = [];

  if (validateFrontEnd) {

    if (!date.value) {
      errors.value.push({
        field: 'date',
        message: 'Seleccione una fecha'
      });

      return;
    }

    if (!amount.value) {
      errors.value.push({
        field: 'date',
        message: 'Ingrese un monto'
      });

      return;
    }

  }


  await saveUserInput();
}

/**
 * Agrega un valor al chat
 * @param date
 * @param amount 
 */
function addValueToChart(date: string, amount: number) {

  let splitDate = date.split('-');

  chartData.value.push({
    date: new Date(
      Number(splitDate[0]),
      Number(splitDate[1]) - 1, // meses parten indice 0
      Number(splitDate[2])
    ).getTime(),
    value: amount
  })
}

/**
 * Guarda el input del usuario
 */
async function saveUserInput() {

  errors.value = [];
  saveButtonText.value = 'Guardado datos, espere por favor ...';

  apiDashboard.saveUserInput({
    userId: sessionStore.authUserId,
    chartDate: date.value,
    chartAmount: amount.value
  }).then(async (res) => {

    // guardamos el input luego actualizamos el dashboard
    await fetchDashboard();

    // reset
    date.value = undefined;
    amount.value = undefined;

    saveButtonText.value = 'Agregar';

  }).catch((error) => {

    // reset
    saveButtonText.value = 'Agregar';

    // error de validacion de laravel
    if (error.response.status === 422) {

      if ('errors' in error.response.data) {

        let errorObj: {
          
        } = error.response.data.errors;

        for (const [key, value] of Object.entries(errorObj)) {


          let arrMessage: string[] = value as string[];

          console.log(`${key}: ${value}`);

          // value es un array de mensajes
          for(let k = 0; k < arrMessage.length; k++) {

              errors.value.push({
              field: key,
              message: arrMessage[k]
            });
          }
          
        }
      }

    }

    console.warn(error);
  });


}

/**
 * actualiza el dashboard
 */
async function fetchDashboard() {

  apiDashboard.fetchDashboard({
    userId: sessionStore.authUserId
  }).then((res) => {

    // reset
    chartData.value = [];

    let results: {
      id: number,
      user_id: number,
      chart_date: string,
      chart_amount: number
    }[] = res.data.results;


    for (let i = 0; i < results.length; i++) {

      addValueToChart(results[i].chart_date, results[i].chart_amount);
    }

    createChart("chartDiv");
  })
}


function maybeDisposeRoot(divId: string) {
  am5.array.each(am5.registry.rootElements, function (root) {
    if (root.dom.id == divId) {
      root.dispose();
    }
  });
}



function createChart(divId: string) {

  // Dispose previously created Root element
  maybeDisposeRoot(divId);

  // Create root element
  // https://www.amcharts.com/docs/v5/getting-started/#Root_element
  var root = am5.Root.new(divId);

  // Set themes
  // https://www.amcharts.com/docs/v5/concepts/themes/
  root.setThemes([
    am5themes_Animated.new(root)
  ]);



  // Create chart
  // https://www.amcharts.com/docs/v5/charts/xy-chart/
  var chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: "panX",
      wheelY: "zoomX"
    })
  );

  var easing = am5.ease.linear;

  // Create axes
  // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  var xAxis = chart.xAxes.push(
    am5xy.DateAxis.new(root, {
      maxDeviation: 0.1,
      
      groupData: false,
      baseInterval: {
        timeUnit: "day",
        count: 1
      },
      renderer: am5xy.AxisRendererX.new(root, {
        minGridDistance: 50
      }),
      tooltip: am5.Tooltip.new(root, {})
    })
  );


  var yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      maxDeviation: 0.1,
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  var label1 = am5.Label.new(root, {
  rotation: -90,
  text: "Monto $",
  y: am5.p50,
  centerX: am5.p50
  //x: am5.p0,
  //centerY: am5.p0
})

  yAxis.children.unshift(
    label1
  );



  // Add series
  // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  var series = chart.series.push(
    am5xy.LineSeries.new(root, {
      minBulletDistance: 10,

      name: 'Series',


      xAxis: xAxis,
      yAxis: yAxis,      
      
      valueYField: "value",
      valueXField: "date",


      categoryXField: "date",
      stacked: true,

      tooltip: am5.Tooltip.new(root, {
        pointerOrientation: "horizontal",
        labelText: "Monto: ${valueY}"
      })
    })
  );

  series.strokes.template.setAll({
    strokeWidth: 3,
    strokeDasharray: [10,5]
  });
  series.fills.template.setAll({
    fillOpacity: 0.5,
    visible: true
  });

  series.data.setAll(chartData.value);

  series.bullets.push(function () {
    return am5.Bullet.new(root, {
      sprite: am5.Circle.new(root, {
        radius: 5,
        fill: series.get("fill"),
        stroke: root.interfaceColors.get("background"),
        strokeWidth: 2
      })
    });
  });

  // Add cursor
  // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
    xAxis: xAxis
  }));
  cursor.lineY.set("visible", false);

  // add scrollbar
  chart.set("scrollbarX", am5.Scrollbar.new(root, {
    orientation: "horizontal"
  }));

  // Make stuff animate on load
  // https://www.amcharts.com/docs/v5/concepts/animations/
  series.appear(1000, 100);
  chart.appear(1000, 100);
}


</script>
<template>
  <main>

    <v-form>
      <v-container>
        <v-row>

          <v-col cols="12" md="4">
            <v-alert v-for="(error, idx) in errors" v-bind:key="error.field" color="red lighten-2" dark>
              {{ error.message }}
            </v-alert>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field type="number" v-model="amount" label="Monto" required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-date-picker locale="es-Cl" v-model="date"></v-date-picker>
          </v-col>
          <v-col cols="1">
            <v-btn class="ma-2" @click="handleSubmit" outlined color="indigo">
              {{ saveButtonText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-row>
      <v-col cols="12" v-show="chartIsLoaded">
        <div id="chartDiv" style="height: 500px; background-color: white"></div>
      </v-col>
    </v-row>
  </main>
</template>
