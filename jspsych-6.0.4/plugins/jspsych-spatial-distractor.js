/*
 * Example plugin template
 */

jsPsych.plugins["spatial-distractor"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');


  plugin.info = {
    name: 'spatial-distractor',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      grid_size: {
        type: jsPsych.plugins.parameterType.INT, // INT, IMAGE, KEYCODE, STRING, FUNCTION, FLOAT
        default_value: 4,
        description: 'size of grid for stimuli.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      size_cells: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: 70,
        description: 'How long to show the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    // making matrix:
    var grid = trial.grid_size;
    var nothing = " "

    var matrix = [];
    for (var i=0; i<grid; i++){
      m1 = i;
      for (var h=0; h<grid; h++){
        m2 = h;
        matrix.push([m1,m2])
      }
    };
    paper_size = grid*trial.size_cells;

    display_element.innerHTML = `
      <div 
        class="jspsych-btn-grid"
        style= "position: relative; width:${paper_size}px; height:${paper_size}px; "
      />
    `;

    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        clear_display();
        end_trial();
      }, trial.trial_duration);
    }


    function clear_display(){
        display_element.innerHTML = '';
    }


    function end_trial() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = {
        //  rt: response.rt,
        //  accuracy: response.correct
      };

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

  };

  return plugin;
})();
