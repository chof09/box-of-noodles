$(function() {

    let isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }

    if(!isMobile) {

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

        $('body, html').click(function() {
            addNoodleForm.addClass('hidden');
            toggleNew.removeClass('active');
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
        whiteboard.on('click', '.noodle', function() {

            let noodleID = $(this).attr('data-id');
            let opened = $(this).attr('data-opened');
            let noodleObject = getNoodleObject(noodleID);

            if (opened === 'false') {
                $(this).find('.code').removeClass('hidden');
                $(this).find('.noodle-description').removeClass('hidden');
                $(this).attr('data-opened', 'true');
            } else {
                $(this).find('.code').addClass('hidden');
                $(this).find('.noodle-description').addClass('hidden');
                $(this).attr('data-opened', 'false');
            }

            noodleObject.isOpened = $(this).attr('data-opened');
            saveNoodle(noodleObject);

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
                localStorage.setItem('counter', currentCounter);

                renderNoodle(noodleObject);

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
                // let msg = "Are you sure you want to delete this Noodle?";
                // if (confirm(msg)) {
                    
                    // deleteNoodle(id);
            }
        });


        // Functions
        // ########################################################

        // Set Noodles
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
                    <div class="noodle ${ isBigFontClass }" data-opened="${ noodleObject.isOpened }">
                        <span class="noodle-heading">${ noodleObject.heading }</span>
                        <p class="noodle-description ${ isHiddenClass }">${ noodleObject.description }</p>
                        <div class="code ${ isHiddenClass }">
                            <span>
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
            noodleSelector
                .appendTo($('#whiteboard'))
                .css({ top: noodleObject.posTop, left: noodleObject.posLeft })
                .attr('data-id', noodleObject.noodleID)
                .draggable({
                    scroll: false,
                    containment: 'parent',
                    start: function(event, ui) {
                        $(this).attr('data-dropped', false);
                    },
                    stop: function(event, ui) {
                        let isDropped = JSON.parse(ui.helper.attr('data-dropped'));
                        if(!isDropped) {
                            let noodleID = ui.helper.attr('data-id');
                            noodleObject.isOpened = ui.helper.attr('data-opened');
                            noodleObject.posTop = ui.helper.position().top;
                            noodleObject.posLeft = ui.helper.position().left;
                            saveNoodle(noodleObject);
                        }
                    }
                });
        }

        // Confirm delete
        function confirmDelete(noodleID) {

            $( "#dialog-confirm" ).dialog({
                resizable: false,
                draggable: false,
                height: 150,
                width: 400,
                modal: true,
                buttons: {
                    'Cancel': function() {
                        $( this ).dialog( "close" );
                    },
                    'Delete': function() {
                        deleteNoodle(noodleID);
                        $( this ).dialog( "close" );
                    }
                },
                closeText: ''
            });

        }

        // Delete Noodle
        function deleteNoodle(key) {
            whiteboard.find(`.noodle[data-id="${ key }"]`).remove();
            localStorage.removeItem(key);
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
                .replace(/'/g, "&#039;");
        }

    } else {
        $('body').html("<p style='padding: 10px; font-size: 18px;'>"
                            + "<i class='fas fa-mobile-alt' style='font-size: 20px;'></i>&nbsp;&nbsp;"
                            +   "<span style='color: #0e92a2'>Box of Noodles</span> doesn't work on mobile devices.</p>");
    }

});