
// Retrieve Qualtrics object and save in qthis
var qthis = this;

// Hide buttons
qthis.hideNextButton();

var task_github = "https://pages.github.umn.edu/kazin003/Symmetry-Span/"; // https://<your-github-username>.github.io/<your-experiment-name>

// requiredResources must include all the JS files that .html uses.
var requiredResources = [
    task_github + "jspsych-6.0.4/jspsych.js",
    task_github + "jspsych-6.0.4/plugins/jspsych-html-keyboard-response.js",
    task_github + "jspsych-6.0.4/plugins/jspsych-survey-text.js",
    task_github + "jspsych-6.0.4/plugins/jspsych-instructions.js",
    task_github + "jspsych-6.0.4/plugins/jspsych-fullscreen.js",
    task_github + "jspsych-6.0.4/plugins/jspsych-trails.js",
    task_github + "https://cdn.jsdelivr.net/npm/jstat@latest/dist/jstat.min.js",
    task_github + "https://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js",
    task_github + "grid_trailsAB_main.js"
];

function loadScript(idx) {
    console.log("Loading ", requiredResources[idx]);
    jQuery.getScript(requiredResources[idx], function () {
        if ((idx + 1) < requiredResources.length) {
            loadScript(idx + 1);
        } else {
            initExp();
        }
    });
}

if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
    loadScript(0);
}

// jQuery is loaded in Qualtrics by default
jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
jQuery("<div id = 'display_stage'></div>").appendTo('body');

function initExp(){
    /* start the experiment*/
    jsPsych.init({
        timeline: timeline,
        /* Change 1: Using `display_element` */
        display_element: 'display_stage',
        on_finish: function() {
            jsPsych.data.displayData(); // comment out if you do not want to display results at the end of task
            /* Change 5: Summarizing and save the results to Qualtrics */
            // summarize the results
            var data = jsPsych.data.get().filter([{trial_type:'trails'}]);

            // save to qualtrics embedded data
            Qualtrics.SurveyEngine.setEmbeddedData("data", data);
            /* Change 6: Adding the clean up and continue functions.*/
            // clear the stage
            jQuery('#display_stage').remove();
            jQuery('#display_stage_background').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        }
      }); 
    }