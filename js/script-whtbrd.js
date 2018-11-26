$(function() {

    let isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

    if(isMobile) {

        $('body').html("<p style='padding: 10px; font-size: 18px;'>"
                        + "<i class='fas fa-mobile-alt' style='font-size: 20px;'></i>&nbsp;&nbsp;"
                        + "<span style='color: #0e92a2'>Box of Noodles</span> doesn't work on mobile devices.</p>");

    } else {

    // Arrows fadeout
        if(!localStorage.length || localStorage.length === 1) {
            $('.arrow').removeClass('hidden');
            setTimeout(function() {
                $('.arrow').fadeOut(500);
            }, 1000);
        }

    // Render all Noodles
        renderAllNoodles();

    // Set variables
        const whiteboard = $( '#whiteboard' );
        let code = $( '.noodle .code' );
        let description = $( '.noodle-description' );
        let toggleNew = $( '#show-add-form' );
        let addNoodleForm = $( '#add-noodle-form' );

    // Toggle "Add New" form
        toggleNew.click(function(e) {
            e.stopPropagation();
            toggleNew.toggleClass('active');
            addNoodleForm.toggleClass('hidden');
        });

        addNoodleForm.click(function(e) {
            e.stopPropagation();
        });

    // Body on Click
        $('body').click(function() {
            addNoodleForm.addClass('hidden');
            toggleNew.removeClass('active');
            toggleClearMenu(true);

            for (i = 0; i < $('.noodle').length; i++) {
                let currentNoodle = $($('.noodle')[i]);  // get jQuery object from DOM element
                let noodleID = currentNoodle.attr('data-id');
                let noodleObject = getNoodleObject(noodleID);

                if(currentNoodle.attr('contenteditable') === 'true') {

                    noodleObject.heading = currentNoodle.find('.noodle-heading').text();
                    noodleObject.description = currentNoodle.find('.noodle-description').text();
                    noodleObject.codeEx = currentNoodle.find('.code span').text();
                    saveNoodle(noodleObject);

                    currentNoodle.css('cursor', 'grab');
                    currentNoodle.removeClass('editable');
                    currentNoodle.draggable({ disabled: false });
                    currentNoodle.attr('contenteditable', 'false');
                }
            }

        });

    // Noodle on hover
        whiteboard.on({
            mouseenter: function() {
                if ($(this).attr('data-opened') === 'false') {
                    $(this).addClass('big-font');
                }
            },
            mouseleave: function() {
                if ($(this).attr('data-opened') === 'false') {
                    $(this).removeClass('big-font');
                }
            }
        }, '.noodle');

    // Noodle on click
        whiteboard.on('click', '.noodle', function(event) {

            event.stopPropagation();
            let currentNoodle = $(this);

            if (event.ctrlKey) {    // ctrl pressed

                // Make editable
                $(this).css('cursor', 'auto');
                $(this).addClass('editable');
                $(this).draggable({ disabled: true });
                $(this).attr('contenteditable', 'true');
                $(this).find('.noodle-heading').focus();

            } else {            // ctrl not pressed

                if($(this).attr('contenteditable') === 'false') {
                    toggleOpen(currentNoodle);
                }

            }

        });

    // Create new Noodle
        $('#create').on('click', function() {
            let theHeading = $( '#add-heading' );
            let theDescription = $( '#add-description' );
            let theCode = $( '#add-code' );

            if (theHeading.val()) {

                let currentCounter = localStorage.getItem('counter') ? Number(localStorage.getItem('counter')) + 1 : 1;
                addNoodleForm.addClass('hidden');
                let cleanCode = escapeHtml(theCode.val());
                let preCode = cleanCode.replace(/\n/g, '<br>\n').replace(/ /g, '&nbsp;');
                let cleanHeading = escapeHtml(theHeading.val());
                let cleanDescription = escapeHtml(theDescription.val());

                let noodleObject = new Noodle(currentCounter, cleanHeading, cleanDescription, preCode, false);

                saveNoodle(noodleObject);
                renderNoodle(noodleObject);
                localStorage.setItem('counter', noodleObject.noodleID);

                addNoodleForm.find(':input').val('');
                toggleNew.removeClass('active');

            } else {
                alert('Noodles must have headings!');
            }

        });

    // Delete Noodle
        $('#trashcan').droppable({
            accept: '.noodle',
            classes: {
                'ui-droppable-hover': 'highlight'
            },
            tolerance: 'pointer',
            drop: function(event, ui) {
                ui.draggable.attr('data-dropped', true);
                let noodleId = ui.draggable.attr('data-id');
                confirmDelete(noodleId);
            }
        });

    // Clear All

        // Show / hide Clear menu (Trashcan on hover)
        $('body').on({
            mouseenter: function() {
                $(this).addClass('highlight');
            },
            mouseleave: function() {
                $(this).removeClass('highlight');
            }
        }, '#trashcan');

        $('body').on('click', '#trashcan', function(e) {
            e.stopPropagation();
            let isClicked = JSON.parse($(this).attr('data-menu'));
            toggleClearMenu(isClicked);
        });

        // Clear Noodles
        $('body').on('click', '#clear-btn', function() {
            if(!localStorage.length || localStorage.length === 1) {
                alert('Box of Noodles is already empty');
            } else {
                confirmClear();
            }
        });

    // Load demo content
        $('#load-demo-btn').click(function(e) {
            e.preventDefault();
            loadDemo();
        });


    // Functions
    // ########################################################

        // Render All Noodles
        function renderAllNoodles() {

            if (localStorage.length) {
                for(let key in localStorage) {
                    // Check if key is a number (there is a also a 'counter' key)
                    if(Number(key)) {
                        let noodleObject = getNoodleObject(key);
                        renderNoodle(noodleObject);
                    }
                }
            }

        }

        // Get Noodle Object
        function getNoodleObject (id) {
            if (localStorage.getItem(id)) {
                return JSON.parse(localStorage.getItem(id));
            }
        }

        // Save Noodle
        function saveNoodle(noodleObject) {
            localStorage.setItem(noodleObject.noodleID, JSON.stringify(noodleObject));
        }

        // Generate Noodle
        function generateNoodle(noodleObject) {
            let isHiddenClass = JSON.parse(noodleObject.isOpened) ? '' : 'hidden';
            let isBigFontClass = JSON.parse(noodleObject.isOpened) ? 'big-font' : '';
            let noodleSelector = $(`
                    <div class="noodle ${ isBigFontClass }" data-opened="${ noodleObject.isOpened }" contenteditable="false">
                        <span tabindex="-1" class="noodle-heading">${ noodleObject.heading }</span>
                        <p tabindex="-1" class="noodle-description ${ isHiddenClass }">${ noodleObject.description }</p>
                        <div class="code ${ isHiddenClass }">
                            <span tabindex="-1">
                                ${ noodleObject.codeEx }
                            </span>
                        </div>
                    </div>
                    `);
            return noodleSelector;
        }

        // RenderNoodle
        function renderNoodle(noodleObject) {
            let noodleSelector = generateNoodle(noodleObject);
            let whiteboardHeightRem = toRem($('#whiteboard').height() - 30);
            let cssPosition;
            if ( noodleObject.posTop > whiteboardHeightRem ) {
                cssPosition = { top: whiteboardHeightRem + 'rem', left: noodleObject.posLeft + 'rem' };
            } else {
                cssPosition = { top: noodleObject.posTop + 'rem', left: noodleObject.posLeft + 'rem' };
            }
            noodleSelector
                .appendTo($('#whiteboard'))
                .css(cssPosition)
                .attr('data-id', noodleObject.noodleID)
                .draggable({
                    scroll: false,
                    containment: 'parent',
                    distance: 3,
                    start: function(event, ui) {
                        $(this).attr('data-dropped', false);
                        toggleClearMenu(true);
                        ui.helper.addClass('chrome-fix');  // Chrome fix / TEMPORARY
                    },
                    stop: function(event, ui) {
                        let isDropped = JSON.parse(ui.helper.attr('data-dropped'));
                        if(!isDropped) {
                            noodleObject.isOpened = ui.helper.attr('data-opened');
                            noodleObject.posTop = toRem(ui.helper.position().top);
                            noodleObject.posLeft = toRem(ui.helper.position().left);
                            ui.helper.removeClass('chrome-fix');  // Chrome fix / TEMPORARY
                            ui.helper.css('top', noodleObject.posTop + 'rem');
                            ui.helper.css('left', noodleObject.posLeft + 'rem');
                            saveNoodle(noodleObject);
                        }
                    }
                });

                if(noodleSelector.attr('data-opened') === 'true') {
                    noodleSelector.addClass('front');
                }

        }

        // Toogle open
        function toggleOpen(currentNoodle) {

            let noodleID = currentNoodle.attr('data-id');
            let opened = currentNoodle.attr('data-opened');
            let noodleObject = getNoodleObject(noodleID);

            if (opened === 'false') {
                currentNoodle.addClass('front');
                currentNoodle.addClass('big-font');
                currentNoodle.find('.code').removeClass('hidden');
                currentNoodle.find('.noodle-description').removeClass('hidden');
                currentNoodle.attr('data-opened', 'true');
            } else {
                currentNoodle.removeClass('front');
                currentNoodle.removeClass('big-font');
                currentNoodle.find('.code').addClass('hidden');
                currentNoodle.find('.noodle-description').addClass('hidden');
                currentNoodle.attr('data-opened', 'false');
            }

            noodleObject.isOpened = currentNoodle.attr('data-opened');
            saveNoodle(noodleObject);

        }

        // Confirm delete
        function confirmDelete(noodleID) {

            let selector = $('#confirm-delete');
            let msg = 'Are you sure you want to delete this Noodle?';
            let title = 'Delete Noodle';
            let options = dialogOptions(selector, msg, title, noodleID);

            $( "#confirm-delete" ).dialog(options);

        }

        // Delete Noodle
        function deleteNoodle(key) {
            whiteboard.find(`.noodle[data-id="${ key }"]`).remove();
            localStorage.removeItem(key);
        }

        // Reset Noodle position
        function resetNoodlePosition(noodleID) {
            let noodleHTML = $('.noodle[data-id="' + noodleID + '"]');
            let noodleObject = getNoodleObject(noodleID);
            noodleHTML.css({ top: noodleObject.posTop + 'rem', left: noodleObject.posLeft + 'rem' });
        }

        // Noodle constructor
        function Noodle(noodleID, heading, description, codeEx, isOpened) {

            this.noodleID = noodleID;
            this.heading = heading;
            this.description = description;
            this.codeEx = codeEx;
            this.isOpened = isOpened;

            this.posTop = 0;
            this.posLeft = 0;
        }

        // Basic HTML escape function
        function escapeHtml(unsafe) {
            return unsafe
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;")
                .replace(/\//g, "&frasl;");
        }

        // To rem
        function toRem(value) {
            return Number((value / $('#whiteboard').width() * 100).toFixed(4));
        }

        // Toggle Clear Menu
        function toggleClearMenu(isClicked) {
            if(!isClicked) {
                $('#trashcan').addClass('clicked');
                $('#trashcan').attr('data-menu', 'true');
                $('#clear').removeClass('hidden');
            } else {
                $('#trashcan').removeClass('clicked');
                $('#trashcan').attr('data-menu', 'false');
                $('#clear').addClass('hidden');
            }
        }

        // Confirm Clear
        function confirmClear() {

            let selector = $('#confirm-clear');
            let msg = 'Are you sure you want to delete all Noodles?';
            let title = 'Warning!';
            let options = dialogOptions(selector, msg, title);

            $( "#confirm-clear" ).dialog(options);
        }

        // Clear All
        function clearAll() {
            localStorage.clear();
            $(`.noodle`).remove();
        }

        function dialogOptions(dialogSelector, dialogMsg, dialogTitle, noodleID=null) {

            let options = {
                create: function(event, ui) {
                    dialogSelector.html('<p>' + dialogMsg + '</p>');
                },
                title: dialogTitle,
                resizable: false,
                draggable: false,
                height: 150,
                width: 400,
                modal: true,
                closeText: ''
            }

            if (noodleID) {
                options.buttons = {
                    'Cancel': function() {
                        $( this ).dialog( "close" );
                        resetNoodlePosition(noodleID);
                    },
                    'Delete': function() {
                        $( this ).dialog( "close" );
                        deleteNoodle(noodleID);
                    }
                };
                options.beforeClose = function(event, ui) {
                    resetNoodlePosition(noodleID);
                };
            } else {
                options.buttons = {
                    'Cancel': function() {
                        $( this ).dialog( "close" );
                    },
                    'Delete': function() {
                        $( this ).dialog( "close" );
                        clearAll();
                    }
                };
            }

            return options;

        }

        // ----------------------------------------------
        // Load demo content
        function loadDemo() {

            let currentCounter;
            let demoContent = [
                {
                    noodleID: '',
                    heading: 'console.log()',
                    description: 'Prints given attributes to the console.',
                    codeEx: 'console.log(&#039;example text&#039;); // example text<br>\nconsole.log(58); // 58',
                    isOpened: true,
                    posTop: 3.2162,
                    posLeft: 20.9163
                },
                {
                    noodleID: '',
                    heading: 'Math.random()',
                    description: 'Returns a random number from 0 to 1, not including 1',
                    codeEx: 'Math.random(); // 0.6148032315208345',
                    isOpened: true,
                    posTop: 27.1437,
                    posLeft: 22.5256
                },
                {
                    noodleID: '',
                    heading: 'Math.min()',
                    description: "Returns the lowest-valued number passed into it, or NaN if any parameter isn't a number and can't be converted into one.",
                    codeEx: 'Math.min(3, 5, 1, 7); // 1',
                    isOpened: false,
                    posTop: 17.7574,
                    posLeft: 49.4778
                },
                {
                    noodleID: '',
                    heading: 'eval()',
                    description: 'Evaluates JavaScript code represented as a string.',
                    codeEx: "console.log(eval('2 + 2')); // 4<br>\nconsole.log(eval(new String('2 + 2'))); // 2 + 2",
                    isOpened: false,
                    posTop: 13.6664,
                    posLeft: 9.6413
                },
                {
                    noodleID: '',
                    heading: 'Number.isNaN()',
                    description: 'Determines whether the passed value is NaN and its type is Number.',
                    codeEx: "Number.isNaN('text'); // false<br>\nNumber.isNaN(8); // true",
                    isOpened: true,
                    posTop: 29.0007,
                    posLeft: 67.5671
                },
                {
                    noodleID: '',
                    heading: 'Object.create()',
                    description: 'Creates a new object, using an existing object as the prototype of the newly created object.',
                    codeEx: "const me = Object.create(person);",
                    isOpened: true,
                    posTop: 6.2152,
                    posLeft: 59.767
                }
            ];

            for (let noodleObject of demoContent) {
                currentCounter = localStorage.getItem('counter') ? Number(localStorage.getItem('counter')) + 1 : 1;
                noodleObject.noodleID = currentCounter;
                saveNoodle(noodleObject);
                renderNoodle(noodleObject);
                localStorage.setItem('counter', noodleObject.noodleID);
            }

        }
        
    }

});