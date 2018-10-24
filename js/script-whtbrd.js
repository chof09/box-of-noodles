$(function() {

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

});