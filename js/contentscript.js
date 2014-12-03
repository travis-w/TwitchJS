$(function() {
    //Page Checking
    var URL = window.location.toString();
    
    //Only run chat scanning on popout chat
    if (URL.indexOf('/chat?popout=twitchjs') !== -1) {
        var commands;
        var intervals;
        
        //Give Chat button id
        $('button.button.primary').attr('id', 'twitchjs-chat');
        
        chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'twitchjs-commands'}, function(response) {
            commands = JSON.parse(JSON.parse(response.data));
            
            setInterval(function() {
                $('.message').each(function() {
                    $message = $(this);
                    //Check to see if message contains command
                    $.each(commands, function(i, v) {
                        if (v.trigger == $message.text()) {
                            //Send twitch message
                            $('textarea:first').val(v.response).focus().blur().focus();
                            simulatedClick(document.getElementById('twitchjs-chat'));
                            return;
                        }   
                    });
                    $(this).parent().remove();
                });
            }, 10);
        });
        
        //Get Intervals
        chrome.runtime.sendMessage({method: 'getLocalStorage', key: 'twitchjs-intervals'}, function(response) {
            intervals = JSON.parse(JSON.parse(response.data));
              
            $.each(intervals, function(i, v) {
                setInterval(function() {
                    //Send twitch message
                    $('textarea:first').val(v.text).focus().blur().focus();
                    simulatedClick(document.getElementById('twitchjs-chat'));
                }, v.time * 1000);
            });
        });
    
    }
    else {
        //Add Bot Button to twitch page
        $('.send-chat-button').append('<a href="' + URL + '/chat?popout=twitchjs" target="_blank" class="button primary"><span>Start Bot</span></a>');
    }
    
});

function simulatedClick(target, options) {
    var event = target.ownerDocument.createEvent('MouseEvents'),
        options = options || {};

    //Set your default options to the right of ||
    var opts = {
        type: options.type                  || 'click',
        canBubble:options.canBubble             || true,
        cancelable:options.cancelable           || true,
        view:options.view                       || target.ownerDocument.defaultView, 
        detail:options.detail                   || 1,
        screenX:options.screenX                 || 0, //The coordinates within the entire page
        screenY:options.screenY                 || 0,
        clientX:options.clientX                 || 0, //The coordinates within the viewport
        clientY:options.clientY                 || 0,
        ctrlKey:options.ctrlKey                 || false,
        altKey:options.altKey                   || false,
        shiftKey:options.shiftKey               || false,
        metaKey:options.metaKey                 || false, //I *think* 'meta' is 'Cmd/Apple' on Mac, and 'Windows key' on Win. Not sure, though!
        button:options.button                   || 0, //0 = left, 1 = middle, 2 = right
        relatedTarget:options.relatedTarget     || null,
    }

    //Pass in the options
    event.initMouseEvent(
        opts.type,
        opts.canBubble,
        opts.cancelable,
        opts.view, 
        opts.detail,
        opts.screenX,
        opts.screenY,
        opts.clientX,
        opts.clientY,
        opts.ctrlKey,
        opts.altKey,
        opts.shiftKey,
        opts.metaKey,
        opts.button,
        opts.relatedTarget
    );

    //Fire the event
    target.dispatchEvent(event);
}