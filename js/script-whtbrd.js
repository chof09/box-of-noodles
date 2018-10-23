$(function() {

    setNoodles();

    // Set variables
    const whiteboard = $( '#whiteboard' );
    let code = $( '.item .code' );
    let description = $( '.item-description' );
    let toggleNew = $( '#show-add-form' );
    let addNoodleForm = $( '#add-noodle-form' );

    // Toggle "Add New" form
    toggleNew.click(function(e) {
        e.stopPropagation();
        toggleNew.addClass('active');
        addNoodleForm.toggleClass('hidden');
    });

    addNoodleForm.click(function(e) {
        e.stopPropagation();
    });

    $('body, html').click(function() {
        addNoodleForm.addClass('hidden');
        toggleNew.removeClass('active');
    });

    // Item on hover
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
    }, '.item');

    // Item click
    whiteboard.on('click', '.item', function() {

        let itemID = $(this).attr('data-id');
        let opened = $(this).attr('data-opened');
        let theItemObject = JSON.parse(localStorage.getItem(itemID));

        if (opened === 'false') {
            $(this).find('.code').removeClass('hidden');
            $(this).find('.item-description').removeClass('hidden');
            $(this).attr('data-opened', 'true');
        } else {
            $(this).find('.code').addClass('hidden');
            $(this).find('.item-description').addClass('hidden');
            $(this).attr('data-opened', 'false');
        }

        theItemObject.isOpened = $(this).attr('data-opened');
        localStorage.setItem(itemID, JSON.stringify(theItemObject));

    });

    // Create new item
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

            let itemObj = new Item(currentCounter, cleanHeading, cleanDescription, preCode, false);

            localStorage.setItem(currentCounter, JSON.stringify(itemObj));
            localStorage.setItem('counter', currentCounter);

            setNoodles(currentCounter);

            addNoodleForm.find(':input').val('');
            toggleNew.removeClass('active');

        } else {
            alert('Noodles must have headings!');
        }

    });

    // Delete Item
    $('#trashcan').droppable({
        accept: '.item',
        classes: {
            'ui-droppable-hover': 'highlight'
        },
        tolerance: 'pointer',
        drop: function(event, ui) {
            ui.draggable.attr('data-dropped', true);
            let msg = "Are you sure you want to delete this Noodle?";
            if (confirm(msg)) {
                let id = ui.draggable.attr('data-id');
                deleteNoodle(id);
            }
        }
    });


    // Functions

    // Get Noodles or one Noodle specified by its key
    function getNoodles(func, one) {
        if (localStorage.length) {
            if(one === false) {
                for(let key in localStorage) {
                    // Check if key is a number (there is a 'counter' key also)
                    if(Number(key)) {
                        func(key);
                    }
                }
            } else {
                func(one);
            }
        }
    }

    // Set Noodles
    function setNoodles(one=false) {

            getNoodles(function(key) {

                let theItemObject = JSON.parse(localStorage.getItem(key));
                // Convert bool string to bool and set class
                let hidden = JSON.parse(theItemObject.isOpened) ? '' : 'hidden';
                let big = JSON.parse(theItemObject.isOpened) ? 'big-font' : '';

                $(`
                <div class="item ${ big }" data-opened="${ theItemObject.isOpened }">
                    <span class="item-heading">${ theItemObject.heading }</span>
                    <p class="item-description ` + hidden + `">${ theItemObject.description }</p>
                    <div class="code ${ hidden }">
                        <span>
                            ${ theItemObject.codeEx }
                        </span>
                    </div>
                </div>
                `).appendTo('#whiteboard')
                .css({ top: theItemObject.posTop, left: theItemObject.posLeft })
                .attr('data-id', theItemObject.itemID)
                .draggable({
                    scroll: false,
                    containment: 'parent',
                    start: function(event, ui) {
                        $(this).attr('data-dropped', false);
                    },
                    stop: function(event, ui) {
                        $('#trashcan').promise().done(function() {
                            let isDropped = JSON.parse(ui.helper.attr('data-dropped'));
                            if(!isDropped) {
                                let itemID = ui.helper.attr('data-id');
                                theItemObject.posTop = ui.helper.position().top;
                                theItemObject.posLeft = ui.helper.position().left;

                                localStorage.setItem(itemID, JSON.stringify(theItemObject));
                            }
                        });
                    }
                });
            }, one);
    }

    function deleteNoodle(key) {
        whiteboard.find(`.item[data-id="${ key }"]`).remove();
        localStorage.removeItem(key);
    }

    function Item (itemID, heading, description, codeEx, isOpened) {

        this.itemID = itemID;
        this.heading = heading;
        this.description = description;
        this.codeEx = codeEx;
        this.isOpened = isOpened;

        this.posTop = 0;
        this.posLeft = 0;
    }

    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

});