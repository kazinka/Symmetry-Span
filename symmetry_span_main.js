 /*
        This is a web-based symmetry span working memory test.
        It is modelled after the operation span test described in Oswald et al (2014) [https://link.springer.com/article/10.3758/s13428-014-0543-2].
        However, users can easily customize this test for their own purposes.
        Easily customizable variables have been listed below. For further changes to the test, knowledge of JavaScipt may be required.

        For smooth functioning of the test, make sure all the associated github files within the repository have been downloaded (especially the folder named 'jspsych-6.0.4').
        Results from this test will be automatically downloaded into the downloads folder of your desktop.

        For further details, please refer to the README.
    */

    //----- CUSTOMIZABLE VARIABLES -----------------------------------------

    minSetSize = 3 // starting length of each trial (i.e., min number of letters in a trial)
    maxSetSize = 5 // ending length of each trial (i.e., max number of letters in a trial)
    repSet = 2 // number of times each set size should be repeated
    randomize = true // present different set sizes in random order. if false, set sizes will be presented in ascending order
    file_name = null // file name for data file. if null, a default name consisting of the participant ID and a unique number is chosen.
    local = false // save the data file locally.
                // If this test is being run online (e.g., on MTurk), true will cause the file to be downloaded to the participant's computer.
                // If this test is on a server, and you wish to save the data file to that server, change this to false.
                // If changed to false, ensure that the php file (its in the directory!) and the empty "data" folder has also been appropriately uploaded to the server.
                // In case of problems, feel free to contact me :)

  //----------------------------------------------------------------------
  var repo_site = "https://kazinka.github.io/Symmetry-Span/"

  var setSizes = []    // different set sizes
  for (var i = minSetSize; i<= maxSetSize; i++){
    for (var r = 1; r<= repSet; r++){
      setSizes.push(i)
    }
  }

  var gridSize = 4;
  var matrix = [];
  for (var i=0; i<gridSize; i++){
    m1 = i;
    for (var h=0; h<gridSize; h++){
      m2 = h;
      matrix.push([m1,m2])
    }
  };

  var nTrials = setSizes.length
  if (randomize){
    setSizes = jsPsych.randomization.sampleWithoutReplacement(setSizes, nTrials)} // shuffle through the set sizes

  var squaregridDemoArray = [3,4]
  var fullDemoArray = [3,4]
  var nPracticeTrials = squaregridDemoArray.length //number of practice trials for square memorization
  var nfullDemo = fullDemoArray.length
  let nPreTrials = nPracticeTrials + nfullDemo

  var setSizes = squaregridDemoArray.concat(fullDemoArray, setSizes)
  var totalTrials = setSizes.length //total number of trials in the entire task
  var n = 0 //keeps track of number of trials gone by

  var selection = jsPsych.randomization.sampleWithoutReplacement(matrix, setSizes[n])
  var selection_id = -1  //keeps track of recall items within a test stack

  var nSymmetryAcc = 0 //feedback
  var nSquaresRecalled = 0 //feedback

  var pre_if_trial = {
    type: ["html-button-response"],
    stimulus: '<div class="responsive-text"> We will now go through the task instructions. Would you like to read or skip the instructions?<br></br> If this is your first time doing the task, please read the instructions.</div>',
    choices: ["read instructions", "skip instructions"],
    response_ends_trial: true,
    on_finish: function(){
      var data = jsPsych.data.get().last(1).values()[0];
      if(jsPsych.pluginAPI.compareKeys(data.accuracy, '1')){
        console.log("skipped instructions")
        n+=nPreTrials
        selection = jsPsych.randomization.sampleWithoutReplacement(matrix, setSizes[n])
      } else if (jsPsych.pluginAPI.compareKeys(data.accuracy, '0')){
        console.log("read instructions")
        n+=nPracticeTrials
        jsPsych.addNodeToEndOfTimeline({ timeline: [instructions, squaresDemo]}, function() {});
      }
      jsPsych.addNodeToEndOfTimeline(instructions4, function() {});
      jsPsych.addNodeToEndOfTimeline(test_procedure, function() {});
      jsPsych.addNodeToEndOfTimeline({
        type: 'fullscreen',
        fullscreen_mode: false
      }, function() {});
    }
  };
  var instructions = {
      type: 'instructions',
      pages: function(){
        pageOne = `
        <div 
          class="responsive-text"
        >
        <b>INSTRUCTIONS</b>
        <br><br><br>
        This is the symmetry span task. 
        <br><br>
        This task involves square memorization.
        <br><br><br>
      </div>
      `
        pageTwo = `
        <div 
          class="responsive-text"
        >
            We will first practice SQUARE MEMORIZATION.
            <br><br>
            You will see a grid of squares on the screen.
            <br>
            Several squares will turn red one at a time (around 3 to 6 in a trial).
            <br>
            Try to remember which squares turned red and the order in which they turned red.
            <br><br>
            Below is an example of the grid with one square colored red. 
            <br><br> 
            <img 
                src="${repo_site}img/symmetrySpanExampleGrid.png" 
                style="height:auto; max-width:90%; max-height:400px">
            </img>
        </div>
        `
        pageThree = `
        <div 
          class="responsive-text"
        >
            After this, you will be shown an empty grid.
            <br>
            Your task is to select the squares that turned red in their correct presentation order. 
            <br><br>
            Click on the square to select the appropriate squares. 
            <br>
            If you make a mistake use the provided "Backspace" button to clear your last response. 
            <br><br>
        </div>
        `
        pageFour = `
        <div 
          class="responsive-text"
        >
            Remember, it is important that you select the squares in the order that you saw them.
            <br> 
            So if you forget one of the squares, guess the best you can for that one, and select the rest in their correct order.
            <br><br>
            Press "Next" for practice trials.
            <br><br>
        </div>
        `
        return [pageOne, pageTwo, pageThree, pageFour]
      },
      allow_backward: false,
      button_label_next: "Next",
      show_clickable_nav: true
    }

    var instructions2 = {
      type: 'instructions',
      pages: function(){
        pageOne = `
        <div 
          class="responsive-text"
        >
            We will now practice SYMMETRY IMAGES.
            <br><br>
            A black and white picture will appear on the screen briefly. You do not need to respond.
            <br>
            <br>
            Below are examples of symmetrical and asymmetrical pictures you will see:
            <br> 
            <img 
                src="${repo_site}img/symm_instructions.png" 
                style="height:auto; max-width:90%; max-height:400px">
            </img>
            <br><br>
            Press "Next" to start practicing rounds combining the black and white image with the red squares you need to remember.
        </div>
        `
        return [pageOne]
      },
      allow_backward: false,
      button_label_next: "Next",
      show_clickable_nav: true
    }

  var instructions3 = {
    type: 'instructions',
    pages: function(){
      pageOne = `
      <div 
        class="responsive-text"
      >
        We will now practice the two tasks together.
        <br><br>
        In the next practice set, you will first be presented with a red colored square.
        <br>
        Try and remember the position of that colored square.
        <br>
        After the colored square dissapears, you will be asked to make a symmetry judgement of a black and white picture.
        <br><br>
        Try making the symmetry judgement as soon as possible.
        <br>
        Each symmetry judgement picture will be presented for only 6 seconds.
        <br><br>
      </div>
      `
      pageTwo = `
      <div 
        class="responsive-text"
      >
        After the symmetry judgement, you will be shown another colored square to remember,
        <br>
        which will be followed by another symmetry judgement.
        <br><br>
        Therefore, colored square presentations and symmetry judgements will alternate.
        <br>
        After 3 to 6 squares have been presented, the recall grid will appear.
        <br>
        Use the mouse to select the presented squares in their correct order.
        <br><br>
        Press "Next" to start practice rounds.
        <br><br>
      </div>
      `
      return [pageOne, pageTwo]
    },
    allow_backward: false,
    button_label_next: "Next",
    show_clickable_nav: true
  }

  var instructions4 = {
    type: 'instructions',
    pages: function(){
      pageOne = `
      <div 
        class="responsive-text"
      >
      We have finished with the practice trials.
      <br><br>
      We will now start with the main trials. 
      <br>
      A blank square will be cover the grid after each red square is displayed. 
      <br>
      After 3 to 6 squares have been presented, the recall grid will appear.
      <br><br>
      Press "Next" to start the trials.
      <br><br>
    </div>
    `
      return [pageOne]
    },
    allow_backward: false,
    button_label_next: "Next",
    show_clickable_nav: true
  }


  var nProportionDemo = 0
  var cog_load_demo = {
    type: 'spatial-distractor',
    grid_size: 4,
    trial_duration: 1000,
    proportion: function(){
      nProportionDemo += 1
      if (nProportionDemo == 1){
        return 1
      } else if (nProportionDemo == 2 ){
        return 0
      } else {
        return 0.5
      }
    }
  }

  var cog_load = {
    type: 'spatial-distractor',
    grid_size: 4, 
    trial_duration:1000,
    on_finish: function(){
      // var acc = jsPsych.data.get().last(1).values()[0].accuracy;
      // if (acc==1){
      //   nSymmetryAcc+=1
      // }
    }
  }

  var test_stimuli = {
    type: 'spatial-span',
    grid_size: function(){
      return gridSize
    },
    trial_duration:1000,
    selected_box: function(){
      selection_id+=1
      return selection[selection_id]
    }
  }

  var end_test_stimuli = {
    type: 'spatial-span',
    grid_size: function(){
      return gridSize
    },
    trial_duration: 0,
    selected_box: function(){
      return selection[selection_id]
    },
    display_red_box: false,
    on_finish: function(){
      if (selection_id+1>=selection.length){
          jsPsych.endCurrentTimeline()
      }
    }
  }

  var recall = {
    type: 'spatial-span-recall',
    grid_size: function(){
      return gridSize },
    correct_order: function(){
      return selection },
    data: function(){
      return {set_size: setSizes[n]}  },
    on_finish: function(){
      nSquares = setSizes[n]
      nSquaresRecalled = jsPsych.data.get().last(1).values()[0].accuracy;
      n+=1
      selection = jsPsych.randomization.sampleWithoutReplacement(matrix, setSizes[n])
      selection_id = -1
    }
  }

  var feedback = {
    type: 'instructions',
    pages: function(){
      pageOne = `
      <div   class="responsive-text">
        <b>
            You recalled 
            <font color='blue'>
                ${nSquaresRecalled}
                out of 
                ${nSquares}
            </font> 
            squares in their correct order.
        </b>
        <br><br>
      `
      if (n>nPreTrials){
        let nTest = n - nPreTrials
        pageOne+= `
          Completed 
          ${nTest} 
          out of 
          ${nTrials} 
          trials. 
          </div>
        `
      }

      return [pageOne]
    },
    allow_backward: false,
    button_label_next: "Next Trial",
    show_clickable_nav: true,
    on_finish: function(){
      nSymmetryAcc = 0
    }
  }

  var feedbackSymm = {
    type: 'html-keyboard-response',
    stimulus: function(){
      var text = ""
      var accuracy = jsPsych.data.get().last(1).values()[0].accuracy
      if (accuracy==1){
        text += '<div style="font-size:35px; color:rgb(0 220 0)"><b>Correct</div>'
      } else{
        text += '<div style="font-size:35px; color:rgb(240 0 0)"><b>Incorrect</div>'
      }
      //text += '<div style="font-size:30px; color:rgb(0 0 0)"><br><br>New trial starting now.</div>'
      return text
    },
    choices: jsPsych.NO_KEYS,
    trial_duration: 1000
  }

  // var conclusion = {
  //   type: 'html-keyboard-response',
  //   stimulus: function(){
  //     return '<div style="font-size:20px;">This task is over.<br><br>Thank you for your participation in this task. <br><br></div>'
  //   },
  //   choices: jsPsych.NO_KEYS
  // }

  // var p_details = {
  //   type:"survey-text",
  //   questions: [{prompt: "Enter subject number"}],
  //   on_finish:function(){
  //     partN = jsPsych.data.get().last(1).values()[0].partNum
  //     partN = partN.replace(/['"]+/g,'')
  //     //console.log(partN[0])
  //   }
  // }

  // function saveData(filename, filedata){
  //   $.ajax({
  //     type:'post',
  //     cache: false,
  //     url: 'save_data.php', // this is the path to the above PHP script
  //     data: {filename: filename, filedata: filedata}
  //   });
  // };

  var IDsub = Date.now()
  // var dataLog = {
  //   type: 'html-keyboard-response',
  //   stimulus: " ",
  //   trial_duration: 100,
  //   on_finish: function(data) {
  //     var data = jsPsych.data.get().filter([{trial_type:'spatial-span-recall'}, {trial_type:'symmetry-judgement-task'}]);
  //       if (file_name == null){
  //         file_name = "WM_symmetry_span_"+partN+"_"+IDsub.toString()+".csv"}
  //       else{
  //         file_name += ".csv"
  //       }
  //       if (local){
  //         data.localSave('csv', file_name )
  //       } else {
  //         saveData(file_name, data.csv());
  //       }
  //   }
  // }

  var test_stack = {
    timeline: [test_stimuli, cog_load, end_test_stimuli],
    repetitions: 10
  }

  var test_procedure = {
    timeline: [test_stack, recall, feedback],
    repetitions: nTrials
  }

  var squaresDemoStack = {
    timeline: [test_stimuli, end_test_stimuli],
    repetitions: 10
  }

  var squaresDemo = {
    timeline: [squaresDemoStack, recall, feedback],
    repetitions: nPracticeTrials
  }

  var symmetryDemo = {
    timeline: [cog_load_demo, feedbackSymm],
    repetitions: 3
  }

  var fullDemo = {
    timeline: [test_stack, recall, feedback],
    repetitions: nfullDemo
  }

  timeline = []
  timeline.push({
    type: 'fullscreen',
    fullscreen_mode: true
  });

  timeline.push(pre_if_trial)
  // timeline.push(dataLog)
  // timeline.push(conclusion)
