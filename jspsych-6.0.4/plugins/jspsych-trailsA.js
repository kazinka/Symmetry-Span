/*
 * Example plugin template
 */

jsPsych.plugins["trailsA"] = (function() {

    var plugin = {};
  
    jsPsych.pluginAPI.registerPreload('visual-search-circle', 'target', 'image');
    jsPsych.pluginAPI.registerPreload('visual-search-circle', 'foil', 'image');
    jsPsych.pluginAPI.registerPreload('visual-search-circle', 'fixation_image', 'image');
  
  
    plugin.info = {
      name: 'trailsA',
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
          default: [],
          description: 'Record the correct array'
        },
        random_order: {
          type:jsPsych.plugins.parameterType.INT,
          default: [],
          description: 'Record the randomized array'
        }
      }
    }
  
  
    plugin.trial = function(display_element, trial) {
  
  // making matrix:
  var grid = trial.grid_size;
  var recalledGrid = [];
  var correctGrid = trial.correct_order
  var nRecalled = 0
  var nothing = " "
  var acc = 0
  
  function indexOfArray(val, array) {
    var
      hash = {},
      indexes = {},
      i, j;
    for(i = 0; i < array.length; i++) {
      hash[array[i]] = i;
    }
    return (hash.hasOwnProperty(val)) ? hash[val] : -1;
  };
  
  var divArray = []
  var ttArray = []
  var mistakes = []
  var ttArrayErrors = []

  recordClick = function(div, gridIndex){
    const boxValue = trial.random_order[gridIndex];
    const expectedValue = trial.correct_order[nRecalled];
    
    if (expectedValue === boxValue) {
      nRecalled += 1
      var tt = `#${div.getAttribute('id')}`
      display_element.querySelector(tt).className += '-responded';
      recalledGrid.push(boxValue);
      console.log(recalledGrid)
      ttArray.push(tt)
      divArray.push(div)
      if (nRecalled === trial.correct_order.length) {
        console.log('Last Box!')
        //record the end of the time
        //after_response(mistakes)
        //end the trial without button?
      }
      document.getElementById("message-box").innerText=''
    } else {
      //user feedback of mistaken click
      //collect where the mistakes were made
      //mistakes.push(nRecalled)
      //var tt = `#${div.getAttribute('id')}`
      //ttArrayErrors.push(tt)
      //send message that they have made a mistake and what number they were on
      const preamble = 'Wrong choice,';
      const suggestion = nRecalled === 0 ?
        `start with "${expectedValue}".` :
        `<br/> what comes after "${trial.correct_order[nRecalled - 1]}"?`;
      document.getElementById("message-box").innerHTML= `${preamble} ${suggestion}`;
    }
  }
  
  
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
    <div style="font-size:24">
      GO!
      <div id="message-box" style="font-size: 18px; color: firebrick; min-height: 60px; margin: 10px;" />
    </div>
    <div 
      id="jspsych-html-button-response-btngroup" 
      style= "position: relative; width: ${paper_size}px; height: ${paper_size}px;"
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
    style="display: inline-block; margin: ${30} ${30}" 
    id="jspsych-html-button-response-button"
  >
    Done
  </div>`;

  var start_time = Date.now();
  
  //remove the done button?
  display_element.querySelector('#jspsych-html-button-response-button').addEventListener('click', function(e){
        var acc = 0
        for (var i=0; i<correctGrid.length; i++){
          var id = indexOfArray(correctGrid[i], matrix)
          if (recalledGrid[i] == id){
            acc += 1
          }
        }
        console.log(acc)
        choice = 0
      console.log(indexOfArray(correctGrid[1], matrix), recalledGrid[1])
  after_response(acc);
  });
  
  var response = {
    rt: null,
    button: null
  };
  
  // function checkResponse(){
  //
  // }
  //
  function after_response(choice) {
    // measure rt
    var end_time = Date.now();
    var rt = end_time - start_time;
    var choiceRecord = choice;
    response.button = choice;
    response.rt = rt;
  
    // after a valid response, the stimulus will have the CSS class 'responded'
    // which can be used to provide visual feedback that a response was recorded
    //display_element.querySelector('#jspsych-html-button-response-stimulus').className += ' responded';
  
    // disable all the buttons after a response
    var btns = document.querySelectorAll('.jspsych-html-button-response-button button');
    for(var i=0; i<btns.length; i++){
      //btns[i].removeEventListener('click');
      btns[i].setAttribute('disabled', 'disabled');
    }
  
    clear_display();
      end_trial();
  };
  
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
      rt: response.rt,
      recall: recalledGrid,
      stimuli: correctGrid,
      accuracy: response.button}
  
    // move on to the next trial
    jsPsych.finishTrial(trial_data);
  }
  };
  
    return plugin;
  })();