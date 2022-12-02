/*
 * Example plugin template
 */

jsPsych.plugins["trails"] = (function() {

  var plugin = {};
  
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
  jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');


  plugin.info = {
    name: 'trails',
    description: '',
    parameters: {
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
        pretty_name: 'Size cells',
        default: 70,
        description: 'How long to show the trial.'
      },
      correct_order: {
        type:jsPsych.plugins.parameterType.INT,
        default: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        description: 'Record the correct array'
      },
      random_order: {
        type:jsPsych.plugins.parameterType.INT,
        default: [1, 15, 7, 3, 13, 9, 11, 5, 14, 2, 10, 8, 16, 4, 6, 12],
        description: 'Record the randomized array'
      },
      trails_type: {
        type:jsPsych.plugins.parameterType.INT,
        default: [],
        description: 'Record the trial type A or B'
      }
    }
  }


  plugin.trial = function(display_element, trial) {

    // making matrix:
    var gridSize = trial.grid_size;
    var selectedGrid = [];
    var nResponse = 0
  
    // check and record responses:
    var divArray = []
    var ttArray = []
    //var mistakes = []
    var missBoxValue = []
    var missExpectedValue = []
    var missGridIndex = []
    var missExpectedGridIndex = []
    var missDistance = []

    function indexToCoordinates(index) {
      var x = index % gridSize;
      var y = Math.floor(index/gridSize);
      return [x, y];
    }

    function coordDistance(coord1,coord2) {
      var xDist = coord1[0] - coord2[0];
      var yDist = coord1[1] - coord2[1];
      return Math.round(Math.sqrt(Math.pow(xDist,2) + Math.pow(yDist,2))*1000)/1000
    }

    recordClick = function(div, gridIndex){
      const boxValue = trial.random_order[gridIndex];
      const expectedValue = trial.correct_order[nResponse];
      const expectedGridIndex = trial.random_order.indexOf(expectedValue);
      const gridCoord = indexToCoordinates(gridIndex);
      const expectedGridCoord = indexToCoordinates(expectedGridIndex);
      const distance = coordDistance(gridCoord,expectedGridCoord);
      
      if (expectedValue === boxValue) {
        nResponse += 1
        var tt = `#${div.getAttribute('id')}`
        display_element.querySelector(tt).className += '-responded';
        selectedGrid.push(boxValue);
        console.log(selectedGrid)
        ttArray.push(tt)
        divArray.push(div)
        document.getElementById("message-box").innerText=''
        if (nResponse === trial.correct_order.length) {
          console.log('Last Box!')
          console.dir(missBoxValue)
          //end the trial
          after_response()
        } 
      } else {
        //collect information on mistakes made
        // mistakes.push({
        //   boxValue,
        //   expectedValue,
        //   gridIndex,
        //   expectedGridIndex,
        //   distance,
        // })

          missBoxValue.push(boxValue)
          missExpectedValue.push(expectedValue)
          missGridIndex.push(gridIndex)
          missExpectedGridIndex.push(expectedGridIndex)
          missDistance.push(distance)
        //send message that they have made a mistake and what number they were on
        const preamble = 'Wrong choice,';
        const suggestion = nResponse === 0 ?
          `start with "${expectedValue}".` :
          `<br/> what comes after "${trial.correct_order[nResponse - 1]}"?`;
        document.getElementById("message-box").innerHTML= `${preamble} ${suggestion}`;
      }
    }
    
    
    var matrix = [];
    for (var i=0; i<gridSize; i++){
      m1 = i;
      for (var h=0; h<gridSize; h++){
        m2 = h;
        matrix.push([m1,m2])
      }
    };

    paper_size = gridSize*trial.size_cells;
  
    display_element.innerHTML = `
      <div style="font-size:24">
        GO!
        <div id="message-box" style="font-size: 18px; color: firebrick; min-height: 60px; margin: 10px;" />
      </div>
      <div 
        id="jspsych-html-button-response-btngroup" 
        style= "position: relative; width: ${paper_size}px; height: ${paper_size}px; margin-left: 10px"
      />
    `

    var paper = display_element.querySelector("#jspsych-html-button-response-btngroup");

    for (var i=0; i<matrix.length; i++) {
      paper.innerHTML += `
        <div
          class="jspsych-btn-grid"
          style="position: absolute; top:${matrix[i][0]*(trial.size_cells-3)}px; left:${matrix[i][1]*(trial.size_cells-3)}px;"
          id="jspsych-spatial-span-grid-button-${i}"
          onclick="recordClick(this,${i})"
        >
          ${trial.random_order[i]}
        </div>
      `;
    }
    display_element.innerHTML += `
      <div 
        class="jspsych-btn-numpad" 
        style="display: inline-block; margin: ${30}px ${30}px;" 
        id="jspsych-html-button-response-button"
      >
        Done
      </div>
    `;

    var startTime = Date.now();
    
    //remove the done button?
    display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
      console.log(nResponse)
      after_response();
    });
    
    function after_response() {
      // measure rt
      var endTime = Date.now();
      var rt = endTime - startTime;
    
      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';
    
      // disable all the buttons after a response
      // var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
      // for(var i=0; i<btns.length; i++){
      //   //btns[i].removeEventListener('click');
      //   btns[i].setAttribute('disabled', 'disabled');
      // }
    
      end_trial(rt);
    };
    
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }
    
    
    function end_trial(rt = null) {
      display_element.innerHTML = '';
    
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();
    
      // gather the data to store for the trial
      var trial_data = {
        rt,
        randomOrder: trial.random_order,
        missBoxValue,
        missExpectedValue,
        missGridIndex,
        missExpectedGridIndex,
        missDistance,
        gridSize: trial.grid_size,
        trailsType: trial.trails_type
      }
    
      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    }
  };
  
  return plugin;
})();