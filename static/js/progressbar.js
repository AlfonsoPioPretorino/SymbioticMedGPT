//Progress Bar
$(document).ready(function () { 
    var currentGfgStep, nextGfgStep, previousGfgStep; 
    var opacity; 
    var current = 1; 
    var steps = $("fieldset").length; 
  
    setProgressBar(current); 
  

/*
    $(".next-step").click(function () { 
  
        currentGfgStep = $(this).parent(); 
        nextGfgStep = $(this).parent().next(); 
  
        $("#progressbar li").eq($("fieldset") 
            .index(nextGfgStep)).addClass("active"); 
  
        nextGfgStep.show(); 
        currentGfgStep.animate({ opacity: 0 }, { 
            step: function (now) { 
                opacity = 1 - now; 
  
                currentGfgStep.css({ 
                    'display': 'none', 
                    'position': 'relative'
                }); 
                nextGfgStep.css({ 'opacity': opacity }); 
            }, 
            duration: 500 
        }); 
        setProgressBar(++current); 
    });  */
    
    $('#next-step1').click(function () { 
        currentGfgStep = $('#next-step1').parent(); 
        nextGfgStep = $('#next-step1').parent().next(); 

        $("#progressbar li").eq($("fieldset") 
            .index(nextGfgStep)).addClass("active"); 

        nextGfgStep.show(); 
        currentGfgStep.animate({ opacity: 0 }, { 
            step: function (now) { 
                opacity = 1 - now; 
                currentGfgStep.css({ 
                    'display': 'none', 
                    'position': 'relative'
                }); 
                nextGfgStep.css({ 'opacity': opacity }); 
            }, 
            duration: 500 
        }); 
        setProgressBar(++current);
        console.log("SHOWnext");
        document.getElementById("fieldset2").hidden = false;
        showCBlist(grid.getData());
        });   
    


    $(".previous-step").click(function () { 
        
        currentGfgStep = $(this).parent(); 
        previousGfgStep = $(this).parent().prev(); 
  
        $("#progressbar li").eq($("fieldset") 
            .index(currentGfgStep)).removeClass("active"); 
  
        previousGfgStep.show(); 
  
        currentGfgStep.animate({ opacity: 0 }, { 
            step: function (now) { 
                opacity = 1 - now; 
  
                currentGfgStep.css({ 
                    'display': 'none', 
                    'position': 'relative'
                }); 
                previousGfgStep.css({ 'opacity': opacity }); 
            }, 
            duration: 500 
        }); 
        setProgressBar(--current);
    }); 
  
    function setProgressBar(currentStep) { 
        var percent = parseFloat(100 / steps) * current; 
        percent = percent.toFixed(); 
        $(".progress-bar") 
            .css("width", percent + "%") 
    } 
  
    $(".submit").click(function () { 
        return false; 
    }) 
}); 

function showProgress(){
        var progress = document.getElementById('progressbar');
        progress.style.display = "block";
    }

    //Check if the file is .csv 
    var file = document.getElementById('csv-file');

    file.onchange = function(e) {
    var ext = this.value.match(/\.([^\.]+)$/)[1];
    switch (ext) {
        case 'csv':

            break;
        default:
            alert('Insert a csv file');
            this.value = '';
        }
    };
    var csvFile = document.getElementById("csv-file");
    var visual_grid = document.getElementById("grid_csv");
    var next_step1 = document.getElementById("next-step1");
    var next_step2 = document.getElementById("next-step2");
    var csv_data = null;
    var csv_head = null;
    var flag = true;
    var FLAG_ALREADY_POP = false;
    //Handler for deletion of columns
    var deleteColsHandler = function(gridEvent){ 
        showCBlist(grid.getData());
    };

    
    //Listener for file input
    csvFile.onchange = function(e){
        //This will be done only once the csv is initialized
        if(flag){
            next_step1.style.display ='block';
            flag = false;
            document.getElementById("fieldset2").hidden = false;
        }
        var file = e.target.files[0];

            Papa.parse(file, {
            header: true,
            dynamicTyping: true,
            complete: function(results) {

                // overwrite grid with new data
                grid = new DataGridXL("grid", {
                    data: results.data
                });
                //Activation of delete listener
                grid.events.on('deletecols', deleteColsHandler);
                document.getElementById("fieldset2").hidden = true;
            }
            
        });
        
    }
    
    //Sending table data to backend
    var url = document.getElementById("progressbar").getAttribute('data-url');
    function sendData(){
        csv_data = grid.getData();
        console.log(grid.getData());
        $.ajax({ 
            type: "POST",
            url: url+'senddata',
            data: JSON.stringify({"table": csv_data, "indvariables": ["ciao"]}),
            success: function(data){        
                console.log(data);
            },
            error: function(err){
                console.log(err);
            }
            
        });
    }

    function redo(){
        grid.redo();
    }

    function undo(){
        grid.undo();
    }
    //Function showing the checkboxes
    function showCBlist(data){
        csv_head = Object.keys(data[0]);
        for(var i = 0; i < csv_head.length; i++) {
            if(FLAG_ALREADY_POP){
                document.getElementById("cblist").innerHTML = '';
                FLAG_ALREADY_POP = false;
            }
            document.getElementById("cblist").innerHTML += '<div class="form-check" required>\
                                                                <input id="cb" class="form-check-input" type="checkbox" value="'+csv_head[i]+'" id="flexCheckDefault" onchange="setVal()">\
                                                                    <label class="form-check-label text-left" for="flexCheckDefault"  style="margin-right:100%">\
                                                                    '+csv_head[i]+'\
                                                                    </label>\
                                                            </div>';
            if(i == csv_head.length-1){
                FLAG_ALREADY_POP = true;
            }
        }
    }


    var checkboxes = null;
    function setVal(){
        checkboxes = document.querySelectorAll('#cb');
        for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked){
                next_step2.style.display = "block";
                break;
            }
            if(i == checkboxes.length - 1){
                next_step2.style.display = "none";
            }
        }
    }