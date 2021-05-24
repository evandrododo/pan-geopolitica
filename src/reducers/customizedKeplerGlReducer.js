import keplerGlReducer from 'kepler.gl/reducers';

export const customizedKeplerGlReducer = keplerGlReducer
  .initialState({
    uiState: {
      // hide side panel to disallow user customize the map
      readOnly: false,

      // customize which map control button to show
      mapControls: {
        visibleLayers: {
          show: true
        },
        mapLegend: {
          show: true,
          active: true
        },
        toggle3d: {
          show: true
        },
        splitMap: {
          show: false
        }
      }
    }
  });