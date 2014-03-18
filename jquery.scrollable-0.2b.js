(function($) {
  $.fn.scrollable = function(options) {
    options = $.extend({ 
      VERSION: '0.2b',
      axie   : 'y',
      step   : 50,
      height : null,
      onScroll: function() { }
    }, options);
    var $objs = this;    
    $objs.each(function(i) {
      var $obj = $(this);
      var obj  = this;
      var height = $obj.height();
      var scrollHeight = this.scrollHeight;
      var scrollTop = this.scrollTop;
      var scrollgizmoHeight = (height / scrollHeight) * height;
      var $scrollgizmo = $('<div class="scrollgizmo" style="height: '+ scrollgizmoHeight +'px;"></div>');
      var $scrollbar   = $('<div class="scrollbar"></div>');
      var position = $obj.css('position');
      
      $obj.css({ overflow: 'hidden', position: position == 'static' ? 'relative' : position });
      $scrollbar.append($scrollgizmo);
      $obj.prepend($scrollbar);
      obj.scrollTop = 0;
      
      var scrollgizmoTop = parseInt($scrollgizmo.css('top'));
      
      $obj.bind('mousewheel wheel DOMMouseScroll', function(evt) {
        evt.preventDefault();
        evt.stopPropagation(); 
        var step = options.step;
        var wheelDeltaY  = evt.originalEvent.wheelDeltaY || (evt.originalEvent.deltaY * -1) || evt.originalEvent.wheelDelta;
        
        obj.scrollTop += -1 * (wheelDeltaY / Math.abs(wheelDeltaY)) * step;
        
        scrollTop = obj.scrollTop;
        
        $scrollbar.css({ top: scrollTop +'px' });
        scrollgizmoTop = Math.max(1, Math.min(height - 1 - scrollgizmoHeight, (((height) / scrollHeight) * scrollTop)));
        $scrollgizmo.css({ top: scrollgizmoTop +'px' })
      });
      
      
      var isGizmoDragging = false;
      var pos, difY, oldY, curY = 0;
      $scrollgizmo.bind('mousedown', function(evt) {
        evt.preventDefault();
        evt.stopPropagation();
        isGizmoDragging = true;
        oldY = evt.pageY;
        $obj.addClass('scrolling');
      })
      $(document).bind('mousemove', function(evt){
        if(!isGizmoDragging) return false;
        evt.preventDefault();
        evt.stopPropagation();
        
        curY = evt.pageY;
        difY = curY - oldY;
        
        scrollgizmoTop += difY;
        scrollgizmoTop = Math.max(1, Math.min(height - 1 - scrollgizmoHeight, scrollgizmoTop))
        
        $scrollgizmo.css({ top: scrollgizmoTop +'px' });
        
        obj.scrollTop += difY * scrollHeight / height;
        
        scrollTop = obj.scrollTop;
        
        $scrollbar.css({ top: scrollTop +'px' });
        scrollgizmoTop = Math.max(1, Math.min(height - 1 - scrollgizmoHeight, (((height) / scrollHeight) * scrollTop)));
        $scrollgizmo.css({ top: scrollgizmoTop +'px' })
        
        oldY = curY;
      }).bind('mouseup', function(evt) {
        if(!isGizmoDragging) return false;
        evt.preventDefault();
        evt.stopPropagation();
        isGizmoDragging = false;
        difY = oldY = curY = 0;
        $obj.removeClass('scrolling');
      });
    });
  };
})(jQuery)