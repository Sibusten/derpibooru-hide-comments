// ==UserScript==
// @name        Derpibooru Hide Comments
// @namespace   sibusten
// @description Hide image comments on Derpibooru
// @include     https://derpibooru.org/*
// @include     https://trixiebooru.org/*
// @require     https://code.jquery.com/jquery-3.2.1.min.js
// @version     1.0
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

var comments_currently_hidden;
var currently_working = false;

// Invert whether comments are hidden or not, and then update the state of the comment section
function toggle_comments(){
  comments_currently_hidden = !comments_currently_hidden;
  GM_setValue('comments_hidden', comments_currently_hidden);
  update_comment_state();
};

// Update the comment section to be either hidden or shown depending on the current state
function update_comment_state(){
  // Set a flag so that changes made to the element don't cause the event to trigger itself
  if(currently_working){
    return;
  }
  currently_working = true;
  
  if(comments_currently_hidden){
    // Hide the actual comments
    $('.block.communication').addClass('hide-comments');
    
    // Hide the comment footer bar if it exists
    var temp = $('#image_comments .block')
    if(temp.length > 1){
      temp.last().addClass('hide-comments');
    }
  }
  else{
    // Show the actual comments
    $('.block.communication').removeClass('hide-comments');
    
    // Show the comment footer bar if it exists
    var temp = $('#image_comments .block')
    if(temp.length > 1){
      temp.last().removeClass('hide-comments');
    }
  }
  
  update_hide_button();
  currently_working = false;
};

function update_hide_button(){
  // If the button does not exist, create it
  if(!$('.hide-comments-button').length){
    console.log('creating hide button');
    $('#image_comments .block__header').append('<a class="hide-comments-button" title=""><i class="fa"></i> <span></span></a>');
    $('.hide-comments-button').click(toggle_comments);
    console.log('button created');
  }
  
  // Update the button's text to reflect the current state of the comments
  if(comments_currently_hidden){
    $('.hide-comments-button').attr('title', 'Show Comments');
    $('.hide-comments-button span').text('Show Comments');
    $('.hide-comments-button i').removeClass('fa-eye-slash').addClass('fa-eye');
  }
  else{
    $('.hide-comments-button').attr('title', 'Hide Comments');
    $('.hide-comments-button span').text('Hide Comments');
    $('.hide-comments-button i').removeClass('fa-eye').addClass('fa-eye-slash');
  }
};

$(document).ready(function(){
  // Add a class style to use for hiding the comment section
  GM_addStyle('.hide-comments { display: none !important; }');
  
  // Load the stored value for whether comments should be hidden. Defaults to false
  comments_currently_hidden = GM_getValue('comments_hidden', false);
  
  //Add an event listener to trigger when the comment section changes (first loaded, changing page, refreshing)
  $('#comments').on('DOMSubtreeModified', update_comment_state);
});
