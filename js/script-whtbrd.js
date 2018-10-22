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
        addNoodleForm.toggleClass('hidden');
    });

    addNoodleForm.click(function(e) {
        e.stopPropagation();
    });

    $('body, html').click(function() {
        addNoodleForm.addClass('hidden');
    });

    // Item on hover
    whiteboard.on({
        mouseenter: function() {
            if ($(this).attr('data-opened') === 'false') {
                $(this).addClass('big-font');
            }
            // $(this).find('.item-heading').css({ color: '#848484' });
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
        let currentCounter = localStorage.getItem('counter') ? Number(localStorage.getItem('counter')) + 1 : 1;
        localStorage.setItem('counter', currentCounter);

        if (theHeading.val() && theDescription.val() && theCode.val()) {

            addNoodleForm.addClass('hidden');

            let cleanCode = escapeHtml(theCode.val());
            let preCode = cleanCode.replace(/\n/g, '<br>\n').replace(/ /g, '&nbsp;');
            cleanHeading = escapeHtml(theHeading.val());
            cleanDescription = escapeHtml(theDescription.val());

            $(`
                <div class="item" data-opened="false">
                    <span class="item-heading">${ cleanHeading }</span>
                    <p class="item-description hidden">${ cleanDescription }</p>
                    <div class="code hidden">
                        <span>
                            ${ preCode }
                        </span>
                    </div>
                </div>
            `).appendTo('#whiteboard')
            // .attr({ 'data-opened': false, 'data-id': currentCounter })
            .attr('data-id', currentCounter)
            .draggable({
                scroll: false,
                containment: 'parent',
                stop: function(event, ui) {
                    let itemID = $(this).attr('data-id');
                    let theItemObject = JSON.parse(localStorage.getItem(itemID));
                    theItemObject.posTop = $(this).position().top;
                    theItemObject.posLeft = $(this).position().left;

                    localStorage.setItem(itemID, JSON.stringify(theItemObject));
                }
            });

            let itemObj = new Item(currentCounter, cleanHeading, cleanDescription, preCode, false);

            localStorage.setItem(currentCounter, JSON.stringify(itemObj));

            theHeading.val('');
            theDescription.val('');
            theCode.val('');

        } else {
            alert('No blanks pls. TY');
        }

    });


    // Functions

    // Set Noodles
    function setNoodles() {
        if(localStorage.length) {
            for(let key in localStorage) {
                // Check if key is a number (there is a 'counter' key also)
                if(Number(key)) {

                    let theItemObject = JSON.parse(localStorage.getItem(key));
                    // Convert bool string to bool and set class
                    let hidden = JSON.parse(theItemObject.isOpened) ? '' : 'hidden';
                    let big = JSON.parse(theItemObject.isOpened) ? 'big-font' : '';

                    $(`
                    <div class="item ${ big }" data-opened=${ theItemObject.isOpened }>
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
                        stop: function(event, ui) {
                            let itemID = $(this).attr('data-id');
                            // let opened = $(this).attr('data-opened');
                            theItemObject.posTop = $(this).position().top;
                            theItemObject.posLeft = $(this).position().left;

                            localStorage.setItem(itemID, JSON.stringify(theItemObject));
                        }
                    });

                }

            }
        }
    }

    function Item (itemID, heading, description, codeEx, isOpened) {

        this.itemID = itemID;
        this.heading = heading;
        this.description = description;
        this.codeEx = codeEx;
        this.isOpened = isOpened;

        let posTop = 0;
        let posLeft = 0;
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