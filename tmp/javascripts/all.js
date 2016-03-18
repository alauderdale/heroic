/*!
 * Bootstrap v3.3.6 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under the MIT license
 */


if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] > 2)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher, but lower than version 3')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.6
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.6
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.6'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.6
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.6'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state += 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked')) changed = false
        $parent.find('.active').removeClass('active')
        this.$element.addClass('active')
      } else if ($input.prop('type') == 'checkbox') {
        if (($input.prop('checked')) !== this.$element.hasClass('active')) changed = false
        this.$element.toggleClass('active')
      }
      $input.prop('checked', this.$element.hasClass('active'))
      if (changed) $input.trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
      this.$element.toggleClass('active')
    }
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      if (!($(e.target).is('input[type="radio"]') || $(e.target).is('input[type="checkbox"]'))) e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.6
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      = null
    this.sliding     = null
    this.interval    = null
    this.$active     = null
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.6'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.6
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $('[data-toggle="collapse"][href="#' + element.id + '"],' +
                           '[data-toggle="collapse"][data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.6'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && /show|hide/.test(option)) options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.6
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.6'

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      if (e && e.type == 'click' && /input|textarea/i.test(e.target.tagName) && $.contains($parent[0], e.target)) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger($.Event('hidden.bs.dropdown', relatedTarget))
    })
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $(document.createElement('div'))
          .addClass('dropdown-backdrop')
          .insertAfter($(this))
          .on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger($.Event('shown.bs.dropdown', relatedTarget))
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive && e.which != 27 || isActive && e.which == 27) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.disabled):visible a'
    var $items = $parent.find('.dropdown-menu' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--         // up
    if (e.which == 40 && index < $items.length - 1) index++         // down
    if (!~index)                                    index = 0

    $items.eq(index).trigger('focus')
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '.dropdown-menu', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.6
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options             = options
    this.$body               = $(document.body)
    this.$element            = $(element)
    this.$dialog             = this.$element.find('.modal-dialog')
    this.$backdrop           = null
    this.isShown             = null
    this.originalBodyPad     = null
    this.scrollbarWidth      = 0
    this.ignoreBackdropClick = false

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.6'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.$dialog.on('mousedown.dismiss.bs.modal', function () {
      that.$element.one('mouseup.dismiss.bs.modal', function (e) {
        if ($(e.target).is(that.$element)) that.ignoreBackdropClick = true
      })
    })

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element.addClass('in')

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$dialog // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .off('click.dismiss.bs.modal')
      .off('mouseup.dismiss.bs.modal')

    this.$dialog.off('mousedown.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $(document.createElement('div'))
        .addClass('modal-backdrop ' + animate)
        .appendTo(this.$body)

      this.$element.on('click.dismiss.bs.modal', $.proxy(function (e) {
        if (this.ignoreBackdropClick) {
          this.ignoreBackdropClick = false
          return
        }
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus()
          : this.hide()
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    this.adjustDialog()
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    var fullWindowWidth = window.innerWidth
    if (!fullWindowWidth) { // workaround for missing window.innerWidth in IE8
      var documentElementRect = document.documentElement.getBoundingClientRect()
      fullWindowWidth = documentElementRect.right - Math.abs(documentElementRect.left)
    }
    this.bodyIsOverflowing = document.body.clientWidth < fullWindowWidth
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    this.originalBodyPad = document.body.style.paddingRight || ''
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', this.originalBodyPad)
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.6
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       = null
    this.options    = null
    this.enabled    = null
    this.timeout    = null
    this.hoverState = null
    this.$element   = null
    this.inState    = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.6'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $($.isFunction(this.options.viewport) ? this.options.viewport.call(this, this.$element) : (this.options.viewport.selector || this.options.viewport))
    this.inState   = { click: false, hover: false, focus: false }

    if (this.$element[0] instanceof document.constructor && !this.options.selector) {
      throw new Error('`selector` option must be specified when initializing ' + this.type + ' on the window.document object!')
    }

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusin' ? 'focus' : 'hover'] = true
    }

    if (self.tip().hasClass('in') || self.hoverState == 'in') {
      self.hoverState = 'in'
      return
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.isInStateTrue = function () {
    for (var key in this.inState) {
      if (this.inState[key]) return true
    }

    return false
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    if (obj instanceof $.Event) {
      self.inState[obj.type == 'focusout' ? 'focus' : 'hover'] = false
    }

    if (self.isInStateTrue()) return

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)
      this.$element.trigger('inserted.bs.' + this.type)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var viewportDim = this.getPosition(this.$viewport)

        placement = placement == 'bottom' && pos.bottom + actualHeight > viewportDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < viewportDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > viewportDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < viewportDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  += marginTop
    offset.left += marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isVertical) {
    this.arrow()
      .css(isVertical ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isVertical ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = $(this.$tip)
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && $tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof $e.attr('data-original-title') != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.right) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    if (!this.$tip) {
      this.$tip = $(this.options.template)
      if (this.$tip.length != 1) {
        throw new Error(this.type + ' `template` option must consist of exactly 1 top-level element!')
      }
    }
    return this.$tip
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    if (e) {
      self.inState.click = !self.inState.click
      if (self.isInStateTrue()) self.enter(self)
      else self.leave(self)
    } else {
      self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
    }
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
      if (that.$tip) {
        that.$tip.detach()
      }
      that.$tip = null
      that.$arrow = null
      that.$viewport = null
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.6
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.6'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && /destroy|hide/.test(option)) return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.6
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    // jscs:disable requireDollarBeforejQueryAssignment
    this.element = $(element)
    // jscs:enable requireDollarBeforejQueryAssignment
  }

  Tab.VERSION = '3.3.6'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && ($active.length && $active.hasClass('fade') || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu').length) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
/*
 Highcharts JS v4.2.3 (2016-02-08)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(m){typeof module==="object"&&module.exports?module.exports=m:m(Highcharts)})(function(m){function J(a,b,c){this.init(a,b,c)}var O=m.arrayMin,P=m.arrayMax,s=m.each,F=m.extend,t=m.merge,Q=m.map,q=m.pick,A=m.pInt,o=m.getOptions().plotOptions,k=m.seriesTypes,u=m.extendClass,K=m.splat,v=m.wrap,L=m.Axis,y=m.Tick,G=m.Point,R=m.Pointer,S=m.CenteredSeriesMixin,B=m.TrackerMixin,w=m.Series,x=Math,E=x.round,C=x.floor,M=x.max,T=m.Color,r=function(){};F(J.prototype,{init:function(a,b,c){var d=this,g=
d.defaultOptions;d.chart=b;d.options=a=t(g,b.angular?{background:{}}:void 0,a);(a=a.background)&&s([].concat(K(a)).reverse(),function(a){var g=a.backgroundColor,b=c.userOptions,a=t(d.defaultBackgroundOptions,a);if(g)a.backgroundColor=g;a.color=a.backgroundColor;c.options.plotBands.unshift(a);b.plotBands=b.plotBands||[];b.plotBands!==c.options.plotBands&&b.plotBands.unshift(a)})},defaultOptions:{center:["50%","50%"],size:"85%",startAngle:0},defaultBackgroundOptions:{shape:"circle",borderWidth:1,borderColor:"silver",
backgroundColor:{linearGradient:{x1:0,y1:0,x2:0,y2:1},stops:[[0,"#FFF"],[1,"#DDD"]]},from:-Number.MAX_VALUE,innerRadius:0,to:Number.MAX_VALUE,outerRadius:"105%"}});var z=L.prototype,y=y.prototype,U={getOffset:r,redraw:function(){this.isDirty=!1},render:function(){this.isDirty=!1},setScale:r,setCategories:r,setTitle:r},N={isRadial:!0,defaultRadialGaugeOptions:{labels:{align:"center",x:0,y:null},minorGridLineWidth:0,minorTickInterval:"auto",minorTickLength:10,minorTickPosition:"inside",minorTickWidth:1,
tickLength:10,tickPosition:"inside",tickWidth:2,title:{rotation:0},zIndex:2},defaultRadialXOptions:{gridLineWidth:1,labels:{align:null,distance:15,x:0,y:null},maxPadding:0,minPadding:0,showLastLabel:!1,tickLength:0},defaultRadialYOptions:{gridLineInterpolation:"circle",labels:{align:"right",x:-3,y:-2},showLastLabel:!1,title:{x:4,text:null,rotation:90}},setOptions:function(a){a=this.options=t(this.defaultOptions,this.defaultRadialOptions,a);if(!a.plotBands)a.plotBands=[]},getOffset:function(){z.getOffset.call(this);
this.chart.axisOffset[this.side]=0;this.center=this.pane.center=S.getCenter.call(this.pane)},getLinePath:function(a,b){var c=this.center,b=q(b,c[2]/2-this.offset);return this.chart.renderer.symbols.arc(this.left+c[0],this.top+c[1],b,b,{start:this.startAngleRad,end:this.endAngleRad,open:!0,innerR:0})},setAxisTranslation:function(){z.setAxisTranslation.call(this);if(this.center)this.transA=this.isCircular?(this.endAngleRad-this.startAngleRad)/(this.max-this.min||1):this.center[2]/2/(this.max-this.min||
1),this.minPixelPadding=this.isXAxis?this.transA*this.minPointOffset:0},beforeSetTickPositions:function(){this.autoConnect&&(this.max+=this.categories&&1||this.pointRange||this.closestPointRange||0)},setAxisSize:function(){z.setAxisSize.call(this);if(this.isRadial){this.center=this.pane.center=m.CenteredSeriesMixin.getCenter.call(this.pane);if(this.isCircular)this.sector=this.endAngleRad-this.startAngleRad;this.len=this.width=this.height=this.center[2]*q(this.sector,1)/2}},getPosition:function(a,
b){return this.postTranslate(this.isCircular?this.translate(a):0,q(this.isCircular?b:this.translate(a),this.center[2]/2)-this.offset)},postTranslate:function(a,b){var c=this.chart,d=this.center,a=this.startAngleRad+a;return{x:c.plotLeft+d[0]+Math.cos(a)*b,y:c.plotTop+d[1]+Math.sin(a)*b}},getPlotBandPath:function(a,b,c){var d=this.center,g=this.startAngleRad,e=d[2]/2,j=[q(c.outerRadius,"100%"),c.innerRadius,q(c.thickness,10)],l=/%$/,i,f=this.isCircular;this.options.gridLineInterpolation==="polygon"?
d=this.getPlotLinePath(a).concat(this.getPlotLinePath(b,!0)):(a=Math.max(a,this.min),b=Math.min(b,this.max),f||(j[0]=this.translate(a),j[1]=this.translate(b)),j=Q(j,function(a){l.test(a)&&(a=A(a,10)*e/100);return a}),c.shape==="circle"||!f?(a=-Math.PI/2,b=Math.PI*1.5,i=!0):(a=g+this.translate(a),b=g+this.translate(b)),d=this.chart.renderer.symbols.arc(this.left+d[0],this.top+d[1],j[0],j[0],{start:Math.min(a,b),end:Math.max(a,b),innerR:q(j[1],j[0]-j[2]),open:i}));return d},getPlotLinePath:function(a,
b){var c=this,d=c.center,g=c.chart,e=c.getPosition(a),j,l,i;c.isCircular?i=["M",d[0]+g.plotLeft,d[1]+g.plotTop,"L",e.x,e.y]:c.options.gridLineInterpolation==="circle"?(a=c.translate(a))&&(i=c.getLinePath(0,a)):(s(g.xAxis,function(a){a.pane===c.pane&&(j=a)}),i=[],a=c.translate(a),d=j.tickPositions,j.autoConnect&&(d=d.concat([d[0]])),b&&(d=[].concat(d).reverse()),s(d,function(e,b){l=j.getPosition(e,a);i.push(b?"L":"M",l.x,l.y)}));return i},getTitlePosition:function(){var a=this.center,b=this.chart,
c=this.options.title;return{x:b.plotLeft+a[0]+(c.x||0),y:b.plotTop+a[1]-{high:0.5,middle:0.25,low:0}[c.align]*a[2]+(c.y||0)}}};v(z,"init",function(a,b,c){var h;var d=b.angular,g=b.polar,e=c.isX,j=d&&e,l,i;i=b.options;var f=c.pane||0;if(d){if(F(this,j?U:N),l=!e)this.defaultRadialOptions=this.defaultRadialGaugeOptions}else if(g)F(this,N),this.defaultRadialOptions=(l=e)?this.defaultRadialXOptions:t(this.defaultYAxisOptions,this.defaultRadialYOptions);a.call(this,b,c);if(!j&&(d||g)){a=this.options;if(!b.panes)b.panes=
[];this.pane=(h=b.panes[f]=b.panes[f]||new J(K(i.pane)[f],b,this),f=h);f=f.options;b.inverted=!1;i.chart.zoomType=null;this.startAngleRad=b=(f.startAngle-90)*Math.PI/180;this.endAngleRad=i=(q(f.endAngle,f.startAngle+360)-90)*Math.PI/180;this.offset=a.offset||0;if((this.isCircular=l)&&c.max===void 0&&i-b===2*Math.PI)this.autoConnect=!0}});v(z,"autoLabelAlign",function(a){if(!this.isRadial)return a.apply(this,[].slice.call(arguments,1))});v(y,"getPosition",function(a,b,c,d,g){var e=this.axis;return e.getPosition?
e.getPosition(c):a.call(this,b,c,d,g)});v(y,"getLabelPosition",function(a,b,c,d,g,e,j,l,i){var f=this.axis,h=e.y,n=20,k=e.align,m=(f.translate(this.pos)+f.startAngleRad+Math.PI/2)/Math.PI*180%360;f.isRadial?(a=f.getPosition(this.pos,f.center[2]/2+q(e.distance,-25)),e.rotation==="auto"?d.attr({rotation:m}):h===null&&(h=f.chart.renderer.fontMetrics(d.styles.fontSize).b-d.getBBox().height/2),k===null&&(f.isCircular?(this.label.getBBox().width>f.len*f.tickInterval/(f.max-f.min)&&(n=0),k=m>n&&m<180-n?
"left":m>180+n&&m<360-n?"right":"center"):k="center",d.attr({align:k})),a.x+=e.x,a.y+=h):a=a.call(this,b,c,d,g,e,j,l,i);return a});v(y,"getMarkPath",function(a,b,c,d,g,e,j){var l=this.axis;l.isRadial?(a=l.getPosition(this.pos,l.center[2]/2+d),b=["M",b,c,"L",a.x,a.y]):b=a.call(this,b,c,d,g,e,j);return b});o.arearange=t(o.area,{lineWidth:1,marker:null,threshold:null,tooltip:{pointFormat:'<span style="color:{series.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
trackByArea:!0,dataLabels:{align:null,verticalAlign:null,xLow:0,xHigh:0,yLow:0,yHigh:0},states:{hover:{halo:!1}}});k.arearange=u(k.area,{type:"arearange",pointArrayMap:["low","high"],dataLabelCollections:["dataLabel","dataLabelUpper"],toYData:function(a){return[a.low,a.high]},pointValKey:"low",deferTranslatePolar:!0,highToXY:function(a){var b=this.chart,c=this.xAxis.postTranslate(a.rectPlotX,this.yAxis.len-a.plotHigh);a.plotHighX=c.x-b.plotLeft;a.plotHigh=c.y-b.plotTop},translate:function(){var a=
this,b=a.yAxis;k.area.prototype.translate.apply(a);s(a.points,function(a){var d=a.low,g=a.high,e=a.plotY;g===null||d===null?a.isNull=!0:(a.plotLow=e,a.plotHigh=b.translate(g,0,1,0,1))});this.chart.polar&&s(this.points,function(b){a.highToXY(b)})},getGraphPath:function(){var a=this.points,b=[],c=[],d=a.length,g=w.prototype.getGraphPath,e,j,l;l=this.options;for(var i=l.step,d=a.length;d--;)e=a[d],!e.isNull&&(!a[d+1]||a[d+1].isNull)&&c.push({plotX:e.plotX,plotY:e.plotLow}),j={plotX:e.plotX,plotY:e.plotHigh,
isNull:e.isNull},c.push(j),b.push(j),!e.isNull&&(!a[d-1]||a[d-1].isNull)&&c.push({plotX:e.plotX,plotY:e.plotLow});a=g.call(this,a);if(i)i===!0&&(i="left"),l.step={left:"right",center:"center",right:"left"}[i];b=g.call(this,b);c=g.call(this,c);l.step=i;l=[].concat(a,b);!this.chart.polar&&c[0]==="M"&&(c[0]="L");this.areaPath=this.areaPath.concat(a,c);return l},drawDataLabels:function(){var a=this.data,b=a.length,c,d=[],g=w.prototype,e=this.options.dataLabels,j=e.align,l=e.verticalAlign,i=e.inside,f,
h,n=this.chart.inverted;if(e.enabled||this._hasPointLabels){for(c=b;c--;)if(f=a[c]){h=i?f.plotHigh<f.plotLow:f.plotHigh>f.plotLow;f.y=f.high;f._plotY=f.plotY;f.plotY=f.plotHigh;d[c]=f.dataLabel;f.dataLabel=f.dataLabelUpper;f.below=h;if(n){if(!j)e.align=h?"right":"left"}else if(!l)e.verticalAlign=h?"top":"bottom";e.x=e.xHigh;e.y=e.yHigh}g.drawDataLabels&&g.drawDataLabels.apply(this,arguments);for(c=b;c--;)if(f=a[c]){h=i?f.plotHigh<f.plotLow:f.plotHigh>f.plotLow;f.dataLabelUpper=f.dataLabel;f.dataLabel=
d[c];f.y=f.low;f.plotY=f._plotY;f.below=!h;if(n){if(!j)e.align=h?"left":"right"}else if(!l)e.verticalAlign=h?"bottom":"top";e.x=e.xLow;e.y=e.yLow}g.drawDataLabels&&g.drawDataLabels.apply(this,arguments)}e.align=j;e.verticalAlign=l},alignDataLabel:function(){k.column.prototype.alignDataLabel.apply(this,arguments)},setStackedPoints:r,getSymbol:r,drawPoints:r});o.areasplinerange=t(o.arearange);k.areasplinerange=u(k.arearange,{type:"areasplinerange",getPointSpline:k.spline.prototype.getPointSpline});
(function(){var a=k.column.prototype;o.columnrange=t(o.column,o.arearange,{lineWidth:1,pointRange:null});k.columnrange=u(k.arearange,{type:"columnrange",translate:function(){var b=this,c=b.yAxis,d=b.xAxis,g=b.chart,e;a.translate.apply(b);s(b.points,function(a){var l=a.shapeArgs,i=b.options.minPointLength,f,h;a.plotHigh=e=c.translate(a.high,0,1,0,1);a.plotLow=a.plotY;h=e;f=a.plotY-e;Math.abs(f)<i?(i-=f,f+=i,h-=i/2):f<0&&(f*=-1,h-=f);l.height=f;l.y=h;a.tooltipPos=g.inverted?[c.len+c.pos-g.plotLeft-
h-f/2,d.len+d.pos-g.plotTop-l.x-l.width/2,f]:[d.left-g.plotLeft+l.x+l.width/2,c.pos-g.plotTop+h+f/2,f]})},directTouch:!0,trackerGroups:["group","dataLabelsGroup"],drawGraph:r,crispCol:a.crispCol,pointAttrToOptions:a.pointAttrToOptions,drawPoints:a.drawPoints,drawTracker:a.drawTracker,animate:a.animate,getColumnMetrics:a.getColumnMetrics})})();o.gauge=t(o.line,{dataLabels:{enabled:!0,defer:!1,y:15,borderWidth:1,borderColor:"silver",borderRadius:3,crop:!1,verticalAlign:"top",zIndex:2},dial:{},pivot:{},
tooltip:{headerFormat:""},showInLegend:!1});B={type:"gauge",pointClass:u(G,{setState:function(a){this.state=a}}),angular:!0,drawGraph:r,fixedBox:!0,forceDL:!0,trackerGroups:["group","dataLabelsGroup"],translate:function(){var a=this.yAxis,b=this.options,c=a.center;this.generatePoints();s(this.points,function(d){var g=t(b.dial,d.dial),e=A(q(g.radius,80))*c[2]/200,j=A(q(g.baseLength,70))*e/100,l=A(q(g.rearLength,10))*e/100,i=g.baseWidth||3,f=g.topWidth||1,h=b.overshoot,n=a.startAngleRad+a.translate(d.y,
null,null,null,!0);h&&typeof h==="number"?(h=h/180*Math.PI,n=Math.max(a.startAngleRad-h,Math.min(a.endAngleRad+h,n))):b.wrap===!1&&(n=Math.max(a.startAngleRad,Math.min(a.endAngleRad,n)));n=n*180/Math.PI;d.shapeType="path";d.shapeArgs={d:g.path||["M",-l,-i/2,"L",j,-i/2,e,-f/2,e,f/2,j,i/2,-l,i/2,"z"],translateX:c[0],translateY:c[1],rotation:n};d.plotX=c[0];d.plotY=c[1]})},drawPoints:function(){var a=this,b=a.yAxis.center,c=a.pivot,d=a.options,g=d.pivot,e=a.chart.renderer;s(a.points,function(b){var g=
b.graphic,c=b.shapeArgs,f=c.d,h=t(d.dial,b.dial);g?(g.animate(c),c.d=f):b.graphic=e[b.shapeType](c).attr({stroke:h.borderColor||"none","stroke-width":h.borderWidth||0,fill:h.backgroundColor||"black",rotation:c.rotation,zIndex:1}).add(a.group)});c?c.animate({translateX:b[0],translateY:b[1]}):a.pivot=e.circle(0,0,q(g.radius,5)).attr({"stroke-width":g.borderWidth||0,stroke:g.borderColor||"silver",fill:g.backgroundColor||"black",zIndex:2}).translate(b[0],b[1]).add(a.group)},animate:function(a){var b=
this;if(!a)s(b.points,function(a){var d=a.graphic;d&&(d.attr({rotation:b.yAxis.startAngleRad*180/Math.PI}),d.animate({rotation:a.shapeArgs.rotation},b.options.animation))}),b.animate=null},render:function(){this.group=this.plotGroup("group","series",this.visible?"visible":"hidden",this.options.zIndex,this.chart.seriesGroup);w.prototype.render.call(this);this.group.clip(this.chart.clipRect)},setData:function(a,b){w.prototype.setData.call(this,a,!1);this.processData();this.generatePoints();q(b,!0)&&
this.chart.redraw()},drawTracker:B&&B.drawTrackerPoint};k.gauge=u(k.line,B);o.boxplot=t(o.column,{fillColor:"#FFFFFF",lineWidth:1,medianWidth:2,states:{hover:{brightness:-0.3}},threshold:null,tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> <b> {series.name}</b><br/>Maximum: {point.high}<br/>Upper quartile: {point.q3}<br/>Median: {point.median}<br/>Lower quartile: {point.q1}<br/>Minimum: {point.low}<br/>'},whiskerLength:"50%",whiskerWidth:2});k.boxplot=u(k.column,{type:"boxplot",
pointArrayMap:["low","q1","median","q3","high"],toYData:function(a){return[a.low,a.q1,a.median,a.q3,a.high]},pointValKey:"high",pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth"},drawDataLabels:r,translate:function(){var a=this.yAxis,b=this.pointArrayMap;k.column.prototype.translate.apply(this);s(this.points,function(c){s(b,function(b){c[b]!==null&&(c[b+"Plot"]=a.translate(c[b],0,1,0,1))})})},drawPoints:function(){var a=this,b=a.options,c=a.chart.renderer,d,g,e,j,l,i,
f,h,n,k,m,H,I,o,t,r,v,u,w,x,B,A,y=a.doQuartiles!==!1,z,D=a.options.whiskerLength;s(a.points,function(p){n=p.graphic;B=p.shapeArgs;m={};o={};r={};A=p.color||a.color;if(p.plotY!==void 0)if(d=p.pointAttr[p.selected?"selected":""],v=B.width,u=C(B.x),w=u+v,x=E(v/2),g=C(y?p.q1Plot:p.lowPlot),e=C(y?p.q3Plot:p.lowPlot),j=C(p.highPlot),l=C(p.lowPlot),m.stroke=p.stemColor||b.stemColor||A,m["stroke-width"]=q(p.stemWidth,b.stemWidth,b.lineWidth),m.dashstyle=p.stemDashStyle||b.stemDashStyle,o.stroke=p.whiskerColor||
b.whiskerColor||A,o["stroke-width"]=q(p.whiskerWidth,b.whiskerWidth,b.lineWidth),r.stroke=p.medianColor||b.medianColor||A,r["stroke-width"]=q(p.medianWidth,b.medianWidth,b.lineWidth),f=m["stroke-width"]%2/2,h=u+x+f,k=["M",h,e,"L",h,j,"M",h,g,"L",h,l],y&&(f=d["stroke-width"]%2/2,h=C(h)+f,g=C(g)+f,e=C(e)+f,u+=f,w+=f,H=["M",u,e,"L",u,g,"L",w,g,"L",w,e,"L",u,e,"z"]),D&&(f=o["stroke-width"]%2/2,j+=f,l+=f,z=/%$/.test(D)?x*parseFloat(D)/100:D/2,I=["M",h-z,j,"L",h+z,j,"M",h-z,l,"L",h+z,l]),f=r["stroke-width"]%
2/2,i=E(p.medianPlot)+f,t=["M",u,i,"L",w,i],n)p.stem.animate({d:k}),D&&p.whiskers.animate({d:I}),y&&p.box.animate({d:H}),p.medianShape.animate({d:t});else{p.graphic=n=c.g().add(a.group);p.stem=c.path(k).attr(m).add(n);if(D)p.whiskers=c.path(I).attr(o).add(n);if(y)p.box=c.path(H).attr(d).add(n);p.medianShape=c.path(t).attr(r).add(n)}})},setStackedPoints:r});o.errorbar=t(o.boxplot,{color:"#000000",grouping:!1,linkedTo:":previous",tooltip:{pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'},
whiskerWidth:null});k.errorbar=u(k.boxplot,{type:"errorbar",pointArrayMap:["low","high"],toYData:function(a){return[a.low,a.high]},pointValKey:"high",doQuartiles:!1,drawDataLabels:k.arearange?k.arearange.prototype.drawDataLabels:r,getColumnMetrics:function(){return this.linkedParent&&this.linkedParent.columnMetrics||k.column.prototype.getColumnMetrics.call(this)}});o.waterfall=t(o.column,{lineWidth:1,lineColor:"#333",dashStyle:"dot",borderColor:"#333",dataLabels:{inside:!0},states:{hover:{lineWidthPlus:0}}});
k.waterfall=u(k.column,{type:"waterfall",upColorProp:"fill",pointValKey:"y",translate:function(){var a=this.options,b=this.yAxis,c,d,g,e,j,l,i,f,h,n=q(a.minPointLength,5),m=a.threshold,o=a.stacking;k.column.prototype.translate.apply(this);this.minPointLengthOffset=0;i=f=m;d=this.points;for(c=0,a=d.length;c<a;c++){g=d[c];l=this.processedYData[c];e=g.shapeArgs;h=(j=o&&b.stacks[(this.negStacks&&l<m?"-":"")+this.stackKey])?j[g.x].points[this.index+","+c]:[0,l];if(g.isSum)g.y=l;else if(g.isIntermediateSum)g.y=
l-f;j=M(i,i+g.y)+h[0];e.y=b.translate(j,0,1);if(g.isSum)e.y=b.translate(h[1],0,1),e.height=Math.min(b.translate(h[0],0,1),b.len)-e.y+this.minPointLengthOffset;else if(g.isIntermediateSum)e.y=b.translate(h[1],0,1),e.height=Math.min(b.translate(f,0,1),b.len)-e.y+this.minPointLengthOffset,f=h[1];else{if(i!==0)e.height=l>0?b.translate(i,0,1)-e.y:b.translate(i,0,1)-b.translate(i-l,0,1);i+=l}e.height<0&&(e.y+=e.height,e.height*=-1);g.plotY=e.y=E(e.y)-this.borderWidth%2/2;e.height=M(E(e.height),0.001);g.yBottom=
e.y+e.height;if(e.height<=n)e.height=n,this.minPointLengthOffset+=n;e.y-=this.minPointLengthOffset;e=g.plotY+(g.negative?e.height:0)-this.minPointLengthOffset;this.chart.inverted?g.tooltipPos[0]=b.len-e:g.tooltipPos[1]=e}},processData:function(a){var b=this.yData,c=this.options.data,d,g=b.length,e,j,l,i,f,h;j=e=l=i=this.options.threshold||0;for(h=0;h<g;h++)f=b[h],d=c&&c[h]?c[h]:{},f==="sum"||d.isSum?b[h]=j:f==="intermediateSum"||d.isIntermediateSum?b[h]=e:(j+=f,e+=f),l=Math.min(j,l),i=Math.max(j,
i);w.prototype.processData.call(this,a);this.dataMin=l;this.dataMax=i},toYData:function(a){return a.isSum?a.x===0?null:"sum":a.isIntermediateSum?a.x===0?null:"intermediateSum":a.y},getAttribs:function(){k.column.prototype.getAttribs.apply(this,arguments);var a=this,b=a.options,c=b.states,d=b.upColor||a.color,b=m.Color(d).brighten(0.1).get(),g=t(a.pointAttr),e=a.upColorProp;g[""][e]=d;g.hover[e]=c.hover.upColor||b;g.select[e]=c.select.upColor||d;s(a.points,function(e){if(!e.options.color)e.y>0?(e.pointAttr=
g,e.color=d):e.pointAttr=a.pointAttr})},getGraphPath:function(){var a=this.data,b=a.length,c=E(this.options.lineWidth+this.borderWidth)%2/2,d=[],g,e,j;for(j=1;j<b;j++)e=a[j].shapeArgs,g=a[j-1].shapeArgs,e=["M",g.x+g.width,g.y+c,"L",e.x,g.y+c],a[j-1].y<0&&(e[2]+=g.height,e[5]+=g.height),d=d.concat(e);return d},getExtremes:r,drawGraph:w.prototype.drawGraph});o.polygon=t(o.scatter,{marker:{enabled:!1}});k.polygon=u(k.scatter,{type:"polygon",fillGraph:!0,getSegmentPath:function(a){return w.prototype.getSegmentPath.call(this,
a).concat("z")},drawGraph:w.prototype.drawGraph,drawLegendSymbol:m.LegendSymbolMixin.drawRectangle});o.bubble=t(o.scatter,{dataLabels:{formatter:function(){return this.point.z},inside:!0,verticalAlign:"middle"},marker:{lineColor:null,lineWidth:1},minSize:8,maxSize:"20%",softThreshold:!1,states:{hover:{halo:{size:5}}},tooltip:{pointFormat:"({point.x}, {point.y}), Size: {point.z}"},turboThreshold:0,zThreshold:0,zoneAxis:"z"});B=u(G,{haloPath:function(){return G.prototype.haloPath.call(this,this.shapeArgs.r+
this.series.options.states.hover.halo.size)},ttBelow:!1});k.bubble=u(k.scatter,{type:"bubble",pointClass:B,pointArrayMap:["y","z"],parallelArrays:["x","y","z"],trackerGroups:["group","dataLabelsGroup"],bubblePadding:!0,zoneAxis:"z",pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor"},applyOpacity:function(a){var b=this.options.marker,c=q(b.fillOpacity,0.5),a=a||b.fillColor||this.color;c!==1&&(a=T(a).setOpacity(c).get("rgba"));return a},convertAttribs:function(){var a=
w.prototype.convertAttribs.apply(this,arguments);a.fill=this.applyOpacity(a.fill);return a},getRadii:function(a,b,c,d){var g,e,j,l=this.zData,i=[],f=this.options,h=f.sizeBy!=="width",n=f.zThreshold,k=b-a;for(e=0,g=l.length;e<g;e++)j=l[e],f.sizeByAbsoluteValue&&j!==null&&(j=Math.abs(j-n),b=Math.max(b-n,Math.abs(a-n)),a=0),j===null?j=null:j<a?j=c/2-1:(j=k>0?(j-a)/k:0.5,h&&j>=0&&(j=Math.sqrt(j)),j=x.ceil(c+j*(d-c))/2),i.push(j);this.radii=i},animate:function(a){var b=this.options.animation;if(!a)s(this.points,
function(a){var d=a.graphic,a=a.shapeArgs;d&&a&&(d.attr("r",1),d.animate({r:a.r},b))}),this.animate=null},translate:function(){var a,b=this.data,c,d,g=this.radii;k.scatter.prototype.translate.call(this);for(a=b.length;a--;)c=b[a],d=g?g[a]:0,typeof d==="number"&&d>=this.minPxSize/2?(c.shapeType="circle",c.shapeArgs={x:c.plotX,y:c.plotY,r:d},c.dlBox={x:c.plotX-d,y:c.plotY-d,width:2*d,height:2*d}):c.shapeArgs=c.plotY=c.dlBox=void 0},drawLegendSymbol:function(a,b){var c=this.chart.renderer,d=c.fontMetrics(a.itemStyle.fontSize).f/
2;b.legendSymbol=c.circle(d,a.baseline-d,d).attr({zIndex:3}).add(b.legendGroup);b.legendSymbol.isMarker=!0},drawPoints:k.column.prototype.drawPoints,alignDataLabel:k.column.prototype.alignDataLabel,buildKDTree:r,applyZones:r});L.prototype.beforePadding=function(){var a=this,b=this.len,c=this.chart,d=0,g=b,e=this.isXAxis,j=e?"xData":"yData",l=this.min,i={},f=x.min(c.plotWidth,c.plotHeight),h=Number.MAX_VALUE,n=-Number.MAX_VALUE,k=this.max-l,m=b/k,o=[];s(this.series,function(b){var g=b.options;if(b.bubblePadding&&
(b.visible||!c.options.chart.ignoreHiddenSeries))if(a.allowZoomOutside=!0,o.push(b),e)s(["minSize","maxSize"],function(a){var b=g[a],e=/%$/.test(b),b=A(b);i[a]=e?f*b/100:b}),b.minPxSize=i.minSize,b.maxPxSize=i.maxSize,b=b.zData,b.length&&(h=q(g.zMin,x.min(h,x.max(O(b),g.displayNegative===!1?g.zThreshold:-Number.MAX_VALUE))),n=q(g.zMax,x.max(n,P(b))))});s(o,function(a){var b=a[j],c=b.length,f;e&&a.getRadii(h,n,a.minPxSize,a.maxPxSize);if(k>0)for(;c--;)typeof b[c]==="number"&&(f=a.radii[c],d=Math.min((b[c]-
l)*m-f,d),g=Math.max((b[c]-l)*m+f,g))});o.length&&k>0&&!this.isLog&&(g-=b,m*=(b+d-g)/b,s([["min","userMin",d],["max","userMax",g]],function(b){q(a.options[b[0]],a[b[1]])===void 0&&(a[b[0]]+=b[2]/m)}))};(function(){function a(a,b){var c=this.chart,d=this.options.animation,i=this.group,f=this.markerGroup,h=this.xAxis.center,n=c.plotLeft,k=c.plotTop;if(c.polar){if(c.renderer.isSVG)d===!0&&(d={}),b?(c={translateX:h[0]+n,translateY:h[1]+k,scaleX:0.001,scaleY:0.001},i.attr(c),f&&f.attr(c)):(c={translateX:n,
translateY:k,scaleX:1,scaleY:1},i.animate(c,d),f&&f.animate(c,d),this.animate=null)}else a.call(this,b)}var b=w.prototype,c=R.prototype,d;b.searchPointByAngle=function(a){var b=this.chart,c=this.xAxis.pane.center;return this.searchKDTree({clientX:180+Math.atan2(a.chartX-c[0]-b.plotLeft,a.chartY-c[1]-b.plotTop)*(-180/Math.PI)})};v(b,"buildKDTree",function(a){if(this.chart.polar)this.kdByAngle?this.searchPoint=this.searchPointByAngle:this.kdDimensions=2;a.apply(this)});b.toXY=function(a){var b,c=this.chart,
d=a.plotX;b=a.plotY;a.rectPlotX=d;a.rectPlotY=b;b=this.xAxis.postTranslate(a.plotX,this.yAxis.len-b);a.plotX=a.polarPlotX=b.x-c.plotLeft;a.plotY=a.polarPlotY=b.y-c.plotTop;this.kdByAngle?(c=(d/Math.PI*180+this.xAxis.pane.options.startAngle)%360,c<0&&(c+=360),a.clientX=c):a.clientX=a.plotX};k.spline&&v(k.spline.prototype,"getPointSpline",function(a,b,c,d){var i,f,h,n,k,m,o;if(this.chart.polar){i=c.plotX;f=c.plotY;a=b[d-1];h=b[d+1];this.connectEnds&&(a||(a=b[b.length-2]),h||(h=b[1]));if(a&&h)n=a.plotX,
k=a.plotY,b=h.plotX,m=h.plotY,n=(1.5*i+n)/2.5,k=(1.5*f+k)/2.5,h=(1.5*i+b)/2.5,o=(1.5*f+m)/2.5,b=Math.sqrt(Math.pow(n-i,2)+Math.pow(k-f,2)),m=Math.sqrt(Math.pow(h-i,2)+Math.pow(o-f,2)),n=Math.atan2(k-f,n-i),k=Math.atan2(o-f,h-i),o=Math.PI/2+(n+k)/2,Math.abs(n-o)>Math.PI/2&&(o-=Math.PI),n=i+Math.cos(o)*b,k=f+Math.sin(o)*b,h=i+Math.cos(Math.PI+o)*m,o=f+Math.sin(Math.PI+o)*m,c.rightContX=h,c.rightContY=o;d?(c=["C",a.rightContX||a.plotX,a.rightContY||a.plotY,n||i,k||f,i,f],a.rightContX=a.rightContY=null):
c=["M",i,f]}else c=a.call(this,b,c,d);return c});v(b,"translate",function(a){var b=this.chart;a.call(this);if(b.polar&&(this.kdByAngle=b.tooltip&&b.tooltip.shared,!this.preventPostTranslate)){a=this.points;for(b=a.length;b--;)this.toXY(a[b])}});v(b,"getGraphPath",function(a,b){var c=this;if(this.chart.polar){b=b||this.points;if(this.options.connectEnds!==!1&&b[0].y!==null)this.connectEnds=!0,b.splice(b.length,0,b[0]);s(b,function(a){a.polarPlotY===void 0&&c.toXY(a)})}return a.apply(this,[].slice.call(arguments,
1))});v(b,"animate",a);if(k.column)d=k.column.prototype,v(d,"animate",a),v(d,"translate",function(a){var b=this.xAxis,c=this.yAxis.len,d=b.center,i=b.startAngleRad,f=this.chart.renderer,h,k;this.preventPostTranslate=!0;a.call(this);if(b.isRadial){b=this.points;for(k=b.length;k--;)h=b[k],a=h.barX+i,h.shapeType="path",h.shapeArgs={d:f.symbols.arc(d[0],d[1],c-h.plotY,null,{start:a,end:a+h.pointWidth,innerR:c-q(h.yBottom,c)})},this.toXY(h),h.tooltipPos=[h.plotX,h.plotY],h.ttBelow=h.plotY>d[1]}}),v(d,
"alignDataLabel",function(a,c,d,l,i,f){if(this.chart.polar){a=c.rectPlotX/Math.PI*180;if(l.align===null)l.align=a>20&&a<160?"left":a>200&&a<340?"right":"center";if(l.verticalAlign===null)l.verticalAlign=a<45||a>315?"bottom":a>135&&a<225?"top":"middle";b.alignDataLabel.call(this,c,d,l,i,f)}else a.call(this,c,d,l,i,f)});v(c,"getCoordinates",function(a,b){var c=this.chart,d={xAxis:[],yAxis:[]};c.polar?s(c.axes,function(a){var f=a.isXAxis,g=a.center,k=b.chartX-g[0]-c.plotLeft,g=b.chartY-g[1]-c.plotTop;
d[f?"xAxis":"yAxis"].push({axis:a,value:a.translate(f?Math.PI-Math.atan2(k,g):Math.sqrt(Math.pow(k,2)+Math.pow(g,2)),!0)})}):d=a.call(this,b);return d})})()});
/*
 Highcharts JS v4.2.3 (2016-02-08)

 (c) 2009-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(E,X){typeof module==="object"&&module.exports?module.exports=E.document?X(E):X:E.Highcharts=X(E)})(typeof window!=="undefined"?window:this,function(E){function X(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw Error(c);E.console&&console.log(c)}function pb(a,b,c){this.options=b;this.elem=a;this.prop=c}function D(){var a,b=arguments,c,d={},e=function(a,b){var c,d;typeof a!=="object"&&(a={});for(d in b)b.hasOwnProperty(d)&&(c=b[d],a[d]=c&&typeof c==="object"&&
Object.prototype.toString.call(c)!=="[object Array]"&&d!=="renderTo"&&typeof c.nodeType!=="number"?e(a[d]||{},c):b[d]);return a};b[0]===!0&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function C(a,b){return parseInt(a,b||10)}function xa(a){return typeof a==="string"}function Y(a){return a&&typeof a==="object"}function Ia(a){return Object.prototype.toString.call(a)==="[object Array]"}function ma(a){return typeof a==="number"}function Da(a){return W.log(a)/
W.LN10}function na(a){return W.pow(10,a)}function oa(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function q(a){return a!==z&&a!==null}function K(a,b,c){var d,e;if(xa(b))q(c)?a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(q(b)&&Y(b))for(d in b)a.setAttribute(d,b[d]);return e}function ta(a){return Ia(a)?a:[a]}function Pa(a,b,c){if(b)return setTimeout(a,b,c);a.call(0,c)}function L(a,b){if(ya&&!ca&&b&&b.opacity!==z)b.filter="alpha(opacity="+b.opacity*100+")";u(a.style,
b)}function Z(a,b,c,d,e){a=y.createElement(a);b&&u(a,b);e&&L(a,{padding:0,border:"none",margin:0});c&&L(a,c);d&&d.appendChild(a);return a}function pa(a,b){var c=function(){};c.prototype=new a;u(c.prototype,b);return c}function Ja(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function Ya(a){return(Za&&Za(a)||qb||0)*6E4}function Ka(a,b){for(var c="{",d=!1,e,f,g,h,i,k=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];
if(f.length)f=f.join(":"),g=/\.([0-9])/,h=N.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:-1,e!==null&&(e=B.numberFormat(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:""))):e=Qa(f,e)}k.push(e);a=a.slice(c+1);c=(d=!d)?"}":"{"}k.push(a);return k.join("")}function rb(a){return W.pow(10,T(W.log(a)/W.LN10))}function sb(a,b,c,d,e){var f,g=a,c=p(c,1);f=a/c;b||(b=[1,2,2.5,5,10],d===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(g=b[d],e&&g*c>=a||!e&&f<=(b[d]+(b[d+1]||b[d]))/
2)break;g*=c;return g}function ib(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].safeI=e;a.sort(function(a,c){d=b(a,c);return d===0?a.safeI-c.safeI:d});for(e=0;e<c;e++)delete a[e].safeI}function Ra(a){for(var b=a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Ea(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Sa(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Ta(a){jb||(jb=Z(La));a&&jb.appendChild(a);jb.innerHTML=""}function fa(a,b){return parseFloat(a.toPrecision(b||
14))}function Ua(a,b){b.renderer.globalAnimation=p(a,b.animation)}function Fb(){var a=N.global,b=a.useUTC,c=b?"getUTC":"get",d=b?"setUTC":"set";qa=a.Date||E.Date;qb=b&&a.timezoneOffset;Za=b&&a.getTimezoneOffset;kb=function(a,c,d,h,i,k){var j;b?(j=qa.UTC.apply(0,arguments),j+=Ya(j)):j=(new qa(a,c,p(d,1),p(h,0),p(i,0),p(k,0))).getTime();return j};tb=c+"Minutes";ub=c+"Hours";vb=c+"Day";$a=c+"Date";ab=c+"Month";bb=c+"FullYear";Gb=d+"Milliseconds";Hb=d+"Seconds";Ib=d+"Minutes";Jb=d+"Hours";wb=d+"Date";
xb=d+"Month";yb=d+"FullYear"}function ia(a){if(!(this instanceof ia))return new ia(a);this.init(a)}function O(){}function Va(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function Kb(a,b,c,d,e){var f=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.total=null;this.points={};this.stack=e;this.rightCliff=this.leftCliff=0;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":
"top"),y:p(b.y,f?4:c?14:-6),x:p(b.x,f?c?-6:6:0)};this.textAlign=b.textAlign||(f?c?"right":"left":"center")}var z,y=E.document,W=Math,A=W.round,T=W.floor,ua=W.ceil,t=W.max,F=W.min,P=W.abs,U=W.cos,$=W.sin,ra=W.PI,ga=ra*2/360,za=E.navigator&&E.navigator.userAgent||"",Lb=E.opera,ya=/(msie|trident|edge)/i.test(za)&&!Lb,lb=y&&y.documentMode===8,mb=!ya&&/AppleWebKit/.test(za),Ma=/Firefox/.test(za),Mb=/(Mobile|Android|Windows Phone)/.test(za),Fa="http://www.w3.org/2000/svg",ca=y&&y.createElementNS&&!!y.createElementNS(Fa,
"svg").createSVGRect,Qb=Ma&&parseInt(za.split("Firefox/")[1],10)<4,ha=y&&!ca&&!ya&&!!y.createElement("canvas").getContext,cb,db,Nb={},zb=0,jb,N,Qa,G,Aa=function(){},S=[],eb=0,La="div",Rb=/^[0-9]+$/,nb=["plotTop","marginRight","marginBottom","plotLeft"],qa,kb,qb,Za,tb,ub,vb,$a,ab,bb,Gb,Hb,Ib,Jb,wb,xb,yb,I={},B;B=E.Highcharts?X(16,!0):{win:E};B.seriesTypes=I;var Ga=[],ja,sa,o,Na,Ab,Ba,M,V,H,Wa,Oa;pb.prototype={dSetter:function(){var a=this.paths[0],b=this.paths[1],c=[],d=this.now,e=a.length,f;if(d===
1)c=this.toD;else if(e===b.length&&d<1)for(;e--;)f=parseFloat(a[e]),c[e]=isNaN(f)?a[e]:d*parseFloat(b[e]-f)+f;else c=b;this.elem.attr("d",c)},update:function(){var a=this.elem,b=this.prop,c=this.now,d=this.options.step;if(this[b+"Setter"])this[b+"Setter"]();else a.attr?a.element&&a.attr(b,c):a.style[b]=c+this.unit;d&&d.call(a,c,this)},run:function(a,b,c){var d=this,e=function(a){return e.stopped?!1:d.step(a)},f;this.startTime=+new qa;this.start=a;this.end=b;this.unit=c;this.now=this.start;this.pos=
0;e.elem=this.elem;if(e()&&Ga.push(e)===1)e.timerId=setInterval(function(){for(f=0;f<Ga.length;f++)Ga[f]()||Ga.splice(f--,1);Ga.length||clearInterval(e.timerId)},13)},step:function(a){var b=+new qa,c,d=this.options;c=this.elem;var e=d.complete,f=d.duration,g=d.curAnim,h;if(c.attr&&!c.element)c=!1;else if(a||b>=f+this.startTime){this.now=this.end;this.pos=1;this.update();a=g[this.prop]=!0;for(h in g)g[h]!==!0&&(a=!1);a&&e&&e.call(c);c=!1}else this.pos=d.easing((b-this.startTime)/f),this.now=this.start+
(this.end-this.start)*this.pos,this.update(),c=!0;return c},initPath:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h=a.isArea,i=h?2:1,k=function(a){for(g=a.length;g--;)(a[g]==="M"||a[g]==="L")&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(k(b),k(c));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=c.slice(0,f).concat(c),h&&(c=c.concat(c.slice(c.length-f)));a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=b.slice().splice(b.length/i-f,f*i),
e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),[].splice.apply(b,[b.length/i,0].concat(d));return[b,c]}};var u=B.extend=function(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a},p=B.pick=function(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],c!==z&&c!==null)return c},fb=B.wrap=function(a,b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}};Qa=function(a,b,c){if(!q(b)||isNaN(b))return N.lang.invalidDate||"";var a=p(a,"%Y-%m-%d %H:%M:%S"),
d=new qa(b-Ya(b)),e,f=d[ub](),g=d[vb](),h=d[$a](),i=d[ab](),k=d[bb](),j=N.lang,l=j.weekdays,d=u({a:l[g].substr(0,3),A:l[g],d:Ja(h),e:h,w:g,b:j.shortMonths[i],B:j.months[i],m:Ja(i+1),y:k.toString().substr(2,2),Y:k,H:Ja(f),k:f,I:Ja(f%12||12),l:f%12||12,M:Ja(d[tb]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Ja(d.getSeconds()),L:Ja(A(b%1E3),3)},B.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]==="function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+a.substr(1):a};
G={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5,month:24192E5,year:314496E5};B.numberFormat=function(a,b,c,d){var a=+a||0,e=N.lang,f=(a.toString().split(".")[1]||"").length,g,h,i=Math.abs(a);b===-1?b=Math.min(f,20):isNaN(b)&&(b=2);g=String(C(i.toFixed(b)));h=g.length>3?g.length%3:0;c=p(c,e.decimalPoint);d=p(d,e.thousandsSep);a=a<0?"-":"";a+=h?g.substr(0,h)+d:"";a+=g.substr(h).replace(/(\d{3})(?=\d)/g,"$1"+d);+b&&(d=Math.abs(i-g+Math.pow(10,-Math.max(b,f)-1)),a+=c+d.toFixed(b).slice(2));
return a};Math.easeInOutSine=function(a){return-0.5*(Math.cos(Math.PI*a)-1)};ja=function(a,b){var c;if(b==="width")return Math.min(a.offsetWidth,a.scrollWidth)-ja(a,"padding-left")-ja(a,"padding-right");else if(b==="height")return Math.min(a.offsetHeight,a.scrollHeight)-ja(a,"padding-top")-ja(a,"padding-bottom");return(c=E.getComputedStyle(a,void 0))&&C(c.getPropertyValue(b))};sa=function(a,b){return b.indexOf?b.indexOf(a):[].indexOf.call(b,a)};Na=function(a,b){return[].filter.call(a,b)};Ba=function(a,
b){for(var c=[],d=0,e=a.length;d<e;d++)c[d]=b.call(a[d],a[d],d,a);return c};Ab=function(a){var b=y.documentElement,a=a.getBoundingClientRect();return{top:a.top+(E.pageYOffset||b.scrollTop)-(b.clientTop||0),left:a.left+(E.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}};Oa=function(a){for(var b=Ga.length;b--;)if(Ga[b].elem===a)Ga[b].stopped=!0};o=function(a,b){return Array.prototype.forEach.call(a,b)};M=function(a,b,c){function d(b){b.target=b.srcElement||E;c.call(a,b)}var e=a.hcEvents=a.hcEvents||{};
if(a.addEventListener)a.addEventListener(b,c,!1);else if(a.attachEvent){if(!a.hcEventsIE)a.hcEventsIE={};a.hcEventsIE[c.toString()]=d;a.attachEvent("on"+b,d)}e[b]||(e[b]=[]);e[b].push(c)};V=function(a,b,c){function d(b,c){a.removeEventListener?a.removeEventListener(b,c,!1):a.attachEvent&&(c=a.hcEventsIE[c.toString()],a.detachEvent("on"+b,c))}function e(){var c,e,f;if(a.nodeName)for(f in b?(c={},c[b]=!0):c=g,c)if(g[f])for(e=g[f].length;e--;)d(f,g[f][e])}var f,g=a.hcEvents,h;if(g)b?(f=g[b]||[],c?(h=
sa(c,f),h>-1&&(f.splice(h,1),g[b]=f),d(b,c)):(e(),g[b]=[])):(e(),a.hcEvents={})};H=function(a,b,c,d){var e;e=a.hcEvents;var f,g,h,i,c=c||{};if(y.createEvent&&(a.dispatchEvent||a.fireEvent))e=y.createEvent("Events"),e.initEvent(b,!0,!0),e.target=a,u(e,c),a.dispatchEvent?a.dispatchEvent(e):a.fireEvent(b,e);else if(e){e=e[b]||[];f=e.length;h=function(){c.defaultPrevented=!0};for(g=0;g<f;g++){i=e[g];if(c.stopped)return;c.preventDefault=h;c.target=a;if(!c.type)c.type=b;i.call(a,c)===!1&&c.preventDefault()}}d&&
!c.defaultPrevented&&d(c)};Wa=function(a,b,c){var d,e="",f,g,h;Y(c)||(d=arguments,c={duration:d[2],easing:d[3],complete:d[4]});if(!ma(c.duration))c.duration=400;c.easing=Math[c.easing]||Math.easeInOutSine;c.curAnim=D(b);for(h in b)g=new pb(a,c,h),f=null,h==="d"?(g.paths=g.initPath(a,a.d,b.d),g.toD=b.d,d=0,f=1):a.attr?d=a.attr(h):(d=parseFloat(ja(a,h))||0,h!=="opacity"&&(e="px")),f||(f=b[h]),f.match&&f.match("px")&&(f=f.replace(/px/g,"")),g.run(d,f,e)};if(E.jQuery)E.jQuery.fn.highcharts=function(){var a=
[].slice.call(arguments);if(this[0])return a[0]?(new (B[xa(a[0])?a.shift():"Chart"])(this[0],a[0],a[1]),this):S[K(this[0],"data-highcharts-chart")]};y&&!y.defaultView&&(ja=function(a,b){var c;c={width:"clientWidth",height:"clientHeight"}[b];if(a.style[b])return C(a.style[b]);b==="opacity"&&(b="filter");if(c)return a.style.zoom=1,a[c]-2*ja(a,"padding");c=a.currentStyle[b.replace(/\-(\w)/g,function(a,b){return b.toUpperCase()})];b==="filter"&&(c=c.replace(/alpha\(opacity=([0-9]+)\)/,function(a,b){return b/
100}));return c===""?1:C(c)});Array.prototype.forEach||(o=function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c});Array.prototype.indexOf||(sa=function(a,b){var c,d=0;if(b)for(c=b.length;d<c;d++)if(b[d]===a)return d;return-1});Array.prototype.filter||(Na=function(a,b){for(var c=[],d=0,e=a.length;d<e;d++)b(a[d],d)&&c.push(a[d]);return c});B.Fx=pb;B.inArray=sa;B.each=o;B.grep=Na;B.offset=Ab;B.map=Ba;B.addEvent=M;B.removeEvent=V;B.fireEvent=H;B.animate=Wa;B.stop=Oa;N={colors:"#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#2b908f,#f45b5b,#91e8e1".split(","),
symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:" "},global:{useUTC:!0,
canvasToolsURL:"http://code.highcharts.com/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/4.2.3/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"}},subtitle:{text:"",
align:"center",style:{color:"#555555"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0,lineWidthPlus:1,radiusPlus:2},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:{align:"center",formatter:function(){return this.y===null?"":B.numberFormat(this.y,-1)},style:{color:"contrast",fontSize:"11px",fontWeight:"bold",textShadow:"0 0 6px contrast, 0 0 3px contrast"},
verticalAlign:"bottom",x:0,y:0,padding:5},cropThreshold:300,pointRange:0,softThreshold:!0,states:{hover:{lineWidthPlus:1,marker:{},halo:{size:10,opacity:0.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",
fontWeight:"bold"},itemHoverStyle:{color:"#000"},itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"45%"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ca,backgroundColor:"rgba(249, 249, 249, .85)",borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",
second:"%A, %b %e, %H:%M:%S",minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},footerFormat:"",headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{point.color}">\u25cf</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:Mb?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",pointerEvents:"none",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",
href:"http://www.highcharts.com",position:{align:"right",x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var aa=N.plotOptions,da=aa.line;Fb();ia.prototype={parsers:[{regex:/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,parse:function(a){return[C(a[1]),C(a[2]),C(a[3]),parseFloat(a[4],10)]}},{regex:/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,parse:function(a){return[C(a[1],16),C(a[2],16),C(a[3],16),
1]}},{regex:/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,parse:function(a){return[C(a[1]),C(a[2]),C(a[3]),1]}}],init:function(a){var b,c,d,e;if((this.input=a)&&a.stops)this.stops=Ba(a.stops,function(a){return new ia(a[1])});else for(d=this.parsers.length;d--&&!c;)e=this.parsers[d],(b=e.regex.exec(a))&&(c=e.parse(b));this.rgba=c||[]},get:function(a){var b=this.input,c=this.rgba,d;this.stops?(d=D(b),d.stops=[].concat(d.stops),o(this.stops,function(b,c){d.stops[c]=[d.stops[c][0],
b.get(a)]})):d=c&&!isNaN(c[0])?a==="rgb"||!a&&c[3]===1?"rgb("+c[0]+","+c[1]+","+c[2]+")":a==="a"?c[3]:"rgba("+c.join(",")+")":b;return d},brighten:function(a){var b,c=this.rgba;if(this.stops)o(this.stops,function(b){b.brighten(a)});else if(ma(a)&&a!==0)for(b=0;b<3;b++)c[b]+=C(a*255),c[b]<0&&(c[b]=0),c[b]>255&&(c[b]=255);return this},setOpacity:function(a){this.rgba[3]=a;return this}};O.prototype={opacity:1,textProps:"direction,fontSize,fontWeight,fontFamily,fontStyle,color,lineHeight,width,textDecoration,textOverflow,textShadow".split(","),
init:function(a,b){this.element=b==="span"?Z(b):y.createElementNS(Fa,b);this.renderer=a},animate:function(a,b,c){b=p(b,this.renderer.globalAnimation,!0);Oa(this);if(b){b=D(b,{});if(c)b.complete=c;Wa(this,a,b)}else this.attr(a,null,c);return this},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,i,k,j,l,m,n,r,s=[],p;a.linearGradient?f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];i=d.gradients;j=a.stops;n=c.radialReference;Ia(g)&&(a[f]=g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],
gradientUnits:"userSpaceOnUse"});f==="radialGradient"&&n&&!q(g.gradientUnits)&&(h=g,g=D(g,d.getRadialAttr(n,h),{gradientUnits:"userSpaceOnUse"}));for(r in g)r!=="id"&&s.push(r,g[r]);for(r in j)s.push(j[r]);s=s.join(",");i[s]?n=i[s].attr("id"):(g.id=n="highcharts-"+zb++,i[s]=k=d.createElement(f).attr(g).add(d.defs),k.radAttr=h,k.stops=[],o(j,function(a){a[1].indexOf("rgba")===0?(e=ia(a[1]),l=e.get("rgb"),m=e.get("a")):(l=a[1],m=1);a=d.createElement("stop").attr({offset:a[0],"stop-color":l,"stop-opacity":m}).add(k);
k.stops.push(a)}));p="url("+d.url+"#"+n+")";c.setAttribute(b,p);c.gradient=s;a.toString=function(){return p}}},applyTextShadow:function(a){var b=this.element,c,d=a.indexOf("contrast")!==-1,e={},f=this.renderer.forExport,g=f||b.style.textShadow!==z&&!ya;if(d)e.textShadow=a=a.replace(/contrast/g,this.renderer.getContrast(b.style.fill));if(mb||f)e.textRendering="geometricPrecision";g?this.css(e):(this.fakeTS=!0,this.ySetter=this.xSetter,c=[].slice.call(b.getElementsByTagName("tspan")),o(a.split(/\s?,\s?/g),
function(a){var d=b.firstChild,e,f,a=a.split(" ");e=a[a.length-1];(f=a[a.length-2])&&o(c,function(a,c){var g;c===0&&(a.setAttribute("x",b.getAttribute("x")),c=b.getAttribute("y"),a.setAttribute("y",c||0),c===null&&b.setAttribute("y",0));g=a.cloneNode(1);K(g,{"class":"highcharts-text-shadow",fill:e,stroke:e,"stroke-opacity":1/t(C(f),3),"stroke-width":f,"stroke-linejoin":"round"});b.insertBefore(g,d)})}))},attr:function(a,b,c){var d,e=this.element,f,g=this,h;typeof a==="string"&&b!==z&&(d=a,a={},a[d]=
b);if(typeof a==="string")g=(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(d in a){b=a[d];h=!1;this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(d)&&(f||(this.symbolAttr(a),f=!0),h=!0);if(this.rotation&&(d==="x"||d==="y"))this.doTransform=!0;h||(h=this[d+"Setter"]||this._defaultSetter,h.call(this,b,d,e),this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(d)&&this.updateShadows(d,b,h))}if(this.doTransform)this.updateTransform(),this.doTransform=
!1}c&&c();return g},updateShadows:function(a,b,c){for(var d=this.shadows,e=d.length;e--;)c.call(null,a==="height"?Math.max(b-(d[e].cutHeight||0),0):a==="d"?this.d:b,a,d[e])},addClass:function(a){var b=this.element,c=K(b,"class")||"";c.indexOf(a)===-1&&K(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;o("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=p(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",
a?"url("+this.renderer.url+"#"+a.id+")":"none")},crisp:function(a){var b,c={},d,e=this.strokeWidth||0;d=A(e)%2/2;a.x=T(a.x||this.x||0)+d;a.y=T(a.y||this.y||0)+d;a.width=T((a.width||this.width||0)-2*d);a.height=T((a.height||this.height||0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;if(a&&a.color)a.fill=a.color;if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&d.nodeName.toLowerCase()===
"text"&&C(a.width)||this.textWidth;b&&(a=u(b,c));this.styles=a;e&&(ha||!ca&&this.renderer.forExport)&&delete a.width;if(ya&&!ca)L(this.element,a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+":"+a[f]+";";K(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;db&&a==="click"?(d.ontouchstart=function(a){c.touchEventFired=qa.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(za.indexOf("Android")===
-1||qa.now()-(c.touchEventFired||0)>1100)&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){var b=this.renderer.gradients[this.element.gradient];this.element.radialReference=a;b&&b.radAttr&&b.animate(this.renderer.getRadialAttr(a,b.radAttr));return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,
d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");(q(c)||q(d))&&a.push("scale("+p(c,1)+" "+p(d,1)+")");a.length&&g.setAttribute("transform",a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;
if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||xa(c))this.alignTo=d=c||"renderer",oa(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=p(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];h[b?"translateX":"x"]=A(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=A(g);this[this.placed?
"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(a,b){var c,d=this.renderer,e,f,g,h=this.element,i=this.styles;e=this.textStr;var k,j=h.style,l,m=d.cache,n=d.cacheKeys,r;f=p(b,this.rotation);g=f*ga;e!==z&&(r=["",f||0,i&&i.fontSize,h.style.width].join(","),r=e===""||Rb.test(e)?"num:"+e.toString().length+r:e+r);r&&!a&&(c=m[r]);if(!c){if(h.namespaceURI===Fa||d.forExport){try{l=this.fakeTS&&function(a){o(h.querySelectorAll(".highcharts-text-shadow"),function(b){b.style.display=
a})},Ma&&j.textShadow?(k=j.textShadow,j.textShadow=""):l&&l("none"),c=h.getBBox?u({},h.getBBox()):{width:h.offsetWidth,height:h.offsetHeight},k?j.textShadow=k:l&&l("")}catch(s){}if(!c||c.width<0)c={width:0,height:0}}else c=this.htmlGetBBox();if(d.isSVG){d=c.width;e=c.height;if(ya&&i&&i.fontSize==="11px"&&e.toPrecision(3)==="16.9")c.height=e=14;if(f)c.width=P(e*$(g))+P(d*U(g)),c.height=P(e*U(g))+P(d*$(g))}if(r){for(;n.length>250;)delete m[n.shift()];m[r]||n.push(r);m[r]=c}}return c},show:function(a){return this.attr({visibility:a?
"inherit":"visible"})},hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.attr({y:-9999})}})},add:function(a){var b=this.renderer,c=this.element,d;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);this.added=!0;if(!a||a.handleZ||this.zIndex)d=this.zIndexSetter();d||(a?a.element:b.box).appendChild(c);if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=
a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&b.nodeName==="SPAN"&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;Oa(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&o(c,function(b){a.safeRemoveChild(b)});d&&d.div&&d.div.childNodes.length===0;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,
d=b;a.alignTo&&oa(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,k,j;if(a){i=p(a.width,3);k=(a.opacity||0.15)/i;j=this.parentInverted?"(-1,-1)":"("+p(a.offsetX,1)+", "+p(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;K(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":k*e,"stroke-width":h,transform:"translate"+j,fill:"none"});if(c)K(f,"height",t(K(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):
g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this},xGetter:function(a){this.element.nodeName==="circle"&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=p(this[a],this.element?this.element.getAttribute(a):null,0);/^[\-0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b;if(a=a&&a.toLowerCase()){a=
a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=C(a[b])*this["stroke-width"];a=a.join(",").replace("NaN","none");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,
b,c){this[b]=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=y.createElementNS(Fa,"title"),this.element.appendChild(b));b.appendChild(y.createTextNode(String(p(a),"").replace(/<[^>]*>/g,"")))},textSetter:function(a){if(a!==this.textStr)delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this)},fillSetter:function(a,b,c){typeof a==="string"?c.setAttribute(b,a):a&&this.colorGradient(a,b,c)},visibilitySetter:function(a,b,c){a===
"inherit"?c.removeAttribute(b):c.setAttribute(b,a)},zIndexSetter:function(a,b){var c=this.renderer,d=this.parentGroup,c=(d||c).element||c.box,e,f,g=this.element,h;e=this.added;var i;q(a)&&(g.setAttribute(b,a),a=+a,this[b]===a&&(e=!1),this[b]=a);if(e){if((a=this.zIndex)&&d)d.handleZ=!0;d=c.childNodes;for(i=0;i<d.length&&!h;i++)if(e=d[i],f=K(e,"zIndex"),e!==g&&(C(f)>a||!q(a)&&q(f)))c.insertBefore(g,e),h=!0;h||c.appendChild(g)}return h},_defaultSetter:function(a,b,c){c.setAttribute(b,a)}};O.prototype.yGetter=
O.prototype.xGetter;O.prototype.translateXSetter=O.prototype.translateYSetter=O.prototype.rotationSetter=O.prototype.verticalAlignSetter=O.prototype.scaleXSetter=O.prototype.scaleYSetter=function(a,b){this[b]=a;this.doTransform=!0};O.prototype["stroke-widthSetter"]=O.prototype.strokeSetter=function(a,b,c){this[b]=a;if(this.stroke&&this["stroke-width"])this.strokeWidth=this["stroke-width"],O.prototype.fillSetter.call(this,this.stroke,"stroke",c),c.setAttribute("stroke-width",this["stroke-width"]),
this.hasStroke=!0;else if(b==="stroke-width"&&a===0&&this.hasStroke)c.removeAttribute("stroke"),this.hasStroke=!1};var Ca=function(){this.init.apply(this,arguments)};Ca.prototype={Element:O,init:function(a,b,c,d,e,f){var g,d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));g=d.element;a.appendChild(g);a.innerHTML.indexOf("xmlns")===-1&&K(g,"xmlns",Fa);this.isSVG=!0;this.box=g;this.boxWrapper=d;this.alignedObjects=[];this.url=(Ma||mb)&&y.getElementsByTagName("base").length?E.location.href.replace(/#.*?$/,
"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(y.createTextNode("Created with Highcharts 4.2.3"));this.defs=this.createElement("defs").add();this.allowHTML=f;this.forExport=e;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(b,c,!1);var h;if(Ma&&a.getBoundingClientRect)this.subPixelFix=b=function(){L(a,{left:0,top:0});h=a.getBoundingClientRect();L(a,{left:ua(h.left)-h.left+"px",top:ua(h.top)-h.top+"px"})},b(),
M(E,"resize",b)},getStyle:function(a){return this.style=u({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Sa(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&V(E,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;
b.init(this,a);return b},draw:function(){},getRadialAttr:function(a,b){return{cx:a[0]-a[2]/2+b.cx*a[2],cy:a[1]-a[2]/2+b.cy*a[2],r:b.r*a[2]}},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=p(a.textStr,"").toString(),f=e.indexOf("<")!==-1,g=b.childNodes,h,i,k=K(b,"x"),j=a.styles,l=a.textWidth,m=j&&j.lineHeight,n=j&&j.textShadow,r=j&&j.textOverflow==="ellipsis",s=g.length,R=l&&!a.added&&this.box,v=function(a){return m?C(m):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:
j&&j.fontSize||c.style.fontSize||12,a).h},x=function(a){return a.replace(/&lt;/g,"<").replace(/&gt;/g,">")};s--;)b.removeChild(g[s]);!f&&!n&&!r&&e.indexOf(" ")===-1?b.appendChild(y.createTextNode(x(e))):(h=/<.*style="([^"]+)".*>/,i=/<.*href="(http[^"]+)".*>/,R&&R.appendChild(b),e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,"</span>").split(/<br.*?>/g):[e],e[e.length-1]===
""&&e.pop(),o(e,function(e,f){var g,m=0,e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");o(g,function(e){if(e!==""||g.length===1){var n={},s=y.createElementNS(Fa,"tspan"),p;h.test(e)&&(p=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),K(s,"style",p));i.test(e)&&!d&&(K(s,"onclick",'location.href="'+e.match(i)[1]+'"'),L(s,{cursor:"pointer"}));e=x(e.replace(/<(.|\n)*?>/g,"")||" ");if(e!==" "){s.appendChild(y.createTextNode(e));if(m)n.dx=0;else if(f&&k!==null)n.x=
k;K(s,n);b.appendChild(s);!m&&f&&(!ca&&d&&L(s,{display:"block"}),K(s,"dy",v(s)));if(l){for(var n=e.replace(/([^\^])-/g,"$1- ").split(" "),R=g.length>1||f||n.length>1&&j.whiteSpace!=="nowrap",o,w,q,t=[],u=v(s),A=1,z=a.rotation,B=e,D=B.length;(R||r)&&(n.length||t.length);)a.rotation=0,o=a.getBBox(!0),q=o.width,!ca&&c.forExport&&(q=c.measureSpanWidth(s.firstChild.data,a.styles)),o=q>l,w===void 0&&(w=o),r&&w?(D/=2,B===""||!o&&D<0.5?n=[]:(o&&(w=!0),B=e.substring(0,B.length+(o?-1:1)*ua(D)),n=[B+(l>3?"\u2026":
"")],s.removeChild(s.firstChild))):!o||n.length===1?(n=t,t=[],n.length&&(A++,s=y.createElementNS(Fa,"tspan"),K(s,{dy:u,x:k}),p&&K(s,"style",p),b.appendChild(s)),q>l&&(l=q)):(s.removeChild(s.firstChild),t.unshift(n.pop())),n.length&&s.appendChild(y.createTextNode(n.join(" ").replace(/- /g,"-")));w&&a.attr("title",a.textStr);a.rotation=z}m++}}})}),R&&R.removeChild(b),n&&a.applyTextShadow&&a.applyTextShadow(n))},getContrast:function(a){a=ia(a).rgba;return a[0]+a[1]+a[2]>384?"#000000":"#FFFFFF"},button:function(a,
b,c,d,e,f,g,h,i){var k=this.label(a,b,c,i,null,null,null,null,"button"),j=0,l,m,n,r,s,p,a={x1:0,y1:0,x2:0,y2:1},e=D({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},r:2,padding:5,style:{color:"black"}},e);n=e.style;delete e.style;f=D(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);r=f.style;delete f.style;g=D(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#9BD"],[1,"#CDF"]]}},g);s=g.style;delete g.style;h=D(e,{style:{color:"#CCC"}},
h);p=h.style;delete h.style;M(k.element,ya?"mouseover":"mouseenter",function(){j!==3&&k.attr(f).css(r)});M(k.element,ya?"mouseout":"mouseleave",function(){j!==3&&(l=[e,f,g][j],m=[n,r,s][j],k.attr(l).css(m))});k.setState=function(a){(k.state=j=a)?a===2?k.attr(g).css(s):a===3&&k.attr(h).css(p):k.attr(e).css(n)};return k.on("click",function(a){j!==3&&d.call(k,a)}).attr(e).css(u({cursor:"default"},n))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=A(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=A(a[2])+b%2/
2);return a},path:function(a){var b={fill:"none"};Ia(a)?b.d=a:Y(a)&&u(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=Y(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=b.ySetter=function(a,b,c){c.setAttribute("c"+b,a)};return b.attr(a)},arc:function(a,b,c,d,e,f){if(Y(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;a=this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,b,c,d,e,f){var e=Y(a)?a.r:e,g=this.createElement("rect"),
a=Y(a)?a:a===z?{}:{x:a,y:b,width:t(c,0),height:t(d,0)};if(f!==z)g.strokeWidth=f,a=g.crisp(a);if(e)a.r=e;g.rSetter=function(a,b,c){K(c,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[p(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return q(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:"none"};arguments.length>
1&&u(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",a);return f},symbol:function(a,b,c,d,e,f){var g=this,h,i=this.symbols[a],i=i&&i(A(b),A(c),d,e,f),k=/^url\((.*?)\)$/,j,l;if(i)h=this.path(i),u(h,{symbolName:a,x:b,y:c,width:d,height:e}),f&&u(h,f);else if(k.test(a))l=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(A((d-
b[0])/2),A((e-b[1])/2)))},j=a.match(k)[1],a=Nb[j]||f&&f.width&&f.height&&[f.width,f.height],h=this.image(j).attr({x:b,y:c}),h.isImg=!0,a?l(h,a):(h.attr({width:0,height:0}),Z("img",{onload:function(){this.width===0&&(L(this,{position:"absolute",top:"-999em"}),y.body.appendChild(this));l(h,Nb[j]=[this.width,this.height]);this.parentNode&&this.parentNode.removeChild(this);g.imgCount--;if(!g.imgCount)S[g.chartIndex].onload()},src:j})),this.imgCount++;return h},symbols:{circle:function(a,b,c,d){var e=
0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-0.001,d=e.innerR,h=e.open,i=U(f),k=$(f),j=U(g),g=$(g),
e=e.end-f<ra?0:1;return["M",a+c*i,b+c*k,"A",c,c,0,e,1,a+c*j,b+c*g,h?"M":"L",a+d*j,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*k,h?"":"Z"]},callout:function(a,b,c,d,e){var f=F(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX,e=e&&e.anchorY,i;i=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&e>b+g&&e<b+d-g?i.splice(13,3,"L",a+c,e-6,a+c+6,e,a+c,e+6,a+c,b+d-f):h&&h<0&&e>b+g&&e<b+d-g?i.splice(33,3,"L",a,e+6,a-6,e,
a,e-6,a,b+f):e&&e>d&&h>a+g&&h<a+c-g?i.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):e&&e<0&&h>a+g&&h<a+c-g&&i.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return i}},clipRect:function(a,b,c,d){var e="highcharts-"+zb++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;a.count=0;return a},text:function(a,b,c,d){var e=ha||!ca&&this.forExport,f={};if(d&&(this.allowHTML||!this.forExport))return this.html(a,b,c);f.x=Math.round(b||0);if(c)f.y=Math.round(c);
if(a||a===0)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});if(!d)a.xSetter=function(a,b,c){var d=c.getElementsByTagName("tspan"),e,f=c.getAttribute(b),m;for(m=0;m<d.length;m++)e=d[m],e.getAttribute(b)===f&&e.setAttribute(b,a);c.setAttribute(b,a)};return a},fontMetrics:function(a,b){var c,d,a=a||this.style.fontSize;!a&&b&&E.getComputedStyle&&(b=b.element||b,a=(c=E.getComputedStyle(b,""))&&c.fontSize);a=/px/.test(a)?C(a):/em/.test(a)?parseFloat(a)*12:12;c=a<24?a+3:A(a*
1.2);d=A(c*0.8);return{h:c,b:d,f:a}},rotCorr:function(a,b,c){var d=a;b&&c&&(d=t(d*U(b*ga),4));return{x:-a/3*$(b*ga),y:d}},label:function(a,b,c,d,e,f,g,h,i){var k=this,j=k.g(i),l=k.text("",0,0,g).attr({zIndex:1}),m,n,r=0,s=3,p=0,v,x,w,t,ba=0,gb={},B,y,Bb,F,E;Bb=function(){var a,b;a=l.element.style;n=(v===void 0||x===void 0||j.styles.textAlign)&&q(l.textStr)&&l.getBBox();j.width=(v||n.width||0)+2*s+p;j.height=(x||n.height||0)+2*s;B=s+k.fontMetrics(a&&a.fontSize,l).b;if(y){if(!m)a=ba,b=(h?-B:0)+ba,j.box=
m=d?k.symbol(d,a,b,j.width,j.height,gb):k.rect(a,b,j.width,j.height,0,gb["stroke-width"]),m.isImg||m.attr("fill","none"),m.add(j);m.isImg||m.attr(u({width:A(j.width),height:A(j.height)},gb));gb=null}};F=function(){var a=j.styles,a=a&&a.textAlign,b=p+s,c;c=h?0:B;if(q(v)&&n&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(v-n.width);if(b!==l.x||c!==l.y)l.attr("x",b),c!==z&&l.attr("y",c);l.x=b;l.y=c};E=function(a,b){m?m.attr(a,b):gb[a]=b};j.onAdd=function(){l.add(j);j.attr({text:a||a===0?a:"",
x:b,y:c});m&&q(e)&&j.attr({anchorX:e,anchorY:f})};j.widthSetter=function(a){v=a};j.heightSetter=function(a){x=a};j.paddingSetter=function(a){if(q(a)&&a!==s)s=j.padding=a,F()};j.paddingLeftSetter=function(a){q(a)&&a!==p&&(p=a,F())};j.alignSetter=function(a){a={left:0,center:0.5,right:1}[a];a!==r&&(r=a,n&&j.attr({x:b}))};j.textSetter=function(a){a!==z&&l.textSetter(a);Bb();F()};j["stroke-widthSetter"]=function(a,b){a&&(y=!0);ba=a%2/2;E(b,a)};j.strokeSetter=j.fillSetter=j.rSetter=function(a,b){b==="fill"&&
a&&(y=!0);E(b,a)};j.anchorXSetter=function(a,b){e=a;E(b,A(a)-ba-w)};j.anchorYSetter=function(a,b){f=a;E(b,a-t)};j.xSetter=function(a){j.x=a;r&&(a-=r*((v||n.width)+2*s));w=A(a);j.attr("translateX",w)};j.ySetter=function(a){t=j.y=A(a);j.attr("translateY",t)};var C=j.css;return u(j,{css:function(a){if(a){var b={},a=D(a);o(j.textProps,function(c){a[c]!==z&&(b[c]=a[c],delete a[c])});l.css(b)}return C.call(j,a)},getBBox:function(){return{width:n.width+2*s,height:n.height+2*s,x:n.x-s,y:n.y-s}},shadow:function(a){m&&
m.shadow(a);return j},destroy:function(){V(j.element,"mouseenter");V(j.element,"mouseleave");l&&(l=l.destroy());m&&(m=m.destroy());O.prototype.destroy.call(j);j=k=Bb=F=E=null}})}};cb=Ca;u(O.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();if(a&&a.textOverflow==="ellipsis")a.whiteSpace="nowrap",a.overflow="hidden";this.styles=u(this.styles,a);L(this.element,a);return this},htmlGetBBox:function(){var a=this.element;
if(a.nodeName==="text")a.style.position="absolute";return{x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}},htmlUpdateTransform:function(){if(this.added){var a=this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=this.shadows,k=this.styles;L(b,{marginLeft:c,marginTop:d});i&&o(i,function(a){L(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&o(b.childNodes,function(c){a.invertChild(c,
b)});if(b.tagName==="SPAN"){var i=this.rotation,j=C(this.textWidth),l=k&&k.whiteSpace,m=[i,g,b.innerHTML,this.textWidth,this.textAlign].join(",");if(m!==this.cTT){k=a.fontMetrics(b.style.fontSize).b;q(i)&&this.setSpanRotation(i,h,k);if(b.offsetWidth>j&&/[ \-]/.test(b.textContent||b.innerText))L(b,{width:j+"px",display:"block",whiteSpace:l||"normal"}),this.hasTextWidth=!0;else if(this.hasTextWidth)L(b,{width:"",display:"",whiteSpace:l||"nowrap"}),this.hasTextWidth=!1;this.getSpanCorrection(this.hasTextWidth?
j:b.offsetWidth,k,h,i,g)}L(b,{left:e+(this.xCorr||0)+"px",top:f+(this.yCorr||0)+"px"});if(mb)k=b.offsetHeight;this.cTT=m}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,c){var d={},e=ya?"-ms-transform":mb?"-webkit-transform":Ma?"MozTransform":Lb?"-o-transform":"";d[e]=d.transform="rotate("+a+"deg)";d[e+(Ma?"Origin":"-origin")]=d.transformOrigin=b*100+"% "+c+"px";L(this.element,d)},getSpanCorrection:function(a,b,c){this.xCorr=-a*c;this.yCorr=-b}});u(Ca.prototype,{html:function(a,b,c){var d=
this.createElement("span"),e=d.element,f=d.renderer,g=function(a,b){o(["opacity","visibility"],function(c){fb(a,c+"Setter",function(a,c,d,e){a.call(this,c,d,e);b[d]=c})})};d.textSetter=function(a){a!==e.innerHTML&&delete this.bBox;e.innerHTML=this.textStr=a;d.htmlUpdateTransform()};g(d,d.element.style);d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){b==="align"&&(b="textAlign");d[b]=a;d.htmlUpdateTransform()};d.attr({text:a,x:A(b),y:A(c)}).css({position:"absolute",fontFamily:this.style.fontFamily,
fontSize:this.style.fontSize});e.style.whiteSpace="nowrap";d.css=d.htmlCss;if(f.isSVG)d.add=function(a){var b,c=f.box.parentNode,j=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)j.push(a),a=a.parentGroup;o(j.reverse(),function(a){var d,e=K(a.element,"class");e&&(e={className:e});b=a.div=a.div||Z(La,e,{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;u(a,{translateXSetter:function(b,c){d.left=b+"px";a[c]=b;a.doTransform=!0},translateYSetter:function(b,c){d.top=
b+"px";a[c]=b;a.doTransform=!0}});g(a,d)})}}else b=c;b.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d};return d}});var J;if(!ca&&!ha){J={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",";"],e=b===La;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=Z(c);this.renderer=a},add:function(a){var b=
this.renderer,c=this.element,d=b.box,e=a&&a.inverted,d=a?a.element||a:d;if(a)this.parentGroup=a;e&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();return this},updateTransform:O.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=U(a*ga),c=$(a*ga);L(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11=",b,", M12=",-c,", M21=",c,", M22=",b,", sizingMethod='auto expand')"].join(""):
"none"})},getSpanCorrection:function(a,b,c,d,e){var f=d?U(d*ga):1,g=d?$(d*ga):0,h=p(this.elemHeight,this.element.offsetHeight),i;this.xCorr=f<0&&-a;this.yCorr=g<0&&-h;i=f*g<0;this.xCorr+=g*b*(i?1-c:c);this.yCorr-=f*b*(d?i?c:1-c:1);e&&e!=="left"&&(this.xCorr-=a*c*(f<0?-1:1),d&&(this.yCorr-=h*c*(g<0?-1:1)),L(this.element,{textAlign:e}))},pathToVML:function(a){for(var b=a.length,c=[];b--;)if(ma(a[b]))c[b]=A(a[b]*10)-5;else if(a[b]==="Z")c[b]="x";else if(c[b]=a[b],a.isArc&&(a[b]==="wa"||a[b]==="at"))c[b+
5]===c[b+7]&&(c[b+7]+=a[b+7]>a[b+5]?1:-1),c[b+6]===c[b+8]&&(c[b+8]+=a[b+8]>a[b+6]?1:-1);return c.join(" ")||"x"},clip:function(a){var b=this,c;a?(c=a.members,oa(c,b),c.push(b),b.destroyClip=function(){oa(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:lb?"inherit":"rect(auto)"});return b.css(a)},css:O.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Ta(a)},destroy:function(){this.destroyClip&&this.destroyClip();return O.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+
a]=function(){var a=E.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=C(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,k,j=f.path,l,m,n,r;j&&typeof j.value!=="string"&&(j="x");m=j;if(a){n=p(a.width,3);r=(a.opacity||0.15)/n;for(e=1;e<=3;e++){l=n*2+1-2*e;c&&(m=this.cutOffPath(j.value,l+0.5));k=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',
m,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=Z(g.prepVML(k),null,{left:C(i.left)+p(a.offsetX,1),top:C(i.top)+p(a.offsetY,1)});if(c)h.cutOff=l+1;k=['<stroke color="',a.color||"black",'" opacity="',r*e,'"/>'];Z(g.prepVML(k),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this},updateShadows:Aa,setAttr:function(a,b){lb?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){this.element.className=a},dashstyleSetter:function(a,
b,c){(c.getElementsByTagName("stroke")[0]||Z(this.renderer.prepVML(["<stroke/>"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var d=this.shadows,a=a||[];this.d=a.join&&a.join(" ");c.path=a=this.pathToVML(a);if(d)for(c=d.length;c--;)d[c].path=d[c].cutOff?this.cutOffPath(a,d[c].cutOff):a;this.setAttr(b,a)},fillSetter:function(a,b,c){var d=c.nodeName;if(d==="SPAN")c.style.color=a;else if(d!=="IMG")c.filled=a!=="none",this.setAttr("fillcolor",this.renderer.color(a,c,b,this))},"fill-opacitySetter":function(a,
b,c){Z(this.renderer.prepVML(["<",b.split("-")[0],' opacity="',a,'"/>']),null,null,c)},opacitySetter:Aa,rotationSetter:function(a,b,c){c=c.style;this[b]=c[b]=a;c.left=-A($(a*ga)+1)+"px";c.top=A(U(a*ga))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",this.renderer.color(a,c,b,this))},"stroke-widthSetter":function(a,b,c){c.stroked=!!a;this[b]=a;ma(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){a==="inherit"&&
(a="visible");this.shadows&&o(this.shadows,function(c){c.style[b]=a});c.nodeName==="DIV"&&(a=a==="hidden"?"-999em":0,lb||(c.style[b]=a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;b==="x"?b="left":b==="y"&&(b="top");this.updateClipping?(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,b,c){c.style[b]=a}};J["stroke-opacitySetter"]=J["fill-opacitySetter"];B.VMLElement=J=pa(O,J);J.prototype.ySetter=J.prototype.widthSetter=J.prototype.heightSetter=
J.prototype.xSetter;var Cb={Element:J,isIE8:za.indexOf("MSIE 8.0")>-1,init:function(a,b,c,d){var e;this.alignedObjects=[];d=this.createElement(La).css(u(this.getStyle(d),{position:"relative"}));e=d.element;a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.gradients={};this.cache={};this.cacheKeys=[];this.imgCount=0;this.setSize(b,c,!1);if(!y.namespaces.hcv){y.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{y.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(f){y.styleSheets[0].cssText+=
"hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},clipRect:function(a,b,c,d){var e=this.createElement(),f=Y(a);return u(e,{members:[],count:0,left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:c)-1,height:(f?a.height:d)-1,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+A(a?e:d)+"px,"+
A(a?f:b)+"px,"+A(a?b:f)+"px,"+A(a?d:e)+"px)"};!a&&lb&&c==="DIV"&&u(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){o(e.members,function(a){a.element&&a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,f,g=/^rgba/,h,i,k="none";a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var j,l,m=a.linearGradient||a.radialGradient,n,r,s,p,v,x="",a=a.stops,w,q=[],ba=function(){h=['<fill colors="'+q.join(",")+'" opacity="',s,'" o:opacity2="',r,'" type="',i,'" ',
x,'focus="100%" method="any" />'];Z(e.prepVML(h),null,null,b)};n=a[0];w=a[a.length-1];n[0]>0&&a.unshift([0,n[1]]);w[0]<1&&a.push([1,w[1]]);o(a,function(a,b){g.test(a[1])?(f=ia(a[1]),j=f.get("rgb"),l=f.get("a")):(j=a[1],l=1);q.push(a[0]*100+"% "+j);b?(s=l,p=j):(r=l,v=j)});if(c==="fill")if(i==="gradient")c=m.x1||m[0]||0,a=m.y1||m[1]||0,n=m.x2||m[2]||0,m=m.y2||m[3]||0,x='angle="'+(90-W.atan((m-a)/(n-c))*180/ra)+'"',ba();else{var k=m.r,t=k*2,u=k*2,A=m.cx,B=m.cy,z=b.radialReference,y,k=function(){z&&(y=
d.getBBox(),A+=(z[0]-y.x)/y.width-0.5,B+=(z[1]-y.y)/y.height-0.5,t*=z[2]/y.width,u*=z[2]/y.height);x='src="'+N.global.VMLRadialGradientURL+'" size="'+t+","+u+'" origin="0.5,0.5" position="'+A+","+B+'" color2="'+v+'" ';ba()};d.added?k():d.onAdd=k;k=p}else k=j}else if(g.test(a)&&b.tagName!=="IMG")f=ia(a),d[c+"-opacitySetter"](f.get("a"),c,b),k=f.get("rgb");else{k=b.getElementsByTagName(c);if(k.length)k[0].opacity=1,k[0].type="solid";k=a}return k},prepVML:function(a){var b=this.isIE8,a=a.join("");b?
(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:Ca.prototype.html,path:function(a){var b={coordsize:"10 10"};Ia(a)?b.d=a:Y(a)&&u(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(Y(a))c=a.r,b=a.y,a=a.x;d.isCircle=
!0;d.r=c;return d.attr({x:a,y:b})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(La).attr(b)},image:function(a,b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},createElement:function(a){return a==="rect"?this.symbol(a):Ca.prototype.createElement.call(this,a)},invertChild:function(a,b){var c=this,d=b.style,e=a.tagName==="IMG"&&a.style;L(a,{flip:"x",left:C(d.width)-(e?C(e.top):
1),top:C(d.height)-(e?C(e.left):1),rotation:-90});o(a.childNodes,function(b){c.invertChild(b,a)})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||d,c=e.innerR,d=U(f),i=$(f),k=U(g),j=$(g);if(g-f===0)return["x"];f=["wa",a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*k,b+h*j];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*k,b+c*j,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&(c=d=2*e.r);e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,
b+d/2,"e"]},rect:function(a,b,c,d,e){return Ca.prototype.symbols[!q(e)||!e.r?"square":"callout"].call(0,a,b,c,d,e)}}};B.VMLRenderer=J=function(){this.init.apply(this,arguments)};J.prototype=D(Ca.prototype,Cb);cb=J}Ca.prototype.measureSpanWidth=function(a,b){var c=y.createElement("span"),d;d=y.createTextNode(a);c.appendChild(d);L(c,b);this.box.appendChild(c);d=c.offsetWidth;Ta(c);return d};var Ob;if(ha)B.CanVGRenderer=J=function(){Fa="http://www.w3.org/1999/xhtml"},J.prototype.symbols={},Ob=function(){function a(){var a=
b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){if(b.length===0){var e=y.getElementsByTagName("head")[0],f=y.createElement("script");f.type="text/javascript";f.src=d;f.onload=a;e.appendChild(f)}b.push(c)}}}(),cb=J;Va.prototype={addLabel:function(){var a=this.axis,b=a.options,c=a.chart,d=a.categories,e=a.names,f=this.pos,g=b.labels,h=a.tickPositions,i=f===h[0],k=f===h[h.length-1],e=d?p(d[f],e[f],f):f,d=this.label,h=h.info,j;a.isDatetimeAxis&&h&&(j=b.dateTimeLabelFormats[h.higherRanks[f]||
h.unitName]);this.isFirst=i;this.isLast=k;b=a.labelFormatter.call({axis:a,chart:c,isFirst:i,isLast:k,dateTimeLabelFormat:j,value:a.isLog?fa(na(e)):e});q(d)?d&&d.attr({text:b}):(this.labelLength=(this.label=d=q(b)&&g.enabled?c.renderer.text(b,0,0,g.useHTML).css(D(g.style)).add(a.labelGroup):null)&&d.getBBox().width,this.rotation=0)},getLabelSize:function(){return this.label?this.label.getBBox()[this.axis.horiz?"height":"width"]:0},handleOverflow:function(a){var b=this.axis,c=a.x,d=b.chart.chartWidth,
e=b.chart.spacing,f=p(b.labelLeft,F(b.pos,e[3])),e=p(b.labelRight,t(b.pos+b.len,d-e[1])),g=this.label,h=this.rotation,i={left:0,center:0.5,right:1}[b.labelAlign],k=g.getBBox().width,j=b.slotWidth,l=1,m,n={};if(h)h<0&&c-i*k<f?m=A(c/U(h*ga)-f):h>0&&c+i*k>e&&(m=A((d-c)/U(h*ga)));else if(d=c+(1-i)*k,c-i*k<f?j=a.x+j*(1-i)-f:d>e&&(j=e-a.x+j*i,l=-1),j=F(b.slotWidth,j),j<b.slotWidth&&b.labelAlign==="center"&&(a.x+=l*(b.slotWidth-j-i*(b.slotWidth-F(k,j)))),k>j||b.autoRotation&&g.styles.width)m=j;if(m){n.width=
m;if(!b.options.labels.style.textOverflow)n.textOverflow="ellipsis";g.css(n)}},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=this.axis,k=i.transA,j=i.reversed,l=i.staggerLines,m=i.tickRotCorr||
{x:0,y:0},n=e.y;q(n)||(n=i.side===2?m.y+8:n=U(c.rotation*ga)*(m.y-c.getBBox(!1,0).height/2));a=a+e.x+m.x-(f&&d?f*k*(j?-1:1):0);b=b+n-(f&&!d?f*k*(j?1:-1):0);l&&(c=g/(h||1)%l,i.opposite&&(c=l-c-1),b+=c*(i.labelOffset/l));return{x:a,y:A(b)}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,i=this.label,k=this.pos,j=e.labels,l=this.gridLine,m=h?h+"Grid":"grid",n=h?h+"Tick":
"tick",r=e[m+"LineWidth"],s=e[m+"LineColor"],o=e[m+"LineDashStyle"],v=e[n+"Length"],m=p(e[n+"Width"],!h&&d.isXAxis?1:0),x=e[n+"Color"],w=e[n+"Position"],n=this.mark,q=j.step,ba=!0,t=d.tickmarkOffset,u=this.getPosition(g,k,t,b),A=u.x,u=u.y,B=g&&A===d.pos+d.len||!g&&u===d.pos?-1:1,c=p(c,1);this.isActive=!0;if(r){k=d.getPlotLinePath(k+t,r*B,b,!0);if(l===z){l={stroke:s,"stroke-width":r};if(o)l.dashstyle=o;if(!h)l.zIndex=1;if(b)l.opacity=0;this.gridLine=l=r?f.path(k).attr(l).add(d.gridGroup):null}if(!b&&
l&&k)l[this.isNew?"attr":"animate"]({d:k,opacity:c})}if(m&&v)w==="inside"&&(v=-v),d.opposite&&(v=-v),h=this.getMarkPath(A,u,v,m*B,g,f),n?n.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:x,"stroke-width":m,opacity:c}).add(d.axisGroup);if(i&&!isNaN(A))i.xy=u=this.getLabelPosition(A,u,i,g,j,t,a,q),this.isFirst&&!this.isLast&&!p(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!p(e.showLastLabel,1)?ba=!1:g&&!d.isRadial&&!j.step&&!j.rotation&&!b&&c!==0&&this.handleOverflow(u),q&&a%q&&(ba=!1),
ba&&!isNaN(u.y)?(u.opacity=c,i[this.isNew?"attr":"animate"](u),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Sa(this,this.axis)}};B.PlotLineOrBand=function(a,b){this.axis=a;if(b)this.options=b,this.id=b.id};B.PlotLineOrBand.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=a.options,e=d.label,f=a.label,g=d.width,h=d.to,i=d.from,k=q(i)&&q(h),j=d.value,l=d.dashStyle,m=a.svgElem,n=[],r,s=d.color,o=p(d.zIndex,0),v=d.events,x={},w=b.chart.renderer;b.isLog&&(i=Da(i),h=Da(h),j=Da(j));if(g){if(n=
b.getPlotLinePath(j,g),x={stroke:s,"stroke-width":g},l)x.dashstyle=l}else if(k){n=b.getPlotBandPath(i,h,d);if(s)x.fill=s;if(d.borderWidth)x.stroke=d.borderColor,x["stroke-width"]=d.borderWidth}else return;x.zIndex=o;if(m)if(n)m.show(),m.animate({d:n});else{if(m.hide(),f)a.label=f=f.destroy()}else if(n&&n.length&&(a.svgElem=m=w.path(n).attr(x).add(),v))for(r in d=function(b){m.on(b,function(c){v[b].apply(a,[c])})},v)d(r);e&&q(e.text)&&n&&n.length&&b.width>0&&b.height>0&&!n.flat?(e=D({align:c&&k&&"center",
x:c?!k&&4:10,verticalAlign:!c&&k&&"middle",y:c?k?16:10:k?6:-4,rotation:c&&!k&&90},e),this.renderLabel(e,n,k,o)):f&&f.hide();return a},renderLabel:function(a,b,c,d){var e=this.label,f=this.axis.chart.renderer;if(!e)e={align:a.textAlign||a.align,rotation:a.rotation},e.zIndex=d,this.label=e=f.text(a.text,0,0,a.useHTML).attr(e).css(a.style).add();d=[b[1],b[4],c?b[6]:b[1]];b=[b[2],b[5],c?b[7]:b[2]];c=Ra(d);f=Ra(b);e.align(a,!1,{x:c,y:f,width:Ea(d)-c,height:Ea(b)-f});e.show()},destroy:function(){oa(this.axis.plotLinesAndBands,
this);delete this.axis;Sa(this)}};var ka=B.Axis=function(){this.init.apply(this,arguments)};ka.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#D8D8D8",labels:{enabled:!0,style:{color:"#606060",cursor:"default",fontSize:"11px"},x:0,y:15},lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,
minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",title:{align:"middle",style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return B.numberFormat(this.total,
-1)},style:D(aa.line.dataLabels.style,{color:"#000000"})}},defaultLeftAxisOptions:{labels:{x:-15,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15,y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{autoRotation:[-45],x:0,y:null},title:{rotation:0}},defaultTopAxisOptions:{labels:{autoRotation:[-45],x:0,y:-15},title:{rotation:0}},init:function(a,b){var c=b.isX;this.chart=a;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=b.opposite;this.side=
b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.reversed=d.reversed;this.visible=d.visible!==!1;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.names=this.names||[];this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=q(d.linkedTo);this.ticks={};this.labelEdge=[];this.minorTicks=
{};this.plotLinesAndBands=[];this.alternateBands={};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.stacksTouched=0;this.min=this.max=null;this.crosshair=p(d.crosshair,ta(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;sa(this,a.axes)===-1&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];if(a.inverted&&
c&&this.reversed===z)this.reversed=!0;this.removePlotLine=this.removePlotBand=this.removePlotBandOrLine;for(f in d)M(this,f,d[f]);if(this.isLog)this.val2lin=Da,this.lin2val=na},setOptions:function(a){this.options=D(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],D(N[this.coll],a))},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=
this.dateTimeLabelFormat,e=N.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,a=a.isLog?b:a.tickInterval;if(h)g=Ka(h,this);else if(c)g=b;else if(d)g=Qa(d,b);else if(f&&a>=1E3)for(;f--&&g===z;)c=Math.pow(1E3,f+1),a>=c&&b*10%c===0&&e[f]!==null&&(g=B.numberFormat(b/c,-1)+e[f]);g===z&&(g=P(b)>=1E4?B.numberFormat(b,-1):B.numberFormat(b,-1,z,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=a.threshold=null;a.softThreshold=!a.isXAxis;
a.buildStacks&&a.buildStacks();o(a.series,function(c){if(c.visible||!b.options.chart.ignoreHiddenSeries){var d=c.options,e=d.threshold,f;a.hasVisibleSeries=!0;a.isLog&&e<=0&&(e=null);if(a.isXAxis){if(d=c.xData,d.length)a.dataMin=F(p(a.dataMin,d[0]),Ra(d)),a.dataMax=t(p(a.dataMax,d[0]),Ea(d))}else{c.getExtremes();f=c.dataMax;c=c.dataMin;if(q(c)&&q(f))a.dataMin=F(p(a.dataMin,c),c),a.dataMax=t(p(a.dataMax,f),f);if(q(e))a.threshold=e;if(!d.softThreshold||a.isLog)a.softThreshold=!1}}})},translate:function(a,
b,c,d,e,f){var g=this.linkedParent||this,h=1,i=0,k=d?g.oldTransA:g.transA,d=d?g.oldMin:g.min,j=g.minPixelPadding,e=(g.isOrdinal||g.isBroken||g.isLog&&e)&&g.lin2val;if(!k)k=g.transA;if(c)h*=-1,i=g.len;g.reversed&&(h*=-1,i-=h*(g.sector||g.len));b?(a=a*h+i,a-=j,a=a/k+d,e&&(a=g.lin2val(a))):(e&&(a=g.val2lin(a)),f==="between"&&(f=0.5),a=h*(a-d)*k+i+h*j+(ma(f)?k*f*g.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-
(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,h=this.top,i,k,j=c&&f.oldChartHeight||f.chartHeight,l=c&&f.oldChartWidth||f.chartWidth,m;i=this.transB;var n=function(a,b,c){if(a<b||a>c)d?a=F(t(b,a),c):m=!0;return a},e=p(e,this.translate(a,null,null,c)),a=c=A(e+i);i=k=A(j-e-i);isNaN(e)?m=!0:this.horiz?(i=h,k=j-this.bottom,a=c=n(a,g,g+this.width)):(a=g,c=l-this.right,i=k=n(i,h,h+this.height));return m&&!d?null:f.renderer.crispLine(["M",a,i,"L",
c,k],b||1)},getLinearTickPositions:function(a,b,c){var d,e=fa(T(b/a)*a),f=fa(ua(c/a)*a),g=[];if(b===c&&ma(b))return[b];for(b=e;b<=f;){g.push(b);b=fa(b+a);if(b===d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e,f=this.pointRangePadding||0;e=this.min-f;var f=this.max+f,g=f-e;if(g&&g/c<this.len/3)if(this.isLog){f=b.length;for(e=1;e<f;e++)d=d.concat(this.getLogTickPositions(c,b[e-1],b[e],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval===
"auto")d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),e,f,a.startOfWeek));else for(b=e+(b[0]-e)%c;b<=f;b+=c)d.push(b);d.length!==0&&this.trimTicks(d,a.startOnTick,a.endOnTick);return d},adjustForMinRange:function(){var a=this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,k,j;if(this.isXAxis&&this.minRange===z&&!this.isLog)q(a.min)||q(a.max)?this.minRange=null:(o(this.series,function(a){i=a.xData;for(g=k=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-
i[g-1],f===z||h<f)f=h}),this.minRange=F(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){j=this.minRange;d=(j-c+b)/2;d=[b-d,p(a.min,b-d)];if(e)d[2]=this.dataMin;b=Ea(d);c=[b+j,p(a.max,b+j)];if(e)c[2]=this.dataMax;c=Ra(c);c-b<j&&(d[0]=c-j,d[1]=p(a.min,c-j),b=Ea(d))}this.min=b;this.max=c},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,i=!!b.categories,k=b.transA,j=b.isXAxis;if(j||i||d)if(h?(f=h.minPointOffset,g=h.pointRangePadding):(o(b.series,
function(a){var b=a.closestPointRange;!a.noSharedTooltip&&q(b)&&(e=q(e)?F(e,b):b)}),o(b.series,function(a){var c=i?1:j?p(a.options.pointRange,e,0):b.axisPointRange||0,a=a.options.pointPlacement;d=t(d,c);b.single||(f=t(f,xa(a)?0:c/2),g=t(g,a==="on"?0:c))})),h=b.ordinalSlope&&e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=F(d,c),j)b.closestPointRange=e;if(a)b.oldTransA=k;b.translationSlope=b.transA=k=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=
k*f},minFromRange:function(){return this.max-this.range},setTickInterval:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=d.maxPadding,k=d.minPadding,j=d.tickInterval,l=d.tickPixelInterval,m=b.categories,n=b.threshold,r=b.softThreshold,s,R,v,x;!f&&!m&&!h&&this.getTickAmount();v=p(b.userMin,d.min);x=p(b.userMax,d.max);h?(b.linkedParent=c[b.coll][d.linkedTo],c=b.linkedParent.getExtremes(),b.min=p(c.min,c.dataMin),b.max=p(c.max,c.dataMax),d.type!==
b.linkedParent.options.type&&X(11,1)):(!r&&q(n)&&(b.dataMin>=n?(s=n,k=0):b.dataMax<=n&&(R=n,i=0)),b.min=p(v,s,b.dataMin),b.max=p(x,R,b.dataMax));if(e)!a&&F(b.min,p(b.dataMin,b.min))<=0&&X(10,1),b.min=fa(Da(b.min),15),b.max=fa(Da(b.max),15);if(b.range&&q(b.max))b.userMin=b.min=v=t(b.min,b.minFromRange()),b.userMax=x=b.max,b.range=null;b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!m&&!b.axisPointRange&&!b.usePercentage&&!h&&q(b.min)&&q(b.max)&&(c=b.max-b.min))!q(v)&&k&&(b.min-=c*k),!q(x)&&
i&&(b.max+=c*i);if(ma(d.floor))b.min=t(b.min,d.floor);if(ma(d.ceiling))b.max=F(b.max,d.ceiling);if(r&&q(b.dataMin))if(n=n||0,!q(v)&&b.min<n&&b.dataMin>=n)b.min=n;else if(!q(x)&&b.max>n&&b.dataMax<=n)b.max=n;b.tickInterval=b.min===b.max||b.min===void 0||b.max===void 0?1:h&&!j&&l===b.linkedParent.options.tickPixelInterval?j=b.linkedParent.tickInterval:p(j,this.tickAmount?(b.max-b.min)/t(this.tickAmount-1,1):void 0,m?1:(b.max-b.min)*l/t(b.len,l));g&&!a&&o(b.series,function(a){a.processData(b.min!==b.oldMin||
b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(b.pointRange&&!j)b.tickInterval=t(b.pointRange,b.tickInterval);a=p(d.minTickInterval,b.isDatetimeAxis&&b.closestPointRange);if(!j&&b.tickInterval<a)b.tickInterval=a;if(!f&&!e&&!j)b.tickInterval=sb(b.tickInterval,null,rb(b.tickInterval),p(d.allowDecimals,!(b.tickInterval>0.5&&b.tickInterval<5&&b.max>1E3&&b.max<9999)),
!!this.tickAmount);if(!this.tickAmount&&this.len)b.tickInterval=b.unsquish();this.setTickPositions()},setTickPositions:function(){var a=this.options,b,c=a.tickPositions,d=a.tickPositioner,e=a.startOnTick,f=a.endOnTick,g;this.tickmarkOffset=this.categories&&a.tickmarkPlacement==="between"&&this.tickInterval===1?0.5:0;this.minorTickInterval=a.minorTickInterval==="auto"&&this.tickInterval?this.tickInterval/5:a.minorTickInterval;this.tickPositions=b=c&&c.slice();if(!b&&(b=this.isDatetimeAxis?this.getTimeTicks(this.normalizeTimeTickInterval(this.tickInterval,
a.units),this.min,this.max,a.startOfWeek,this.ordinalPositions,this.closestPointRange,!0):this.isLog?this.getLogTickPositions(this.tickInterval,this.min,this.max):this.getLinearTickPositions(this.tickInterval,this.min,this.max),b.length>this.len&&(b=[b[0],b.pop()]),this.tickPositions=b,d&&(d=d.apply(this,[this.min,this.max]))))this.tickPositions=b=d;if(!this.isLinked)this.trimTicks(b,e,f),this.min===this.max&&q(this.min)&&!this.tickAmount&&(g=!0,this.min-=0.5,this.max+=0.5),this.single=g,!c&&!d&&
this.adjustTickAmount()},trimTicks:function(a,b,c){var d=a[0],e=a[a.length-1],f=this.minPointOffset||0;if(b)this.min=d;else for(;this.min-f>a[0];)a.shift();if(c)this.max=e;else for(;this.max+f<a[a.length-1];)a.pop();a.length===0&&q(d)&&a.push((e+d)/2)},alignToOthers:function(){var a={},b,c=this.options;this.chart.options.chart.alignTicks!==!1&&c.alignTicks!==!1&&o(this.chart[this.coll],function(c){var e=c.options,e=[c.horiz?e.left:e.top,e.width,e.height,e.pane].join(",");c.series.length&&(a[e]?b=
!0:a[e]=1)});return b},getTickAmount:function(){var a=this.options,b=a.tickAmount,c=a.tickPixelInterval;!q(a.tickInterval)&&this.len<c&&!this.isRadial&&!this.isLog&&a.startOnTick&&a.endOnTick&&(b=2);!b&&this.alignToOthers()&&(b=ua(this.len/c)+1);if(b<4)this.finalTickAmt=b,b=5;this.tickAmount=b},adjustTickAmount:function(){var a=this.tickInterval,b=this.tickPositions,c=this.tickAmount,d=this.finalTickAmt,e=b&&b.length;if(e<c){for(;b.length<c;)b.push(fa(b[b.length-1]+a));this.transA*=(e-1)/(c-1);this.max=
b[b.length-1]}else e>c&&(this.tickInterval*=2,this.setTickPositions());if(q(d)){for(a=c=b.length;a--;)(d===3&&a%2===1||d<=2&&a>0&&a<c-1)&&b.splice(a,1);this.finalTickAmt=z}},setScale:function(){var a,b;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();b=this.len!==this.oldAxisLength;o(this.series,function(b){if(b.isDirtyData||b.isDirty||b.xAxis.isDirty)a=!0});if(b||a||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax||
this.alignToOthers()){if(this.resetStacks&&this.resetStacks(),this.forceRedraw=!1,this.getSeriesExtremes(),this.setTickInterval(),this.oldUserMin=this.userMin,this.oldUserMax=this.userMax,!this.isDirty)this.isDirty=b||this.min!==this.oldMin||this.max!==this.oldMax}else this.cleanStacks&&this.cleanStacks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=p(c,!0);o(f.series,function(a){delete a.kdTree});e=u(e,{min:a,max:b});H(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;
c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,e=this.options,f=F(c,p(e.min,c)),e=t(d,p(e.max,d));this.allowZoomOutside||(q(c)&&a<=f&&(a=f),q(d)&&b>=e&&(b=e));this.displayBtn=a!==z||b!==z;this.setExtremes(a,b,!1,z,{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=this.horiz,e=p(b.width,a.plotWidth-c+(b.offsetRight||0)),f=p(b.height,a.plotHeight),g=p(b.top,a.plotTop),b=p(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=Math.round(parseFloat(f)/
100*a.plotHeight));c.test(g)&&(g=Math.round(parseFloat(g)/100*a.plotHeight+a.plotTop));this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=t(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=this.isLog;return{min:a?fa(na(this.min)):this.min,max:a?fa(na(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?na(this.min):this.min,b=b?na(this.max):
this.max;a===null?a=b<0?b:c:c>a?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(p(a,0)-this.side*90+720)%360;return a>15&&a<165?"right":a>195&&a<345?"left":"center"},unsquish:function(){var a=this.ticks,b=this.options.labels,c=this.horiz,d=this.tickInterval,e=d,f=this.len/(((this.categories?1:0)+this.max-this.min)/d),g,h=b.rotation,i=this.chart.renderer.fontMetrics(b.style.fontSize,a[0]&&a[0].label),k,j=Number.MAX_VALUE,l,m=function(a){a/=f||1;a=a>1?ua(a):1;return a*
d};c?(l=!b.staggerLines&&!b.step&&(q(h)?[h]:f<p(b.autoRotationLimit,80)&&b.autoRotation))&&o(l,function(a){var b;if(a===h||a&&a>=-90&&a<=90)k=m(P(i.h/$(ga*a))),b=k+P(a/360),b<j&&(j=b,g=a,e=k)}):b.step||(e=m(i.h));this.autoRotation=l;this.labelRotation=p(g,h);return e},renderUnsquish:function(){var a=this.chart,b=a.renderer,c=this.tickPositions,d=this.ticks,e=this.options.labels,f=this.horiz,g=a.margin,h=this.categories?c.length:c.length-1,g=this.slotWidth=f&&(e.step||0)<2&&!e.rotation&&(this.staggerLines||
1)*a.plotWidth/h||!f&&(g[3]&&g[3]-a.spacing[3]||a.chartWidth*0.33),i=t(1,A(g-2*(e.padding||5))),k={},h=b.fontMetrics(e.style.fontSize,d[0]&&d[0].label),j=e.style.textOverflow,l,m=0,n,r;if(!xa(e.rotation))k.rotation=e.rotation||0;if(this.autoRotation)o(c,function(a){if((a=d[a])&&a.labelLength>m)m=a.labelLength}),m>i&&m>h.h?k.rotation=this.labelRotation:this.labelRotation=0;else if(g&&(l={width:i+"px"},!j)){l.textOverflow="clip";for(n=c.length;!f&&n--;)if(r=c[n],i=d[r].label)if(i.styles.textOverflow===
"ellipsis"&&i.css({textOverflow:"clip"}),i.getBBox().height>this.len/c.length-(h.h-h.f)||d[r].labelLength>g)i.specCss={textOverflow:"ellipsis"}}if(k.rotation&&(l={width:(m>a.chartHeight*0.5?a.chartHeight*0.33:a.chartHeight)+"px"},!j))l.textOverflow="ellipsis";if(this.labelAlign=e.align||this.autoLabelAlign(this.labelRotation))k.align=this.labelAlign;o(c,function(a){var b=(a=d[a])&&a.label;if(b)b.attr(k),l&&b.css(D(l,b.specCss)),delete b.specCss,a.rotation=k.rotation});this.tickRotCorr=b.rotCorr(h.b,
this.labelRotation||0,this.side!==0)},hasData:function(){return this.hasVisibleSeries||q(this.min)&&q(this.max)&&!!this.tickPositions},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,k,j,l=0,m,n=0,r=d.title,s=d.labels,R=0,v=a.opposite,x=b.axisOffset,b=b.clipOffset,w=[-1,1,1,-1][h],u,ba=a.axisParent;k=a.hasData();a.showAxis=j=k||p(d.showEmpty,!0);a.staggerLines=a.horiz&&s.staggerLines;if(!a.axisGroup)a.gridGroup=
c.g("grid").attr({zIndex:d.gridZIndex||1}).add(ba),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(ba),a.labelGroup=c.g("axis-labels").attr({zIndex:s.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels").add(ba);if(k||a.isLinked){if(o(e,function(b){f[b]?f[b].addLabel():f[b]=new Va(a,b)}),a.renderUnsquish(),s.reserveSpace!==!1&&(h===0||h===2||{1:"left",3:"right"}[h]===a.labelAlign||a.labelAlign==="center")&&o(e,function(a){R=t(f[a].getLabelSize(),R)}),a.staggerLines)R*=a.staggerLines,
a.labelOffset=R*(a.opposite?-1:1)}else for(u in f)f[u].destroy(),delete f[u];if(r&&r.text&&r.enabled!==!1){if(!a.axisTitle)a.axisTitle=c.text(r.text,0,0,r.useHTML).attr({zIndex:7,rotation:r.rotation||0,align:r.textAlign||{low:v?"right":"left",middle:"center",high:v?"left":"right"}[r.align]}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(r.style).add(a.axisGroup),a.axisTitle.isNew=!0;if(j)l=a.axisTitle.getBBox()[g?"height":"width"],m=r.offset,n=q(m)?0:p(r.margin,g?5:10);a.axisTitle[j?
"show":"hide"](!0)}a.offset=w*p(d.offset,x[h]);a.tickRotCorr=a.tickRotCorr||{x:0,y:0};c=h===2?a.tickRotCorr.y:0;g=Math.abs(R)+n+(R&&w*(g?p(s.y,a.tickRotCorr.y+8):s.x)-c);a.axisTitleMargin=p(m,g);x[h]=t(x[h],a.axisTitleMargin+l+w*a.offset,g);d=d.offset?0:T(d.lineWidth/2)*2;b[i]=t(b[i],d)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",e?this.left:
f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=e.x||0,k=e.y||0,j=C(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?j:0);return{x:a?d+i:b+(g?this.width:0)+h+i,y:a?b+k-(g?this.height:0)+h:d+k}},render:function(){var a=this,
b=a.chart,c=b.renderer,d=a.options,e=a.isLog,f=a.isLinked,g=a.tickPositions,h=a.axisTitle,i=a.ticks,k=a.minorTicks,j=a.alternateBands,l=d.stackLabels,m=d.alternateGridColor,n=a.tickmarkOffset,r=d.lineWidth,s,p=b.hasRendered&&q(a.oldMin)&&!isNaN(a.oldMin),v=a.showAxis,x=c.globalAnimation,w,t;a.labelEdge.length=0;a.overlap=!1;o([i,k,j],function(a){for(var b in a)a[b].isActive=!1});if(a.hasData()||f){a.minorTickInterval&&!a.categories&&o(a.getMinorTickPositions(),function(b){k[b]||(k[b]=new Va(a,b,"minor"));
p&&k[b].isNew&&k[b].render(null,!0);k[b].render(null,!1,1)});if(g.length&&(o(g,function(b,c){if(!f||b>=a.min&&b<=a.max)i[b]||(i[b]=new Va(a,b)),p&&i[b].isNew&&i[b].render(c,!0,0.1),i[b].render(c)}),n&&(a.min===0||a.single)))i[-1]||(i[-1]=new Va(a,-1,null,!0)),i[-1].render(-1);m&&o(g,function(c,d){t=g[d+1]!==z?g[d+1]+n:a.max-n;if(d%2===0&&c<a.max&&t<=a.max+(b.polar?-n:n))j[c]||(j[c]=new B.PlotLineOrBand(a)),w=c+n,j[c].options={from:e?na(w):w,to:e?na(t):t,color:m},j[c].render(),j[c].isActive=!0});if(!a._addedPlotLB)o((d.plotLines||
[]).concat(d.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0}o([i,k,j],function(a){var c,d,e=[],f=x?x.duration||500:0;for(c in a)if(!a[c].isActive)a[c].render(c,!1,0),a[c].isActive=!1,e.push(c);Pa(function(){for(d=e.length;d--;)a[e[d]]&&!a[e[d]].isActive&&(a[e[d]].destroy(),delete a[e[d]])},a===j||!b.hasRendered||!f?0:f)});if(r)s=a.getLinePath(r),a.axisLine?a.axisLine.animate({d:s}):a.axisLine=c.path(s).attr({stroke:d.lineColor,"stroke-width":r,zIndex:7}).add(a.axisGroup),a.axisLine[v?
"show":"hide"](!0);if(h&&v)h[h.isNew?"attr":"animate"](a.getTitlePosition()),h.isNew=!1;l&&l.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){this.visible&&(this.render(),o(this.plotLinesAndBands,function(a){a.render()}));o(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,c=b.stacks,d,e=b.plotLinesAndBands;a||V(b);for(d in c)Sa(c[d]),c[d]=null;o([b.ticks,b.minorTicks,b.alternateBands],function(a){Sa(a)});for(a=e.length;a--;)e[a].destroy();o("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","),
function(a){b[a]&&(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},drawCrosshair:function(a,b){var c,d=this.crosshair,e,f;if(!this.crosshair||(q(b)||!p(d.snap,!0))===!1)this.hideCrosshair();else if(p(d.snap,!0)?q(b)&&(c=this.isXAxis?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos,c=this.isRadial?this.getPlotLinePath(this.isXAxis?b.x:p(b.stackY,b.y))||null:this.getPlotLinePath(null,null,null,null,c)||null,c===null)this.hideCrosshair();else if(e=this.categories&&
!this.isRadial,f=p(d.width,e?this.transA:1),this.cross)this.cross.attr({d:c,visibility:"visible","stroke-width":f});else{e={"stroke-width":f,stroke:d.color||(e?"rgba(155,200,255,0.2)":"#C0C0C0"),zIndex:p(d.zIndex,2)};if(d.dashStyle)e.dashstyle=d.dashStyle;this.cross=this.chart.renderer.path(c).attr(e).add()}},hideCrosshair:function(){this.cross&&this.cross.hide()}};u(ka.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b,null,null,!0),d=this.getPlotLinePath(a,null,null,!0);d&&c?
(d.flat=d.toString()===c.toString(),d.push(c[4],c[5],c[1],c[2])):d=null;return d},addPlotBand:function(a){return this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){return this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new B.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));return c},removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,e=b.length;e--;)b[e].id===
a&&b[e].destroy();o([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&oa(b,b[e])})}});ka.prototype.getTimeTicks=function(a,b,c,d){var e=[],f={},g=N.global.useUTC,h,i=new qa(b-Ya(b)),k=a.unitRange,j=a.count;if(q(b)){i[Gb](k>=G.second?0:j*T(i.getMilliseconds()/j));if(k>=G.second)i[Hb](k>=G.minute?0:j*T(i.getSeconds()/j));if(k>=G.minute)i[Ib](k>=G.hour?0:j*T(i[tb]()/j));if(k>=G.hour)i[Jb](k>=G.day?0:j*T(i[ub]()/j));if(k>=G.day)i[wb](k>=G.month?
1:j*T(i[$a]()/j));k>=G.month&&(i[xb](k>=G.year?0:j*T(i[ab]()/j)),h=i[bb]());k>=G.year&&(h-=h%j,i[yb](h));if(k===G.week)i[wb](i[$a]()-i[vb]()+p(d,1));b=1;if(qb||Za)i=i.getTime(),i=new qa(i+Ya(i));h=i[bb]();for(var d=i.getTime(),l=i[ab](),m=i[$a](),n=!g||!!Za,r=(G.day+(g?Ya(i):i.getTimezoneOffset()*6E4))%G.day;d<c;)e.push(d),k===G.year?d=kb(h+b*j,0):k===G.month?d=kb(h,l+b*j):n&&(k===G.day||k===G.week)?d=kb(h,l,m+b*j*(k===G.day?1:7)):d+=k*j,b++;e.push(d);o(Na(e,function(a){return k<=G.hour&&a%G.day===
r}),function(a){f[a]="day"})}e.info=u(a,{higherRanks:f,totalRange:k*j});return e};ka.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=G[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=G[d[0]],f=d[1],c[g+1]&&a<=(e*f[f.length-1]+G[c[g+1][0]])/2)break;e===G.year&&a<5*e&&(f=[1,
2,5]);c=sb(a/e,f,d[0]==="year"?t(rb(a/e),1):1);return{unitRange:e,count:c,unitName:d[0]}};ka.prototype.getLogTickPositions=function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=A(a),g=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=T(b),h,i,k,j,l,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!l;f++){i=e.length;for(h=0;h<i&&!l;h++)k=Da(na(f)*e[h]),k>b&&(!d||j<=c)&&j!==z&&g.push(j),j>c&&(l=!0),j=k}else if(b=na(b),c=na(c),a=e[d?
"minorTickInterval":"tickInterval"],a=p(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=sb(a,null,rb(a)),g=Ba(this.getLinearTickPositions(a,b,c),Da),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return g};var Pb=B.Tooltip=function(){this.init.apply(this,arguments)};Pb.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=C(d.padding);this.chart=a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=
!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});ha||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=this,f=e.now,g=e.options.animation!==!1&&!e.isHidden&&(P(a-f.x)>1||
P(b-f.y)>1),h=e.followPointer||e.len>1;u(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:h?z:g?(2*f.anchorX+c)/3:c,anchorY:h?z:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g)clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(a){var b=this;clearTimeout(this.hideTimer);a=p(a,this.options.hideDelay,500);if(!this.isHidden)this.hideTimer=Pa(function(){b.label[a?"fadeOut":"hide"]();b.isHidden=!0},a)},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,
f=d.plotTop,g=d.plotLeft,h=0,i=0,k,j,a=ta(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===z&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(o(a,function(a){k=a.series.yAxis;j=a.series.xAxis;h+=a.plotX+(!e&&j?j.left-g:0);i+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&k?k.top-f:0)}),h/=a.length,i/=a.length,c=[e?d.plotWidth-i:h,this.shared&&!e&&a.length>1&&b?b.chartY-f:e?d.plotHeight-h:i]);return Ba(c,A)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,
f={},g=c.h||0,h,i=["y",d.chartHeight,b,c.plotY+d.plotTop,d.plotTop,d.plotTop+d.plotHeight],k=["x",d.chartWidth,a,c.plotX+d.plotLeft,d.plotLeft,d.plotLeft+d.plotWidth],j=p(c.ttBelow,d.inverted&&!c.negative||!d.inverted&&c.negative),l=function(a,b,c,d,h,i){var k=c<d-e,l=d+e+c<b,m=d-e-c;d+=e;if(j&&l)f[a]=d;else if(!j&&k)f[a]=m;else if(k)f[a]=F(i-c,m-g<0?m:m-g);else if(l)f[a]=t(h,d+g+c>b?d:d+g);else return!1},m=function(a,b,c,d){var g;d<e||d>b-e?g=!1:f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2;return g},n=function(a){var b=
i;i=k;k=b;h=a},r=function(){l.apply(0,i)!==!1?m.apply(0,k)===!1&&!h&&(n(!0),r()):h?f.x=f.y=0:(n(!0),r())};(d.inverted||this.len>1)&&n();r();return f},defaultFormatter:function(a){var b=this.points||ta(this),c;c=[a.tooltipFooterHeaderFormatter(b[0])];c=c.concat(a.bodyFormatter(b));c.push(a.tooltipFooterHeaderFormatter(b[0],!0));return c.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,f,g,h,i={},k,j=[];k=e.formatter||this.defaultFormatter;var i=c.hoverPoints,l,m=this.shared;
clearTimeout(this.hideTimer);this.followPointer=ta(a)[0].series.tooltipOptions.followPointer;h=this.getAnchor(a,b);f=h[0];g=h[1];m&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,i&&o(i,function(a){a.setState()}),o(a,function(a){a.setState("hover");j.push(a.getLabelConfig())}),i={x:a[0].category,y:a[0].y},i.points=j,this.len=j.length,a=a[0]):i=a.getLabelConfig();k=k.call(i,this);i=a.series;this.distance=p(i.tooltipOptions.distance,16);k===!1?this.hide():(this.isHidden&&(Oa(d),d.attr("opacity",
1).show()),d.attr({text:k}),l=e.borderColor||a.color||i.color||"#606060",d.attr({stroke:l}),this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow,h:h[2]||0}),this.isHidden=!1);H(c,"tooltipRefresh",{text:k,x:f+c.plotLeft,y:g+c.plotTop,borderColor:l})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(A(c.x),A(c.y||0),a.plotX+b.plotLeft,a.plotY+b.plotTop)},getXDateFormat:function(a,b,c){var d,
b=b.dateTimeLabelFormats,e=c&&c.closestPointRange,f,g={millisecond:15,second:12,minute:9,hour:6,day:3},h,i="millisecond";if(e){h=Qa("%m-%d %H:%M:%S.%L",a.x);for(f in G){if(e===G.week&&+Qa("%w",a.x)===c.options.startOfWeek&&h.substr(6)==="00:00:00.000"){f="week";break}if(G[f]>e){f=i;break}if(g[f]&&h.substr(g[f])!=="01-01 00:00:00.000".substr(g[f]))break;f!=="week"&&(i=f)}f&&(d=b[f])}else d=b.day;return d||b.year},tooltipFooterHeaderFormatter:function(a,b){var c=b?"footer":"header",d=a.series,e=d.tooltipOptions,
f=e.xDateFormat,g=d.xAxis,h=g&&g.options.type==="datetime"&&ma(a.key),c=e[c+"Format"];h&&!f&&(f=this.getXDateFormat(a,e,g));h&&f&&(c=c.replace("{point.key}","{point.key:"+f+"}"));return Ka(c,{point:a,series:d})},bodyFormatter:function(a){return Ba(a,function(a){var c=a.series.tooltipOptions;return(c.pointFormatter||a.point.tooltipFormatter).call(a.point,c.pointFormat)})}};var ea;db=y&&y.documentElement.ontouchstart!==z;var Xa=B.Pointer=function(a,b){this.init(a,b)};Xa.prototype={init:function(a,b){var c=
b.chart,d=c.events,e=ha?"":c.zoomType,c=a.inverted,f;this.options=b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};if(B.Tooltip&&b.tooltip.enabled)a.tooltip=new Pb(a,b.tooltip),this.followTouchMove=p(b.tooltip.followTouchMove,!0);this.setDOMEvents()},normalize:function(a,b){var c,d,a=a||E.event;if(!a.target)a.target=a.srcElement;d=a.touches?
a.touches.length?a.touches.item(0):a.changedTouches[0]:a;if(!b)this.chartPosition=b=Ab(this.chart.container);d.pageX===z?(c=t(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return u(a,{chartX:A(c),chartY:A(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};o(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e=d?d.shared:!1,f=b.hoverPoint,
g=b.hoverSeries,h=[Number.MAX_VALUE,Number.MAX_VALUE],i,k,j=[],l=[],m;if(!e&&!g)for(b=0;b<c.length;b++)if(c[b].directTouch||!c[b].options.stickyTracking)c=[];g&&(e?g.noSharedTooltip:g.directTouch)&&f?l=[f]:(o(c,function(b){i=b.noSharedTooltip&&e;k=!e&&b.directTouch;b.visible&&!i&&!k&&p(b.options.enableMouseTracking,!0)&&(m=b.searchPoint(a,!i&&b.kdDimensions===1))&&j.push(m)}),o(j,function(a){a&&o(["dist","distX"],function(b,c){typeof a[b]==="number"&&a[b]<h[c]&&(h[c]=a[b],l[c]=a)})}));if(e)for(b=
j.length;b--;)(j[b].clientX!==l[1].clientX||j[b].series.noSharedTooltip)&&j.splice(b,1);if(l[0]&&(l[0]!==this.prevKDPoint||d&&d.isHidden))if(e&&!l[0].series.noSharedTooltip)j.length&&d&&d.refresh(j,a),o(j,function(b){b.onMouseOver(a,b!==(g&&g.directTouch&&f||l[0]))}),this.prevKDPoint=l[1];else{d&&d.refresh(l[0],a);if(!g||!g.directTouch)l[0].onMouseOver(a);this.prevKDPoint=l[0]}else c=g&&g.tooltipOptions.followPointer,d&&c&&!d.isHidden&&(c=d.getAnchor([{}],a),d.updatePosition({plotX:c[0],plotY:c[1]}));
if(!this._onDocumentMouseMove)this._onDocumentMouseMove=function(a){if(S[ea])S[ea].pointer.onDocumentMouseMove(a)},M(y,"mousemove",this._onDocumentMouseMove);o(e?j:[p(l[1],f)],function(b){var c=b&&b.series;c&&o(["xAxis","yAxis","colorAxis"],function(d){c[d]&&c[d].drawCrosshair(a,b)})})},reset:function(a,b){var c=this.chart,d=c.hoverSeries,e=c.hoverPoint,f=c.hoverPoints,g=c.tooltip,h=g&&g.shared?f:e;(a=a&&g&&h)&&o(ta(h),function(b){b.plotX===void 0&&(a=!1)});if(a)g.refresh(h),e&&(e.setState(e.state,
!0),o(c.axes,function(a){p(a.options.crosshair&&a.options.crosshair.snap,!0)?a.drawCrosshair(null,e):a.hideCrosshair()}));else{if(e)e.onMouseOut();f&&o(f,function(a){a.setState()});if(d)d.onMouseOut();g&&g.hide(b);if(this._onDocumentMouseMove)V(y,"mousemove",this._onDocumentMouseMove),this._onDocumentMouseMove=null;o(c.axes,function(a){a.hideCrosshair()});this.hoverX=c.hoverPoints=c.hoverPoint=null}},scaleGroups:function(a,b){var c=this.chart,d;o(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&
e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,h=b.plotLeft,i=b.plotTop,k=b.plotWidth,j=b.plotHeight,
l,m=this.selectionMarker,n=this.mouseDownX,r=this.mouseDownY,s=c.panKey&&a[c.panKey+"Key"];if(!m||!m.touch)if(d<h?d=h:d>h+k&&(d=h+k),e<i?e=i:e>i+j&&(e=i+j),this.hasDragged=Math.sqrt(Math.pow(n-d,2)+Math.pow(r-e,2)),this.hasDragged>10){l=b.isInsidePlot(n-h,r-i);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&l&&!s&&!m)this.selectionMarker=m=b.renderer.rect(h,i,f?1:k,g?1:j,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();m&&f&&(d-=n,m.attr({width:P(d),x:(d>0?0:d)+n}));
m&&g&&(d=e-r,m.attr({height:P(d),y:(d>0?0:d)+r}));l&&!m&&c.panning&&b.pan(a,c.panning)}},drop:function(a){var b=this,c=this.chart,d=this.hasPinched;if(this.selectionMarker){var e={originalEvent:a,xAxis:[],yAxis:[]},f=this.selectionMarker,g=f.attr?f.attr("x"):f.x,h=f.attr?f.attr("y"):f.y,i=f.attr?f.attr("width"):f.width,k=f.attr?f.attr("height"):f.height,j;if(this.hasDragged||d)o(c.axes,function(c){if(c.zoomEnabled&&q(c.min)&&(d||b[{xAxis:"zoomX",yAxis:"zoomY"}[c.coll]])){var f=c.horiz,n=a.type===
"touchend"?c.minPixelPadding:0,r=c.toValue((f?g:h)+n),f=c.toValue((f?g+i:h+k)-n);e[c.coll].push({axis:c,min:F(r,f),max:t(r,f)});j=!0}}),j&&H(c,"selection",e,function(a){c.zoom(u(a,d?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();d&&this.scaleGroups()}if(c)L(c.container,{cursor:c._cursor}),c.cancelClick=this.hasDragged>10,c.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();
this.dragStart(a)},onDocumentMouseUp:function(a){S[ea]&&S[ea].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,a=this.normalize(a,c);c&&!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&this.reset()},onContainerMouseLeave:function(a){var b=S[ea];if(b&&(a.relatedTarget||a.toElement))b.pointer.reset(),b.pointer.chartPosition=null},onContainerMouseMove:function(a){var b=this.chart;if(!q(ea)||!S[ea]||!S[ea].mouseIsDown)ea=
b.index;a=this.normalize(a);a.returnValue=!1;b.mouseIsDown==="mousedown"&&this.drag(a);(this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop))&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=K(a,"class")){if(c.indexOf(b)!==-1)return!0;if(c.indexOf("highcharts-container")!==-1)return!1}a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries,a=a.relatedTarget||a.toElement;if(b&&a&&!b.options.stickyTracking&&
!this.inClass(a,"highcharts-tooltip")&&!this.inClass(a,"highcharts-series-"+b.index))b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,a=this.normalize(a);b.cancelClick||(c&&this.inClass(a.target,"highcharts-tracker")?(H(c.series,"click",u(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(u(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&H(b,"click",a)))},setDOMEvents:function(){var a=this,b=a.chart.container;b.onmousedown=
function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};M(b,"mouseleave",a.onContainerMouseLeave);eb===1&&M(y,"mouseup",a.onDocumentMouseUp);if(db)b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},eb===1&&M(y,"touchend",a.onDocumentTouchEnd)},destroy:function(){var a;V(this.chart.container,"mouseleave",this.onContainerMouseLeave);eb||(V(y,"mouseup",this.onDocumentMouseUp),
V(y,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};u(B.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,b,c,d,e,f,g,h){var i=this.chart,k=a?"x":"y",j=a?"X":"Y",l="chart"+j,m=a?"width":"height",n=i["plot"+(a?"Left":"Top")],r,s,p=h||1,o=i.inverted,x=i.bounds[a?
"h":"v"],w=b.length===1,q=b[0][l],t=c[0][l],u=!w&&b[1][l],A=!w&&c[1][l],B,c=function(){!w&&P(q-u)>20&&(p=h||P(t-A)/P(q-u));s=(n-t)/p+q;r=i["plot"+(a?"Width":"Height")]/p};c();b=s;b<x.min?(b=x.min,B=!0):b+r>x.max&&(b=x.max-r,B=!0);B?(t-=0.8*(t-g[k][0]),w||(A-=0.8*(A-g[k][1])),c()):g[k]=[t,A];o||(f[k]=s-n,f[m]=r);f=o?1/p:p;e[m]=r;e[k]=b;d[o?a?"scaleY":"scaleX":"scale"+j]=p;d["translate"+j]=f*n+(t-f*q)},pinch:function(a){var b=this,c=b.chart,d=b.pinchDown,e=a.touches,f=e.length,g=b.lastValidTouch,h=
b.hasZoom,i=b.selectionMarker,k={},j=f===1&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||b.runChartClick),l={};if(f>1)b.initiated=!0;h&&b.initiated&&!j&&a.preventDefault();Ba(e,function(a){return b.normalize(a)});if(a.type==="touchstart")o(e,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),g.x=[d[0].chartX,d[1]&&d[1].chartX],g.y=[d[0].chartY,d[1]&&d[1].chartY],o(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?"h":"v"],d=a.minPixelPadding,e=a.toPixels(p(a.options.min,
a.dataMin)),f=a.toPixels(p(a.options.max,a.dataMax)),g=F(e,f),e=t(e,f);b.min=F(a.pos,g-d);b.max=t(a.pos+a.len,e+d)}}),b.res=!0;else if(d.length){if(!i)b.selectionMarker=i=u({destroy:Aa,touch:!0},c.plotBox);b.pinchTranslate(d,e,k,i,l,g);b.hasPinched=h;b.scaleGroups(k,l);if(!h&&b.followTouchMove&&f===1)this.runPointActions(b.normalize(a));else if(b.res)b.res=!1,this.reset(!1,0)}},touch:function(a,b){var c=this.chart;ea=c.index;a.touches.length===1?(a=this.normalize(a),c.isInsidePlot(a.chartX-c.plotLeft,
a.chartY-c.plotTop)&&!c.openMenu?(b&&this.runPointActions(a),this.pinch(a)):b&&this.reset()):a.touches.length===2&&this.pinch(a)},onContainerTouchStart:function(a){this.touch(a,!0)},onContainerTouchMove:function(a){this.touch(a)},onDocumentTouchEnd:function(a){S[ea]&&S[ea].pointer.drop(a)}});if(E.PointerEvent||E.MSPointerEvent){var va={},Db=!!E.PointerEvent,Sb=function(){var a,b=[];b.item=function(a){return this[a]};for(a in va)va.hasOwnProperty(a)&&b.push({pageX:va[a].pageX,pageY:va[a].pageY,target:va[a].target});
return b},Eb=function(a,b,c,d){if((a.pointerType==="touch"||a.pointerType===a.MSPOINTER_TYPE_TOUCH)&&S[ea])d(a),d=S[ea].pointer,d[b]({type:c,target:a.currentTarget,preventDefault:Aa,touches:Sb()})};u(Xa.prototype,{onContainerPointerDown:function(a){Eb(a,"onContainerTouchStart","touchstart",function(a){va[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){Eb(a,"onContainerTouchMove","touchmove",function(a){va[a.pointerId]={pageX:a.pageX,pageY:a.pageY};
if(!va[a.pointerId].target)va[a.pointerId].target=a.currentTarget})},onDocumentPointerUp:function(a){Eb(a,"onDocumentTouchEnd","touchend",function(a){delete va[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,Db?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,Db?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(y,Db?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});fb(Xa.prototype,"init",function(a,b,c){a.call(this,b,c);this.hasZoom&&
L(b.container,{"-ms-touch-action":"none","touch-action":"none"})});fb(Xa.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(M)});fb(Xa.prototype,"destroy",function(a){this.batchMSEvents(V);a.call(this)})}var ob=B.Legend=function(a,b){this.init(a,b)};ob.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=b.itemMarginTop||0;this.options=b;if(b.enabled)c.itemStyle=d,c.itemHiddenStyle=D(d,b.itemHiddenStyle),c.itemMarginTop=e,c.padding=d=p(b.padding,
8),c.initialItemX=d,c.initialItemY=d-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.symbolWidth=p(b.symbolWidth,16),c.pages=[],c.render(),M(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,i={fill:h},k;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(k in i.stroke=
h,g=a.convertAttribs(g),g)d=g[k],d!==z&&(i[k]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;(a=a.legendGroup)&&a.element&&a.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;o(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&Ta(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();
if(a)this.group=a.destroy()},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight,e=this.titleHeight;if(b)c=b.translateY,o(this.allItems,function(f){var g=f.checkbox,h;g&&(h=c+e+g.y+(a||0)+3,L(g,{left:b.translateX+f.checkboxOffset+g.x-20+"px",top:h+"px",display:h>c-6&&h<c+d-6?"":"none"}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,
null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);a=this.title.getBBox();c=a.height;this.offsetWidth=a.width;this.contentGroup.attr({translateY:c})}this.titleHeight=c},setText:function(a){var b=this.options;a.legendItem.attr({text:b.labelFormat?Ka(b.labelFormat,a):b.labelFormatter.call(a)})},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,e=d.layout==="horizontal",f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,i=this.itemHiddenStyle,k=this.padding,j=e?p(d.itemDistance,
20):0,l=!d.rtl,m=d.width,n=d.itemMarginBottom||0,r=this.itemMarginTop,s=this.initialItemX,o=a.legendItem,v=a.series&&a.series.drawLegendSymbol?a.series:a,x=v.options,x=this.createCheckboxForItem&&x&&x.showCheckbox,w=d.useHTML;if(!o){a.legendGroup=c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup);a.legendItem=o=c.text("",l?f+g:-g,this.baseline||0,w).css(D(a.visible?h:i)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup);if(!this.baseline)this.fontMetrics=c.fontMetrics(h.fontSize,o),
this.baseline=this.fontMetrics.f+3+r,o.attr("y",this.baseline);v.drawLegendSymbol(this,a);this.setItemEvents&&this.setItemEvents(a,o,w,h,i);x&&this.createCheckboxForItem(a)}this.colorizeItem(a,a.visible);this.setText(a);c=o.getBBox();f=a.checkboxOffset=d.itemWidth||a.legendItemWidth||f+g+c.width+j+(x?20:0);this.itemHeight=g=A(a.legendItemHeight||c.height);if(e&&this.itemX-s+f>(m||b.chartWidth-2*k-s-d.x))this.itemX=s,this.itemY+=r+this.lastLineHeight+n,this.lastLineHeight=0;this.maxItemWidth=t(this.maxItemWidth,
f);this.lastItemY=r+this.itemY+n;this.lastLineHeight=t(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=r+g+n,this.lastLineHeight=g);this.offsetWidth=m||t((e?this.itemX-s-j:f)+k,this.offsetWidth)},getAllItems:function(){var a=[];o(this.chart.series,function(b){var c=b.options;if(p(c.showInLegend,!q(c.linkedTo)?z:!1,!0))a=a.concat(b.legendItems||(c.legendType==="point"?b.data:b))});return a},adjustMargins:function(a,b){var c=this.chart,d=this.options,e=d.align.charAt(0)+
d.verticalAlign.charAt(0)+d.layout.charAt(0);this.display&&!d.floating&&o([/(lth|ct|rth)/,/(rtv|rm|rbv)/,/(rbh|cb|lbh)/,/(lbv|lm|ltv)/],function(f,g){f.test(e)&&!q(a[g])&&(c[nb[g]]=t(c[nb[g]],c.legend[(g+1)%2?"legendHeight":"legendWidth"]+[1,-1,-1,1][g]*d[g%2?"x":"y"]+p(d.margin,12)+b[g]))})},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,k=a.options,j=a.padding,l=k.borderWidth,m=k.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=
0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);a.renderTitle();e=a.getAllItems();ib(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});k.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;a.lastLineHeight=0;o(e,function(b){a.renderItem(b)});g=(k.width||a.offsetWidth)+j;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);h+=j;if(l||m){if(i){if(g>
0&&h>0)i[i.isNew?"attr":"animate"](i.crisp({width:g,height:h})),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,k.borderRadius,l||0).attr({stroke:k.borderColor,"stroke-width":l||0,fill:m||"none"}).add(d).shadow(k.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;o(e,function(b){a.positionItem(b)});f&&d.align(u({width:g,height:h},k),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+
(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h,i=this.clipRect,k=e.navigation,j=p(k.animation,!0),l=k.arrowSize||12,m=this.nav,n=this.pages,r=this.padding,s,R=this.allItems,v=function(a){i.attr({height:a});if(b.contentGroup.div)b.contentGroup.div.style.clip="rect("+r+"px,9999px,"+(r+a)+"px,0)"};e.layout==="horizontal"&&(f/=2);g&&(f=F(f,g));n.length=0;if(a>f){this.clipHeight=h=t(f-20-this.titleHeight-r,0);this.currentPage=p(this.currentPage,1);this.fullHeight=a;o(R,function(a,b){var c=
a._legendItemPos[1],d=A(a.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>h&&(s||c)!==n[e-1])n.push(s||c),e++;b===R.length-1&&c+d-n[e-1]>h&&n.push(c);c!==s&&(s=c)});if(!i)i=b.clipRect=d.clipRect(0,r,9999,0),b.contentGroup.clip(i);v(h);if(!m)this.nav=m=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,l,l).on("click",function(){b.scroll(-1,j)}).add(m),this.pager=d.text("",15,10).css(k.style).add(m),this.down=d.symbol("triangle-down",0,0,l,l).on("click",function(){b.scroll(1,
j)}).add(m);b.scroll(0);a=f}else if(m)v(c.chartHeight),m.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,f=this.clipHeight,g=this.options.navigation,h=g.activeColor,g=g.inactiveColor,i=this.pager,k=this.padding;e>d&&(e=d);if(e>0)b!==z&&Ua(b,this.chart),this.nav.attr({translateX:k,translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:e===1?g:h}).css({cursor:e===1?"default":
"pointer"}),i.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=e,this.positionCheckboxes(c)}};J=B.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||a.fontMetrics.f;b.legendSymbol=this.chart.renderer.rect(0,a.baseline-c+1,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=
this.options,c=b.marker,d=a.symbolWidth,e=this.chart.renderer,f=this.legendGroup,a=a.baseline-A(a.fontMetrics.b*0.3),g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=e.path(["M",0,a,"L",d,a]).attr(g).add(f)}if(c&&c.enabled!==!1)b=c.radius,this.legendSymbol=c=e.symbol(this.symbol,d/2-b,a-b,2*b,2*b,c).add(f),c.isMarker=!0}};(/Trident\/7\.0/.test(za)||Ma)&&fb(ob.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,
b)};d();setTimeout(d)});var hb=B.Chart=function(){this.getArgs.apply(this,arguments)};B.chart=function(a,b,c){return new hb(a,b,c)};hb.prototype={callbacks:[],getArgs:function(){var a=[].slice.call(arguments);if(xa(a[0])||a[0].nodeName)this.renderTo=a.shift();this.init(a[0],a[1])},init:function(a,b){var c,d=a.series;a.series=null;c=D(N,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",d);var e=d.events;this.bounds=
{h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=S.length;S.push(f);eb++;d.reflow!==!1&&M(f,"load",function(){f.initReflow()});if(e)for(g in e)M(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=ha?!1:p(d.animation,!0);f.pointCount=f.colorCounter=f.symbolCounter=0;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=I[a.type||b.type||b.defaultSeriesType])||X(17,!0);b=new b;b.init(this,a);return b},
isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,i=this.hasCartesianSeries,k=this.isDirtyBox,j=c.length,l=j,m=this.renderer,n=m.isHidden(),r=[];Ua(a,this);n&&this.cloneRenderTo();for(this.layOutTitles();l--;)if(a=c[l],a.options.stacking&&(g=!0,a.isDirty)){h=!0;break}if(h)for(l=j;l--;)if(a=c[l],a.options.stacking)a.isDirty=!0;o(c,function(a){a.isDirty&&
a.options.legendType==="point"&&(a.updateTotals&&a.updateTotals(),f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;g&&this.getStacks();if(i&&!this.isResizing)this.maxTicks=null,o(b,function(a){a.setScale()});this.getMargins();i&&(o(b,function(a){a.isDirty&&(k=!0)}),o(b,function(a){var b=a.min+","+a.max;if(a.extKey!==b)a.extKey=b,r.push(function(){H(a,"afterSetExtremes",u(a.eventArgs,a.getExtremes()));delete a.eventArgs});(k||g)&&a.redraw()}));k&&this.drawChartBox();o(c,function(a){a.isDirty&&
a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);m.draw();H(this,"redraw");n&&this.cloneRenderTo(!0);o(r,function(a){a.call()})},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=ta(b.xAxis||{}),b=b.yAxis=ta(b.yAxis||
{});o(c,function(a,b){a.index=b;a.isX=!0});o(b,function(a,b){a.index=b});c=c.concat(b);o(c,function(b){new ka(a,b)})},getSelectedPoints:function(){var a=[];o(this.series,function(b){a=a.concat(Na(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Na(this.series,function(a){return a.selected})},setTitle:function(a,b,c){var g;var d=this,e=d.options,f;f=e.title=D(e.title,a);g=e.subtitle=D(e.subtitle,b),e=g;o([["title",a,f],["subtitle",b,e]],function(a){var b=
a[0],c=d[b],e=a[1],a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.renderer,h=this.spacingBox.width-44;if(c&&(c.css({width:(f.width||h)+"px"}).align(u({y:g.fontMetrics(f.style.fontSize,c).b-3},f),!1,"spacingBox"),!f.floating&&!f.verticalAlign))b=
c.getBBox().height;d&&(d.css({width:(e.width||h)+"px"}).align(u({y:b+(f.margin-13)+g.fontMetrics(e.style.fontSize,c).b},e),!1,"spacingBox"),!e.floating&&!e.verticalAlign&&(b=ua(b+d.getBBox().height)));c=this.titleOffset!==b;this.titleOffset=b;if(!this.isDirtyBox&&c)this.isDirtyBox=c,this.hasRendered&&p(a,!0)&&this.isDirtyBox&&this.redraw()},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;if(!q(b))this.containerWidth=ja(c,"width");if(!q(a))this.containerHeight=
ja(c,"height");this.chartWidth=t(0,b||this.containerWidth||600);this.chartHeight=t(0,p(a,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;a?b&&(this.renderTo.appendChild(c),Ta(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),L(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block",
"important"),y.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options,c=b.chart,d,e;a=this.renderTo;var f="highcharts-"+zb++;if(!a)this.renderTo=a=c.renderTo;if(xa(a))this.renderTo=a=y.getElementById(a);a||X(13,!0);d=C(K(a,"data-highcharts-chart"));!isNaN(d)&&S[d]&&S[d].hasRendered&&S[d].destroy();K(a,"data-highcharts-chart",this.index);a.innerHTML="";!c.skipClone&&!a.offsetWidth&&this.cloneRenderTo();this.getChartSize();d=this.chartWidth;e=this.chartHeight;this.container=
a=Z(La,{className:"highcharts-container"+(c.className?" "+c.className:""),id:f},u({position:"relative",overflow:"hidden",width:d+"px",height:e+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},c.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=new (B[c.renderer]||cb)(a,d,e,c.style,c.forExport,b.exporting&&b.exporting.allowHTML);ha&&this.renderer.create(this,a,d,e);this.renderer.chartIndex=this.index},getMargins:function(a){var b=
this.spacing,c=this.margin,d=this.titleOffset;this.resetMargins();if(d&&!q(c[0]))this.plotTop=t(this.plotTop,d+this.options.title.margin+b[0]);this.legend.adjustMargins(c,b);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);a||this.getAxisMargins()},getAxisMargins:function(){var a=this,b=a.axisOffset=[0,0,0,0],c=a.margin;a.hasCartesianSeries&&o(a.axes,function(a){a.visible&&a.getOffset()});o(nb,function(d,e){q(c[e])||(a[d]+=
b[e])});a.setChartSize()},reflow:function(a){var b=this,c=b.options.chart,d=b.renderTo,e=c.width||ja(d,"width"),f=c.height||ja(d,"height"),c=a?a.target:E;if(!b.hasUserSize&&!b.isPrinting&&e&&f&&(c===E||c===y)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),b.reflowTimeout=Pa(function(){if(b.container)b.setSize(e,f,!1),b.hasUserSize=null},a?100:0);b.containerWidth=e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};M(E,"resize",b);M(a,"destroy",
function(){V(E,"resize",b)})},setSize:function(a,b,c){var d=this,e,f,g=d.renderer;d.isResizing+=1;Ua(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(q(a))d.chartWidth=e=t(0,A(a)),d.hasUserSize=!!e;if(q(b))d.chartHeight=f=t(0,A(b));a=g.globalAnimation;(a?Wa:L)(d.container,{width:e+"px",height:f+"px"},a);d.setChartSize(!0);g.setSize(e,f,c);d.maxTicks=null;o(d.axes,function(a){a.isDirty=!0;a.setScale()});o(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();
d.getMargins();d.redraw(c);d.oldChartHeight=null;H(d,"resize");a=g.globalAnimation;Pa(function(){d&&H(d,"endResize",null,function(){d.isResizing-=1})},a===!1?0:a&&a.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,i,k,j,l;this.plotLeft=i=A(this.plotLeft);this.plotTop=k=A(this.plotTop);this.plotWidth=j=t(0,A(d-i-this.marginRight));this.plotHeight=l=t(0,A(e-k-this.marginBottom));this.plotSizeX=
b?l:j;this.plotSizeY=b?j:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:i,y:k,width:j,height:l};d=2*T(this.plotBorderWidth/2);b=ua(t(d,h[3])/2);c=ua(t(d,h[0])/2);this.clipBox={x:b,y:c,width:T(this.plotSizeX-t(d,h[1])/2-b),height:t(0,T(this.plotSizeY-t(d,h[2])/2-c))};a||o(this.axes,function(a){a.setAxisSize();a.setAxisTranslation()})},resetMargins:function(){var a=this;o(nb,function(b,c){a[b]=p(a.margin[c],
a.spacing[c])});a.axisOffset=[0,0,0,0];a.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,k=a.backgroundColor,j=a.plotBackgroundColor,l=a.plotBackgroundImage,m=a.plotBorderWidth||0,n,r=this.plotLeft,p=this.plotTop,o=this.plotWidth,v=this.plotHeight,x=this.plotBox,w=this.clipRect,t=this.clipBox;n=i+(a.shadow?8:0);if(i||k)if(e)e.animate(e.crisp({width:c-
n,height:d-n}));else{e={fill:k||"none"};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(n/2,n/2,c-n,d-n,a.borderRadius,i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)}if(j)f?f.animate(x):this.plotBackground=b.rect(r,p,o,v,0).attr({fill:j}).add().shadow(a.plotShadow);if(l)h?h.animate(x):this.plotBGImage=b.image(l,r,p,o,v).add();w?w.animate({width:t.width,height:t.height}):this.clipRect=b.clipRect(t);if(m)g?(g.strokeWidth=-m,g.animate(g.crisp({x:r,y:p,
width:o,height:v}))):this.plotBorder=b.rect(r,p,o,v,0,-m).attr({stroke:a.plotBorderColor,"stroke-width":m,fill:"none",zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;o(["inverted","angular","polar"],function(g){c=I[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];for(e=d&&d.length;!f&&e--;)(c=I[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;o(b,function(a){a.linkedSeries.length=
0});o(b,function(b){var d=b.options.linkedTo;if(xa(d)&&(d=d===":previous"?a.series[b.index-1]:a.get(d)))d.linkedSeries.push(b),b.linkedParent=d,b.visible=p(b.options.visible,d.options.visible,b.visible)})},renderSeries:function(){o(this.series,function(a){a.translate();a.render()})},renderLabels:function(){var a=this,b=a.options.labels;b.items&&o(b.items,function(c){var d=u(b.style,c.style),e=C(d.left)+a.plotLeft,f=C(d.top)+a.plotTop+12;delete d.left;delete d.top;a.renderer.text(c.html,e,f).attr({zIndex:2}).css(d).add()})},
render:function(){var a=this.axes,b=this.renderer,c=this.options,d,e,f,g;this.setTitle();this.legend=new ob(this,c.legend);this.getStacks&&this.getStacks();this.getMargins(!0);this.setChartSize();d=this.plotWidth;e=this.plotHeight-=21;o(a,function(a){a.setScale()});this.getAxisMargins();f=d/this.plotWidth>1.1;g=e/this.plotHeight>1.05;if(f||g)this.maxTicks=null,o(a,function(a){(a.horiz&&f||!a.horiz&&g)&&a.setTickInterval(!0)}),this.getMargins();this.drawChartBox();this.hasCartesianSeries&&o(a,function(a){a.visible&&
a.render()});if(!this.seriesGroup)this.seriesGroup=b.g("series-group").attr({zIndex:3}).add();this.renderSeries();this.renderLabels();this.showCredits(c.credits);this.hasRendered=!0},showCredits:function(a){if(a.enabled&&!this.credits)this.credits=this.renderer.text(a.text,0,0).on("click",function(){if(a.href)E.location.href=a.href}).attr({align:a.position.align,zIndex:8}).css(a.style).add().align(a.position)},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;H(a,
"destroy");S[a.index]=z;eb--;a.renderTo.removeAttribute("data-highcharts-chart");V(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();o("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",V(d),f&&Ta(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;
return!ca&&E==E.top&&y.readyState!=="complete"||ha&&!E.canvg?(ha?Ob.push(function(){a.firstRender()},a.options.global.canvasToolsURL):y.attachEvent("onreadystatechange",function(){y.detachEvent("onreadystatechange",a.firstRender);y.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options;if(a.isReadyToRender()){a.getContainer();H(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();o(b.series||[],function(b){a.initSeries(b)});a.linkSeries();
H(a,"beforeRender");if(B.Pointer)a.pointer=new Xa(a,b);a.render();a.renderer.draw();if(!a.renderer.imgCount)a.onload();a.cloneRenderTo(!0)}},onload:function(){var a=this;o([this.callback].concat(this.callbacks),function(b){b&&a.index!==void 0&&b.apply(a,[a])});a.renderer.imgCount||H(a,"load")},splashArray:function(a,b){var c=b[a],c=Y(c)?c:[c,c,c,c];return[p(b[a+"Top"],c[0]),p(b[a+"Right"],c[1]),p(b[a+"Bottom"],c[2]),p(b[a+"Left"],c[3])]}};var Cb=B.CenteredSeriesMixin={getCenter:function(){var a=this.options,
b=this.chart,c=2*(a.slicedOffset||0),d=b.plotWidth-2*c,b=b.plotHeight-2*c,e=a.center,e=[p(e[0],"50%"),p(e[1],"50%"),a.size||"100%",a.innerSize||0],f=F(d,b),g,h;for(g=0;g<4;++g)h=e[g],a=g<2||g===2&&/%$/.test(h),e[g]=(/%$/.test(h)?[d,b,f,e[2]][g]*parseFloat(h)/100:parseFloat(h))+(a?c:0);e[3]>e[2]&&(e[3]=e[2]);return e}},Ha=function(){};Ha.prototype={init:function(a,b,c){this.series=a;this.color=a.color;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,
this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.options.pointValKey||c.pointValKey,a=Ha.prototype.optionsToObject.call(this,a);u(this,a);this.options=this.options?u(this.options,a):a;if(d)this.y=this[d];this.isNull=this.y===null;if(typeof this.x!=="number"&&c)this.x=b===void 0?c.autoIncrement():b;return this},optionsToObject:function(a){var b={},c=this.series,d=c.options.keys,
e=d||c.pointArrayMap||["y"],f=e.length,g=0,h=0;if(typeof a==="number"||a===null)b[e[0]]=a;else if(Ia(a)){if(!d&&a.length>f){c=typeof a[0];if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];g++}for(;h<f;){if(!d||a[g]!==void 0)b[e[h]]=a[g];g++;h++}}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;if(b&&(this.setState(),oa(b,this),!b.length))a.hoverPoints=
null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)V(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a=["graphic","dataLabel","dataLabelUpper","connector","shadowGroup"],b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,color:this.color,key:this.name||this.category,series:this.series,point:this,percentage:this.percentage,
total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=p(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";o(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return Ka(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&this.importEvents();a==="click"&&
e.allowPointSelect&&(c=function(a){d.select&&d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});H(this,a,b,c)},visible:!0};var Q=B.Series=function(){};Q.prototype={isCartesian:!0,type:"line",pointClass:Ha,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},directTouch:!1,axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return p(a.options.index,a._i)-
p(b.options.index,b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();u(c,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(ha)b.animation=!1;e=b.events;for(d in e)M(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();o(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(b.data,!1);if(c.isCartesian)a.hasCartesianSeries=!0;f.push(c);c._i=f.length-
1;ib(f,g);this.yAxis&&ib(this.yAxis.series,g);o(f,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;o(a.axisTypes||[],function(e){o(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==z&&b[e]===d.id||b[e]===z&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});!a[e]&&a.optionalAxis!==e&&X(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments;o(c.parallelArrays,typeof b==="number"?function(d){var f=d==="y"&&c.toYData?
c.toYData(a):a[d];c[d+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))})},autoIncrement:function(){var a=this.options,b=this.xIncrement,c,d=a.pointIntervalUnit,b=p(b,a.pointStart,0);this.pointInterval=c=p(this.pointInterval,a.pointInterval,1);if(d==="month"||d==="year")a=new qa(b),a=d==="month"?+a[xb](a[ab]()+c):+a[yb](a[bb]()+c),c=a-b;this.xIncrement=b+c;return b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=
b.plotOptions||{},e=c[this.type];this.userOptions=a;c=D(e,c.series,a);this.tooltipOptions=D(N.tooltip,N.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);e.marker===null&&delete c.marker;this.zoneAxis=c.zoneAxis;a=this.zones=(c.zones||[]).slice();if((c.negativeColor||c.negativeFillColor)&&!c.zones)a.push({value:c[this.zoneAxis+"Threshold"]||c.threshold||0,color:c.negativeColor,fillColor:c.negativeFillColor});a.length&&q(a[a.length-1].value)&&
a.push({color:this.color,fillColor:this.fillColor});return c},getCyclic:function(a,b,c){var d=this.userOptions,e="_"+a+"Index",f=a+"Counter";b||(q(d[e])?b=d[e]:(d[e]=b=this.chart[f]%c.length,this.chart[f]+=1),b=c[b]);this[a]=b},getColor:function(){this.options.colorByPoint?this.options.color=null:this.getCyclic("color",this.options.color||aa[this.type].color,this.chart.options.colors)},getSymbol:function(){var a=this.options.marker;this.getCyclic("symbol",a.symbol,this.chart.options.symbols);if(/^url/.test(this.symbol))a.radius=
0},drawLegendSymbol:J.drawLineMarker,setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,i=e.options,k=e.chart,j=null,l=e.xAxis,m=l&&!!l.categories,n=i.turboThreshold,r=this.xData,s=this.yData,t=(h=e.pointArrayMap)&&h.length,a=a||[];h=a.length;b=p(b,!0);if(d!==!1&&h&&g===h&&!e.cropped&&!e.hasGroupedData&&e.visible)o(a,function(a,b){f[b].update&&a!==i.data[b]&&f[b].update(a,!1,null,!1)});else{e.xIncrement=null;e.colorCounter=0;o(this.parallelArrays,function(a){e[a+"Data"].length=0});
if(n&&h>n){for(c=0;j===null&&c<h;)j=a[c],c++;if(ma(j)){m=p(i.pointStart,0);j=p(i.pointInterval,1);for(c=0;c<h;c++)r[c]=m,s[c]=a[c],m+=j;e.xIncrement=m}else if(Ia(j))if(t)for(c=0;c<h;c++)j=a[c],r[c]=j[0],s[c]=j.slice(1,t+1);else for(c=0;c<h;c++)j=a[c],r[c]=j[0],s[c]=j[1];else X(12)}else for(c=0;c<h;c++)if(a[c]!==z&&(j={series:e},e.pointClass.prototype.applyOptions.apply(j,[a[c]]),e.updateParallelArrays(j,c),m&&q(j.name)))l.names[j.x]=j.name;xa(s[0])&&X(14,!0);e.data=[];e.options.data=e.userOptions.data=
a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();if(l)l.minRange=l.userMinRange;e.isDirty=e.isDirtyData=k.isDirtyBox=!0;c=!1}i.legendType==="point"&&(this.processData(),this.generatePoints());b&&k.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,i,k=this.options;i=k.cropThreshold;var j=this.getExtremesFromAll||k.getExtremesFromAll,l=this.isCartesian,k=h&&h.val2lin,m=h&&h.isLog,n,p;if(l&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;
if(h)a=h.getExtremes(),n=a.min,p=a.max;if(l&&this.sorted&&!j&&(!i||d>i||this.forceCrop))if(b[d-1]<n||b[0]>p)b=[],c=[];else if(b[0]<n||b[d-1]>p)e=this.cropData(this.xData,this.yData,n,p),b=e.xData,c=e.yData,e=e.start,f=!0;for(i=b.length||1;--i;)d=m?k(b[i])-k(b[i-1]):b[i]-b[i-1],d>0&&(g===z||d<g)?g=d:d<0&&this.requireSorting&&X(15);this.cropped=f;this.cropStart=e;this.processedXData=b;this.processedYData=c;this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=p(this.cropShoulder,
1),i;for(i=0;i<e;i++)if(a[i]>=c){f=t(0,i-h);break}for(c=i;c<e;c++)if(a[c]>d){g=c+h;break}return{xData:a.slice(f,g),yData:b.slice(f,g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,k=this.hasGroupedData,j,l=[],m;if(!b&&!k)b=[],b.length=a.length,b=this.data=b;for(m=0;m<g;m++)i=h+m,k?l[m]=(new f).init(this,[d[m]].concat(ta(e[m]))):(b[i]?j=b[i]:a[i]!==z&&(b[i]=j=(new f).init(this,
a[i],d[m])),l[m]=j),l[m].index=i;if(b&&(g!==(c=b.length)||k))for(m=0;m<c;m++)if(m===h&&!k&&(m+=g),b[m])b[m].destroyElements(),b[m].plotX=z;this.data=b;this.points=l},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,i,k,j,l,a=a||this.stackedYData||this.processedYData;d=a.length;for(l=0;l<d;l++)if(k=c[l],j=a[l],i=j!==null&&j!==z&&(!b.isLog||j.length||j>0),k=this.getExtremesFromAll||this.options.getExtremesFromAll||this.cropped||
(c[l+1]||k)>=g&&(c[l-1]||k)<=h,i&&k)if(i=j.length)for(;i--;)j[i]!==null&&(e[f++]=j[i]);else e[f++]=j;this.dataMin=Ra(e);this.dataMax=Ea(e)},translate:function(){this.processedXData||this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i=a.pointPlacement,k=i==="between"||ma(i),j=a.threshold,l=a.startFromThreshold?j:0,m,n,r,o,R=Number.MAX_VALUE,a=0;a<g;a++){var v=f[a],x=v.x,w=v.y;n=v.low;var u=
b&&e.stacks[(this.negStacks&&w<(l?0:j)?"-":"")+this.stackKey];if(e.isLog&&w!==null&&w<=0)v.y=w=null,X(10);v.plotX=m=F(t(-1E5,c.translate(x,0,0,0,1,i,this.type==="flags")),1E5);if(b&&this.visible&&!v.isNull&&u&&u[x])o=this.getStackIndicator(o,x,this.index),u=u[x],w=u.points[o.key],n=w[0],w=w[1],n===l&&(n=p(j,e.min)),e.isLog&&n<=0&&(n=null),v.total=v.stackTotal=u.total,v.percentage=u.total&&v.y/u.total*100,v.stackY=w,u.setOffset(this.pointXOffset||0,this.barW||0);v.yBottom=q(n)?e.translate(n,0,1,0,
1):null;h&&(w=this.modifyValue(w,v));v.plotY=n=typeof w==="number"&&w!==Infinity?F(t(-1E5,e.translate(w,0,1,0,1)),1E5):z;v.isInside=n!==z&&n>=0&&n<=e.len&&m>=0&&m<=c.len;v.clientX=k?c.translate(x,0,0,0,1):m;v.negative=v.y<(j||0);v.category=d&&d[v.x]!==z?d[v.x]:v.x;a&&(R=F(R,P(m-r)));r=m}this.closestPointRangePx=R},getValidPoints:function(a){return Na(a||this.points,function(a){return!a.isNull})},setClip:function(a){var b=this.chart,c=this.options,d=b.renderer,e=b.inverted,f=this.clipBox,g=f||b.clipBox,
h=this.sharedClipKey||["_sharedClip",a&&a.duration,a&&a.easing,g.height,c.xAxis,c.yAxis].join(","),i=b[h],k=b[h+"m"];if(!i){if(a)g.width=0,b[h+"m"]=k=d.clipRect(-99,e?-b.plotLeft:-b.plotTop,99,e?b.chartWidth:b.chartHeight);b[h]=i=d.clipRect(g)}a&&(i.count+=1);if(c.clip!==!1)this.group.clip(a||f?i:b.clipRect),this.markerGroup.clip(k),this.sharedClipKey=h;a||(i.count-=1,i.count<=0&&h&&b[h]&&(f||(b[h]=b[h].destroy()),b[h+"m"]&&(b[h+"m"]=b[h+"m"].destroy())))},animate:function(a){var b=this.chart,c=this.options.animation,
d;if(c&&!Y(c))c=aa[this.type].animation;a?this.setClip(c):(d=this.sharedClipKey,(a=b[d])&&a.animate({width:b.plotSizeX},c),b[d+"m"]&&b[d+"m"].animate({width:b.plotSizeX+99},c),this.animate=null)},afterAnimate:function(){this.setClip();H(this,"afterAnimate")},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,k,j,l=this.options.marker,m=this.pointAttr[""],n,r,o,t=this.markerGroup,v=p(l.enabled,this.xAxis.isRadial,this.closestPointRangePx>2*l.radius);if(l.enabled!==!1||this._hasPointMarkers)for(f=
b.length;f--;)if(g=b[f],d=T(g.plotX),e=g.plotY,j=g.graphic,n=g.marker||{},r=!!g.marker,a=v&&n.enabled===z||n.enabled,o=g.isInside,a&&e!==z&&!isNaN(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""]||m,h=a.r,i=p(n.symbol,this.symbol),k=i.indexOf("url")===0,j)j[o?"show":"hide"](!0).attr(a).animate(u({x:d-h,y:e-h},j.symbolName?{width:2*h,height:2*h}:{}));else{if(o&&(h>0||k))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h,r?n:l).attr(a).add(t)}else if(j)g.graphic=j.destroy()},convertAttribs:function(a,
b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=p(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=aa[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color,h=a.options.negativeColor;f={stroke:g,fill:g};var i=a.points||[],k,j,l=[],m=a.pointAttrToOptions;k=a.hasPointSpecificOptions;var n=c.lineColor,r=c.fillColor;j=b.turboThreshold;var s=a.zones,t=a.zoneAxis||"y",v;b.marker?(e.radius=e.radius||c.radius+e.radiusPlus,
e.lineWidth=e.lineWidth||c.lineWidth+e.lineWidthPlus):(e.color=e.color||ia(e.color||g).brighten(e.brightness).get(),e.negativeColor=e.negativeColor||ia(e.negativeColor||h).brighten(e.brightness).get());l[""]=a.convertAttribs(c,f);o(["hover","select"],function(b){l[b]=a.convertAttribs(d[b],l[""])});a.pointAttr=l;g=i.length;if(!j||g<j||k)for(;g--;){j=i[g];if((c=j.options&&j.options.marker||j.options)&&c.enabled===!1)c.radius=0;if(s.length){k=0;for(f=s[k];j[t]>=f.value;)f=s[++k];j.color=j.fillColor=
p(f.color,a.color)}k=b.colorByPoint||j.color;if(j.options)for(v in m)q(c[m[v]])&&(k=!0);if(k){c=c||{};k=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker||j.negative&&!f.fillColor&&!e.fillColor)f[a.pointAttrToOptions.fill]=f.color||!j.options.color&&e[j.negative&&h?"negativeColor":"color"]||ia(j.color).brighten(f.brightness||e.brightness).get();f={color:j.color};if(!r)f.fillColor=j.color;if(!n)f.lineColor=j.color;c.hasOwnProperty("color")&&!c.color&&delete c.color;k[""]=a.convertAttribs(u(f,c),
l[""]);k.hover=a.convertAttribs(d.hover,l.hover,k[""]);k.select=a.convertAttribs(d.select,l.select,k[""])}else k=l;j.pointAttr=k}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(za),d,e=a.data||[],f,g,h;H(a,"destroy");V(a);o(a.axisTypes||[],function(b){if(h=a[b])oa(h.series,a),h.isDirty=h.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);for(d=e.length;d--;)(f=e[d])&&f.destroy&&f.destroy();a.points=null;clearTimeout(a.animationTimeout);for(g in a)a[g]instanceof O&&!a[g].survive&&
(d=c&&g==="group"?"hide":"destroy",a[g][d]());if(b.hoverSeries===a)b.hoverSeries=null;oa(b.series,a);for(g in a)delete a[g]},getGraphPath:function(a,b,c){var d=this,e=d.options,f=e.step,g,h=[],i,a=a||d.points;(g=a.reversed)&&a.reverse();(f={right:1,center:2}[f]||f&&3)&&g&&(f=4-f);e.connectNulls&&!b&&!c&&(a=this.getValidPoints(a));o(a,function(g,j){var l=g.plotX,m=g.plotY,n=a[j-1];if((g.leftCliff||n&&n.rightCliff)&&!c)i=!0;g.isNull&&!q(b)&&j>0?i=!e.connectNulls:g.isNull&&!b?i=!0:(j===0||i?n=["M",g.plotX,
g.plotY]:d.getPointSpline?n=d.getPointSpline(a,g,j):f?(n=f===1?["L",n.plotX,m]:f===2?["L",(n.plotX+l)/2,n.plotY,"L",(n.plotX+l)/2,m]:["L",l,n.plotY],n.push("L",l,m)):n=["L",l,m],h.push.apply(h,n),i=!1)});return d.graphPath=h},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color,b.dashStyle]],d=b.lineWidth,e=b.linecap!=="square",f=(this.gappedPath||this.getGraphPath).call(this),g=this.fillGraph&&this.color||"none";o(this.zones,function(d,e){c.push(["zoneGraph"+e,d.color||
a.color,d.dashStyle||b.dashStyle])});o(c,function(c,i){var k=c[0],j=a[k];if(j)j.animate({d:f});else if((d||g)&&f.length)j={stroke:c[1],"stroke-width":d,fill:g,zIndex:1},c[2]?j.dashstyle=c[2]:e&&(j["stroke-linecap"]=j["stroke-linejoin"]="round"),a[k]=a.chart.renderer.path(f).attr(j).add(a.group).shadow(i<2&&b.shadow)})},applyZones:function(){var a=this,b=this.chart,c=b.renderer,d=this.zones,e,f,g=this.clips||[],h,i=this.graph,k=this.area,j=t(b.chartWidth,b.chartHeight),l=this[(this.zoneAxis||"y")+
"Axis"],m,n=l.reversed,r=b.inverted,s=l.horiz,q,v,x,w=!1;if(d.length&&(i||k)&&l.min!==z)i&&i.hide(),k&&k.hide(),m=l.getExtremes(),o(d,function(d,o){e=n?s?b.plotWidth:0:s?0:l.toPixels(m.min);e=F(t(p(f,e),0),j);f=F(t(A(l.toPixels(p(d.value,m.max),!0)),0),j);w&&(e=f=l.toPixels(m.max));q=Math.abs(e-f);v=F(e,f);x=t(e,f);if(l.isXAxis){if(h={x:r?x:v,y:0,width:q,height:j},!s)h.x=b.plotHeight-h.x}else if(h={x:0,y:r?x:v,width:j,height:q},s)h.y=b.plotWidth-h.y;b.inverted&&c.isVML&&(h=l.isXAxis?{x:0,y:n?v:x,
height:h.width,width:b.chartWidth}:{x:h.y-b.plotLeft-b.spacingBox.x,y:0,width:h.height,height:b.chartHeight});g[o]?g[o].animate(h):(g[o]=c.clipRect(h),i&&a["zoneGraph"+o].clip(g[o]),k&&a["zoneArea"+o].clip(g[o]));w=d.value>m.max}),this.clips=g},invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};o(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)M(c,"resize",a),M(b,"destroy",function(){V(c,"resize",a)}),a(),b.invertGroups=
a},plotGroup:function(a,b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({zIndex:d||0.1}).add(e),f.addClass("highcharts-series-"+this.index));f.attr({visibility:c})[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;if(a.inverted)b=c,c=this.xAxis;return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=(c=d.animation)&&!!a.animate&&
b.renderer.isSVG&&p(c.duration,500)||0,f=a.visible?"inherit":"hidden",g=d.zIndex,h=a.hasRendered,i=b.seriesGroup;c=a.plotGroup("group","series",f,g,i);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,i);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:!1;a.drawGraph&&(a.drawGraph(),a.applyZones());o(a.points,function(a){a.redraw&&a.redraw()});a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&a.options.enableMouseTracking!==!1&&a.drawTracker();b.inverted&&
a.invertGroups();d.clip!==!1&&!a.sharedClipKey&&!h&&c.clip(b.clipRect);e&&a.animate();if(!h)a.animationTimeout=Pa(function(){a.afterAnimate()},e);a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.isDirty,d=this.group,e=this.xAxis,f=this.yAxis;d&&(a.inverted&&d.attr({width:a.plotWidth,height:a.plotHeight}),d.animate({translateX:p(e&&e.left,a.plotLeft),translateY:p(f&&f.top,a.plotTop)}));this.translate();this.render();b&&H(this,"updatedData");
(c||b)&&delete this.kdTree},kdDimensions:1,kdAxisArray:["clientX","plotY"],searchPoint:function(a,b){var c=this.xAxis,d=this.yAxis,e=this.chart.inverted;return this.searchKDTree({clientX:e?c.len-a.chartY+c.pos:a.chartX-c.pos,plotY:e?d.len-a.chartX+d.pos:a.chartY-d.pos},b)},buildKDTree:function(){function a(c,e,f){var g,h;if(h=c&&c.length)return g=b.kdAxisArray[e%f],c.sort(function(a,b){return a[g]-b[g]}),h=Math.floor(h/2),{point:c[h],left:a(c.slice(0,h),e+1,f),right:a(c.slice(h+1),e+1,f)}}var b=this,
c=b.kdDimensions;delete b.kdTree;Pa(function(){b.kdTree=a(b.getValidPoints(),c,c)},b.options.kdNow?0:1)},searchKDTree:function(a,b){function c(a,b,k,j){var l=b.point,m=d.kdAxisArray[k%j],n,p,o=l;p=q(a[e])&&q(l[e])?Math.pow(a[e]-l[e],2):null;n=q(a[f])&&q(l[f])?Math.pow(a[f]-l[f],2):null;n=(p||0)+(n||0);l.dist=q(n)?Math.sqrt(n):Number.MAX_VALUE;l.distX=q(p)?Math.sqrt(p):Number.MAX_VALUE;m=a[m]-l[m];n=m<0?"left":"right";p=m<0?"right":"left";b[n]&&(n=c(a,b[n],k+1,j),o=n[g]<o[g]?n:l);b[p]&&Math.sqrt(m*
m)<o[g]&&(a=c(a,b[p],k+1,j),o=a[g]<o[g]?a:o);return o}var d=this,e=this.kdAxisArray[0],f=this.kdAxisArray[1],g=b?"distX":"dist";this.kdTree||this.buildKDTree();if(this.kdTree)return c(a,this.kdTree,this.kdDimensions,this.kdDimensions)}};Kb.prototype={destroy:function(){Sa(this,this.axis)},render:function(a){var b=this.options,c=b.format,c=c?Ka(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,null,null,b.useHTML).css(b.style).attr({align:this.textAlign,
rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=c.reversed,f=this.isNegative&&!f||!this.isNegative&&f,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=P(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[this.options.crop===!1||d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};hb.prototype.getStacks=
function(){var a=this;o(a.yAxis,function(a){if(a.stacks&&a.hasVisibleSeries)a.oldStacks=a.stacks});o(a.series,function(b){if(b.options.stacking&&(b.visible===!0||a.options.chart.ignoreHiddenSeries===!1))b.stackKey=b.type+p(b.options.stack,"")})};ka.prototype.buildStacks=function(){var a=this.series,b,c=p(this.options.reversedStacks,!0),d=a.length,e;if(!this.isXAxis){this.usePercentage=!1;for(e=d;e--;)a[c?e:d-e-1].setStackedPoints();for(e=d;e--;)b=a[c?e:d-e-1],b.setStackCliffs&&b.setStackCliffs();
if(this.usePercentage)for(e=0;e<d;e++)a[e].setPercentStacks()}};ka.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;if(!f)this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();f.translate(a.plotLeft,a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};ka.prototype.resetStacks=function(){var a=this.stacks,b,c;if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].touched<this.stacksTouched?(a[b][c].destroy(),
delete a[b][c]):(a[b][c].total=null,a[b][c].cum=0)};ka.prototype.cleanStacks=function(){var a,b,c;if(!this.isXAxis){if(this.oldStacks)a=this.stacks=this.oldStacks;for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total}};Q.prototype.setStackedPoints=function(){if(this.options.stacking&&!(this.visible!==!0&&this.chart.options.chart.ignoreHiddenSeries!==!1)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.startFromThreshold?f:0,h=e.stack,e=e.stacking,i=this.stackKey,
k="-"+i,j=this.negStacks,l=this.yAxis,m=l.stacks,n=l.oldStacks,o,s,q,v,x,w,u;l.stacksTouched+=1;for(x=0;x<d;x++){w=a[x];u=b[x];o=this.getStackIndicator(o,w,this.index);v=o.key;q=(s=j&&u<(g?0:f))?k:i;m[q]||(m[q]={});if(!m[q][w])n[q]&&n[q][w]?(m[q][w]=n[q][w],m[q][w].total=null):m[q][w]=new Kb(l,l.options.stackLabels,s,w,h);q=m[q][w];if(u!==null)q.points[v]=q.points[this.index]=[p(q.cum,g)],q.touched=l.stacksTouched,o.index>0&&this.singleStacks===!1&&(q.points[v][0]=q.points[this.index+","+w+",0"][0]);
e==="percent"?(s=s?i:k,j&&m[s]&&m[s][w]?(s=m[s][w],q.total=s.total=t(s.total,q.total)+P(u)||0):q.total=fa(q.total+(P(u)||0))):q.total=fa(q.total+(u||0));q.cum=p(q.cum,g)+(u||0);u!==null&&q.points[v].push(q.cum);c[x]=q.cum}if(e==="percent")l.usePercentage=!0;this.stackedYData=c;l.oldStacks={}}};Q.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData,e;o([b,"-"+b],function(b){var f;for(var g=d.length,h,i;g--;)if(h=d[g],e=a.getStackIndicator(e,h,a.index),f=
(i=c[b]&&c[b][h])&&i.points[e.key],h=f)i=i.total?100/i.total:0,h[0]=fa(h[0]*i),h[1]=fa(h[1]*i),a.stackedYData[g]=h[1]})};Q.prototype.getStackIndicator=function(a,b,c){!q(a)||a.x!==b?a={x:b,index:0}:a.index++;a.key=[c,b,a.index].join(",");return a};u(hb.prototype,{addSeries:function(a,b,c){var d,e=this;a&&(b=p(b,!0),H(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;
new ka(this,D(a,{index:this[e].length,isX:b}));f[e]=ta(f[e]||{});f[e].push(a);p(c,!0)&&this.redraw(d)},showLoading:function(a){var b=this,c=b.options,d=b.loadingDiv,e=c.loading,f=function(){d&&L(d,{left:b.plotLeft+"px",top:b.plotTop+"px",width:b.plotWidth+"px",height:b.plotHeight+"px"})};if(!d)b.loadingDiv=d=Z(La,{className:"highcharts-loading"},u(e.style,{zIndex:10,display:"none"}),b.container),b.loadingSpan=Z("span",null,e.labelStyle,d),M(b,"redraw",f);b.loadingSpan.innerHTML=a||c.lang.loading;
if(!b.loadingShown)L(d,{opacity:0,display:""}),Wa(d,{opacity:e.style.opacity},{duration:e.showDuration||0}),b.loadingShown=!0;f()},hideLoading:function(){var a=this.options,b=this.loadingDiv;b&&Wa(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){L(b,{display:"none"})}});this.loadingShown=!1}});u(Ha.prototype,{update:function(a,b,c,d){function e(){f.applyOptions(a);if(f.y===null&&h)f.graphic=h.destroy();if(Y(a)&&!Ia(a))f.redraw=function(){if(h&&h.element&&a&&a.marker&&a.marker.symbol)f.graphic=
h.destroy();if(a&&a.dataLabels&&f.dataLabel)f.dataLabel=f.dataLabel.destroy();f.redraw=null};i=f.index;g.updateParallelArrays(f,i);if(l&&f.name)l[f.x]=f.name;j.data[i]=Y(j.data[i])?f.options:a;g.isDirty=g.isDirtyData=!0;if(!g.fixedBox&&g.hasCartesianSeries)k.isDirtyBox=!0;if(j.legendType==="point")k.isDirtyLegend=!0;b&&k.redraw(c)}var f=this,g=f.series,h=f.graphic,i,k=g.chart,j=g.options,l=g.xAxis&&g.xAxis.names,b=p(b,!0);d===!1?e():f.firePointEvent("update",{options:a},e)},remove:function(a,b){this.series.removePoint(sa(this,
this.series.data),a,b)}});u(Q.prototype,{addPoint:function(a,b,c,d){var e=this,f=e.options,g=e.data,h=e.graph,i=e.area,k=e.chart,j=e.xAxis&&e.xAxis.names,l=h&&h.shift||0,m=["graph","area"],h=f.data,n,r=e.xData;Ua(d,k);if(c){for(d=e.zones.length;d--;)m.push("zoneGraph"+d,"zoneArea"+d);o(m,function(a){if(e[a])e[a].shift=l+(f.step?2:1)})}if(i)i.isArea=!0;b=p(b,!0);i={series:e};e.pointClass.prototype.applyOptions.apply(i,[a]);m=i.x;d=r.length;if(e.requireSorting&&m<r[d-1])for(n=!0;d&&r[d-1]>m;)d--;e.updateParallelArrays(i,
"splice",d,0,0);e.updateParallelArrays(i,d);if(j&&i.name)j[m]=i.name;h.splice(d,0,a);n&&(e.data.splice(d,0,null),e.processData());f.legendType==="point"&&e.generatePoints();c&&(g[0]&&g[0].remove?g[0].remove(!1):(g.shift(),e.updateParallelArrays(i,"shift"),h.shift()));e.isDirty=!0;e.isDirtyData=!0;b&&(e.getAttribs(),k.redraw())},removePoint:function(a,b,c){var d=this,e=d.data,f=e[a],g=d.points,h=d.chart,i=function(){g&&g.length===e.length&&g.splice(a,1);e.splice(a,1);d.options.data.splice(a,1);d.updateParallelArrays(f||
{series:d},"splice",a,1);f&&f.destroy();d.isDirty=!0;d.isDirtyData=!0;b&&h.redraw()};Ua(c,h);b=p(b,!0);f?f.firePointEvent("remove",null,i):i()},remove:function(a,b){var c=this,d=c.chart;H(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();p(a,!0)&&d.redraw(b)})},update:function(a,b){var c=this,d=this.chart,e=this.userOptions,f=this.type,g=I[f].prototype,h=["group","markerGroup","dataLabelsGroup"],i;if(a.type&&a.type!==f||a.zIndex!==void 0)h.length=0;o(h,function(a){h[a]=
c[a];delete c[a]});a=D(e,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1);for(i in g)this[i]=z;u(this,I[a.type||f].prototype);o(h,function(a){c[a]=h[a]});this.init(d,a);d.linkSeries();p(b,!0)&&d.redraw(!1)}});u(ka.prototype,{update:function(a,b){var c=this.chart,a=c.options[this.coll][this.options.index]=D(this.userOptions,a);this.destroy(!0);this._addedPlotLB=this.chart._labelPanes=z;this.init(c,u(a,{events:z}));c.isDirtyBox=!0;p(b,!0)&&c.redraw()},
remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&d[e].remove(!1);oa(b.axes,this);oa(b[c],this);b.options[c].splice(this.options.index,1);o(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;p(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});var wa=pa(Q);I.line=wa;aa.area=D(da,{softThreshold:!1,threshold:0});var la=pa(Q,{type:"area",singleStacks:!1,getStackPoints:function(){var a=
[],b=[],c=this.xAxis,d=this.yAxis,e=d.stacks[this.stackKey],f={},g=this.points,h=this.index,i=d.series,k=i.length,j,l=p(d.options.reversedStacks,!0)?1:-1,m,n;if(this.options.stacking){for(m=0;m<g.length;m++)f[g[m].x]=g[m];for(n in e)e[n].total!==null&&b.push(+n);b.sort(function(a,b){return a-b});j=Ba(i,function(){return this.visible});o(b,function(g,i){var n=0,p,q;if(f[g]&&!f[g].isNull)a.push(f[g]),o([-1,1],function(a){var c=a===1?"rightNull":"leftNull",d=0,n=e[b[i+a]];if(n)for(m=h;m>=0&&m<k;)p=n.points[m],
p||(m===h?f[g][c]=!0:j[m]&&(q=e[g].points[m])&&(d-=q[1]-q[0])),m+=l;f[g][a===1?"rightCliff":"leftCliff"]=d});else{for(m=h;m>=0&&m<k;){if(p=e[g].points[m]){n=p[1];break}m+=l}n=d.toPixels(n,!0);a.push({isNull:!0,plotX:c.toPixels(g,!0),plotY:n,yBottom:n})}})}return a},getGraphPath:function(a){var b=Q.prototype.getGraphPath,c=this.options,d=c.stacking,e=this.yAxis,f,g,h=[],i=[],k=this.index,j,l=e.stacks[this.stackKey],m=c.threshold,n=e.getThreshold(c.threshold),o,c=c.connectNulls||d==="percent",s=function(b,
c,f){var g=a[b],b=d&&l[g.x].points[k],p=g[f+"Null"]||0,f=g[f+"Cliff"]||0,o,r,g=!0;f||p?(o=(p?b[0]:b[1])+f,r=b[0]+f,g=!!p):!d&&a[c]&&a[c].isNull&&(o=r=m);o!==void 0&&(i.push({plotX:j,plotY:o===null?n:e.toPixels(o,!0),isNull:g}),h.push({plotX:j,plotY:r===null?n:e.toPixels(r,!0)}))},a=a||this.points;d&&(a=this.getStackPoints());for(f=0;f<a.length;f++)if(g=a[f].isNull,j=p(a[f].rectPlotX,a[f].plotX),o=p(a[f].yBottom,n),!g||c){c||s(f,f-1,"left");if(!g||d||!c)i.push(a[f]),h.push({x:f,plotX:j,plotY:o});c||
s(f,f+1,"right")}f=b.call(this,i,!0,!0);h.reversed=!0;g=b.call(this,h,!0,!0);g.length&&(g[0]="L");f=f.concat(g);b=b.call(this,i,!1,c);this.areaPath=f;return b},drawGraph:function(){this.areaPath=[];Q.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=[["area",this.color,c.fillColor]];o(this.zones,function(b,f){d.push(["zoneArea"+f,b.color||a.color,b.fillColor||c.fillColor])});o(d,function(d){var f=d[0],g=a[f];g?g.animate({d:b}):(g={fill:d[2]||d[1],zIndex:0},d[2]||(g["fill-opacity"]=
p(c.fillOpacity,0.75)),a[f]=a.chart.renderer.path(b).attr(g).add(a.group))})},drawLegendSymbol:J.drawRectangle});I.area=la;aa.spline=D(da);wa=pa(Q,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],c=a[c+1],g,h,i,k;if(f&&!f.isNull&&c&&!c.isNull){a=f.plotY;i=c.plotX;var c=c.plotY,j=0;g=(1.5*d+f.plotX)/2.5;h=(1.5*e+a)/2.5;i=(1.5*d+i)/2.5;k=(1.5*e+c)/2.5;i!==g&&(j=(k-h)*(i-d)/(i-g)+e-k);h+=j;k+=j;h>a&&h>e?(h=t(a,e),k=2*e-h):h<a&&h<e&&(h=F(a,e),k=2*e-h);k>c&&k>e?(k=t(c,e),
h=2*e-k):k<c&&k<e&&(k=F(c,e),h=2*e-k);b.rightContX=i;b.rightContY=k}b=["C",p(f.rightContX,f.plotX),p(f.rightContY,f.plotY),p(g,d),p(h,e),d,e];f.rightContX=f.rightContY=null;return b}});I.spline=wa;aa.areaspline=D(aa.area);la=la.prototype;wa=pa(wa,{type:"areaspline",getStackPoints:la.getStackPoints,getGraphPath:la.getGraphPath,setStackCliffs:la.setStackCliffs,drawGraph:la.drawGraph,drawLegendSymbol:J.drawRectangle});I.areaspline=wa;aa.column=D(da,{borderColor:"#FFFFFF",borderRadius:0,groupPadding:0.2,
marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},softThreshold:!1,startFromThreshold:!0,stickyTracking:!1,tooltip:{distance:6},threshold:0});wa=pa(Q,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,directTouch:!0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,
init:function(){Q.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=c.reversed,f,g={},h=0;b.grouping===!1?h=1:o(a.chart.series,function(b){var c=b.options,e=b.yAxis,i;if(b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos)c.stacking?(f=b.stackKey,g[f]===z&&(g[f]=h++),i=g[f]):c.grouping!==!1&&(i=h++),b.columnIndex=i});var i=F(P(c.transA)*(c.ordinalSlope||
b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),k=i*b.groupPadding,j=(i-2*k)/h,b=F(b.maxPointWidth||c.len,p(b.pointWidth,j*(1-2*b.pointPadding)));a.columnMetrics={width:b,offset:(j-b)/2+(k+((a.columnIndex||0)+(e?1:0))*j-i/2)*(e?-1:1)};return a.columnMetrics},crispCol:function(a,b,c,d){var e=this.chart,f=this.borderWidth,g=-(f%2?0.5:0),f=f%2?0.5:1;e.inverted&&e.renderer.isVML&&(f+=1);c=Math.round(a+c)+g;a=Math.round(a)+g;c-=a;d=Math.round(b+d)+f;g=P(b)<=0.5&&d>0.5;b=Math.round(b)+f;d-=
b;g&&(b-=1,d+=1);return{x:a,y:b,width:c,height:d}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=p(c.borderWidth,a.closestPointRange*a.xAxis.transA<2?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),g=p(c.minPointLength,5),h=a.getColumnMetrics(),i=h.width,k=a.barW=t(i,1+2*d),j=a.pointXOffset=h.offset;b.inverted&&(f-=0.5);c.pointPadding&&(k=ua(k));Q.prototype.translate.apply(a);o(a.points,function(c){var d=F(p(c.yBottom,f),9E4),h=999+P(d),h=F(t(-h,c.plotY),
e.len+h),o=c.plotX+j,s=k,q=F(h,d),v,u=t(h,d)-q;P(u)<g&&g&&(u=g,v=!e.reversed&&!c.negative||e.reversed&&c.negative,q=P(q-f)>g?d-g:f-(v?g:0));c.barX=o;c.pointWidth=i;c.tooltipPos=b.inverted?[e.len+e.pos-b.plotLeft-h,a.xAxis.len-o-s/2,u]:[o+s/2,h+e.pos-b.plotTop,u];c.shapeType="rect";c.shapeArgs=a.crispCol(o,q,s,u)})},getSymbol:Aa,drawLegendSymbol:J.drawRectangle,drawGraph:Aa,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,e=c.animationLimit||250,f,g;o(a.points,function(h){var i=
h.plotY,k=h.graphic;if(i!==z&&!isNaN(i)&&h.y!==null)f=h.shapeArgs,i=q(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=h.pointAttr[h.selected?"select":""]||a.pointAttr[""],k?(Oa(k),k.attr(i).attr(g)[b.pointCount<e?"animate":"attr"](D(f))):h.graphic=d[h.shapeType](f).attr(i).attr(g).add(h.group||a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius);else if(k)h.graphic=k.destroy()})},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,e={};if(ca)a?(e.scaleY=0.001,a=F(b.pos+
b.len,t(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&o(b.series,function(b){if(b.type===a.type)b.isDirty=!0});Q.prototype.remove.apply(a,arguments)}});I.column=wa;aa.bar=D(aa.column);la=pa(wa,{type:"bar",inverted:!0});I.bar=la;aa.scatter=D(da,{lineWidth:0,marker:{enabled:!0},tooltip:{headerFormat:'<span style="color:{point.color}">\u25cf</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"}});la=pa(Q,{type:"scatter",sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","markerGroup","dataLabelsGroup"],takeOrdinalPosition:!1,kdDimensions:2,drawGraph:function(){this.options.lineWidth&&Q.prototype.drawGraph.call(this)}});I.scatter=la;aa.pie=D(da,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,formatter:function(){return this.y===null?void 0:
this.point.name},x:0},ignoreHiddenPoint:!0,legendType:"point",marker:null,size:null,showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});da={type:"pie",isCartesian:!1,pointClass:pa(Ha,{init:function(){Ha.prototype.init.apply(this,arguments);var a=this,b;a.name=p(a.name,"Slice");b=function(b){a.slice(b.type==="select")};M(a,"select",b);M(a,"unselect",b);return a},setVisible:function(a,b){var c=this,d=c.series,e=d.chart,f=d.options.ignoreHiddenPoint,
b=p(b,f);if(a!==c.visible){c.visible=c.options.visible=a=a===z?!c.visible:a;d.options.data[sa(c,d.data)]=c.options;o(["graphic","dataLabel","connector","shadowGroup"],function(b){if(c[b])c[b][a?"show":"hide"](!0)});c.legendItem&&e.legend.colorizeItem(c,a);!a&&c.state==="hover"&&c.setState("");if(f)d.isDirty=!0;b&&e.redraw()}},slice:function(a,b,c){var d=this.series;Ua(c,d.chart);p(b,!0);this.sliced=this.options.sliced=a=q(a)?a:!this.sliced;d.options.data[sa(this,d.data)]=this.options;a=a?this.slicedTranslation:
{translateX:0,translateY:0};this.graphic.animate(a);this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs,c=this.series.chart;return this.sliced||!this.visible?[]:this.series.chart.renderer.symbols.arc(c.plotLeft+b.x,c.plotTop+b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}}),requireSorting:!1,directTouch:!0,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",
fill:"color"},animate:function(a){var b=this,c=b.points,d=b.startAngleRad;if(!a)o(c,function(a){var c=a.graphic,g=a.shapeArgs;c&&(c.attr({r:a.startR||b.center[3]/2,start:d,end:d}),c.animate({r:g.r,start:g.start,end:g.end},b.options.animation))}),b.animate=null},updateTotals:function(){var a,b=0,c=this.points,d=c.length,e,f=this.options.ignoreHiddenPoint;for(a=0;a<d;a++)e=c[a],b+=f&&!e.visible?0:e.y;this.total=b;for(a=0;a<d;a++)e=c[a],e.percentage=b>0&&(e.visible||!f)?e.y/b*100:0,e.total=b},generatePoints:function(){Q.prototype.generatePoints.call(this);
this.updateTotals()},translate:function(a){this.generatePoints();var b=0,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g,h,i=c.startAngle||0,k=this.startAngleRad=ra/180*(i-90),i=(this.endAngleRad=ra/180*(p(c.endAngle,i+360)-90))-k,j=this.points,l=c.dataLabels.distance,c=c.ignoreHiddenPoint,m,n=j.length,o;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){h=W.asin(F((b-a[1])/(a[2]/2+l),1));return a[0]+(c?-1:1)*U(h)*(a[2]/2+l)};for(m=0;m<n;m++){o=j[m];f=k+b*i;if(!c||o.visible)b+=o.percentage/
100;g=k+b*i;o.shapeType="arc";o.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:A(f*1E3)/1E3,end:A(g*1E3)/1E3};h=(g+f)/2;h>1.5*ra?h-=2*ra:h<-ra/2&&(h+=2*ra);o.slicedTranslation={translateX:A(U(h)*d),translateY:A($(h)*d)};f=U(h)*a[2]/2;g=$(h)*a[2]/2;o.tooltipPos=[a[0]+f*0.7,a[1]+g*0.7];o.half=h<-ra/2||h>ra/2?1:0;o.angle=h;e=F(e,l/2);o.labelPos=[a[0]+f+U(h)*l,a[1]+g+$(h)*l,a[0]+f+U(h)*e,a[1]+g+$(h)*e,a[0]+f,a[1]+g,l<0?"center":o.half?"right":"left",h]}},drawGraph:null,drawPoints:function(){var a=
this,b=a.chart.renderer,c,d,e=a.options.shadow,f,g,h,i;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);o(a.points,function(k){if(k.y!==null){d=k.graphic;h=k.shapeArgs;f=k.shadowGroup;g=k.pointAttr[k.selected?"select":""];if(!g.stroke)g.stroke=g.fill;if(e&&!f)f=k.shadowGroup=b.g("shadow").add(a.shadowGroup);c=k.sliced?k.slicedTranslation:{translateX:0,translateY:0};f&&f.attr(c);if(d)d.setRadialReference(a.center).attr(g).animate(u(h,c));else{i={"stroke-linejoin":"round"};if(!k.visible)i.visibility=
"hidden";k.graphic=d=b[k.shapeType](h).setRadialReference(a.center).attr(g).attr(i).attr(c).add(a.group).shadow(e,f)}}})},searchPoint:Aa,sortByAngle:function(a,b){a.sort(function(a,d){return a.angle!==void 0&&(d.angle-a.angle)*b})},drawLegendSymbol:J.drawRectangle,getCenter:Cb.getCenter,getSymbol:Aa};da=pa(Q,da);I.pie=da;Q.prototype.drawDataLabels=function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h=a.hasRendered||0,i,k,j=a.chart.renderer;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&
a.dlProcessOptions(d),k=a.plotGroup("dataLabelsGroup","data-labels",d.defer?"hidden":"visible",d.zIndex||6),p(d.defer,!0)&&(k.attr({opacity:+h}),h||M(a,"afterAnimate",function(){a.visible&&k.show();k[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,o(e,function(e){var h,n=e.dataLabel,o,s,t=e.connector,v=!0,x,w={};f=e.dlOptions||e.options&&e.options.dataLabels;h=p(f&&f.enabled,g.enabled)&&e.y!==null;if(n&&!h)e.dataLabel=n.destroy();else if(h){d=D(g,f);x=d.style;h=d.rotation;o=e.getLabelConfig();
i=d.format?Ka(d.format,o):d.formatter.call(o,d);x.color=p(d.color,x.color,a.color,"black");if(n)if(q(i))n.attr({text:i}),v=!1;else{if(e.dataLabel=n=n.destroy(),t)e.connector=t.destroy()}else if(q(i)){n={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:h,padding:d.padding,zIndex:1};if(x.color==="contrast")w.color=d.inside||d.distance<0||b.stacking?j.getContrast(e.color||a.color):"#000000";if(c)w.cursor=c;for(s in n)n[s]===z&&delete n[s];n=e.dataLabel=
j[h?"text":"label"](i,0,-9999,d.shape,null,null,d.useHTML).attr(n).css(u(x,w)).add(k).shadow(d.shadow)}n&&a.alignDataLabel(e,n,d,null,v)}})};Q.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=p(a.plotX,-9999),i=p(a.plotY,-9999),k=b.getBBox(),j=f.renderer.fontMetrics(c.style.fontSize).b,l=c.rotation,m=c.align,n=this.visible&&(a.series.forceDL||f.isInsidePlot(h,A(i),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g)),o=p(c.overflow,"justify")==="justify";if(n)d=u({x:g?f.plotWidth-
i:h,y:A(g?f.plotHeight-h:i),width:0,height:0},d),u(c,{width:k.width,height:k.height}),l?(o=!1,g=f.renderer.rotCorr(j,l),g={x:d.x+c.x+d.width/2+g.x,y:d.y+c.y+d.height/2},b[e?"attr":"animate"](g).attr({align:c.align}),h=(l+720)%360,h=h>180&&h<360,m==="left"?g.y-=h?k.height:0:m==="center"?(g.x-=k.width/2,g.y-=k.height/2):m==="right"&&(g.x-=k.width,g.y-=h?0:k.height)):(b.align(c,null,d),g=b.alignAttr),o?this.justifyDataLabel(b,c,g,k,d,e):p(c.crop,!0)&&(n=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+k.width,
g.y+k.height)),c.shape&&!l&&b.attr({anchorX:a.plotX,anchorY:a.plotY});if(!n)Oa(b),b.attr({y:-9999}),b.placed=!1};Q.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,i=b.verticalAlign,k,j,l=a.box?0:a.padding||0;k=c.x+l;if(k<0)h==="right"?b.align="left":b.x=-k,j=!0;k=c.x+d.width-l;if(k>g.plotWidth)h==="left"?b.align="right":b.x=g.plotWidth-k,j=!0;k=c.y+l;if(k<0)i==="bottom"?b.verticalAlign="top":b.y=-k,j=!0;k=c.y+d.height-l;if(k>g.plotHeight)i==="top"?b.verticalAlign="bottom":
b.y=g.plotHeight-k,j=!0;if(j)a.placed=!f,a.align(b,null,e)};if(I.pie)I.pie.prototype.drawDataLabels=function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=p(e.connectorPadding,10),g=p(e.connectorWidth,1),h=d.plotWidth,i=d.plotHeight,k,j,l=p(e.softConnector,!0),m=e.distance,n=a.center,r=n[2]/2,q=n[1],u=m>0,v,x,w,B=[[],[]],z,y,E,D,C,G=[0,0,0,0],L=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){Q.prototype.drawDataLabels.apply(a);o(b,function(a){if(a.dataLabel&&
a.visible)B[a.half].push(a),a.dataLabel._pos=null});for(D=2;D--;){var H=[],M=[],I=B[D],K=I.length,J;if(K){a.sortByAngle(I,D-0.5);for(C=b=0;!b&&I[C];)b=I[C]&&I[C].dataLabel&&(I[C].dataLabel.getBBox().height||21),C++;if(m>0){x=F(q+r+m,d.plotHeight);for(C=t(0,q-r-m);C<=x;C+=b)H.push(C);x=H.length;if(K>x){c=[].concat(I);c.sort(L);for(C=K;C--;)c[C].rank=C;for(C=K;C--;)I[C].rank>=x&&I.splice(C,1);K=I.length}for(C=0;C<K;C++){c=I[C];w=c.labelPos;c=9999;var O,N;for(N=0;N<x;N++)O=P(H[N]-w[1]),O<c&&(c=O,J=N);
if(J<C&&H[C]!==null)J=C;else for(x<K-C+J&&H[C]!==null&&(J=x-K+C);H[J]===null;)J++;M.push({i:J,y:H[J]});H[J]=null}M.sort(L)}for(C=0;C<K;C++){c=I[C];w=c.labelPos;v=c.dataLabel;E=c.visible===!1?"hidden":"inherit";c=w[1];if(m>0){if(x=M.pop(),J=x.i,y=x.y,c>y&&H[J+1]!==null||c<y&&H[J-1]!==null)y=F(t(0,c),d.plotHeight)}else y=c;z=e.justify?n[0]+(D?-1:1)*(r+m):a.getX(y===q-r-m||y===q+r+m?c:y,D);v._attr={visibility:E,align:w[6]};v._pos={x:z+e.x+({left:f,right:-f}[w[6]]||0),y:y+e.y-10};v.connX=z;v.connY=y;
if(this.options.size===null)x=v.width,z-x<f?G[3]=t(A(x-z+f),G[3]):z+x>h-f&&(G[1]=t(A(z+x-h+f),G[1])),y-b/2<0?G[0]=t(A(-y+b/2),G[0]):y+b/2>i&&(G[2]=t(A(y+b/2-i),G[2]))}}}if(Ea(G)===0||this.verifyDataLabelOverflow(G))this.placeDataLabels(),u&&g&&o(this.points,function(b){k=b.connector;w=b.labelPos;if((v=b.dataLabel)&&v._pos&&b.visible)E=v._attr.visibility,z=v.connX,y=v.connY,j=l?["M",z+(w[6]==="left"?5:-5),y,"C",z,y,2*w[2]-w[4],2*w[3]-w[5],w[2],w[3],"L",w[4],w[5]]:["M",z+(w[6]==="left"?5:-5),y,"L",
w[2],w[3],"L",w[4],w[5]],k?(k.animate({d:j}),k.attr("visibility",E)):b.connector=k=a.chart.renderer.path(j).attr({"stroke-width":g,stroke:e.connectorColor||b.color||"#606060",visibility:E}).add(a.dataLabelsGroup);else if(k)b.connector=k.destroy()})}},I.pie.prototype.placeDataLabels=function(){o(this.points,function(a){var b=a.dataLabel;if(b&&a.visible)(a=b._pos)?(b.attr(b._attr),b[b.moved?"animate":"attr"](a),b.moved=!0):b&&b.attr({y:-9999})})},I.pie.prototype.alignDataLabel=Aa,I.pie.prototype.verifyDataLabelOverflow=
function(a){var b=this.center,c=this.options,d=c.center,e=c.minSize||80,f=e,g;d[0]!==null?f=t(b[2]-t(a[1],a[3]),e):(f=t(b[2]-a[1]-a[3],e),b[0]+=(a[3]-a[1])/2);d[1]!==null?f=t(F(f,b[2]-t(a[0],a[2])),e):(f=t(F(f,b[2]-a[0]-a[2]),e),b[1]+=(a[0]-a[2])/2);f<b[2]?(b[2]=f,b[3]=Math.min(/%$/.test(c.innerSize||0)?f*parseFloat(c.innerSize||0)/100:parseFloat(c.innerSize||0),f),this.translate(b),this.drawDataLabels&&this.drawDataLabels()):g=!0;return g};if(I.column)I.column.prototype.alignDataLabel=function(a,
b,c,d,e){var f=this.chart.inverted,g=a.series,h=a.dlBox||a.shapeArgs,i=p(a.below,a.plotY>p(this.translatedThreshold,g.yAxis.len)),k=p(c.inside,!!this.options.stacking);if(h){d=D(h);if(d.y<0)d.height+=d.y,d.y=0;h=d.y+d.height-g.yAxis.len;h>0&&(d.height-=h);f&&(d={x:g.yAxis.len-d.y-d.height,y:g.xAxis.len-d.x-d.width,width:d.height,height:d.width});if(!k)f?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:0,d.height=0)}c.align=p(c.align,!f||k?"center":i?"right":"left");c.verticalAlign=p(c.verticalAlign,
f||k?"middle":i?"top":"bottom");Q.prototype.alignDataLabel.call(this,a,b,c,d,e)};(function(a){var b=a.Chart,c=a.each,d=a.pick,e=a.addEvent;b.prototype.callbacks.push(function(a){function b(){var e=[];c(a.series,function(a){var b=a.options.dataLabels,f=a.dataLabelCollections||["dataLabel"];(b.enabled||a._hasPointLabels)&&!b.allowOverlap&&a.visible&&c(f,function(b){c(a.points,function(a){if(a[b])a[b].labelrank=d(a.labelrank,a.shapeArgs&&a.shapeArgs.height),e.push(a[b])})})});a.hideOverlappingLabels(e)}
b();e(a,"redraw",b)});b.prototype.hideOverlappingLabels=function(a){var b=a.length,d,e,k,j,l,m,n,o,p;for(e=0;e<b;e++)if(d=a[e])d.oldOpacity=d.opacity,d.newOpacity=1;a.sort(function(a,b){return(b.labelrank||0)-(a.labelrank||0)});for(e=0;e<b;e++){k=a[e];for(d=e+1;d<b;++d)if(j=a[d],k&&j&&k.placed&&j.placed&&k.newOpacity!==0&&j.newOpacity!==0&&(l=k.alignAttr,m=j.alignAttr,n=k.parentGroup,o=j.parentGroup,p=2*(k.box?0:k.padding),l=!(m.x+o.translateX>l.x+n.translateX+(k.width-p)||m.x+o.translateX+(j.width-
p)<l.x+n.translateX||m.y+o.translateY>l.y+n.translateY+(k.height-p)||m.y+o.translateY+(j.height-p)<l.y+n.translateY)))(k.labelrank<j.labelrank?k:j).newOpacity=0}c(a,function(a){var b,c;if(a){c=a.newOpacity;if(a.oldOpacity!==c&&a.placed)c?a.show(!0):b=function(){a.hide()},a.alignAttr.opacity=c,a[a.isOld?"animate":"attr"](a.alignAttr,null,b);a.isOld=!0}})}})(B);da=B.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(a){for(var c=
a.target,d;c&&!d;)d=c.point,c=c.parentNode;if(d!==z&&d!==b.hoverPoint)d.onMouseOver(a)};o(a.points,function(a){if(a.graphic)a.graphic.element.point=a;if(a.dataLabel)a.dataLabel.element.point=a});if(!a._hasTracking)o(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),db))a[b].on("touchstart",f)}),a._hasTracking=!0},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?a.areaPath:
a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,k=a.tracker,j=b.cursor,l=j&&{cursor:j},m=function(){if(f.hoverSeries!==a)a.onMouseOver()},n="rgba(192,192,192,"+(ca?1.0E-4:0.002)+")";if(e&&!c)for(j=e+1;j--;)d[j]==="M"&&d.splice(j+1,0,d[j+1]-i,d[j+2],"L"),(j&&d[j]==="M"||j===e)&&d.splice(j,0,"L",d[j-2]+i,d[j-1]);k?k.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",visibility:a.visible?"visible":"hidden",stroke:n,fill:c?n:"none","stroke-width":b.lineWidth+
(c?0:2*i),zIndex:2}).add(a.group),o([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",m).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);if(db)a.on("touchstart",m)}))}};if(I.column)wa.prototype.drawTracker=da.drawTrackerPoint;if(I.pie)I.pie.prototype.drawTracker=da.drawTrackerPoint;if(I.scatter)la.prototype.drawTracker=da.drawTrackerPoint;u(ob.prototype,{setItemEvents:function(a,b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");
b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible&&a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):H(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=Z("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},this.options.itemCheckboxStyle,this.chart.container);M(a.checkbox,"click",function(b){H(a.series||a,"checkboxClick",
{checked:b.target.checked,item:a},function(){a.select()})})}});N.legend.itemStyle.cursor="pointer";u(hb.prototype,{showResetZoom:function(){var a=this,b=N.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,!1,f)},zoomOut:function(){var a=this;H(a,"selection",{resetSelection:!0},
function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?o(this.axes,function(a){b=a.zoom()}):o(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&Y(e))this.resetZoomButton=e.destroy();b&&this.redraw(p(this.options.chart.animation,a&&a.animation,this.pointCount<100))},pan:function(a,b){var c=this,d=c.hoverPoints,
e;d&&o(d,function(a){a.setState()});o(b==="xy"?[1,0]:[1],function(b){var b=c[b?"xAxis":"yAxis"][0],d=b.horiz,h=a[d?"chartX":"chartY"],d=d?"mouseDownX":"mouseDownY",i=c[d],k=(b.pointRange||0)/2,j=b.getExtremes(),l=b.toValue(i-h,!0)+k,k=b.toValue(i+b.len-h,!0)-k,i=i>h;if(b.series.length&&(i||l>F(j.dataMin,j.min))&&(!i||k<t(j.dataMax,j.max)))b.setExtremes(l,k,!1,!1,{trigger:"pan"}),e=!0;c[d]=h});e&&c.redraw(!1);L(c.container,{cursor:"move"})}});u(Ha.prototype,{select:function(a,b){var c=this,d=c.series,
e=d.chart,a=p(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[sa(c,d.data)]=c.options;c.setState(a&&"select");b||o(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[sa(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a,b){var c=this.series,d=c.chart,e=d.tooltip,f=d.hoverPoint;if(d.hoverSeries!==c)c.onMouseOver();if(f&&f!==this)f.onMouseOut();
if(this.series&&(this.firePointEvent("mouseOver"),e&&(!e.shared||c.noSharedTooltip)&&e.refresh(this,a),this.setState("hover"),!b))d.hoverPoint=this},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;this.firePointEvent("mouseOut");if(!b||sa(this,b)===-1)this.setState(),a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var a=D(this.series.options.point,this.options).events,b;this.events=a;for(b in a)M(this,b,a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=
T(this.plotX),d=this.plotY,e=this.series,f=e.options.states,g=aa[e.type].marker&&e.options.marker,h=g&&!g.enabled,i=g&&g.states[a],k=i&&i.enabled===!1,j=e.stateMarkerGraphic,l=this.marker||{},m=e.chart,n=e.halo,o,a=a||"";o=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&a!=="select"||f[a]&&f[a].enabled===!1||a&&(k||h&&i.enabled===!1)||a&&l.states&&l.states[a]&&l.states[a].enabled===!1)){if(this.graphic)g=g&&this.graphic.symbolName&&o.r,this.graphic.attr(D(o,g?{x:c-g,y:d-
g,width:2*g,height:2*g}:{})),j&&j.hide();else{if(a&&i)if(g=i.radius,l=l.symbol||e.symbol,j&&j.currentSymbol!==l&&(j=j.destroy()),j)j[b?"animate":"attr"]({x:c-g,y:d-g});else if(l)e.stateMarkerGraphic=j=m.renderer.symbol(l,c-g,d-g,2*g,2*g).attr(o).add(e.markerGroup),j.currentSymbol=l;if(j)j[a&&m.isInsidePlot(c,d,m.inverted)?"show":"hide"](),j.element.point=this}if((c=f[a]&&f[a].halo)&&c.size){if(!n)e.halo=n=m.renderer.path().add(m.seriesGroup);n.attr(u({fill:this.color||e.color,"fill-opacity":c.opacity,
zIndex:-1},c.attributes))[b?"animate":"attr"]({d:this.haloPath(c.size)})}else n&&n.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series,c=b.chart,d=b.getPlotBox(),e=c.inverted,f=Math.floor(this.plotX);return c.renderer.symbols.circle(d.translateX+(e?b.yAxis.len-this.plotY:f)-a,d.translateY+(e?b.xAxis.len-f:this.plotY)-a,a*2,a*2)}});u(Q.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&H(this,"mouseOver");this.setState("hover");
a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;b.hoverSeries=null;if(d)d.onMouseOut();this&&a.events.mouseOut&&H(this,"mouseOut");c&&!a.stickyTracking&&(!c.shared||this.noSharedTooltip)&&c.hide();this.setState()},setState:function(a){var b=this.options,c=this.graph,d=b.states,e=b.lineWidth,b=0,a=a||"";if(this.state!==a&&(this.state=a,!(d[a]&&d[a].enabled===!1)&&(a&&(e=d[a].lineWidth||e+(d[a].lineWidthPlus||0)),c&&!c.dashstyle))){a={"stroke-width":e};
for(c.attr(a);this["zoneGraph"+b];)this["zoneGraph"+b].attr(a),b+=1}},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,h=c.visible;f=(c.visible=a=c.userOptions.visible=a===z?!h:a)?"show":"hide";o(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c||(d.hoverPoint&&d.hoverPoint.series)===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&o(d.series,function(a){if(a.options.stacking&&
a.visible)a.isDirty=!0});o(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;b!==!1&&d.redraw();H(c,f)},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===z?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;H(this,a?"select":"unselect")},drawTracker:da.drawTrackerGraph});u(B,{Color:ia,Point:Ha,Tick:Va,Renderer:cb,SVGElement:O,SVGRenderer:Ca,arrayMin:Ra,arrayMax:Ea,charts:S,dateFormat:Qa,error:X,format:Ka,pathAnim:void 0,
getOptions:function(){return N},hasBidiBug:Qb,isTouchDevice:Mb,setOptions:function(a){N=D(!0,N,a);Fb();return N},addEvent:M,removeEvent:V,createElement:Z,discardElement:Ta,css:L,each:o,map:Ba,merge:D,splat:ta,stableSort:ib,extendClass:pa,pInt:C,svg:ca,canvas:ha,vml:!ca&&!ha,product:"Highcharts",version:"4.2.3"});return B});
/*! jQuery v1.11.3 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */

!function(a,b){"object"==typeof module&&"object"==typeof module.exports?module.exports=a.document?b(a,!0):function(a){if(!a.document)throw new Error("jQuery requires a window with a document");return b(a)}:b(a)}("undefined"!=typeof window?window:this,function(a,b){var c=[],d=c.slice,e=c.concat,f=c.push,g=c.indexOf,h={},i=h.toString,j=h.hasOwnProperty,k={},l="1.11.3",m=function(a,b){return new m.fn.init(a,b)},n=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,o=/^-ms-/,p=/-([\da-z])/gi,q=function(a,b){return b.toUpperCase()};m.fn=m.prototype={jquery:l,constructor:m,selector:"",length:0,toArray:function(){return d.call(this)},get:function(a){return null!=a?0>a?this[a+this.length]:this[a]:d.call(this)},pushStack:function(a){var b=m.merge(this.constructor(),a);return b.prevObject=this,b.context=this.context,b},each:function(a,b){return m.each(this,a,b)},map:function(a){return this.pushStack(m.map(this,function(b,c){return a.call(b,c,b)}))},slice:function(){return this.pushStack(d.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(a){var b=this.length,c=+a+(0>a?b:0);return this.pushStack(c>=0&&b>c?[this[c]]:[])},end:function(){return this.prevObject||this.constructor(null)},push:f,sort:c.sort,splice:c.splice},m.extend=m.fn.extend=function(){var a,b,c,d,e,f,g=arguments[0]||{},h=1,i=arguments.length,j=!1;for("boolean"==typeof g&&(j=g,g=arguments[h]||{},h++),"object"==typeof g||m.isFunction(g)||(g={}),h===i&&(g=this,h--);i>h;h++)if(null!=(e=arguments[h]))for(d in e)a=g[d],c=e[d],g!==c&&(j&&c&&(m.isPlainObject(c)||(b=m.isArray(c)))?(b?(b=!1,f=a&&m.isArray(a)?a:[]):f=a&&m.isPlainObject(a)?a:{},g[d]=m.extend(j,f,c)):void 0!==c&&(g[d]=c));return g},m.extend({expando:"jQuery"+(l+Math.random()).replace(/\D/g,""),isReady:!0,error:function(a){throw new Error(a)},noop:function(){},isFunction:function(a){return"function"===m.type(a)},isArray:Array.isArray||function(a){return"array"===m.type(a)},isWindow:function(a){return null!=a&&a==a.window},isNumeric:function(a){return!m.isArray(a)&&a-parseFloat(a)+1>=0},isEmptyObject:function(a){var b;for(b in a)return!1;return!0},isPlainObject:function(a){var b;if(!a||"object"!==m.type(a)||a.nodeType||m.isWindow(a))return!1;try{if(a.constructor&&!j.call(a,"constructor")&&!j.call(a.constructor.prototype,"isPrototypeOf"))return!1}catch(c){return!1}if(k.ownLast)for(b in a)return j.call(a,b);for(b in a);return void 0===b||j.call(a,b)},type:function(a){return null==a?a+"":"object"==typeof a||"function"==typeof a?h[i.call(a)]||"object":typeof a},globalEval:function(b){b&&m.trim(b)&&(a.execScript||function(b){a.eval.call(a,b)})(b)},camelCase:function(a){return a.replace(o,"ms-").replace(p,q)},nodeName:function(a,b){return a.nodeName&&a.nodeName.toLowerCase()===b.toLowerCase()},each:function(a,b,c){var d,e=0,f=a.length,g=r(a);if(c){if(g){for(;f>e;e++)if(d=b.apply(a[e],c),d===!1)break}else for(e in a)if(d=b.apply(a[e],c),d===!1)break}else if(g){for(;f>e;e++)if(d=b.call(a[e],e,a[e]),d===!1)break}else for(e in a)if(d=b.call(a[e],e,a[e]),d===!1)break;return a},trim:function(a){return null==a?"":(a+"").replace(n,"")},makeArray:function(a,b){var c=b||[];return null!=a&&(r(Object(a))?m.merge(c,"string"==typeof a?[a]:a):f.call(c,a)),c},inArray:function(a,b,c){var d;if(b){if(g)return g.call(b,a,c);for(d=b.length,c=c?0>c?Math.max(0,d+c):c:0;d>c;c++)if(c in b&&b[c]===a)return c}return-1},merge:function(a,b){var c=+b.length,d=0,e=a.length;while(c>d)a[e++]=b[d++];if(c!==c)while(void 0!==b[d])a[e++]=b[d++];return a.length=e,a},grep:function(a,b,c){for(var d,e=[],f=0,g=a.length,h=!c;g>f;f++)d=!b(a[f],f),d!==h&&e.push(a[f]);return e},map:function(a,b,c){var d,f=0,g=a.length,h=r(a),i=[];if(h)for(;g>f;f++)d=b(a[f],f,c),null!=d&&i.push(d);else for(f in a)d=b(a[f],f,c),null!=d&&i.push(d);return e.apply([],i)},guid:1,proxy:function(a,b){var c,e,f;return"string"==typeof b&&(f=a[b],b=a,a=f),m.isFunction(a)?(c=d.call(arguments,2),e=function(){return a.apply(b||this,c.concat(d.call(arguments)))},e.guid=a.guid=a.guid||m.guid++,e):void 0},now:function(){return+new Date},support:k}),m.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(a,b){h["[object "+b+"]"]=b.toLowerCase()});function r(a){var b="length"in a&&a.length,c=m.type(a);return"function"===c||m.isWindow(a)?!1:1===a.nodeType&&b?!0:"array"===c||0===b||"number"==typeof b&&b>0&&b-1 in a}var s=function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u="sizzle"+1*new Date,v=a.document,w=0,x=0,y=ha(),z=ha(),A=ha(),B=function(a,b){return a===b&&(l=!0),0},C=1<<31,D={}.hasOwnProperty,E=[],F=E.pop,G=E.push,H=E.push,I=E.slice,J=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return c;return-1},K="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",L="[\\x20\\t\\r\\n\\f]",M="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",N=M.replace("w","w#"),O="\\["+L+"*("+M+")(?:"+L+"*([*^$|!~]?=)"+L+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+N+"))|)"+L+"*\\]",P=":("+M+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+O+")*)|.*)\\)|)",Q=new RegExp(L+"+","g"),R=new RegExp("^"+L+"+|((?:^|[^\\\\])(?:\\\\.)*)"+L+"+$","g"),S=new RegExp("^"+L+"*,"+L+"*"),T=new RegExp("^"+L+"*([>+~]|"+L+")"+L+"*"),U=new RegExp("="+L+"*([^\\]'\"]*?)"+L+"*\\]","g"),V=new RegExp(P),W=new RegExp("^"+N+"$"),X={ID:new RegExp("^#("+M+")"),CLASS:new RegExp("^\\.("+M+")"),TAG:new RegExp("^("+M.replace("w","w*")+")"),ATTR:new RegExp("^"+O),PSEUDO:new RegExp("^"+P),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+L+"*(even|odd|(([+-]|)(\\d*)n|)"+L+"*(?:([+-]|)"+L+"*(\\d+)|))"+L+"*\\)|)","i"),bool:new RegExp("^(?:"+K+")$","i"),needsContext:new RegExp("^"+L+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+L+"*((?:-\\d)?\\d*)"+L+"*\\)|)(?=[^-]|$)","i")},Y=/^(?:input|select|textarea|button)$/i,Z=/^h\d$/i,$=/^[^{]+\{\s*\[native \w/,_=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,aa=/[+~]/,ba=/'|\\/g,ca=new RegExp("\\\\([\\da-f]{1,6}"+L+"?|("+L+")|.)","ig"),da=function(a,b,c){var d="0x"+b-65536;return d!==d||c?b:0>d?String.fromCharCode(d+65536):String.fromCharCode(d>>10|55296,1023&d|56320)},ea=function(){m()};try{H.apply(E=I.call(v.childNodes),v.childNodes),E[v.childNodes.length].nodeType}catch(fa){H={apply:E.length?function(a,b){G.apply(a,I.call(b))}:function(a,b){var c=a.length,d=0;while(a[c++]=b[d++]);a.length=c-1}}}function ga(a,b,d,e){var f,h,j,k,l,o,r,s,w,x;if((b?b.ownerDocument||b:v)!==n&&m(b),b=b||n,d=d||[],k=b.nodeType,"string"!=typeof a||!a||1!==k&&9!==k&&11!==k)return d;if(!e&&p){if(11!==k&&(f=_.exec(a)))if(j=f[1]){if(9===k){if(h=b.getElementById(j),!h||!h.parentNode)return d;if(h.id===j)return d.push(h),d}else if(b.ownerDocument&&(h=b.ownerDocument.getElementById(j))&&t(b,h)&&h.id===j)return d.push(h),d}else{if(f[2])return H.apply(d,b.getElementsByTagName(a)),d;if((j=f[3])&&c.getElementsByClassName)return H.apply(d,b.getElementsByClassName(j)),d}if(c.qsa&&(!q||!q.test(a))){if(s=r=u,w=b,x=1!==k&&a,1===k&&"object"!==b.nodeName.toLowerCase()){o=g(a),(r=b.getAttribute("id"))?s=r.replace(ba,"\\$&"):b.setAttribute("id",s),s="[id='"+s+"'] ",l=o.length;while(l--)o[l]=s+ra(o[l]);w=aa.test(a)&&pa(b.parentNode)||b,x=o.join(",")}if(x)try{return H.apply(d,w.querySelectorAll(x)),d}catch(y){}finally{r||b.removeAttribute("id")}}}return i(a.replace(R,"$1"),b,d,e)}function ha(){var a=[];function b(c,e){return a.push(c+" ")>d.cacheLength&&delete b[a.shift()],b[c+" "]=e}return b}function ia(a){return a[u]=!0,a}function ja(a){var b=n.createElement("div");try{return!!a(b)}catch(c){return!1}finally{b.parentNode&&b.parentNode.removeChild(b),b=null}}function ka(a,b){var c=a.split("|"),e=a.length;while(e--)d.attrHandle[c[e]]=b}function la(a,b){var c=b&&a,d=c&&1===a.nodeType&&1===b.nodeType&&(~b.sourceIndex||C)-(~a.sourceIndex||C);if(d)return d;if(c)while(c=c.nextSibling)if(c===b)return-1;return a?1:-1}function ma(a){return function(b){var c=b.nodeName.toLowerCase();return"input"===c&&b.type===a}}function na(a){return function(b){var c=b.nodeName.toLowerCase();return("input"===c||"button"===c)&&b.type===a}}function oa(a){return ia(function(b){return b=+b,ia(function(c,d){var e,f=a([],c.length,b),g=f.length;while(g--)c[e=f[g]]&&(c[e]=!(d[e]=c[e]))})})}function pa(a){return a&&"undefined"!=typeof a.getElementsByTagName&&a}c=ga.support={},f=ga.isXML=function(a){var b=a&&(a.ownerDocument||a).documentElement;return b?"HTML"!==b.nodeName:!1},m=ga.setDocument=function(a){var b,e,g=a?a.ownerDocument||a:v;return g!==n&&9===g.nodeType&&g.documentElement?(n=g,o=g.documentElement,e=g.defaultView,e&&e!==e.top&&(e.addEventListener?e.addEventListener("unload",ea,!1):e.attachEvent&&e.attachEvent("onunload",ea)),p=!f(g),c.attributes=ja(function(a){return a.className="i",!a.getAttribute("className")}),c.getElementsByTagName=ja(function(a){return a.appendChild(g.createComment("")),!a.getElementsByTagName("*").length}),c.getElementsByClassName=$.test(g.getElementsByClassName),c.getById=ja(function(a){return o.appendChild(a).id=u,!g.getElementsByName||!g.getElementsByName(u).length}),c.getById?(d.find.ID=function(a,b){if("undefined"!=typeof b.getElementById&&p){var c=b.getElementById(a);return c&&c.parentNode?[c]:[]}},d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){return a.getAttribute("id")===b}}):(delete d.find.ID,d.filter.ID=function(a){var b=a.replace(ca,da);return function(a){var c="undefined"!=typeof a.getAttributeNode&&a.getAttributeNode("id");return c&&c.value===b}}),d.find.TAG=c.getElementsByTagName?function(a,b){return"undefined"!=typeof b.getElementsByTagName?b.getElementsByTagName(a):c.qsa?b.querySelectorAll(a):void 0}:function(a,b){var c,d=[],e=0,f=b.getElementsByTagName(a);if("*"===a){while(c=f[e++])1===c.nodeType&&d.push(c);return d}return f},d.find.CLASS=c.getElementsByClassName&&function(a,b){return p?b.getElementsByClassName(a):void 0},r=[],q=[],(c.qsa=$.test(g.querySelectorAll))&&(ja(function(a){o.appendChild(a).innerHTML="<a id='"+u+"'></a><select id='"+u+"-\f]' msallowcapture=''><option selected=''></option></select>",a.querySelectorAll("[msallowcapture^='']").length&&q.push("[*^$]="+L+"*(?:''|\"\")"),a.querySelectorAll("[selected]").length||q.push("\\["+L+"*(?:value|"+K+")"),a.querySelectorAll("[id~="+u+"-]").length||q.push("~="),a.querySelectorAll(":checked").length||q.push(":checked"),a.querySelectorAll("a#"+u+"+*").length||q.push(".#.+[+~]")}),ja(function(a){var b=g.createElement("input");b.setAttribute("type","hidden"),a.appendChild(b).setAttribute("name","D"),a.querySelectorAll("[name=d]").length&&q.push("name"+L+"*[*^$|!~]?="),a.querySelectorAll(":enabled").length||q.push(":enabled",":disabled"),a.querySelectorAll("*,:x"),q.push(",.*:")})),(c.matchesSelector=$.test(s=o.matches||o.webkitMatchesSelector||o.mozMatchesSelector||o.oMatchesSelector||o.msMatchesSelector))&&ja(function(a){c.disconnectedMatch=s.call(a,"div"),s.call(a,"[s!='']:x"),r.push("!=",P)}),q=q.length&&new RegExp(q.join("|")),r=r.length&&new RegExp(r.join("|")),b=$.test(o.compareDocumentPosition),t=b||$.test(o.contains)?function(a,b){var c=9===a.nodeType?a.documentElement:a,d=b&&b.parentNode;return a===d||!(!d||1!==d.nodeType||!(c.contains?c.contains(d):a.compareDocumentPosition&&16&a.compareDocumentPosition(d)))}:function(a,b){if(b)while(b=b.parentNode)if(b===a)return!0;return!1},B=b?function(a,b){if(a===b)return l=!0,0;var d=!a.compareDocumentPosition-!b.compareDocumentPosition;return d?d:(d=(a.ownerDocument||a)===(b.ownerDocument||b)?a.compareDocumentPosition(b):1,1&d||!c.sortDetached&&b.compareDocumentPosition(a)===d?a===g||a.ownerDocument===v&&t(v,a)?-1:b===g||b.ownerDocument===v&&t(v,b)?1:k?J(k,a)-J(k,b):0:4&d?-1:1)}:function(a,b){if(a===b)return l=!0,0;var c,d=0,e=a.parentNode,f=b.parentNode,h=[a],i=[b];if(!e||!f)return a===g?-1:b===g?1:e?-1:f?1:k?J(k,a)-J(k,b):0;if(e===f)return la(a,b);c=a;while(c=c.parentNode)h.unshift(c);c=b;while(c=c.parentNode)i.unshift(c);while(h[d]===i[d])d++;return d?la(h[d],i[d]):h[d]===v?-1:i[d]===v?1:0},g):n},ga.matches=function(a,b){return ga(a,null,null,b)},ga.matchesSelector=function(a,b){if((a.ownerDocument||a)!==n&&m(a),b=b.replace(U,"='$1']"),!(!c.matchesSelector||!p||r&&r.test(b)||q&&q.test(b)))try{var d=s.call(a,b);if(d||c.disconnectedMatch||a.document&&11!==a.document.nodeType)return d}catch(e){}return ga(b,n,null,[a]).length>0},ga.contains=function(a,b){return(a.ownerDocument||a)!==n&&m(a),t(a,b)},ga.attr=function(a,b){(a.ownerDocument||a)!==n&&m(a);var e=d.attrHandle[b.toLowerCase()],f=e&&D.call(d.attrHandle,b.toLowerCase())?e(a,b,!p):void 0;return void 0!==f?f:c.attributes||!p?a.getAttribute(b):(f=a.getAttributeNode(b))&&f.specified?f.value:null},ga.error=function(a){throw new Error("Syntax error, unrecognized expression: "+a)},ga.uniqueSort=function(a){var b,d=[],e=0,f=0;if(l=!c.detectDuplicates,k=!c.sortStable&&a.slice(0),a.sort(B),l){while(b=a[f++])b===a[f]&&(e=d.push(f));while(e--)a.splice(d[e],1)}return k=null,a},e=ga.getText=function(a){var b,c="",d=0,f=a.nodeType;if(f){if(1===f||9===f||11===f){if("string"==typeof a.textContent)return a.textContent;for(a=a.firstChild;a;a=a.nextSibling)c+=e(a)}else if(3===f||4===f)return a.nodeValue}else while(b=a[d++])c+=e(b);return c},d=ga.selectors={cacheLength:50,createPseudo:ia,match:X,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(a){return a[1]=a[1].replace(ca,da),a[3]=(a[3]||a[4]||a[5]||"").replace(ca,da),"~="===a[2]&&(a[3]=" "+a[3]+" "),a.slice(0,4)},CHILD:function(a){return a[1]=a[1].toLowerCase(),"nth"===a[1].slice(0,3)?(a[3]||ga.error(a[0]),a[4]=+(a[4]?a[5]+(a[6]||1):2*("even"===a[3]||"odd"===a[3])),a[5]=+(a[7]+a[8]||"odd"===a[3])):a[3]&&ga.error(a[0]),a},PSEUDO:function(a){var b,c=!a[6]&&a[2];return X.CHILD.test(a[0])?null:(a[3]?a[2]=a[4]||a[5]||"":c&&V.test(c)&&(b=g(c,!0))&&(b=c.indexOf(")",c.length-b)-c.length)&&(a[0]=a[0].slice(0,b),a[2]=c.slice(0,b)),a.slice(0,3))}},filter:{TAG:function(a){var b=a.replace(ca,da).toLowerCase();return"*"===a?function(){return!0}:function(a){return a.nodeName&&a.nodeName.toLowerCase()===b}},CLASS:function(a){var b=y[a+" "];return b||(b=new RegExp("(^|"+L+")"+a+"("+L+"|$)"))&&y(a,function(a){return b.test("string"==typeof a.className&&a.className||"undefined"!=typeof a.getAttribute&&a.getAttribute("class")||"")})},ATTR:function(a,b,c){return function(d){var e=ga.attr(d,a);return null==e?"!="===b:b?(e+="","="===b?e===c:"!="===b?e!==c:"^="===b?c&&0===e.indexOf(c):"*="===b?c&&e.indexOf(c)>-1:"$="===b?c&&e.slice(-c.length)===c:"~="===b?(" "+e.replace(Q," ")+" ").indexOf(c)>-1:"|="===b?e===c||e.slice(0,c.length+1)===c+"-":!1):!0}},CHILD:function(a,b,c,d,e){var f="nth"!==a.slice(0,3),g="last"!==a.slice(-4),h="of-type"===b;return 1===d&&0===e?function(a){return!!a.parentNode}:function(b,c,i){var j,k,l,m,n,o,p=f!==g?"nextSibling":"previousSibling",q=b.parentNode,r=h&&b.nodeName.toLowerCase(),s=!i&&!h;if(q){if(f){while(p){l=b;while(l=l[p])if(h?l.nodeName.toLowerCase()===r:1===l.nodeType)return!1;o=p="only"===a&&!o&&"nextSibling"}return!0}if(o=[g?q.firstChild:q.lastChild],g&&s){k=q[u]||(q[u]={}),j=k[a]||[],n=j[0]===w&&j[1],m=j[0]===w&&j[2],l=n&&q.childNodes[n];while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if(1===l.nodeType&&++m&&l===b){k[a]=[w,n,m];break}}else if(s&&(j=(b[u]||(b[u]={}))[a])&&j[0]===w)m=j[1];else while(l=++n&&l&&l[p]||(m=n=0)||o.pop())if((h?l.nodeName.toLowerCase()===r:1===l.nodeType)&&++m&&(s&&((l[u]||(l[u]={}))[a]=[w,m]),l===b))break;return m-=e,m===d||m%d===0&&m/d>=0}}},PSEUDO:function(a,b){var c,e=d.pseudos[a]||d.setFilters[a.toLowerCase()]||ga.error("unsupported pseudo: "+a);return e[u]?e(b):e.length>1?(c=[a,a,"",b],d.setFilters.hasOwnProperty(a.toLowerCase())?ia(function(a,c){var d,f=e(a,b),g=f.length;while(g--)d=J(a,f[g]),a[d]=!(c[d]=f[g])}):function(a){return e(a,0,c)}):e}},pseudos:{not:ia(function(a){var b=[],c=[],d=h(a.replace(R,"$1"));return d[u]?ia(function(a,b,c,e){var f,g=d(a,null,e,[]),h=a.length;while(h--)(f=g[h])&&(a[h]=!(b[h]=f))}):function(a,e,f){return b[0]=a,d(b,null,f,c),b[0]=null,!c.pop()}}),has:ia(function(a){return function(b){return ga(a,b).length>0}}),contains:ia(function(a){return a=a.replace(ca,da),function(b){return(b.textContent||b.innerText||e(b)).indexOf(a)>-1}}),lang:ia(function(a){return W.test(a||"")||ga.error("unsupported lang: "+a),a=a.replace(ca,da).toLowerCase(),function(b){var c;do if(c=p?b.lang:b.getAttribute("xml:lang")||b.getAttribute("lang"))return c=c.toLowerCase(),c===a||0===c.indexOf(a+"-");while((b=b.parentNode)&&1===b.nodeType);return!1}}),target:function(b){var c=a.location&&a.location.hash;return c&&c.slice(1)===b.id},root:function(a){return a===o},focus:function(a){return a===n.activeElement&&(!n.hasFocus||n.hasFocus())&&!!(a.type||a.href||~a.tabIndex)},enabled:function(a){return a.disabled===!1},disabled:function(a){return a.disabled===!0},checked:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&!!a.checked||"option"===b&&!!a.selected},selected:function(a){return a.parentNode&&a.parentNode.selectedIndex,a.selected===!0},empty:function(a){for(a=a.firstChild;a;a=a.nextSibling)if(a.nodeType<6)return!1;return!0},parent:function(a){return!d.pseudos.empty(a)},header:function(a){return Z.test(a.nodeName)},input:function(a){return Y.test(a.nodeName)},button:function(a){var b=a.nodeName.toLowerCase();return"input"===b&&"button"===a.type||"button"===b},text:function(a){var b;return"input"===a.nodeName.toLowerCase()&&"text"===a.type&&(null==(b=a.getAttribute("type"))||"text"===b.toLowerCase())},first:oa(function(){return[0]}),last:oa(function(a,b){return[b-1]}),eq:oa(function(a,b,c){return[0>c?c+b:c]}),even:oa(function(a,b){for(var c=0;b>c;c+=2)a.push(c);return a}),odd:oa(function(a,b){for(var c=1;b>c;c+=2)a.push(c);return a}),lt:oa(function(a,b,c){for(var d=0>c?c+b:c;--d>=0;)a.push(d);return a}),gt:oa(function(a,b,c){for(var d=0>c?c+b:c;++d<b;)a.push(d);return a})}},d.pseudos.nth=d.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})d.pseudos[b]=ma(b);for(b in{submit:!0,reset:!0})d.pseudos[b]=na(b);function qa(){}qa.prototype=d.filters=d.pseudos,d.setFilters=new qa,g=ga.tokenize=function(a,b){var c,e,f,g,h,i,j,k=z[a+" "];if(k)return b?0:k.slice(0);h=a,i=[],j=d.preFilter;while(h){(!c||(e=S.exec(h)))&&(e&&(h=h.slice(e[0].length)||h),i.push(f=[])),c=!1,(e=T.exec(h))&&(c=e.shift(),f.push({value:c,type:e[0].replace(R," ")}),h=h.slice(c.length));for(g in d.filter)!(e=X[g].exec(h))||j[g]&&!(e=j[g](e))||(c=e.shift(),f.push({value:c,type:g,matches:e}),h=h.slice(c.length));if(!c)break}return b?h.length:h?ga.error(a):z(a,i).slice(0)};function ra(a){for(var b=0,c=a.length,d="";c>b;b++)d+=a[b].value;return d}function sa(a,b,c){var d=b.dir,e=c&&"parentNode"===d,f=x++;return b.first?function(b,c,f){while(b=b[d])if(1===b.nodeType||e)return a(b,c,f)}:function(b,c,g){var h,i,j=[w,f];if(g){while(b=b[d])if((1===b.nodeType||e)&&a(b,c,g))return!0}else while(b=b[d])if(1===b.nodeType||e){if(i=b[u]||(b[u]={}),(h=i[d])&&h[0]===w&&h[1]===f)return j[2]=h[2];if(i[d]=j,j[2]=a(b,c,g))return!0}}}function ta(a){return a.length>1?function(b,c,d){var e=a.length;while(e--)if(!a[e](b,c,d))return!1;return!0}:a[0]}function ua(a,b,c){for(var d=0,e=b.length;e>d;d++)ga(a,b[d],c);return c}function va(a,b,c,d,e){for(var f,g=[],h=0,i=a.length,j=null!=b;i>h;h++)(f=a[h])&&(!c||c(f,d,e))&&(g.push(f),j&&b.push(h));return g}function wa(a,b,c,d,e,f){return d&&!d[u]&&(d=wa(d)),e&&!e[u]&&(e=wa(e,f)),ia(function(f,g,h,i){var j,k,l,m=[],n=[],o=g.length,p=f||ua(b||"*",h.nodeType?[h]:h,[]),q=!a||!f&&b?p:va(p,m,a,h,i),r=c?e||(f?a:o||d)?[]:g:q;if(c&&c(q,r,h,i),d){j=va(r,n),d(j,[],h,i),k=j.length;while(k--)(l=j[k])&&(r[n[k]]=!(q[n[k]]=l))}if(f){if(e||a){if(e){j=[],k=r.length;while(k--)(l=r[k])&&j.push(q[k]=l);e(null,r=[],j,i)}k=r.length;while(k--)(l=r[k])&&(j=e?J(f,l):m[k])>-1&&(f[j]=!(g[j]=l))}}else r=va(r===g?r.splice(o,r.length):r),e?e(null,g,r,i):H.apply(g,r)})}function xa(a){for(var b,c,e,f=a.length,g=d.relative[a[0].type],h=g||d.relative[" "],i=g?1:0,k=sa(function(a){return a===b},h,!0),l=sa(function(a){return J(b,a)>-1},h,!0),m=[function(a,c,d){var e=!g&&(d||c!==j)||((b=c).nodeType?k(a,c,d):l(a,c,d));return b=null,e}];f>i;i++)if(c=d.relative[a[i].type])m=[sa(ta(m),c)];else{if(c=d.filter[a[i].type].apply(null,a[i].matches),c[u]){for(e=++i;f>e;e++)if(d.relative[a[e].type])break;return wa(i>1&&ta(m),i>1&&ra(a.slice(0,i-1).concat({value:" "===a[i-2].type?"*":""})).replace(R,"$1"),c,e>i&&xa(a.slice(i,e)),f>e&&xa(a=a.slice(e)),f>e&&ra(a))}m.push(c)}return ta(m)}function ya(a,b){var c=b.length>0,e=a.length>0,f=function(f,g,h,i,k){var l,m,o,p=0,q="0",r=f&&[],s=[],t=j,u=f||e&&d.find.TAG("*",k),v=w+=null==t?1:Math.random()||.1,x=u.length;for(k&&(j=g!==n&&g);q!==x&&null!=(l=u[q]);q++){if(e&&l){m=0;while(o=a[m++])if(o(l,g,h)){i.push(l);break}k&&(w=v)}c&&((l=!o&&l)&&p--,f&&r.push(l))}if(p+=q,c&&q!==p){m=0;while(o=b[m++])o(r,s,g,h);if(f){if(p>0)while(q--)r[q]||s[q]||(s[q]=F.call(i));s=va(s)}H.apply(i,s),k&&!f&&s.length>0&&p+b.length>1&&ga.uniqueSort(i)}return k&&(w=v,j=t),r};return c?ia(f):f}return h=ga.compile=function(a,b){var c,d=[],e=[],f=A[a+" "];if(!f){b||(b=g(a)),c=b.length;while(c--)f=xa(b[c]),f[u]?d.push(f):e.push(f);f=A(a,ya(e,d)),f.selector=a}return f},i=ga.select=function(a,b,e,f){var i,j,k,l,m,n="function"==typeof a&&a,o=!f&&g(a=n.selector||a);if(e=e||[],1===o.length){if(j=o[0]=o[0].slice(0),j.length>2&&"ID"===(k=j[0]).type&&c.getById&&9===b.nodeType&&p&&d.relative[j[1].type]){if(b=(d.find.ID(k.matches[0].replace(ca,da),b)||[])[0],!b)return e;n&&(b=b.parentNode),a=a.slice(j.shift().value.length)}i=X.needsContext.test(a)?0:j.length;while(i--){if(k=j[i],d.relative[l=k.type])break;if((m=d.find[l])&&(f=m(k.matches[0].replace(ca,da),aa.test(j[0].type)&&pa(b.parentNode)||b))){if(j.splice(i,1),a=f.length&&ra(j),!a)return H.apply(e,f),e;break}}}return(n||h(a,o))(f,b,!p,e,aa.test(a)&&pa(b.parentNode)||b),e},c.sortStable=u.split("").sort(B).join("")===u,c.detectDuplicates=!!l,m(),c.sortDetached=ja(function(a){return 1&a.compareDocumentPosition(n.createElement("div"))}),ja(function(a){return a.innerHTML="<a href='#'></a>","#"===a.firstChild.getAttribute("href")})||ka("type|href|height|width",function(a,b,c){return c?void 0:a.getAttribute(b,"type"===b.toLowerCase()?1:2)}),c.attributes&&ja(function(a){return a.innerHTML="<input/>",a.firstChild.setAttribute("value",""),""===a.firstChild.getAttribute("value")})||ka("value",function(a,b,c){return c||"input"!==a.nodeName.toLowerCase()?void 0:a.defaultValue}),ja(function(a){return null==a.getAttribute("disabled")})||ka(K,function(a,b,c){var d;return c?void 0:a[b]===!0?b.toLowerCase():(d=a.getAttributeNode(b))&&d.specified?d.value:null}),ga}(a);m.find=s,m.expr=s.selectors,m.expr[":"]=m.expr.pseudos,m.unique=s.uniqueSort,m.text=s.getText,m.isXMLDoc=s.isXML,m.contains=s.contains;var t=m.expr.match.needsContext,u=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,v=/^.[^:#\[\.,]*$/;function w(a,b,c){if(m.isFunction(b))return m.grep(a,function(a,d){return!!b.call(a,d,a)!==c});if(b.nodeType)return m.grep(a,function(a){return a===b!==c});if("string"==typeof b){if(v.test(b))return m.filter(b,a,c);b=m.filter(b,a)}return m.grep(a,function(a){return m.inArray(a,b)>=0!==c})}m.filter=function(a,b,c){var d=b[0];return c&&(a=":not("+a+")"),1===b.length&&1===d.nodeType?m.find.matchesSelector(d,a)?[d]:[]:m.find.matches(a,m.grep(b,function(a){return 1===a.nodeType}))},m.fn.extend({find:function(a){var b,c=[],d=this,e=d.length;if("string"!=typeof a)return this.pushStack(m(a).filter(function(){for(b=0;e>b;b++)if(m.contains(d[b],this))return!0}));for(b=0;e>b;b++)m.find(a,d[b],c);return c=this.pushStack(e>1?m.unique(c):c),c.selector=this.selector?this.selector+" "+a:a,c},filter:function(a){return this.pushStack(w(this,a||[],!1))},not:function(a){return this.pushStack(w(this,a||[],!0))},is:function(a){return!!w(this,"string"==typeof a&&t.test(a)?m(a):a||[],!1).length}});var x,y=a.document,z=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,A=m.fn.init=function(a,b){var c,d;if(!a)return this;if("string"==typeof a){if(c="<"===a.charAt(0)&&">"===a.charAt(a.length-1)&&a.length>=3?[null,a,null]:z.exec(a),!c||!c[1]&&b)return!b||b.jquery?(b||x).find(a):this.constructor(b).find(a);if(c[1]){if(b=b instanceof m?b[0]:b,m.merge(this,m.parseHTML(c[1],b&&b.nodeType?b.ownerDocument||b:y,!0)),u.test(c[1])&&m.isPlainObject(b))for(c in b)m.isFunction(this[c])?this[c](b[c]):this.attr(c,b[c]);return this}if(d=y.getElementById(c[2]),d&&d.parentNode){if(d.id!==c[2])return x.find(a);this.length=1,this[0]=d}return this.context=y,this.selector=a,this}return a.nodeType?(this.context=this[0]=a,this.length=1,this):m.isFunction(a)?"undefined"!=typeof x.ready?x.ready(a):a(m):(void 0!==a.selector&&(this.selector=a.selector,this.context=a.context),m.makeArray(a,this))};A.prototype=m.fn,x=m(y);var B=/^(?:parents|prev(?:Until|All))/,C={children:!0,contents:!0,next:!0,prev:!0};m.extend({dir:function(a,b,c){var d=[],e=a[b];while(e&&9!==e.nodeType&&(void 0===c||1!==e.nodeType||!m(e).is(c)))1===e.nodeType&&d.push(e),e=e[b];return d},sibling:function(a,b){for(var c=[];a;a=a.nextSibling)1===a.nodeType&&a!==b&&c.push(a);return c}}),m.fn.extend({has:function(a){var b,c=m(a,this),d=c.length;return this.filter(function(){for(b=0;d>b;b++)if(m.contains(this,c[b]))return!0})},closest:function(a,b){for(var c,d=0,e=this.length,f=[],g=t.test(a)||"string"!=typeof a?m(a,b||this.context):0;e>d;d++)for(c=this[d];c&&c!==b;c=c.parentNode)if(c.nodeType<11&&(g?g.index(c)>-1:1===c.nodeType&&m.find.matchesSelector(c,a))){f.push(c);break}return this.pushStack(f.length>1?m.unique(f):f)},index:function(a){return a?"string"==typeof a?m.inArray(this[0],m(a)):m.inArray(a.jquery?a[0]:a,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(a,b){return this.pushStack(m.unique(m.merge(this.get(),m(a,b))))},addBack:function(a){return this.add(null==a?this.prevObject:this.prevObject.filter(a))}});function D(a,b){do a=a[b];while(a&&1!==a.nodeType);return a}m.each({parent:function(a){var b=a.parentNode;return b&&11!==b.nodeType?b:null},parents:function(a){return m.dir(a,"parentNode")},parentsUntil:function(a,b,c){return m.dir(a,"parentNode",c)},next:function(a){return D(a,"nextSibling")},prev:function(a){return D(a,"previousSibling")},nextAll:function(a){return m.dir(a,"nextSibling")},prevAll:function(a){return m.dir(a,"previousSibling")},nextUntil:function(a,b,c){return m.dir(a,"nextSibling",c)},prevUntil:function(a,b,c){return m.dir(a,"previousSibling",c)},siblings:function(a){return m.sibling((a.parentNode||{}).firstChild,a)},children:function(a){return m.sibling(a.firstChild)},contents:function(a){return m.nodeName(a,"iframe")?a.contentDocument||a.contentWindow.document:m.merge([],a.childNodes)}},function(a,b){m.fn[a]=function(c,d){var e=m.map(this,b,c);return"Until"!==a.slice(-5)&&(d=c),d&&"string"==typeof d&&(e=m.filter(d,e)),this.length>1&&(C[a]||(e=m.unique(e)),B.test(a)&&(e=e.reverse())),this.pushStack(e)}});var E=/\S+/g,F={};function G(a){var b=F[a]={};return m.each(a.match(E)||[],function(a,c){b[c]=!0}),b}m.Callbacks=function(a){a="string"==typeof a?F[a]||G(a):m.extend({},a);var b,c,d,e,f,g,h=[],i=!a.once&&[],j=function(l){for(c=a.memory&&l,d=!0,f=g||0,g=0,e=h.length,b=!0;h&&e>f;f++)if(h[f].apply(l[0],l[1])===!1&&a.stopOnFalse){c=!1;break}b=!1,h&&(i?i.length&&j(i.shift()):c?h=[]:k.disable())},k={add:function(){if(h){var d=h.length;!function f(b){m.each(b,function(b,c){var d=m.type(c);"function"===d?a.unique&&k.has(c)||h.push(c):c&&c.length&&"string"!==d&&f(c)})}(arguments),b?e=h.length:c&&(g=d,j(c))}return this},remove:function(){return h&&m.each(arguments,function(a,c){var d;while((d=m.inArray(c,h,d))>-1)h.splice(d,1),b&&(e>=d&&e--,f>=d&&f--)}),this},has:function(a){return a?m.inArray(a,h)>-1:!(!h||!h.length)},empty:function(){return h=[],e=0,this},disable:function(){return h=i=c=void 0,this},disabled:function(){return!h},lock:function(){return i=void 0,c||k.disable(),this},locked:function(){return!i},fireWith:function(a,c){return!h||d&&!i||(c=c||[],c=[a,c.slice?c.slice():c],b?i.push(c):j(c)),this},fire:function(){return k.fireWith(this,arguments),this},fired:function(){return!!d}};return k},m.extend({Deferred:function(a){var b=[["resolve","done",m.Callbacks("once memory"),"resolved"],["reject","fail",m.Callbacks("once memory"),"rejected"],["notify","progress",m.Callbacks("memory")]],c="pending",d={state:function(){return c},always:function(){return e.done(arguments).fail(arguments),this},then:function(){var a=arguments;return m.Deferred(function(c){m.each(b,function(b,f){var g=m.isFunction(a[b])&&a[b];e[f[1]](function(){var a=g&&g.apply(this,arguments);a&&m.isFunction(a.promise)?a.promise().done(c.resolve).fail(c.reject).progress(c.notify):c[f[0]+"With"](this===d?c.promise():this,g?[a]:arguments)})}),a=null}).promise()},promise:function(a){return null!=a?m.extend(a,d):d}},e={};return d.pipe=d.then,m.each(b,function(a,f){var g=f[2],h=f[3];d[f[1]]=g.add,h&&g.add(function(){c=h},b[1^a][2].disable,b[2][2].lock),e[f[0]]=function(){return e[f[0]+"With"](this===e?d:this,arguments),this},e[f[0]+"With"]=g.fireWith}),d.promise(e),a&&a.call(e,e),e},when:function(a){var b=0,c=d.call(arguments),e=c.length,f=1!==e||a&&m.isFunction(a.promise)?e:0,g=1===f?a:m.Deferred(),h=function(a,b,c){return function(e){b[a]=this,c[a]=arguments.length>1?d.call(arguments):e,c===i?g.notifyWith(b,c):--f||g.resolveWith(b,c)}},i,j,k;if(e>1)for(i=new Array(e),j=new Array(e),k=new Array(e);e>b;b++)c[b]&&m.isFunction(c[b].promise)?c[b].promise().done(h(b,k,c)).fail(g.reject).progress(h(b,j,i)):--f;return f||g.resolveWith(k,c),g.promise()}});var H;m.fn.ready=function(a){return m.ready.promise().done(a),this},m.extend({isReady:!1,readyWait:1,holdReady:function(a){a?m.readyWait++:m.ready(!0)},ready:function(a){if(a===!0?!--m.readyWait:!m.isReady){if(!y.body)return setTimeout(m.ready);m.isReady=!0,a!==!0&&--m.readyWait>0||(H.resolveWith(y,[m]),m.fn.triggerHandler&&(m(y).triggerHandler("ready"),m(y).off("ready")))}}});function I(){y.addEventListener?(y.removeEventListener("DOMContentLoaded",J,!1),a.removeEventListener("load",J,!1)):(y.detachEvent("onreadystatechange",J),a.detachEvent("onload",J))}function J(){(y.addEventListener||"load"===event.type||"complete"===y.readyState)&&(I(),m.ready())}m.ready.promise=function(b){if(!H)if(H=m.Deferred(),"complete"===y.readyState)setTimeout(m.ready);else if(y.addEventListener)y.addEventListener("DOMContentLoaded",J,!1),a.addEventListener("load",J,!1);else{y.attachEvent("onreadystatechange",J),a.attachEvent("onload",J);var c=!1;try{c=null==a.frameElement&&y.documentElement}catch(d){}c&&c.doScroll&&!function e(){if(!m.isReady){try{c.doScroll("left")}catch(a){return setTimeout(e,50)}I(),m.ready()}}()}return H.promise(b)};var K="undefined",L;for(L in m(k))break;k.ownLast="0"!==L,k.inlineBlockNeedsLayout=!1,m(function(){var a,b,c,d;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1",k.inlineBlockNeedsLayout=a=3===b.offsetWidth,a&&(c.style.zoom=1)),c.removeChild(d))}),function(){var a=y.createElement("div");if(null==k.deleteExpando){k.deleteExpando=!0;try{delete a.test}catch(b){k.deleteExpando=!1}}a=null}(),m.acceptData=function(a){var b=m.noData[(a.nodeName+" ").toLowerCase()],c=+a.nodeType||1;return 1!==c&&9!==c?!1:!b||b!==!0&&a.getAttribute("classid")===b};var M=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,N=/([A-Z])/g;function O(a,b,c){if(void 0===c&&1===a.nodeType){var d="data-"+b.replace(N,"-$1").toLowerCase();if(c=a.getAttribute(d),"string"==typeof c){try{c="true"===c?!0:"false"===c?!1:"null"===c?null:+c+""===c?+c:M.test(c)?m.parseJSON(c):c}catch(e){}m.data(a,b,c)}else c=void 0}return c}function P(a){var b;for(b in a)if(("data"!==b||!m.isEmptyObject(a[b]))&&"toJSON"!==b)return!1;

return!0}function Q(a,b,d,e){if(m.acceptData(a)){var f,g,h=m.expando,i=a.nodeType,j=i?m.cache:a,k=i?a[h]:a[h]&&h;if(k&&j[k]&&(e||j[k].data)||void 0!==d||"string"!=typeof b)return k||(k=i?a[h]=c.pop()||m.guid++:h),j[k]||(j[k]=i?{}:{toJSON:m.noop}),("object"==typeof b||"function"==typeof b)&&(e?j[k]=m.extend(j[k],b):j[k].data=m.extend(j[k].data,b)),g=j[k],e||(g.data||(g.data={}),g=g.data),void 0!==d&&(g[m.camelCase(b)]=d),"string"==typeof b?(f=g[b],null==f&&(f=g[m.camelCase(b)])):f=g,f}}function R(a,b,c){if(m.acceptData(a)){var d,e,f=a.nodeType,g=f?m.cache:a,h=f?a[m.expando]:m.expando;if(g[h]){if(b&&(d=c?g[h]:g[h].data)){m.isArray(b)?b=b.concat(m.map(b,m.camelCase)):b in d?b=[b]:(b=m.camelCase(b),b=b in d?[b]:b.split(" ")),e=b.length;while(e--)delete d[b[e]];if(c?!P(d):!m.isEmptyObject(d))return}(c||(delete g[h].data,P(g[h])))&&(f?m.cleanData([a],!0):k.deleteExpando||g!=g.window?delete g[h]:g[h]=null)}}}m.extend({cache:{},noData:{"applet ":!0,"embed ":!0,"object ":"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(a){return a=a.nodeType?m.cache[a[m.expando]]:a[m.expando],!!a&&!P(a)},data:function(a,b,c){return Q(a,b,c)},removeData:function(a,b){return R(a,b)},_data:function(a,b,c){return Q(a,b,c,!0)},_removeData:function(a,b){return R(a,b,!0)}}),m.fn.extend({data:function(a,b){var c,d,e,f=this[0],g=f&&f.attributes;if(void 0===a){if(this.length&&(e=m.data(f),1===f.nodeType&&!m._data(f,"parsedAttrs"))){c=g.length;while(c--)g[c]&&(d=g[c].name,0===d.indexOf("data-")&&(d=m.camelCase(d.slice(5)),O(f,d,e[d])));m._data(f,"parsedAttrs",!0)}return e}return"object"==typeof a?this.each(function(){m.data(this,a)}):arguments.length>1?this.each(function(){m.data(this,a,b)}):f?O(f,a,m.data(f,a)):void 0},removeData:function(a){return this.each(function(){m.removeData(this,a)})}}),m.extend({queue:function(a,b,c){var d;return a?(b=(b||"fx")+"queue",d=m._data(a,b),c&&(!d||m.isArray(c)?d=m._data(a,b,m.makeArray(c)):d.push(c)),d||[]):void 0},dequeue:function(a,b){b=b||"fx";var c=m.queue(a,b),d=c.length,e=c.shift(),f=m._queueHooks(a,b),g=function(){m.dequeue(a,b)};"inprogress"===e&&(e=c.shift(),d--),e&&("fx"===b&&c.unshift("inprogress"),delete f.stop,e.call(a,g,f)),!d&&f&&f.empty.fire()},_queueHooks:function(a,b){var c=b+"queueHooks";return m._data(a,c)||m._data(a,c,{empty:m.Callbacks("once memory").add(function(){m._removeData(a,b+"queue"),m._removeData(a,c)})})}}),m.fn.extend({queue:function(a,b){var c=2;return"string"!=typeof a&&(b=a,a="fx",c--),arguments.length<c?m.queue(this[0],a):void 0===b?this:this.each(function(){var c=m.queue(this,a,b);m._queueHooks(this,a),"fx"===a&&"inprogress"!==c[0]&&m.dequeue(this,a)})},dequeue:function(a){return this.each(function(){m.dequeue(this,a)})},clearQueue:function(a){return this.queue(a||"fx",[])},promise:function(a,b){var c,d=1,e=m.Deferred(),f=this,g=this.length,h=function(){--d||e.resolveWith(f,[f])};"string"!=typeof a&&(b=a,a=void 0),a=a||"fx";while(g--)c=m._data(f[g],a+"queueHooks"),c&&c.empty&&(d++,c.empty.add(h));return h(),e.promise(b)}});var S=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=["Top","Right","Bottom","Left"],U=function(a,b){return a=b||a,"none"===m.css(a,"display")||!m.contains(a.ownerDocument,a)},V=m.access=function(a,b,c,d,e,f,g){var h=0,i=a.length,j=null==c;if("object"===m.type(c)){e=!0;for(h in c)m.access(a,b,h,c[h],!0,f,g)}else if(void 0!==d&&(e=!0,m.isFunction(d)||(g=!0),j&&(g?(b.call(a,d),b=null):(j=b,b=function(a,b,c){return j.call(m(a),c)})),b))for(;i>h;h++)b(a[h],c,g?d:d.call(a[h],h,b(a[h],c)));return e?a:j?b.call(a):i?b(a[0],c):f},W=/^(?:checkbox|radio)$/i;!function(){var a=y.createElement("input"),b=y.createElement("div"),c=y.createDocumentFragment();if(b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",k.leadingWhitespace=3===b.firstChild.nodeType,k.tbody=!b.getElementsByTagName("tbody").length,k.htmlSerialize=!!b.getElementsByTagName("link").length,k.html5Clone="<:nav></:nav>"!==y.createElement("nav").cloneNode(!0).outerHTML,a.type="checkbox",a.checked=!0,c.appendChild(a),k.appendChecked=a.checked,b.innerHTML="<textarea>x</textarea>",k.noCloneChecked=!!b.cloneNode(!0).lastChild.defaultValue,c.appendChild(b),b.innerHTML="<input type='radio' checked='checked' name='t'/>",k.checkClone=b.cloneNode(!0).cloneNode(!0).lastChild.checked,k.noCloneEvent=!0,b.attachEvent&&(b.attachEvent("onclick",function(){k.noCloneEvent=!1}),b.cloneNode(!0).click()),null==k.deleteExpando){k.deleteExpando=!0;try{delete b.test}catch(d){k.deleteExpando=!1}}}(),function(){var b,c,d=y.createElement("div");for(b in{submit:!0,change:!0,focusin:!0})c="on"+b,(k[b+"Bubbles"]=c in a)||(d.setAttribute(c,"t"),k[b+"Bubbles"]=d.attributes[c].expando===!1);d=null}();var X=/^(?:input|select|textarea)$/i,Y=/^key/,Z=/^(?:mouse|pointer|contextmenu)|click/,$=/^(?:focusinfocus|focusoutblur)$/,_=/^([^.]*)(?:\.(.+)|)$/;function aa(){return!0}function ba(){return!1}function ca(){try{return y.activeElement}catch(a){}}m.event={global:{},add:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m._data(a);if(r){c.handler&&(i=c,c=i.handler,e=i.selector),c.guid||(c.guid=m.guid++),(g=r.events)||(g=r.events={}),(k=r.handle)||(k=r.handle=function(a){return typeof m===K||a&&m.event.triggered===a.type?void 0:m.event.dispatch.apply(k.elem,arguments)},k.elem=a),b=(b||"").match(E)||[""],h=b.length;while(h--)f=_.exec(b[h])||[],o=q=f[1],p=(f[2]||"").split(".").sort(),o&&(j=m.event.special[o]||{},o=(e?j.delegateType:j.bindType)||o,j=m.event.special[o]||{},l=m.extend({type:o,origType:q,data:d,handler:c,guid:c.guid,selector:e,needsContext:e&&m.expr.match.needsContext.test(e),namespace:p.join(".")},i),(n=g[o])||(n=g[o]=[],n.delegateCount=0,j.setup&&j.setup.call(a,d,p,k)!==!1||(a.addEventListener?a.addEventListener(o,k,!1):a.attachEvent&&a.attachEvent("on"+o,k))),j.add&&(j.add.call(a,l),l.handler.guid||(l.handler.guid=c.guid)),e?n.splice(n.delegateCount++,0,l):n.push(l),m.event.global[o]=!0);a=null}},remove:function(a,b,c,d,e){var f,g,h,i,j,k,l,n,o,p,q,r=m.hasData(a)&&m._data(a);if(r&&(k=r.events)){b=(b||"").match(E)||[""],j=b.length;while(j--)if(h=_.exec(b[j])||[],o=q=h[1],p=(h[2]||"").split(".").sort(),o){l=m.event.special[o]||{},o=(d?l.delegateType:l.bindType)||o,n=k[o]||[],h=h[2]&&new RegExp("(^|\\.)"+p.join("\\.(?:.*\\.|)")+"(\\.|$)"),i=f=n.length;while(f--)g=n[f],!e&&q!==g.origType||c&&c.guid!==g.guid||h&&!h.test(g.namespace)||d&&d!==g.selector&&("**"!==d||!g.selector)||(n.splice(f,1),g.selector&&n.delegateCount--,l.remove&&l.remove.call(a,g));i&&!n.length&&(l.teardown&&l.teardown.call(a,p,r.handle)!==!1||m.removeEvent(a,o,r.handle),delete k[o])}else for(o in k)m.event.remove(a,o+b[j],c,d,!0);m.isEmptyObject(k)&&(delete r.handle,m._removeData(a,"events"))}},trigger:function(b,c,d,e){var f,g,h,i,k,l,n,o=[d||y],p=j.call(b,"type")?b.type:b,q=j.call(b,"namespace")?b.namespace.split("."):[];if(h=l=d=d||y,3!==d.nodeType&&8!==d.nodeType&&!$.test(p+m.event.triggered)&&(p.indexOf(".")>=0&&(q=p.split("."),p=q.shift(),q.sort()),g=p.indexOf(":")<0&&"on"+p,b=b[m.expando]?b:new m.Event(p,"object"==typeof b&&b),b.isTrigger=e?2:3,b.namespace=q.join("."),b.namespace_re=b.namespace?new RegExp("(^|\\.)"+q.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,b.result=void 0,b.target||(b.target=d),c=null==c?[b]:m.makeArray(c,[b]),k=m.event.special[p]||{},e||!k.trigger||k.trigger.apply(d,c)!==!1)){if(!e&&!k.noBubble&&!m.isWindow(d)){for(i=k.delegateType||p,$.test(i+p)||(h=h.parentNode);h;h=h.parentNode)o.push(h),l=h;l===(d.ownerDocument||y)&&o.push(l.defaultView||l.parentWindow||a)}n=0;while((h=o[n++])&&!b.isPropagationStopped())b.type=n>1?i:k.bindType||p,f=(m._data(h,"events")||{})[b.type]&&m._data(h,"handle"),f&&f.apply(h,c),f=g&&h[g],f&&f.apply&&m.acceptData(h)&&(b.result=f.apply(h,c),b.result===!1&&b.preventDefault());if(b.type=p,!e&&!b.isDefaultPrevented()&&(!k._default||k._default.apply(o.pop(),c)===!1)&&m.acceptData(d)&&g&&d[p]&&!m.isWindow(d)){l=d[g],l&&(d[g]=null),m.event.triggered=p;try{d[p]()}catch(r){}m.event.triggered=void 0,l&&(d[g]=l)}return b.result}},dispatch:function(a){a=m.event.fix(a);var b,c,e,f,g,h=[],i=d.call(arguments),j=(m._data(this,"events")||{})[a.type]||[],k=m.event.special[a.type]||{};if(i[0]=a,a.delegateTarget=this,!k.preDispatch||k.preDispatch.call(this,a)!==!1){h=m.event.handlers.call(this,a,j),b=0;while((f=h[b++])&&!a.isPropagationStopped()){a.currentTarget=f.elem,g=0;while((e=f.handlers[g++])&&!a.isImmediatePropagationStopped())(!a.namespace_re||a.namespace_re.test(e.namespace))&&(a.handleObj=e,a.data=e.data,c=((m.event.special[e.origType]||{}).handle||e.handler).apply(f.elem,i),void 0!==c&&(a.result=c)===!1&&(a.preventDefault(),a.stopPropagation()))}return k.postDispatch&&k.postDispatch.call(this,a),a.result}},handlers:function(a,b){var c,d,e,f,g=[],h=b.delegateCount,i=a.target;if(h&&i.nodeType&&(!a.button||"click"!==a.type))for(;i!=this;i=i.parentNode||this)if(1===i.nodeType&&(i.disabled!==!0||"click"!==a.type)){for(e=[],f=0;h>f;f++)d=b[f],c=d.selector+" ",void 0===e[c]&&(e[c]=d.needsContext?m(c,this).index(i)>=0:m.find(c,this,null,[i]).length),e[c]&&e.push(d);e.length&&g.push({elem:i,handlers:e})}return h<b.length&&g.push({elem:this,handlers:b.slice(h)}),g},fix:function(a){if(a[m.expando])return a;var b,c,d,e=a.type,f=a,g=this.fixHooks[e];g||(this.fixHooks[e]=g=Z.test(e)?this.mouseHooks:Y.test(e)?this.keyHooks:{}),d=g.props?this.props.concat(g.props):this.props,a=new m.Event(f),b=d.length;while(b--)c=d[b],a[c]=f[c];return a.target||(a.target=f.srcElement||y),3===a.target.nodeType&&(a.target=a.target.parentNode),a.metaKey=!!a.metaKey,g.filter?g.filter(a,f):a},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(a,b){return null==a.which&&(a.which=null!=b.charCode?b.charCode:b.keyCode),a}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(a,b){var c,d,e,f=b.button,g=b.fromElement;return null==a.pageX&&null!=b.clientX&&(d=a.target.ownerDocument||y,e=d.documentElement,c=d.body,a.pageX=b.clientX+(e&&e.scrollLeft||c&&c.scrollLeft||0)-(e&&e.clientLeft||c&&c.clientLeft||0),a.pageY=b.clientY+(e&&e.scrollTop||c&&c.scrollTop||0)-(e&&e.clientTop||c&&c.clientTop||0)),!a.relatedTarget&&g&&(a.relatedTarget=g===a.target?b.toElement:g),a.which||void 0===f||(a.which=1&f?1:2&f?3:4&f?2:0),a}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==ca()&&this.focus)try{return this.focus(),!1}catch(a){}},delegateType:"focusin"},blur:{trigger:function(){return this===ca()&&this.blur?(this.blur(),!1):void 0},delegateType:"focusout"},click:{trigger:function(){return m.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):void 0},_default:function(a){return m.nodeName(a.target,"a")}},beforeunload:{postDispatch:function(a){void 0!==a.result&&a.originalEvent&&(a.originalEvent.returnValue=a.result)}}},simulate:function(a,b,c,d){var e=m.extend(new m.Event,c,{type:a,isSimulated:!0,originalEvent:{}});d?m.event.trigger(e,null,b):m.event.dispatch.call(b,e),e.isDefaultPrevented()&&c.preventDefault()}},m.removeEvent=y.removeEventListener?function(a,b,c){a.removeEventListener&&a.removeEventListener(b,c,!1)}:function(a,b,c){var d="on"+b;a.detachEvent&&(typeof a[d]===K&&(a[d]=null),a.detachEvent(d,c))},m.Event=function(a,b){return this instanceof m.Event?(a&&a.type?(this.originalEvent=a,this.type=a.type,this.isDefaultPrevented=a.defaultPrevented||void 0===a.defaultPrevented&&a.returnValue===!1?aa:ba):this.type=a,b&&m.extend(this,b),this.timeStamp=a&&a.timeStamp||m.now(),void(this[m.expando]=!0)):new m.Event(a,b)},m.Event.prototype={isDefaultPrevented:ba,isPropagationStopped:ba,isImmediatePropagationStopped:ba,preventDefault:function(){var a=this.originalEvent;this.isDefaultPrevented=aa,a&&(a.preventDefault?a.preventDefault():a.returnValue=!1)},stopPropagation:function(){var a=this.originalEvent;this.isPropagationStopped=aa,a&&(a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)},stopImmediatePropagation:function(){var a=this.originalEvent;this.isImmediatePropagationStopped=aa,a&&a.stopImmediatePropagation&&a.stopImmediatePropagation(),this.stopPropagation()}},m.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(a,b){m.event.special[a]={delegateType:b,bindType:b,handle:function(a){var c,d=this,e=a.relatedTarget,f=a.handleObj;return(!e||e!==d&&!m.contains(d,e))&&(a.type=f.origType,c=f.handler.apply(this,arguments),a.type=b),c}}}),k.submitBubbles||(m.event.special.submit={setup:function(){return m.nodeName(this,"form")?!1:void m.event.add(this,"click._submit keypress._submit",function(a){var b=a.target,c=m.nodeName(b,"input")||m.nodeName(b,"button")?b.form:void 0;c&&!m._data(c,"submitBubbles")&&(m.event.add(c,"submit._submit",function(a){a._submit_bubble=!0}),m._data(c,"submitBubbles",!0))})},postDispatch:function(a){a._submit_bubble&&(delete a._submit_bubble,this.parentNode&&!a.isTrigger&&m.event.simulate("submit",this.parentNode,a,!0))},teardown:function(){return m.nodeName(this,"form")?!1:void m.event.remove(this,"._submit")}}),k.changeBubbles||(m.event.special.change={setup:function(){return X.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(m.event.add(this,"propertychange._change",function(a){"checked"===a.originalEvent.propertyName&&(this._just_changed=!0)}),m.event.add(this,"click._change",function(a){this._just_changed&&!a.isTrigger&&(this._just_changed=!1),m.event.simulate("change",this,a,!0)})),!1):void m.event.add(this,"beforeactivate._change",function(a){var b=a.target;X.test(b.nodeName)&&!m._data(b,"changeBubbles")&&(m.event.add(b,"change._change",function(a){!this.parentNode||a.isSimulated||a.isTrigger||m.event.simulate("change",this.parentNode,a,!0)}),m._data(b,"changeBubbles",!0))})},handle:function(a){var b=a.target;return this!==b||a.isSimulated||a.isTrigger||"radio"!==b.type&&"checkbox"!==b.type?a.handleObj.handler.apply(this,arguments):void 0},teardown:function(){return m.event.remove(this,"._change"),!X.test(this.nodeName)}}),k.focusinBubbles||m.each({focus:"focusin",blur:"focusout"},function(a,b){var c=function(a){m.event.simulate(b,a.target,m.event.fix(a),!0)};m.event.special[b]={setup:function(){var d=this.ownerDocument||this,e=m._data(d,b);e||d.addEventListener(a,c,!0),m._data(d,b,(e||0)+1)},teardown:function(){var d=this.ownerDocument||this,e=m._data(d,b)-1;e?m._data(d,b,e):(d.removeEventListener(a,c,!0),m._removeData(d,b))}}}),m.fn.extend({on:function(a,b,c,d,e){var f,g;if("object"==typeof a){"string"!=typeof b&&(c=c||b,b=void 0);for(f in a)this.on(f,b,c,a[f],e);return this}if(null==c&&null==d?(d=b,c=b=void 0):null==d&&("string"==typeof b?(d=c,c=void 0):(d=c,c=b,b=void 0)),d===!1)d=ba;else if(!d)return this;return 1===e&&(g=d,d=function(a){return m().off(a),g.apply(this,arguments)},d.guid=g.guid||(g.guid=m.guid++)),this.each(function(){m.event.add(this,a,d,c,b)})},one:function(a,b,c,d){return this.on(a,b,c,d,1)},off:function(a,b,c){var d,e;if(a&&a.preventDefault&&a.handleObj)return d=a.handleObj,m(a.delegateTarget).off(d.namespace?d.origType+"."+d.namespace:d.origType,d.selector,d.handler),this;if("object"==typeof a){for(e in a)this.off(e,b,a[e]);return this}return(b===!1||"function"==typeof b)&&(c=b,b=void 0),c===!1&&(c=ba),this.each(function(){m.event.remove(this,a,c,b)})},trigger:function(a,b){return this.each(function(){m.event.trigger(a,b,this)})},triggerHandler:function(a,b){var c=this[0];return c?m.event.trigger(a,b,c,!0):void 0}});function da(a){var b=ea.split("|"),c=a.createDocumentFragment();if(c.createElement)while(b.length)c.createElement(b.pop());return c}var ea="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",fa=/ jQuery\d+="(?:null|\d+)"/g,ga=new RegExp("<(?:"+ea+")[\\s/>]","i"),ha=/^\s+/,ia=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,ja=/<([\w:]+)/,ka=/<tbody/i,la=/<|&#?\w+;/,ma=/<(?:script|style|link)/i,na=/checked\s*(?:[^=]|=\s*.checked.)/i,oa=/^$|\/(?:java|ecma)script/i,pa=/^true\/(.*)/,qa=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,ra={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:k.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},sa=da(y),ta=sa.appendChild(y.createElement("div"));ra.optgroup=ra.option,ra.tbody=ra.tfoot=ra.colgroup=ra.caption=ra.thead,ra.th=ra.td;function ua(a,b){var c,d,e=0,f=typeof a.getElementsByTagName!==K?a.getElementsByTagName(b||"*"):typeof a.querySelectorAll!==K?a.querySelectorAll(b||"*"):void 0;if(!f)for(f=[],c=a.childNodes||a;null!=(d=c[e]);e++)!b||m.nodeName(d,b)?f.push(d):m.merge(f,ua(d,b));return void 0===b||b&&m.nodeName(a,b)?m.merge([a],f):f}function va(a){W.test(a.type)&&(a.defaultChecked=a.checked)}function wa(a,b){return m.nodeName(a,"table")&&m.nodeName(11!==b.nodeType?b:b.firstChild,"tr")?a.getElementsByTagName("tbody")[0]||a.appendChild(a.ownerDocument.createElement("tbody")):a}function xa(a){return a.type=(null!==m.find.attr(a,"type"))+"/"+a.type,a}function ya(a){var b=pa.exec(a.type);return b?a.type=b[1]:a.removeAttribute("type"),a}function za(a,b){for(var c,d=0;null!=(c=a[d]);d++)m._data(c,"globalEval",!b||m._data(b[d],"globalEval"))}function Aa(a,b){if(1===b.nodeType&&m.hasData(a)){var c,d,e,f=m._data(a),g=m._data(b,f),h=f.events;if(h){delete g.handle,g.events={};for(c in h)for(d=0,e=h[c].length;e>d;d++)m.event.add(b,c,h[c][d])}g.data&&(g.data=m.extend({},g.data))}}function Ba(a,b){var c,d,e;if(1===b.nodeType){if(c=b.nodeName.toLowerCase(),!k.noCloneEvent&&b[m.expando]){e=m._data(b);for(d in e.events)m.removeEvent(b,d,e.handle);b.removeAttribute(m.expando)}"script"===c&&b.text!==a.text?(xa(b).text=a.text,ya(b)):"object"===c?(b.parentNode&&(b.outerHTML=a.outerHTML),k.html5Clone&&a.innerHTML&&!m.trim(b.innerHTML)&&(b.innerHTML=a.innerHTML)):"input"===c&&W.test(a.type)?(b.defaultChecked=b.checked=a.checked,b.value!==a.value&&(b.value=a.value)):"option"===c?b.defaultSelected=b.selected=a.defaultSelected:("input"===c||"textarea"===c)&&(b.defaultValue=a.defaultValue)}}m.extend({clone:function(a,b,c){var d,e,f,g,h,i=m.contains(a.ownerDocument,a);if(k.html5Clone||m.isXMLDoc(a)||!ga.test("<"+a.nodeName+">")?f=a.cloneNode(!0):(ta.innerHTML=a.outerHTML,ta.removeChild(f=ta.firstChild)),!(k.noCloneEvent&&k.noCloneChecked||1!==a.nodeType&&11!==a.nodeType||m.isXMLDoc(a)))for(d=ua(f),h=ua(a),g=0;null!=(e=h[g]);++g)d[g]&&Ba(e,d[g]);if(b)if(c)for(h=h||ua(a),d=d||ua(f),g=0;null!=(e=h[g]);g++)Aa(e,d[g]);else Aa(a,f);return d=ua(f,"script"),d.length>0&&za(d,!i&&ua(a,"script")),d=h=e=null,f},buildFragment:function(a,b,c,d){for(var e,f,g,h,i,j,l,n=a.length,o=da(b),p=[],q=0;n>q;q++)if(f=a[q],f||0===f)if("object"===m.type(f))m.merge(p,f.nodeType?[f]:f);else if(la.test(f)){h=h||o.appendChild(b.createElement("div")),i=(ja.exec(f)||["",""])[1].toLowerCase(),l=ra[i]||ra._default,h.innerHTML=l[1]+f.replace(ia,"<$1></$2>")+l[2],e=l[0];while(e--)h=h.lastChild;if(!k.leadingWhitespace&&ha.test(f)&&p.push(b.createTextNode(ha.exec(f)[0])),!k.tbody){f="table"!==i||ka.test(f)?"<table>"!==l[1]||ka.test(f)?0:h:h.firstChild,e=f&&f.childNodes.length;while(e--)m.nodeName(j=f.childNodes[e],"tbody")&&!j.childNodes.length&&f.removeChild(j)}m.merge(p,h.childNodes),h.textContent="";while(h.firstChild)h.removeChild(h.firstChild);h=o.lastChild}else p.push(b.createTextNode(f));h&&o.removeChild(h),k.appendChecked||m.grep(ua(p,"input"),va),q=0;while(f=p[q++])if((!d||-1===m.inArray(f,d))&&(g=m.contains(f.ownerDocument,f),h=ua(o.appendChild(f),"script"),g&&za(h),c)){e=0;while(f=h[e++])oa.test(f.type||"")&&c.push(f)}return h=null,o},cleanData:function(a,b){for(var d,e,f,g,h=0,i=m.expando,j=m.cache,l=k.deleteExpando,n=m.event.special;null!=(d=a[h]);h++)if((b||m.acceptData(d))&&(f=d[i],g=f&&j[f])){if(g.events)for(e in g.events)n[e]?m.event.remove(d,e):m.removeEvent(d,e,g.handle);j[f]&&(delete j[f],l?delete d[i]:typeof d.removeAttribute!==K?d.removeAttribute(i):d[i]=null,c.push(f))}}}),m.fn.extend({text:function(a){return V(this,function(a){return void 0===a?m.text(this):this.empty().append((this[0]&&this[0].ownerDocument||y).createTextNode(a))},null,a,arguments.length)},append:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wa(this,a);b.appendChild(a)}})},prepend:function(){return this.domManip(arguments,function(a){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var b=wa(this,a);b.insertBefore(a,b.firstChild)}})},before:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this)})},after:function(){return this.domManip(arguments,function(a){this.parentNode&&this.parentNode.insertBefore(a,this.nextSibling)})},remove:function(a,b){for(var c,d=a?m.filter(a,this):this,e=0;null!=(c=d[e]);e++)b||1!==c.nodeType||m.cleanData(ua(c)),c.parentNode&&(b&&m.contains(c.ownerDocument,c)&&za(ua(c,"script")),c.parentNode.removeChild(c));return this},empty:function(){for(var a,b=0;null!=(a=this[b]);b++){1===a.nodeType&&m.cleanData(ua(a,!1));while(a.firstChild)a.removeChild(a.firstChild);a.options&&m.nodeName(a,"select")&&(a.options.length=0)}return this},clone:function(a,b){return a=null==a?!1:a,b=null==b?a:b,this.map(function(){return m.clone(this,a,b)})},html:function(a){return V(this,function(a){var b=this[0]||{},c=0,d=this.length;if(void 0===a)return 1===b.nodeType?b.innerHTML.replace(fa,""):void 0;if(!("string"!=typeof a||ma.test(a)||!k.htmlSerialize&&ga.test(a)||!k.leadingWhitespace&&ha.test(a)||ra[(ja.exec(a)||["",""])[1].toLowerCase()])){a=a.replace(ia,"<$1></$2>");try{for(;d>c;c++)b=this[c]||{},1===b.nodeType&&(m.cleanData(ua(b,!1)),b.innerHTML=a);b=0}catch(e){}}b&&this.empty().append(a)},null,a,arguments.length)},replaceWith:function(){var a=arguments[0];return this.domManip(arguments,function(b){a=this.parentNode,m.cleanData(ua(this)),a&&a.replaceChild(b,this)}),a&&(a.length||a.nodeType)?this:this.remove()},detach:function(a){return this.remove(a,!0)},domManip:function(a,b){a=e.apply([],a);var c,d,f,g,h,i,j=0,l=this.length,n=this,o=l-1,p=a[0],q=m.isFunction(p);if(q||l>1&&"string"==typeof p&&!k.checkClone&&na.test(p))return this.each(function(c){var d=n.eq(c);q&&(a[0]=p.call(this,c,d.html())),d.domManip(a,b)});if(l&&(i=m.buildFragment(a,this[0].ownerDocument,!1,this),c=i.firstChild,1===i.childNodes.length&&(i=c),c)){for(g=m.map(ua(i,"script"),xa),f=g.length;l>j;j++)d=i,j!==o&&(d=m.clone(d,!0,!0),f&&m.merge(g,ua(d,"script"))),b.call(this[j],d,j);if(f)for(h=g[g.length-1].ownerDocument,m.map(g,ya),j=0;f>j;j++)d=g[j],oa.test(d.type||"")&&!m._data(d,"globalEval")&&m.contains(h,d)&&(d.src?m._evalUrl&&m._evalUrl(d.src):m.globalEval((d.text||d.textContent||d.innerHTML||"").replace(qa,"")));i=c=null}return this}}),m.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(a,b){m.fn[a]=function(a){for(var c,d=0,e=[],g=m(a),h=g.length-1;h>=d;d++)c=d===h?this:this.clone(!0),m(g[d])[b](c),f.apply(e,c.get());return this.pushStack(e)}});var Ca,Da={};function Ea(b,c){var d,e=m(c.createElement(b)).appendTo(c.body),f=a.getDefaultComputedStyle&&(d=a.getDefaultComputedStyle(e[0]))?d.display:m.css(e[0],"display");return e.detach(),f}function Fa(a){var b=y,c=Da[a];return c||(c=Ea(a,b),"none"!==c&&c||(Ca=(Ca||m("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement),b=(Ca[0].contentWindow||Ca[0].contentDocument).document,b.write(),b.close(),c=Ea(a,b),Ca.detach()),Da[a]=c),c}!function(){var a;k.shrinkWrapBlocks=function(){if(null!=a)return a;a=!1;var b,c,d;return c=y.getElementsByTagName("body")[0],c&&c.style?(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),typeof b.style.zoom!==K&&(b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:1px;width:1px;zoom:1",b.appendChild(y.createElement("div")).style.width="5px",a=3!==b.offsetWidth),c.removeChild(d),a):void 0}}();var Ga=/^margin/,Ha=new RegExp("^("+S+")(?!px)[a-z%]+$","i"),Ia,Ja,Ka=/^(top|right|bottom|left)$/;a.getComputedStyle?(Ia=function(b){return b.ownerDocument.defaultView.opener?b.ownerDocument.defaultView.getComputedStyle(b,null):a.getComputedStyle(b,null)},Ja=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ia(a),g=c?c.getPropertyValue(b)||c[b]:void 0,c&&(""!==g||m.contains(a.ownerDocument,a)||(g=m.style(a,b)),Ha.test(g)&&Ga.test(b)&&(d=h.width,e=h.minWidth,f=h.maxWidth,h.minWidth=h.maxWidth=h.width=g,g=c.width,h.width=d,h.minWidth=e,h.maxWidth=f)),void 0===g?g:g+""}):y.documentElement.currentStyle&&(Ia=function(a){return a.currentStyle},Ja=function(a,b,c){var d,e,f,g,h=a.style;return c=c||Ia(a),g=c?c[b]:void 0,null==g&&h&&h[b]&&(g=h[b]),Ha.test(g)&&!Ka.test(b)&&(d=h.left,e=a.runtimeStyle,f=e&&e.left,f&&(e.left=a.currentStyle.left),h.left="fontSize"===b?"1em":g,g=h.pixelLeft+"px",h.left=d,f&&(e.left=f)),void 0===g?g:g+""||"auto"});function La(a,b){return{get:function(){var c=a();if(null!=c)return c?void delete this.get:(this.get=b).apply(this,arguments)}}}!function(){var b,c,d,e,f,g,h;if(b=y.createElement("div"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=d&&d.style){c.cssText="float:left;opacity:.5",k.opacity="0.5"===c.opacity,k.cssFloat=!!c.cssFloat,b.style.backgroundClip="content-box",b.cloneNode(!0).style.backgroundClip="",k.clearCloneStyle="content-box"===b.style.backgroundClip,k.boxSizing=""===c.boxSizing||""===c.MozBoxSizing||""===c.WebkitBoxSizing,m.extend(k,{reliableHiddenOffsets:function(){return null==g&&i(),g},boxSizingReliable:function(){return null==f&&i(),f},pixelPosition:function(){return null==e&&i(),e},reliableMarginRight:function(){return null==h&&i(),h}});function i(){var b,c,d,i;c=y.getElementsByTagName("body")[0],c&&c.style&&(b=y.createElement("div"),d=y.createElement("div"),d.style.cssText="position:absolute;border:0;width:0;height:0;top:0;left:-9999px",c.appendChild(d).appendChild(b),b.style.cssText="-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute",e=f=!1,h=!0,a.getComputedStyle&&(e="1%"!==(a.getComputedStyle(b,null)||{}).top,f="4px"===(a.getComputedStyle(b,null)||{width:"4px"}).width,i=b.appendChild(y.createElement("div")),i.style.cssText=b.style.cssText="-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0",i.style.marginRight=i.style.width="0",b.style.width="1px",h=!parseFloat((a.getComputedStyle(i,null)||{}).marginRight),b.removeChild(i)),b.innerHTML="<table><tr><td></td><td>t</td></tr></table>",i=b.getElementsByTagName("td"),i[0].style.cssText="margin:0;border:0;padding:0;display:none",g=0===i[0].offsetHeight,g&&(i[0].style.display="",i[1].style.display="none",g=0===i[0].offsetHeight),c.removeChild(d))}}}(),m.swap=function(a,b,c,d){var e,f,g={};for(f in b)g[f]=a.style[f],a.style[f]=b[f];e=c.apply(a,d||[]);for(f in b)a.style[f]=g[f];return e};var Ma=/alpha\([^)]*\)/i,Na=/opacity\s*=\s*([^)]*)/,Oa=/^(none|table(?!-c[ea]).+)/,Pa=new RegExp("^("+S+")(.*)$","i"),Qa=new RegExp("^([+-])=("+S+")","i"),Ra={position:"absolute",visibility:"hidden",display:"block"},Sa={letterSpacing:"0",fontWeight:"400"},Ta=["Webkit","O","Moz","ms"];function Ua(a,b){if(b in a)return b;var c=b.charAt(0).toUpperCase()+b.slice(1),d=b,e=Ta.length;while(e--)if(b=Ta[e]+c,b in a)return b;return d}function Va(a,b){for(var c,d,e,f=[],g=0,h=a.length;h>g;g++)d=a[g],d.style&&(f[g]=m._data(d,"olddisplay"),c=d.style.display,b?(f[g]||"none"!==c||(d.style.display=""),""===d.style.display&&U(d)&&(f[g]=m._data(d,"olddisplay",Fa(d.nodeName)))):(e=U(d),(c&&"none"!==c||!e)&&m._data(d,"olddisplay",e?c:m.css(d,"display"))));for(g=0;h>g;g++)d=a[g],d.style&&(b&&"none"!==d.style.display&&""!==d.style.display||(d.style.display=b?f[g]||"":"none"));return a}function Wa(a,b,c){var d=Pa.exec(b);return d?Math.max(0,d[1]-(c||0))+(d[2]||"px"):b}function Xa(a,b,c,d,e){for(var f=c===(d?"border":"content")?4:"width"===b?1:0,g=0;4>f;f+=2)"margin"===c&&(g+=m.css(a,c+T[f],!0,e)),d?("content"===c&&(g-=m.css(a,"padding"+T[f],!0,e)),"margin"!==c&&(g-=m.css(a,"border"+T[f]+"Width",!0,e))):(g+=m.css(a,"padding"+T[f],!0,e),"padding"!==c&&(g+=m.css(a,"border"+T[f]+"Width",!0,e)));return g}function Ya(a,b,c){var d=!0,e="width"===b?a.offsetWidth:a.offsetHeight,f=Ia(a),g=k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,f);if(0>=e||null==e){if(e=Ja(a,b,f),(0>e||null==e)&&(e=a.style[b]),Ha.test(e))return e;d=g&&(k.boxSizingReliable()||e===a.style[b]),e=parseFloat(e)||0}return e+Xa(a,b,c||(g?"border":"content"),d,f)+"px"}m.extend({cssHooks:{opacity:{get:function(a,b){if(b){var c=Ja(a,"opacity");return""===c?"1":c}}}},cssNumber:{columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":k.cssFloat?"cssFloat":"styleFloat"},style:function(a,b,c,d){if(a&&3!==a.nodeType&&8!==a.nodeType&&a.style){var e,f,g,h=m.camelCase(b),i=a.style;if(b=m.cssProps[h]||(m.cssProps[h]=Ua(i,h)),g=m.cssHooks[b]||m.cssHooks[h],void 0===c)return g&&"get"in g&&void 0!==(e=g.get(a,!1,d))?e:i[b];if(f=typeof c,"string"===f&&(e=Qa.exec(c))&&(c=(e[1]+1)*e[2]+parseFloat(m.css(a,b)),f="number"),null!=c&&c===c&&("number"!==f||m.cssNumber[h]||(c+="px"),k.clearCloneStyle||""!==c||0!==b.indexOf("background")||(i[b]="inherit"),!(g&&"set"in g&&void 0===(c=g.set(a,c,d)))))try{i[b]=c}catch(j){}}},css:function(a,b,c,d){var e,f,g,h=m.camelCase(b);return b=m.cssProps[h]||(m.cssProps[h]=Ua(a.style,h)),g=m.cssHooks[b]||m.cssHooks[h],g&&"get"in g&&(f=g.get(a,!0,c)),void 0===f&&(f=Ja(a,b,d)),"normal"===f&&b in Sa&&(f=Sa[b]),""===c||c?(e=parseFloat(f),c===!0||m.isNumeric(e)?e||0:f):f}}),m.each(["height","width"],function(a,b){m.cssHooks[b]={get:function(a,c,d){return c?Oa.test(m.css(a,"display"))&&0===a.offsetWidth?m.swap(a,Ra,function(){return Ya(a,b,d)}):Ya(a,b,d):void 0},set:function(a,c,d){var e=d&&Ia(a);return Wa(a,c,d?Xa(a,b,d,k.boxSizing&&"border-box"===m.css(a,"boxSizing",!1,e),e):0)}}}),k.opacity||(m.cssHooks.opacity={get:function(a,b){return Na.test((b&&a.currentStyle?a.currentStyle.filter:a.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":b?"1":""},set:function(a,b){var c=a.style,d=a.currentStyle,e=m.isNumeric(b)?"alpha(opacity="+100*b+")":"",f=d&&d.filter||c.filter||"";c.zoom=1,(b>=1||""===b)&&""===m.trim(f.replace(Ma,""))&&c.removeAttribute&&(c.removeAttribute("filter"),""===b||d&&!d.filter)||(c.filter=Ma.test(f)?f.replace(Ma,e):f+" "+e)}}),m.cssHooks.marginRight=La(k.reliableMarginRight,function(a,b){return b?m.swap(a,{display:"inline-block"},Ja,[a,"marginRight"]):void 0}),m.each({margin:"",padding:"",border:"Width"},function(a,b){m.cssHooks[a+b]={expand:function(c){for(var d=0,e={},f="string"==typeof c?c.split(" "):[c];4>d;d++)e[a+T[d]+b]=f[d]||f[d-2]||f[0];return e}},Ga.test(a)||(m.cssHooks[a+b].set=Wa)}),m.fn.extend({css:function(a,b){return V(this,function(a,b,c){var d,e,f={},g=0;if(m.isArray(b)){for(d=Ia(a),e=b.length;e>g;g++)f[b[g]]=m.css(a,b[g],!1,d);return f}return void 0!==c?m.style(a,b,c):m.css(a,b)},a,b,arguments.length>1)},show:function(){return Va(this,!0)},hide:function(){return Va(this)},toggle:function(a){return"boolean"==typeof a?a?this.show():this.hide():this.each(function(){U(this)?m(this).show():m(this).hide()})}});function Za(a,b,c,d,e){
return new Za.prototype.init(a,b,c,d,e)}m.Tween=Za,Za.prototype={constructor:Za,init:function(a,b,c,d,e,f){this.elem=a,this.prop=c,this.easing=e||"swing",this.options=b,this.start=this.now=this.cur(),this.end=d,this.unit=f||(m.cssNumber[c]?"":"px")},cur:function(){var a=Za.propHooks[this.prop];return a&&a.get?a.get(this):Za.propHooks._default.get(this)},run:function(a){var b,c=Za.propHooks[this.prop];return this.options.duration?this.pos=b=m.easing[this.easing](a,this.options.duration*a,0,1,this.options.duration):this.pos=b=a,this.now=(this.end-this.start)*b+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),c&&c.set?c.set(this):Za.propHooks._default.set(this),this}},Za.prototype.init.prototype=Za.prototype,Za.propHooks={_default:{get:function(a){var b;return null==a.elem[a.prop]||a.elem.style&&null!=a.elem.style[a.prop]?(b=m.css(a.elem,a.prop,""),b&&"auto"!==b?b:0):a.elem[a.prop]},set:function(a){m.fx.step[a.prop]?m.fx.step[a.prop](a):a.elem.style&&(null!=a.elem.style[m.cssProps[a.prop]]||m.cssHooks[a.prop])?m.style(a.elem,a.prop,a.now+a.unit):a.elem[a.prop]=a.now}}},Za.propHooks.scrollTop=Za.propHooks.scrollLeft={set:function(a){a.elem.nodeType&&a.elem.parentNode&&(a.elem[a.prop]=a.now)}},m.easing={linear:function(a){return a},swing:function(a){return.5-Math.cos(a*Math.PI)/2}},m.fx=Za.prototype.init,m.fx.step={};var $a,_a,ab=/^(?:toggle|show|hide)$/,bb=new RegExp("^(?:([+-])=|)("+S+")([a-z%]*)$","i"),cb=/queueHooks$/,db=[ib],eb={"*":[function(a,b){var c=this.createTween(a,b),d=c.cur(),e=bb.exec(b),f=e&&e[3]||(m.cssNumber[a]?"":"px"),g=(m.cssNumber[a]||"px"!==f&&+d)&&bb.exec(m.css(c.elem,a)),h=1,i=20;if(g&&g[3]!==f){f=f||g[3],e=e||[],g=+d||1;do h=h||".5",g/=h,m.style(c.elem,a,g+f);while(h!==(h=c.cur()/d)&&1!==h&&--i)}return e&&(g=c.start=+g||+d||0,c.unit=f,c.end=e[1]?g+(e[1]+1)*e[2]:+e[2]),c}]};function fb(){return setTimeout(function(){$a=void 0}),$a=m.now()}function gb(a,b){var c,d={height:a},e=0;for(b=b?1:0;4>e;e+=2-b)c=T[e],d["margin"+c]=d["padding"+c]=a;return b&&(d.opacity=d.width=a),d}function hb(a,b,c){for(var d,e=(eb[b]||[]).concat(eb["*"]),f=0,g=e.length;g>f;f++)if(d=e[f].call(c,b,a))return d}function ib(a,b,c){var d,e,f,g,h,i,j,l,n=this,o={},p=a.style,q=a.nodeType&&U(a),r=m._data(a,"fxshow");c.queue||(h=m._queueHooks(a,"fx"),null==h.unqueued&&(h.unqueued=0,i=h.empty.fire,h.empty.fire=function(){h.unqueued||i()}),h.unqueued++,n.always(function(){n.always(function(){h.unqueued--,m.queue(a,"fx").length||h.empty.fire()})})),1===a.nodeType&&("height"in b||"width"in b)&&(c.overflow=[p.overflow,p.overflowX,p.overflowY],j=m.css(a,"display"),l="none"===j?m._data(a,"olddisplay")||Fa(a.nodeName):j,"inline"===l&&"none"===m.css(a,"float")&&(k.inlineBlockNeedsLayout&&"inline"!==Fa(a.nodeName)?p.zoom=1:p.display="inline-block")),c.overflow&&(p.overflow="hidden",k.shrinkWrapBlocks()||n.always(function(){p.overflow=c.overflow[0],p.overflowX=c.overflow[1],p.overflowY=c.overflow[2]}));for(d in b)if(e=b[d],ab.exec(e)){if(delete b[d],f=f||"toggle"===e,e===(q?"hide":"show")){if("show"!==e||!r||void 0===r[d])continue;q=!0}o[d]=r&&r[d]||m.style(a,d)}else j=void 0;if(m.isEmptyObject(o))"inline"===("none"===j?Fa(a.nodeName):j)&&(p.display=j);else{r?"hidden"in r&&(q=r.hidden):r=m._data(a,"fxshow",{}),f&&(r.hidden=!q),q?m(a).show():n.done(function(){m(a).hide()}),n.done(function(){var b;m._removeData(a,"fxshow");for(b in o)m.style(a,b,o[b])});for(d in o)g=hb(q?r[d]:0,d,n),d in r||(r[d]=g.start,q&&(g.end=g.start,g.start="width"===d||"height"===d?1:0))}}function jb(a,b){var c,d,e,f,g;for(c in a)if(d=m.camelCase(c),e=b[d],f=a[c],m.isArray(f)&&(e=f[1],f=a[c]=f[0]),c!==d&&(a[d]=f,delete a[c]),g=m.cssHooks[d],g&&"expand"in g){f=g.expand(f),delete a[d];for(c in f)c in a||(a[c]=f[c],b[c]=e)}else b[d]=e}function kb(a,b,c){var d,e,f=0,g=db.length,h=m.Deferred().always(function(){delete i.elem}),i=function(){if(e)return!1;for(var b=$a||fb(),c=Math.max(0,j.startTime+j.duration-b),d=c/j.duration||0,f=1-d,g=0,i=j.tweens.length;i>g;g++)j.tweens[g].run(f);return h.notifyWith(a,[j,f,c]),1>f&&i?c:(h.resolveWith(a,[j]),!1)},j=h.promise({elem:a,props:m.extend({},b),opts:m.extend(!0,{specialEasing:{}},c),originalProperties:b,originalOptions:c,startTime:$a||fb(),duration:c.duration,tweens:[],createTween:function(b,c){var d=m.Tween(a,j.opts,b,c,j.opts.specialEasing[b]||j.opts.easing);return j.tweens.push(d),d},stop:function(b){var c=0,d=b?j.tweens.length:0;if(e)return this;for(e=!0;d>c;c++)j.tweens[c].run(1);return b?h.resolveWith(a,[j,b]):h.rejectWith(a,[j,b]),this}}),k=j.props;for(jb(k,j.opts.specialEasing);g>f;f++)if(d=db[f].call(j,a,k,j.opts))return d;return m.map(k,hb,j),m.isFunction(j.opts.start)&&j.opts.start.call(a,j),m.fx.timer(m.extend(i,{elem:a,anim:j,queue:j.opts.queue})),j.progress(j.opts.progress).done(j.opts.done,j.opts.complete).fail(j.opts.fail).always(j.opts.always)}m.Animation=m.extend(kb,{tweener:function(a,b){m.isFunction(a)?(b=a,a=["*"]):a=a.split(" ");for(var c,d=0,e=a.length;e>d;d++)c=a[d],eb[c]=eb[c]||[],eb[c].unshift(b)},prefilter:function(a,b){b?db.unshift(a):db.push(a)}}),m.speed=function(a,b,c){var d=a&&"object"==typeof a?m.extend({},a):{complete:c||!c&&b||m.isFunction(a)&&a,duration:a,easing:c&&b||b&&!m.isFunction(b)&&b};return d.duration=m.fx.off?0:"number"==typeof d.duration?d.duration:d.duration in m.fx.speeds?m.fx.speeds[d.duration]:m.fx.speeds._default,(null==d.queue||d.queue===!0)&&(d.queue="fx"),d.old=d.complete,d.complete=function(){m.isFunction(d.old)&&d.old.call(this),d.queue&&m.dequeue(this,d.queue)},d},m.fn.extend({fadeTo:function(a,b,c,d){return this.filter(U).css("opacity",0).show().end().animate({opacity:b},a,c,d)},animate:function(a,b,c,d){var e=m.isEmptyObject(a),f=m.speed(b,c,d),g=function(){var b=kb(this,m.extend({},a),f);(e||m._data(this,"finish"))&&b.stop(!0)};return g.finish=g,e||f.queue===!1?this.each(g):this.queue(f.queue,g)},stop:function(a,b,c){var d=function(a){var b=a.stop;delete a.stop,b(c)};return"string"!=typeof a&&(c=b,b=a,a=void 0),b&&a!==!1&&this.queue(a||"fx",[]),this.each(function(){var b=!0,e=null!=a&&a+"queueHooks",f=m.timers,g=m._data(this);if(e)g[e]&&g[e].stop&&d(g[e]);else for(e in g)g[e]&&g[e].stop&&cb.test(e)&&d(g[e]);for(e=f.length;e--;)f[e].elem!==this||null!=a&&f[e].queue!==a||(f[e].anim.stop(c),b=!1,f.splice(e,1));(b||!c)&&m.dequeue(this,a)})},finish:function(a){return a!==!1&&(a=a||"fx"),this.each(function(){var b,c=m._data(this),d=c[a+"queue"],e=c[a+"queueHooks"],f=m.timers,g=d?d.length:0;for(c.finish=!0,m.queue(this,a,[]),e&&e.stop&&e.stop.call(this,!0),b=f.length;b--;)f[b].elem===this&&f[b].queue===a&&(f[b].anim.stop(!0),f.splice(b,1));for(b=0;g>b;b++)d[b]&&d[b].finish&&d[b].finish.call(this);delete c.finish})}}),m.each(["toggle","show","hide"],function(a,b){var c=m.fn[b];m.fn[b]=function(a,d,e){return null==a||"boolean"==typeof a?c.apply(this,arguments):this.animate(gb(b,!0),a,d,e)}}),m.each({slideDown:gb("show"),slideUp:gb("hide"),slideToggle:gb("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(a,b){m.fn[a]=function(a,c,d){return this.animate(b,a,c,d)}}),m.timers=[],m.fx.tick=function(){var a,b=m.timers,c=0;for($a=m.now();c<b.length;c++)a=b[c],a()||b[c]!==a||b.splice(c--,1);b.length||m.fx.stop(),$a=void 0},m.fx.timer=function(a){m.timers.push(a),a()?m.fx.start():m.timers.pop()},m.fx.interval=13,m.fx.start=function(){_a||(_a=setInterval(m.fx.tick,m.fx.interval))},m.fx.stop=function(){clearInterval(_a),_a=null},m.fx.speeds={slow:600,fast:200,_default:400},m.fn.delay=function(a,b){return a=m.fx?m.fx.speeds[a]||a:a,b=b||"fx",this.queue(b,function(b,c){var d=setTimeout(b,a);c.stop=function(){clearTimeout(d)}})},function(){var a,b,c,d,e;b=y.createElement("div"),b.setAttribute("className","t"),b.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",d=b.getElementsByTagName("a")[0],c=y.createElement("select"),e=c.appendChild(y.createElement("option")),a=b.getElementsByTagName("input")[0],d.style.cssText="top:1px",k.getSetAttribute="t"!==b.className,k.style=/top/.test(d.getAttribute("style")),k.hrefNormalized="/a"===d.getAttribute("href"),k.checkOn=!!a.value,k.optSelected=e.selected,k.enctype=!!y.createElement("form").enctype,c.disabled=!0,k.optDisabled=!e.disabled,a=y.createElement("input"),a.setAttribute("value",""),k.input=""===a.getAttribute("value"),a.value="t",a.setAttribute("type","radio"),k.radioValue="t"===a.value}();var lb=/\r/g;m.fn.extend({val:function(a){var b,c,d,e=this[0];{if(arguments.length)return d=m.isFunction(a),this.each(function(c){var e;1===this.nodeType&&(e=d?a.call(this,c,m(this).val()):a,null==e?e="":"number"==typeof e?e+="":m.isArray(e)&&(e=m.map(e,function(a){return null==a?"":a+""})),b=m.valHooks[this.type]||m.valHooks[this.nodeName.toLowerCase()],b&&"set"in b&&void 0!==b.set(this,e,"value")||(this.value=e))});if(e)return b=m.valHooks[e.type]||m.valHooks[e.nodeName.toLowerCase()],b&&"get"in b&&void 0!==(c=b.get(e,"value"))?c:(c=e.value,"string"==typeof c?c.replace(lb,""):null==c?"":c)}}}),m.extend({valHooks:{option:{get:function(a){var b=m.find.attr(a,"value");return null!=b?b:m.trim(m.text(a))}},select:{get:function(a){for(var b,c,d=a.options,e=a.selectedIndex,f="select-one"===a.type||0>e,g=f?null:[],h=f?e+1:d.length,i=0>e?h:f?e:0;h>i;i++)if(c=d[i],!(!c.selected&&i!==e||(k.optDisabled?c.disabled:null!==c.getAttribute("disabled"))||c.parentNode.disabled&&m.nodeName(c.parentNode,"optgroup"))){if(b=m(c).val(),f)return b;g.push(b)}return g},set:function(a,b){var c,d,e=a.options,f=m.makeArray(b),g=e.length;while(g--)if(d=e[g],m.inArray(m.valHooks.option.get(d),f)>=0)try{d.selected=c=!0}catch(h){d.scrollHeight}else d.selected=!1;return c||(a.selectedIndex=-1),e}}}}),m.each(["radio","checkbox"],function(){m.valHooks[this]={set:function(a,b){return m.isArray(b)?a.checked=m.inArray(m(a).val(),b)>=0:void 0}},k.checkOn||(m.valHooks[this].get=function(a){return null===a.getAttribute("value")?"on":a.value})});var mb,nb,ob=m.expr.attrHandle,pb=/^(?:checked|selected)$/i,qb=k.getSetAttribute,rb=k.input;m.fn.extend({attr:function(a,b){return V(this,m.attr,a,b,arguments.length>1)},removeAttr:function(a){return this.each(function(){m.removeAttr(this,a)})}}),m.extend({attr:function(a,b,c){var d,e,f=a.nodeType;if(a&&3!==f&&8!==f&&2!==f)return typeof a.getAttribute===K?m.prop(a,b,c):(1===f&&m.isXMLDoc(a)||(b=b.toLowerCase(),d=m.attrHooks[b]||(m.expr.match.bool.test(b)?nb:mb)),void 0===c?d&&"get"in d&&null!==(e=d.get(a,b))?e:(e=m.find.attr(a,b),null==e?void 0:e):null!==c?d&&"set"in d&&void 0!==(e=d.set(a,c,b))?e:(a.setAttribute(b,c+""),c):void m.removeAttr(a,b))},removeAttr:function(a,b){var c,d,e=0,f=b&&b.match(E);if(f&&1===a.nodeType)while(c=f[e++])d=m.propFix[c]||c,m.expr.match.bool.test(c)?rb&&qb||!pb.test(c)?a[d]=!1:a[m.camelCase("default-"+c)]=a[d]=!1:m.attr(a,c,""),a.removeAttribute(qb?c:d)},attrHooks:{type:{set:function(a,b){if(!k.radioValue&&"radio"===b&&m.nodeName(a,"input")){var c=a.value;return a.setAttribute("type",b),c&&(a.value=c),b}}}}}),nb={set:function(a,b,c){return b===!1?m.removeAttr(a,c):rb&&qb||!pb.test(c)?a.setAttribute(!qb&&m.propFix[c]||c,c):a[m.camelCase("default-"+c)]=a[c]=!0,c}},m.each(m.expr.match.bool.source.match(/\w+/g),function(a,b){var c=ob[b]||m.find.attr;ob[b]=rb&&qb||!pb.test(b)?function(a,b,d){var e,f;return d||(f=ob[b],ob[b]=e,e=null!=c(a,b,d)?b.toLowerCase():null,ob[b]=f),e}:function(a,b,c){return c?void 0:a[m.camelCase("default-"+b)]?b.toLowerCase():null}}),rb&&qb||(m.attrHooks.value={set:function(a,b,c){return m.nodeName(a,"input")?void(a.defaultValue=b):mb&&mb.set(a,b,c)}}),qb||(mb={set:function(a,b,c){var d=a.getAttributeNode(c);return d||a.setAttributeNode(d=a.ownerDocument.createAttribute(c)),d.value=b+="","value"===c||b===a.getAttribute(c)?b:void 0}},ob.id=ob.name=ob.coords=function(a,b,c){var d;return c?void 0:(d=a.getAttributeNode(b))&&""!==d.value?d.value:null},m.valHooks.button={get:function(a,b){var c=a.getAttributeNode(b);return c&&c.specified?c.value:void 0},set:mb.set},m.attrHooks.contenteditable={set:function(a,b,c){mb.set(a,""===b?!1:b,c)}},m.each(["width","height"],function(a,b){m.attrHooks[b]={set:function(a,c){return""===c?(a.setAttribute(b,"auto"),c):void 0}}})),k.style||(m.attrHooks.style={get:function(a){return a.style.cssText||void 0},set:function(a,b){return a.style.cssText=b+""}});var sb=/^(?:input|select|textarea|button|object)$/i,tb=/^(?:a|area)$/i;m.fn.extend({prop:function(a,b){return V(this,m.prop,a,b,arguments.length>1)},removeProp:function(a){return a=m.propFix[a]||a,this.each(function(){try{this[a]=void 0,delete this[a]}catch(b){}})}}),m.extend({propFix:{"for":"htmlFor","class":"className"},prop:function(a,b,c){var d,e,f,g=a.nodeType;if(a&&3!==g&&8!==g&&2!==g)return f=1!==g||!m.isXMLDoc(a),f&&(b=m.propFix[b]||b,e=m.propHooks[b]),void 0!==c?e&&"set"in e&&void 0!==(d=e.set(a,c,b))?d:a[b]=c:e&&"get"in e&&null!==(d=e.get(a,b))?d:a[b]},propHooks:{tabIndex:{get:function(a){var b=m.find.attr(a,"tabindex");return b?parseInt(b,10):sb.test(a.nodeName)||tb.test(a.nodeName)&&a.href?0:-1}}}}),k.hrefNormalized||m.each(["href","src"],function(a,b){m.propHooks[b]={get:function(a){return a.getAttribute(b,4)}}}),k.optSelected||(m.propHooks.selected={get:function(a){var b=a.parentNode;return b&&(b.selectedIndex,b.parentNode&&b.parentNode.selectedIndex),null}}),m.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){m.propFix[this.toLowerCase()]=this}),k.enctype||(m.propFix.enctype="encoding");var ub=/[\t\r\n\f]/g;m.fn.extend({addClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j="string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).addClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ub," "):" ")){f=0;while(e=b[f++])d.indexOf(" "+e+" ")<0&&(d+=e+" ");g=m.trim(d),c.className!==g&&(c.className=g)}return this},removeClass:function(a){var b,c,d,e,f,g,h=0,i=this.length,j=0===arguments.length||"string"==typeof a&&a;if(m.isFunction(a))return this.each(function(b){m(this).removeClass(a.call(this,b,this.className))});if(j)for(b=(a||"").match(E)||[];i>h;h++)if(c=this[h],d=1===c.nodeType&&(c.className?(" "+c.className+" ").replace(ub," "):"")){f=0;while(e=b[f++])while(d.indexOf(" "+e+" ")>=0)d=d.replace(" "+e+" "," ");g=a?m.trim(d):"",c.className!==g&&(c.className=g)}return this},toggleClass:function(a,b){var c=typeof a;return"boolean"==typeof b&&"string"===c?b?this.addClass(a):this.removeClass(a):this.each(m.isFunction(a)?function(c){m(this).toggleClass(a.call(this,c,this.className,b),b)}:function(){if("string"===c){var b,d=0,e=m(this),f=a.match(E)||[];while(b=f[d++])e.hasClass(b)?e.removeClass(b):e.addClass(b)}else(c===K||"boolean"===c)&&(this.className&&m._data(this,"__className__",this.className),this.className=this.className||a===!1?"":m._data(this,"__className__")||"")})},hasClass:function(a){for(var b=" "+a+" ",c=0,d=this.length;d>c;c++)if(1===this[c].nodeType&&(" "+this[c].className+" ").replace(ub," ").indexOf(b)>=0)return!0;return!1}}),m.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(a,b){m.fn[b]=function(a,c){return arguments.length>0?this.on(b,null,a,c):this.trigger(b)}}),m.fn.extend({hover:function(a,b){return this.mouseenter(a).mouseleave(b||a)},bind:function(a,b,c){return this.on(a,null,b,c)},unbind:function(a,b){return this.off(a,null,b)},delegate:function(a,b,c,d){return this.on(b,a,c,d)},undelegate:function(a,b,c){return 1===arguments.length?this.off(a,"**"):this.off(b,a||"**",c)}});var vb=m.now(),wb=/\?/,xb=/(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;m.parseJSON=function(b){if(a.JSON&&a.JSON.parse)return a.JSON.parse(b+"");var c,d=null,e=m.trim(b+"");return e&&!m.trim(e.replace(xb,function(a,b,e,f){return c&&b&&(d=0),0===d?a:(c=e||b,d+=!f-!e,"")}))?Function("return "+e)():m.error("Invalid JSON: "+b)},m.parseXML=function(b){var c,d;if(!b||"string"!=typeof b)return null;try{a.DOMParser?(d=new DOMParser,c=d.parseFromString(b,"text/xml")):(c=new ActiveXObject("Microsoft.XMLDOM"),c.async="false",c.loadXML(b))}catch(e){c=void 0}return c&&c.documentElement&&!c.getElementsByTagName("parsererror").length||m.error("Invalid XML: "+b),c};var yb,zb,Ab=/#.*$/,Bb=/([?&])_=[^&]*/,Cb=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Db=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Eb=/^(?:GET|HEAD)$/,Fb=/^\/\//,Gb=/^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,Hb={},Ib={},Jb="*/".concat("*");try{zb=location.href}catch(Kb){zb=y.createElement("a"),zb.href="",zb=zb.href}yb=Gb.exec(zb.toLowerCase())||[];function Lb(a){return function(b,c){"string"!=typeof b&&(c=b,b="*");var d,e=0,f=b.toLowerCase().match(E)||[];if(m.isFunction(c))while(d=f[e++])"+"===d.charAt(0)?(d=d.slice(1)||"*",(a[d]=a[d]||[]).unshift(c)):(a[d]=a[d]||[]).push(c)}}function Mb(a,b,c,d){var e={},f=a===Ib;function g(h){var i;return e[h]=!0,m.each(a[h]||[],function(a,h){var j=h(b,c,d);return"string"!=typeof j||f||e[j]?f?!(i=j):void 0:(b.dataTypes.unshift(j),g(j),!1)}),i}return g(b.dataTypes[0])||!e["*"]&&g("*")}function Nb(a,b){var c,d,e=m.ajaxSettings.flatOptions||{};for(d in b)void 0!==b[d]&&((e[d]?a:c||(c={}))[d]=b[d]);return c&&m.extend(!0,a,c),a}function Ob(a,b,c){var d,e,f,g,h=a.contents,i=a.dataTypes;while("*"===i[0])i.shift(),void 0===e&&(e=a.mimeType||b.getResponseHeader("Content-Type"));if(e)for(g in h)if(h[g]&&h[g].test(e)){i.unshift(g);break}if(i[0]in c)f=i[0];else{for(g in c){if(!i[0]||a.converters[g+" "+i[0]]){f=g;break}d||(d=g)}f=f||d}return f?(f!==i[0]&&i.unshift(f),c[f]):void 0}function Pb(a,b,c,d){var e,f,g,h,i,j={},k=a.dataTypes.slice();if(k[1])for(g in a.converters)j[g.toLowerCase()]=a.converters[g];f=k.shift();while(f)if(a.responseFields[f]&&(c[a.responseFields[f]]=b),!i&&d&&a.dataFilter&&(b=a.dataFilter(b,a.dataType)),i=f,f=k.shift())if("*"===f)f=i;else if("*"!==i&&i!==f){if(g=j[i+" "+f]||j["* "+f],!g)for(e in j)if(h=e.split(" "),h[1]===f&&(g=j[i+" "+h[0]]||j["* "+h[0]])){g===!0?g=j[e]:j[e]!==!0&&(f=h[0],k.unshift(h[1]));break}if(g!==!0)if(g&&a["throws"])b=g(b);else try{b=g(b)}catch(l){return{state:"parsererror",error:g?l:"No conversion from "+i+" to "+f}}}return{state:"success",data:b}}m.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:zb,type:"GET",isLocal:Db.test(yb[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Jb,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":m.parseJSON,"text xml":m.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(a,b){return b?Nb(Nb(a,m.ajaxSettings),b):Nb(m.ajaxSettings,a)},ajaxPrefilter:Lb(Hb),ajaxTransport:Lb(Ib),ajax:function(a,b){"object"==typeof a&&(b=a,a=void 0),b=b||{};var c,d,e,f,g,h,i,j,k=m.ajaxSetup({},b),l=k.context||k,n=k.context&&(l.nodeType||l.jquery)?m(l):m.event,o=m.Deferred(),p=m.Callbacks("once memory"),q=k.statusCode||{},r={},s={},t=0,u="canceled",v={readyState:0,getResponseHeader:function(a){var b;if(2===t){if(!j){j={};while(b=Cb.exec(f))j[b[1].toLowerCase()]=b[2]}b=j[a.toLowerCase()]}return null==b?null:b},getAllResponseHeaders:function(){return 2===t?f:null},setRequestHeader:function(a,b){var c=a.toLowerCase();return t||(a=s[c]=s[c]||a,r[a]=b),this},overrideMimeType:function(a){return t||(k.mimeType=a),this},statusCode:function(a){var b;if(a)if(2>t)for(b in a)q[b]=[q[b],a[b]];else v.always(a[v.status]);return this},abort:function(a){var b=a||u;return i&&i.abort(b),x(0,b),this}};if(o.promise(v).complete=p.add,v.success=v.done,v.error=v.fail,k.url=((a||k.url||zb)+"").replace(Ab,"").replace(Fb,yb[1]+"//"),k.type=b.method||b.type||k.method||k.type,k.dataTypes=m.trim(k.dataType||"*").toLowerCase().match(E)||[""],null==k.crossDomain&&(c=Gb.exec(k.url.toLowerCase()),k.crossDomain=!(!c||c[1]===yb[1]&&c[2]===yb[2]&&(c[3]||("http:"===c[1]?"80":"443"))===(yb[3]||("http:"===yb[1]?"80":"443")))),k.data&&k.processData&&"string"!=typeof k.data&&(k.data=m.param(k.data,k.traditional)),Mb(Hb,k,b,v),2===t)return v;h=m.event&&k.global,h&&0===m.active++&&m.event.trigger("ajaxStart"),k.type=k.type.toUpperCase(),k.hasContent=!Eb.test(k.type),e=k.url,k.hasContent||(k.data&&(e=k.url+=(wb.test(e)?"&":"?")+k.data,delete k.data),k.cache===!1&&(k.url=Bb.test(e)?e.replace(Bb,"$1_="+vb++):e+(wb.test(e)?"&":"?")+"_="+vb++)),k.ifModified&&(m.lastModified[e]&&v.setRequestHeader("If-Modified-Since",m.lastModified[e]),m.etag[e]&&v.setRequestHeader("If-None-Match",m.etag[e])),(k.data&&k.hasContent&&k.contentType!==!1||b.contentType)&&v.setRequestHeader("Content-Type",k.contentType),v.setRequestHeader("Accept",k.dataTypes[0]&&k.accepts[k.dataTypes[0]]?k.accepts[k.dataTypes[0]]+("*"!==k.dataTypes[0]?", "+Jb+"; q=0.01":""):k.accepts["*"]);for(d in k.headers)v.setRequestHeader(d,k.headers[d]);if(k.beforeSend&&(k.beforeSend.call(l,v,k)===!1||2===t))return v.abort();u="abort";for(d in{success:1,error:1,complete:1})v[d](k[d]);if(i=Mb(Ib,k,b,v)){v.readyState=1,h&&n.trigger("ajaxSend",[v,k]),k.async&&k.timeout>0&&(g=setTimeout(function(){v.abort("timeout")},k.timeout));try{t=1,i.send(r,x)}catch(w){if(!(2>t))throw w;x(-1,w)}}else x(-1,"No Transport");function x(a,b,c,d){var j,r,s,u,w,x=b;2!==t&&(t=2,g&&clearTimeout(g),i=void 0,f=d||"",v.readyState=a>0?4:0,j=a>=200&&300>a||304===a,c&&(u=Ob(k,v,c)),u=Pb(k,u,v,j),j?(k.ifModified&&(w=v.getResponseHeader("Last-Modified"),w&&(m.lastModified[e]=w),w=v.getResponseHeader("etag"),w&&(m.etag[e]=w)),204===a||"HEAD"===k.type?x="nocontent":304===a?x="notmodified":(x=u.state,r=u.data,s=u.error,j=!s)):(s=x,(a||!x)&&(x="error",0>a&&(a=0))),v.status=a,v.statusText=(b||x)+"",j?o.resolveWith(l,[r,x,v]):o.rejectWith(l,[v,x,s]),v.statusCode(q),q=void 0,h&&n.trigger(j?"ajaxSuccess":"ajaxError",[v,k,j?r:s]),p.fireWith(l,[v,x]),h&&(n.trigger("ajaxComplete",[v,k]),--m.active||m.event.trigger("ajaxStop")))}return v},getJSON:function(a,b,c){return m.get(a,b,c,"json")},getScript:function(a,b){return m.get(a,void 0,b,"script")}}),m.each(["get","post"],function(a,b){m[b]=function(a,c,d,e){return m.isFunction(c)&&(e=e||d,d=c,c=void 0),m.ajax({url:a,type:b,dataType:e,data:c,success:d})}}),m._evalUrl=function(a){return m.ajax({url:a,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})},m.fn.extend({wrapAll:function(a){if(m.isFunction(a))return this.each(function(b){m(this).wrapAll(a.call(this,b))});if(this[0]){var b=m(a,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&b.insertBefore(this[0]),b.map(function(){var a=this;while(a.firstChild&&1===a.firstChild.nodeType)a=a.firstChild;return a}).append(this)}return this},wrapInner:function(a){return this.each(m.isFunction(a)?function(b){m(this).wrapInner(a.call(this,b))}:function(){var b=m(this),c=b.contents();c.length?c.wrapAll(a):b.append(a)})},wrap:function(a){var b=m.isFunction(a);return this.each(function(c){m(this).wrapAll(b?a.call(this,c):a)})},unwrap:function(){return this.parent().each(function(){m.nodeName(this,"body")||m(this).replaceWith(this.childNodes)}).end()}}),m.expr.filters.hidden=function(a){return a.offsetWidth<=0&&a.offsetHeight<=0||!k.reliableHiddenOffsets()&&"none"===(a.style&&a.style.display||m.css(a,"display"))},m.expr.filters.visible=function(a){return!m.expr.filters.hidden(a)};var Qb=/%20/g,Rb=/\[\]$/,Sb=/\r?\n/g,Tb=/^(?:submit|button|image|reset|file)$/i,Ub=/^(?:input|select|textarea|keygen)/i;function Vb(a,b,c,d){var e;if(m.isArray(b))m.each(b,function(b,e){c||Rb.test(a)?d(a,e):Vb(a+"["+("object"==typeof e?b:"")+"]",e,c,d)});else if(c||"object"!==m.type(b))d(a,b);else for(e in b)Vb(a+"["+e+"]",b[e],c,d)}m.param=function(a,b){var c,d=[],e=function(a,b){b=m.isFunction(b)?b():null==b?"":b,d[d.length]=encodeURIComponent(a)+"="+encodeURIComponent(b)};if(void 0===b&&(b=m.ajaxSettings&&m.ajaxSettings.traditional),m.isArray(a)||a.jquery&&!m.isPlainObject(a))m.each(a,function(){e(this.name,this.value)});else for(c in a)Vb(c,a[c],b,e);return d.join("&").replace(Qb,"+")},m.fn.extend({serialize:function(){return m.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var a=m.prop(this,"elements");return a?m.makeArray(a):this}).filter(function(){var a=this.type;return this.name&&!m(this).is(":disabled")&&Ub.test(this.nodeName)&&!Tb.test(a)&&(this.checked||!W.test(a))}).map(function(a,b){var c=m(this).val();return null==c?null:m.isArray(c)?m.map(c,function(a){return{name:b.name,value:a.replace(Sb,"\r\n")}}):{name:b.name,value:c.replace(Sb,"\r\n")}}).get()}}),m.ajaxSettings.xhr=void 0!==a.ActiveXObject?function(){return!this.isLocal&&/^(get|post|head|put|delete|options)$/i.test(this.type)&&Zb()||$b()}:Zb;var Wb=0,Xb={},Yb=m.ajaxSettings.xhr();a.attachEvent&&a.attachEvent("onunload",function(){for(var a in Xb)Xb[a](void 0,!0)}),k.cors=!!Yb&&"withCredentials"in Yb,Yb=k.ajax=!!Yb,Yb&&m.ajaxTransport(function(a){if(!a.crossDomain||k.cors){var b;return{send:function(c,d){var e,f=a.xhr(),g=++Wb;if(f.open(a.type,a.url,a.async,a.username,a.password),a.xhrFields)for(e in a.xhrFields)f[e]=a.xhrFields[e];a.mimeType&&f.overrideMimeType&&f.overrideMimeType(a.mimeType),a.crossDomain||c["X-Requested-With"]||(c["X-Requested-With"]="XMLHttpRequest");for(e in c)void 0!==c[e]&&f.setRequestHeader(e,c[e]+"");f.send(a.hasContent&&a.data||null),b=function(c,e){var h,i,j;if(b&&(e||4===f.readyState))if(delete Xb[g],b=void 0,f.onreadystatechange=m.noop,e)4!==f.readyState&&f.abort();else{j={},h=f.status,"string"==typeof f.responseText&&(j.text=f.responseText);try{i=f.statusText}catch(k){i=""}h||!a.isLocal||a.crossDomain?1223===h&&(h=204):h=j.text?200:404}j&&d(h,i,j,f.getAllResponseHeaders())},a.async?4===f.readyState?setTimeout(b):f.onreadystatechange=Xb[g]=b:b()},abort:function(){b&&b(void 0,!0)}}}});function Zb(){try{return new a.XMLHttpRequest}catch(b){}}function $b(){try{return new a.ActiveXObject("Microsoft.XMLHTTP")}catch(b){}}m.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(a){return m.globalEval(a),a}}}),m.ajaxPrefilter("script",function(a){void 0===a.cache&&(a.cache=!1),a.crossDomain&&(a.type="GET",a.global=!1)}),m.ajaxTransport("script",function(a){if(a.crossDomain){var b,c=y.head||m("head")[0]||y.documentElement;return{send:function(d,e){b=y.createElement("script"),b.async=!0,a.scriptCharset&&(b.charset=a.scriptCharset),b.src=a.url,b.onload=b.onreadystatechange=function(a,c){(c||!b.readyState||/loaded|complete/.test(b.readyState))&&(b.onload=b.onreadystatechange=null,b.parentNode&&b.parentNode.removeChild(b),b=null,c||e(200,"success"))},c.insertBefore(b,c.firstChild)},abort:function(){b&&b.onload(void 0,!0)}}}});var _b=[],ac=/(=)\?(?=&|$)|\?\?/;m.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var a=_b.pop()||m.expando+"_"+vb++;return this[a]=!0,a}}),m.ajaxPrefilter("json jsonp",function(b,c,d){var e,f,g,h=b.jsonp!==!1&&(ac.test(b.url)?"url":"string"==typeof b.data&&!(b.contentType||"").indexOf("application/x-www-form-urlencoded")&&ac.test(b.data)&&"data");return h||"jsonp"===b.dataTypes[0]?(e=b.jsonpCallback=m.isFunction(b.jsonpCallback)?b.jsonpCallback():b.jsonpCallback,h?b[h]=b[h].replace(ac,"$1"+e):b.jsonp!==!1&&(b.url+=(wb.test(b.url)?"&":"?")+b.jsonp+"="+e),b.converters["script json"]=function(){return g||m.error(e+" was not called"),g[0]},b.dataTypes[0]="json",f=a[e],a[e]=function(){g=arguments},d.always(function(){a[e]=f,b[e]&&(b.jsonpCallback=c.jsonpCallback,_b.push(e)),g&&m.isFunction(f)&&f(g[0]),g=f=void 0}),"script"):void 0}),m.parseHTML=function(a,b,c){if(!a||"string"!=typeof a)return null;"boolean"==typeof b&&(c=b,b=!1),b=b||y;var d=u.exec(a),e=!c&&[];return d?[b.createElement(d[1])]:(d=m.buildFragment([a],b,e),e&&e.length&&m(e).remove(),m.merge([],d.childNodes))};var bc=m.fn.load;m.fn.load=function(a,b,c){if("string"!=typeof a&&bc)return bc.apply(this,arguments);var d,e,f,g=this,h=a.indexOf(" ");return h>=0&&(d=m.trim(a.slice(h,a.length)),a=a.slice(0,h)),m.isFunction(b)?(c=b,b=void 0):b&&"object"==typeof b&&(f="POST"),g.length>0&&m.ajax({url:a,type:f,dataType:"html",data:b}).done(function(a){e=arguments,g.html(d?m("<div>").append(m.parseHTML(a)).find(d):a)}).complete(c&&function(a,b){g.each(c,e||[a.responseText,b,a])}),this},m.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(a,b){m.fn[b]=function(a){return this.on(b,a)}}),m.expr.filters.animated=function(a){return m.grep(m.timers,function(b){return a===b.elem}).length};var cc=a.document.documentElement;function dc(a){return m.isWindow(a)?a:9===a.nodeType?a.defaultView||a.parentWindow:!1}m.offset={setOffset:function(a,b,c){var d,e,f,g,h,i,j,k=m.css(a,"position"),l=m(a),n={};"static"===k&&(a.style.position="relative"),h=l.offset(),f=m.css(a,"top"),i=m.css(a,"left"),j=("absolute"===k||"fixed"===k)&&m.inArray("auto",[f,i])>-1,j?(d=l.position(),g=d.top,e=d.left):(g=parseFloat(f)||0,e=parseFloat(i)||0),m.isFunction(b)&&(b=b.call(a,c,h)),null!=b.top&&(n.top=b.top-h.top+g),null!=b.left&&(n.left=b.left-h.left+e),"using"in b?b.using.call(a,n):l.css(n)}},m.fn.extend({offset:function(a){if(arguments.length)return void 0===a?this:this.each(function(b){m.offset.setOffset(this,a,b)});var b,c,d={top:0,left:0},e=this[0],f=e&&e.ownerDocument;if(f)return b=f.documentElement,m.contains(b,e)?(typeof e.getBoundingClientRect!==K&&(d=e.getBoundingClientRect()),c=dc(f),{top:d.top+(c.pageYOffset||b.scrollTop)-(b.clientTop||0),left:d.left+(c.pageXOffset||b.scrollLeft)-(b.clientLeft||0)}):d},position:function(){if(this[0]){var a,b,c={top:0,left:0},d=this[0];return"fixed"===m.css(d,"position")?b=d.getBoundingClientRect():(a=this.offsetParent(),b=this.offset(),m.nodeName(a[0],"html")||(c=a.offset()),c.top+=m.css(a[0],"borderTopWidth",!0),c.left+=m.css(a[0],"borderLeftWidth",!0)),{top:b.top-c.top-m.css(d,"marginTop",!0),left:b.left-c.left-m.css(d,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var a=this.offsetParent||cc;while(a&&!m.nodeName(a,"html")&&"static"===m.css(a,"position"))a=a.offsetParent;return a||cc})}}),m.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(a,b){var c=/Y/.test(b);m.fn[a]=function(d){return V(this,function(a,d,e){var f=dc(a);return void 0===e?f?b in f?f[b]:f.document.documentElement[d]:a[d]:void(f?f.scrollTo(c?m(f).scrollLeft():e,c?e:m(f).scrollTop()):a[d]=e)},a,d,arguments.length,null)}}),m.each(["top","left"],function(a,b){m.cssHooks[b]=La(k.pixelPosition,function(a,c){return c?(c=Ja(a,b),Ha.test(c)?m(a).position()[b]+"px":c):void 0})}),m.each({Height:"height",Width:"width"},function(a,b){m.each({padding:"inner"+a,content:b,"":"outer"+a},function(c,d){m.fn[d]=function(d,e){var f=arguments.length&&(c||"boolean"!=typeof d),g=c||(d===!0||e===!0?"margin":"border");return V(this,function(b,c,d){var e;return m.isWindow(b)?b.document.documentElement["client"+a]:9===b.nodeType?(e=b.documentElement,Math.max(b.body["scroll"+a],e["scroll"+a],b.body["offset"+a],e["offset"+a],e["client"+a])):void 0===d?m.css(b,c,g):m.style(b,c,d,g)},b,f?d:void 0,f,null)}})}),m.fn.size=function(){return this.length},m.fn.andSelf=m.fn.addBack,"function"==typeof define&&define.amd&&define("jquery",[],function(){return m});var ec=a.jQuery,fc=a.$;return m.noConflict=function(b){return a.$===m&&(a.$=fc),b&&a.jQuery===m&&(a.jQuery=ec),m},typeof b===K&&(a.jQuery=a.$=m),m});
(function(c){typeof module==="object"&&module.exports?module.exports=c:c(Highcharts)})(function(c){function w(a,b,d,g,f){for(var f=f||0,g=g||x,O=f+g,c=!0;c&&f<O&&f<a.length;)c=b(a[f],f),f+=1;c&&(f<a.length?setTimeout(function(){w(a,b,d,g,f)}):d&&d())}var r=c.win.document,P=function(){},Q=c.Color,l=c.Series,e=c.seriesTypes,k=c.each,n=c.extend,R=c.addEvent,S=c.fireEvent,T=c.merge,U=c.pick,j=c.wrap,p=c.getOptions().plotOptions,x=5E4,y;k(["area","arearange","column","line","scatter"],function(a){if(p[a])p[a].boostThreshold=
5E3});k(["translate","generatePoints","drawTracker","drawPoints","render"],function(a){function b(b){var g=this.options.stacking&&(a==="translate"||a==="generatePoints");if((this.processedXData||this.options.data).length<(this.options.boostThreshold||Number.MAX_VALUE)||g){if(a==="render"&&this.image)this.image.attr({href:""}),this.animate=null;b.call(this)}else if(this[a+"Canvas"])this[a+"Canvas"]()}j(l.prototype,a,b);a==="translate"&&(e.column&&j(e.column.prototype,a,b),e.arearange&&j(e.arearange.prototype,
a,b))});j(l.prototype,"getExtremes",function(a){this.hasExtremes()||a.apply(this,Array.prototype.slice.call(arguments,1))});j(l.prototype,"setData",function(a){this.hasExtremes(!0)||a.apply(this,Array.prototype.slice.call(arguments,1))});j(l.prototype,"processData",function(a){this.hasExtremes(!0)||a.apply(this,Array.prototype.slice.call(arguments,1))});c.extend(l.prototype,{pointRange:0,hasExtremes:function(a){var b=this.options,d=this.xAxis&&this.xAxis.options,g=this.yAxis&&this.yAxis.options;return b.data.length>
(b.boostThreshold||Number.MAX_VALUE)&&typeof g.min==="number"&&typeof g.max==="number"&&(!a||typeof d.min==="number"&&typeof d.max==="number")},destroyGraphics:function(){var a=this,b=this.points,d,g;if(b)for(g=0;g<b.length;g+=1)if((d=b[g])&&d.graphic)d.graphic=d.graphic.destroy();k(["graph","area","tracker"],function(b){a[b]&&(a[b]=a[b].destroy())})},getContext:function(){var a=this.chart,b=a.plotWidth,d=a.plotHeight,g=this.ctx,f=function(a,b,d,g,f,c,e){a.call(this,d,b,g,f,c,e)};this.canvas?g.clearRect(0,
0,b,d):(this.canvas=r.createElement("canvas"),this.image=a.renderer.image("",0,0,b,d).add(this.group),this.ctx=g=this.canvas.getContext("2d"),a.inverted&&k(["moveTo","lineTo","rect","arc"],function(a){j(g,a,f)}));this.canvas.setAttribute("width",b);this.canvas.setAttribute("height",d);this.image.attr({width:b,height:d});return g},canvasToSVG:function(){this.image.attr({href:this.canvas.toDataURL("image/png")})},cvsLineTo:function(a,b,d){a.lineTo(b,d)},renderCanvas:function(){var a=this,b=a.options,
d=a.chart,g=this.xAxis,f=this.yAxis,c,e=0,j=a.processedXData,l=a.processedYData,k=b.data,i=g.getExtremes(),p=i.min,r=i.max,i=f.getExtremes(),V=i.min,W=i.max,z={},s,X=!!a.sampling,A,B=b.marker&&b.marker.radius,C=this.cvsDrawPoint,D=b.lineWidth?this.cvsLineTo:!1,E=B<=1?this.cvsMarkerSquare:this.cvsMarkerCircle,Y=b.enableMouseTracking!==!1,F,i=b.threshold,m=f.getThreshold(i),G=typeof i==="number",H=m,Z=this.fill,I=a.pointArrayMap&&a.pointArrayMap.join(",")==="low,high",J=!!b.stacking,$=a.cropStart||
0,i=d.options.loading,aa=a.requireSorting,K,ba=b.connectNulls,L=!j,t,u,o,q,ca=a.fillOpacity?(new Q(a.color)).setOpacity(U(b.fillOpacity,0.75)).get():a.color,M=function(){Z?(c.fillStyle=ca,c.fill()):(c.strokeStyle=a.color,c.lineWidth=b.lineWidth,c.stroke())},N=function(a,b,d){e===0&&c.beginPath();K?c.moveTo(a,b):C?C(c,a,b,d,F):D?D(c,a,b):E&&E(c,a,b,B);e+=1;e===1E3&&(M(),e=0);F={clientX:a,plotY:b,yBottom:d}},v=function(a,b,c){Y&&!z[a+","+b]&&(z[a+","+b]=!0,d.inverted&&(a=g.len-a,b=f.len-b),A.push({clientX:a,
plotX:a,plotY:b,i:$+c}))};(this.points||this.graph)&&this.destroyGraphics();a.plotGroup("group","series",a.visible?"visible":"hidden",b.zIndex,d.seriesGroup);a.getAttribs();a.markerGroup=a.group;R(a,"destroy",function(){a.markerGroup=null});A=this.points=[];c=this.getContext();a.buildKDTree=P;if(k.length>99999)d.options.loading=T(i,{labelStyle:{backgroundColor:"rgba(255,255,255,0.75)",padding:"1em",borderRadius:"0.5em"},style:{backgroundColor:"none",opacity:1}}),clearTimeout(y),d.showLoading("Drawing..."),
d.options.loading=i;w(J?a.data:j||k,function(b,c){var e,h,j,i,k=typeof d.index==="undefined",n=!0;if(!k){L?(e=b[0],h=b[1]):(e=b,h=l[c]);if(I)L&&(h=b.slice(1,3)),i=h[0],h=h[1];else if(J)e=b.x,h=b.stackY,i=h-b.y;j=h===null;aa||(n=h>=V&&h<=W);if(!j&&e>=p&&e<=r&&n)if(e=Math.round(g.toPixels(e,!0)),X){if(o===void 0||e===s){I||(i=h);if(q===void 0||h>u)u=h,q=c;if(o===void 0||i<t)t=i,o=c}e!==s&&(o!==void 0&&(h=f.toPixels(u,!0),m=f.toPixels(t,!0),N(e,G?Math.min(h,H):h,G?Math.max(m,H):m),v(e,h,q),m!==h&&v(e,
m,o)),o=q=void 0,s=e)}else h=Math.round(f.toPixels(h,!0)),N(e,h,m),v(e,h,c);K=j&&!ba;c%x===0&&a.canvasToSVG()}return!k},function(){var b=d.loadingDiv,c=d.loadingShown;M();a.canvasToSVG();S(a,"renderedCanvas");if(c)n(b.style,{transition:"opacity 250ms",opacity:0}),d.loadingShown=!1,y=setTimeout(function(){b.parentNode&&b.parentNode.removeChild(b);d.loadingDiv=d.loadingSpan=null},250);a.directTouch=!1;a.options.stickyTracking=!0;delete a.buildKDTree;a.buildKDTree()},d.renderer.forExport?Number.MAX_VALUE:
void 0)}});e.scatter.prototype.cvsMarkerCircle=function(a,b,d,c){a.moveTo(b,d);a.arc(b,d,c,0,2*Math.PI,!1)};e.scatter.prototype.cvsMarkerSquare=function(a,b,d,c){a.moveTo(b,d);a.rect(b-c,d-c,c*2,c*2)};e.scatter.prototype.fill=!0;n(e.area.prototype,{cvsDrawPoint:function(a,b,c,e,f){f&&b!==f.clientX&&(a.moveTo(f.clientX,f.yBottom),a.lineTo(f.clientX,f.plotY),a.lineTo(b,c),a.lineTo(b,e))},fill:!0,fillOpacity:!0,sampling:!0});n(e.column.prototype,{cvsDrawPoint:function(a,b,c,e){a.rect(b-1,c,1,e-c)},fill:!0,
sampling:!0});l.prototype.getPoint=function(a){var b=a;if(a&&!(a instanceof this.pointClass))b=(new this.pointClass).init(this,this.options.data[a.i]),b.category=b.x,b.dist=a.dist,b.distX=a.distX,b.plotX=a.plotX,b.plotY=a.plotY;return b};j(l.prototype,"searchPoint",function(a){return this.getPoint(a.apply(this,[].slice.call(arguments,1)))})});
/**
 * This is an experimental Highcharts module that draws long data series on a canvas
 * in order to increase performance of the initial load time and tooltip responsiveness.
 *
 * Compatible with HTML5 canvas compatible browsers (not IE < 9).
 *
 * Author: Torstein Honsi
 *
 * 
 * Development plan
 * - Column range.
 * - Heatmap.
 * - Treemap.
 * - Check how it works with Highstock and data grouping.
 * - Check inverted charts.
 * - Check reversed axes.
 * - Chart callback should be async after last series is drawn. (But not necessarily, we don't do
     that with initial series animation).
 * - Cache full-size image so we don't have to redraw on hide/show and zoom up. But k-d-tree still
 *   needs to be built.
 * - Test IE9 and IE10.
 * - Stacking is not perhaps not correct since it doesn't use the translation given in 
 *   the translate method. If this gets to complicated, a possible way out would be to 
 *   have a simplified renderCanvas method that simply draws the areaPath on a canvas.
 *
 * If this module is taken in as part of the core
 * - All the loading logic should be merged with core. Update styles in the core.
 * - Most of the method wraps should probably be added directly in parent methods.
 *
 * Notes for boost mode
 * - Area lines are not drawn
 * - Point markers are not drawn
 * - Zones and negativeColor don't work
 * - Columns are always one pixel wide. Don't set the threshold too low.
 *
 * Optimizing tips for users
 * - For scatter plots, use a marker.radius of 1 or less. It results in a rectangle being drawn, which is 
 *   considerably faster than a circle.
 * - Set extremes (min, max) explicitly on the axes in order for Highcharts to avoid computing extremes.
 * - Set enableMouseTracking to false on the series to improve total rendering time.
 * - The default threshold is set based on one series. If you have multiple, dense series, the combined
 *   number of points drawn gets higher, and you may want to set the threshold lower in order to 
 *   use optimizations.
 */

/* eslint indent: [2, 4] */

(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function (H) {

    'use strict';

    var win = H.win,
        doc = win.document,
        noop = function () {},
        Color = H.Color,
        Series = H.Series,
        seriesTypes = H.seriesTypes,
        each = H.each,
        extend = H.extend,
        addEvent = H.addEvent,
        fireEvent = H.fireEvent,
        merge = H.merge,
        pick = H.pick,
        wrap = H.wrap,
        plotOptions = H.getOptions().plotOptions,
        CHUNK_SIZE = 50000,
        destroyLoadingDiv;

    function eachAsync(arr, fn, finalFunc, chunkSize, i) {
        i = i || 0;
        chunkSize = chunkSize || CHUNK_SIZE;
        
        var threshold = i + chunkSize,
            proceed = true;

        while (proceed && i < threshold && i < arr.length) {
            proceed = fn(arr[i], i);
            i = i + 1;
        }
        if (proceed) {
            if (i < arr.length) {
                setTimeout(function () {
                    eachAsync(arr, fn, finalFunc, chunkSize, i);
                });
            } else if (finalFunc) {
                finalFunc();
            }
        }
    }

    // Set default options
    each(['area', 'arearange', 'column', 'line', 'scatter'], function (type) {
        if (plotOptions[type]) {
            plotOptions[type].boostThreshold = 5000;
        }
    });

    /**
     * Override a bunch of methods the same way. If the number of points is below the threshold,
     * run the original method. If not, check for a canvas version or do nothing.
     */
    each(['translate', 'generatePoints', 'drawTracker', 'drawPoints', 'render'], function (method) {
        function branch(proceed) {
            var letItPass = this.options.stacking && (method === 'translate' || method === 'generatePoints');
            if ((this.processedXData || this.options.data).length < (this.options.boostThreshold || Number.MAX_VALUE) ||
                    letItPass) {

                // Clear image
                if (method === 'render' && this.image) {
                    this.image.attr({ href: '' });
                    this.animate = null; // We're zooming in, don't run animation
                }

                proceed.call(this);

            // If a canvas version of the method exists, like renderCanvas(), run
            } else if (this[method + 'Canvas']) {

                this[method + 'Canvas']();
            }
        }
        wrap(Series.prototype, method, branch);

        // A special case for some types - its translate method is already wrapped
        if (method === 'translate') {
            if (seriesTypes.column) {
                wrap(seriesTypes.column.prototype, method, branch);
            }
            if (seriesTypes.arearange) {
                wrap(seriesTypes.arearange.prototype, method, branch);
            }
        }
    });

    /**
     * Do not compute extremes when min and max are set.
     * If we use this in the core, we can add the hook to hasExtremes to the methods directly.
     */
    wrap(Series.prototype, 'getExtremes', function (proceed) {
        if (!this.hasExtremes()) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });
    wrap(Series.prototype, 'setData', function (proceed) {
        if (!this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });
    wrap(Series.prototype, 'processData', function (proceed) {
        if (!this.hasExtremes(true)) {
            proceed.apply(this, Array.prototype.slice.call(arguments, 1));
        }
    });


    H.extend(Series.prototype, {
        pointRange: 0,

        hasExtremes: function (checkX) {
            var options = this.options,
                data = options.data,
                xAxis = this.xAxis && this.xAxis.options,
                yAxis = this.yAxis && this.yAxis.options;
            return data.length > (options.boostThreshold || Number.MAX_VALUE) && typeof yAxis.min === 'number' && typeof yAxis.max === 'number' &&
                (!checkX || (typeof xAxis.min === 'number' && typeof xAxis.max === 'number'));
        },

        /**
         * If implemented in the core, parts of this can probably be shared with other similar
         * methods in Highcharts.
         */
        destroyGraphics: function () {
            var series = this,
                points = this.points,
                point,
                i;

            if (points) {
                for (i = 0; i < points.length; i = i + 1) {
                    point = points[i];
                    if (point && point.graphic) {
                        point.graphic = point.graphic.destroy();
                    }
                }
            }

            each(['graph', 'area', 'tracker'], function (prop) {
                if (series[prop]) {
                    series[prop] = series[prop].destroy();
                }
            });
        },

        /**
         * Create a hidden canvas to draw the graph on. The contents is later copied over 
         * to an SVG image element.
         */
        getContext: function () {
            var chart = this.chart,
                width = chart.plotWidth,
                height = chart.plotHeight,
                ctx = this.ctx,
                swapXY = function (proceed, x, y, a, b, c, d) {
                    proceed.call(this, y, x, a, b, c, d);
                };

            if (!this.canvas) {
                this.canvas = doc.createElement('canvas');
                this.image = chart.renderer.image('', 0, 0, width, height).add(this.group);
                this.ctx = ctx = this.canvas.getContext('2d');
                if (chart.inverted) {
                    each(['moveTo', 'lineTo', 'rect', 'arc'], function (fn) {
                        wrap(ctx, fn, swapXY);
                    });
                }
            } else {
                ctx.clearRect(0, 0, width, height);
            }

            this.canvas.setAttribute('width', width);
            this.canvas.setAttribute('height', height);
            this.image.attr({
                width: width,
                height: height
            });

            return ctx;
        },

        /** 
         * Draw the canvas image inside an SVG image
         */
        canvasToSVG: function () {
            this.image.attr({ href: this.canvas.toDataURL('image/png') });
        },

        cvsLineTo: function (ctx, clientX, plotY) {
            ctx.lineTo(clientX, plotY);
        },

        renderCanvas: function () {
            var series = this,
                options = series.options,
                chart = series.chart,
                xAxis = this.xAxis,
                yAxis = this.yAxis,
                ctx,
                c = 0,
                xData = series.processedXData,
                yData = series.processedYData,
                rawData = options.data,
                xExtremes = xAxis.getExtremes(),
                xMin = xExtremes.min,
                xMax = xExtremes.max,
                yExtremes = yAxis.getExtremes(),
                yMin = yExtremes.min,
                yMax = yExtremes.max,
                pointTaken = {},
                lastClientX,
                sampling = !!series.sampling,
                points,
                r = options.marker && options.marker.radius,
                cvsDrawPoint = this.cvsDrawPoint,
                cvsLineTo = options.lineWidth ? this.cvsLineTo : false,
                cvsMarker = r <= 1 ? this.cvsMarkerSquare : this.cvsMarkerCircle,
                enableMouseTracking = options.enableMouseTracking !== false,
                lastPoint,
                threshold = options.threshold,
                yBottom = yAxis.getThreshold(threshold),
                hasThreshold = typeof threshold === 'number',
                translatedThreshold = yBottom,
                doFill = this.fill,
                isRange = series.pointArrayMap && series.pointArrayMap.join(',') === 'low,high',
                isStacked = !!options.stacking,
                cropStart = series.cropStart || 0,
                loadingOptions = chart.options.loading,
                requireSorting = series.requireSorting,
                wasNull,
                connectNulls = options.connectNulls,
                useRaw = !xData,
                minVal,
                maxVal,
                minI,
                maxI,
                fillColor = series.fillOpacity ?
                        new Color(series.color).setOpacity(pick(options.fillOpacity, 0.75)).get() :
                        series.color,
                stroke = function () {
                    if (doFill) {
                        ctx.fillStyle = fillColor;
                        ctx.fill();
                    } else {
                        ctx.strokeStyle = series.color;
                        ctx.lineWidth = options.lineWidth;
                        ctx.stroke();
                    }
                },
                drawPoint = function (clientX, plotY, yBottom) {
                    if (c === 0) {
                        ctx.beginPath();
                    }

                    if (wasNull) {
                        ctx.moveTo(clientX, plotY);
                    } else {
                        if (cvsDrawPoint) {
                            cvsDrawPoint(ctx, clientX, plotY, yBottom, lastPoint);
                        } else if (cvsLineTo) {
                            cvsLineTo(ctx, clientX, plotY);
                        } else if (cvsMarker) {
                            cvsMarker(ctx, clientX, plotY, r);
                        }
                    }

                    // We need to stroke the line for every 1000 pixels. It will crash the browser
                    // memory use if we stroke too infrequently.
                    c = c + 1;
                    if (c === 1000) {
                        stroke();
                        c = 0;
                    }

                    // Area charts need to keep track of the last point
                    lastPoint = {
                        clientX: clientX,
                        plotY: plotY,
                        yBottom: yBottom
                    };
                },

                addKDPoint = function (clientX, plotY, i) {

                    // The k-d tree requires series points. Reduce the amount of points, since the time to build the 
                    // tree increases exponentially.
                    if (enableMouseTracking && !pointTaken[clientX + ',' + plotY]) {
                        pointTaken[clientX + ',' + plotY] = true;

                        if (chart.inverted) {
                            clientX = xAxis.len - clientX;
                            plotY = yAxis.len - plotY;
                        }

                        points.push({
                            clientX: clientX,
                            plotX: clientX,
                            plotY: plotY,
                            i: cropStart + i
                        });
                    }
                };

            // If we are zooming out from SVG mode, destroy the graphics
            if (this.points || this.graph) {
                this.destroyGraphics();
            }

            // The group
            series.plotGroup(
                'group',
                'series',
                series.visible ? 'visible' : 'hidden',
                options.zIndex,
                chart.seriesGroup
            );

            series.getAttribs();
            series.markerGroup = series.group;
            addEvent(series, 'destroy', function () {
                series.markerGroup = null;
            });

            points = this.points = [];
            ctx = this.getContext();
            series.buildKDTree = noop; // Do not start building while drawing 

            // Display a loading indicator
            if (rawData.length > 99999) {
                chart.options.loading = merge(loadingOptions, {
                    labelStyle: {
                        backgroundColor: 'rgba(255,255,255,0.75)',
                        padding: '1em',
                        borderRadius: '0.5em'
                    },
                    style: {
                        backgroundColor: 'none',
                        opacity: 1
                    }
                });
                clearTimeout(destroyLoadingDiv);
                chart.showLoading('Drawing...');
                chart.options.loading = loadingOptions; // reset
            }

            // Loop over the points
            eachAsync(isStacked ? series.data : (xData || rawData), function (d, i) {
                var x,
                    y,
                    clientX,
                    plotY,
                    isNull,
                    low,
                    chartDestroyed = typeof chart.index === 'undefined',
                    isYInside = true;

                if (!chartDestroyed) {
                    if (useRaw) {
                        x = d[0];
                        y = d[1];
                    } else {
                        x = d;
                        y = yData[i];
                    }

                    // Resolve low and high for range series
                    if (isRange) {
                        if (useRaw) {
                            y = d.slice(1, 3);
                        }
                        low = y[0];
                        y = y[1];
                    } else if (isStacked) {
                        x = d.x;
                        y = d.stackY;
                        low = y - d.y;
                    }

                    isNull = y === null;

                    // Optimize for scatter zooming
                    if (!requireSorting) {
                        isYInside = y >= yMin && y <= yMax;
                    }

                    if (!isNull && x >= xMin && x <= xMax && isYInside) {

                        clientX = Math.round(xAxis.toPixels(x, true));

                        if (sampling) {
                            if (minI === undefined || clientX === lastClientX) {
                                if (!isRange) {
                                    low = y;
                                }
                                if (maxI === undefined || y > maxVal) {
                                    maxVal = y;
                                    maxI = i;
                                }
                                if (minI === undefined || low < minVal) {
                                    minVal = low;
                                    minI = i;
                                }

                            }
                            if (clientX !== lastClientX) { // Add points and reset
                                if (minI !== undefined) { // then maxI is also a number
                                    plotY = yAxis.toPixels(maxVal, true);
                                    yBottom = yAxis.toPixels(minVal, true);
                                    drawPoint(
                                        clientX,
                                        hasThreshold ? Math.min(plotY, translatedThreshold) : plotY,
                                        hasThreshold ? Math.max(yBottom, translatedThreshold) : yBottom
                                    );
                                    addKDPoint(clientX, plotY, maxI);
                                    if (yBottom !== plotY) {
                                        addKDPoint(clientX, yBottom, minI);
                                    }
                                }


                                minI = maxI = undefined;
                                lastClientX = clientX;
                            }
                        } else {
                            plotY = Math.round(yAxis.toPixels(y, true));
                            drawPoint(clientX, plotY, yBottom);
                            addKDPoint(clientX, plotY, i);
                        }
                    }
                    wasNull = isNull && !connectNulls;

                    if (i % CHUNK_SIZE === 0) {
                        series.canvasToSVG();
                    }
                }

                return !chartDestroyed;
            }, function () {
                var loadingDiv = chart.loadingDiv,
                    loadingShown = chart.loadingShown;
                stroke();
                series.canvasToSVG();

                fireEvent(series, 'renderedCanvas');

                // Do not use chart.hideLoading, as it runs JS animation and will be blocked by buildKDTree.
                // CSS animation looks good, but then it must be deleted in timeout. If we add the module to core,
                // change hideLoading so we can skip this block.
                if (loadingShown) {
                    extend(loadingDiv.style, {
                        transition: 'opacity 250ms',
                        opacity: 0
                    });
                    chart.loadingShown = false;
                    destroyLoadingDiv = setTimeout(function () {
                        if (loadingDiv.parentNode) { // In exporting it is falsy
                            loadingDiv.parentNode.removeChild(loadingDiv);
                        }
                        chart.loadingDiv = chart.loadingSpan = null;
                    }, 250);
                }

                // Pass tests in Pointer. 
                // Replace this with a single property, and replace when zooming in
                // below boostThreshold.
                series.directTouch = false;
                series.options.stickyTracking = true;

                delete series.buildKDTree; // Go back to prototype, ready to build
                series.buildKDTree();

             // Don't do async on export, the exportChart, getSVGForExport and getSVG methods are not chained for it.
            }, chart.renderer.forExport ? Number.MAX_VALUE : undefined);
        }
    });

    seriesTypes.scatter.prototype.cvsMarkerCircle = function (ctx, clientX, plotY, r) {
        ctx.moveTo(clientX, plotY);
        ctx.arc(clientX, plotY, r, 0, 2 * Math.PI, false);
    };

    // Rect is twice as fast as arc, should be used for small markers
    seriesTypes.scatter.prototype.cvsMarkerSquare = function (ctx, clientX, plotY, r) {
        ctx.moveTo(clientX, plotY);
        ctx.rect(clientX - r, plotY - r, r * 2, r * 2);
    };
    seriesTypes.scatter.prototype.fill = true;

    extend(seriesTypes.area.prototype, {
        cvsDrawPoint: function (ctx, clientX, plotY, yBottom, lastPoint) {
            if (lastPoint && clientX !== lastPoint.clientX) {
                ctx.moveTo(lastPoint.clientX, lastPoint.yBottom);
                ctx.lineTo(lastPoint.clientX, lastPoint.plotY);
                ctx.lineTo(clientX, plotY);
                ctx.lineTo(clientX, yBottom);
            }
        },
        fill: true,
        fillOpacity: true,
        sampling: true
    });

    extend(seriesTypes.column.prototype, {
        cvsDrawPoint: function (ctx, clientX, plotY, yBottom) {
            ctx.rect(clientX - 1, plotY, 1, yBottom - plotY);
        },
        fill: true,
        sampling: true
    });

    /**
     * Return a full Point object based on the index. The boost module uses stripped point objects
     * for performance reasons.
     * @param   {Number} boostPoint A stripped-down point object
     * @returns {Object}   A Point object as per http://api.highcharts.com/highcharts#Point
     */
    Series.prototype.getPoint = function (boostPoint) {
        var point = boostPoint;

        if (boostPoint && !(boostPoint instanceof this.pointClass)) {
            point = (new this.pointClass()).init(this, this.options.data[boostPoint.i]);
            point.category = point.x;

            point.dist = boostPoint.dist;
            point.distX = boostPoint.distX;
            point.plotX = boostPoint.plotX;
            point.plotY = boostPoint.plotY;
        }

        return point;
    };

    /**
     * Return a point instance from the k-d-tree
     */
    wrap(Series.prototype, 'searchPoint', function (proceed) {
        return this.getPoint(
            proceed.apply(this, [].slice.call(arguments, 1))
        );
    });
}));
(function(e){typeof module==="object"&&module.exports?module.exports=e:e(Highcharts)})(function(e){function u(){return Array.prototype.slice.call(arguments,1)}function s(d){d.apply(this);this.drawBreaks()}var q=e.pick,o=e.wrap,r=e.each,v=e.extend,t=e.fireEvent,p=e.Axis,w=e.Series;v(p.prototype,{isInBreak:function(d,h){var a=d.repeat||Infinity,b=d.from,c=d.to-d.from,a=h>=b?(h-b)%a:a-(b-h)%a;return d.inclusive?a<=c:a<c&&a!==0},isInAnyBreak:function(d,h){var a=this.options.breaks,b=a&&a.length,c,f,j;
if(b){for(;b--;)this.isInBreak(a[b],d)&&(c=!0,f||(f=q(a[b].showPoints,this.isXAxis?!1:!0)));j=c&&h?c&&!f:c}return j}});o(p.prototype,"setTickPositions",function(d){d.apply(this,Array.prototype.slice.call(arguments,1));if(this.options.breaks){var h=this.tickPositions,a=this.tickPositions.info,b=[],c;for(c=0;c<h.length;c++)this.isInAnyBreak(h[c])||b.push(h[c]);this.tickPositions=b;this.tickPositions.info=a}});o(p.prototype,"init",function(d,h,a){if(a.breaks&&a.breaks.length)a.ordinal=!1;d.call(this,
h,a);if(this.options.breaks){var b=this;b.isBroken=!0;this.val2lin=function(c){var f=c,a,d;for(d=0;d<b.breakArray.length;d++)if(a=b.breakArray[d],a.to<=c)f-=a.len;else if(a.from>=c)break;else if(b.isInBreak(a,c)){f-=c-a.from;break}return f};this.lin2val=function(c){var f,a;for(a=0;a<b.breakArray.length;a++)if(f=b.breakArray[a],f.from>=c)break;else f.to<c?c+=f.len:b.isInBreak(f,c)&&(c+=f.len);return c};this.setExtremes=function(c,a,b,d,h){for(;this.isInAnyBreak(c);)c-=this.closestPointRange;for(;this.isInAnyBreak(a);)a-=
this.closestPointRange;p.prototype.setExtremes.call(this,c,a,b,d,h)};this.setAxisTranslation=function(c){p.prototype.setAxisTranslation.call(this,c);var a=b.options.breaks,c=[],d=[],h=0,k,g,e=b.userMin||b.min,l=b.userMax||b.max,i,n;for(n in a)g=a[n],k=g.repeat||Infinity,b.isInBreak(g,e)&&(e+=g.to%k-e%k),b.isInBreak(g,l)&&(l-=l%k-g.from%k);for(n in a){g=a[n];i=g.from;for(k=g.repeat||Infinity;i-k>e;)i-=k;for(;i<e;)i+=k;for(;i<l;i+=k)c.push({value:i,move:"in"}),c.push({value:i+(g.to-g.from),move:"out",
size:g.breakSize})}c.sort(function(a,c){return a.value===c.value?(a.move==="in"?0:1)-(c.move==="in"?0:1):a.value-c.value});a=0;i=e;for(n in c){g=c[n];a+=g.move==="in"?1:-1;if(a===1&&g.move==="in")i=g.value;a===0&&(d.push({from:i,to:g.value,len:g.value-i-(g.size||0)}),h+=g.value-i-(g.size||0))}b.breakArray=d;t(b,"afterBreaks");b.transA*=(l-b.min)/(l-e-h);b.min=e;b.max=l}}});o(w.prototype,"generatePoints",function(d){d.apply(this,u(arguments));var e=this.xAxis,a=this.yAxis,b=this.points,c,f=b.length,
j=this.options.connectNulls,m;if(e&&a&&(e.options.breaks||a.options.breaks))for(;f--;)if(c=b[f],m=c.y===null&&j===!1,!m&&(e.isInAnyBreak(c.x,!0)||a.isInAnyBreak(c.y,!0)))b.splice(f,1),this.data[f]&&this.data[f].destroyElements()});e.Series.prototype.drawBreaks=function(){var d=this,e=d.points,a,b,c,f,j;r(["y","x"],function(m){a=d[m+"Axis"];b=a.breakArray||[];c=a.isXAxis?a.min:q(d.options.threshold,a.min);r(e,function(d){j=q(d["stack"+m.toUpperCase()],d[m]);r(b,function(b){f=!1;if(c<b.from&&j>b.to||
c>b.from&&j<b.from)f="pointBreak";else if(c<b.from&&j>b.from&&j<b.to||c>b.from&&j>b.to&&j<b.from)f="pointInBreak";f&&t(a,f,{point:d,brk:b})})})})};o(e.seriesTypes.column.prototype,"drawPoints",s);o(e.Series.prototype,"drawPoints",s)});
/**
 * Highcharts JS v4.2.3 (2016-02-08)
 * Highcharts Broken Axis module
 * 
 * License: www.highcharts.com/license
 */


(function (factory) {
	/*= if (!build.assembly) { =*/
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
		return;
	}
	/*= } =*/
	factory(Highcharts);
	
}(function (H) {

	'use strict';

	var pick = H.pick,
		wrap = H.wrap,
		each = H.each,
		extend = H.extend,
		fireEvent = H.fireEvent,
		Axis = H.Axis,
		Series = H.Series;

	function stripArguments() {
		return Array.prototype.slice.call(arguments, 1);
	}

	extend(Axis.prototype, {
		isInBreak: function (brk, val) {
			var ret,
				repeat = brk.repeat || Infinity,
				from = brk.from,
				length = brk.to - brk.from,
				test = (val >= from ? (val - from) % repeat :  repeat - ((from - val) % repeat));

			if (!brk.inclusive) {
				ret = test < length && test !== 0;
			} else {
				ret = test <= length;
			}
			return ret;
		},

		isInAnyBreak: function (val, testKeep) {

			var breaks = this.options.breaks,
				i = breaks && breaks.length,
				inbrk,
				keep,
				ret;

			
			if (i) { 

				while (i--) {
					if (this.isInBreak(breaks[i], val)) {
						inbrk = true;
						if (!keep) {
							keep = pick(breaks[i].showPoints, this.isXAxis ? false : true);
						}
					}
				}

				if (inbrk && testKeep) {
					ret = inbrk && !keep;
				} else {
					ret = inbrk;
				}
			}
			return ret;
		}
	});

	wrap(Axis.prototype, 'setTickPositions', function (proceed) {
		proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		
		if (this.options.breaks) {
			var axis = this,
				tickPositions = this.tickPositions,
				info = this.tickPositions.info,
				newPositions = [],
				i;

			for (i = 0; i < tickPositions.length; i++) {
				if (!axis.isInAnyBreak(tickPositions[i])) {
					newPositions.push(tickPositions[i]);
				}
			}

			this.tickPositions = newPositions;
			this.tickPositions.info = info;
		}
	});
	
	wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {
		// Force Axis to be not-ordinal when breaks are defined
		if (userOptions.breaks && userOptions.breaks.length) {
			userOptions.ordinal = false;
		}

		proceed.call(this, chart, userOptions);

		if (this.options.breaks) {

			var axis = this;
			
			axis.isBroken = true;

			this.val2lin = function (val) {
				var nval = val,
					brk,
					i;

				for (i = 0; i < axis.breakArray.length; i++) {
					brk = axis.breakArray[i];
					if (brk.to <= val) {
						nval -= brk.len;
					} else if (brk.from >= val) {
						break;
					} else if (axis.isInBreak(brk, val)) {
						nval -= (val - brk.from);
						break;
					}
				}

				return nval;
			};
			
			this.lin2val = function (val) {
				var nval = val,
					brk,
					i;

				for (i = 0; i < axis.breakArray.length; i++) {
					brk = axis.breakArray[i];
					if (brk.from >= nval) {
						break;
					} else if (brk.to < nval) {
						nval += brk.len;
					} else if (axis.isInBreak(brk, nval)) {
						nval += brk.len;
					}
				}
				return nval;
			};

			this.setExtremes = function (newMin, newMax, redraw, animation, eventArguments) {
				// If trying to set extremes inside a break, extend it to before and after the break ( #3857 )
				while (this.isInAnyBreak(newMin)) {
					newMin -= this.closestPointRange;
				}				
				while (this.isInAnyBreak(newMax)) {
					newMax -= this.closestPointRange;
				}
				Axis.prototype.setExtremes.call(this, newMin, newMax, redraw, animation, eventArguments);
			};

			this.setAxisTranslation = function (saveOld) {
				Axis.prototype.setAxisTranslation.call(this, saveOld);

				var breaks = axis.options.breaks,
					breakArrayT = [],	// Temporary one
					breakArray = [],
					length = 0, 
					inBrk,
					repeat,
					brk,
					min = axis.userMin || axis.min,
					max = axis.userMax || axis.max,
					start,
					i,
					j;

				// Min & max check (#4247)
				for (i in breaks) {
					brk = breaks[i];
					repeat = brk.repeat || Infinity;
					if (axis.isInBreak(brk, min)) {
						min += (brk.to % repeat) - (min % repeat);
					}
					if (axis.isInBreak(brk, max)) {
						max -= (max % repeat) - (brk.from % repeat);
					}
				}

				// Construct an array holding all breaks in the axis
				for (i in breaks) {
					brk = breaks[i];
					start = brk.from;
					repeat = brk.repeat || Infinity;

					while (start - repeat > min) {
						start -= repeat;
					}
					while (start < min) {
						start += repeat;
					}

					for (j = start; j < max; j += repeat) {
						breakArrayT.push({
							value: j,
							move: 'in'
						});
						breakArrayT.push({
							value: j + (brk.to - brk.from),
							move: 'out',
							size: brk.breakSize
						});
					}
				}

				breakArrayT.sort(function (a, b) {
					var ret;
					if (a.value === b.value) {
						ret = (a.move === 'in' ? 0 : 1) - (b.move === 'in' ? 0 : 1);
					} else {
						ret = a.value - b.value;
					}
					return ret;
				});
				
				// Simplify the breaks
				inBrk = 0;
				start = min;

				for (i in breakArrayT) {
					brk = breakArrayT[i];
					inBrk += (brk.move === 'in' ? 1 : -1);

					if (inBrk === 1 && brk.move === 'in') {
						start = brk.value;
					}
					if (inBrk === 0) {
						breakArray.push({
							from: start,
							to: brk.value,
							len: brk.value - start - (brk.size || 0)
						});
						length += brk.value - start - (brk.size || 0);
					}
				}

				axis.breakArray = breakArray;

				fireEvent(axis, 'afterBreaks');
				
				axis.transA *= ((max - axis.min) / (max - min - length));

				axis.min = min;
				axis.max = max;
			};
		}
	});

	wrap(Series.prototype, 'generatePoints', function (proceed) {

		proceed.apply(this, stripArguments(arguments));

		var series = this,
			xAxis = series.xAxis,
			yAxis = series.yAxis,
			points = series.points,
			point,
			i = points.length,
			connectNulls = series.options.connectNulls,
			nullGap;


		if (xAxis && yAxis && (xAxis.options.breaks || yAxis.options.breaks)) {
			while (i--) {
				point = points[i];

				nullGap = point.y === null && connectNulls === false; // respect nulls inside the break (#4275)
				if (!nullGap && (xAxis.isInAnyBreak(point.x, true) || yAxis.isInAnyBreak(point.y, true))) {
					points.splice(i, 1);
					if (this.data[i]) {
						this.data[i].destroyElements(); // removes the graphics for this point if they exist
					}
				}
			}
		}

	});

	function drawPointsWrapped(proceed) {
		proceed.apply(this);
		this.drawBreaks();
	}

	H.Series.prototype.drawBreaks = function () {
		var series = this,
			points = series.points,
			axis,
			breaks,
			threshold,
			axisName = 'Axis',
			eventName,
			y;

		each(['y', 'x'], function (key) {
			axis = series[key + axisName];
			breaks = axis.breakArray || [];
			threshold = axis.isXAxis ? axis.min : pick(series.options.threshold, axis.min);
			each(points, function (point) {
				y = pick(point['stack' + key.toUpperCase()], point[key]);
				each(breaks, function (brk) {
					eventName = false;

					if ((threshold < brk.from && y > brk.to) || (threshold > brk.from && y < brk.from)) { 
						eventName = 'pointBreak';
					} else if ((threshold < brk.from && y > brk.from && y < brk.to) || (threshold > brk.from && y > brk.to && y < brk.from)) { // point falls inside the break
						eventName = 'pointInBreak';
					} 
					if (eventName) {
						fireEvent(axis, eventName, { point: point, brk: brk });
					}
				});
			});
		});
	};

	wrap(H.seriesTypes.column.prototype, 'drawPoints', drawPointsWrapped);
	wrap(H.Series.prototype, 'drawPoints', drawPointsWrapped);

}));
/*
 A class to parse color values
 @author Stoyan Stefanov <sstoo@gmail.com>
 @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 Use it if you like it

 canvg.js - Javascript SVG parser and renderer on Canvas
 MIT Licensed 
 Gabe Lerner (gabelerner@gmail.com)
 http://code.google.com/p/canvg/

 Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/

 Highcharts JS v4.2.3 (2016-02-08)
 CanVGRenderer Extension module

 (c) 2011-2016 Torstein Honsi, Erik Olsson

 License: www.highcharts.com/license
*/

function RGBColor(m){this.ok=!1;m.charAt(0)=="#"&&(m=m.substr(1,6));var m=m.replace(/ /g,""),m=m.toLowerCase(),a={aliceblue:"f0f8ff",antiquewhite:"faebd7",aqua:"00ffff",aquamarine:"7fffd4",azure:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"000000",blanchedalmond:"ffebcd",blue:"0000ff",blueviolet:"8a2be2",brown:"a52a2a",burlywood:"deb887",cadetblue:"5f9ea0",chartreuse:"7fff00",chocolate:"d2691e",coral:"ff7f50",cornflowerblue:"6495ed",cornsilk:"fff8dc",crimson:"dc143c",cyan:"00ffff",darkblue:"00008b",
darkcyan:"008b8b",darkgoldenrod:"b8860b",darkgray:"a9a9a9",darkgreen:"006400",darkkhaki:"bdb76b",darkmagenta:"8b008b",darkolivegreen:"556b2f",darkorange:"ff8c00",darkorchid:"9932cc",darkred:"8b0000",darksalmon:"e9967a",darkseagreen:"8fbc8f",darkslateblue:"483d8b",darkslategray:"2f4f4f",darkturquoise:"00ced1",darkviolet:"9400d3",deeppink:"ff1493",deepskyblue:"00bfff",dimgray:"696969",dodgerblue:"1e90ff",feldspar:"d19275",firebrick:"b22222",floralwhite:"fffaf0",forestgreen:"228b22",fuchsia:"ff00ff",
gainsboro:"dcdcdc",ghostwhite:"f8f8ff",gold:"ffd700",goldenrod:"daa520",gray:"808080",green:"008000",greenyellow:"adff2f",honeydew:"f0fff0",hotpink:"ff69b4",indianred:"cd5c5c",indigo:"4b0082",ivory:"fffff0",khaki:"f0e68c",lavender:"e6e6fa",lavenderblush:"fff0f5",lawngreen:"7cfc00",lemonchiffon:"fffacd",lightblue:"add8e6",lightcoral:"f08080",lightcyan:"e0ffff",lightgoldenrodyellow:"fafad2",lightgrey:"d3d3d3",lightgreen:"90ee90",lightpink:"ffb6c1",lightsalmon:"ffa07a",lightseagreen:"20b2aa",lightskyblue:"87cefa",
lightslateblue:"8470ff",lightslategray:"778899",lightsteelblue:"b0c4de",lightyellow:"ffffe0",lime:"00ff00",limegreen:"32cd32",linen:"faf0e6",magenta:"ff00ff",maroon:"800000",mediumaquamarine:"66cdaa",mediumblue:"0000cd",mediumorchid:"ba55d3",mediumpurple:"9370d8",mediumseagreen:"3cb371",mediumslateblue:"7b68ee",mediumspringgreen:"00fa9a",mediumturquoise:"48d1cc",mediumvioletred:"c71585",midnightblue:"191970",mintcream:"f5fffa",mistyrose:"ffe4e1",moccasin:"ffe4b5",navajowhite:"ffdead",navy:"000080",
oldlace:"fdf5e6",olive:"808000",olivedrab:"6b8e23",orange:"ffa500",orangered:"ff4500",orchid:"da70d6",palegoldenrod:"eee8aa",palegreen:"98fb98",paleturquoise:"afeeee",palevioletred:"d87093",papayawhip:"ffefd5",peachpuff:"ffdab9",peru:"cd853f",pink:"ffc0cb",plum:"dda0dd",powderblue:"b0e0e6",purple:"800080",red:"ff0000",rosybrown:"bc8f8f",royalblue:"4169e1",saddlebrown:"8b4513",salmon:"fa8072",sandybrown:"f4a460",seagreen:"2e8b57",seashell:"fff5ee",sienna:"a0522d",silver:"c0c0c0",skyblue:"87ceeb",slateblue:"6a5acd",
slategray:"708090",snow:"fffafa",springgreen:"00ff7f",steelblue:"4682b4",tan:"d2b48c",teal:"008080",thistle:"d8bfd8",tomato:"ff6347",turquoise:"40e0d0",violet:"ee82ee",violetred:"d02090",wheat:"f5deb3",white:"ffffff",whitesmoke:"f5f5f5",yellow:"ffff00",yellowgreen:"9acd32"},c;for(c in a)m==c&&(m=a[c]);var d=[{re:/^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,example:["rgb(123, 234, 45)","rgb(255,234,245)"],process:function(b){return[parseInt(b[1]),parseInt(b[2]),parseInt(b[3])]}},{re:/^(\w{2})(\w{2})(\w{2})$/,
example:["#00ff00","336699"],process:function(b){return[parseInt(b[1],16),parseInt(b[2],16),parseInt(b[3],16)]}},{re:/^(\w{1})(\w{1})(\w{1})$/,example:["#fb0","f0f"],process:function(b){return[parseInt(b[1]+b[1],16),parseInt(b[2]+b[2],16),parseInt(b[3]+b[3],16)]}}];for(c=0;c<d.length;c++){var b=d[c].process,k=d[c].re.exec(m);if(k)channels=b(k),this.r=channels[0],this.g=channels[1],this.b=channels[2],this.ok=!0}this.r=this.r<0||isNaN(this.r)?0:this.r>255?255:this.r;this.g=this.g<0||isNaN(this.g)?0:
this.g>255?255:this.g;this.b=this.b<0||isNaN(this.b)?0:this.b>255?255:this.b;this.toRGB=function(){return"rgb("+this.r+", "+this.g+", "+this.b+")"};this.toHex=function(){var b=this.r.toString(16),a=this.g.toString(16),d=this.b.toString(16);b.length==1&&(b="0"+b);a.length==1&&(a="0"+a);d.length==1&&(d="0"+d);return"#"+b+a+d};this.getHelpXML=function(){for(var b=[],c=0;c<d.length;c++)for(var k=d[c].example,h=0;h<k.length;h++)b[b.length]=k[h];for(var j in a)b[b.length]=j;k=document.createElement("ul");
k.setAttribute("id","rgbcolor-examples");for(c=0;c<b.length;c++)try{var l=document.createElement("li"),o=new RGBColor(b[c]),n=document.createElement("div");n.style.cssText="margin: 3px; border: 1px solid black; background:"+o.toHex()+"; color:"+o.toHex();n.appendChild(document.createTextNode("test"));var q=document.createTextNode(" "+b[c]+" -> "+o.toRGB()+" -> "+o.toHex());l.appendChild(n);l.appendChild(q);k.appendChild(l)}catch(p){}return k}}
if(!window.console)window.console={},window.console.log=function(){},window.console.dir=function(){};if(!Array.prototype.indexOf)Array.prototype.indexOf=function(m){for(var a=0;a<this.length;a++)if(this[a]==m)return a;return-1};
(function(){function m(){var a={FRAMERATE:30,MAX_VIRTUAL_PIXELS:3E4};a.init=function(c){a.Definitions={};a.Styles={};a.Animations=[];a.Images=[];a.ctx=c;a.ViewPort=new function(){this.viewPorts=[];this.Clear=function(){this.viewPorts=[]};this.SetCurrent=function(a,b){this.viewPorts.push({width:a,height:b})};this.RemoveCurrent=function(){this.viewPorts.pop()};this.Current=function(){return this.viewPorts[this.viewPorts.length-1]};this.width=function(){return this.Current().width};this.height=function(){return this.Current().height};
this.ComputeSize=function(a){return a!=null&&typeof a=="number"?a:a=="x"?this.width():a=="y"?this.height():Math.sqrt(Math.pow(this.width(),2)+Math.pow(this.height(),2))/Math.sqrt(2)}}};a.init();a.ImagesLoaded=function(){for(var c=0;c<a.Images.length;c++)if(!a.Images[c].loaded)return!1;return!0};a.trim=function(a){return a.replace(/^\s+|\s+$/g,"")};a.compressSpaces=function(a){return a?a.replace(/[\s\r\t\n]+/gm," "):""};a.ajax=function(a){var d;return(d=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"))?
(d.open("GET",a,!1),d.send(null),d.responseText):null};a.parseXml=function(a){if(window.DOMParser)return(new DOMParser).parseFromString(a,"text/xml");else{var a=a.replace(/<!DOCTYPE svg[^>]*>/,""),d=new ActiveXObject("Microsoft.XMLDOM");d.async="false";d.loadXML(a);return d}};a.Property=function(c,d){this.name=c;this.value=d;this.hasValue=function(){return this.value!=null&&this.value!==""};this.numValue=function(){if(!this.hasValue())return 0;var b=parseFloat(this.value);(this.value+"").match(/%$/)&&
(b/=100);return b};this.valueOrDefault=function(b){return this.hasValue()?this.value:b};this.numValueOrDefault=function(b){return this.hasValue()?this.numValue():b};var b=this;this.Color={addOpacity:function(d){var c=b.value;if(d!=null&&d!=""){var f=new RGBColor(b.value);f.ok&&(c="rgba("+f.r+", "+f.g+", "+f.b+", "+d+")")}return new a.Property(b.name,c)}};this.Definition={getDefinition:function(){var d=b.value.replace(/^(url\()?#([^\)]+)\)?$/,"$2");return a.Definitions[d]},isUrl:function(){return b.value.indexOf("url(")==
0},getFillStyle:function(b){var d=this.getDefinition();return d!=null&&d.createGradient?d.createGradient(a.ctx,b):d!=null&&d.createPattern?d.createPattern(a.ctx,b):null}};this.Length={DPI:function(){return 96},EM:function(b){var d=12,c=new a.Property("fontSize",a.Font.Parse(a.ctx.font).fontSize);c.hasValue()&&(d=c.Length.toPixels(b));return d},toPixels:function(d){if(!b.hasValue())return 0;var c=b.value+"";return c.match(/em$/)?b.numValue()*this.EM(d):c.match(/ex$/)?b.numValue()*this.EM(d)/2:c.match(/px$/)?
b.numValue():c.match(/pt$/)?b.numValue()*1.25:c.match(/pc$/)?b.numValue()*15:c.match(/cm$/)?b.numValue()*this.DPI(d)/2.54:c.match(/mm$/)?b.numValue()*this.DPI(d)/25.4:c.match(/in$/)?b.numValue()*this.DPI(d):c.match(/%$/)?b.numValue()*a.ViewPort.ComputeSize(d):b.numValue()}};this.Time={toMilliseconds:function(){if(!b.hasValue())return 0;var a=b.value+"";if(a.match(/s$/))return b.numValue()*1E3;a.match(/ms$/);return b.numValue()}};this.Angle={toRadians:function(){if(!b.hasValue())return 0;var a=b.value+
"";return a.match(/deg$/)?b.numValue()*(Math.PI/180):a.match(/grad$/)?b.numValue()*(Math.PI/200):a.match(/rad$/)?b.numValue():b.numValue()*(Math.PI/180)}}};a.Font=new function(){this.Styles=["normal","italic","oblique","inherit"];this.Variants=["normal","small-caps","inherit"];this.Weights="normal,bold,bolder,lighter,100,200,300,400,500,600,700,800,900,inherit".split(",");this.CreateFont=function(d,b,c,e,f,g){g=g!=null?this.Parse(g):this.CreateFont("","","","","",a.ctx.font);return{fontFamily:f||
g.fontFamily,fontSize:e||g.fontSize,fontStyle:d||g.fontStyle,fontWeight:c||g.fontWeight,fontVariant:b||g.fontVariant,toString:function(){return[this.fontStyle,this.fontVariant,this.fontWeight,this.fontSize,this.fontFamily].join(" ")}}};var c=this;this.Parse=function(d){for(var b={},d=a.trim(a.compressSpaces(d||"")).split(" "),k=!1,e=!1,f=!1,g=!1,h="",j=0;j<d.length;j++)if(!e&&c.Styles.indexOf(d[j])!=-1){if(d[j]!="inherit")b.fontStyle=d[j];e=!0}else if(!g&&c.Variants.indexOf(d[j])!=-1){if(d[j]!="inherit")b.fontVariant=
d[j];e=g=!0}else if(!f&&c.Weights.indexOf(d[j])!=-1){if(d[j]!="inherit")b.fontWeight=d[j];e=g=f=!0}else if(k)d[j]!="inherit"&&(h+=d[j]);else{if(d[j]!="inherit")b.fontSize=d[j].split("/")[0];e=g=f=k=!0}if(h!="")b.fontFamily=h;return b}};a.ToNumberArray=function(c){for(var c=a.trim(a.compressSpaces((c||"").replace(/,/g," "))).split(" "),d=0;d<c.length;d++)c[d]=parseFloat(c[d]);return c};a.Point=function(a,d){this.x=a;this.y=d;this.angleTo=function(b){return Math.atan2(b.y-this.y,b.x-this.x)};this.applyTransform=
function(b){var a=this.x*b[1]+this.y*b[3]+b[5];this.x=this.x*b[0]+this.y*b[2]+b[4];this.y=a}};a.CreatePoint=function(c){c=a.ToNumberArray(c);return new a.Point(c[0],c[1])};a.CreatePath=function(c){for(var c=a.ToNumberArray(c),d=[],b=0;b<c.length;b+=2)d.push(new a.Point(c[b],c[b+1]));return d};a.BoundingBox=function(a,d,b,k){this.y2=this.x2=this.y1=this.x1=Number.NaN;this.x=function(){return this.x1};this.y=function(){return this.y1};this.width=function(){return this.x2-this.x1};this.height=function(){return this.y2-
this.y1};this.addPoint=function(b,a){if(b!=null){if(isNaN(this.x1)||isNaN(this.x2))this.x2=this.x1=b;if(b<this.x1)this.x1=b;if(b>this.x2)this.x2=b}if(a!=null){if(isNaN(this.y1)||isNaN(this.y2))this.y2=this.y1=a;if(a<this.y1)this.y1=a;if(a>this.y2)this.y2=a}};this.addX=function(b){this.addPoint(b,null)};this.addY=function(b){this.addPoint(null,b)};this.addBoundingBox=function(b){this.addPoint(b.x1,b.y1);this.addPoint(b.x2,b.y2)};this.addQuadraticCurve=function(b,a,d,c,k,l){d=b+2/3*(d-b);c=a+2/3*(c-
a);this.addBezierCurve(b,a,d,d+1/3*(k-b),c,c+1/3*(l-a),k,l)};this.addBezierCurve=function(b,a,d,c,k,l,o,n){var q=[b,a],p=[d,c],t=[k,l],m=[o,n];this.addPoint(q[0],q[1]);this.addPoint(m[0],m[1]);for(i=0;i<=1;i++)b=function(b){return Math.pow(1-b,3)*q[i]+3*Math.pow(1-b,2)*b*p[i]+3*(1-b)*Math.pow(b,2)*t[i]+Math.pow(b,3)*m[i]},a=6*q[i]-12*p[i]+6*t[i],d=-3*q[i]+9*p[i]-9*t[i]+3*m[i],c=3*p[i]-3*q[i],d==0?a!=0&&(a=-c/a,0<a&&a<1&&(i==0&&this.addX(b(a)),i==1&&this.addY(b(a)))):(c=Math.pow(a,2)-4*c*d,c<0||(k=
(-a+Math.sqrt(c))/(2*d),0<k&&k<1&&(i==0&&this.addX(b(k)),i==1&&this.addY(b(k))),a=(-a-Math.sqrt(c))/(2*d),0<a&&a<1&&(i==0&&this.addX(b(a)),i==1&&this.addY(b(a)))))};this.isPointInBox=function(b,a){return this.x1<=b&&b<=this.x2&&this.y1<=a&&a<=this.y2};this.addPoint(a,d);this.addPoint(b,k)};a.Transform=function(c){var d=this;this.Type={};this.Type.translate=function(b){this.p=a.CreatePoint(b);this.apply=function(b){b.translate(this.p.x||0,this.p.y||0)};this.applyToPoint=function(b){b.applyTransform([1,
0,0,1,this.p.x||0,this.p.y||0])}};this.Type.rotate=function(b){b=a.ToNumberArray(b);this.angle=new a.Property("angle",b[0]);this.cx=b[1]||0;this.cy=b[2]||0;this.apply=function(b){b.translate(this.cx,this.cy);b.rotate(this.angle.Angle.toRadians());b.translate(-this.cx,-this.cy)};this.applyToPoint=function(b){var a=this.angle.Angle.toRadians();b.applyTransform([1,0,0,1,this.p.x||0,this.p.y||0]);b.applyTransform([Math.cos(a),Math.sin(a),-Math.sin(a),Math.cos(a),0,0]);b.applyTransform([1,0,0,1,-this.p.x||
0,-this.p.y||0])}};this.Type.scale=function(b){this.p=a.CreatePoint(b);this.apply=function(b){b.scale(this.p.x||1,this.p.y||this.p.x||1)};this.applyToPoint=function(b){b.applyTransform([this.p.x||0,0,0,this.p.y||0,0,0])}};this.Type.matrix=function(b){this.m=a.ToNumberArray(b);this.apply=function(b){b.transform(this.m[0],this.m[1],this.m[2],this.m[3],this.m[4],this.m[5])};this.applyToPoint=function(b){b.applyTransform(this.m)}};this.Type.SkewBase=function(b){this.base=d.Type.matrix;this.base(b);this.angle=
new a.Property("angle",b)};this.Type.SkewBase.prototype=new this.Type.matrix;this.Type.skewX=function(b){this.base=d.Type.SkewBase;this.base(b);this.m=[1,0,Math.tan(this.angle.Angle.toRadians()),1,0,0]};this.Type.skewX.prototype=new this.Type.SkewBase;this.Type.skewY=function(b){this.base=d.Type.SkewBase;this.base(b);this.m=[1,Math.tan(this.angle.Angle.toRadians()),0,1,0,0]};this.Type.skewY.prototype=new this.Type.SkewBase;this.transforms=[];this.apply=function(b){for(var a=0;a<this.transforms.length;a++)this.transforms[a].apply(b)};
this.applyToPoint=function(b){for(var a=0;a<this.transforms.length;a++)this.transforms[a].applyToPoint(b)};for(var c=a.trim(a.compressSpaces(c)).split(/\s(?=[a-z])/),b=0;b<c.length;b++){var k=c[b].split("(")[0],e=c[b].split("(")[1].replace(")","");this.transforms.push(new this.Type[k](e))}};a.AspectRatio=function(c,d,b,k,e,f,g,h,j,l){var d=a.compressSpaces(d),d=d.replace(/^defer\s/,""),o=d.split(" ")[0]||"xMidYMid",d=d.split(" ")[1]||"meet",n=b/k,q=e/f,p=Math.min(n,q),m=Math.max(n,q);d=="meet"&&(k*=
p,f*=p);d=="slice"&&(k*=m,f*=m);j=new a.Property("refX",j);l=new a.Property("refY",l);j.hasValue()&&l.hasValue()?c.translate(-p*j.Length.toPixels("x"),-p*l.Length.toPixels("y")):(o.match(/^xMid/)&&(d=="meet"&&p==q||d=="slice"&&m==q)&&c.translate(b/2-k/2,0),o.match(/YMid$/)&&(d=="meet"&&p==n||d=="slice"&&m==n)&&c.translate(0,e/2-f/2),o.match(/^xMax/)&&(d=="meet"&&p==q||d=="slice"&&m==q)&&c.translate(b-k,0),o.match(/YMax$/)&&(d=="meet"&&p==n||d=="slice"&&m==n)&&c.translate(0,e-f));o=="none"?c.scale(n,
q):d=="meet"?c.scale(p,p):d=="slice"&&c.scale(m,m);c.translate(g==null?0:-g,h==null?0:-h)};a.Element={};a.Element.ElementBase=function(c){this.attributes={};this.styles={};this.children=[];this.attribute=function(b,d){var c=this.attributes[b];if(c!=null)return c;c=new a.Property(b,"");d==!0&&(this.attributes[b]=c);return c};this.style=function(b,d){var c=this.styles[b];if(c!=null)return c;c=this.attribute(b);if(c!=null&&c.hasValue())return c;c=this.parent;if(c!=null&&(c=c.style(b),c!=null&&c.hasValue()))return c;
c=new a.Property(b,"");d==!0&&(this.styles[b]=c);return c};this.render=function(b){if(this.style("display").value!="none"&&this.attribute("visibility").value!="hidden"){b.save();this.setContext(b);if(this.attribute("mask").hasValue()){var a=this.attribute("mask").Definition.getDefinition();a!=null&&a.apply(b,this)}else this.style("filter").hasValue()?(a=this.style("filter").Definition.getDefinition(),a!=null&&a.apply(b,this)):this.renderChildren(b);this.clearContext(b);b.restore()}};this.setContext=
function(){};this.clearContext=function(){};this.renderChildren=function(b){for(var a=0;a<this.children.length;a++)this.children[a].render(b)};this.addChild=function(b,d){var c=b;d&&(c=a.CreateElement(b));c.parent=this;this.children.push(c)};if(c!=null&&c.nodeType==1){for(var d=0;d<c.childNodes.length;d++){var b=c.childNodes[d];b.nodeType==1&&this.addChild(b,!0)}for(d=0;d<c.attributes.length;d++)b=c.attributes[d],this.attributes[b.nodeName]=new a.Property(b.nodeName,b.nodeValue);b=a.Styles[c.nodeName];
if(b!=null)for(var k in b)this.styles[k]=b[k];if(this.attribute("class").hasValue())for(var d=a.compressSpaces(this.attribute("class").value).split(" "),e=0;e<d.length;e++){b=a.Styles["."+d[e]];if(b!=null)for(k in b)this.styles[k]=b[k];b=a.Styles[c.nodeName+"."+d[e]];if(b!=null)for(k in b)this.styles[k]=b[k]}if(this.attribute("style").hasValue()){b=this.attribute("style").value.split(";");for(d=0;d<b.length;d++)a.trim(b[d])!=""&&(c=b[d].split(":"),k=a.trim(c[0]),c=a.trim(c[1]),this.styles[k]=new a.Property(k,
c))}this.attribute("id").hasValue()&&a.Definitions[this.attribute("id").value]==null&&(a.Definitions[this.attribute("id").value]=this)}};a.Element.RenderedElementBase=function(c){this.base=a.Element.ElementBase;this.base(c);this.setContext=function(d){if(this.style("fill").Definition.isUrl()){var b=this.style("fill").Definition.getFillStyle(this);if(b!=null)d.fillStyle=b}else if(this.style("fill").hasValue())b=this.style("fill"),this.style("fill-opacity").hasValue()&&(b=b.Color.addOpacity(this.style("fill-opacity").value)),
d.fillStyle=b.value=="none"?"rgba(0,0,0,0)":b.value;if(this.style("stroke").Definition.isUrl()){if(b=this.style("stroke").Definition.getFillStyle(this),b!=null)d.strokeStyle=b}else if(this.style("stroke").hasValue())b=this.style("stroke"),this.style("stroke-opacity").hasValue()&&(b=b.Color.addOpacity(this.style("stroke-opacity").value)),d.strokeStyle=b.value=="none"?"rgba(0,0,0,0)":b.value;if(this.style("stroke-width").hasValue())d.lineWidth=this.style("stroke-width").Length.toPixels();if(this.style("stroke-linecap").hasValue())d.lineCap=
this.style("stroke-linecap").value;if(this.style("stroke-linejoin").hasValue())d.lineJoin=this.style("stroke-linejoin").value;if(this.style("stroke-miterlimit").hasValue())d.miterLimit=this.style("stroke-miterlimit").value;if(typeof d.font!="undefined")d.font=a.Font.CreateFont(this.style("font-style").value,this.style("font-variant").value,this.style("font-weight").value,this.style("font-size").hasValue()?this.style("font-size").Length.toPixels()+"px":"",this.style("font-family").value).toString();
this.attribute("transform").hasValue()&&(new a.Transform(this.attribute("transform").value)).apply(d);this.attribute("clip-path").hasValue()&&(b=this.attribute("clip-path").Definition.getDefinition(),b!=null&&b.apply(d));if(this.style("opacity").hasValue())d.globalAlpha=this.style("opacity").numValue()}};a.Element.RenderedElementBase.prototype=new a.Element.ElementBase;a.Element.PathElementBase=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.path=function(d){d!=null&&d.beginPath();
return new a.BoundingBox};this.renderChildren=function(d){this.path(d);a.Mouse.checkPath(this,d);d.fillStyle!=""&&d.fill();d.strokeStyle!=""&&d.stroke();var b=this.getMarkers();if(b!=null){if(this.style("marker-start").Definition.isUrl()){var c=this.style("marker-start").Definition.getDefinition();c.render(d,b[0][0],b[0][1])}if(this.style("marker-mid").Definition.isUrl())for(var c=this.style("marker-mid").Definition.getDefinition(),e=1;e<b.length-1;e++)c.render(d,b[e][0],b[e][1]);this.style("marker-end").Definition.isUrl()&&
(c=this.style("marker-end").Definition.getDefinition(),c.render(d,b[b.length-1][0],b[b.length-1][1]))}};this.getBoundingBox=function(){return this.path()};this.getMarkers=function(){return null}};a.Element.PathElementBase.prototype=new a.Element.RenderedElementBase;a.Element.svg=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.baseClearContext=this.clearContext;this.clearContext=function(d){this.baseClearContext(d);a.ViewPort.RemoveCurrent()};this.baseSetContext=this.setContext;
this.setContext=function(d){d.strokeStyle="rgba(0,0,0,0)";d.lineCap="butt";d.lineJoin="miter";d.miterLimit=4;this.baseSetContext(d);this.attribute("x").hasValue()&&this.attribute("y").hasValue()&&d.translate(this.attribute("x").Length.toPixels("x"),this.attribute("y").Length.toPixels("y"));var b=a.ViewPort.width(),c=a.ViewPort.height();if(typeof this.root=="undefined"&&this.attribute("width").hasValue()&&this.attribute("height").hasValue()){var b=this.attribute("width").Length.toPixels("x"),c=this.attribute("height").Length.toPixels("y"),
e=0,f=0;this.attribute("refX").hasValue()&&this.attribute("refY").hasValue()&&(e=-this.attribute("refX").Length.toPixels("x"),f=-this.attribute("refY").Length.toPixels("y"));d.beginPath();d.moveTo(e,f);d.lineTo(b,f);d.lineTo(b,c);d.lineTo(e,c);d.closePath();d.clip()}a.ViewPort.SetCurrent(b,c);if(this.attribute("viewBox").hasValue()){var e=a.ToNumberArray(this.attribute("viewBox").value),f=e[0],g=e[1],b=e[2],c=e[3];a.AspectRatio(d,this.attribute("preserveAspectRatio").value,a.ViewPort.width(),b,a.ViewPort.height(),
c,f,g,this.attribute("refX").value,this.attribute("refY").value);a.ViewPort.RemoveCurrent();a.ViewPort.SetCurrent(e[2],e[3])}}};a.Element.svg.prototype=new a.Element.RenderedElementBase;a.Element.rect=function(c){this.base=a.Element.PathElementBase;this.base(c);this.path=function(d){var b=this.attribute("x").Length.toPixels("x"),c=this.attribute("y").Length.toPixels("y"),e=this.attribute("width").Length.toPixels("x"),f=this.attribute("height").Length.toPixels("y"),g=this.attribute("rx").Length.toPixels("x"),
h=this.attribute("ry").Length.toPixels("y");this.attribute("rx").hasValue()&&!this.attribute("ry").hasValue()&&(h=g);this.attribute("ry").hasValue()&&!this.attribute("rx").hasValue()&&(g=h);d!=null&&(d.beginPath(),d.moveTo(b+g,c),d.lineTo(b+e-g,c),d.quadraticCurveTo(b+e,c,b+e,c+h),d.lineTo(b+e,c+f-h),d.quadraticCurveTo(b+e,c+f,b+e-g,c+f),d.lineTo(b+g,c+f),d.quadraticCurveTo(b,c+f,b,c+f-h),d.lineTo(b,c+h),d.quadraticCurveTo(b,c,b+g,c),d.closePath());return new a.BoundingBox(b,c,b+e,c+f)}};a.Element.rect.prototype=
new a.Element.PathElementBase;a.Element.circle=function(c){this.base=a.Element.PathElementBase;this.base(c);this.path=function(d){var b=this.attribute("cx").Length.toPixels("x"),c=this.attribute("cy").Length.toPixels("y"),e=this.attribute("r").Length.toPixels();d!=null&&(d.beginPath(),d.arc(b,c,e,0,Math.PI*2,!0),d.closePath());return new a.BoundingBox(b-e,c-e,b+e,c+e)}};a.Element.circle.prototype=new a.Element.PathElementBase;a.Element.ellipse=function(c){this.base=a.Element.PathElementBase;this.base(c);
this.path=function(d){var b=4*((Math.sqrt(2)-1)/3),c=this.attribute("rx").Length.toPixels("x"),e=this.attribute("ry").Length.toPixels("y"),f=this.attribute("cx").Length.toPixels("x"),g=this.attribute("cy").Length.toPixels("y");d!=null&&(d.beginPath(),d.moveTo(f,g-e),d.bezierCurveTo(f+b*c,g-e,f+c,g-b*e,f+c,g),d.bezierCurveTo(f+c,g+b*e,f+b*c,g+e,f,g+e),d.bezierCurveTo(f-b*c,g+e,f-c,g+b*e,f-c,g),d.bezierCurveTo(f-c,g-b*e,f-b*c,g-e,f,g-e),d.closePath());return new a.BoundingBox(f-c,g-e,f+c,g+e)}};a.Element.ellipse.prototype=
new a.Element.PathElementBase;a.Element.line=function(c){this.base=a.Element.PathElementBase;this.base(c);this.getPoints=function(){return[new a.Point(this.attribute("x1").Length.toPixels("x"),this.attribute("y1").Length.toPixels("y")),new a.Point(this.attribute("x2").Length.toPixels("x"),this.attribute("y2").Length.toPixels("y"))]};this.path=function(d){var b=this.getPoints();d!=null&&(d.beginPath(),d.moveTo(b[0].x,b[0].y),d.lineTo(b[1].x,b[1].y));return new a.BoundingBox(b[0].x,b[0].y,b[1].x,b[1].y)};
this.getMarkers=function(){var a=this.getPoints(),b=a[0].angleTo(a[1]);return[[a[0],b],[a[1],b]]}};a.Element.line.prototype=new a.Element.PathElementBase;a.Element.polyline=function(c){this.base=a.Element.PathElementBase;this.base(c);this.points=a.CreatePath(this.attribute("points").value);this.path=function(d){var b=new a.BoundingBox(this.points[0].x,this.points[0].y);d!=null&&(d.beginPath(),d.moveTo(this.points[0].x,this.points[0].y));for(var c=1;c<this.points.length;c++)b.addPoint(this.points[c].x,
this.points[c].y),d!=null&&d.lineTo(this.points[c].x,this.points[c].y);return b};this.getMarkers=function(){for(var a=[],b=0;b<this.points.length-1;b++)a.push([this.points[b],this.points[b].angleTo(this.points[b+1])]);a.push([this.points[this.points.length-1],a[a.length-1][1]]);return a}};a.Element.polyline.prototype=new a.Element.PathElementBase;a.Element.polygon=function(c){this.base=a.Element.polyline;this.base(c);this.basePath=this.path;this.path=function(a){var b=this.basePath(a);a!=null&&(a.lineTo(this.points[0].x,
this.points[0].y),a.closePath());return b}};a.Element.polygon.prototype=new a.Element.polyline;a.Element.path=function(c){this.base=a.Element.PathElementBase;this.base(c);c=this.attribute("d").value;c=c.replace(/,/gm," ");c=c.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");c=c.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");c=c.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,"$1 $2");c=c.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,"$1 $2");c=c.replace(/([0-9])([+\-])/gm,
"$1 $2");c=c.replace(/(\.[0-9]*)(\.)/gm,"$1 $2");c=c.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,"$1 $3 $4 ");c=a.compressSpaces(c);c=a.trim(c);this.PathParser=new function(d){this.tokens=d.split(" ");this.reset=function(){this.i=-1;this.previousCommand=this.command="";this.start=new a.Point(0,0);this.control=new a.Point(0,0);this.current=new a.Point(0,0);this.points=[];this.angles=[]};this.isEnd=function(){return this.i>=this.tokens.length-1};this.isCommandOrEnd=function(){return this.isEnd()?
!0:this.tokens[this.i+1].match(/^[A-Za-z]$/)!=null};this.isRelativeCommand=function(){return this.command==this.command.toLowerCase()};this.getToken=function(){this.i+=1;return this.tokens[this.i]};this.getScalar=function(){return parseFloat(this.getToken())};this.nextCommand=function(){this.previousCommand=this.command;this.command=this.getToken()};this.getPoint=function(){return this.makeAbsolute(new a.Point(this.getScalar(),this.getScalar()))};this.getAsControlPoint=function(){var b=this.getPoint();
return this.control=b};this.getAsCurrentPoint=function(){var b=this.getPoint();return this.current=b};this.getReflectedControlPoint=function(){return this.previousCommand.toLowerCase()!="c"&&this.previousCommand.toLowerCase()!="s"?this.current:new a.Point(2*this.current.x-this.control.x,2*this.current.y-this.control.y)};this.makeAbsolute=function(b){if(this.isRelativeCommand())b.x=this.current.x+b.x,b.y=this.current.y+b.y;return b};this.addMarker=function(b,a,d){d!=null&&this.angles.length>0&&this.angles[this.angles.length-
1]==null&&(this.angles[this.angles.length-1]=this.points[this.points.length-1].angleTo(d));this.addMarkerAngle(b,a==null?null:a.angleTo(b))};this.addMarkerAngle=function(b,a){this.points.push(b);this.angles.push(a)};this.getMarkerPoints=function(){return this.points};this.getMarkerAngles=function(){for(var b=0;b<this.angles.length;b++)if(this.angles[b]==null)for(var a=b+1;a<this.angles.length;a++)if(this.angles[a]!=null){this.angles[b]=this.angles[a];break}return this.angles}}(c);this.path=function(d){var b=
this.PathParser;b.reset();var c=new a.BoundingBox;for(d!=null&&d.beginPath();!b.isEnd();)switch(b.nextCommand(),b.command.toUpperCase()){case "M":var e=b.getAsCurrentPoint();b.addMarker(e);c.addPoint(e.x,e.y);d!=null&&d.moveTo(e.x,e.y);for(b.start=b.current;!b.isCommandOrEnd();)e=b.getAsCurrentPoint(),b.addMarker(e,b.start),c.addPoint(e.x,e.y),d!=null&&d.lineTo(e.x,e.y);break;case "L":for(;!b.isCommandOrEnd();){var f=b.current,e=b.getAsCurrentPoint();b.addMarker(e,f);c.addPoint(e.x,e.y);d!=null&&
d.lineTo(e.x,e.y)}break;case "H":for(;!b.isCommandOrEnd();)e=new a.Point((b.isRelativeCommand()?b.current.x:0)+b.getScalar(),b.current.y),b.addMarker(e,b.current),b.current=e,c.addPoint(b.current.x,b.current.y),d!=null&&d.lineTo(b.current.x,b.current.y);break;case "V":for(;!b.isCommandOrEnd();)e=new a.Point(b.current.x,(b.isRelativeCommand()?b.current.y:0)+b.getScalar()),b.addMarker(e,b.current),b.current=e,c.addPoint(b.current.x,b.current.y),d!=null&&d.lineTo(b.current.x,b.current.y);break;case "C":for(;!b.isCommandOrEnd();){var g=
b.current,f=b.getPoint(),h=b.getAsControlPoint(),e=b.getAsCurrentPoint();b.addMarker(e,h,f);c.addBezierCurve(g.x,g.y,f.x,f.y,h.x,h.y,e.x,e.y);d!=null&&d.bezierCurveTo(f.x,f.y,h.x,h.y,e.x,e.y)}break;case "S":for(;!b.isCommandOrEnd();)g=b.current,f=b.getReflectedControlPoint(),h=b.getAsControlPoint(),e=b.getAsCurrentPoint(),b.addMarker(e,h,f),c.addBezierCurve(g.x,g.y,f.x,f.y,h.x,h.y,e.x,e.y),d!=null&&d.bezierCurveTo(f.x,f.y,h.x,h.y,e.x,e.y);break;case "Q":for(;!b.isCommandOrEnd();)g=b.current,h=b.getAsControlPoint(),
e=b.getAsCurrentPoint(),b.addMarker(e,h,h),c.addQuadraticCurve(g.x,g.y,h.x,h.y,e.x,e.y),d!=null&&d.quadraticCurveTo(h.x,h.y,e.x,e.y);break;case "T":for(;!b.isCommandOrEnd();)g=b.current,h=b.getReflectedControlPoint(),b.control=h,e=b.getAsCurrentPoint(),b.addMarker(e,h,h),c.addQuadraticCurve(g.x,g.y,h.x,h.y,e.x,e.y),d!=null&&d.quadraticCurveTo(h.x,h.y,e.x,e.y);break;case "A":for(;!b.isCommandOrEnd();){var g=b.current,j=b.getScalar(),l=b.getScalar(),f=b.getScalar()*(Math.PI/180),o=b.getScalar(),h=b.getScalar(),
e=b.getAsCurrentPoint(),n=new a.Point(Math.cos(f)*(g.x-e.x)/2+Math.sin(f)*(g.y-e.y)/2,-Math.sin(f)*(g.x-e.x)/2+Math.cos(f)*(g.y-e.y)/2),q=Math.pow(n.x,2)/Math.pow(j,2)+Math.pow(n.y,2)/Math.pow(l,2);q>1&&(j*=Math.sqrt(q),l*=Math.sqrt(q));o=(o==h?-1:1)*Math.sqrt((Math.pow(j,2)*Math.pow(l,2)-Math.pow(j,2)*Math.pow(n.y,2)-Math.pow(l,2)*Math.pow(n.x,2))/(Math.pow(j,2)*Math.pow(n.y,2)+Math.pow(l,2)*Math.pow(n.x,2)));isNaN(o)&&(o=0);var p=new a.Point(o*j*n.y/l,o*-l*n.x/j),g=new a.Point((g.x+e.x)/2+Math.cos(f)*
p.x-Math.sin(f)*p.y,(g.y+e.y)/2+Math.sin(f)*p.x+Math.cos(f)*p.y),m=function(b,a){return(b[0]*a[0]+b[1]*a[1])/(Math.sqrt(Math.pow(b[0],2)+Math.pow(b[1],2))*Math.sqrt(Math.pow(a[0],2)+Math.pow(a[1],2)))},s=function(b,a){return(b[0]*a[1]<b[1]*a[0]?-1:1)*Math.acos(m(b,a))},o=s([1,0],[(n.x-p.x)/j,(n.y-p.y)/l]),q=[(n.x-p.x)/j,(n.y-p.y)/l],p=[(-n.x-p.x)/j,(-n.y-p.y)/l],n=s(q,p);if(m(q,p)<=-1)n=Math.PI;m(q,p)>=1&&(n=0);h==0&&n>0&&(n-=2*Math.PI);h==1&&n<0&&(n+=2*Math.PI);q=new a.Point(g.x-j*Math.cos((o+n)/
2),g.y-l*Math.sin((o+n)/2));b.addMarkerAngle(q,(o+n)/2+(h==0?1:-1)*Math.PI/2);b.addMarkerAngle(e,n+(h==0?1:-1)*Math.PI/2);c.addPoint(e.x,e.y);d!=null&&(m=j>l?j:l,e=j>l?1:j/l,j=j>l?l/j:1,d.translate(g.x,g.y),d.rotate(f),d.scale(e,j),d.arc(0,0,m,o,o+n,1-h),d.scale(1/e,1/j),d.rotate(-f),d.translate(-g.x,-g.y))}break;case "Z":d!=null&&d.closePath(),b.current=b.start}return c};this.getMarkers=function(){for(var a=this.PathParser.getMarkerPoints(),b=this.PathParser.getMarkerAngles(),c=[],e=0;e<a.length;e++)c.push([a[e],
b[e]]);return c}};a.Element.path.prototype=new a.Element.PathElementBase;a.Element.pattern=function(c){this.base=a.Element.ElementBase;this.base(c);this.createPattern=function(d){var b=new a.Element.svg;b.attributes.viewBox=new a.Property("viewBox",this.attribute("viewBox").value);b.attributes.x=new a.Property("x",this.attribute("x").value);b.attributes.y=new a.Property("y",this.attribute("y").value);b.attributes.width=new a.Property("width",this.attribute("width").value);b.attributes.height=new a.Property("height",
this.attribute("height").value);b.children=this.children;var c=document.createElement("canvas");c.width=this.attribute("width").Length.toPixels("x");c.height=this.attribute("height").Length.toPixels("y");b.render(c.getContext("2d"));return d.createPattern(c,"repeat")}};a.Element.pattern.prototype=new a.Element.ElementBase;a.Element.marker=function(c){this.base=a.Element.ElementBase;this.base(c);this.baseRender=this.render;this.render=function(d,b,c){d.translate(b.x,b.y);this.attribute("orient").valueOrDefault("auto")==
"auto"&&d.rotate(c);this.attribute("markerUnits").valueOrDefault("strokeWidth")=="strokeWidth"&&d.scale(d.lineWidth,d.lineWidth);d.save();var e=new a.Element.svg;e.attributes.viewBox=new a.Property("viewBox",this.attribute("viewBox").value);e.attributes.refX=new a.Property("refX",this.attribute("refX").value);e.attributes.refY=new a.Property("refY",this.attribute("refY").value);e.attributes.width=new a.Property("width",this.attribute("markerWidth").value);e.attributes.height=new a.Property("height",
this.attribute("markerHeight").value);e.attributes.fill=new a.Property("fill",this.attribute("fill").valueOrDefault("black"));e.attributes.stroke=new a.Property("stroke",this.attribute("stroke").valueOrDefault("none"));e.children=this.children;e.render(d);d.restore();this.attribute("markerUnits").valueOrDefault("strokeWidth")=="strokeWidth"&&d.scale(1/d.lineWidth,1/d.lineWidth);this.attribute("orient").valueOrDefault("auto")=="auto"&&d.rotate(-c);d.translate(-b.x,-b.y)}};a.Element.marker.prototype=
new a.Element.ElementBase;a.Element.defs=function(c){this.base=a.Element.ElementBase;this.base(c);this.render=function(){}};a.Element.defs.prototype=new a.Element.ElementBase;a.Element.GradientBase=function(c){this.base=a.Element.ElementBase;this.base(c);this.gradientUnits=this.attribute("gradientUnits").valueOrDefault("objectBoundingBox");this.stops=[];for(c=0;c<this.children.length;c++)this.stops.push(this.children[c]);this.getGradient=function(){};this.createGradient=function(d,b){var c=this;this.attribute("xlink:href").hasValue()&&
(c=this.attribute("xlink:href").Definition.getDefinition());for(var e=this.getGradient(d,b),f=0;f<c.stops.length;f++)e.addColorStop(c.stops[f].offset,c.stops[f].color);if(this.attribute("gradientTransform").hasValue()){c=a.ViewPort.viewPorts[0];f=new a.Element.rect;f.attributes.x=new a.Property("x",-a.MAX_VIRTUAL_PIXELS/3);f.attributes.y=new a.Property("y",-a.MAX_VIRTUAL_PIXELS/3);f.attributes.width=new a.Property("width",a.MAX_VIRTUAL_PIXELS);f.attributes.height=new a.Property("height",a.MAX_VIRTUAL_PIXELS);
var g=new a.Element.g;g.attributes.transform=new a.Property("transform",this.attribute("gradientTransform").value);g.children=[f];f=new a.Element.svg;f.attributes.x=new a.Property("x",0);f.attributes.y=new a.Property("y",0);f.attributes.width=new a.Property("width",c.width);f.attributes.height=new a.Property("height",c.height);f.children=[g];g=document.createElement("canvas");g.width=c.width;g.height=c.height;c=g.getContext("2d");c.fillStyle=e;f.render(c);return c.createPattern(g,"no-repeat")}return e}};
a.Element.GradientBase.prototype=new a.Element.ElementBase;a.Element.linearGradient=function(c){this.base=a.Element.GradientBase;this.base(c);this.getGradient=function(a,b){var c=b.getBoundingBox(),e=this.gradientUnits=="objectBoundingBox"?c.x()+c.width()*this.attribute("x1").numValue():this.attribute("x1").Length.toPixels("x"),f=this.gradientUnits=="objectBoundingBox"?c.y()+c.height()*this.attribute("y1").numValue():this.attribute("y1").Length.toPixels("y"),g=this.gradientUnits=="objectBoundingBox"?
c.x()+c.width()*this.attribute("x2").numValue():this.attribute("x2").Length.toPixels("x"),c=this.gradientUnits=="objectBoundingBox"?c.y()+c.height()*this.attribute("y2").numValue():this.attribute("y2").Length.toPixels("y");return a.createLinearGradient(e,f,g,c)}};a.Element.linearGradient.prototype=new a.Element.GradientBase;a.Element.radialGradient=function(c){this.base=a.Element.GradientBase;this.base(c);this.getGradient=function(a,b){var c=b.getBoundingBox(),e=this.gradientUnits=="objectBoundingBox"?
c.x()+c.width()*this.attribute("cx").numValue():this.attribute("cx").Length.toPixels("x"),f=this.gradientUnits=="objectBoundingBox"?c.y()+c.height()*this.attribute("cy").numValue():this.attribute("cy").Length.toPixels("y"),g=e,h=f;this.attribute("fx").hasValue()&&(g=this.gradientUnits=="objectBoundingBox"?c.x()+c.width()*this.attribute("fx").numValue():this.attribute("fx").Length.toPixels("x"));this.attribute("fy").hasValue()&&(h=this.gradientUnits=="objectBoundingBox"?c.y()+c.height()*this.attribute("fy").numValue():
this.attribute("fy").Length.toPixels("y"));c=this.gradientUnits=="objectBoundingBox"?(c.width()+c.height())/2*this.attribute("r").numValue():this.attribute("r").Length.toPixels();return a.createRadialGradient(g,h,0,e,f,c)}};a.Element.radialGradient.prototype=new a.Element.GradientBase;a.Element.stop=function(c){this.base=a.Element.ElementBase;this.base(c);this.offset=this.attribute("offset").numValue();c=this.style("stop-color");this.style("stop-opacity").hasValue()&&(c=c.Color.addOpacity(this.style("stop-opacity").value));
this.color=c.value};a.Element.stop.prototype=new a.Element.ElementBase;a.Element.AnimateBase=function(c){this.base=a.Element.ElementBase;this.base(c);a.Animations.push(this);this.duration=0;this.begin=this.attribute("begin").Time.toMilliseconds();this.maxDuration=this.begin+this.attribute("dur").Time.toMilliseconds();this.getProperty=function(){var a=this.attribute("attributeType").value,b=this.attribute("attributeName").value;return a=="CSS"?this.parent.style(b,!0):this.parent.attribute(b,!0)};this.initialValue=
null;this.removed=!1;this.calcValue=function(){return""};this.update=function(a){if(this.initialValue==null)this.initialValue=this.getProperty().value;if(this.duration>this.maxDuration)if(this.attribute("repeatCount").value=="indefinite")this.duration=0;else return this.attribute("fill").valueOrDefault("remove")=="remove"&&!this.removed?(this.removed=!0,this.getProperty().value=this.initialValue,!0):!1;this.duration+=a;a=!1;if(this.begin<this.duration)a=this.calcValue(),this.attribute("type").hasValue()&&
(a=this.attribute("type").value+"("+a+")"),this.getProperty().value=a,a=!0;return a};this.progress=function(){return(this.duration-this.begin)/(this.maxDuration-this.begin)}};a.Element.AnimateBase.prototype=new a.Element.ElementBase;a.Element.animate=function(c){this.base=a.Element.AnimateBase;this.base(c);this.calcValue=function(){var a=this.attribute("from").numValue(),b=this.attribute("to").numValue();return a+(b-a)*this.progress()}};a.Element.animate.prototype=new a.Element.AnimateBase;a.Element.animateColor=
function(c){this.base=a.Element.AnimateBase;this.base(c);this.calcValue=function(){var a=new RGBColor(this.attribute("from").value),b=new RGBColor(this.attribute("to").value);if(a.ok&&b.ok){var c=a.r+(b.r-a.r)*this.progress(),e=a.g+(b.g-a.g)*this.progress(),a=a.b+(b.b-a.b)*this.progress();return"rgb("+parseInt(c,10)+","+parseInt(e,10)+","+parseInt(a,10)+")"}return this.attribute("from").value}};a.Element.animateColor.prototype=new a.Element.AnimateBase;a.Element.animateTransform=function(c){this.base=
a.Element.animate;this.base(c)};a.Element.animateTransform.prototype=new a.Element.animate;a.Element.font=function(c){this.base=a.Element.ElementBase;this.base(c);this.horizAdvX=this.attribute("horiz-adv-x").numValue();this.isArabic=this.isRTL=!1;this.missingGlyph=this.fontFace=null;this.glyphs=[];for(c=0;c<this.children.length;c++){var d=this.children[c];if(d.type=="font-face")this.fontFace=d,d.style("font-family").hasValue()&&(a.Definitions[d.style("font-family").value]=this);else if(d.type=="missing-glyph")this.missingGlyph=
d;else if(d.type=="glyph")d.arabicForm!=""?(this.isArabic=this.isRTL=!0,typeof this.glyphs[d.unicode]=="undefined"&&(this.glyphs[d.unicode]=[]),this.glyphs[d.unicode][d.arabicForm]=d):this.glyphs[d.unicode]=d}};a.Element.font.prototype=new a.Element.ElementBase;a.Element.fontface=function(c){this.base=a.Element.ElementBase;this.base(c);this.ascent=this.attribute("ascent").value;this.descent=this.attribute("descent").value;this.unitsPerEm=this.attribute("units-per-em").numValue()};a.Element.fontface.prototype=
new a.Element.ElementBase;a.Element.missingglyph=function(c){this.base=a.Element.path;this.base(c);this.horizAdvX=0};a.Element.missingglyph.prototype=new a.Element.path;a.Element.glyph=function(c){this.base=a.Element.path;this.base(c);this.horizAdvX=this.attribute("horiz-adv-x").numValue();this.unicode=this.attribute("unicode").value;this.arabicForm=this.attribute("arabic-form").value};a.Element.glyph.prototype=new a.Element.path;a.Element.text=function(c){this.base=a.Element.RenderedElementBase;
this.base(c);if(c!=null){this.children=[];for(var d=0;d<c.childNodes.length;d++){var b=c.childNodes[d];b.nodeType==1?this.addChild(b,!0):b.nodeType==3&&this.addChild(new a.Element.tspan(b),!1)}}this.baseSetContext=this.setContext;this.setContext=function(b){this.baseSetContext(b);if(this.style("dominant-baseline").hasValue())b.textBaseline=this.style("dominant-baseline").value;if(this.style("alignment-baseline").hasValue())b.textBaseline=this.style("alignment-baseline").value};this.renderChildren=
function(b){for(var a=this.style("text-anchor").valueOrDefault("start"),c=this.attribute("x").Length.toPixels("x"),d=this.attribute("y").Length.toPixels("y"),h=0;h<this.children.length;h++){var j=this.children[h];j.attribute("x").hasValue()?j.x=j.attribute("x").Length.toPixels("x"):(j.attribute("dx").hasValue()&&(c+=j.attribute("dx").Length.toPixels("x")),j.x=c);c=j.measureText?j.measureText(b):0;if(a!="start"&&(h==0||j.attribute("x").hasValue())){for(var l=c,o=h+1;o<this.children.length;o++){var n=
this.children[o];if(n.attribute("x").hasValue())break;l+=n.measureText?n.measureText(b):0}j.x-=a=="end"?l:l/2}c=j.x+c;j.attribute("y").hasValue()?j.y=j.attribute("y").Length.toPixels("y"):(j.attribute("dy").hasValue()&&(d+=j.attribute("dy").Length.toPixels("y")),j.y=d);d=j.y;j.render(b)}}};a.Element.text.prototype=new a.Element.RenderedElementBase;a.Element.TextElementBase=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.getGlyph=function(a,b,c){var e=b[c],f=null;if(a.isArabic){var g=
"isolated";if((c==0||b[c-1]==" ")&&c<b.length-2&&b[c+1]!=" ")g="terminal";c>0&&b[c-1]!=" "&&c<b.length-2&&b[c+1]!=" "&&(g="medial");if(c>0&&b[c-1]!=" "&&(c==b.length-1||b[c+1]==" "))g="initial";typeof a.glyphs[e]!="undefined"&&(f=a.glyphs[e][g],f==null&&a.glyphs[e].type=="glyph"&&(f=a.glyphs[e]))}else f=a.glyphs[e];if(f==null)f=a.missingGlyph;return f};this.renderChildren=function(c){var b=this.parent.style("font-family").Definition.getDefinition();if(b!=null){var k=this.parent.style("font-size").numValueOrDefault(a.Font.Parse(a.ctx.font).fontSize),
e=this.parent.style("font-style").valueOrDefault(a.Font.Parse(a.ctx.font).fontStyle),f=this.getText();b.isRTL&&(f=f.split("").reverse().join(""));for(var g=a.ToNumberArray(this.parent.attribute("dx").value),h=0;h<f.length;h++){var j=this.getGlyph(b,f,h),l=k/b.fontFace.unitsPerEm;c.translate(this.x,this.y);c.scale(l,-l);var o=c.lineWidth;c.lineWidth=c.lineWidth*b.fontFace.unitsPerEm/k;e=="italic"&&c.transform(1,0,0.4,1,0,0);j.render(c);e=="italic"&&c.transform(1,0,-0.4,1,0,0);c.lineWidth=o;c.scale(1/
l,-1/l);c.translate(-this.x,-this.y);this.x+=k*(j.horizAdvX||b.horizAdvX)/b.fontFace.unitsPerEm;typeof g[h]!="undefined"&&!isNaN(g[h])&&(this.x+=g[h])}}else c.strokeStyle!=""&&c.strokeText(a.compressSpaces(this.getText()),this.x,this.y),c.fillStyle!=""&&c.fillText(a.compressSpaces(this.getText()),this.x,this.y)};this.getText=function(){};this.measureText=function(c){var b=this.parent.style("font-family").Definition.getDefinition();if(b!=null){var c=this.parent.style("font-size").numValueOrDefault(a.Font.Parse(a.ctx.font).fontSize),
k=0,e=this.getText();b.isRTL&&(e=e.split("").reverse().join(""));for(var f=a.ToNumberArray(this.parent.attribute("dx").value),g=0;g<e.length;g++){var h=this.getGlyph(b,e,g);k+=(h.horizAdvX||b.horizAdvX)*c/b.fontFace.unitsPerEm;typeof f[g]!="undefined"&&!isNaN(f[g])&&(k+=f[g])}return k}b=a.compressSpaces(this.getText());if(!c.measureText)return b.length*10;c.save();this.setContext(c);b=c.measureText(b).width;c.restore();return b}};a.Element.TextElementBase.prototype=new a.Element.RenderedElementBase;
a.Element.tspan=function(c){this.base=a.Element.TextElementBase;this.base(c);this.text=c.nodeType==3?c.nodeValue:c.childNodes.length>0?c.childNodes[0].nodeValue:c.text;this.getText=function(){return this.text}};a.Element.tspan.prototype=new a.Element.TextElementBase;a.Element.tref=function(c){this.base=a.Element.TextElementBase;this.base(c);this.getText=function(){var a=this.attribute("xlink:href").Definition.getDefinition();if(a!=null)return a.children[0].getText()}};a.Element.tref.prototype=new a.Element.TextElementBase;
a.Element.a=function(c){this.base=a.Element.TextElementBase;this.base(c);this.hasText=!0;for(var d=0;d<c.childNodes.length;d++)if(c.childNodes[d].nodeType!=3)this.hasText=!1;this.text=this.hasText?c.childNodes[0].nodeValue:"";this.getText=function(){return this.text};this.baseRenderChildren=this.renderChildren;this.renderChildren=function(b){if(this.hasText){this.baseRenderChildren(b);var c=new a.Property("fontSize",a.Font.Parse(a.ctx.font).fontSize);a.Mouse.checkBoundingBox(this,new a.BoundingBox(this.x,
this.y-c.Length.toPixels("y"),this.x+this.measureText(b),this.y))}else c=new a.Element.g,c.children=this.children,c.parent=this,c.render(b)};this.onclick=function(){window.open(this.attribute("xlink:href").value)};this.onmousemove=function(){a.ctx.canvas.style.cursor="pointer"}};a.Element.a.prototype=new a.Element.TextElementBase;a.Element.image=function(c){this.base=a.Element.RenderedElementBase;this.base(c);a.Images.push(this);this.img=document.createElement("img");this.loaded=!1;var d=this;this.img.onload=
function(){d.loaded=!0};this.img.src=this.attribute("xlink:href").value;this.renderChildren=function(b){var c=this.attribute("x").Length.toPixels("x"),d=this.attribute("y").Length.toPixels("y"),f=this.attribute("width").Length.toPixels("x"),g=this.attribute("height").Length.toPixels("y");f==0||g==0||(b.save(),b.translate(c,d),a.AspectRatio(b,this.attribute("preserveAspectRatio").value,f,this.img.width,g,this.img.height,0,0),b.drawImage(this.img,0,0),b.restore())}};a.Element.image.prototype=new a.Element.RenderedElementBase;
a.Element.g=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.getBoundingBox=function(){for(var c=new a.BoundingBox,b=0;b<this.children.length;b++)c.addBoundingBox(this.children[b].getBoundingBox());return c}};a.Element.g.prototype=new a.Element.RenderedElementBase;a.Element.symbol=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.baseSetContext=this.setContext;this.setContext=function(c){this.baseSetContext(c);if(this.attribute("viewBox").hasValue()){var b=
a.ToNumberArray(this.attribute("viewBox").value),k=b[0],e=b[1];width=b[2];height=b[3];a.AspectRatio(c,this.attribute("preserveAspectRatio").value,this.attribute("width").Length.toPixels("x"),width,this.attribute("height").Length.toPixels("y"),height,k,e);a.ViewPort.SetCurrent(b[2],b[3])}}};a.Element.symbol.prototype=new a.Element.RenderedElementBase;a.Element.style=function(c){this.base=a.Element.ElementBase;this.base(c);for(var c=c.childNodes[0].nodeValue+(c.childNodes.length>1?c.childNodes[1].nodeValue:
""),c=c.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm,""),c=a.compressSpaces(c),c=c.split("}"),d=0;d<c.length;d++)if(a.trim(c[d])!="")for(var b=c[d].split("{"),k=b[0].split(","),b=b[1].split(";"),e=0;e<k.length;e++){var f=a.trim(k[e]);if(f!=""){for(var g={},h=0;h<b.length;h++){var j=b[h].indexOf(":"),l=b[h].substr(0,j),j=b[h].substr(j+1,b[h].length-j);l!=null&&j!=null&&(g[a.trim(l)]=new a.Property(a.trim(l),a.trim(j)))}a.Styles[f]=g;if(f=="@font-face"){f=g["font-family"].value.replace(/"/g,
"");g=g.src.value.split(",");for(h=0;h<g.length;h++)if(g[h].indexOf('format("svg")')>0){l=g[h].indexOf("url");j=g[h].indexOf(")",l);l=g[h].substr(l+5,j-l-6);l=a.parseXml(a.ajax(l)).getElementsByTagName("font");for(j=0;j<l.length;j++){var o=a.CreateElement(l[j]);a.Definitions[f]=o}}}}}};a.Element.style.prototype=new a.Element.ElementBase;a.Element.use=function(c){this.base=a.Element.RenderedElementBase;this.base(c);this.baseSetContext=this.setContext;this.setContext=function(a){this.baseSetContext(a);
this.attribute("x").hasValue()&&a.translate(this.attribute("x").Length.toPixels("x"),0);this.attribute("y").hasValue()&&a.translate(0,this.attribute("y").Length.toPixels("y"))};this.getDefinition=function(){var a=this.attribute("xlink:href").Definition.getDefinition();if(this.attribute("width").hasValue())a.attribute("width",!0).value=this.attribute("width").value;if(this.attribute("height").hasValue())a.attribute("height",!0).value=this.attribute("height").value;return a};this.path=function(a){var b=
this.getDefinition();b!=null&&b.path(a)};this.renderChildren=function(a){var b=this.getDefinition();b!=null&&b.render(a)}};a.Element.use.prototype=new a.Element.RenderedElementBase;a.Element.mask=function(c){this.base=a.Element.ElementBase;this.base(c);this.apply=function(a,b){var c=this.attribute("x").Length.toPixels("x"),e=this.attribute("y").Length.toPixels("y"),f=this.attribute("width").Length.toPixels("x"),g=this.attribute("height").Length.toPixels("y"),h=b.attribute("mask").value;b.attribute("mask").value=
"";var j=document.createElement("canvas");j.width=c+f;j.height=e+g;var l=j.getContext("2d");this.renderChildren(l);var o=document.createElement("canvas");o.width=c+f;o.height=e+g;var n=o.getContext("2d");b.render(n);n.globalCompositeOperation="destination-in";n.fillStyle=l.createPattern(j,"no-repeat");n.fillRect(0,0,c+f,e+g);a.fillStyle=n.createPattern(o,"no-repeat");a.fillRect(0,0,c+f,e+g);b.attribute("mask").value=h};this.render=function(){}};a.Element.mask.prototype=new a.Element.ElementBase;a.Element.clipPath=
function(c){this.base=a.Element.ElementBase;this.base(c);this.apply=function(a){for(var b=0;b<this.children.length;b++)this.children[b].path&&(this.children[b].path(a),a.clip())};this.render=function(){}};a.Element.clipPath.prototype=new a.Element.ElementBase;a.Element.filter=function(c){this.base=a.Element.ElementBase;this.base(c);this.apply=function(a,b){var c=b.getBoundingBox(),e=this.attribute("x").Length.toPixels("x"),f=this.attribute("y").Length.toPixels("y");if(e==0||f==0)e=c.x1,f=c.y1;var g=
this.attribute("width").Length.toPixels("x"),h=this.attribute("height").Length.toPixels("y");if(g==0||h==0)g=c.width(),h=c.height();c=b.style("filter").value;b.style("filter").value="";var j=0.2*g,l=0.2*h,o=document.createElement("canvas");o.width=g+2*j;o.height=h+2*l;var n=o.getContext("2d");n.translate(-e+j,-f+l);b.render(n);for(var q=0;q<this.children.length;q++)this.children[q].apply(n,0,0,g+2*j,h+2*l);a.drawImage(o,0,0,g+2*j,h+2*l,e-j,f-l,g+2*j,h+2*l);b.style("filter",!0).value=c};this.render=
function(){}};a.Element.filter.prototype=new a.Element.ElementBase;a.Element.feGaussianBlur=function(c){function d(a,c,d,f,g){for(var h=0;h<g;h++)for(var j=0;j<f;j++)for(var l=a[h*f*4+j*4+3]/255,o=0;o<4;o++){for(var n=d[0]*(l==0?255:a[h*f*4+j*4+o])*(l==0||o==3?1:l),q=1;q<d.length;q++){var p=Math.max(j-q,0),m=a[h*f*4+p*4+3]/255,p=Math.min(j+q,f-1),p=a[h*f*4+p*4+3]/255,s=d[q],r;m==0?r=255:(r=Math.max(j-q,0),r=a[h*f*4+r*4+o]);m=r*(m==0||o==3?1:m);p==0?r=255:(r=Math.min(j+q,f-1),r=a[h*f*4+r*4+o]);n+=
s*(m+r*(p==0||o==3?1:p))}c[j*g*4+h*4+o]=n}}this.base=a.Element.ElementBase;this.base(c);this.apply=function(a,c,e,f,g){var e=this.attribute("stdDeviation").numValue(),c=a.getImageData(0,0,f,g),e=Math.max(e,0.01),h=Math.ceil(e*4)+1;mask=[];for(var j=0;j<h;j++)mask[j]=Math.exp(-0.5*(j/e)*(j/e));e=mask;h=0;for(j=1;j<e.length;j++)h+=Math.abs(e[j]);h=2*h+Math.abs(e[0]);for(j=0;j<e.length;j++)e[j]/=h;tmp=[];d(c.data,tmp,e,f,g);d(tmp,c.data,e,g,f);a.clearRect(0,0,f,g);a.putImageData(c,0,0)}};a.Element.filter.prototype=
new a.Element.feGaussianBlur;a.Element.title=function(){};a.Element.title.prototype=new a.Element.ElementBase;a.Element.desc=function(){};a.Element.desc.prototype=new a.Element.ElementBase;a.Element.MISSING=function(a){console.log("ERROR: Element '"+a.nodeName+"' not yet implemented.")};a.Element.MISSING.prototype=new a.Element.ElementBase;a.CreateElement=function(c){var d=c.nodeName.replace(/^[^:]+:/,""),d=d.replace(/\-/g,""),b=null,b=typeof a.Element[d]!="undefined"?new a.Element[d](c):new a.Element.MISSING(c);
b.type=c.nodeName;return b};a.load=function(c,d){a.loadXml(c,a.ajax(d))};a.loadXml=function(c,d){a.loadXmlDoc(c,a.parseXml(d))};a.loadXmlDoc=function(c,d){a.init(c);var b=function(a){for(var b=c.canvas;b;)a.x-=b.offsetLeft,a.y-=b.offsetTop,b=b.offsetParent;window.scrollX&&(a.x+=window.scrollX);window.scrollY&&(a.y+=window.scrollY);return a};if(a.opts.ignoreMouse!=!0)c.canvas.onclick=function(c){c=b(new a.Point(c!=null?c.clientX:event.clientX,c!=null?c.clientY:event.clientY));a.Mouse.onclick(c.x,c.y)},
c.canvas.onmousemove=function(c){c=b(new a.Point(c!=null?c.clientX:event.clientX,c!=null?c.clientY:event.clientY));a.Mouse.onmousemove(c.x,c.y)};var k=a.CreateElement(d.documentElement),e=k.root=!0,f=function(){a.ViewPort.Clear();c.canvas.parentNode&&a.ViewPort.SetCurrent(c.canvas.parentNode.clientWidth,c.canvas.parentNode.clientHeight);if(a.opts.ignoreDimensions!=!0){if(k.style("width").hasValue())c.canvas.width=k.style("width").Length.toPixels("x"),c.canvas.style.width=c.canvas.width+"px";if(k.style("height").hasValue())c.canvas.height=
k.style("height").Length.toPixels("y"),c.canvas.style.height=c.canvas.height+"px"}var b=c.canvas.clientWidth||c.canvas.width,d=c.canvas.clientHeight||c.canvas.height;a.ViewPort.SetCurrent(b,d);if(a.opts!=null&&a.opts.offsetX!=null)k.attribute("x",!0).value=a.opts.offsetX;if(a.opts!=null&&a.opts.offsetY!=null)k.attribute("y",!0).value=a.opts.offsetY;if(a.opts!=null&&a.opts.scaleWidth!=null&&a.opts.scaleHeight!=null){var f=1,g=1;k.attribute("width").hasValue()&&(f=k.attribute("width").Length.toPixels("x")/
a.opts.scaleWidth);k.attribute("height").hasValue()&&(g=k.attribute("height").Length.toPixels("y")/a.opts.scaleHeight);k.attribute("width",!0).value=a.opts.scaleWidth;k.attribute("height",!0).value=a.opts.scaleHeight;k.attribute("viewBox",!0).value="0 0 "+b*f+" "+d*g;k.attribute("preserveAspectRatio",!0).value="none"}a.opts.ignoreClear!=!0&&c.clearRect(0,0,b,d);k.render(c);e&&(e=!1,a.opts!=null&&typeof a.opts.renderCallback=="function"&&a.opts.renderCallback())},g=!0;a.ImagesLoaded()&&(g=!1,f());
a.intervalID=setInterval(function(){var b=!1;g&&a.ImagesLoaded()&&(g=!1,b=!0);a.opts.ignoreMouse!=!0&&(b|=a.Mouse.hasEvents());if(a.opts.ignoreAnimation!=!0)for(var c=0;c<a.Animations.length;c++)b|=a.Animations[c].update(1E3/a.FRAMERATE);a.opts!=null&&typeof a.opts.forceRedraw=="function"&&a.opts.forceRedraw()==!0&&(b=!0);b&&(f(),a.Mouse.runEvents())},1E3/a.FRAMERATE)};a.stop=function(){a.intervalID&&clearInterval(a.intervalID)};a.Mouse=new function(){this.events=[];this.hasEvents=function(){return this.events.length!=
0};this.onclick=function(a,d){this.events.push({type:"onclick",x:a,y:d,run:function(a){if(a.onclick)a.onclick()}})};this.onmousemove=function(a,d){this.events.push({type:"onmousemove",x:a,y:d,run:function(a){if(a.onmousemove)a.onmousemove()}})};this.eventElements=[];this.checkPath=function(a,d){for(var b=0;b<this.events.length;b++){var k=this.events[b];d.isPointInPath&&d.isPointInPath(k.x,k.y)&&(this.eventElements[b]=a)}};this.checkBoundingBox=function(a,d){for(var b=0;b<this.events.length;b++){var k=
this.events[b];d.isPointInBox(k.x,k.y)&&(this.eventElements[b]=a)}};this.runEvents=function(){a.ctx.canvas.style.cursor="";for(var c=0;c<this.events.length;c++)for(var d=this.events[c],b=this.eventElements[c];b;)d.run(b),b=b.parent;this.events=[];this.eventElements=[]}};return a}this.canvg=function(a,c,d){if(a==null&&c==null&&d==null)for(var c=document.getElementsByTagName("svg"),b=0;b<c.length;b++){a=c[b];d=document.createElement("canvas");d.width=a.clientWidth;d.height=a.clientHeight;a.parentNode.insertBefore(d,
a);a.parentNode.removeChild(a);var k=document.createElement("div");k.appendChild(a);canvg(d,k.innerHTML)}else d=d||{},typeof a=="string"&&(a=document.getElementById(a)),a.svg==null?(b=m(),a.svg=b):(b=a.svg,b.stop()),b.opts=d,a=a.getContext("2d"),typeof c.documentElement!="undefined"?b.loadXmlDoc(a,c):c.substr(0,1)=="<"?b.loadXml(a,c):b.load(a,c)}})();
if(CanvasRenderingContext2D)CanvasRenderingContext2D.prototype.drawSvg=function(m,a,c,d,b){canvg(this.canvas,m,{ignoreMouse:!0,ignoreAnimation:!0,ignoreDimensions:!0,ignoreClear:!0,offsetX:a,offsetY:c,scaleWidth:d,scaleHeight:b})};
(function(m){var a=m.win,c=m.css,d=m.CanVGRenderer,b=m.SVGRenderer,k=m.extend,e=m.merge,f=m.addEvent,g=m.createElement,h=m.discardElement;k(d.prototype,b.prototype);k(d.prototype,{create:function(a,b,c,d){this.setContainer(b,c,d);this.configure(a)},setContainer:function(a,b,c){var d=a.style,e=a.parentNode,f=d.left,d=d.top,h=a.offsetWidth,k=a.offsetHeight,m={visibility:"hidden",position:"absolute"};this.init(a,b,c);this.canvas=g("canvas",{width:h,height:k},{position:"relative",left:f,top:d},a);this.ttLine=
g("div",null,m,e);this.ttDiv=g("div",null,m,e);this.ttTimer=void 0;this.hiddenSvg=a=g("div",{width:h,height:k},{visibility:"hidden",left:f,top:d},e);a.appendChild(this.box)},configure:function(a){var b=this,d=a.options.tooltip,g=d.borderWidth,h=b.ttDiv,k=d.style,m=b.ttLine,s=parseInt(k.padding,10),k=e(k,{padding:s+"px","background-color":d.backgroundColor,"border-style":"solid","border-width":g+"px","border-radius":d.borderRadius+"px"});d.shadow&&(k=e(k,{"box-shadow":"1px 1px 3px gray","-webkit-box-shadow":"1px 1px 3px gray"}));
c(h,k);c(m,{"border-left":"1px solid darkgray"});f(a,"tooltipRefresh",function(d){var e=a.container,f=e.offsetLeft,e=e.offsetTop,g;h.innerHTML=d.text;g=a.tooltip.getPosition(h.offsetWidth,h.offsetHeight,{plotX:d.x,plotY:d.y});c(h,{visibility:"visible",left:g.x+"px",top:g.y+"px","border-color":d.borderColor});c(m,{visibility:"visible",left:f+d.x+"px",top:e+a.plotTop+"px",height:a.plotHeight+"px"});b.ttTimer!==void 0&&clearTimeout(b.ttTimer);b.ttTimer=setTimeout(function(){c(h,{visibility:"hidden"});
c(m,{visibility:"hidden"})},3E3)})},destroy:function(){h(this.canvas);this.ttTimer!==void 0&&clearTimeout(this.ttTimer);h(this.ttLine);h(this.ttDiv);h(this.hiddenSvg);return b.prototype.destroy.apply(this)},color:function(a,c,d){a&&a.linearGradient&&(a=a.stops[a.stops.length-1][1]);return b.prototype.color.call(this,a,c,d)},draw:function(){a.canvg(this.canvas,this.hiddenSvg.innerHTML)}})})(Highcharts);
/**
 * @license A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * Use it if you like it
 *
 */

function RGBColor(color_string)
{
    this.ok = false;

    // strip any leading #
    if (color_string.charAt(0) == '#') { // remove # if any
        color_string = color_string.substr(1,6);
    }

    color_string = color_string.replace(/ /g,'');
    color_string = color_string.toLowerCase();

    // before getting into regexps, try simple matches
    // and overwrite the input
    var simple_colors = {
        aliceblue: 'f0f8ff',
        antiquewhite: 'faebd7',
        aqua: '00ffff',
        aquamarine: '7fffd4',
        azure: 'f0ffff',
        beige: 'f5f5dc',
        bisque: 'ffe4c4',
        black: '000000',
        blanchedalmond: 'ffebcd',
        blue: '0000ff',
        blueviolet: '8a2be2',
        brown: 'a52a2a',
        burlywood: 'deb887',
        cadetblue: '5f9ea0',
        chartreuse: '7fff00',
        chocolate: 'd2691e',
        coral: 'ff7f50',
        cornflowerblue: '6495ed',
        cornsilk: 'fff8dc',
        crimson: 'dc143c',
        cyan: '00ffff',
        darkblue: '00008b',
        darkcyan: '008b8b',
        darkgoldenrod: 'b8860b',
        darkgray: 'a9a9a9',
        darkgreen: '006400',
        darkkhaki: 'bdb76b',
        darkmagenta: '8b008b',
        darkolivegreen: '556b2f',
        darkorange: 'ff8c00',
        darkorchid: '9932cc',
        darkred: '8b0000',
        darksalmon: 'e9967a',
        darkseagreen: '8fbc8f',
        darkslateblue: '483d8b',
        darkslategray: '2f4f4f',
        darkturquoise: '00ced1',
        darkviolet: '9400d3',
        deeppink: 'ff1493',
        deepskyblue: '00bfff',
        dimgray: '696969',
        dodgerblue: '1e90ff',
        feldspar: 'd19275',
        firebrick: 'b22222',
        floralwhite: 'fffaf0',
        forestgreen: '228b22',
        fuchsia: 'ff00ff',
        gainsboro: 'dcdcdc',
        ghostwhite: 'f8f8ff',
        gold: 'ffd700',
        goldenrod: 'daa520',
        gray: '808080',
        green: '008000',
        greenyellow: 'adff2f',
        honeydew: 'f0fff0',
        hotpink: 'ff69b4',
        indianred : 'cd5c5c',
        indigo : '4b0082',
        ivory: 'fffff0',
        khaki: 'f0e68c',
        lavender: 'e6e6fa',
        lavenderblush: 'fff0f5',
        lawngreen: '7cfc00',
        lemonchiffon: 'fffacd',
        lightblue: 'add8e6',
        lightcoral: 'f08080',
        lightcyan: 'e0ffff',
        lightgoldenrodyellow: 'fafad2',
        lightgrey: 'd3d3d3',
        lightgreen: '90ee90',
        lightpink: 'ffb6c1',
        lightsalmon: 'ffa07a',
        lightseagreen: '20b2aa',
        lightskyblue: '87cefa',
        lightslateblue: '8470ff',
        lightslategray: '778899',
        lightsteelblue: 'b0c4de',
        lightyellow: 'ffffe0',
        lime: '00ff00',
        limegreen: '32cd32',
        linen: 'faf0e6',
        magenta: 'ff00ff',
        maroon: '800000',
        mediumaquamarine: '66cdaa',
        mediumblue: '0000cd',
        mediumorchid: 'ba55d3',
        mediumpurple: '9370d8',
        mediumseagreen: '3cb371',
        mediumslateblue: '7b68ee',
        mediumspringgreen: '00fa9a',
        mediumturquoise: '48d1cc',
        mediumvioletred: 'c71585',
        midnightblue: '191970',
        mintcream: 'f5fffa',
        mistyrose: 'ffe4e1',
        moccasin: 'ffe4b5',
        navajowhite: 'ffdead',
        navy: '000080',
        oldlace: 'fdf5e6',
        olive: '808000',
        olivedrab: '6b8e23',
        orange: 'ffa500',
        orangered: 'ff4500',
        orchid: 'da70d6',
        palegoldenrod: 'eee8aa',
        palegreen: '98fb98',
        paleturquoise: 'afeeee',
        palevioletred: 'd87093',
        papayawhip: 'ffefd5',
        peachpuff: 'ffdab9',
        peru: 'cd853f',
        pink: 'ffc0cb',
        plum: 'dda0dd',
        powderblue: 'b0e0e6',
        purple: '800080',
        red: 'ff0000',
        rosybrown: 'bc8f8f',
        royalblue: '4169e1',
        saddlebrown: '8b4513',
        salmon: 'fa8072',
        sandybrown: 'f4a460',
        seagreen: '2e8b57',
        seashell: 'fff5ee',
        sienna: 'a0522d',
        silver: 'c0c0c0',
        skyblue: '87ceeb',
        slateblue: '6a5acd',
        slategray: '708090',
        snow: 'fffafa',
        springgreen: '00ff7f',
        steelblue: '4682b4',
        tan: 'd2b48c',
        teal: '008080',
        thistle: 'd8bfd8',
        tomato: 'ff6347',
        turquoise: '40e0d0',
        violet: 'ee82ee',
        violetred: 'd02090',
        wheat: 'f5deb3',
        white: 'ffffff',
        whitesmoke: 'f5f5f5',
        yellow: 'ffff00',
        yellowgreen: '9acd32'
    };
    for (var key in simple_colors) {
        if (color_string == key) {
            color_string = simple_colors[key];
        }
    }
    // emd of simple type-in colors

    // array of color definition objects
    var color_defs = [
        {
            re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
            example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
            process: function (bits){
                return [
                    parseInt(bits[1]),
                    parseInt(bits[2]),
                    parseInt(bits[3])
                ];
            }
        },
        {
            re: /^(\w{2})(\w{2})(\w{2})$/,
            example: ['#00ff00', '336699'],
            process: function (bits){
                return [
                    parseInt(bits[1], 16),
                    parseInt(bits[2], 16),
                    parseInt(bits[3], 16)
                ];
            }
        },
        {
            re: /^(\w{1})(\w{1})(\w{1})$/,
            example: ['#fb0', 'f0f'],
            process: function (bits){
                return [
                    parseInt(bits[1] + bits[1], 16),
                    parseInt(bits[2] + bits[2], 16),
                    parseInt(bits[3] + bits[3], 16)
                ];
            }
        }
    ];

    // search through the definitions to find a match
    for (var i = 0; i < color_defs.length; i++) {
        var re = color_defs[i].re;
        var processor = color_defs[i].process;
        var bits = re.exec(color_string);
        if (bits) {
            channels = processor(bits);
            this.r = channels[0];
            this.g = channels[1];
            this.b = channels[2];
            this.ok = true;
        }

    }

    // validate/cleanup values
    this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
    this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
    this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

    // some getters
    this.toRGB = function () {
        return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
    }
    this.toHex = function () {
        var r = this.r.toString(16);
        var g = this.g.toString(16);
        var b = this.b.toString(16);
        if (r.length == 1) r = '0' + r;
        if (g.length == 1) g = '0' + g;
        if (b.length == 1) b = '0' + b;
        return '#' + r + g + b;
    }

    // help
    this.getHelpXML = function () {

        var examples = new Array();
        // add regexps
        for (var i = 0; i < color_defs.length; i++) {
            var example = color_defs[i].example;
            for (var j = 0; j < example.length; j++) {
                examples[examples.length] = example[j];
            }
        }
        // add type-in colors
        for (var sc in simple_colors) {
            examples[examples.length] = sc;
        }

        var xml = document.createElement('ul');
        xml.setAttribute('id', 'rgbcolor-examples');
        for (var i = 0; i < examples.length; i++) {
            try {
                var list_item = document.createElement('li');
                var list_color = new RGBColor(examples[i]);
                var example_div = document.createElement('div');
                example_div.style.cssText =
                        'margin: 3px; '
                        + 'border: 1px solid black; '
                        + 'background:' + list_color.toHex() + '; '
                        + 'color:' + list_color.toHex()
                ;
                example_div.appendChild(document.createTextNode('test'));
                var list_item_value = document.createTextNode(
                    ' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
                );
                list_item.appendChild(example_div);
                list_item.appendChild(list_item_value);
                xml.appendChild(list_item);

            } catch(e){}
        }
        return xml;

    }

}

/**
 * @license canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed 
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 *
 */
if(!window.console) {
	window.console = {};
	window.console.log = function(str) {};
	window.console.dir = function(str) {};
}

if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var i=0; i<this.length; i++){
			if(this[i]==obj){
				return i;
			}
		}
		return -1;
	}
}

(function(){
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	this.canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.getElementsByTagName('svg');
			for (var i=0; i<svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}	
		opts = opts || {};
	
		if (typeof target == 'string') {
			target = document.getElementById(target);
		}
		
		// reuse class per canvas
		var svg;
		if (target.svg == null) {
			svg = build();
			target.svg = svg;
		}
		else {
			svg = target.svg;
			svg.stop();
		}
		svg.opts = opts;
		
		var ctx = target.getContext('2d');
		if (typeof(s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0,1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	function build() {
		var svg = { };
		
		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;
		
		// globals
		svg.init = function(ctx) {
			svg.Definitions = {};
			svg.Styles = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function() { this.viewPorts = []; }
				this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function() { this.viewPorts.pop(); }
				this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function() { return this.Current().width; }
				this.height = function() { return this.Current().height; }
				this.ComputeSize = function(d) {
					if (d != null && typeof(d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);			
				}
			});
		}
		svg.init();
		
		// images loaded
		svg.ImagesLoaded = function() { 
			for (var i=0; i<svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }
		
		// compress spaces
		svg.compressSpaces = function(s) { return s ? s.replace(/[\s\r\t\n]+/gm,' ') : ''; }
		
		// ajax
		svg.ajax = function(url) {
			var AJAX;
			if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
			else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
			if(AJAX){
			   AJAX.open('GET',url,false);
			   AJAX.send(null);
			   return AJAX.responseText;
			}
			return null;
		} 
		
		// parse xml
		svg.parseXml = function(xml) {
			if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else 
			{
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml); 
				return xmlDoc;
			}		
		}
		
		svg.Property = function(name, value) {
			this.name = name;
			this.value = value;
			
			this.hasValue = function() {
				return (this.value != null && this.value !== '');
			}
							
			// return the numerical value of the property
			this.numValue = function() {
				if (!this.hasValue()) return 0;
				
				var n = parseFloat(this.value);
				if ((this.value + '').match(/%$/)) {
					n = n / 100.0;
				}
				return n;
			}
			
			this.valueOrDefault = function(def) {
				if (this.hasValue()) return this.value;
				return def;
			}
			
			this.numValueOrDefault = function(def) {
				if (this.hasValue()) return this.numValue();
				return def;
			}
			
			/* EXTENSIONS */
			var that = this;
			
			// color extensions
			this.Color = {
				// augment the current color value with the opacity
				addOpacity: function(opacity) {
					var newValue = that.value;
					if (opacity != null && opacity != '') {
						var color = new RGBColor(that.value);
						if (color.ok) {
							newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacity + ')';
						}
					}
					return new svg.Property(that.name, newValue);
				}
			}
			
			// definition extensions
			this.Definition = {
				// get the definition from the definitions table
				getDefinition: function() {
					var name = that.value.replace(/^(url\()?#([^\)]+)\)?$/, '$2');
					return svg.Definitions[name];
				},
				
				isUrl: function() {
					return that.value.indexOf('url(') == 0
				},
				
				getFillStyle: function(e) {
					var def = this.getDefinition();
					
					// gradient
					if (def != null && def.createGradient) {
						return def.createGradient(svg.ctx, e);
					}
					
					// pattern
					if (def != null && def.createPattern) {
						return def.createPattern(svg.ctx, e);
					}
					
					return null;
				}
			}
			
			// length extensions
			this.Length = {
				DPI: function(viewPort) {
					return 96.0; // TODO: compute?
				},
				
				EM: function(viewPort) {
					var em = 12;
					
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					if (fontSize.hasValue()) em = fontSize.Length.toPixels(viewPort);
					
					return em;
				},
			
				// get the length as pixels
				toPixels: function(viewPort) {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/em$/)) return that.numValue() * this.EM(viewPort);
					if (s.match(/ex$/)) return that.numValue() * this.EM(viewPort) / 2.0;
					if (s.match(/px$/)) return that.numValue();
					if (s.match(/pt$/)) return that.numValue() * 1.25;
					if (s.match(/pc$/)) return that.numValue() * 15;
					if (s.match(/cm$/)) return that.numValue() * this.DPI(viewPort) / 2.54;
					if (s.match(/mm$/)) return that.numValue() * this.DPI(viewPort) / 25.4;
					if (s.match(/in$/)) return that.numValue() * this.DPI(viewPort);
					if (s.match(/%$/)) return that.numValue() * svg.ViewPort.ComputeSize(viewPort);
					return that.numValue();
				}
			}
			
			// time extensions
			this.Time = {
				// get the time as milliseconds
				toMilliseconds: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/s$/)) return that.numValue() * 1000;
					if (s.match(/ms$/)) return that.numValue();
					return that.numValue();
				}
			}
			
			// angle extensions
			this.Angle = {
				// get the angle as radians
				toRadians: function() {
					if (!that.hasValue()) return 0;
					var s = that.value+'';
					if (s.match(/deg$/)) return that.numValue() * (Math.PI / 180.0);
					if (s.match(/grad$/)) return that.numValue() * (Math.PI / 200.0);
					if (s.match(/rad$/)) return that.numValue();
					return that.numValue() * (Math.PI / 180.0);
				}
			}
		}
		
		// fonts
		svg.Font = new (function() {
			this.Styles = ['normal','italic','oblique','inherit'];
			this.Variants = ['normal','small-caps','inherit'];
			this.Weights = ['normal','bold','bolder','lighter','100','200','300','400','500','600','700','800','900','inherit'];
			
			this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) { 
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return { 
					fontFamily: fontFamily || f.fontFamily, 
					fontSize: fontSize || f.fontSize, 
					fontStyle: fontStyle || f.fontStyle, 
					fontWeight: fontWeight || f.fontWeight, 
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') } 
				} 
			}
			
			var that = this;
			this.Parse = function(s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i=0; i<d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});
		
		// points and paths
		svg.ToNumberArray = function(s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}		
		svg.Point = function(x, y) {
			this.x = x;
			this.y = y;
			
			this.angleTo = function(p) {
				return Math.atan2(p.y - this.y, p.x - this.x);
			}
			
			this.applyTransform = function(v) {
				var xp = this.x * v[0] + this.y * v[2] + v[4];
				var yp = this.x * v[1] + this.y * v[3] + v[5];
				this.x = xp;
				this.y = yp;
			}
		}
		svg.CreatePoint = function(s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function(s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i=0; i<a.length; i+=2) {
				path.push(new svg.Point(a[i], a[i+1]));
			}
			return path;
		}
		
		// bounding box
		svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;
			
			this.x = function() { return this.x1; }
			this.y = function() { return this.y1; }
			this.width = function() { return this.x2 - this.x1; }
			this.height = function() { return this.y2 - this.y1; }
			
			this.addPoint = function(x, y) {	
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}
			
				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}			
			this.addX = function(x) { this.addPoint(x, null); }
			this.addY = function(y) { this.addPoint(null, y); }
			
			this.addBoundingBox = function(bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}
			
			this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
			}
			
			this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);
				
				for (i=0; i<=1; i++) {
					var f = function(t) { 
						return Math.pow(1-t, 3) * p0[i]
						+ 3 * Math.pow(1-t, 2) * t * p1[i]
						+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
						+ Math.pow(t, 3) * p3[i];
					}
					
					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];
					
					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}
					
					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}
			
			this.isPointInBox = function(x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}
			
			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}
		
		// transforms
		svg.Transform = function(v) {	
			var that = this;
			this.Type = {}
		
			// translate
			this.Type.translate = function(s) {
				this.p = svg.CreatePoint(s);			
				this.apply = function(ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}
			
			// rotate
			this.Type.rotate = function(s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.Angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function(p) {
					var a = this.angle.Angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}			
			}
			
			this.Type.scale = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}				
			}
			
			this.Type.matrix = function(s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function(ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.applyToPoint = function(p) {
					p.applyTransform(this.m);
				}					
			}
			
			this.Type.SkewBase = function(s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;
			
			this.Type.skewX = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.Angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;
			
			this.Type.skewY = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.Angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;
		
			this.transforms = [];
			
			this.apply = function(ctx) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}
			
			this.applyToPoint = function(p) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}
			
			var data = svg.trim(svg.compressSpaces(v)).split(/\s(?=[a-z])/);
			for (var i=0; i<data.length; i++) {
				var type = data[i].split('(')[0];
				var s = data[i].split('(')[1].replace(')','');
				var transform = new this.Type[type](s);
				this.transforms.push(transform);
			}
		}
		
		// aspect ratio
		svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';					
	
			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }	
			
			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {				
				ctx.translate(-scaleMin * refX.Length.toPixels('x'), -scaleMin * refY.Length.toPixels('y'));
			} 
			else {					
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0); 
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0); 
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0); 
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight); 
			}
			
			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin); 
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax); 	
			
			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);			
		}
		
		// elements
		svg.Element = {}
		
		svg.Element.ElementBase = function(node) {	
			this.attributes = {};
			this.styles = {};
			this.children = [];
			
			// get or create attribute
			this.attribute = function(name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;
							
				a = new svg.Property(name, '');
				if (createIfNotExists == true) this.attributes[name] = a;
				return a;
			}
			
			// get or create style, crawls up node tree
			this.style = function(name, createIfNotExists) {
				var s = this.styles[name];
				if (s != null) return s;
				
				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					return a;
				}
				
				var p = this.parent;
				if (p != null) {
					var ps = p.style(name);
					if (ps != null && ps.hasValue()) {
						return ps;
					}
				}
					
				s = new svg.Property(name, '');
				if (createIfNotExists == true) this.styles[name] = s;
				return s;
			}
			
			// base render
			this.render = function(ctx) {
				// don't render display=none
				if (this.style('display').value == 'none') return;
				
				// don't render visibility=hidden
				if (this.attribute('visibility').value == 'hidden') return;
			
				ctx.save();
					this.setContext(ctx);
						// mask
						if (this.attribute('mask').hasValue()) {
							var mask = this.attribute('mask').Definition.getDefinition();
							if (mask != null) mask.apply(ctx, this);
						}
						else if (this.style('filter').hasValue()) {
							var filter = this.style('filter').Definition.getDefinition();
							if (filter != null) filter.apply(ctx, this);
						}
						else this.renderChildren(ctx);				
					this.clearContext(ctx);
				ctx.restore();
			}
			
			// base set context
			this.setContext = function(ctx) {
				// OVERRIDE ME!
			}
			
			// base clear context
			this.clearContext = function(ctx) {
				// OVERRIDE ME!
			}			
			
			// base render children
			this.renderChildren = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}
			
			this.addChild = function(childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				this.children.push(child);			
			}
				
			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add children
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
				}
				
				// add attributes
				for (var i=0; i<node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.nodeValue);
				}
										
				// add tag styles
				var styles = svg.Styles[node.nodeName];
				if (styles != null) {
					for (var name in styles) {
						this.styles[name] = styles[name];
					}
				}					
				
				// add class styles
				if (this.attribute('class').hasValue()) {
					var classes = svg.compressSpaces(this.attribute('class').value).split(' ');
					for (var j=0; j<classes.length; j++) {
						styles = svg.Styles['.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
						styles = svg.Styles[node.nodeName+'.'+classes[j]];
						if (styles != null) {
							for (var name in styles) {
								this.styles[name] = styles[name];
							}
						}
					}
				}
				
				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i=0; i<styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}	

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}
			}
		}
		
		svg.Element.RenderedElementBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.setContext = function(ctx) {
				// fill
				if (this.style('fill').Definition.isUrl()) {
					var fs = this.style('fill').Definition.getFillStyle(this);
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (this.style('fill-opacity').hasValue()) fillStyle = fillStyle.Color.addOpacity(this.style('fill-opacity').value);
					ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
									
				// stroke
				if (this.style('stroke').Definition.isUrl()) {
					var fs = this.style('stroke').Definition.getFillStyle(this);
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (this.style('stroke-opacity').hasValue()) strokeStyle = strokeStyle.Color.addOpacity(this.style('stroke-opacity').value);
					ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-width').hasValue()) ctx.lineWidth = this.style('stroke-width').Length.toPixels();
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;

				// font
				if (typeof(ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont( 
						this.style('font-style').value, 
						this.style('font-variant').value, 
						this.style('font-weight').value, 
						this.style('font-size').hasValue() ? this.style('font-size').Length.toPixels() + 'px' : '', 
						this.style('font-family').value).toString();
				}
				
				// transform
				if (this.attribute('transform').hasValue()) { 
					var transform = new svg.Transform(this.attribute('transform').value);
					transform.apply(ctx);
				}
				
				// clip
				if (this.attribute('clip-path').hasValue()) {
					var clip = this.attribute('clip-path').Definition.getDefinition();
					if (clip != null) clip.apply(ctx);
				}
				
				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}		
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;
		
		svg.Element.PathElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}
			
			this.renderChildren = function(ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') ctx.fill();
				if (ctx.strokeStyle != '') ctx.stroke();
				
				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').Definition.isUrl()) {
						var marker = this.style('marker-start').Definition.getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').Definition.isUrl()) {
						var marker = this.style('marker-mid').Definition.getDefinition();
						for (var i=1;i<markers.length-1;i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').Definition.isUrl()) {
						var marker = this.style('marker-end').Definition.getDefinition();
						marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
					}
				}					
			}
			
			this.getBoundingBox = function() {
				return this.path();
			}
			
			this.getMarkers = function() {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// svg element
		svg.Element.svg = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseClearContext = this.clearContext;
			this.clearContext = function(ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				// initial values
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;			
			
				this.baseSetContext(ctx);
				
				// create new view port
				if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
					ctx.translate(this.attribute('x').Length.toPixels('x'), this.attribute('y').Length.toPixels('y'));
				}
				
				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();
				if (typeof(this.root) == 'undefined' && this.attribute('width').hasValue() && this.attribute('height').hasValue()) {
					width = this.attribute('width').Length.toPixels('x');
					height = this.attribute('height').Length.toPixels('y');
					
					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').Length.toPixels('x');
						y = -this.attribute('refY').Length.toPixels('y');
					}
					
					ctx.beginPath();
					ctx.moveTo(x, y);
					ctx.lineTo(width, y);
					ctx.lineTo(width, height);
					ctx.lineTo(x, height);
					ctx.closePath();
					ctx.clip();
				}
				svg.ViewPort.SetCurrent(width, height);	
						
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									svg.ViewPort.width(), 
									width,
									svg.ViewPort.height(),
									height,
									minX,
									minY,
									this.attribute('refX').value,
									this.attribute('refY').value);
										
					svg.ViewPort.RemoveCurrent();	
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}				
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}
				
				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;
		
		// circle element
		svg.Element.circle = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				var r = this.attribute('r').Length.toPixels();
			
				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true); 
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;	

		// ellipse element
		svg.Element.ellipse = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.path = function(ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').Length.toPixels('x');
				var ry = this.attribute('ry').Length.toPixels('y');
				var cx = this.attribute('cx').Length.toPixels('x');
				var cy = this.attribute('cy').Length.toPixels('y');
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}
				
				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;			
		
		// line element
		svg.Element.line = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.getPoints = function() {
				return [
					new svg.Point(this.attribute('x1').Length.toPixels('x'), this.attribute('y1').Length.toPixels('y')),
					new svg.Point(this.attribute('x2').Length.toPixels('x'), this.attribute('y2').Length.toPixels('y'))];
			}
								
			this.path = function(ctx) {
				var points = this.getPoints();
				
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}
				
				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}
			
			this.getMarkers = function() {
				var points = this.getPoints();	
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;		
				
		// polyline element
		svg.Element.polyline = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
			
			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function(ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i=1; i<this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}
			
			this.getMarkers = function() {
				var markers = [];
				for (var i=0; i<this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
				}
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
				return markers;
			}			
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;				
				
		// polygon element
		svg.Element.polygon = function(node) {
			this.base = svg.Element.polyline;
			this.base(node);
			
			this.basePath = this.path;
			this.path = function(ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);
					
			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm,' '); // get rid of all commas
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from commands
			d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // separate commands from points
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when no comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function(d) {
				this.tokens = d.split(' ');
				
				this.reset = function() {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}
								
				this.isEnd = function() {
					return this.i >= this.tokens.length - 1;
				}
				
				this.isCommandOrEnd = function() {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}
				
				this.isRelativeCommand = function() {
					return this.command == this.command.toLowerCase();
				}
							
				this.getToken = function() {
					this.i = this.i + 1;
					return this.tokens[this.i];
				}
				
				this.getScalar = function() {
					return parseFloat(this.getToken());
				}
				
				this.nextCommand = function() {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}				
				
				this.getPoint = function() {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}
				
				this.getAsControlPoint = function() {
					var p = this.getPoint();
					this.control = p;
					return p;
				}
				
				this.getAsCurrentPoint = function() {
					var p = this.getPoint();
					this.current = p;
					return p;	
				}
				
				this.getReflectedControlPoint = function() {
					if (this.previousCommand.toLowerCase() != 'c' && this.previousCommand.toLowerCase() != 's') {
						return this.current;
					}
					
					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);					
					return p;
				}
				
				this.makeAbsolute = function(p) {
					if (this.isRelativeCommand()) {
						p.x = this.current.x + p.x;
						p.y = this.current.y + p.y;
					}
					return p;
				}
				
				this.addMarker = function(p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
						this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}
				
				this.addMarkerAngle = function(p, a) {
					this.points.push(p);
					this.angles.push(a);
				}				
				
				this.getMarkerPoints = function() { return this.points; }
				this.getMarkerAngles = function() {
					for (var i=0; i<this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j=i+1; j<this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function(ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command.toUpperCase()) {
					case 'M':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
						while (!pp.isCommandOrEnd()) {
						    var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(
								Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
								-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
							);
							// adjust radii
							var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
								(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
							);
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point(
								(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
								(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
							);
							// vector magnitude
							var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
							// ratio between two vectors
							var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
							// angle between two vectors
							var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
							// initial angle
							var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
							// angle delta
							var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
							var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
							var ad = a(u, v);
							if (r(u,v) <= -1) ad = Math.PI;
							if (r(u,v) >= 1) ad = 0;

							if (sweepFlag == 0 && ad > 0) ad = ad - 2 * Math.PI;
							if (sweepFlag == 1 && ad < 0) ad = ad + 2 * Math.PI;

							// for markers
							var halfWay = new svg.Point(
								centp.x - rx * Math.cos((a1 + ad) / 2),
								centp.y - ry * Math.sin((a1 + ad) / 2)
							);
							pp.addMarkerAngle(halfWay, (a1 + ad) / 2 + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);
							pp.addMarkerAngle(cp, ad + (sweepFlag == 0 ? 1 : -1) * Math.PI / 2);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1/sx, 1/sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function() {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();
				
				var markers = [];
				for (var i=0; i<points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;
		
		// pattern element
		svg.Element.pattern = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.createPattern = function(ctx, element) {
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['x'] = new svg.Property('x', this.attribute('x').value);
				tempSvg.attributes['y'] = new svg.Property('y', this.attribute('y').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
				tempSvg.children = this.children;
				
				var c = document.createElement('canvas');
				c.width = this.attribute('width').Length.toPixels('x');
				c.height = this.attribute('height').Length.toPixels('y');
				tempSvg.render(c.getContext('2d'));		
				return ctx.createPattern(c, 'repeat');
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;
		
		// marker element
		svg.Element.marker = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.baseRender = this.render;
			this.render = function(ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();
							
				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);
				
				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;
		
		// definitions element
		svg.Element.defs = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.render = function(ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;
		
		// base for gradients
		svg.Element.GradientBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.gradientUnits = this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
			
			this.stops = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				this.stops.push(child);
			}	
			
			this.getGradient = function() {
				// OVERRIDE ME!
			}			

			this.createGradient = function(ctx, element) {
				var stopsContainer = this;
				if (this.attribute('xlink:href').hasValue()) {
					stopsContainer = this.attribute('xlink:href').Definition.getDefinition();
				}
			
				var g = this.getGradient(ctx, element);
				for (var i=0; i<stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, stopsContainer.stops[i].color);
				}
				
				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];
					
					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);
					
					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [ rect ];
					
					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [ group ];
					
					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);		
					return tempCtx.createPattern(c, 'no-repeat');
				}
				
				return g;				
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;
		
		// linear gradient element
		svg.Element.linearGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var x1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x1').numValue() 
					: this.attribute('x1').Length.toPixels('x'));
				var y1 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').Length.toPixels('y'));
				var x2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').Length.toPixels('x'));
				var y2 = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').Length.toPixels('y'));

				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;
		
		// radial gradient element
		svg.Element.radialGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();
				
				var cx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('cx').numValue() 
					: this.attribute('cx').Length.toPixels('x'));
				var cy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('cy').numValue() 
					: this.attribute('cy').Length.toPixels('y'));
				
				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits == 'objectBoundingBox' 
					? bb.x() + bb.width() * this.attribute('fx').numValue() 
					: this.attribute('fx').Length.toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits == 'objectBoundingBox' 
					? bb.y() + bb.height() * this.attribute('fy').numValue() 
					: this.attribute('fy').Length.toPixels('y'));
				}
				
				var r = (this.gradientUnits == 'objectBoundingBox' 
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').Length.toPixels());
				
				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;
		
		// gradient stop element
		svg.Element.stop = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.offset = this.attribute('offset').numValue();
			
			var stopColor = this.style('stop-color');
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.Color.addOpacity(this.style('stop-opacity').value);
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;
		
		// animation base element
		svg.Element.AnimateBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			svg.Animations.push(this);
			
			this.duration = 0.0;
			this.begin = this.attribute('begin').Time.toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').Time.toMilliseconds();
			
			this.getProperty = function() {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;
				
				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);			
			};
			
			this.initialValue = null;
			this.removed = false;			

			this.calcValue = function() {
				// OVERRIDE ME!
				return '';
			}
			
			this.update = function(delta) {	
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
				}
			
				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.initialValue;
						return true;
					}
					else {
						return false; // no updates made
					}
				}			
				this.duration = this.duration + delta;
			
				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween
					
					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}
					
					this.getProperty().value = newValue;
					updated = true;
				}
				
				return updated;
			}
			
			// fraction of duration we've covered
			this.progress = function() {
				return ((this.duration - this.begin) / (this.maxDuration - this.begin));
			}			
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;
		
		// animate element
		svg.Element.animate = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);
			
			this.calcValue = function() {
				var from = this.attribute('from').numValue();
				var to = this.attribute('to').numValue();
				
				// tween value linearly
				return from + (to - from) * this.progress(); 
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;
			
		// animate color element
		svg.Element.animateColor = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var from = new RGBColor(this.attribute('from').value);
				var to = new RGBColor(this.attribute('to').value);
				
				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * this.progress();
					var g = from.g + (to.g - from.g) * this.progress();
					var b = from.b + (to.b - from.b) * this.progress();
					return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;
		
		// animate transform element
		svg.Element.animateTransform = function(node) {
			this.base = svg.Element.animate;
			this.base(node);
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;
		
		// font element
		svg.Element.font = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();			
			
			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];			
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof(this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}	
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;
		
		// font-face element
		svg.Element.fontface = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();				
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;
		
		// missing-glyph element
		svg.Element.missingglyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;
		
		// glyph element
		svg.Element.glyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);	
			
			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;
		
		// text element
		svg.Element.text = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			if (node != null) {
				// add children
				this.children = [];
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) { // capture tspan and tref nodes
						this.addChild(childNode, true);
					}
					else if (childNode.nodeType == 3) { // capture text
						this.addChild(new svg.Element.tspan(childNode), false);
					}
				}
			}
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.style('dominant-baseline').hasValue()) ctx.textBaseline = this.style('dominant-baseline').value;
				if (this.style('alignment-baseline').hasValue()) ctx.textBaseline = this.style('alignment-baseline').value;
			}
			
			this.renderChildren = function(ctx) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				for (var i=0; i<this.children.length; i++) {
					var child = this.children[i];
				
					if (child.attribute('x').hasValue()) {
						child.x = child.attribute('x').Length.toPixels('x');
					}
					else {
						if (child.attribute('dx').hasValue()) x += child.attribute('dx').Length.toPixels('x');
						child.x = x;
					}
					
					var childLength = child.measureText ? child.measureText(ctx) : 0;
					if (textAnchor != 'start' && (i==0 || child.attribute('x').hasValue())) { // new group?
						// loop through rest of children
						var groupLength = childLength;
						for (var j=i+1; j<this.children.length; j++) {
							var childInGroup = this.children[j];
							if (childInGroup.attribute('x').hasValue()) break; // new group
							groupLength += childInGroup.measureText ? childInGroup.measureText(ctx) : 0;
						}
						child.x -= (textAnchor == 'end' ? groupLength : groupLength / 2.0);
					}
					x = child.x + childLength;
					
					if (child.attribute('y').hasValue()) {
						child.y = child.attribute('y').Length.toPixels('y');
					}
					else {
						if (child.attribute('dy').hasValue()) y += child.attribute('dy').Length.toPixels('y');
						child.y = y;
					}	
					y = child.y;
					
					child.render(ctx);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;
		
		// text base
		svg.Element.TextElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getGlyph = function(font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal'; 
					if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
					if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
					if (typeof(font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}
			
			this.renderChildren = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1/scale, -1/scale);
						ctx.translate(-this.x, -this.y);	
						
						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}
			
				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
			}
			
			this.getText = function() {
				// OVERRIDE ME
			}
			
			this.measureText = function(ctx) {
				var customFont = this.parent.style('font-family').Definition.getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}
			
				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;
				
				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;
		
		// tspan 
		svg.Element.tspan = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.text = node.nodeType == 3 ? node.nodeValue : // text
						node.childNodes.length > 0 ? node.childNodes[0].nodeValue : // element
						node.text;
			this.getText = function() {
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;
		
		// tref
		svg.Element.tref = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.getText = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;		
		
		// a element
		svg.Element.a = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);
			
			this.hasText = true;
			for (var i=0; i<node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}
			
			// this might contain text
			this.text = this.hasText ? node.childNodes[0].nodeValue : '';
			this.getText = function() {
				return this.text;
			}		

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function(ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.Length.toPixels('y'), this.x + this.measureText(ctx), this.y));					
				}
				else {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}
			
			this.onclick = function() {
				window.open(this.attribute('xlink:href').value);
			}
			
			this.onmousemove = function() {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;		
		
		// image element
		svg.Element.image = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			svg.Images.push(this);
			this.img = document.createElement('img');
			this.loaded = false;
			var that = this;
			this.img.onload = function() { that.loaded = true; }
			this.img.src = this.attribute('xlink:href').value;
			
			this.renderChildren = function(ctx) {
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');			
				if (width == 0 || height == 0) return;
			
				ctx.save();
				ctx.translate(x, y);
				svg.AspectRatio(ctx,
								this.attribute('preserveAspectRatio').value,
								width,
								this.img.width,
								height,
								this.img.height,
								0,
								0);	
				ctx.drawImage(this.img, 0, 0);			
				ctx.restore();
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;
		
		// group element
		svg.Element.g = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.getBoundingBox = function() {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {		
				this.baseSetContext(ctx);
				
				// viewbox
				if (this.attribute('viewBox').hasValue()) {				
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];
					
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value, 
									this.attribute('width').Length.toPixels('x'),
									width,
									this.attribute('height').Length.toPixels('y'),
									height,
									minX,
									minY);

					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);						
				}
			}			
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;		
			
		// style element
		svg.Element.style = function(node) { 
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			// text, or spaces then CDATA
			var css = node.childNodes[0].nodeValue + (node.childNodes.length > 1 ? node.childNodes[1].nodeValue : '');
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i=0; i<cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j=0; j<cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = {};
							for (var k=0; k<cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g,'');
								var srcs = props['src'].value.split(',');
								for (var s=0; s<srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f=0; f<fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;
		
		// use element 
		svg.Element.use = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);
			
			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').Length.toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').Length.toPixels('y'));
			}
			
			this.getDefinition = function() {
				var element = this.attribute('xlink:href').Definition.getDefinition();
				if (this.attribute('width').hasValue()) element.attribute('width', true).value = this.attribute('width').value;
				if (this.attribute('height').hasValue()) element.attribute('height', true).value = this.attribute('height').value;
				return element;
			}
			
			this.path = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.path(ctx);
			}
			
			this.renderChildren = function(ctx) {
				var element = this.getDefinition();
				if (element != null) element.render(ctx);
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;
		
		// mask element
		svg.Element.mask = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				
				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';
				
					var cMask = document.createElement('canvas');
					cMask.width = x + width;
					cMask.height = y + height;
					var maskCtx = cMask.getContext('2d');
					this.renderChildren(maskCtx);
				
					var c = document.createElement('canvas');
					c.width = x + width;
					c.height = y + height;
					var tempCtx = c.getContext('2d');
					element.render(tempCtx);
					tempCtx.globalCompositeOperation = 'destination-in';
					tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
					tempCtx.fillRect(0, 0, x + width, y + height);
					
					ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
					ctx.fillRect(0, 0, x + width, y + height);
					
				// reassign mask
				element.attribute('mask').value = mask;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;
		
		// clip element
		svg.Element.clipPath = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
			
			this.apply = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					if (this.children[i].path) {
						this.children[i].path(ctx);
						ctx.clip();
					}
				}
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);
						
			this.apply = function(ctx, element) {
				// render as temp svg	
				var bb = element.getBoundingBox();
				var x = this.attribute('x').Length.toPixels('x');
				var y = this.attribute('y').Length.toPixels('y');
				if (x == 0 || y == 0) {
					x = bb.x1;
					y = bb.y1;
				}
				var width = this.attribute('width').Length.toPixels('x');
				var height = this.attribute('height').Length.toPixels('y');
				if (width == 0 || height == 0) {
					width = bb.width();
					height = bb.height();
				}
				
				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';
				
				// max filter distance
				var extraPercent = .20;
				var px = extraPercent * width;
				var py = extraPercent * height;
				
				var c = document.createElement('canvas');
				c.width = width + 2*px;
				c.height = height + 2*py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);
			
				// apply filters
				for (var i=0; i<this.children.length; i++) {
					this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
				}
				
				// render on me
				ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);
				
				// reassign filter
				element.style('filter', true).value = filter;	
			}
			
			this.render = function(ctx) {
				// NO RENDER
			}		
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;
		
		svg.Element.feGaussianBlur = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);	
			
			function make_fgauss(sigma) {
				sigma = Math.max(sigma, 0.01);			      
				var len = Math.ceil(sigma * 4.0) + 1;                     
				mask = [];                               
				for (var i = 0; i < len; i++) {                             
					mask[i] = Math.exp(-0.5 * (i / sigma) * (i / sigma));                                           
				}                                                           
				return mask; 
			}
			
			function normalize(mask) {
				var sum = 0;
				for (var i = 1; i < mask.length; i++) {
					sum += Math.abs(mask[i]);
				}
				sum = 2 * sum + Math.abs(mask[0]);
				for (var i = 0; i < mask.length; i++) {
					mask[i] /= sum;
				}
				return mask;
			}
			
			function convolve_even(src, dst, mask, width, height) {
			  for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
				  var a = imGet(src, x, y, width, height, 3)/255;
				  for (var rgba = 0; rgba < 4; rgba++) {					  
					  var sum = mask[0] * (a==0?255:imGet(src, x, y, width, height, rgba)) * (a==0||rgba==3?1:a);
					  for (var i = 1; i < mask.length; i++) {
						var a1 = imGet(src, Math.max(x-i,0), y, width, height, 3)/255;
					    var a2 = imGet(src, Math.min(x+i, width-1), y, width, height, 3)/255;
						sum += mask[i] * 
						  ((a1==0?255:imGet(src, Math.max(x-i,0), y, width, height, rgba)) * (a1==0||rgba==3?1:a1) + 
						   (a2==0?255:imGet(src, Math.min(x+i, width-1), y, width, height, rgba)) * (a2==0||rgba==3?1:a2));
					  }
					  imSet(dst, y, x, height, width, rgba, sum);
				  }			  
				}
			  }
			}		

			function imGet(img, x, y, width, height, rgba) {
				return img[y*width*4 + x*4 + rgba];
			}
			
			function imSet(img, x, y, width, height, rgba, val) {
				img[y*width*4 + x*4 + rgba] = val;
			}
						
			function blur(ctx, width, height, sigma)
			{
				var srcData = ctx.getImageData(0, 0, width, height);
				var mask = make_fgauss(sigma);
				mask = normalize(mask);
				tmp = [];
				convolve_even(srcData.data, tmp, mask, width, height);
				convolve_even(tmp, srcData.data, mask, height, width);
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}			
		
			this.apply = function(ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				blur(ctx, width, height, this.attribute('stdDeviation').numValue());
			}
		}
		svg.Element.filter.prototype = new svg.Element.feGaussianBlur;
		
		// title element, do nothing
		svg.Element.title = function(node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function(node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;		
		
		svg.Element.MISSING = function(node) {
			console.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;
		
		// element factory
		svg.CreateElement = function(node) {	
			var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
			className = className.replace(/\-/g,''); // remove dashes
			var e = null;
			if (typeof(svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}
				
		// load from url
		svg.load = function(ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}
		
		// load from xml
		svg.loadXml = function(ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}
		
		svg.loadXmlDoc = function(ctx, dom) {
			svg.init(ctx);
			
			var mapXY = function(p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}
			
			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}
		
			var e = svg.CreateElement(dom.documentElement);
			e.root = true;
					
			// render loop
			var isFirstRender = true;
			var draw = function() {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);
			
				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').Length.toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').Length.toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				svg.ViewPort.SetCurrent(cWidth, cHeight);		
				
				if (svg.opts != null && svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts != null && svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts != null && svg.opts['scaleWidth'] != null && svg.opts['scaleHeight'] != null) {
					var xRatio = 1, yRatio = 1;
					if (e.attribute('width').hasValue()) xRatio = e.attribute('width').Length.toPixels('x') / svg.opts['scaleWidth'];
					if (e.attribute('height').hasValue()) yRatio = e.attribute('height').Length.toPixels('y') / svg.opts['scaleHeight'];
				
					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];			
					e.attribute('viewBox', true).value = '0 0 ' + (cWidth * xRatio) + ' ' + (cHeight * yRatio);
					e.attribute('preserveAspectRatio', true).value = 'none';
				}
			
				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (svg.opts != null && typeof(svg.opts['renderCallback']) == 'function') svg.opts['renderCallback']();
				}			
			}
			
			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function() { 
				var needUpdate = false;
				
				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}
			
				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}
			
				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i=0; i<svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}
				
				// need update from redraw?
				if (svg.opts != null && typeof(svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}
				
				// render if needed
				if (needUpdate) {
					draw();				
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}
		
		svg.stop = function() {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}
		
		svg.Mouse = new (function() {
			this.events = [];
			this.hasEvents = function() { return this.events.length != 0; }
		
			this.onclick = function(x, y) {
				this.events.push({ type: 'onclick', x: x, y: y, 
					run: function(e) { if (e.onclick) e.onclick(); }
				});
			}
			
			this.onmousemove = function(x, y) {
				this.events.push({ type: 'onmousemove', x: x, y: y,
					run: function(e) { if (e.onmousemove) e.onmousemove(); }
				});
			}			
			
			this.eventElements = [];
			
			this.checkPath = function(element, ctx) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}
			
			this.checkBoundingBox = function(element, bb) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}			
			}
			
			this.runEvents = function() {
				svg.ctx.canvas.style.cursor = '';
				
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}		
			
				// done running, clear
				this.events = []; 
				this.eventElements = [];
			}
		});
		
		return svg;
	}
})();

if (CanvasRenderingContext2D) {
	CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
		canvg(this.canvas, s, { 
			ignoreMouse: true, 
			ignoreAnimation: true, 
			ignoreDimensions: true, 
			ignoreClear: true, 
			offsetX: dx, 
			offsetY: dy, 
			scaleWidth: dw, 
			scaleHeight: dh
		});
	}
}/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 * CanVGRenderer Extension module
 *
 * (c) 2011-2016 Torstein Honsi, Erik Olsson
 *
 * License: www.highcharts.com/license
 */

(function (Highcharts) {
	var UNDEFINED,
		win = Highcharts.win,
		DIV = 'div',
		ABSOLUTE = 'absolute',
		RELATIVE = 'relative',
		HIDDEN = 'hidden',
		VISIBLE = 'visible',
		PX = 'px',
		css = Highcharts.css,
		CanVGRenderer = Highcharts.CanVGRenderer,
		SVGRenderer = Highcharts.SVGRenderer,
		extend = Highcharts.extend,
		merge = Highcharts.merge,
		addEvent = Highcharts.addEvent,
		createElement = Highcharts.createElement,
		discardElement = Highcharts.discardElement;

	// Extend CanVG renderer on demand, inherit from SVGRenderer
	extend(CanVGRenderer.prototype, SVGRenderer.prototype);

	// Add additional functionality:
	extend(CanVGRenderer.prototype, {
		create: function (chart, container, chartWidth, chartHeight) {
			this.setContainer(container, chartWidth, chartHeight);
			this.configure(chart);
		},
		setContainer: function (container, chartWidth, chartHeight) {
			var containerStyle = container.style,
				containerParent = container.parentNode,
				containerLeft = containerStyle.left,
				containerTop = containerStyle.top,
				containerOffsetWidth = container.offsetWidth,
				containerOffsetHeight = container.offsetHeight,
				canvas,
				initialHiddenStyle = { visibility: HIDDEN, position: ABSOLUTE };

			this.init(container, chartWidth, chartHeight);

			// add the canvas above it
			canvas = createElement('canvas', {
				width: containerOffsetWidth,
				height: containerOffsetHeight
			}, {
				position: RELATIVE,
				left: containerLeft,
				top: containerTop
			}, container);
			this.canvas = canvas;

			// Create the tooltip line and div, they are placed as siblings to
			// the container (and as direct childs to the div specified in the html page)
			this.ttLine = createElement(DIV, null, initialHiddenStyle, containerParent);
			this.ttDiv = createElement(DIV, null, initialHiddenStyle, containerParent);
			this.ttTimer = UNDEFINED;

			// Move away the svg node to a new div inside the container's parent so we can hide it.
			var hiddenSvg = createElement(DIV, {
				width: containerOffsetWidth,
				height: containerOffsetHeight
			}, {
				visibility: HIDDEN,
				left: containerLeft,
				top: containerTop
			}, containerParent);
			this.hiddenSvg = hiddenSvg;
			hiddenSvg.appendChild(this.box);
		},

		/**
		 * Configures the renderer with the chart. Attach a listener to the event tooltipRefresh.
		 **/
		configure: function (chart) {
			var renderer = this,
				options = chart.options.tooltip,
				borderWidth = options.borderWidth,
				tooltipDiv = renderer.ttDiv,
				tooltipDivStyle = options.style,
				tooltipLine = renderer.ttLine,
				padding = parseInt(tooltipDivStyle.padding, 10);

			// Add border styling from options to the style
			tooltipDivStyle = merge(tooltipDivStyle, {
				padding: padding + PX,
				'background-color': options.backgroundColor,
				'border-style': 'solid',
				'border-width': borderWidth + PX,
				'border-radius': options.borderRadius + PX
			});

			// Optionally add shadow
			if (options.shadow) {
				tooltipDivStyle = merge(tooltipDivStyle, {
					'box-shadow': '1px 1px 3px gray', // w3c
					'-webkit-box-shadow': '1px 1px 3px gray' // webkit
				});
			}
			css(tooltipDiv, tooltipDivStyle);

			// Set simple style on the line
			css(tooltipLine, {
				'border-left': '1px solid darkgray'
			});

			// This event is triggered when a new tooltip should be shown
			addEvent(chart, 'tooltipRefresh', function (args) {
				var chartContainer = chart.container,
					offsetLeft = chartContainer.offsetLeft,
					offsetTop = chartContainer.offsetTop,
					position;

				// Set the content of the tooltip
				tooltipDiv.innerHTML = args.text;

				// Compute the best position for the tooltip based on the divs size and container size.
				position = chart.tooltip.getPosition(
					tooltipDiv.offsetWidth, 
					tooltipDiv.offsetHeight, 
					{ plotX: args.x, plotY: args.y }
				);

				css(tooltipDiv, {
					visibility: VISIBLE,
					left: position.x + PX,
					top: position.y + PX,
					'border-color': args.borderColor
				});

				// Position the tooltip line
				css(tooltipLine, {
					visibility: VISIBLE,
					left: offsetLeft + args.x + PX,
					top: offsetTop + chart.plotTop + PX,
					height: chart.plotHeight  + PX
				});

				// This timeout hides the tooltip after 3 seconds
				// First clear any existing timer
				if (renderer.ttTimer !== UNDEFINED) {
					clearTimeout(renderer.ttTimer);
				}

				// Start a new timer that hides tooltip and line
				renderer.ttTimer = setTimeout(function () {
					css(tooltipDiv, { visibility: HIDDEN });
					css(tooltipLine, { visibility: HIDDEN });
				}, 3000);
			});
		},

		/**
		 * Extend SVGRenderer.destroy to also destroy the elements added by CanVGRenderer.
		 */
		destroy: function () {
			var renderer = this;

			// Remove the canvas
			discardElement(renderer.canvas);

			// Kill the timer
			if (renderer.ttTimer !== UNDEFINED) {
				clearTimeout(renderer.ttTimer);
			}

			// Remove the divs for tooltip and line
			discardElement(renderer.ttLine);
			discardElement(renderer.ttDiv);
			discardElement(renderer.hiddenSvg);

			// Continue with base class
			return SVGRenderer.prototype.destroy.apply(renderer);
		},

		/**
		 * Take a color and return it if it's a string, do not make it a gradient even if it is a
		 * gradient. Currently canvg cannot render gradients (turns out black),
		 * see: http://code.google.com/p/canvg/issues/detail?id=104
		 *
		 * @param {Object} color The color or config object
		 */
		color: function (color, elem, prop) {
			if (color && color.linearGradient) {
				// Pick the end color and forward to base implementation
				color = color.stops[color.stops.length - 1][1];
			}
			return SVGRenderer.prototype.color.call(this, color, elem, prop);
		},

		/**
		 * Draws the SVG on the canvas or adds a draw invokation to the deferred list.
		 */
		draw: function () {
			var renderer = this;
			win.canvg(renderer.canvas, renderer.hiddenSvg.innerHTML);
		}
	});
}(Highcharts));
/*
 Highcharts JS v4.2.3 (2016-02-08)
 Data module

 (c) 2012-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(g){typeof module==="object"&&module.exports?module.exports=g:g(Highcharts)})(function(g){var t=g.win.document,j=g.each,u=g.pick,r=g.inArray,v=g.splat,k,p=function(b,a){this.init(b,a)};g.extend(p.prototype,{init:function(b,a){this.options=b;this.chartOptions=a;this.columns=b.columns||this.rowsToColumns(b.rows)||[];this.firstRowAsNames=u(b.firstRowAsNames,!0);this.decimalRegex=b.decimalPoint&&RegExp("^(-?[0-9]+)"+b.decimalPoint+"([0-9]+)$");this.rawColumns=[];this.columns.length?this.dataFound():
(this.parseCSV(),this.parseTable(),this.parseGoogleSpreadsheet())},getColumnDistribution:function(){var b=this.chartOptions,a=this.options,e=[],f=function(b){return(g.seriesTypes[b||"line"].prototype.pointArrayMap||[0]).length},d=b&&b.chart&&b.chart.type,c=[],h=[],q=0,i;j(b&&b.series||[],function(b){c.push(f(b.type||d))});j(a&&a.seriesMapping||[],function(b){e.push(b.x||0)});e.length===0&&e.push(0);j(a&&a.seriesMapping||[],function(a){var e=new k,o,n=c[q]||f(d),m=g.seriesTypes[((b&&b.series||[])[q]||
{}).type||d||"line"].prototype.pointArrayMap||["y"];e.addColumnReader(a.x,"x");for(o in a)a.hasOwnProperty(o)&&o!=="x"&&e.addColumnReader(a[o],o);for(i=0;i<n;i++)e.hasReader(m[i])||e.addColumnReader(void 0,m[i]);h.push(e);q++});a=g.seriesTypes[d||"line"].prototype.pointArrayMap;a===void 0&&(a=["y"]);this.valueCount={global:f(d),xColumns:e,individual:c,seriesBuilders:h,globalPointArrayMap:a}},dataFound:function(){if(this.options.switchRowsAndColumns)this.columns=this.rowsToColumns(this.columns);this.getColumnDistribution();
this.parseTypes();this.parsed()!==!1&&this.complete()},parseCSV:function(){var b=this,a=this.options,e=a.csv,f=this.columns,d=a.startRow||0,c=a.endRow||Number.MAX_VALUE,h=a.startColumn||0,q=a.endColumn||Number.MAX_VALUE,i,g,s=0;e&&(g=e.replace(/\r\n/g,"\n").replace(/\r/g,"\n").split(a.lineDelimiter||"\n"),i=a.itemDelimiter||(e.indexOf("\t")!==-1?"\t":","),j(g,function(a,e){var g=b.trim(a),w=g.indexOf("#")===0;e>=d&&e<=c&&!w&&g!==""&&(g=a.split(i),j(g,function(b,a){a>=h&&a<=q&&(f[a-h]||(f[a-h]=[]),
f[a-h][s]=b)}),s+=1)}),this.dataFound())},parseTable:function(){var b=this.options,a=b.table,e=this.columns,f=b.startRow||0,d=b.endRow||Number.MAX_VALUE,c=b.startColumn||0,h=b.endColumn||Number.MAX_VALUE;a&&(typeof a==="string"&&(a=t.getElementById(a)),j(a.getElementsByTagName("tr"),function(b,a){a>=f&&a<=d&&j(b.children,function(b,d){if((b.tagName==="TD"||b.tagName==="TH")&&d>=c&&d<=h)e[d-c]||(e[d-c]=[]),e[d-c][a-f]=b.innerHTML})}),this.dataFound())},parseGoogleSpreadsheet:function(){var b=this,
a=this.options,e=a.googleSpreadsheetKey,f=this.columns,d=a.startRow||0,c=a.endRow||Number.MAX_VALUE,h=a.startColumn||0,g=a.endColumn||Number.MAX_VALUE,i,j;e&&jQuery.ajax({dataType:"json",url:"https://spreadsheets.google.com/feeds/cells/"+e+"/"+(a.googleSpreadsheetWorksheet||"od6")+"/public/values?alt=json-in-script&callback=?",error:a.error,success:function(a){var a=a.feed.entry,e,n=a.length,m=0,k=0,l;for(l=0;l<n;l++)e=a[l],m=Math.max(m,e.gs$cell.col),k=Math.max(k,e.gs$cell.row);for(l=0;l<m;l++)if(l>=
h&&l<=g)f[l-h]=[],f[l-h].length=Math.min(k,c-d);for(l=0;l<n;l++)if(e=a[l],i=e.gs$cell.row-1,j=e.gs$cell.col-1,j>=h&&j<=g&&i>=d&&i<=c)f[j-h][i-d]=e.content.$t;b.dataFound()}})},trim:function(b,a){typeof b==="string"&&(b=b.replace(/^\s+|\s+$/g,""),a&&/^[0-9\s]+$/.test(b)&&(b=b.replace(/\s/g,"")),this.decimalRegex&&(b=b.replace(this.decimalRegex,"$1.$2")));return b},parseTypes:function(){for(var b=this.columns,a=b.length;a--;)this.parseColumn(b[a],a)},parseColumn:function(b,a){var e=this.rawColumns,
f=this.columns,d=b.length,c,h,g,i,j=this.firstRowAsNames,k=r(a,this.valueCount.xColumns)!==-1,o=[],n=this.chartOptions,m,p=(this.options.columnTypes||[])[a],n=k&&(n&&n.xAxis&&v(n.xAxis)[0].type==="category"||p==="string");for(e[a]||(e[a]=[]);d--;)if(c=o[d]||b[d],g=this.trim(c),i=this.trim(c,!0),h=parseFloat(i),e[a][d]===void 0&&(e[a][d]=g),n||d===0&&j)b[d]=g;else if(+i===h)b[d]=h,h>31536E6&&p!=="float"?b.isDatetime=!0:b.isNumeric=!0,b[d+1]!==void 0&&(m=h>b[d+1]);else if(h=this.parseDate(c),k&&typeof h===
"number"&&!isNaN(h)&&p!=="float"){if(o[d]=c,b[d]=h,b.isDatetime=!0,b[d+1]!==void 0){c=h>b[d+1];if(c!==m&&m!==void 0)this.alternativeFormat?(this.dateFormat=this.alternativeFormat,d=b.length,this.alternativeFormat=this.dateFormats[this.dateFormat].alternative):b.unsorted=!0;m=c}}else if(b[d]=g===""?null:g,d!==0&&(b.isDatetime||b.isNumeric))b.mixed=!0;k&&b.mixed&&(f[a]=e[a]);if(k&&m&&this.options.sort)for(a=0;a<f.length;a++)f[a].reverse(),j&&f[a].unshift(f[a].pop())},dateFormats:{"YYYY-mm-dd":{regex:/^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/,
parser:function(b){return Date.UTC(+b[1],b[2]-1,+b[3])}},"dd/mm/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(b){return Date.UTC(+b[3],b[2]-1,+b[1])},alternative:"mm/dd/YYYY"},"mm/dd/YYYY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,parser:function(b){return Date.UTC(+b[3],b[1]-1,+b[2])}},"dd/mm/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(b){return Date.UTC(+b[3]+2E3,b[2]-1,+b[1])},alternative:"mm/dd/YY"},
"mm/dd/YY":{regex:/^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,parser:function(b){return Date.UTC(+b[3]+2E3,b[1]-1,+b[2])}}},parseDate:function(b){var a=this.options.parseDate,e,f,d=this.options.dateFormat||this.dateFormat,c;if(a)e=a(b);else if(typeof b==="string"){if(d)a=this.dateFormats[d],(c=b.match(a.regex))&&(e=a.parser(c));else for(f in this.dateFormats)if(a=this.dateFormats[f],c=b.match(a.regex)){this.dateFormat=f;this.alternativeFormat=a.alternative;e=a.parser(c);break}c||(c=Date.parse(b),
typeof c==="object"&&c!==null&&c.getTime?e=c.getTime()-c.getTimezoneOffset()*6E4:typeof c==="number"&&!isNaN(c)&&(e=c-(new Date(c)).getTimezoneOffset()*6E4))}return e},rowsToColumns:function(b){var a,e,f,d,c;if(b){c=[];e=b.length;for(a=0;a<e;a++){d=b[a].length;for(f=0;f<d;f++)c[f]||(c[f]=[]),c[f][a]=b[a][f]}}return c},parsed:function(){if(this.options.parsed)return this.options.parsed.call(this,this.columns)},getFreeIndexes:function(b,a){var e,f,d=[],c=[],h;for(f=0;f<b;f+=1)d.push(!0);for(e=0;e<a.length;e+=
1){h=a[e].getReferencedColumnIndexes();for(f=0;f<h.length;f+=1)d[h[f]]=!1}for(f=0;f<d.length;f+=1)d[f]&&c.push(f);return c},complete:function(){var b=this.columns,a,e=this.options,f,d,c,h,g=[],i;if(e.complete||e.afterComplete){for(c=0;c<b.length;c++)if(this.firstRowAsNames)b[c].name=b[c].shift();f=[];d=this.getFreeIndexes(b.length,this.valueCount.seriesBuilders);for(c=0;c<this.valueCount.seriesBuilders.length;c++)i=this.valueCount.seriesBuilders[c],i.populateColumns(d)&&g.push(i);for(;d.length>0;){i=
new k;i.addColumnReader(0,"x");c=r(0,d);c!==-1&&d.splice(c,1);for(c=0;c<this.valueCount.global;c++)i.addColumnReader(void 0,this.valueCount.globalPointArrayMap[c]);i.populateColumns(d)&&g.push(i)}g.length>0&&g[0].readers.length>0&&(i=b[g[0].readers[0].columnIndex],i!==void 0&&(i.isDatetime?a="datetime":i.isNumeric||(a="category")));if(a==="category")for(c=0;c<g.length;c++){i=g[c];for(d=0;d<i.readers.length;d++)if(i.readers[d].configName==="x")i.readers[d].configName="name"}for(c=0;c<g.length;c++){i=
g[c];d=[];for(h=0;h<b[0].length;h++)d[h]=i.read(b,h);f[c]={data:d};if(i.name)f[c].name=i.name;if(a==="category")f[c].turboThreshold=0}b={series:f};if(a)b.xAxis={type:a};e.complete&&e.complete(b);e.afterComplete&&e.afterComplete(b)}}});g.Data=p;g.data=function(b,a){return new p(b,a)};g.wrap(g.Chart.prototype,"init",function(b,a,e){var f=this;a&&a.data?g.data(g.extend(a.data,{afterComplete:function(d){var c,h;if(a.hasOwnProperty("series"))if(typeof a.series==="object")for(c=Math.max(a.series.length,
d.series.length);c--;)h=a.series[c]||{},a.series[c]=g.merge(h,d.series[c]);else delete a.series;a=g.merge(d,a);b.call(f,a,e)}}),a):b.call(f,a,e)});k=function(){this.readers=[];this.pointIsArray=!0};k.prototype.populateColumns=function(b){var a=!0;j(this.readers,function(a){if(a.columnIndex===void 0)a.columnIndex=b.shift()});j(this.readers,function(b){b.columnIndex===void 0&&(a=!1)});return a};k.prototype.read=function(b,a){var e=this.pointIsArray,f=e?[]:{},d;j(this.readers,function(c){var d=b[c.columnIndex][a];
e?f.push(d):f[c.configName]=d});if(this.name===void 0&&this.readers.length>=2&&(d=this.getReferencedColumnIndexes(),d.length>=2))d.shift(),d.sort(),this.name=b[d.shift()].name;return f};k.prototype.addColumnReader=function(b,a){this.readers.push({columnIndex:b,configName:a});if(!(a==="x"||a==="y"||a===void 0))this.pointIsArray=!1};k.prototype.getReferencedColumnIndexes=function(){var b,a=[],e;for(b=0;b<this.readers.length;b+=1)e=this.readers[b],e.columnIndex!==void 0&&a.push(e.columnIndex);return a};
k.prototype.hasReader=function(b){var a,e;for(a=0;a<this.readers.length;a+=1)if(e=this.readers[a],e.configName===b)return!0}});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 * Data module
 *
 * (c) 2012-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*global jQuery */

(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {
	
	// Utilities
	var win = Highcharts.win,
		doc = win.document,
		each = Highcharts.each,
		pick = Highcharts.pick,
		inArray = Highcharts.inArray,
		splat = Highcharts.splat,
		SeriesBuilder;
	
	
	// The Data constructor
	var Data = function (dataOptions, chartOptions) {
		this.init(dataOptions, chartOptions);
	};
	
	// Set the prototype properties
	Highcharts.extend(Data.prototype, {
		
		/**
		 * Initialize the Data object with the given options
		 */
		init: function (options, chartOptions) {
			this.options = options;
			this.chartOptions = chartOptions;
			this.columns = options.columns || this.rowsToColumns(options.rows) || [];
			this.firstRowAsNames = pick(options.firstRowAsNames, true);
			this.decimalRegex = options.decimalPoint && new RegExp('^(-?[0-9]+)' + options.decimalPoint + '([0-9]+)$');

			// This is a two-dimensional array holding the raw, trimmed string values
			// with the same organisation as the columns array. It makes it possible
			// for example to revert from interpreted timestamps to string-based
			// categories.
			this.rawColumns = [];

			// No need to parse or interpret anything
			if (this.columns.length) {
				this.dataFound();

			// Parse and interpret
			} else {

				// Parse a CSV string if options.csv is given
				this.parseCSV();
				
				// Parse a HTML table if options.table is given
				this.parseTable();

				// Parse a Google Spreadsheet 
				this.parseGoogleSpreadsheet();	
			}

		},

		/**
		 * Get the column distribution. For example, a line series takes a single column for 
		 * Y values. A range series takes two columns for low and high values respectively,
		 * and an OHLC series takes four columns.
		 */
		getColumnDistribution: function () {
			var chartOptions = this.chartOptions,
				options = this.options,
				xColumns = [],
				getValueCount = function (type) {
					return (Highcharts.seriesTypes[type || 'line'].prototype.pointArrayMap || [0]).length;
				},
				getPointArrayMap = function (type) {
					return Highcharts.seriesTypes[type || 'line'].prototype.pointArrayMap;
				},
				globalType = chartOptions && chartOptions.chart && chartOptions.chart.type,
				individualCounts = [],
				seriesBuilders = [],
				seriesIndex = 0,
				i;

			each((chartOptions && chartOptions.series) || [], function (series) {
				individualCounts.push(getValueCount(series.type || globalType));
			});

			// Collect the x-column indexes from seriesMapping
			each((options && options.seriesMapping) || [], function (mapping) {
				xColumns.push(mapping.x || 0);
			});

			// If there are no defined series with x-columns, use the first column as x column
			if (xColumns.length === 0) {
				xColumns.push(0);
			}

			// Loop all seriesMappings and constructs SeriesBuilders from
			// the mapping options.
			each((options && options.seriesMapping) || [], function (mapping) {
				var builder = new SeriesBuilder(),
					name,
					numberOfValueColumnsNeeded = individualCounts[seriesIndex] || getValueCount(globalType),
					seriesArr = (chartOptions && chartOptions.series) || [],
					series = seriesArr[seriesIndex] || {},
					pointArrayMap = getPointArrayMap(series.type || globalType) || ['y'];

				// Add an x reader from the x property or from an undefined column
				// if the property is not set. It will then be auto populated later.
				builder.addColumnReader(mapping.x, 'x');

				// Add all column mappings
				for (name in mapping) {
					if (mapping.hasOwnProperty(name) && name !== 'x') {
						builder.addColumnReader(mapping[name], name);
					}
				}

				// Add missing columns
				for (i = 0; i < numberOfValueColumnsNeeded; i++) {
					if (!builder.hasReader(pointArrayMap[i])) {
						//builder.addNextColumnReader(pointArrayMap[i]);
						// Create and add a column reader for the next free column index
						builder.addColumnReader(undefined, pointArrayMap[i]);
					}
				}

				seriesBuilders.push(builder);
				seriesIndex++;
			});

			var globalPointArrayMap = getPointArrayMap(globalType);
			if (globalPointArrayMap === undefined) {
				globalPointArrayMap = ['y'];
			}

			this.valueCount = {
				global: getValueCount(globalType),
				xColumns: xColumns,
				individual: individualCounts,
				seriesBuilders: seriesBuilders,
				globalPointArrayMap: globalPointArrayMap
			};
		},

		/**
		 * When the data is parsed into columns, either by CSV, table, GS or direct input,
		 * continue with other operations.
		 */
		dataFound: function () {
			
			if (this.options.switchRowsAndColumns) {
				this.columns = this.rowsToColumns(this.columns);
			}

			// Interpret the info about series and columns
			this.getColumnDistribution();

			// Interpret the values into right types
			this.parseTypes();
			
			// Handle columns if a handleColumns callback is given
			if (this.parsed() !== false) {
			
				// Complete if a complete callback is given
				this.complete();
			}
			
		},
		
		/**
		 * Parse a CSV input string
		 */
		parseCSV: function () {
			var self = this,
				options = this.options,
				csv = options.csv,
				columns = this.columns,
				startRow = options.startRow || 0,
				endRow = options.endRow || Number.MAX_VALUE,
				startColumn = options.startColumn || 0,
				endColumn = options.endColumn || Number.MAX_VALUE,
				itemDelimiter,
				lines,
				activeRowNo = 0;
				
			if (csv) {
				
				lines = csv
					.replace(/\r\n/g, '\n') // Unix
					.replace(/\r/g, '\n') // Mac
					.split(options.lineDelimiter || '\n');

				itemDelimiter = options.itemDelimiter || (csv.indexOf('\t') !== -1 ? '\t' : ',');
				
				each(lines, function (line, rowNo) {
					var trimmed = self.trim(line),
						isComment = trimmed.indexOf('#') === 0,
						isBlank = trimmed === '',
						items;
					
					if (rowNo >= startRow && rowNo <= endRow && !isComment && !isBlank) {
						items = line.split(itemDelimiter);
						each(items, function (item, colNo) {
							if (colNo >= startColumn && colNo <= endColumn) {
								if (!columns[colNo - startColumn]) {
									columns[colNo - startColumn] = [];					
								}
								
								columns[colNo - startColumn][activeRowNo] = item;
							}
						});
						activeRowNo += 1;
					}
				});

				this.dataFound();
			}
		},
		
		/**
		 * Parse a HTML table
		 */
		parseTable: function () {
			var options = this.options,
				table = options.table,
				columns = this.columns,
				startRow = options.startRow || 0,
				endRow = options.endRow || Number.MAX_VALUE,
				startColumn = options.startColumn || 0,
				endColumn = options.endColumn || Number.MAX_VALUE;

			if (table) {
				
				if (typeof table === 'string') {
					table = doc.getElementById(table);
				}
				
				each(table.getElementsByTagName('tr'), function (tr, rowNo) {
					if (rowNo >= startRow && rowNo <= endRow) {
						each(tr.children, function (item, colNo) {
							if ((item.tagName === 'TD' || item.tagName === 'TH') && colNo >= startColumn && colNo <= endColumn) {
								if (!columns[colNo - startColumn]) {
									columns[colNo - startColumn] = [];					
								}
								
								columns[colNo - startColumn][rowNo - startRow] = item.innerHTML;
							}
						});
					}
				});

				this.dataFound(); // continue
			}
		},

		/**
		 */
		parseGoogleSpreadsheet: function () {
			var self = this,
				options = this.options,
				googleSpreadsheetKey = options.googleSpreadsheetKey,
				columns = this.columns,
				startRow = options.startRow || 0,
				endRow = options.endRow || Number.MAX_VALUE,
				startColumn = options.startColumn || 0,
				endColumn = options.endColumn || Number.MAX_VALUE,
				gr, // google row
				gc; // google column

			if (googleSpreadsheetKey) {
				jQuery.ajax({
					dataType: 'json', 
					url: 'https://spreadsheets.google.com/feeds/cells/' + 
						googleSpreadsheetKey + '/' + (options.googleSpreadsheetWorksheet || 'od6') +
						'/public/values?alt=json-in-script&callback=?',
					error: options.error,
					success: function (json) {
						// Prepare the data from the spreadsheat
						var cells = json.feed.entry,
							cell,
							cellCount = cells.length,
							colCount = 0,
							rowCount = 0,
							i;
					
						// First, find the total number of columns and rows that 
						// are actually filled with data
						for (i = 0; i < cellCount; i++) {
							cell = cells[i];
							colCount = Math.max(colCount, cell.gs$cell.col);
							rowCount = Math.max(rowCount, cell.gs$cell.row);			
						}
					
						// Set up arrays containing the column data
						for (i = 0; i < colCount; i++) {
							if (i >= startColumn && i <= endColumn) {
								// Create new columns with the length of either end-start or rowCount
								columns[i - startColumn] = [];

								// Setting the length to avoid jslint warning
								columns[i - startColumn].length = Math.min(rowCount, endRow - startRow);
							}
						}
						
						// Loop over the cells and assign the value to the right
						// place in the column arrays
						for (i = 0; i < cellCount; i++) {
							cell = cells[i];
							gr = cell.gs$cell.row - 1; // rows start at 1
							gc = cell.gs$cell.col - 1; // columns start at 1

							// If both row and col falls inside start and end
							// set the transposed cell value in the newly created columns
							if (gc >= startColumn && gc <= endColumn &&
								gr >= startRow && gr <= endRow) {
								columns[gc - startColumn][gr - startRow] = cell.content.$t;
							}
						}
						self.dataFound();
					}
				});
			}
		},
		
		/**
		 * Trim a string from whitespace
		 */
		trim: function (str, inside) {
			if (typeof str === 'string') {
				str = str.replace(/^\s+|\s+$/g, '');

				// Clear white space insdie the string, like thousands separators
				if (inside && /^[0-9\s]+$/.test(str)) { 
					str = str.replace(/\s/g, '');
				}

				if (this.decimalRegex) {
					str = str.replace(this.decimalRegex, '$1.$2');
				}
			}
			return str;
		},
		
		/**
		 * Parse numeric cells in to number types and date types in to true dates.
		 */
		parseTypes: function () {
			var columns = this.columns,
				col = columns.length;

			while (col--) {
				this.parseColumn(columns[col], col);
			}

		},

		/**
		 * Parse a single column. Set properties like .isDatetime and .isNumeric.
		 */
		parseColumn: function (column, col) {
			var rawColumns = this.rawColumns,
				columns = this.columns, 
				row = column.length,
				val,
				floatVal,
				trimVal,
				trimInsideVal,
				firstRowAsNames = this.firstRowAsNames,
				isXColumn = inArray(col, this.valueCount.xColumns) !== -1,
				dateVal,
				backup = [],
				diff,
				chartOptions = this.chartOptions,
				descending,
				columnTypes = this.options.columnTypes || [],
				columnType = columnTypes[col],
				forceCategory = isXColumn && ((chartOptions && chartOptions.xAxis && splat(chartOptions.xAxis)[0].type === 'category') || columnType === 'string');
			
			if (!rawColumns[col]) {
				rawColumns[col] = [];
			}
			while (row--) {
				val = backup[row] || column[row];
				
				trimVal = this.trim(val);
				trimInsideVal = this.trim(val, true);
				floatVal = parseFloat(trimInsideVal);

				// Set it the first time
				if (rawColumns[col][row] === undefined) {
					rawColumns[col][row] = trimVal;
				}
				
				// Disable number or date parsing by setting the X axis type to category
				if (forceCategory || (row === 0 && firstRowAsNames)) {
					column[row] = trimVal;

				} else if (+trimInsideVal === floatVal) { // is numeric
				
					column[row] = floatVal;
					
					// If the number is greater than milliseconds in a year, assume datetime
					if (floatVal > 365 * 24 * 3600 * 1000 && columnType !== 'float') {
						column.isDatetime = true;
					} else {
						column.isNumeric = true;
					}

					if (column[row + 1] !== undefined) {
						descending = floatVal > column[row + 1];
					}
				
				// String, continue to determine if it is a date string or really a string
				} else {
					dateVal = this.parseDate(val);
					// Only allow parsing of dates if this column is an x-column
					if (isXColumn && typeof dateVal === 'number' && !isNaN(dateVal) && columnType !== 'float') { // is date
						backup[row] = val; 
						column[row] = dateVal;
						column.isDatetime = true;

						// Check if the dates are uniformly descending or ascending. If they 
						// are not, chances are that they are a different time format, so check
						// for alternative.
						if (column[row + 1] !== undefined) {
							diff = dateVal > column[row + 1];
							if (diff !== descending && descending !== undefined) {
								if (this.alternativeFormat) {
									this.dateFormat = this.alternativeFormat;
									row = column.length;
									this.alternativeFormat = this.dateFormats[this.dateFormat].alternative;
								} else {
									column.unsorted = true;
								}
							}
							descending = diff;
						}
					
					} else { // string
						column[row] = trimVal === '' ? null : trimVal;
						if (row !== 0 && (column.isDatetime || column.isNumeric)) {
							column.mixed = true;
						}
					}
				}
			}

			// If strings are intermixed with numbers or dates in a parsed column, it is an indication
			// that parsing went wrong or the data was not intended to display as numbers or dates and 
			// parsing is too aggressive. Fall back to categories. Demonstrated in the 
			// highcharts/demo/column-drilldown sample.
			if (isXColumn && column.mixed) {
				columns[col] = rawColumns[col];
			}

			// If the 0 column is date or number and descending, reverse all columns. 
			if (isXColumn && descending && this.options.sort) {
				for (col = 0; col < columns.length; col++) {
					columns[col].reverse();
					if (firstRowAsNames) {
						columns[col].unshift(columns[col].pop());
					}
				}
			}
		},
		
		/**
		 * A collection of available date formats, extendable from the outside to support
		 * custom date formats.
		 */
		dateFormats: {
			'YYYY-mm-dd': {
				regex: /^([0-9]{4})[\-\/\.]([0-9]{2})[\-\/\.]([0-9]{2})$/,
				parser: function (match) {
					return Date.UTC(+match[1], match[2] - 1, +match[3]);
				}
			},
			'dd/mm/YYYY': {
				regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,
				parser: function (match) {
					return Date.UTC(+match[3], match[2] - 1, +match[1]);
				},
				alternative: 'mm/dd/YYYY' // different format with the same regex
			},
			'mm/dd/YYYY': {
				regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{4})$/,
				parser: function (match) {
					return Date.UTC(+match[3], match[1] - 1, +match[2]);
				}
			},
			'dd/mm/YY': {
				regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
				parser: function (match) {
					return Date.UTC(+match[3] + 2000, match[2] - 1, +match[1]);
				},
				alternative: 'mm/dd/YY' // different format with the same regex
			},
			'mm/dd/YY': {
				regex: /^([0-9]{1,2})[\-\/\.]([0-9]{1,2})[\-\/\.]([0-9]{2})$/,
				parser: function (match) {
					return Date.UTC(+match[3] + 2000, match[1] - 1, +match[2]);
				}
			}
		},
		
		/**
		 * Parse a date and return it as a number. Overridable through options.parseDate.
		 */
		parseDate: function (val) {
			var parseDate = this.options.parseDate,
				ret,
				key,
				format,
				dateFormat = this.options.dateFormat || this.dateFormat,
				match;

			if (parseDate) {
				ret = parseDate(val);
			
			} else if (typeof val === 'string') {
				// Auto-detect the date format the first time
				if (!dateFormat) {
					for (key in this.dateFormats) {
						format = this.dateFormats[key];
						match = val.match(format.regex);
						if (match) {
							this.dateFormat = dateFormat = key;
							this.alternativeFormat = format.alternative;
							ret = format.parser(match);
							break;
						}
					}
				// Next time, use the one previously found
				} else {
					format = this.dateFormats[dateFormat];
					match = val.match(format.regex);
					if (match) {
						ret = format.parser(match);
					}
				}
				// Fall back to Date.parse		
				if (!match) {
					match = Date.parse(val);
					// External tools like Date.js and MooTools extend Date object and
					// returns a date.
					if (typeof match === 'object' && match !== null && match.getTime) {
						ret = match.getTime() - match.getTimezoneOffset() * 60000;
					
					// Timestamp
					} else if (typeof match === 'number' && !isNaN(match)) {
						ret = match - (new Date(match)).getTimezoneOffset() * 60000;
					}
				}
			}
			return ret;
		},
		
		/**
		 * Reorganize rows into columns
		 */
		rowsToColumns: function (rows) {
			var row,
				rowsLength,
				col,
				colsLength,
				columns;

			if (rows) {
				columns = [];
				rowsLength = rows.length;
				for (row = 0; row < rowsLength; row++) {
					colsLength = rows[row].length;
					for (col = 0; col < colsLength; col++) {
						if (!columns[col]) {
							columns[col] = [];
						}
						columns[col][row] = rows[row][col];
					}
				}
			}
			return columns;
		},
		
		/**
		 * A hook for working directly on the parsed columns
		 */
		parsed: function () {
			if (this.options.parsed) {
				return this.options.parsed.call(this, this.columns);
			}
		},

		getFreeIndexes: function (numberOfColumns, seriesBuilders) {
			var s,
				i,
				freeIndexes = [],
				freeIndexValues = [],
				referencedIndexes;

			// Add all columns as free
			for (i = 0; i < numberOfColumns; i = i + 1) {
				freeIndexes.push(true);
			}

			// Loop all defined builders and remove their referenced columns
			for (s = 0; s < seriesBuilders.length; s = s + 1) {
				referencedIndexes = seriesBuilders[s].getReferencedColumnIndexes();

				for (i = 0; i < referencedIndexes.length; i = i + 1) {
					freeIndexes[referencedIndexes[i]] = false;
				}
			}

			// Collect the values for the free indexes
			for (i = 0; i < freeIndexes.length; i = i + 1) {
				if (freeIndexes[i]) {
					freeIndexValues.push(i);
				}
			}

			return freeIndexValues;
		},
		
		/**
		 * If a complete callback function is provided in the options, interpret the 
		 * columns into a Highcharts options object.
		 */
		complete: function () {
			
			var columns = this.columns,
				xColumns = [],
				type,
				options = this.options,
				series,
				data,
				i,
				j,
				r,
				seriesIndex,
				chartOptions,
				allSeriesBuilders = [],
				builder,
				freeIndexes,
				typeCol,
				index;

			xColumns.length = columns.length;
			if (options.complete || options.afterComplete) {

				// Get the names and shift the top row
				for (i = 0; i < columns.length; i++) {
					if (this.firstRowAsNames) {
						columns[i].name = columns[i].shift();
					}
				}
				
				// Use the next columns for series
				series = [];
				freeIndexes = this.getFreeIndexes(columns.length, this.valueCount.seriesBuilders);

				// Populate defined series
				for (seriesIndex = 0; seriesIndex < this.valueCount.seriesBuilders.length; seriesIndex++) {
					builder = this.valueCount.seriesBuilders[seriesIndex];

					// If the builder can be populated with remaining columns, then add it to allBuilders
					if (builder.populateColumns(freeIndexes)) {
						allSeriesBuilders.push(builder);
					}
				}

				// Populate dynamic series
				while (freeIndexes.length > 0) {
					builder = new SeriesBuilder();
					builder.addColumnReader(0, 'x');
					
					// Mark index as used (not free)
					index = inArray(0, freeIndexes);
					if (index !== -1) {
						freeIndexes.splice(index, 1);
					}

					for (i = 0; i < this.valueCount.global; i++) {
						// Create and add a column reader for the next free column index
						builder.addColumnReader(undefined, this.valueCount.globalPointArrayMap[i]);
					}

					// If the builder can be populated with remaining columns, then add it to allBuilders
					if (builder.populateColumns(freeIndexes)) {
						allSeriesBuilders.push(builder);
					}
				}

				// Get the data-type from the first series x column
				if (allSeriesBuilders.length > 0 && allSeriesBuilders[0].readers.length > 0) {
					typeCol = columns[allSeriesBuilders[0].readers[0].columnIndex];
					if (typeCol !== undefined) {
						if (typeCol.isDatetime) {
							type = 'datetime';
						} else if (!typeCol.isNumeric) {
							type = 'category';
						}
					}
				}
				// Axis type is category, then the "x" column should be called "name"
				if (type === 'category') {
					for (seriesIndex = 0; seriesIndex < allSeriesBuilders.length; seriesIndex++) {
						builder = allSeriesBuilders[seriesIndex];
						for (r = 0; r < builder.readers.length; r++) {
							if (builder.readers[r].configName === 'x') {
								builder.readers[r].configName = 'name';
							}
						}
					}
				}

				// Read data for all builders
				for (seriesIndex = 0; seriesIndex < allSeriesBuilders.length; seriesIndex++) {
					builder = allSeriesBuilders[seriesIndex];

					// Iterate down the cells of each column and add data to the series
					data = [];
					for (j = 0; j < columns[0].length; j++) {
						data[j] = builder.read(columns, j);
					}

					// Add the series
					series[seriesIndex] = {
						data: data
					};
					if (builder.name) {
						series[seriesIndex].name = builder.name;
					}
					if (type === 'category') {
						series[seriesIndex].turboThreshold = 0;
					}
				}



				// Do the callback
				chartOptions = {
					series: series
				};
				if (type) {
					chartOptions.xAxis = {
						type: type
					};
				}
				
				if (options.complete) {
					options.complete(chartOptions);
				}

				// The afterComplete hook is used internally to avoid conflict with the externally
				// available complete option.
				if (options.afterComplete) {
					options.afterComplete(chartOptions);
				}
			}
		}
	});
	
	// Register the Data prototype and data function on Highcharts
	Highcharts.Data = Data;
	Highcharts.data = function (options, chartOptions) {
		return new Data(options, chartOptions);
	};

	// Extend Chart.init so that the Chart constructor accepts a new configuration
	// option group, data.
	Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed, userOptions, callback) {
		var chart = this;

		if (userOptions && userOptions.data) {
			Highcharts.data(Highcharts.extend(userOptions.data, {

				afterComplete: function (dataOptions) {
					var i, series;
					
					// Merge series configs
					if (userOptions.hasOwnProperty('series')) {
						if (typeof userOptions.series === 'object') {
							i = Math.max(userOptions.series.length, dataOptions.series.length);
							while (i--) {
								series = userOptions.series[i] || {};
								userOptions.series[i] = Highcharts.merge(series, dataOptions.series[i]);
							}
						} else { // Allow merging in dataOptions.series (#2856)
							delete userOptions.series;
						}
					}

					// Do the merge
					userOptions = Highcharts.merge(dataOptions, userOptions);

					proceed.call(chart, userOptions, callback);
				}
			}), userOptions);
		} else {
			proceed.call(chart, userOptions, callback);
		}
	});

	/**
	 * Creates a new SeriesBuilder. A SeriesBuilder consists of a number
	 * of ColumnReaders that reads columns and give them a name.
	 * Ex: A series builder can be constructed to read column 3 as 'x' and
	 * column 7 and 8 as 'y1' and 'y2'.
	 * The output would then be points/rows of the form {x: 11, y1: 22, y2: 33}
	 * 
	 * The name of the builder is taken from the second column. In the above
	 * example it would be the column with index 7.
	 * @constructor
	 */
	SeriesBuilder = function () {
		this.readers = [];
		this.pointIsArray = true;
	};

	/**
	 * Populates readers with column indexes. A reader can be added without
	 * a specific index and for those readers the index is taken sequentially
	 * from the free columns (this is handled by the ColumnCursor instance).
	 * @returns {boolean}
	 */
	SeriesBuilder.prototype.populateColumns = function (freeIndexes) {
		var builder = this,
			enoughColumns = true;

		// Loop each reader and give it an index if its missing.
		// The freeIndexes.shift() will return undefined if there
		// are no more columns.
		each(builder.readers, function (reader) {
			if (reader.columnIndex === undefined) {
				reader.columnIndex = freeIndexes.shift();
			}
		});

		// Now, all readers should have columns mapped. If not
		// then return false to signal that this series should
		// not be added.
		each(builder.readers, function (reader) {
			if (reader.columnIndex === undefined) {
				enoughColumns = false;
			}
		});

		return enoughColumns;
	};

	/**
	 * Reads a row from the dataset and returns a point or array depending
	 * on the names of the readers.
	 * @param columns
	 * @param rowIndex
	 * @returns {Array | Object}
	 */
	SeriesBuilder.prototype.read = function (columns, rowIndex) {
		var builder = this,
			pointIsArray = builder.pointIsArray,
			point = pointIsArray ? [] : {},
			columnIndexes;

		// Loop each reader and ask it to read its value.
		// Then, build an array or point based on the readers names.
		each(builder.readers, function (reader) {
			var value = columns[reader.columnIndex][rowIndex];
			if (pointIsArray) {
				point.push(value);
			} else {
				point[reader.configName] = value; 
			}
		});

		// The name comes from the first column (excluding the x column)
		if (this.name === undefined && builder.readers.length >= 2) {
			columnIndexes = builder.getReferencedColumnIndexes();
			if (columnIndexes.length >= 2) {
				// remove the first one (x col)
				columnIndexes.shift();

				// Sort the remaining
				columnIndexes.sort();

				// Now use the lowest index as name column
				this.name = columns[columnIndexes.shift()].name;
			}
		}

		return point;
	};

	/**
	 * Creates and adds ColumnReader from the given columnIndex and configName.
	 * ColumnIndex can be undefined and in that case the reader will be given
	 * an index when columns are populated.
	 * @param columnIndex {Number | undefined}
	 * @param configName
	 */
	SeriesBuilder.prototype.addColumnReader = function (columnIndex, configName) {
		this.readers.push({
			columnIndex: columnIndex, 
			configName: configName
		});

		if (!(configName === 'x' || configName === 'y' || configName === undefined)) {
			this.pointIsArray = false;
		}
	};

	/**
	 * Returns an array of column indexes that the builder will use when
	 * reading data.
	 * @returns {Array}
	 */
	SeriesBuilder.prototype.getReferencedColumnIndexes = function () {
		var i,
			referencedColumnIndexes = [],
			columnReader;
		
		for (i = 0; i < this.readers.length; i = i + 1) {
			columnReader = this.readers[i];
			if (columnReader.columnIndex !== undefined) {
				referencedColumnIndexes.push(columnReader.columnIndex);
			}
		}

		return referencedColumnIndexes;
	};

	/**
	 * Returns true if the builder has a reader for the given configName.
	 * @param configName
	 * @returns {boolean}
	 */
	SeriesBuilder.prototype.hasReader = function (configName) {
		var i, columnReader;
		for (i = 0; i < this.readers.length; i = i + 1) {
			columnReader = this.readers[i];
			if (columnReader.configName === configName) {
				return true;
			}
		}
		// Else return undefined
	};



}));
(function(d){typeof module==="object"&&module.exports?module.exports=d:d(Highcharts)})(function(d){function A(a,b,c){var e;!b.rgba.length||!a.rgba.length?a=b.input||"none":(a=a.rgba,b=b.rgba,e=b[3]!==1||a[3]!==1,a=(e?"rgba(":"rgb(")+Math.round(b[0]+(a[0]-b[0])*(1-c))+","+Math.round(b[1]+(a[1]-b[1])*(1-c))+","+Math.round(b[2]+(a[2]-b[2])*(1-c))+(e?","+(b[3]+(a[3]-b[3])*(1-c)):"")+")");return a}var t=function(){},q=d.getOptions(),h=d.each,l=d.extend,B=d.format,u=d.pick,r=d.wrap,m=d.Chart,p=d.seriesTypes,
v=p.pie,n=p.column,w=d.Tick,x=d.fireEvent,y=d.inArray,z=1;h(["fill","stroke"],function(a){d.Fx.prototype[a+"Setter"]=function(){this.elem.attr(a,A(d.Color(this.start),d.Color(this.end),this.pos))}});l(q.lang,{drillUpText:"\u25c1 Back to {series.name}"});q.drilldown={activeAxisLabelStyle:{cursor:"pointer",color:"#0d233a",fontWeight:"bold",textDecoration:"underline"},activeDataLabelStyle:{cursor:"pointer",color:"#0d233a",fontWeight:"bold",textDecoration:"underline"},animation:{duration:500},drillUpButton:{position:{align:"right",
x:-10,y:10}}};d.SVGRenderer.prototype.Element.prototype.fadeIn=function(a){this.attr({opacity:0.1,visibility:"inherit"}).animate({opacity:u(this.newOpacity,1)},a||{duration:250})};m.prototype.addSeriesAsDrilldown=function(a,b){this.addSingleSeriesAsDrilldown(a,b);this.applyDrilldown()};m.prototype.addSingleSeriesAsDrilldown=function(a,b){var c=a.series,e=c.xAxis,g=c.yAxis,f;f=a.color||c.color;var i,d=[],j=[],k,o;if(!this.drilldownLevels)this.drilldownLevels=[];k=c.options._levelNumber||0;(o=this.drilldownLevels[this.drilldownLevels.length-
1])&&o.levelNumber!==k&&(o=void 0);b=l({color:f,_ddSeriesId:z++},b);i=y(a,c.points);h(c.chart.series,function(a){if(a.xAxis===e&&!a.isDrilling)a.options._ddSeriesId=a.options._ddSeriesId||z++,a.options._colorIndex=a.userOptions._colorIndex,a.options._levelNumber=a.options._levelNumber||k,o?(d=o.levelSeries,j=o.levelSeriesOptions):(d.push(a),j.push(a.options))});f={levelNumber:k,seriesOptions:c.options,levelSeriesOptions:j,levelSeries:d,shapeArgs:a.shapeArgs,bBox:a.graphic?a.graphic.getBBox():{},color:f,
lowerSeriesOptions:b,pointOptions:c.options.data[i],pointIndex:i,oldExtremes:{xMin:e&&e.userMin,xMax:e&&e.userMax,yMin:g&&g.userMin,yMax:g&&g.userMax}};this.drilldownLevels.push(f);f=f.lowerSeries=this.addSeries(b,!1);f.options._levelNumber=k+1;if(e)e.oldPos=e.pos,e.userMin=e.userMax=null,g.userMin=g.userMax=null;if(c.type===f.type)f.animate=f.animateDrilldown||t,f.options.animation=!0};m.prototype.applyDrilldown=function(){var a=this.drilldownLevels,b;if(a&&a.length>0)b=a[a.length-1].levelNumber,
h(this.drilldownLevels,function(a){a.levelNumber===b&&h(a.levelSeries,function(a){a.options&&a.options._levelNumber===b&&a.remove(!1)})});this.redraw();this.showDrillUpButton()};m.prototype.getDrilldownBackText=function(){var a=this.drilldownLevels;if(a&&a.length>0)return a=a[a.length-1],a.series=a.seriesOptions,B(this.options.lang.drillUpText,a)};m.prototype.showDrillUpButton=function(){var a=this,b=this.getDrilldownBackText(),c=a.options.drilldown.drillUpButton,e,g;this.drillUpButton?this.drillUpButton.attr({text:b}).align():
(g=(e=c.theme)&&e.states,this.drillUpButton=this.renderer.button(b,null,null,function(){a.drillUp()},e,g&&g.hover,g&&g.select).attr({align:c.position.align,zIndex:9}).add().align(c.position,!1,c.relativeTo||"plotBox"))};m.prototype.drillUp=function(){for(var a=this,b=a.drilldownLevels,c=b[b.length-1].levelNumber,e=b.length,g=a.series,f,i,d,j,k=function(b){var c;h(g,function(a){a.options._ddSeriesId===b._ddSeriesId&&(c=a)});c=c||a.addSeries(b,!1);if(c.type===d.type&&c.animateDrillupTo)c.animate=c.animateDrillupTo;
b===i.seriesOptions&&(j=c)};e--;)if(i=b[e],i.levelNumber===c){b.pop();d=i.lowerSeries;if(!d.chart)for(f=g.length;f--;)if(g[f].options.id===i.lowerSeriesOptions.id&&g[f].options._levelNumber===c+1){d=g[f];break}d.xData=[];h(i.levelSeriesOptions,k);x(a,"drillup",{seriesOptions:i.seriesOptions});if(j.type===d.type)j.drilldownLevel=i,j.options.animation=a.options.drilldown.animation,d.animateDrillupFrom&&d.chart&&d.animateDrillupFrom(i);j.options._levelNumber=c;d.remove(!1);if(j.xAxis)f=i.oldExtremes,
j.xAxis.setExtremes(f.xMin,f.xMax,!1),j.yAxis.setExtremes(f.yMin,f.yMax,!1)}this.redraw();this.drilldownLevels.length===0?this.drillUpButton=this.drillUpButton.destroy():this.drillUpButton.attr({text:this.getDrilldownBackText()}).align();this.ddDupes.length=[]};n.prototype.supportsDrilldown=!0;n.prototype.animateDrillupTo=function(a){if(!a){var b=this,c=b.drilldownLevel;h(this.points,function(a){a.graphic&&a.graphic.hide();a.dataLabel&&a.dataLabel.hide();a.connector&&a.connector.hide()});setTimeout(function(){b.points&&
h(b.points,function(a,b){var f=b===(c&&c.pointIndex)?"show":"fadeIn",d=f==="show"?!0:void 0;if(a.graphic)a.graphic[f](d);if(a.dataLabel)a.dataLabel[f](d);if(a.connector)a.connector[f](d)})},Math.max(this.chart.options.drilldown.animation.duration-50,0));this.animate=t}};n.prototype.animateDrilldown=function(a){var b=this,c=this.chart.drilldownLevels,e,d=this.chart.options.drilldown.animation,f=this.xAxis;if(!a)h(c,function(a){if(b.options._ddSeriesId===a.lowerSeriesOptions._ddSeriesId)e=a.shapeArgs,
e.fill=a.color}),e.x+=u(f.oldPos,f.pos)-f.pos,h(this.points,function(a){a.graphic&&a.graphic.attr(e).animate(l(a.shapeArgs,{fill:a.color}),d);a.dataLabel&&a.dataLabel.fadeIn(d)}),this.animate=null};n.prototype.animateDrillupFrom=function(a){var b=this.chart.options.drilldown.animation,c=this.group,e=this;h(e.trackerGroups,function(a){if(e[a])e[a].on("mouseover")});delete this.group;h(this.points,function(e){var f=e.graphic,i=function(){f.destroy();c&&(c=c.destroy())};f&&(delete e.graphic,b?f.animate(l(a.shapeArgs,
{fill:a.color}),d.merge(b,{complete:i})):(f.attr(a.shapeArgs),i()))})};v&&l(v.prototype,{supportsDrilldown:!0,animateDrillupTo:n.prototype.animateDrillupTo,animateDrillupFrom:n.prototype.animateDrillupFrom,animateDrilldown:function(a){var b=this.chart.drilldownLevels[this.chart.drilldownLevels.length-1],c=this.chart.options.drilldown.animation,e=b.shapeArgs,g=e.start,f=(e.end-g)/this.points.length;if(!a)h(this.points,function(a,h){a.graphic.attr(d.merge(e,{start:g+h*f,end:g+(h+1)*f,fill:b.color}))[c?
"animate":"attr"](l(a.shapeArgs,{fill:a.color}),c)}),this.animate=null}});d.Point.prototype.doDrilldown=function(a,b){var c=this.series.chart,e=c.options.drilldown,d=(e.series||[]).length,f;if(!c.ddDupes)c.ddDupes=[];for(;d--&&!f;)e.series[d].id===this.drilldown&&y(this.drilldown,c.ddDupes)===-1&&(f=e.series[d],c.ddDupes.push(this.drilldown));x(c,"drilldown",{point:this,seriesOptions:f,category:b,points:b!==void 0&&this.series.xAxis.ddPoints[b].slice(0)});f&&(a?c.addSingleSeriesAsDrilldown(this,f):
c.addSeriesAsDrilldown(this,f))};d.Axis.prototype.drilldownCategory=function(a){var b,c,d=this.ddPoints[a];for(b in d)(c=d[b])&&c.series&&c.series.visible&&c.doDrilldown&&c.doDrilldown(!0,a);this.chart.applyDrilldown()};d.Axis.prototype.getDDPoints=function(a,b){var c=this.ddPoints;if(!c)this.ddPoints=c={};c[a]||(c[a]=[]);if(c[a].levelNumber!==b)c[a].length=0;return c[a]};w.prototype.drillable=function(){var a=this.pos,b=this.label,c=this.axis,e=c.ddPoints&&c.ddPoints[a];if(b&&e&&e.length){if(!b.basicStyles)b.basicStyles=
d.merge(b.styles);b.addClass("highcharts-drilldown-axis-label").css(c.chart.options.drilldown.activeAxisLabelStyle).on("click",function(){c.drilldownCategory(a)})}else if(b&&b.basicStyles)b.styles={},b.css(b.basicStyles),b.on("click",null)};r(w.prototype,"addLabel",function(a){a.call(this);this.drillable()});r(d.Point.prototype,"init",function(a,b,c,e){var g=a.call(this,b,c,e),a=(c=b.xAxis)&&c.ticks[e],c=c&&c.getDDPoints(e,b.options._levelNumber);if(g.drilldown&&(d.addEvent(g,"click",function(){b.xAxis&&
b.chart.options.drilldown.allowPointDrilldown===!1?b.xAxis.drilldownCategory(e):g.doDrilldown()}),c))c.push(g),c.levelNumber=b.options._levelNumber;a&&a.drillable();return g});r(d.Series.prototype,"drawDataLabels",function(a){var b=this.chart.options.drilldown.activeDataLabelStyle;a.call(this);h(this.points,function(a){a.drilldown&&a.dataLabel&&a.dataLabel.attr({"class":"highcharts-drilldown-data-label"}).css(b)})});var s,q=function(a){a.call(this);h(this.points,function(a){a.drilldown&&a.graphic&&
a.graphic.attr({"class":"highcharts-drilldown-point"}).css({cursor:"pointer"})})};for(s in p)p[s].prototype.supportsDrilldown&&r(p[s].prototype,"drawTracker",q)});
/**
 * Highcharts Drilldown module
 * 
 * Author: Torstein Honsi
 * License: www.highcharts.com/license
 *
 */


(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {

	'use strict';

	var noop = function () {},
		defaultOptions = H.getOptions(),
		each = H.each,
		extend = H.extend,
		format = H.format,
		pick = H.pick,
		wrap = H.wrap,
		Chart = H.Chart,
		seriesTypes = H.seriesTypes,
		PieSeries = seriesTypes.pie,
		ColumnSeries = seriesTypes.column,
		Tick = H.Tick,
		fireEvent = H.fireEvent,
		inArray = H.inArray,
		ddSeriesId = 1;

	// Utilities
	/*
	 * Return an intermediate color between two colors, according to pos where 0
	 * is the from color and 1 is the to color. This method is copied from ColorAxis.js
	 * and should always be kept updated, until we get AMD support.
	 */
	function tweenColors(from, to, pos) {
		// Check for has alpha, because rgba colors perform worse due to lack of
		// support in WebKit.
		var hasAlpha,
			ret;

		// Unsupported color, return to-color (#3920)
		if (!to.rgba.length || !from.rgba.length) {
			ret = to.input || 'none';

		// Interpolate
		} else {
			from = from.rgba;
			to = to.rgba;
			hasAlpha = (to[3] !== 1 || from[3] !== 1);
			ret = (hasAlpha ? 'rgba(' : 'rgb(') + 
				Math.round(to[0] + (from[0] - to[0]) * (1 - pos)) + ',' + 
				Math.round(to[1] + (from[1] - to[1]) * (1 - pos)) + ',' + 
				Math.round(to[2] + (from[2] - to[2]) * (1 - pos)) + 
				(hasAlpha ? (',' + (to[3] + (from[3] - to[3]) * (1 - pos))) : '') + ')';
		}
		return ret;
	}
	/**
	 * Handle animation of the color attributes directly
	 */
	each(['fill', 'stroke'], function (prop) {
		H.Fx.prototype[prop + 'Setter'] = function () {
			this.elem.attr(prop, tweenColors(H.Color(this.start), H.Color(this.end), this.pos));
		};
	});

	// Add language
	extend(defaultOptions.lang, {
		drillUpText: '◁ Back to {series.name}'
	});
	defaultOptions.drilldown = {
		activeAxisLabelStyle: {
			cursor: 'pointer',
			color: '#0d233a',
			fontWeight: 'bold',
			textDecoration: 'underline'			
		},
		activeDataLabelStyle: {
			cursor: 'pointer',
			color: '#0d233a',
			fontWeight: 'bold',
			textDecoration: 'underline'			
		},
		animation: {
			duration: 500
		},
		drillUpButton: {
			position: { 
				align: 'right',
				x: -10,
				y: 10
			}
			// relativeTo: 'plotBox'
			// theme
		}
	};	

	/**
	 * A general fadeIn method
	 */
	H.SVGRenderer.prototype.Element.prototype.fadeIn = function (animation) {
		this
		.attr({
			opacity: 0.1,
			visibility: 'inherit'
		})
		.animate({
			opacity: pick(this.newOpacity, 1) // newOpacity used in maps
		}, animation || {
			duration: 250
		});
	};

	Chart.prototype.addSeriesAsDrilldown = function (point, ddOptions) {
		this.addSingleSeriesAsDrilldown(point, ddOptions);
		this.applyDrilldown();
	};
	Chart.prototype.addSingleSeriesAsDrilldown = function (point, ddOptions) {
		var oldSeries = point.series,
			xAxis = oldSeries.xAxis,
			yAxis = oldSeries.yAxis,
			newSeries,
			color = point.color || oldSeries.color,
			pointIndex,
			levelSeries = [],
			levelSeriesOptions = [],
			level,
			levelNumber,
			last;

		if (!this.drilldownLevels) {
			this.drilldownLevels = [];
		}
		
		levelNumber = oldSeries.options._levelNumber || 0;

		// See if we can reuse the registered series from last run
		last = this.drilldownLevels[this.drilldownLevels.length - 1];
		if (last && last.levelNumber !== levelNumber) {
			last = undefined;
		}
		
			
		ddOptions = extend({
			color: color,
			_ddSeriesId: ddSeriesId++
		}, ddOptions);
		pointIndex = inArray(point, oldSeries.points);

		// Record options for all current series
		each(oldSeries.chart.series, function (series) {
			if (series.xAxis === xAxis && !series.isDrilling) {
				series.options._ddSeriesId = series.options._ddSeriesId || ddSeriesId++;
				series.options._colorIndex = series.userOptions._colorIndex;
				series.options._levelNumber = series.options._levelNumber || levelNumber; // #3182

				if (last) {
					levelSeries = last.levelSeries;
					levelSeriesOptions = last.levelSeriesOptions;
				} else {
					levelSeries.push(series);
					levelSeriesOptions.push(series.options);
				}
			}
		});

		// Add a record of properties for each drilldown level
		level = {
			levelNumber: levelNumber,
			seriesOptions: oldSeries.options,
			levelSeriesOptions: levelSeriesOptions,
			levelSeries: levelSeries,
			shapeArgs: point.shapeArgs,
			bBox: point.graphic ? point.graphic.getBBox() : {}, // no graphic in line series with markers disabled
			color: color,
			lowerSeriesOptions: ddOptions,
			pointOptions: oldSeries.options.data[pointIndex],
			pointIndex: pointIndex,
			oldExtremes: {
				xMin: xAxis && xAxis.userMin,
				xMax: xAxis && xAxis.userMax,
				yMin: yAxis && yAxis.userMin,
				yMax: yAxis && yAxis.userMax
			}
		};

		// Push it to the lookup array
		this.drilldownLevels.push(level);

		newSeries = level.lowerSeries = this.addSeries(ddOptions, false);
		newSeries.options._levelNumber = levelNumber + 1;
		if (xAxis) {
			xAxis.oldPos = xAxis.pos;
			xAxis.userMin = xAxis.userMax = null;
			yAxis.userMin = yAxis.userMax = null;
		}

		// Run fancy cross-animation on supported and equal types
		if (oldSeries.type === newSeries.type) {
			newSeries.animate = newSeries.animateDrilldown || noop;
			newSeries.options.animation = true;
		}
	};

	Chart.prototype.applyDrilldown = function () {
		var drilldownLevels = this.drilldownLevels, 
			levelToRemove;
		
		if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
			levelToRemove = drilldownLevels[drilldownLevels.length - 1].levelNumber;
			each(this.drilldownLevels, function (level) {
				if (level.levelNumber === levelToRemove) {
					each(level.levelSeries, function (series) {
						if (series.options && series.options._levelNumber === levelToRemove) { // Not removed, not added as part of a multi-series drilldown
							series.remove(false);
						}
					});
				}
			});
		}
		
		this.redraw();
		this.showDrillUpButton();
	};

	Chart.prototype.getDrilldownBackText = function () {
		var drilldownLevels = this.drilldownLevels,
			lastLevel;
		if (drilldownLevels && drilldownLevels.length > 0) { // #3352, async loading
			lastLevel = drilldownLevels[drilldownLevels.length - 1];
			lastLevel.series = lastLevel.seriesOptions;
			return format(this.options.lang.drillUpText, lastLevel);
		}

	};

	Chart.prototype.showDrillUpButton = function () {
		var chart = this,
			backText = this.getDrilldownBackText(),
			buttonOptions = chart.options.drilldown.drillUpButton,
			attr,
			states;
			

		if (!this.drillUpButton) {
			attr = buttonOptions.theme;
			states = attr && attr.states;
						
			this.drillUpButton = this.renderer.button(
				backText,
				null,
				null,
				function () {
					chart.drillUp(); 
				},
				attr, 
				states && states.hover,
				states && states.select
			)
			.attr({
				align: buttonOptions.position.align,
				zIndex: 9
			})
			.add()
			.align(buttonOptions.position, false, buttonOptions.relativeTo || 'plotBox');
		} else {
			this.drillUpButton.attr({
				text: backText
			})
			.align();
		}
	};

	Chart.prototype.drillUp = function () {
		var chart = this,
			drilldownLevels = chart.drilldownLevels,
			levelNumber = drilldownLevels[drilldownLevels.length - 1].levelNumber,
			i = drilldownLevels.length,
			chartSeries = chart.series,
			seriesI,
			level,
			oldSeries,
			newSeries,
			oldExtremes,
			addSeries = function (seriesOptions) {
				var addedSeries;
				each(chartSeries, function (series) {
					if (series.options._ddSeriesId === seriesOptions._ddSeriesId) {
						addedSeries = series;
					}
				});

				addedSeries = addedSeries || chart.addSeries(seriesOptions, false);
				if (addedSeries.type === oldSeries.type && addedSeries.animateDrillupTo) {
					addedSeries.animate = addedSeries.animateDrillupTo;
				}
				if (seriesOptions === level.seriesOptions) {
					newSeries = addedSeries;
				}
			};

		while (i--) {

			level = drilldownLevels[i];
			if (level.levelNumber === levelNumber) {
				drilldownLevels.pop();
				
				// Get the lower series by reference or id
				oldSeries = level.lowerSeries;
				if (!oldSeries.chart) {  // #2786
					seriesI = chartSeries.length; // #2919
					while (seriesI--) {
						if (chartSeries[seriesI].options.id === level.lowerSeriesOptions.id && 
								chartSeries[seriesI].options._levelNumber === levelNumber + 1) { // #3867
							oldSeries = chartSeries[seriesI];
							break;
						}
					}
				}
				oldSeries.xData = []; // Overcome problems with minRange (#2898)

				each(level.levelSeriesOptions, addSeries);
				
				fireEvent(chart, 'drillup', { seriesOptions: level.seriesOptions });

				if (newSeries.type === oldSeries.type) {
					newSeries.drilldownLevel = level;
					newSeries.options.animation = chart.options.drilldown.animation;

					if (oldSeries.animateDrillupFrom && oldSeries.chart) { // #2919
						oldSeries.animateDrillupFrom(level);
					}
				}
				newSeries.options._levelNumber = levelNumber;
				
				oldSeries.remove(false);

				// Reset the zoom level of the upper series
				if (newSeries.xAxis) {
					oldExtremes = level.oldExtremes;
					newSeries.xAxis.setExtremes(oldExtremes.xMin, oldExtremes.xMax, false);
					newSeries.yAxis.setExtremes(oldExtremes.yMin, oldExtremes.yMax, false);
				}
			}
		}

		this.redraw();

		if (this.drilldownLevels.length === 0) {
			this.drillUpButton = this.drillUpButton.destroy();
		} else {
			this.drillUpButton.attr({
				text: this.getDrilldownBackText()
			})
			.align();
		}

		this.ddDupes.length = []; // #3315
	};


	ColumnSeries.prototype.supportsDrilldown = true;
	
	/**
	 * When drilling up, keep the upper series invisible until the lower series has
	 * moved into place
	 */
	ColumnSeries.prototype.animateDrillupTo = function (init) {
		if (!init) {
			var newSeries = this,
				level = newSeries.drilldownLevel;

			each(this.points, function (point) {
				if (point.graphic) { // #3407
					point.graphic.hide();
				}
				if (point.dataLabel) {
					point.dataLabel.hide();
				}
				if (point.connector) {
					point.connector.hide();
				}
			});


			// Do dummy animation on first point to get to complete
			setTimeout(function () {
				if (newSeries.points) { // May be destroyed in the meantime, #3389
					each(newSeries.points, function (point, i) {  
						// Fade in other points			  
						var verb = i === (level && level.pointIndex) ? 'show' : 'fadeIn',
							inherit = verb === 'show' ? true : undefined;
						if (point.graphic) { // #3407
							point.graphic[verb](inherit);
						}
						if (point.dataLabel) {
							point.dataLabel[verb](inherit);
						}
						if (point.connector) {
							point.connector[verb](inherit);
						}
					});
				}
			}, Math.max(this.chart.options.drilldown.animation.duration - 50, 0));

			// Reset
			this.animate = noop;
		}

	};
	
	ColumnSeries.prototype.animateDrilldown = function (init) {
		var series = this,
			drilldownLevels = this.chart.drilldownLevels,
			animateFrom,
			animationOptions = this.chart.options.drilldown.animation,
			xAxis = this.xAxis;
			
		if (!init) {
			each(drilldownLevels, function (level) {
				if (series.options._ddSeriesId === level.lowerSeriesOptions._ddSeriesId) {
					animateFrom = level.shapeArgs;
					animateFrom.fill = level.color;
				}
			});

			animateFrom.x += (pick(xAxis.oldPos, xAxis.pos) - xAxis.pos);

			each(this.points, function (point) {
				if (point.graphic) {
					point.graphic
						.attr(animateFrom)
						.animate(
							extend(point.shapeArgs, { fill: point.color }), 
							animationOptions
						);
				}
				if (point.dataLabel) {
					point.dataLabel.fadeIn(animationOptions);
				}
			});
			this.animate = null;
		}
		
	};

	/**
	 * When drilling up, pull out the individual point graphics from the lower series
	 * and animate them into the origin point in the upper series.
	 */
	ColumnSeries.prototype.animateDrillupFrom = function (level) {
		var animationOptions = this.chart.options.drilldown.animation,
			group = this.group,
			series = this;

		// Cancel mouse events on the series group (#2787)
		each(series.trackerGroups, function (key) {
			if (series[key]) { // we don't always have dataLabelsGroup
				series[key].on('mouseover');
			}
		});
			

		delete this.group;
		each(this.points, function (point) {
			var graphic = point.graphic,
				complete = function () {
					graphic.destroy();
					if (group) {
						group = group.destroy();
					}
				};

			if (graphic) {
			
				delete point.graphic;

				if (animationOptions) {
					graphic.animate(
						extend(level.shapeArgs, { fill: level.color }),
						H.merge(animationOptions, { complete: complete })
					);
				} else {
					graphic.attr(level.shapeArgs);
					complete();
				}
			}
		});
	};

	if (PieSeries) {
		extend(PieSeries.prototype, {
			supportsDrilldown: true,
			animateDrillupTo: ColumnSeries.prototype.animateDrillupTo,
			animateDrillupFrom: ColumnSeries.prototype.animateDrillupFrom,

			animateDrilldown: function (init) {
				var level = this.chart.drilldownLevels[this.chart.drilldownLevels.length - 1],
					animationOptions = this.chart.options.drilldown.animation,
					animateFrom = level.shapeArgs,
					start = animateFrom.start,
					angle = animateFrom.end - start,
					startAngle = angle / this.points.length;

				if (!init) {
					each(this.points, function (point, i) {
						point.graphic
							.attr(H.merge(animateFrom, {
								start: start + i * startAngle,
								end: start + (i + 1) * startAngle,
								fill: level.color
							}))[animationOptions ? 'animate' : 'attr'](
								extend(point.shapeArgs, { fill: point.color }), 
								animationOptions
							);
					});
					this.animate = null;
				}
			}
		});
	}
	
	H.Point.prototype.doDrilldown = function (_holdRedraw, category) {
		var series = this.series,
			chart = series.chart,
			drilldown = chart.options.drilldown,
			i = (drilldown.series || []).length,
			seriesOptions;

		if (!chart.ddDupes) {
			chart.ddDupes = [];
		}
		
		while (i-- && !seriesOptions) {
			if (drilldown.series[i].id === this.drilldown && inArray(this.drilldown, chart.ddDupes) === -1) {
				seriesOptions = drilldown.series[i];
				chart.ddDupes.push(this.drilldown);
			}
		}

		// Fire the event. If seriesOptions is undefined, the implementer can check for 
		// seriesOptions, and call addSeriesAsDrilldown async if necessary.
		fireEvent(chart, 'drilldown', { 
			point: this,
			seriesOptions: seriesOptions,
			category: category,
			points: category !== undefined && this.series.xAxis.ddPoints[category].slice(0)
		});
		
		if (seriesOptions) {
			if (_holdRedraw) {
				chart.addSingleSeriesAsDrilldown(this, seriesOptions);
			} else {
				chart.addSeriesAsDrilldown(this, seriesOptions);
			}
		}
	};

	/**
	 * Drill down to a given category. This is the same as clicking on an axis label.
	 */
	H.Axis.prototype.drilldownCategory = function (x) {
		var key,
			point,
			ddPointsX = this.ddPoints[x];
		for (key in ddPointsX) {
			point = ddPointsX[key];
			if (point && point.series && point.series.visible && point.doDrilldown) { // #3197
				point.doDrilldown(true, x);
			}
		}
		this.chart.applyDrilldown();
	};

	/**
	 * Create and return a collection of points associated with the X position. Reset it for each level.
	 */	
	H.Axis.prototype.getDDPoints = function (x, levelNumber) {
		var ddPoints = this.ddPoints;
		if (!ddPoints) {
			this.ddPoints = ddPoints = {};
		}
		if (!ddPoints[x]) {
			ddPoints[x] = [];
		}
		if (ddPoints[x].levelNumber !== levelNumber) {
			ddPoints[x].length = 0; // reset
		}
		return ddPoints[x];
	};


	/**
	 * Make a tick label drillable, or remove drilling on update
	 */
	Tick.prototype.drillable = function () {
		var pos = this.pos,
			label = this.label,
			axis = this.axis,
			ddPointsX = axis.ddPoints && axis.ddPoints[pos];

		if (label && ddPointsX && ddPointsX.length) {
			if (!label.basicStyles) {
				label.basicStyles = H.merge(label.styles);
			}
			label
				.addClass('highcharts-drilldown-axis-label')
				.css(axis.chart.options.drilldown.activeAxisLabelStyle)
				.on('click', function () {
					axis.drilldownCategory(pos);
				});

		} else if (label && label.basicStyles) {
			label.styles = {}; // reset for full overwrite of styles
			label.css(label.basicStyles);
			label.on('click', null); // #3806			
		}
	};

	/**
	 * Always keep the drillability updated (#3951)
	 */
	wrap(Tick.prototype, 'addLabel', function (proceed) {
		proceed.call(this);
		this.drillable();
	});
	

	/**
	 * On initialization of each point, identify its label and make it clickable. Also, provide a
	 * list of points associated to that label.
	 */
	wrap(H.Point.prototype, 'init', function (proceed, series, options, x) {
		var point = proceed.call(this, series, options, x),
			xAxis = series.xAxis,
			tick = xAxis && xAxis.ticks[x],
			ddPointsX = xAxis && xAxis.getDDPoints(x, series.options._levelNumber);

		if (point.drilldown) {
			
			// Add the click event to the point 
			H.addEvent(point, 'click', function () {
				if (series.xAxis && series.chart.options.drilldown.allowPointDrilldown === false) {
					series.xAxis.drilldownCategory(x);
				} else {
					point.doDrilldown();
				}
			});
			/*wrap(point, 'importEvents', function (proceed) { // wrapping importEvents makes point.click event work
				if (!this.hasImportedEvents) {
					proceed.call(this);
					H.addEvent(this, 'click', function () {
						this.doDrilldown();
					});
				}
			});*/


			// Register drilldown points on this X value
			if (ddPointsX) {
				ddPointsX.push(point);
				ddPointsX.levelNumber = series.options._levelNumber;
			}

		}

		// Add or remove click handler and style on the tick label
		if (tick) {
			tick.drillable();
		}

		return point;
	});

	wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
		var css = this.chart.options.drilldown.activeDataLabelStyle;

		proceed.call(this);

		each(this.points, function (point) {
			if (point.drilldown && point.dataLabel) {
				point.dataLabel
					.attr({
						'class': 'highcharts-drilldown-data-label'
					})
					.css(css);
			}
		});
	});

	// Mark the trackers with a pointer 
	var type, 
		drawTrackerWrapper = function (proceed) {
			proceed.call(this);
			each(this.points, function (point) {
				if (point.drilldown && point.graphic) {
					point.graphic
						.attr({
							'class': 'highcharts-drilldown-point'
						})
						.css({ cursor: 'pointer' });
				}
			});
		};
	for (type in seriesTypes) {
		if (seriesTypes[type].prototype.supportsDrilldown) {
			wrap(seriesTypes[type].prototype, 'drawTracker', drawTrackerWrapper);
		}
	}
		
}));
/*
 Highcharts JS v4.2.3 (2016-02-08)
 Exporting module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(f){typeof module==="object"&&module.exports?module.exports=f:f(Highcharts)})(function(f){var r=f.win,m=r.document,A=f.Chart,t=f.addEvent,B=f.removeEvent,C=f.fireEvent,n=f.createElement,s=f.discardElement,v=f.css,l=f.merge,i=f.each,q=f.extend,F=f.splat,G=Math.max,H=f.isTouchDevice,I=f.Renderer.prototype.symbols,y=f.getOptions(),z;q(y.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",
contextButtonTitle:"Chart context menu"});y.navigation={menuStyle:{border:"1px solid #A0A0A0",background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:H?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}};
y.exporting={type:"image/png",url:"http://export.highcharts.com/",buttons:{contextButton:{menuClassName:"highcharts-contextmenu",symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",
onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};f.post=function(a,b,e){var c,a=n("form",l({method:"post",action:a,enctype:"multipart/form-data"},e),{display:"none"},m.body);for(c in b)n("input",{type:"hidden",name:c,value:b[c]},null,a);a.submit();s(a)};q(A.prototype,{sanitizeSVG:function(a){return a.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ (NS[0-9]+\:)?href=/g,
" xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,'$1="rgb($2)" $1-opacity="$3"').replace(/&nbsp;/g,"\u00a0").replace(/&shy;/g,"\u00ad").replace(/<IMG /g,"<image ").replace(/<(\/?)TITLE>/g,"<$1title>").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,'width="$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href="$1"/>').replace(/ id=([^" >]+)/g,' id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g,
" ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(b){return b.toLowerCase()})},getChartHTML:function(){return this.container.innerHTML},getSVG:function(a){var b=this,e,c,g,j,k,d=l(b.options,a),J=d.exporting.allowHTML;if(!m.createElementNS)m.createElementNS=function(b,a){return m.createElement(a)};c=n("div",null,{position:"absolute",top:"-9999em",width:b.chartWidth+"px",height:b.chartHeight+"px"},m.body);g=b.renderTo.style.width;k=b.renderTo.style.height;g=d.exporting.sourceWidth||
d.chart.width||/px$/.test(g)&&parseInt(g,10)||600;k=d.exporting.sourceHeight||d.chart.height||/px$/.test(k)&&parseInt(k,10)||400;q(d.chart,{animation:!1,renderTo:c,forExport:!0,renderer:"SVGRenderer",width:g,height:k});d.exporting.enabled=!1;delete d.data;d.series=[];i(b.series,function(a){j=l(a.userOptions,{animation:!1,enableMouseTracking:!1,showCheckbox:!1,visible:a.visible});j.isInternal||d.series.push(j)});a&&i(["xAxis","yAxis"],function(b){i(F(a[b]),function(a,c){d[b][c]=l(d[b][c],a)})});e=
new f.Chart(d,b.callback);i(["xAxis","yAxis"],function(a){i(b[a],function(b,c){var d=e[a][c],f=b.getExtremes(),g=f.userMin,f=f.userMax;d&&(g!==void 0||f!==void 0)&&d.setExtremes(g,f,!0,!1)})});g=e.getChartHTML();d=null;e.destroy();s(c);if(J&&(c=g.match(/<\/svg>(.*?$)/)))c='<foreignObject x="0" y="0" width="200" height="200"><body xmlns="http://www.w3.org/1999/xhtml">'+c[1]+"</body></foreignObject>",g=g.replace("</svg>",c+"</svg>");g=this.sanitizeSVG(g);return g=g.replace(/(url\(#highcharts-[0-9]+)&quot;/g,
"$1").replace(/&quot;/g,"'")},getSVGForExport:function(a,b){var e=this.options.exporting;return this.getSVG(l({chart:{borderRadius:0}},e.chartOptions,b,{exporting:{sourceWidth:a&&a.sourceWidth||e.sourceWidth,sourceHeight:a&&a.sourceHeight||e.sourceHeight}}))},exportChart:function(a,b){var e=this.getSVGForExport(a,b),a=l(this.options.exporting,a);f.post(a.url,{filename:a.filename||"chart",type:a.type,width:a.width||0,scale:a.scale||2,svg:e},a.formAttributes)},print:function(){var a=this,b=a.container,
e=[],c=b.parentNode,f=m.body,j=f.childNodes;if(!a.isPrinting)a.isPrinting=!0,a.pointer.reset(null,0),C(a,"beforePrint"),i(j,function(a,b){if(a.nodeType===1)e[b]=a.style.display,a.style.display="none"}),f.appendChild(b),r.focus(),r.print(),setTimeout(function(){c.appendChild(b);i(j,function(a,b){if(a.nodeType===1)a.style.display=e[b]});a.isPrinting=!1;C(a,"afterPrint")},1E3)},contextMenu:function(a,b,e,c,f,j,k){var d=this,l=d.options.navigation,D=l.menuItemStyle,o=d.chartWidth,p=d.chartHeight,E="cache-"+
a,h=d[E],u=G(f,j),w,x,r,s=function(b){d.pointer.inClass(b.target,a)||x()};if(!h)d[E]=h=n("div",{className:a},{position:"absolute",zIndex:1E3,padding:u+"px"},d.container),w=n("div",null,q({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},l.menuStyle),h),x=function(){v(h,{display:"none"});k&&k.setState(0);d.openMenu=!1},t(h,"mouseleave",function(){r=setTimeout(x,500)}),t(h,"mouseenter",function(){clearTimeout(r)}),t(m,"mouseup",s),t(d,"destroy",function(){B(m,
"mouseup",s)}),i(b,function(a){if(a){var b=a.separator?n("hr",null,null,w):n("div",{onmouseover:function(){v(this,l.menuItemHoverStyle)},onmouseout:function(){v(this,D)},onclick:function(b){b&&b.stopPropagation();x();a.onclick&&a.onclick.apply(d,arguments)},innerHTML:a.text||d.options.lang[a.textKey]},q({cursor:"pointer"},D),w);d.exportDivElements.push(b)}}),d.exportDivElements.push(w,h),d.exportMenuWidth=h.offsetWidth,d.exportMenuHeight=h.offsetHeight;b={display:"block"};e+d.exportMenuWidth>o?b.right=
o-e-f-u+"px":b.left=e-u+"px";c+j+d.exportMenuHeight>p&&k.alignOptions.verticalAlign!=="top"?b.bottom=p-c-u+"px":b.top=c+j-u+"px";v(h,b);d.openMenu=!0},addButton:function(a){var b=this,e=b.renderer,c=l(b.options.navigation.buttonOptions,a),g=c.onclick,j=c.menuItems,k,d,m={stroke:c.symbolStroke,fill:c.symbolFill},i=c.symbolSize||12;if(!b.btnCount)b.btnCount=0;if(!b.exportDivElements)b.exportDivElements=[],b.exportSVGElements=[];if(c.enabled!==!1){var o=c.theme,p=o.states,n=p&&p.hover,p=p&&p.select,
h;delete o.states;g?h=function(a){a.stopPropagation();g.call(b,a)}:j&&(h=function(){b.contextMenu(d.menuClassName,j,d.translateX,d.translateY,d.width,d.height,d);d.setState(2)});c.text&&c.symbol?o.paddingLeft=f.pick(o.paddingLeft,25):c.text||q(o,{width:c.width,height:c.height,padding:0});d=e.button(c.text,0,0,h,o,n,p).attr({title:b.options.lang[c._titleKey],"stroke-linecap":"round",zIndex:3});d.menuClassName=a.menuClassName||"highcharts-menu-"+b.btnCount++;c.symbol&&(k=e.symbol(c.symbol,c.symbolX-
i/2,c.symbolY-i/2,i,i).attr(q(m,{"stroke-width":c.symbolStrokeWidth||1,zIndex:1})).add(d));d.add().align(q(c,{width:d.width,x:f.pick(c.x,z)}),!0,"spacingBox");z+=(d.width+c.buttonSpacing)*(c.align==="right"?-1:1);b.exportSVGElements.push(d,k)}},destroyExport:function(a){var a=a.target,b,e;for(b=0;b<a.exportSVGElements.length;b++)if(e=a.exportSVGElements[b])e.onclick=e.ontouchstart=null,a.exportSVGElements[b]=e.destroy();for(b=0;b<a.exportDivElements.length;b++)e=a.exportDivElements[b],B(e,"mouseleave"),
a.exportDivElements[b]=e.onmouseout=e.onmouseover=e.ontouchstart=e.onclick=null,s(e)}});I.menu=function(a,b,e,c){return["M",a,b+2.5,"L",a+e,b+2.5,"M",a,b+c/2+0.5,"L",a+e,b+c/2+0.5,"M",a,b+c-1.5,"L",a+e,b+c-1.5]};A.prototype.callbacks.push(function(a){var b,e=a.options.exporting,c=e.buttons;z=0;if(e.enabled!==!1){for(b in c)a.addButton(c[b]);t(a,"destroy",a.destroyExport)}})});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 * Exporting module
 *
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/* eslint indent:0 */

(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function (Highcharts) {

// create shortcuts
var win = Highcharts.win,
	doc = win.document,
	Chart = Highcharts.Chart,
	addEvent = Highcharts.addEvent,
	removeEvent = Highcharts.removeEvent,
	fireEvent = Highcharts.fireEvent,
	createElement = Highcharts.createElement,
	discardElement = Highcharts.discardElement,
	css = Highcharts.css,
	merge = Highcharts.merge,
	each = Highcharts.each,
	extend = Highcharts.extend,
	splat = Highcharts.splat,
	math = Math,
	mathMax = math.max,
	isTouchDevice = Highcharts.isTouchDevice,
	M = 'M',
	L = 'L',
	DIV = 'div',
	HIDDEN = 'hidden',
	NONE = 'none',
	PREFIX = 'highcharts-',
	ABSOLUTE = 'absolute',
	PX = 'px',
	UNDEFINED,
	symbols = Highcharts.Renderer.prototype.symbols,
	defaultOptions = Highcharts.getOptions(),
	buttonOffset;

	// Add language
	extend(defaultOptions.lang, {
		printChart: 'Print chart',
		downloadPNG: 'Download PNG image',
		downloadJPEG: 'Download JPEG image',
		downloadPDF: 'Download PDF document',
		downloadSVG: 'Download SVG vector image',
		contextButtonTitle: 'Chart context menu'
	});

// Buttons and menus are collected in a separate config option set called 'navigation'.
// This can be extended later to add control buttons like zoom and pan right click menus.
defaultOptions.navigation = {
	menuStyle: {
		border: '1px solid #A0A0A0',
		background: '#FFFFFF',
		padding: '5px 0'
	},
	menuItemStyle: {
		padding: '0 10px',
		background: NONE,
		color: '#303030',
		fontSize: isTouchDevice ? '14px' : '11px'
	},
	menuItemHoverStyle: {
		background: '#4572A5',
		color: '#FFFFFF'
	},

	buttonOptions: {
		symbolFill: '#E0E0E0',
		symbolSize: 14,
		symbolStroke: '#666',
		symbolStrokeWidth: 3,
		symbolX: 12.5,
		symbolY: 10.5,
		align: 'right',
		buttonSpacing: 3,
		height: 22,
		// text: null,
		theme: {
			fill: 'white', // capture hover
			stroke: 'none'
		},
		verticalAlign: 'top',
		width: 24
	}
};



// Add the export related options
defaultOptions.exporting = {
	//enabled: true,
	//filename: 'chart',
	type: 'image/png',
	url: 'http://export.highcharts.com/',
	//width: undefined,
	//scale: 2
	buttons: {
		contextButton: {
			menuClassName: PREFIX + 'contextmenu',
			//x: -10,
			symbol: 'menu',
			_titleKey: 'contextButtonTitle',
			menuItems: [{
				textKey: 'printChart',
				onclick: function () {
					this.print();
				}
			}, {
				separator: true
			}, {
				textKey: 'downloadPNG',
				onclick: function () {
					this.exportChart();
				}
			}, {
				textKey: 'downloadJPEG',
				onclick: function () {
					this.exportChart({
						type: 'image/jpeg'
					});
				}
			}, {
				textKey: 'downloadPDF',
				onclick: function () {
					this.exportChart({
						type: 'application/pdf'
					});
				}
			}, {
				textKey: 'downloadSVG',
				onclick: function () {
					this.exportChart({
						type: 'image/svg+xml'
					});
				}
			}
			// Enable this block to add "View SVG" to the dropdown menu
			/*
			,{

				text: 'View SVG',
				onclick: function () {
					var svg = this.getSVG()
						.replace(/</g, '\n&lt;')
						.replace(/>/g, '&gt;');

					doc.body.innerHTML = '<pre>' + svg + '</pre>';
				}
			} // */
			]
		}
	}
};

// Add the Highcharts.post utility
Highcharts.post = function (url, data, formAttributes) {
	var name,
		form;

	// create the form
	form = createElement('form', merge({
		method: 'post',
		action: url,
		enctype: 'multipart/form-data'
	}, formAttributes), {
		display: NONE
	}, doc.body);

	// add the data
	for (name in data) {
		createElement('input', {
			type: HIDDEN,
			name: name,
			value: data[name]
		}, null, form);
	}

	// submit
	form.submit();

	// clean up
	discardElement(form);
};

extend(Chart.prototype, {

	/**
	 * A collection of regex fixes on the produces SVG to account for expando properties,
	 * browser bugs, VML problems and other. Returns a cleaned SVG.
	 */
	sanitizeSVG: function (svg) {
		return svg
			.replace(/zIndex="[^"]+"/g, '')
			.replace(/isShadow="[^"]+"/g, '')
			.replace(/symbolName="[^"]+"/g, '')
			.replace(/jQuery[0-9]+="[^"]+"/g, '')
			.replace(/url\([^#]+#/g, 'url(#')
			.replace(/<svg /, '<svg xmlns:xlink="http://www.w3.org/1999/xlink" ')
			.replace(/ (NS[0-9]+\:)?href=/g, ' xlink:href=') // #3567
			.replace(/\n/, ' ')
			// Any HTML added to the container after the SVG (#894)
			.replace(/<\/svg>.*?$/, '</svg>') 
			// Batik doesn't support rgba fills and strokes (#3095)
			.replace(/(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g, '$1="rgb($2)" $1-opacity="$3"')
			/* This fails in IE < 8
			.replace(/([0-9]+)\.([0-9]+)/g, function(s1, s2, s3) { // round off to save weight
				return s2 +'.'+ s3[0];
			})*/

			// Replace HTML entities, issue #347
			.replace(/&nbsp;/g, '\u00A0') // no-break space
			.replace(/&shy;/g,  '\u00AD') // soft hyphen

			// IE specific
			.replace(/<IMG /g, '<image ')
			.replace(/<(\/?)TITLE>/g, '<$1title>')
			.replace(/height=([^" ]+)/g, 'height="$1"')
			.replace(/width=([^" ]+)/g, 'width="$1"')
			.replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>')
			.replace(/ id=([^" >]+)/g, ' id="$1"') // #4003
			.replace(/class=([^" >]+)/g, 'class="$1"')
			.replace(/ transform /g, ' ')
			.replace(/:(path|rect)/g, '$1')
			.replace(/style="([^"]+)"/g, function (s) {
				return s.toLowerCase();
			});
	},

	/**
	 * Return innerHTML of chart. Used as hook for plugins.
	 */
	getChartHTML: function () {
		return this.container.innerHTML;
	},

	/**
	 * Return an SVG representation of the chart
	 *
	 * @param additionalOptions {Object} Additional chart options for the generated SVG representation
	 */
	getSVG: function (additionalOptions) {
		var chart = this,
			chartCopy,
			sandbox,
			svg,
			seriesOptions,
			sourceWidth,
			sourceHeight,
			cssWidth,
			cssHeight,
			html,
			options = merge(chart.options, additionalOptions), // copy the options and add extra options
			allowHTML = options.exporting.allowHTML;
			

		// IE compatibility hack for generating SVG content that it doesn't really understand
		if (!doc.createElementNS) {
			doc.createElementNS = function (ns, tagName) {
				return doc.createElement(tagName);
			};
		}

		// create a sandbox where a new chart will be generated
		sandbox = createElement(DIV, null, {
			position: ABSOLUTE,
			top: '-9999em',
			width: chart.chartWidth + PX,
			height: chart.chartHeight + PX
		}, doc.body);

		// get the source size
		cssWidth = chart.renderTo.style.width;
		cssHeight = chart.renderTo.style.height;
		sourceWidth = options.exporting.sourceWidth ||
			options.chart.width ||
			(/px$/.test(cssWidth) && parseInt(cssWidth, 10)) ||
			600;
		sourceHeight = options.exporting.sourceHeight ||
			options.chart.height ||
			(/px$/.test(cssHeight) && parseInt(cssHeight, 10)) ||
			400;

		// override some options
		extend(options.chart, {
			animation: false,
			renderTo: sandbox,
			forExport: true,
			renderer: 'SVGRenderer',
			width: sourceWidth,
			height: sourceHeight
		});
		options.exporting.enabled = false; // hide buttons in print
		delete options.data; // #3004

		// prepare for replicating the chart
		options.series = [];
		each(chart.series, function (serie) {
			seriesOptions = merge(serie.userOptions, { // #4912
				animation: false, // turn off animation
				enableMouseTracking: false,
				showCheckbox: false,
				visible: serie.visible
			});

			if (!seriesOptions.isInternal) { // used for the navigator series that has its own option set
				options.series.push(seriesOptions);
			}
		});

		// Axis options must be merged in one by one, since it may be an array or an object (#2022, #3900)
		if (additionalOptions) {
			each(['xAxis', 'yAxis'], function (axisType) {
				each(splat(additionalOptions[axisType]), function (axisOptions, i) {
					options[axisType][i] = merge(options[axisType][i], axisOptions);
				});
			});
		}

		// generate the chart copy
		chartCopy = new Highcharts.Chart(options, chart.callback);

		// reflect axis extremes in the export
		each(['xAxis', 'yAxis'], function (axisType) {
			each(chart[axisType], function (axis, i) {
				var axisCopy = chartCopy[axisType][i],
					extremes = axis.getExtremes(),
					userMin = extremes.userMin,
					userMax = extremes.userMax;

				if (axisCopy && (userMin !== UNDEFINED || userMax !== UNDEFINED)) {
					axisCopy.setExtremes(userMin, userMax, true, false);
				}
			});
		});

		// get the SVG from the container's innerHTML
		svg = chartCopy.getChartHTML();

		// free up memory
		options = null;
		chartCopy.destroy();
		discardElement(sandbox);

		// Move HTML into a foreignObject
		if (allowHTML) {
			html = svg.match(/<\/svg>(.*?$)/);
			if (html) {
				html = '<foreignObject x="0" y="0" width="200" height="200">' +
					'<body xmlns="http://www.w3.org/1999/xhtml">' +
					html[1] +
					'</body>' + 
					'</foreignObject>';
				svg = svg.replace('</svg>', html + '</svg>');
			}
		}

		// sanitize
		svg = this.sanitizeSVG(svg);

		// IE9 beta bugs with innerHTML. Test again with final IE9.
		svg = svg.replace(/(url\(#highcharts-[0-9]+)&quot;/g, '$1')
			.replace(/&quot;/g, '\'');

		return svg;
	},

	getSVGForExport: function (options, chartOptions) {
		var chartExportingOptions = this.options.exporting;

		return this.getSVG(merge(
			{ chart: { borderRadius: 0 } },
			chartExportingOptions.chartOptions,
			chartOptions,
			{
				exporting: {
					sourceWidth: (options && options.sourceWidth) || chartExportingOptions.sourceWidth,
					sourceHeight: (options && options.sourceHeight) || chartExportingOptions.sourceHeight
				}
			}
		));
	},

	/**
	 * Submit the SVG representation of the chart to the server
	 * @param {Object} options Exporting options. Possible members are url, type, width and formAttributes.
	 * @param {Object} chartOptions Additional chart options for the SVG representation of the chart
	 */
	exportChart: function (options, chartOptions) {
		
		var svg = this.getSVGForExport(options, chartOptions);

		// merge the options
		options = merge(this.options.exporting, options);

		// do the post
		Highcharts.post(options.url, {
			filename: options.filename || 'chart',
			type: options.type,
			width: options.width || 0, // IE8 fails to post undefined correctly, so use 0
			scale: options.scale || 2,
			svg: svg
		}, options.formAttributes);

	},

	/**
	 * Print the chart
	 */
	print: function () {

		var chart = this,
			container = chart.container,
			origDisplay = [],
			origParent = container.parentNode,
			body = doc.body,
			childNodes = body.childNodes;

		if (chart.isPrinting) { // block the button while in printing mode
			return;
		}

		chart.isPrinting = true;
		chart.pointer.reset(null, 0);

		fireEvent(chart, 'beforePrint');

		// hide all body content
		each(childNodes, function (node, i) {
			if (node.nodeType === 1) {
				origDisplay[i] = node.style.display;
				node.style.display = NONE;
			}
		});

		// pull out the chart
		body.appendChild(container);

		// print
		win.focus(); // #1510
		win.print();

		// allow the browser to prepare before reverting
		setTimeout(function () {

			// put the chart back in
			origParent.appendChild(container);

			// restore all body content
			each(childNodes, function (node, i) {
				if (node.nodeType === 1) {
					node.style.display = origDisplay[i];
				}
			});

			chart.isPrinting = false;

			fireEvent(chart, 'afterPrint');

		}, 1000);

	},

	/**
	 * Display a popup menu for choosing the export type
	 *
	 * @param {String} className An identifier for the menu
	 * @param {Array} items A collection with text and onclicks for the items
	 * @param {Number} x The x position of the opener button
	 * @param {Number} y The y position of the opener button
	 * @param {Number} width The width of the opener button
	 * @param {Number} height The height of the opener button
	 */
	contextMenu: function (className, items, x, y, width, height, button) {
		var chart = this,
			navOptions = chart.options.navigation,
			menuItemStyle = navOptions.menuItemStyle,
			chartWidth = chart.chartWidth,
			chartHeight = chart.chartHeight,
			cacheName = 'cache-' + className,
			menu = chart[cacheName],
			menuPadding = mathMax(width, height), // for mouse leave detection
			boxShadow = '3px 3px 10px #888',
			innerMenu,
			hide,
			hideTimer,
			menuStyle,
			docMouseUpHandler = function (e) {
				if (!chart.pointer.inClass(e.target, className)) {
					hide();
				}
			};

		// create the menu only the first time
		if (!menu) {

			// create a HTML element above the SVG
			chart[cacheName] = menu = createElement(DIV, {
				className: className
			}, {
				position: ABSOLUTE,
				zIndex: 1000,
				padding: menuPadding + PX
			}, chart.container);

			innerMenu = createElement(DIV, null,
				extend({
					MozBoxShadow: boxShadow,
					WebkitBoxShadow: boxShadow,
					boxShadow: boxShadow
				}, navOptions.menuStyle), menu);

			// hide on mouse out
			hide = function () {
				css(menu, { display: NONE });
				if (button) {
					button.setState(0);
				}
				chart.openMenu = false;
			};

			// Hide the menu some time after mouse leave (#1357)
			addEvent(menu, 'mouseleave', function () {
				hideTimer = setTimeout(hide, 500);
			});
			addEvent(menu, 'mouseenter', function () {
				clearTimeout(hideTimer);
			});


			// Hide it on clicking or touching outside the menu (#2258, #2335, #2407)
			addEvent(doc, 'mouseup', docMouseUpHandler);
			addEvent(chart, 'destroy', function () {
				removeEvent(doc, 'mouseup', docMouseUpHandler);
			});


			// create the items
			each(items, function (item) {
				if (item) {
					var element = item.separator ?
						createElement('hr', null, null, innerMenu) :
						createElement(DIV, {
							onmouseover: function () {
								css(this, navOptions.menuItemHoverStyle);
							},
							onmouseout: function () {
								css(this, menuItemStyle);
							},
							onclick: function (e) {
								if (e) { // IE7
									e.stopPropagation();
								}
								hide();
								if (item.onclick) {
									item.onclick.apply(chart, arguments);
								}
							},
							innerHTML: item.text || chart.options.lang[item.textKey]
						}, extend({
							cursor: 'pointer'
						}, menuItemStyle), innerMenu);


					// Keep references to menu divs to be able to destroy them
					chart.exportDivElements.push(element);
				}
			});

			// Keep references to menu and innerMenu div to be able to destroy them
			chart.exportDivElements.push(innerMenu, menu);

			chart.exportMenuWidth = menu.offsetWidth;
			chart.exportMenuHeight = menu.offsetHeight;
		}

		menuStyle = { display: 'block' };

		// if outside right, right align it
		if (x + chart.exportMenuWidth > chartWidth) {
			menuStyle.right = (chartWidth - x - width - menuPadding) + PX;
		} else {
			menuStyle.left = (x - menuPadding) + PX;
		}
		// if outside bottom, bottom align it
		if (y + height + chart.exportMenuHeight > chartHeight && button.alignOptions.verticalAlign !== 'top') {
			menuStyle.bottom = (chartHeight - y - menuPadding)  + PX;
		} else {
			menuStyle.top = (y + height - menuPadding) + PX;
		}

		css(menu, menuStyle);
		chart.openMenu = true;
	},

	/**
	 * Add the export button to the chart
	 */
	addButton: function (options) {
		var chart = this,
			renderer = chart.renderer,
			btnOptions = merge(chart.options.navigation.buttonOptions, options),
			onclick = btnOptions.onclick,
			menuItems = btnOptions.menuItems,
			symbol,
			button,
			symbolAttr = {
				stroke: btnOptions.symbolStroke,
				fill: btnOptions.symbolFill
			},
			symbolSize = btnOptions.symbolSize || 12;
		if (!chart.btnCount) {
			chart.btnCount = 0;
		}

		// Keeps references to the button elements
		if (!chart.exportDivElements) {
			chart.exportDivElements = [];
			chart.exportSVGElements = [];
		}

		if (btnOptions.enabled === false) {
			return;
		}


		var attr = btnOptions.theme,
			states = attr.states,
			hover = states && states.hover,
			select = states && states.select,
			callback;

		delete attr.states;

		if (onclick) {
			callback = function (e) {
				e.stopPropagation();
				onclick.call(chart, e);
			};

		} else if (menuItems) {
			callback = function () {
				chart.contextMenu(
					button.menuClassName,
					menuItems,
					button.translateX,
					button.translateY,
					button.width,
					button.height,
					button
				);
				button.setState(2);
			};
		}


		if (btnOptions.text && btnOptions.symbol) {
			attr.paddingLeft = Highcharts.pick(attr.paddingLeft, 25);

		} else if (!btnOptions.text) {
			extend(attr, {
				width: btnOptions.width,
				height: btnOptions.height,
				padding: 0
			});
		}

		button = renderer.button(btnOptions.text, 0, 0, callback, attr, hover, select)
			.attr({
				title: chart.options.lang[btnOptions._titleKey],
				'stroke-linecap': 'round',
				zIndex: 3 // #4955
			});
		button.menuClassName = options.menuClassName || PREFIX + 'menu-' + chart.btnCount++;

		if (btnOptions.symbol) {
			symbol = renderer.symbol(
					btnOptions.symbol,
					btnOptions.symbolX - (symbolSize / 2),
					btnOptions.symbolY - (symbolSize / 2),
					symbolSize,
					symbolSize
				)
				.attr(extend(symbolAttr, {
					'stroke-width': btnOptions.symbolStrokeWidth || 1,
					zIndex: 1
				})).add(button);
		}

		button.add()
			.align(extend(btnOptions, {
				width: button.width,
				x: Highcharts.pick(btnOptions.x, buttonOffset) // #1654
			}), true, 'spacingBox');

		buttonOffset += (button.width + btnOptions.buttonSpacing) * (btnOptions.align === 'right' ? -1 : 1);

		chart.exportSVGElements.push(button, symbol);

	},

	/**
	 * Destroy the buttons.
	 */
	destroyExport: function (e) {
		var chart = e.target,
			i,
			elem;

		// Destroy the extra buttons added
		for (i = 0; i < chart.exportSVGElements.length; i++) {
			elem = chart.exportSVGElements[i];

			// Destroy and null the svg/vml elements
			if (elem) { // #1822
				elem.onclick = elem.ontouchstart = null;
				chart.exportSVGElements[i] = elem.destroy();
			}
		}

		// Destroy the divs for the menu
		for (i = 0; i < chart.exportDivElements.length; i++) {
			elem = chart.exportDivElements[i];

			// Remove the event handler
			removeEvent(elem, 'mouseleave');

			// Remove inline events
			chart.exportDivElements[i] = elem.onmouseout = elem.onmouseover = elem.ontouchstart = elem.onclick = null;

			// Destroy the div by moving to garbage bin
			discardElement(elem);
		}
	}
});


symbols.menu = function (x, y, width, height) {
	var arr = [
		M, x, y + 2.5,
		L, x + width, y + 2.5,
		M, x, y + height / 2 + 0.5,
		L, x + width, y + height / 2 + 0.5,
		M, x, y + height - 1.5,
		L, x + width, y + height - 1.5
	];
	return arr;
};

// Add the buttons on chart load
Chart.prototype.callbacks.push(function (chart) {
	var n,
		exportingOptions = chart.options.exporting,
		buttons = exportingOptions.buttons;

	buttonOffset = 0;

	if (exportingOptions.enabled !== false) {

		for (n in buttons) {
			chart.addButton(buttons[n]);
		}

		// Destroy the export elements at chart destroy
		addEvent(chart, 'destroy', chart.destroyExport);
	}

});


}));
/*
 
 Highcharts funnel module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(b){typeof module==="object"&&module.exports?module.exports=b:b(Highcharts)})(function(b){var q=b.getOptions(),w=q.plotOptions,r=b.seriesTypes,G=b.merge,E=function(){},B=b.each,F=b.pick;w.funnel=G(w.pie,{animation:!1,center:["50%","50%"],width:"90%",neckWidth:"30%",height:"100%",neckHeight:"25%",reversed:!1,dataLabels:{connectorWidth:1,connectorColor:"#606060"},size:!0,states:{select:{color:"#C0C0C0",borderColor:"#000000",shadow:!1}}});r.funnel=b.extendClass(r.pie,{type:"funnel",animate:E,
translate:function(){var a=function(k,a){return/%$/.test(k)?a*parseInt(k,10)/100:parseInt(k,10)},b=0,f=this.chart,c=this.options,g=c.reversed,l=c.ignoreHiddenPoint,h=f.plotWidth,d=f.plotHeight,q=0,f=c.center,i=a(f[0],h),x=a(f[1],d),r=a(c.width,h),m,s,e=a(c.height,d),t=a(c.neckWidth,h),C=a(c.neckHeight,d),u=x-e/2+e-C,a=this.data,y,z,w=c.dataLabels.position==="left"?1:0,A,n,D,p,j,v,o;this.getWidthAt=s=function(k){var a=x-e/2;return k>u||e===C?t:t+(r-t)*(1-(k-a)/(e-C))};this.getX=function(k,a){return i+
(a?-1:1)*(s(g?d-k:k)/2+c.dataLabels.distance)};this.center=[i,x,e];this.centerX=i;B(a,function(a){if(!l||a.visible!==!1)b+=a.y});B(a,function(a){o=null;z=b?a.y/b:0;n=x-e/2+q*e;j=n+z*e;m=s(n);A=i-m/2;D=A+m;m=s(j);p=i-m/2;v=p+m;n>u?(A=p=i-t/2,D=v=i+t/2):j>u&&(o=j,m=s(u),p=i-m/2,v=p+m,j=u);g&&(n=e-n,j=e-j,o=o?e-o:null);y=["M",A,n,"L",D,n,v,j];o&&y.push(v,o,p,o);y.push(p,j,"Z");a.shapeType="path";a.shapeArgs={d:y};a.percentage=z*100;a.plotX=i;a.plotY=(n+(o||j))/2;a.tooltipPos=[i,a.plotY];a.slice=E;a.half=
w;if(!l||a.visible!==!1)q+=z})},drawPoints:function(){var a=this,b=a.options,f=a.chart.renderer,c,g,l,h;B(a.data,function(d){c=d.options;h=d.graphic;l=d.shapeArgs;g={fill:d.color,stroke:F(c.borderColor,b.borderColor),"stroke-width":F(c.borderWidth,b.borderWidth)};h?h.attr(g).animate(l):d.graphic=f.path(l).attr(g).add(a.group)})},sortByAngle:function(a){a.sort(function(a,b){return a.plotY-b.plotY})},drawDataLabels:function(){var a=this.data,b=this.options.dataLabels.distance,f,c,g,l=a.length,h,d;for(this.center[2]-=
2*b;l--;)g=a[l],c=(f=g.half)?1:-1,d=g.plotY,h=this.getX(d,f),g.labelPos=[0,d,h+(b-5)*c,d,h+b*c,d,f?"right":"left",0];r.pie.prototype.drawDataLabels.call(this)}});q.plotOptions.pyramid=b.merge(q.plotOptions.funnel,{neckWidth:"0%",neckHeight:"0%",reversed:!0});b.seriesTypes.pyramid=b.extendClass(b.seriesTypes.funnel,{type:"pyramid"})});
/**
 * @license 
 * Highcharts funnel module
 *
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
/* eslint indent:0 */

(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function (Highcharts) {
	
'use strict';

// create shortcuts
var defaultOptions = Highcharts.getOptions(),
	defaultPlotOptions = defaultOptions.plotOptions,
	seriesTypes = Highcharts.seriesTypes,
	merge = Highcharts.merge,
	noop = function () {},
	each = Highcharts.each,
	pick = Highcharts.pick;

// set default options
defaultPlotOptions.funnel = merge(defaultPlotOptions.pie, {
	animation: false,
	center: ['50%', '50%'],
	width: '90%',
	neckWidth: '30%',
	height: '100%',
	neckHeight: '25%',
	reversed: false,
	dataLabels: {
		//position: 'right',
		connectorWidth: 1,
		connectorColor: '#606060'
	},
	size: true, // to avoid adapting to data label size in Pie.drawDataLabels
	states: {
		select: {
			color: '#C0C0C0',
			borderColor: '#000000',
			shadow: false
		}
	}	
});


seriesTypes.funnel = Highcharts.extendClass(seriesTypes.pie, {
	
	type: 'funnel',
	animate: noop,

	/**
	 * Overrides the pie translate method
	 */
	translate: function () {
		
		var 
			// Get positions - either an integer or a percentage string must be given
			getLength = function (length, relativeTo) {
				return (/%$/).test(length) ?
					relativeTo * parseInt(length, 10) / 100 :
					parseInt(length, 10);
			},
			
			sum = 0,
			series = this,
			chart = series.chart,
			options = series.options,
			reversed = options.reversed,
			ignoreHiddenPoint = options.ignoreHiddenPoint,
			plotWidth = chart.plotWidth,
			plotHeight = chart.plotHeight,
			cumulative = 0, // start at top
			center = options.center,
			centerX = getLength(center[0], plotWidth),
			centerY = getLength(center[1], plotHeight),
			width = getLength(options.width, plotWidth),
			tempWidth,
			getWidthAt,
			height = getLength(options.height, plotHeight),
			neckWidth = getLength(options.neckWidth, plotWidth),
			neckHeight = getLength(options.neckHeight, plotHeight),
			neckY = (centerY - height / 2) + height - neckHeight,
			data = series.data,
			path,
			fraction,
			half = options.dataLabels.position === 'left' ? 1 : 0,

			x1, 
			y1, 
			x2, 
			x3, 
			y3, 
			x4, 
			y5;

		// Return the width at a specific y coordinate
		series.getWidthAt = getWidthAt = function (y) {
			var top = (centerY - height / 2);
			
			return y > neckY || height === neckHeight ?
				neckWidth :
				neckWidth + (width - neckWidth) * (1 - (y - top) / (height - neckHeight));
		};
		series.getX = function (y, half) {
			return centerX + (half ? -1 : 1) * ((getWidthAt(reversed ? plotHeight - y : y) / 2) + options.dataLabels.distance);
		};

		// Expose
		series.center = [centerX, centerY, height];
		series.centerX = centerX;

		/*
		 * Individual point coordinate naming:
		 *
		 * x1,y1 _________________ x2,y1
		 *  \                         /
		 *   \                       /
		 *    \                     /
		 *     \                   /
		 *      \                 /
		 *     x3,y3 _________ x4,y3
		 *
		 * Additional for the base of the neck:
		 *
		 *       |               |
		 *       |               |
		 *       |               |
		 *     x3,y5 _________ x4,y5
		 */




		// get the total sum
		each(data, function (point) {
			if (!ignoreHiddenPoint || point.visible !== false) {
				sum += point.y;
			}
		});

		each(data, function (point) {
			// set start and end positions
			y5 = null;
			fraction = sum ? point.y / sum : 0;
			y1 = centerY - height / 2 + cumulative * height;
			y3 = y1 + fraction * height;
			//tempWidth = neckWidth + (width - neckWidth) * ((height - neckHeight - y1) / (height - neckHeight));
			tempWidth = getWidthAt(y1);
			x1 = centerX - tempWidth / 2;
			x2 = x1 + tempWidth;
			tempWidth = getWidthAt(y3);
			x3 = centerX - tempWidth / 2;
			x4 = x3 + tempWidth;

			// the entire point is within the neck
			if (y1 > neckY) {
				x1 = x3 = centerX - neckWidth / 2;
				x2 = x4 = centerX + neckWidth / 2;
			
			// the base of the neck
			} else if (y3 > neckY) {
				y5 = y3;

				tempWidth = getWidthAt(neckY);
				x3 = centerX - tempWidth / 2;
				x4 = x3 + tempWidth;

				y3 = neckY;
			}

			if (reversed) {
				y1 = height - y1;
				y3 = height - y3;
				y5 = (y5 ? height - y5 : null);
			}
			// save the path
			path = [
				'M',
				x1, y1,
				'L',
				x2, y1,
				x4, y3
			];
			if (y5) {
				path.push(x4, y5, x3, y5);
			}
			path.push(x3, y3, 'Z');

			// prepare for using shared dr
			point.shapeType = 'path';
			point.shapeArgs = { d: path };


			// for tooltips and data labels
			point.percentage = fraction * 100;
			point.plotX = centerX;
			point.plotY = (y1 + (y5 || y3)) / 2;

			// Placement of tooltips and data labels
			point.tooltipPos = [
				centerX,
				point.plotY
			];

			// Slice is a noop on funnel points
			point.slice = noop;
			
			// Mimicking pie data label placement logic
			point.half = half;

			if (!ignoreHiddenPoint || point.visible !== false) {
				cumulative += fraction;
			}
		});		
	},
	/**
	 * Draw a single point (wedge)
	 * @param {Object} point The point object
	 * @param {Object} color The color of the point
	 * @param {Number} brightness The brightness relative to the color
	 */
	drawPoints: function () {
		var series = this,
			options = series.options,
			chart = series.chart,
			renderer = chart.renderer,
			pointOptions,
			pointAttr,
			shapeArgs,
			graphic;

		each(series.data, function (point) {
			pointOptions = point.options;
			graphic = point.graphic;
			shapeArgs = point.shapeArgs;

			pointAttr = {
				fill: point.color,
				stroke: pick(pointOptions.borderColor, options.borderColor),
				'stroke-width': pick(pointOptions.borderWidth, options.borderWidth)
			};

			if (!graphic) { // Create the shapes				
				point.graphic = renderer.path(shapeArgs)
					.attr(pointAttr)
					.add(series.group);
					
			} else { // Update the shapes
				graphic.attr(pointAttr).animate(shapeArgs);
			}
		});
	},

	/**
	 * Funnel items don't have angles (#2289)
	 */
	sortByAngle: function (points) {
		points.sort(function (a, b) {
			return a.plotY - b.plotY;
		});
	},
	
	/**
	 * Extend the pie data label method
	 */
	drawDataLabels: function () {
		var data = this.data,
			labelDistance = this.options.dataLabels.distance,
			leftSide,
			sign,
			point,
			i = data.length,
			x,
			y;
		
		// In the original pie label anticollision logic, the slots are distributed
		// from one labelDistance above to one labelDistance below the pie. In funnels
		// we don't want this.
		this.center[2] -= 2 * labelDistance;
		
		// Set the label position array for each point.
		while (i--) {
			point = data[i];
			leftSide = point.half;
			sign = leftSide ? 1 : -1;
			y = point.plotY;
			x = this.getX(y, leftSide);
				
			// set the anchor point for data labels
			point.labelPos = [
				0, // first break of connector
				y, // a/a
				x + (labelDistance - 5) * sign, // second break, right outside point shape
				y, // a/a
				x + labelDistance * sign, // landing point for connector
				y, // a/a
				leftSide ? 'right' : 'left', // alignment
				0 // center angle
			];
		}
		
		seriesTypes.pie.prototype.drawDataLabels.call(this);
	}

});

/** 
 * Pyramid series type.
 * A pyramid series is a special type of funnel, without neck and reversed by default.
 */
defaultOptions.plotOptions.pyramid = Highcharts.merge(defaultOptions.plotOptions.funnel, {        
	neckWidth: '0%',
	neckHeight: '0%',
	reversed: true
});
Highcharts.seriesTypes.pyramid = Highcharts.extendClass(Highcharts.seriesTypes.funnel, {
	type: 'pyramid'
});

}));
/*
 Highcharts JS v4.2.3 (2016-02-08)

 (c) 2011-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(d){typeof module==="object"&&module.exports?module.exports=d:d(Highcharts)})(function(d){var m=d.Axis,q=d.Chart,i=d.Color,x=d.Legend,s=d.LegendSymbolMixin,t=d.Series,y=d.Point,u=d.getOptions(),h=d.each,r=d.extend,v=d.extendClass,j=d.merge,k=d.pick,o=d.seriesTypes,w=d.wrap,n=function(){},p=d.ColorAxis=function(){this.isColorAxis=!0;this.init.apply(this,arguments)};r(p.prototype,m.prototype);r(p.prototype,{defaultColorAxisOptions:{lineWidth:0,minPadding:0,maxPadding:0,gridLineWidth:1,tickPixelInterval:72,
startOnTick:!0,endOnTick:!0,offset:0,marker:{animation:{duration:50},color:"gray",width:0.01},labels:{overflow:"justify"},minColor:"#EFEFFF",maxColor:"#003875",tickLength:5},init:function(a,b){var c=a.options.legend.layout!=="vertical",f;f=j(this.defaultColorAxisOptions,{side:c?2:1,reversed:!c},b,{opposite:!c,showEmpty:!1,title:null,isColor:!0});m.prototype.init.call(this,a,f);b.dataClasses&&this.initDataClasses(b);this.initStops(b);this.horiz=c;this.zoomEnabled=!1},tweenColors:function(a,b,c){var f;
!b.rgba.length||!a.rgba.length?a=b.input||"none":(a=a.rgba,b=b.rgba,f=b[3]!==1||a[3]!==1,a=(f?"rgba(":"rgb(")+Math.round(b[0]+(a[0]-b[0])*(1-c))+","+Math.round(b[1]+(a[1]-b[1])*(1-c))+","+Math.round(b[2]+(a[2]-b[2])*(1-c))+(f?","+(b[3]+(a[3]-b[3])*(1-c)):"")+")");return a},initDataClasses:function(a){var b=this,c=this.chart,f,e=0,l=this.options,g=a.dataClasses.length;this.dataClasses=f=[];this.legendItems=[];h(a.dataClasses,function(a,d){var h,a=j(a);f.push(a);if(!a.color)l.dataClassColor==="category"?
(h=c.options.colors,a.color=h[e++],e===h.length&&(e=0)):a.color=b.tweenColors(i(l.minColor),i(l.maxColor),g<2?0.5:d/(g-1))})},initStops:function(a){this.stops=a.stops||[[0,this.options.minColor],[1,this.options.maxColor]];h(this.stops,function(a){a.color=i(a[1])})},setOptions:function(a){m.prototype.setOptions.call(this,a);this.options.crosshair=this.options.marker;this.coll="colorAxis"},setAxisSize:function(){var a=this.legendSymbol,b=this.chart,c,f,e;if(a)this.left=c=a.attr("x"),this.top=f=a.attr("y"),
this.width=e=a.attr("width"),this.height=a=a.attr("height"),this.right=b.chartWidth-c-e,this.bottom=b.chartHeight-f-a,this.len=this.horiz?e:a,this.pos=this.horiz?c:f},toColor:function(a,b){var c,f=this.stops,e,l=this.dataClasses,g,d;if(l)for(d=l.length;d--;){if(g=l[d],e=g.from,f=g.to,(e===void 0||a>=e)&&(f===void 0||a<=f)){c=g.color;if(b)b.dataClass=d;break}}else{this.isLog&&(a=this.val2lin(a));c=1-(this.max-a)/(this.max-this.min||1);for(d=f.length;d--;)if(c>f[d][0])break;e=f[d]||f[d+1];f=f[d+1]||
e;c=1-(f[0]-c)/(f[0]-e[0]||1);c=this.tweenColors(e.color,f.color,c)}return c},getOffset:function(){var a=this.legendGroup,b=this.chart.axisOffset[this.side];if(a){this.axisParent=a;m.prototype.getOffset.call(this);if(!this.added)this.added=!0,this.labelLeft=0,this.labelRight=this.width;this.chart.axisOffset[this.side]=b}},setLegendColor:function(){var a,b=this.options,c=this.reversed;a=c?1:0;c=c?0:1;a=this.horiz?[a,0,c,0]:[0,c,0,a];this.legendColor={linearGradient:{x1:a[0],y1:a[1],x2:a[2],y2:a[3]},
stops:b.stops||[[0,b.minColor],[1,b.maxColor]]}},drawLegendSymbol:function(a,b){var c=a.padding,f=a.options,e=this.horiz,d=k(f.symbolWidth,e?200:12),g=k(f.symbolHeight,e?12:200),h=k(f.labelPadding,e?16:30),f=k(f.itemDistance,10);this.setLegendColor();b.legendSymbol=this.chart.renderer.rect(0,a.baseline-11,d,g).attr({zIndex:1}).add(b.legendGroup);this.legendItemWidth=d+c+(e?f:h);this.legendItemHeight=g+c+(e?h:0)},setState:n,visible:!0,setVisible:n,getSeriesExtremes:function(){var a;if(this.series.length)a=
this.series[0],this.dataMin=a.valueMin,this.dataMax=a.valueMax},drawCrosshair:function(a,b){var c=b&&b.plotX,f=b&&b.plotY,e,d=this.pos,g=this.len;if(b)e=this.toPixels(b[b.series.colorKey]),e<d?e=d-2:e>d+g&&(e=d+g+2),b.plotX=e,b.plotY=this.len-e,m.prototype.drawCrosshair.call(this,a,b),b.plotX=c,b.plotY=f,this.cross&&this.cross.attr({fill:this.crosshair.color}).add(this.legendGroup)},getPlotLinePath:function(a,b,c,f,e){return typeof e==="number"?this.horiz?["M",e-4,this.top-6,"L",e+4,this.top-6,e,
this.top,"Z"]:["M",this.left,e,"L",this.left-6,e+6,this.left-6,e-6,"Z"]:m.prototype.getPlotLinePath.call(this,a,b,c,f)},update:function(a,b){var c=this.chart,f=c.legend;h(this.series,function(a){a.isDirtyData=!0});if(a.dataClasses&&f.allItems)h(f.allItems,function(a){a.isDataClass&&a.legendGroup.destroy()}),c.isDirtyLegend=!0;c.options[this.coll]=j(this.userOptions,a);m.prototype.update.call(this,a,b);this.legendItem&&(this.setLegendColor(),f.colorizeItem(this,!0))},getDataClassLegendSymbols:function(){var a=
this,b=this.chart,c=this.legendItems,f=b.options.legend,e=f.valueDecimals,l=f.valueSuffix||"",g;c.length||h(this.dataClasses,function(f,m){var i=!0,j=f.from,k=f.to;g="";j===void 0?g="< ":k===void 0&&(g="> ");j!==void 0&&(g+=d.numberFormat(j,e)+l);j!==void 0&&k!==void 0&&(g+=" - ");k!==void 0&&(g+=d.numberFormat(k,e)+l);c.push(r({chart:b,name:g,options:{},drawLegendSymbol:s.drawRectangle,visible:!0,setState:n,isDataClass:!0,setVisible:function(){i=this.visible=!i;h(a.series,function(a){h(a.points,
function(a){a.dataClass===m&&a.setVisible(i)})});b.legend.colorizeItem(this,i)}},f))});return c},name:""});h(["fill","stroke"],function(a){d.Fx.prototype[a+"Setter"]=function(){this.elem.attr(a,p.prototype.tweenColors(i(this.start),i(this.end),this.pos))}});w(q.prototype,"getAxes",function(a){var b=this.options.colorAxis;a.call(this);this.colorAxis=[];b&&new p(this,b)});w(x.prototype,"getAllItems",function(a){var b=[],c=this.chart.colorAxis[0];c&&(c.options.dataClasses?b=b.concat(c.getDataClassLegendSymbols()):
b.push(c),h(c.series,function(a){a.options.showInLegend=!1}));return b.concat(a.call(this))});q={pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color",dashstyle:"dashStyle"},pointArrayMap:["value"],axisTypes:["xAxis","yAxis","colorAxis"],optionalAxis:"colorAxis",trackerGroups:["group","markerGroup","dataLabelsGroup"],getSymbol:n,parallelArrays:["x","y","value"],colorKey:"value",translateColors:function(){var a=this,b=this.options.nullColor,c=this.colorAxis,f=this.colorKey;
h(this.data,function(e){var d=e[f];if(d=e.options.color||(d===null?b:c&&d!==void 0?c.toColor(d,e):e.color||a.color))e.color=d})}};u.plotOptions.heatmap=j(u.plotOptions.scatter,{animation:!1,borderWidth:0,nullColor:"#F8F8F8",dataLabels:{formatter:function(){return this.point.value},inside:!0,verticalAlign:"middle",crop:!1,overflow:!1,padding:0},marker:null,pointRange:null,tooltip:{pointFormat:"{point.x}, {point.y}: {point.value}<br/>"},states:{normal:{animation:!0},hover:{halo:!1,brightness:0.2}}});
o.heatmap=v(o.scatter,j(q,{type:"heatmap",pointArrayMap:["y","value"],hasPointSpecificOptions:!0,pointClass:v(y,{setVisible:function(a){var b=this,c=a?"show":"hide";h(["graphic","dataLabel"],function(a){if(b[a])b[a][c]()})}}),supportsDrilldown:!0,getExtremesFromAll:!0,directTouch:!0,init:function(){var a;o.scatter.prototype.init.apply(this,arguments);a=this.options;a.pointRange=k(a.pointRange,a.colsize||1);this.yAxis.axisPointRange=a.rowsize||1},translate:function(){var a=this.options,b=this.xAxis,
c=this.yAxis,f=function(a,b,c){return Math.min(Math.max(b,a),c)};this.generatePoints();h(this.points,function(e){var d=(a.colsize||1)/2,g=(a.rowsize||1)/2,h=f(Math.round(b.len-b.translate(e.x-d,0,1,0,1)),0,b.len),d=f(Math.round(b.len-b.translate(e.x+d,0,1,0,1)),0,b.len),i=f(Math.round(c.translate(e.y-g,0,1,0,1)),0,c.len),g=f(Math.round(c.translate(e.y+g,0,1,0,1)),0,c.len);e.plotX=e.clientX=(h+d)/2;e.plotY=(i+g)/2;e.shapeType="rect";e.shapeArgs={x:Math.min(h,d),y:Math.min(i,g),width:Math.abs(d-h),
height:Math.abs(g-i)}});this.translateColors();this.chart.hasRendered&&h(this.points,function(a){a.shapeArgs.fill=a.options.color||a.color})},drawPoints:o.column.prototype.drawPoints,animate:n,getBox:n,drawLegendSymbol:s.drawRectangle,getExtremes:function(){t.prototype.getExtremes.call(this,this.valueData);this.valueMin=this.dataMin;this.valueMax=this.dataMax;t.prototype.getExtremes.call(this)}}))});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 *
 * (c) 2011-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
/* eslint indent: [2, 4] */

(function (factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory;
    } else {
        factory(Highcharts);
    }
}(function (Highcharts) {


    var UNDEFINED,
        Axis = Highcharts.Axis,
        Chart = Highcharts.Chart,
        Color = Highcharts.Color,
        Legend = Highcharts.Legend,
        LegendSymbolMixin = Highcharts.LegendSymbolMixin,
        Series = Highcharts.Series,
        Point = Highcharts.Point,

        defaultOptions = Highcharts.getOptions(),
        each = Highcharts.each,
        extend = Highcharts.extend,
        extendClass = Highcharts.extendClass,
        merge = Highcharts.merge,
        pick = Highcharts.pick,
        seriesTypes = Highcharts.seriesTypes,
        wrap = Highcharts.wrap,
        noop = function () {};

    


    /**
     * The ColorAxis object for inclusion in gradient legends
     */
    var ColorAxis = Highcharts.ColorAxis = function () {
        this.isColorAxis = true;
        this.init.apply(this, arguments);
    };
    extend(ColorAxis.prototype, Axis.prototype);
    extend(ColorAxis.prototype, {
        defaultColorAxisOptions: {
            lineWidth: 0,
            minPadding: 0,
            maxPadding: 0,
            gridLineWidth: 1,
            tickPixelInterval: 72,
            startOnTick: true,
            endOnTick: true,
            offset: 0,
            marker: {
                animation: {
                    duration: 50
                },
                color: 'gray',
                width: 0.01
            },
            labels: {
                overflow: 'justify'
            },
            minColor: '#EFEFFF',
            maxColor: '#003875',
            tickLength: 5
        },
        init: function (chart, userOptions) {
            var horiz = chart.options.legend.layout !== 'vertical',
                options;

            // Build the options
            options = merge(this.defaultColorAxisOptions, {
                side: horiz ? 2 : 1,
                reversed: !horiz
            }, userOptions, {
                opposite: !horiz,
                showEmpty: false,
                title: null,
                isColor: true
            });

            Axis.prototype.init.call(this, chart, options);

            // Base init() pushes it to the xAxis array, now pop it again
            //chart[this.isXAxis ? 'xAxis' : 'yAxis'].pop();

            // Prepare data classes
            if (userOptions.dataClasses) {
                this.initDataClasses(userOptions);
            }
            this.initStops(userOptions);

            // Override original axis properties
            this.horiz = horiz;
            this.zoomEnabled = false;
        },

        /*
         * Return an intermediate color between two colors, according to pos where 0
         * is the from color and 1 is the to color.
         * NOTE: Changes here should be copied
         * to the same function in drilldown.src.js and solid-gauge-src.js.
         */
        tweenColors: function (from, to, pos) {
            // Check for has alpha, because rgba colors perform worse due to lack of
            // support in WebKit.
            var hasAlpha,
                ret;

            // Unsupported color, return to-color (#3920)
            if (!to.rgba.length || !from.rgba.length) {
                ret = to.input || 'none';

            // Interpolate
            } else {
                from = from.rgba;
                to = to.rgba;
                hasAlpha = (to[3] !== 1 || from[3] !== 1);
                ret = (hasAlpha ? 'rgba(' : 'rgb(') +
                    Math.round(to[0] + (from[0] - to[0]) * (1 - pos)) + ',' +
                    Math.round(to[1] + (from[1] - to[1]) * (1 - pos)) + ',' +
                    Math.round(to[2] + (from[2] - to[2]) * (1 - pos)) +
                    (hasAlpha ? (',' + (to[3] + (from[3] - to[3]) * (1 - pos))) : '') + ')';
            }
            return ret;
        },

        initDataClasses: function (userOptions) {
            var axis = this,
                chart = this.chart,
                dataClasses,
                colorCounter = 0,
                options = this.options,
                len = userOptions.dataClasses.length;
            this.dataClasses = dataClasses = [];
            this.legendItems = [];

            each(userOptions.dataClasses, function (dataClass, i) {
                var colors;

                dataClass = merge(dataClass);
                dataClasses.push(dataClass);
                if (!dataClass.color) {
                    if (options.dataClassColor === 'category') {
                        colors = chart.options.colors;
                        dataClass.color = colors[colorCounter++];
                        // loop back to zero
                        if (colorCounter === colors.length) {
                            colorCounter = 0;
                        }
                    } else {
                        dataClass.color = axis.tweenColors(
                            Color(options.minColor),
                            Color(options.maxColor),
                            len < 2 ? 0.5 : i / (len - 1) // #3219
                        );
                    }
                }
            });
        },

        initStops: function (userOptions) {
            this.stops = userOptions.stops || [
                [0, this.options.minColor],
                [1, this.options.maxColor]
            ];
            each(this.stops, function (stop) {
                stop.color = Color(stop[1]);
            });
        },

        /**
         * Extend the setOptions method to process extreme colors and color
         * stops.
         */
        setOptions: function (userOptions) {
            Axis.prototype.setOptions.call(this, userOptions);

            this.options.crosshair = this.options.marker;
            this.coll = 'colorAxis';
        },

        setAxisSize: function () {
            var symbol = this.legendSymbol,
                chart = this.chart,
                x,
                y,
                width,
                height;

            if (symbol) {
                this.left = x = symbol.attr('x');
                this.top = y = symbol.attr('y');
                this.width = width = symbol.attr('width');
                this.height = height = symbol.attr('height');
                this.right = chart.chartWidth - x - width;
                this.bottom = chart.chartHeight - y - height;

                this.len = this.horiz ? width : height;
                this.pos = this.horiz ? x : y;
            }
        },

        /**
         * Translate from a value to a color
         */
        toColor: function (value, point) {
            var pos,
                stops = this.stops,
                from,
                to,
                color,
                dataClasses = this.dataClasses,
                dataClass,
                i;

            if (dataClasses) {
                i = dataClasses.length;
                while (i--) {
                    dataClass = dataClasses[i];
                    from = dataClass.from;
                    to = dataClass.to;
                    if ((from === UNDEFINED || value >= from) && (to === UNDEFINED || value <= to)) {
                        color = dataClass.color;
                        if (point) {
                            point.dataClass = i;
                        }
                        break;
                    }
                }

            } else {

                if (this.isLog) {
                    value = this.val2lin(value);
                }
                pos = 1 - ((this.max - value) / ((this.max - this.min) || 1));
                i = stops.length;
                while (i--) {
                    if (pos > stops[i][0]) {
                        break;
                    }
                }
                from = stops[i] || stops[i + 1];
                to = stops[i + 1] || from;

                // The position within the gradient
                pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);

                color = this.tweenColors(
                    from.color,
                    to.color,
                    pos
                );
            }
            return color;
        },

        /**
         * Override the getOffset method to add the whole axis groups inside the legend.
         */
        getOffset: function () {
            var group = this.legendGroup,
                sideOffset = this.chart.axisOffset[this.side];

            if (group) {

                // Hook for the getOffset method to add groups to this parent group
                this.axisParent = group;

                // Call the base
                Axis.prototype.getOffset.call(this);

                // First time only
                if (!this.added) {

                    this.added = true;

                    this.labelLeft = 0;
                    this.labelRight = this.width;
                }
                // Reset it to avoid color axis reserving space
                this.chart.axisOffset[this.side] = sideOffset;
            }
        },

        /**
         * Create the color gradient
         */
        setLegendColor: function () {
            var grad,
                horiz = this.horiz,
                options = this.options,
                reversed = this.reversed,
                one = reversed ? 1 : 0,
                zero = reversed ? 0 : 1;

            grad = horiz ? [one, 0, zero, 0] : [0, zero, 0, one]; // #3190
            this.legendColor = {
                linearGradient: { x1: grad[0], y1: grad[1], x2: grad[2], y2: grad[3] },
                stops: options.stops || [
                    [0, options.minColor],
                    [1, options.maxColor]
                ]
            };
        },

        /**
         * The color axis appears inside the legend and has its own legend symbol
         */
        drawLegendSymbol: function (legend, item) {
            var padding = legend.padding,
                legendOptions = legend.options,
                horiz = this.horiz,
                width = pick(legendOptions.symbolWidth, horiz ? 200 : 12),
                height = pick(legendOptions.symbolHeight, horiz ? 12 : 200),
                labelPadding = pick(legendOptions.labelPadding, horiz ? 16 : 30),
                itemDistance = pick(legendOptions.itemDistance, 10);

            this.setLegendColor();

            // Create the gradient
            item.legendSymbol = this.chart.renderer.rect(
                0,
                legend.baseline - 11,
                width,
                height
            ).attr({
                zIndex: 1
            }).add(item.legendGroup);

            // Set how much space this legend item takes up
            this.legendItemWidth = width + padding + (horiz ? itemDistance : labelPadding);
            this.legendItemHeight = height + padding + (horiz ? labelPadding : 0);
        },
        /**
         * Fool the legend
         */
        setState: noop,
        visible: true,
        setVisible: noop,
        getSeriesExtremes: function () {
            var series;
            if (this.series.length) {
                series = this.series[0];
                this.dataMin = series.valueMin;
                this.dataMax = series.valueMax;
            }
        },
        drawCrosshair: function (e, point) {
            var plotX = point && point.plotX,
                plotY = point && point.plotY,
                crossPos,
                axisPos = this.pos,
                axisLen = this.len;

            if (point) {
                crossPos = this.toPixels(point[point.series.colorKey]);
                if (crossPos < axisPos) {
                    crossPos = axisPos - 2;
                } else if (crossPos > axisPos + axisLen) {
                    crossPos = axisPos + axisLen + 2;
                }

                point.plotX = crossPos;
                point.plotY = this.len - crossPos;
                Axis.prototype.drawCrosshair.call(this, e, point);
                point.plotX = plotX;
                point.plotY = plotY;

                if (this.cross) {
                    this.cross
                        .attr({
                            fill: this.crosshair.color
                        })
                        .add(this.legendGroup);
                }
            }
        },
        getPlotLinePath: function (a, b, c, d, pos) {
            return typeof pos === 'number' ? // crosshairs only // #3969 pos can be 0 !!
                (this.horiz ?
                    ['M', pos - 4, this.top - 6, 'L', pos + 4, this.top - 6, pos, this.top, 'Z'] :
                    ['M', this.left, pos, 'L', this.left - 6, pos + 6, this.left - 6, pos - 6, 'Z']
                ) :
                Axis.prototype.getPlotLinePath.call(this, a, b, c, d);
        },

        update: function (newOptions, redraw) {
            var chart = this.chart,
                legend = chart.legend;

            each(this.series, function (series) {
                series.isDirtyData = true; // Needed for Axis.update when choropleth colors change
            });

            // When updating data classes, destroy old items and make sure new ones are created (#3207)
            if (newOptions.dataClasses && legend.allItems) {
                each(legend.allItems, function (item) {
                    if (item.isDataClass) {
                        item.legendGroup.destroy();
                    }
                });
                chart.isDirtyLegend = true;
            }

            // Keep the options structure updated for export. Unlike xAxis and yAxis, the colorAxis is
            // not an array. (#3207)
            chart.options[this.coll] = merge(this.userOptions, newOptions);

            Axis.prototype.update.call(this, newOptions, redraw);
            if (this.legendItem) {
                this.setLegendColor();
                legend.colorizeItem(this, true);
            }
        },

        /**
         * Get the legend item symbols for data classes
         */
        getDataClassLegendSymbols: function () {
            var axis = this,
                chart = this.chart,
                legendItems = this.legendItems,
                legendOptions = chart.options.legend,
                valueDecimals = legendOptions.valueDecimals,
                valueSuffix = legendOptions.valueSuffix || '',
                name;

            if (!legendItems.length) {
                each(this.dataClasses, function (dataClass, i) {
                    var vis = true,
                        from = dataClass.from,
                        to = dataClass.to;

                    // Assemble the default name. This can be overridden by legend.options.labelFormatter
                    name = '';
                    if (from === UNDEFINED) {
                        name = '< ';
                    } else if (to === UNDEFINED) {
                        name = '> ';
                    }
                    if (from !== UNDEFINED) {
                        name += Highcharts.numberFormat(from, valueDecimals) + valueSuffix;
                    }
                    if (from !== UNDEFINED && to !== UNDEFINED) {
                        name += ' - ';
                    }
                    if (to !== UNDEFINED) {
                        name += Highcharts.numberFormat(to, valueDecimals) + valueSuffix;
                    }

                    // Add a mock object to the legend items
                    legendItems.push(extend({
                        chart: chart,
                        name: name,
                        options: {},
                        drawLegendSymbol: LegendSymbolMixin.drawRectangle,
                        visible: true,
                        setState: noop,
                        isDataClass: true,
                        setVisible: function () {
                            vis = this.visible = !vis;
                            each(axis.series, function (series) {
                                each(series.points, function (point) {
                                    if (point.dataClass === i) {
                                        point.setVisible(vis);
                                    }
                                });
                            });

                            chart.legend.colorizeItem(this, vis);
                        }
                    }, dataClass));
                });
            }
            return legendItems;
        },
        name: '' // Prevents 'undefined' in legend in IE8
    });

    /**
     * Handle animation of the color attributes directly
     */
    each(['fill', 'stroke'], function (prop) {
        Highcharts.Fx.prototype[prop + 'Setter'] = function () {
            this.elem.attr(prop, ColorAxis.prototype.tweenColors(Color(this.start), Color(this.end), this.pos));
        };
    });

    /**
     * Extend the chart getAxes method to also get the color axis
     */
    wrap(Chart.prototype, 'getAxes', function (proceed) {

        var options = this.options,
            colorAxisOptions = options.colorAxis;

        proceed.call(this);

        this.colorAxis = [];
        if (colorAxisOptions) {
            new ColorAxis(this, colorAxisOptions); // eslint-disable-line no-new
        }
    });


    /**
     * Wrap the legend getAllItems method to add the color axis. This also removes the
     * axis' own series to prevent them from showing up individually.
     */
    wrap(Legend.prototype, 'getAllItems', function (proceed) {
        var allItems = [],
            colorAxis = this.chart.colorAxis[0];

        if (colorAxis) {

            // Data classes
            if (colorAxis.options.dataClasses) {
                allItems = allItems.concat(colorAxis.getDataClassLegendSymbols());
            // Gradient legend
            } else {
                // Add this axis on top
                allItems.push(colorAxis);
            }

            // Don't add the color axis' series
            each(colorAxis.series, function (series) {
                series.options.showInLegend = false;
            });
        }

        return allItems.concat(proceed.call(this));
    });
    /**
     * Mixin for maps and heatmaps
     */
    var colorPointMixin = {
        /**
         * Set the visibility of a single point
         */
        setVisible: function (vis) {
            var point = this,
                method = vis ? 'show' : 'hide';

            // Show and hide associated elements
            each(['graphic', 'dataLabel'], function (key) {
                if (point[key]) {
                    point[key][method]();
                }
            });
        }
    };
    var colorSeriesMixin = {

        pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
            stroke: 'borderColor',
            'stroke-width': 'borderWidth',
            fill: 'color',
            dashstyle: 'dashStyle'
        },
        pointArrayMap: ['value'],
        axisTypes: ['xAxis', 'yAxis', 'colorAxis'],
        optionalAxis: 'colorAxis',
        trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
        getSymbol: noop,
        parallelArrays: ['x', 'y', 'value'],
        colorKey: 'value',

        /**
         * In choropleth maps, the color is a result of the value, so this needs translation too
         */
        translateColors: function () {
            var series = this,
                nullColor = this.options.nullColor,
                colorAxis = this.colorAxis,
                colorKey = this.colorKey;

            each(this.data, function (point) {
                var value = point[colorKey],
                    color;

                color = point.options.color ||
                    (value === null ? nullColor : (colorAxis && value !== undefined) ? colorAxis.toColor(value, point) : point.color || series.color);

                if (color) {
                    point.color = color;
                }
            });
        }
    };

    /**
     * Extend the default options with map options
     */
    defaultOptions.plotOptions.heatmap = merge(defaultOptions.plotOptions.scatter, {
        animation: false,
        borderWidth: 0,
        nullColor: '#F8F8F8',
        dataLabels: {
            formatter: function () { // #2945
                return this.point.value;
            },
            inside: true,
            verticalAlign: 'middle',
            crop: false,
            overflow: false,
            padding: 0 // #3837
        },
        marker: null,
        pointRange: null, // dynamically set to colsize by default
        tooltip: {
            pointFormat: '{point.x}, {point.y}: {point.value}<br/>'
        },
        states: {
            normal: {
                animation: true
            },
            hover: {
                halo: false,  // #3406, halo is not required on heatmaps
                brightness: 0.2
            }
        }
    });

    // The Heatmap series type
    seriesTypes.heatmap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
        type: 'heatmap',
        pointArrayMap: ['y', 'value'],
        hasPointSpecificOptions: true,
        pointClass: extendClass(Point, colorPointMixin),
        supportsDrilldown: true,
        getExtremesFromAll: true,
        directTouch: true,

        /**
         * Override the init method to add point ranges on both axes.
         */
        init: function () {
            var options;
            seriesTypes.scatter.prototype.init.apply(this, arguments);

            options = this.options;
            options.pointRange = pick(options.pointRange, options.colsize || 1); // #3758, prevent resetting in setData
            this.yAxis.axisPointRange = options.rowsize || 1; // general point range
        },
        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                between = function (x, a, b) {
                    return Math.min(Math.max(a, x), b);
                };

            series.generatePoints();

            each(series.points, function (point) {
                var xPad = (options.colsize || 1) / 2,
                    yPad = (options.rowsize || 1) / 2,
                    x1 = between(Math.round(xAxis.len - xAxis.translate(point.x - xPad, 0, 1, 0, 1)), 0, xAxis.len),
                    x2 = between(Math.round(xAxis.len - xAxis.translate(point.x + xPad, 0, 1, 0, 1)), 0, xAxis.len),
                    y1 = between(Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 1)), 0, yAxis.len),
                    y2 = between(Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 1)), 0, yAxis.len);

                // Set plotX and plotY for use in K-D-Tree and more
                point.plotX = point.clientX = (x1 + x2) / 2;
                point.plotY = (y1 + y2) / 2;

                point.shapeType = 'rect';
                point.shapeArgs = {
                    x: Math.min(x1, x2),
                    y: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1)
                };
            });

            series.translateColors();

            // Make sure colors are updated on colorAxis update (#2893)
            if (this.chart.hasRendered) {
                each(series.points, function (point) {
                    point.shapeArgs.fill = point.options.color || point.color; // #3311
                });
            }
        },
        drawPoints: seriesTypes.column.prototype.drawPoints,
        animate: noop,
        getBox: noop,
        drawLegendSymbol: LegendSymbolMixin.drawRectangle,

        getExtremes: function () {
            // Get the extremes from the value data
            Series.prototype.getExtremes.call(this, this.valueData);
            this.valueMin = this.dataMin;
            this.valueMax = this.dataMax;

            // Get the extremes from the y data
            Series.prototype.getExtremes.call(this);
        }

    }));


}));
/*
 Highcharts JS v4.2.3 (2016-02-08)
 Plugin for displaying a message when there is no data visible in chart.

 (c) 2010-2016 Highsoft AS
 Author: Oystein Moseng

 License: www.highcharts.com/license
*/

(function(a){typeof module==="object"&&module.exports?module.exports=a:a(Highcharts)})(function(a){function h(){return!!this.points.length}function d(){this.hasData()?this.hideNoData():this.showNoData()}var e=a.seriesTypes,c=a.Chart.prototype,f=a.getOptions(),g=a.extend,i=a.each;g(f.lang,{noData:"No data to display"});f.noData={position:{x:0,y:0,align:"center",verticalAlign:"middle"},attr:{},style:{fontWeight:"bold",fontSize:"12px",color:"#60606a"}};i(["pie","gauge","waterfall","bubble"],function(b){if(e[b])e[b].prototype.hasData=
h});a.Series.prototype.hasData=function(){return this.visible&&this.dataMax!==void 0&&this.dataMin!==void 0};c.showNoData=function(b){var a=this.options,b=b||a.lang.noData,a=a.noData;if(!this.noDataLabel)this.noDataLabel=this.renderer.label(b,0,0,null,null,null,a.useHTML,null,"no-data").attr(a.attr).css(a.style).add(),this.noDataLabel.align(g(this.noDataLabel.getBBox(),a.position),!1,"plotBox")};c.hideNoData=function(){if(this.noDataLabel)this.noDataLabel=this.noDataLabel.destroy()};c.hasData=function(){for(var a=
this.series,c=a.length;c--;)if(a[c].hasData()&&!a[c].options.isInternal)return!0;return!1};c.callbacks.push(function(b){a.addEvent(b,"load",d);a.addEvent(b,"redraw",d)})});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2016 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */


(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	
	var seriesTypes = H.seriesTypes,
		chartPrototype = H.Chart.prototype,
		defaultOptions = H.getOptions(),
		extend = H.extend,
		each = H.each;

	// Add language option
	extend(defaultOptions.lang, {
		noData: 'No data to display'
	});
	
	// Add default display options for message
	defaultOptions.noData = {
		position: {
			x: 0,
			y: 0,			
			align: 'center',
			verticalAlign: 'middle'
		},
		attr: {						
		},
		style: {	
			fontWeight: 'bold',		
			fontSize: '12px',
			color: '#60606a'		
		}
		// useHTML: false
	};

	/**
	 * Define hasData functions for series. These return true if there are data points on this series within the plot area
	 */	
	function hasDataPie() {
		return !!this.points.length; /* != 0 */
	}

	each(['pie', 'gauge', 'waterfall', 'bubble'], function (type) {
		if (seriesTypes[type]) {
			seriesTypes[type].prototype.hasData = hasDataPie;
		}
	});

	H.Series.prototype.hasData = function () {
		return this.visible && this.dataMax !== undefined && this.dataMin !== undefined; // #3703
	};
	
	/**
	 * Display a no-data message.
	 *
	 * @param {String} str An optional message to show in place of the default one 
	 */
	chartPrototype.showNoData = function (str) {
		var chart = this,
			options = chart.options,
			text = str || options.lang.noData,
			noDataOptions = options.noData;

		if (!chart.noDataLabel) {
			chart.noDataLabel = chart.renderer
				.label(
					text, 
					0, 
					0, 
					null, 
					null, 
					null, 
					noDataOptions.useHTML, 
					null, 
					'no-data'
				)
				.attr(noDataOptions.attr)
				.css(noDataOptions.style)
				.add();
			chart.noDataLabel.align(extend(chart.noDataLabel.getBBox(), noDataOptions.position), false, 'plotBox');
		}
	};

	/**
	 * Hide no-data message	
	 */	
	chartPrototype.hideNoData = function () {
		var chart = this;
		if (chart.noDataLabel) {
			chart.noDataLabel = chart.noDataLabel.destroy();
		}
	};

	/**
	 * Returns true if there are data points within the plot area now
	 */	
	chartPrototype.hasData = function () {
		var chart = this,
			series = chart.series,
			i = series.length;

		while (i--) {
			if (series[i].hasData() && !series[i].options.isInternal) { 
				return true;
			}	
		}

		return false;
	};

	/**
	 * Show no-data message if there is no data in sight. Otherwise, hide it.
	 */
	function handleNoData() {
		var chart = this;
		if (chart.hasData()) {
			chart.hideNoData();
		} else {
			chart.showNoData();
		}
	}

	/**
	 * Add event listener to handle automatic display of no-data message
	 */
	chartPrototype.callbacks.push(function (chart) {
		H.addEvent(chart, 'load', handleNoData);
		H.addEvent(chart, 'redraw', handleNoData);
	});

}));
/*
 Highcharts JS v4.2.3 (2016-02-08)
 Client side exporting module

 (c) 2015 Torstein Honsi / Oystein Moseng

 License: www.highcharts.com/license
*/

(function(c){typeof module==="object"&&module.exports?module.exports=c:c(Highcharts)})(function(c){function y(c,e){var i=l.getElementsByTagName("head")[0],b=l.createElement("script");b.type="text/javascript";b.src=c;b.onload=e;i.appendChild(b)}var e=c.win,g=e.navigator,l=e.document;c.CanVGRenderer={};c.Chart.prototype.exportChartLocal=function(z,A){var i=this,b=c.merge(i.options.exporting,z),B=g.userAgent.indexOf("WebKit")>-1&&g.userAgent.indexOf("Chrome")<0,n=b.scale||2,p,s=e.URL||e.webkitURL||e,
k,t=0,q,o,u,d=function(){if(b.fallbackToExportServer===!1)if(b.error)b.error();else throw"Fallback to export server disabled";else i.exportChart(b)},v=function(a,j,f,b,m,c,d){var h=new e.Image,i,g=function(){var b=l.createElement("canvas"),c=b.getContext&&b.getContext("2d"),e;try{if(c){b.height=h.height*n;b.width=h.width*n;c.drawImage(h,0,0,b.width,b.height);try{e=b.toDataURL(),f(e,j)}catch(g){if(g.name==="SecurityError"||g.name==="SECURITY_ERR"||g.message==="SecurityError")i(a,j);else throw g;}}else m(a,
j)}finally{d&&d(a,j)}},k=function(){c(a,j);d&&d(a,j)};i=function(){h=new e.Image;i=b;h.crossOrigin="Anonymous";h.onload=g;h.onerror=k;h.src=a};h.onload=g;h.onerror=k;h.src=a},w=function(a){try{if(!B&&g.userAgent.toLowerCase().indexOf("firefox")<0)return s.createObjectURL(new e.Blob([a],{type:"image/svg+xml;charset-utf-16"}))}catch(b){}return"data:image/svg+xml;charset=UTF-8,"+encodeURIComponent(a)},r=function(a,c){var f=l.createElement("a"),d=(b.filename||"chart")+"."+c,m;if(g.msSaveOrOpenBlob)g.msSaveOrOpenBlob(a,
d);else if(f.download!==void 0)f.href=a,f.download=d,f.target="_blank",l.body.appendChild(f),f.click(),l.body.removeChild(f);else try{if(m=e.open(a,"chart"),m===void 0||m===null)throw"Failed to open window";}catch(i){e.location.href=a}},x=function(){var a,j,f=i.sanitizeSVG(p.innerHTML);if(b&&b.type==="image/svg+xml")try{g.msSaveOrOpenBlob?(j=new MSBlobBuilder,j.append(f),a=j.getBlob("image/svg+xml")):a=w(f),r(a,"svg")}catch(k){d()}else a=w(f),v(a,{},function(a){try{r(a,"png")}catch(b){d()}},function(){var a=
l.createElement("canvas"),b=a.getContext("2d"),j=f.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1]*n,h=f.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1]*n,k=function(){b.drawSvg(f,0,0,j,h);try{r(g.msSaveOrOpenBlob?a.msToBlob():a.toDataURL("image/png"),"png")}catch(c){d()}};a.width=j;a.height=h;e.canvg?k():(i.showLoading(),y(c.getOptions().global.canvasToolsURL,function(){i.hideLoading();k()}))},d,d,function(){try{s.revokeObjectURL(a)}catch(b){}})},C=function(a,b){++t;b.imageElement.setAttributeNS("http://www.w3.org/1999/xlink",
"href",a);t===k.length&&x()};c.wrap(c.Chart.prototype,"getChartHTML",function(a){p=this.container.cloneNode(!0);return a.apply(this,Array.prototype.slice.call(arguments,1))});i.getSVGForExport(b,A);k=p.getElementsByTagName("image");try{k.length||x();for(o=0,u=k.length;o<u;++o)q=k[o],v(q.getAttributeNS("http://www.w3.org/1999/xlink","href"),{imageElement:q},C,d,d,d)}catch(D){d()}};c.getOptions().exporting.buttons.contextButton.menuItems=[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},
{textKey:"downloadPNG",onclick:function(){this.exportChartLocal()}},{textKey:"downloadSVG",onclick:function(){this.exportChartLocal({type:"image/svg+xml"})}}]});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 * Client side exporting module
 *
 * (c) 2015 Torstein Honsi / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

/*global MSBlobBuilder */

(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (Highcharts) {

	var win = Highcharts.win,
		nav = win.navigator,
		doc = win.document;

	// Dummy object so we can reuse our canvas-tools.js without errors
	Highcharts.CanVGRenderer = {};


	/**
	 * Downloads a script and executes a callback when done.
	 * @param {String} scriptLocation
	 * @param {Function} callback
	 */
	function getScript(scriptLocation, callback) {
		var head = doc.getElementsByTagName('head')[0],
			script = doc.createElement('script');

		script.type = 'text/javascript';
		script.src = scriptLocation;
		script.onload = callback;

		head.appendChild(script);
	}

	/**
	 * Add a new method to the Chart object to perform a local download
	 */
	Highcharts.Chart.prototype.exportChartLocal = function (exportingOptions, chartOptions) {
		var chart = this,
			options = Highcharts.merge(chart.options.exporting, exportingOptions),
			webKit = nav.userAgent.indexOf('WebKit') > -1 && nav.userAgent.indexOf('Chrome') < 0, // Webkit and not chrome
			scale = options.scale || 2,
			chartCopyContainer,
			domurl = win.URL || win.webkitURL || win,
			images,
			imagesEmbedded = 0,
			el,
			i,
			l,
			fallbackToExportServer = function () {
				if (options.fallbackToExportServer === false) {
					if (options.error) {
						options.error();
					} else {
						throw 'Fallback to export server disabled';
					}
				} else {
					chart.exportChart(options);
				}
			},
			// Get data:URL from image URL
			// Pass in callbacks to handle results. finallyCallback is always called at the end of the process. Supplying this callback is optional.
			// All callbacks receive two arguments: imageURL, and callbackArgs. callbackArgs is used only by callbacks and can contain whatever.
			imageToDataUrl = function (imageURL, callbackArgs, successCallback, taintedCallback, noCanvasSupportCallback, failedLoadCallback, finallyCallback) {
				var img = new win.Image(),
					taintedHandler,
					loadHandler = function () {
						var canvas = doc.createElement('canvas'),
							ctx = canvas.getContext && canvas.getContext('2d'),
							dataURL;
						try {
							if (!ctx) {
								noCanvasSupportCallback(imageURL, callbackArgs);
							} else {
								canvas.height = img.height * scale;
								canvas.width = img.width * scale;
								ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

								// Now we try to get the contents of the canvas.
								try {
									dataURL = canvas.toDataURL();
									successCallback(dataURL, callbackArgs);
								} catch (e) {
									// Failed - either tainted canvas or something else went horribly wrong
									if (e.name === 'SecurityError' || e.name === 'SECURITY_ERR' || e.message === 'SecurityError') {
										taintedHandler(imageURL, callbackArgs);
									} else {
										throw e;
									}
								}
							}
						} finally {
							if (finallyCallback) {
								finallyCallback(imageURL, callbackArgs);
							}
						}
					},
					// Image load failed (e.g. invalid URL)
					errorHandler = function () {
						failedLoadCallback(imageURL, callbackArgs);
						if (finallyCallback) {
							finallyCallback(imageURL, callbackArgs);
						}
					};
				
				// This is called on load if the image drawing to canvas failed with a security error.
				// We retry the drawing with crossOrigin set to Anonymous.
				taintedHandler = function () {
					img = new win.Image();
					taintedHandler = taintedCallback;
					img.crossOrigin = 'Anonymous'; // Must be set prior to loading image source
					img.onload = loadHandler;
					img.onerror = errorHandler;
					img.src = imageURL;
				};

				img.onload = loadHandler;
				img.onerror = errorHandler;
				img.src = imageURL;
			},
			// Get blob URL from SVG code. Falls back to normal data URI.
			svgToDataUrl = function (svg) {
				try {
					// Safari requires data URI since it doesn't allow navigation to blob URLs
					// Firefox has an issue with Blobs and internal references, leading to gradients not working using Blobs (#4550)
					if (!webKit && nav.userAgent.toLowerCase().indexOf('firefox') < 0) {
						return domurl.createObjectURL(new win.Blob([svg], { type: 'image/svg+xml;charset-utf-16' }));
					}
				} catch (e) {
					// Ignore
				}
				return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
			},
			// Download contents by dataURL/blob
			download = function (dataURL, extension) {
				var a = doc.createElement('a'),
					filename = (options.filename || 'chart') + '.' + extension,
					windowRef;

				// IE specific blob implementation
				if (nav.msSaveOrOpenBlob) {
					nav.msSaveOrOpenBlob(dataURL, filename);
					return;
				}

				// Try HTML5 download attr if supported
				if (a.download !== undefined) {
					a.href = dataURL;
					a.download = filename; // HTML5 download attribute
					a.target = '_blank';
					doc.body.appendChild(a);
					a.click();
					doc.body.removeChild(a);
				} else {
					// No download attr, just opening data URI
					try {
						windowRef = win.open(dataURL, 'chart');
						if (windowRef === undefined || windowRef === null) {
							throw 'Failed to open window';
						}
					} catch (e) {
						// window.open failed, trying location.href
						win.location.href = dataURL;
					}
				}
			},
			// Get data URL to an image of the chart and call download on it
			initiateDownload = function () {
				var svgurl,
					blob,
					svg = chart.sanitizeSVG(chartCopyContainer.innerHTML); // SVG of chart copy

				// Initiate download depending on file type
				if (options && options.type === 'image/svg+xml') {
					// SVG download. In this case, we want to use Microsoft specific Blob if available
					try {
						if (nav.msSaveOrOpenBlob) {
							blob = new MSBlobBuilder();
							blob.append(svg);
							svgurl = blob.getBlob('image/svg+xml');
						} else {
							svgurl = svgToDataUrl(svg);
						}
						download(svgurl, 'svg');
					} catch (e) {
						fallbackToExportServer();
					}
				} else {
					// PNG download - create bitmap from SVG
					
					// First, try to get PNG by rendering on canvas
					svgurl = svgToDataUrl(svg);
					imageToDataUrl(svgurl, { /* args */ }, function (imageURL) {
						// Success
						try {
							download(imageURL, 'png');
						} catch (e) {
							fallbackToExportServer();
						}
					}, function () {
						// Failed due to tainted canvas
						// Create new and untainted canvas
						var canvas = doc.createElement('canvas'),
							ctx = canvas.getContext('2d'),
							imageWidth = svg.match(/^<svg[^>]*width\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
							imageHeight = svg.match(/^<svg[^>]*height\s*=\s*\"?(\d+)\"?[^>]*>/)[1] * scale,
							downloadWithCanVG = function () {
								ctx.drawSvg(svg, 0, 0, imageWidth, imageHeight);
								try {
									download(nav.msSaveOrOpenBlob ? canvas.msToBlob() : canvas.toDataURL('image/png'), 'png');
								} catch (e) {
									fallbackToExportServer();
								}
							};

						canvas.width = imageWidth;
						canvas.height = imageHeight;
						if (win.canvg) {
							// Use preloaded canvg
							downloadWithCanVG();
						} else {
							// Must load canVG first
							chart.showLoading();
							getScript(Highcharts.getOptions().global.canvasToolsURL, function () {
								chart.hideLoading();
								downloadWithCanVG();
							});
						}
					},
					// No canvas support
					fallbackToExportServer,
					// Failed to load image
					fallbackToExportServer,
					// Finally
					function () {
						try {
							domurl.revokeObjectURL(svgurl);
						} catch (e) {
							// Ignore
						}
					});
				}
			},
			// Success handler, we converted image to base64!
			embeddedSuccess = function (imageURL, callbackArgs) {
				++imagesEmbedded;

				// Change image href in chart copy
				callbackArgs.imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imageURL);

				// Start download when done with the last image
				if (imagesEmbedded === images.length) {
					initiateDownload();
				}
			};

		// Hook into getSVG to get a copy of the chart copy's container
		Highcharts.wrap(Highcharts.Chart.prototype, 'getChartHTML', function (proceed) {
			chartCopyContainer = this.container.cloneNode(true);
			return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
		});

		// Trigger hook to get chart copy
		chart.getSVGForExport(options, chartOptions);
		images = chartCopyContainer.getElementsByTagName('image');

		try {
			// If there are no images to embed, just go ahead and start the download process
			if (!images.length) {
				initiateDownload();
			}

			// Go through the images we want to embed
			for (i = 0, l = images.length; i < l; ++i) {
				el = images[i];
				imageToDataUrl(el.getAttributeNS('http://www.w3.org/1999/xlink', 'href'), { imageElement: el },
					embeddedSuccess,
					// Tainted canvas
					fallbackToExportServer,
					// No canvas support 
					fallbackToExportServer,
					// Failed to load source
					fallbackToExportServer
				);
			}
		} catch (e) {
			fallbackToExportServer();
		}
	};

	// Extend the default options to use the local exporter logic
	Highcharts.getOptions().exporting.buttons.contextButton.menuItems = [{
		textKey: 'printChart',
		onclick: function () {
			this.print();
		}
	}, {
		separator: true
	}, {
		textKey: 'downloadPNG',
		onclick: function () {
			this.exportChartLocal();
		}
	}, {
		textKey: 'downloadSVG',
		onclick: function () {
			this.exportChartLocal({
				type: 'image/svg+xml'
			});
		}
	}];

}));
/*
  Highcharts JS v4.2.3 (2016-02-08)
 Solid angular gauge module

 (c) 2010-2016 Torstein Honsi

 License: www.highcharts.com/license
*/

(function(a){typeof module==="object"&&module.exports?module.exports=a:a(Highcharts)})(function(a){var q=a.getOptions().plotOptions,r=a.pInt,s=a.pick,k=a.each,l;q.solidgauge=a.merge(q.gauge,{colorByPoint:!0});l={initDataClasses:function(b){var e=this,i=this.chart,c,g=0,d=this.options;this.dataClasses=c=[];k(b.dataClasses,function(f,h){var p,f=a.merge(f);c.push(f);if(!f.color)d.dataClassColor==="category"?(p=i.options.colors,f.color=p[g++],g===p.length&&(g=0)):f.color=e.tweenColors(a.Color(d.minColor),
a.Color(d.maxColor),h/(b.dataClasses.length-1))})},initStops:function(b){this.stops=b.stops||[[0,this.options.minColor],[1,this.options.maxColor]];k(this.stops,function(b){b.color=a.Color(b[1])})},toColor:function(b,e){var a,c=this.stops,g,d=this.dataClasses,f,h;if(d)for(h=d.length;h--;){if(f=d[h],g=f.from,c=f.to,(g===void 0||b>=g)&&(c===void 0||b<=c)){a=f.color;if(e)e.dataClass=h;break}}else{this.isLog&&(b=this.val2lin(b));a=1-(this.max-b)/(this.max-this.min);for(h=c.length;h--;)if(a>c[h][0])break;
g=c[h]||c[h+1];c=c[h+1]||g;a=1-(c[0]-a)/(c[0]-g[0]||1);a=this.tweenColors(g.color,c.color,a)}return a},tweenColors:function(b,a,i){var c;!a.rgba.length||!b.rgba.length?b=a.input||"none":(b=b.rgba,a=a.rgba,c=a[3]!==1||b[3]!==1,b=(c?"rgba(":"rgb(")+Math.round(a[0]+(b[0]-a[0])*(1-i))+","+Math.round(a[1]+(b[1]-a[1])*(1-i))+","+Math.round(a[2]+(b[2]-a[2])*(1-i))+(c?","+(a[3]+(b[3]-a[3])*(1-i)):"")+")");return b}};k(["fill","stroke"],function(b){a.Fx.prototype[b+"Setter"]=function(){this.elem.attr(b,l.tweenColors(a.Color(this.start),
a.Color(this.end),this.pos))}});a.seriesTypes.solidgauge=a.extendClass(a.seriesTypes.gauge,{type:"solidgauge",pointAttrToOptions:{},bindAxes:function(){var b;a.seriesTypes.gauge.prototype.bindAxes.call(this);b=this.yAxis;a.extend(b,l);b.options.dataClasses&&b.initDataClasses(b.options);b.initStops(b.options)},drawPoints:function(){var b=this,e=b.yAxis,i=e.center,c=b.options,g=b.chart.renderer,d=c.overshoot,f=d&&typeof d==="number"?d/180*Math.PI:0;a.each(b.points,function(a){var d=a.graphic,j=e.startAngleRad+
e.translate(a.y,null,null,null,!0),k=r(s(a.options.radius,c.radius,100))*i[2]/200,m=r(s(a.options.innerRadius,c.innerRadius,60))*i[2]/200,n=e.toColor(a.y,a),o=Math.min(e.startAngleRad,e.endAngleRad),l=Math.max(e.startAngleRad,e.endAngleRad);n==="none"&&(n=a.color||b.color||"none");if(n!=="none")a.color=n;j=Math.max(o-f,Math.min(l+f,j));c.wrap===!1&&(j=Math.max(o,Math.min(l,j)));o=Math.min(j,e.startAngleRad);j=Math.max(j,e.startAngleRad);j-o>2*Math.PI&&(j=o+2*Math.PI);a.shapeArgs=m={x:i[0],y:i[1],
r:k,innerR:m,start:o,end:j,fill:n};a.startR=k;if(d){if(a=m.d,d.animate(m),a)m.d=a}else d={stroke:c.borderColor||"none","stroke-width":c.borderWidth||0,fill:n,"sweep-flag":0},c.linecap!=="square"&&(d["stroke-linecap"]=d["stroke-linejoin"]="round"),a.graphic=g.arc(m).attr(d).add(b.group)})},animate:function(b){if(!b)this.startAngleRad=this.yAxis.startAngleRad,a.seriesTypes.pie.prototype.animate.call(this,b)}})});
/**
 * @license  Highcharts JS v4.2.3 (2016-02-08)
 * Solid angular gauge module
 *
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */


(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	'use strict';

	var defaultPlotOptions = H.getOptions().plotOptions,
		pInt = H.pInt,
		pick = H.pick,
		each = H.each,
		colorAxisMethods,
		UNDEFINED;

	// The default options
	defaultPlotOptions.solidgauge = H.merge(defaultPlotOptions.gauge, {
		colorByPoint: true
	});


	// These methods are defined in the ColorAxis object, and copied here.
	// If we implement an AMD system we should make ColorAxis a dependency.
	colorAxisMethods = {


		initDataClasses: function (userOptions) {
			var axis = this,
				chart = this.chart,
				dataClasses,
				colorCounter = 0,
				options = this.options;
			this.dataClasses = dataClasses = [];

			each(userOptions.dataClasses, function (dataClass, i) {
				var colors;

				dataClass = H.merge(dataClass);
				dataClasses.push(dataClass);
				if (!dataClass.color) {
					if (options.dataClassColor === 'category') {
						colors = chart.options.colors;
						dataClass.color = colors[colorCounter++];
						// loop back to zero
						if (colorCounter === colors.length) {
							colorCounter = 0;
						}
					} else {
						dataClass.color = axis.tweenColors(H.Color(options.minColor), H.Color(options.maxColor), i / (userOptions.dataClasses.length - 1));
					}
				}
			});
		},

		initStops: function (userOptions) {
			this.stops = userOptions.stops || [
				[0, this.options.minColor],
				[1, this.options.maxColor]
			];
			each(this.stops, function (stop) {
				stop.color = H.Color(stop[1]);
			});
		},
		/** 
		 * Translate from a value to a color
		 */
		toColor: function (value, point) {
			var pos,
				stops = this.stops,
				from,
				to,
				color,
				dataClasses = this.dataClasses,
				dataClass,
				i;

			if (dataClasses) {
				i = dataClasses.length;
				while (i--) {
					dataClass = dataClasses[i];
					from = dataClass.from;
					to = dataClass.to;
					if ((from === UNDEFINED || value >= from) && (to === UNDEFINED || value <= to)) {
						color = dataClass.color;
						if (point) {
							point.dataClass = i;
						}
						break;
					}   
				}

			} else {

				if (this.isLog) {
					value = this.val2lin(value);
				}
				pos = 1 - ((this.max - value) / (this.max - this.min));
				i = stops.length;
				while (i--) {
					if (pos > stops[i][0]) {
						break;
					}
				}
				from = stops[i] || stops[i + 1];
				to = stops[i + 1] || from;

				// The position within the gradient
				pos = 1 - (to[0] - pos) / ((to[0] - from[0]) || 1);
				
				color = this.tweenColors(
					from.color, 
					to.color,
					pos
				);
			}
			return color;
		},
		/*
		 * Return an intermediate color between two colors, according to pos where 0
		 * is the from color and 1 is the to color.
		 */
		tweenColors: function (from, to, pos) {
			// Check for has alpha, because rgba colors perform worse due to lack of
			// support in WebKit.
			var hasAlpha,
				ret;

			// Unsupported color, return to-color (#3920)
			if (!to.rgba.length || !from.rgba.length) {
				ret = to.input || 'none';

			// Interpolate
			} else {
				from = from.rgba;
				to = to.rgba;
				hasAlpha = (to[3] !== 1 || from[3] !== 1);
				ret = (hasAlpha ? 'rgba(' : 'rgb(') + 
					Math.round(to[0] + (from[0] - to[0]) * (1 - pos)) + ',' + 
					Math.round(to[1] + (from[1] - to[1]) * (1 - pos)) + ',' + 
					Math.round(to[2] + (from[2] - to[2]) * (1 - pos)) + 
					(hasAlpha ? (',' + (to[3] + (from[3] - to[3]) * (1 - pos))) : '') + ')';
			}
			return ret;
		}
	};

	/**
	 * Handle animation of the color attributes directly
	 */
	each(['fill', 'stroke'], function (prop) {
		H.Fx.prototype[prop + 'Setter'] = function () {
			this.elem.attr(prop, colorAxisMethods.tweenColors(H.Color(this.start), H.Color(this.end), this.pos));
		};
	});

	// The series prototype
	H.seriesTypes.solidgauge = H.extendClass(H.seriesTypes.gauge, {
		type: 'solidgauge',
		pointAttrToOptions: {}, // #4301, don't inherit line marker's attribs
		bindAxes: function () {
			var axis;
			H.seriesTypes.gauge.prototype.bindAxes.call(this);

			axis = this.yAxis;
			H.extend(axis, colorAxisMethods);

			// Prepare data classes
			if (axis.options.dataClasses) {
				axis.initDataClasses(axis.options);
			}
			axis.initStops(axis.options);
		},

		/**
		 * Draw the points where each point is one needle
		 */
		drawPoints: function () {
			var series = this,
				yAxis = series.yAxis,
				center = yAxis.center,
				options = series.options,
				renderer = series.chart.renderer,
				overshoot = options.overshoot,
				overshootVal = overshoot && typeof overshoot === 'number' ? overshoot / 180 * Math.PI : 0;

			H.each(series.points, function (point) {
				var graphic = point.graphic,
					rotation = yAxis.startAngleRad + yAxis.translate(point.y, null, null, null, true),
					radius = (pInt(pick(point.options.radius, options.radius, 100)) * center[2]) / 200,
					innerRadius = (pInt(pick(point.options.innerRadius, options.innerRadius, 60)) * center[2]) / 200,
					shapeArgs,
					d,
					toColor = yAxis.toColor(point.y, point),
					axisMinAngle = Math.min(yAxis.startAngleRad, yAxis.endAngleRad),
					axisMaxAngle = Math.max(yAxis.startAngleRad, yAxis.endAngleRad),
					minAngle,
					maxAngle,
					attribs;

				if (toColor === 'none') { // #3708
					toColor = point.color || series.color || 'none';
				}
				if (toColor !== 'none') {
					point.color = toColor;
				}

				// Handle overshoot and clipping to axis max/min
				rotation = Math.max(axisMinAngle - overshootVal, Math.min(axisMaxAngle + overshootVal, rotation));

				// Handle the wrap option
				if (options.wrap === false) {
					rotation = Math.max(axisMinAngle, Math.min(axisMaxAngle, rotation));
				}

				minAngle = Math.min(rotation, yAxis.startAngleRad);
				maxAngle = Math.max(rotation, yAxis.startAngleRad);

				if (maxAngle - minAngle > 2 * Math.PI) {
					maxAngle = minAngle + 2 * Math.PI;
				}

				point.shapeArgs = shapeArgs = {
					x: center[0],
					y: center[1],
					r: radius,
					innerR: innerRadius,
					start: minAngle,
					end: maxAngle,
					fill: toColor
				};
				point.startR = radius; // For PieSeries.animate

				if (graphic) {
					d = shapeArgs.d;
					graphic.animate(shapeArgs);
					if (d) {
						shapeArgs.d = d; // animate alters it
					}
				} else {
					attribs = {
						stroke: options.borderColor || 'none',
						'stroke-width': options.borderWidth || 0,
						fill: toColor,
						'sweep-flag': 0
					};
					if (options.linecap !== 'square') {
						attribs['stroke-linecap'] = attribs['stroke-linejoin'] = 'round';
					}
					point.graphic = renderer.arc(shapeArgs)
						.attr(attribs)
						.add(series.group);
				}
			});
		},

		/**
		 * Extend the pie slice animation by animating from start angle and up
		 */
		animate: function (init) {

			if (!init) {
				this.startAngleRad = this.yAxis.startAngleRad;
				H.seriesTypes.pie.prototype.animate.call(this, init);
			}
		}
	});

}));
/*
 Highcharts JS v4.2.3 (2016-02-08)

 (c) 2014 Highsoft AS
 Authors: Jon Arild Nygard / Oystein Moseng

 License: www.highcharts.com/license
*/

(function(f){typeof module==="object"&&module.exports?module.exports=f:f(Highcharts)})(function(f){var j=f.seriesTypes,A=f.map,o=f.merge,t=f.extend,u=f.extendClass,v=f.getOptions().plotOptions,w=function(){},k=f.each,s=f.grep,i=f.pick,m=f.Series,B=f.stableSort,x=f.Color,C=function(a,b,c){var d,c=c||this;for(d in a)a.hasOwnProperty(d)&&b.call(c,a[d],d,a)},y=function(a,b,c,d){d=d||this;a=a||[];k(a,function(e,g){c=b.call(d,c,e,g,a)});return c},r=function(a,b,c){c=c||this;a=b.call(c,a);a!==!1&&r(a,b,
c)};v.treemap=o(v.scatter,{showInLegend:!1,marker:!1,borderColor:"#E0E0E0",borderWidth:1,dataLabels:{enabled:!0,defer:!1,verticalAlign:"middle",formatter:function(){return this.point.name||this.point.id},inside:!0},tooltip:{headerFormat:"",pointFormat:"<b>{point.name}</b>: {point.node.val}</b><br/>"},layoutAlgorithm:"sliceAndDice",layoutStartingDirection:"vertical",alternateStartingDirection:!1,levelIsConstant:!0,states:{hover:{borderColor:"#A0A0A0",brightness:j.heatmap?0:0.1,shadow:!1}},drillUpButton:{position:{align:"right",
x:-10,y:10}}});j.treemap=u(j.scatter,o({pointAttrToOptions:{},pointArrayMap:["value"],axisTypes:j.heatmap?["xAxis","yAxis","colorAxis"]:["xAxis","yAxis"],optionalAxis:"colorAxis",getSymbol:w,parallelArrays:["x","y","value","colorValue"],colorKey:"colorValue",translateColors:j.heatmap&&j.heatmap.prototype.translateColors},{type:"treemap",trackerGroups:["group","dataLabelsGroup"],pointClass:u(f.Point,{setVisible:j.pie.prototype.pointClass.prototype.setVisible}),getListOfParents:function(a,b){var c=
y(a,function(a,c,b){c=i(c.parent,"");a[c]===void 0&&(a[c]=[]);a[c].push(b);return a},{});C(c,function(a,c,g){c!==""&&f.inArray(c,b)===-1&&(k(a,function(a){g[""].push(a)}),delete g[c])});return c},getTree:function(){var a,b=this;a=A(this.data,function(a){return a.id});a=b.getListOfParents(this.data,a);b.nodeMap=[];a=b.buildNode("",-1,0,a,null);r(this.nodeMap[this.rootNode],function(a){var d=!1,e=a.parent;a.visible=!0;if(e||e==="")d=b.nodeMap[e];return d});r(this.nodeMap[this.rootNode].children,function(a){var b=
!1;k(a,function(a){a.visible=!0;a.children.length&&(b=(b||[]).concat(a.children))});return b});this.setTreeValues(a);return a},init:function(a,b){m.prototype.init.call(this,a,b);this.options.allowDrillToNode&&this.drillTo()},buildNode:function(a,b,c,d,e){var g=this,h=[],z=g.points[b],q;k(d[a]||[],function(b){q=g.buildNode(g.points[b].id,b,c+1,d,a);h.push(q)});b={id:a,i:b,children:h,level:c,parent:e,visible:!1};g.nodeMap[b.id]=b;if(z)z.node=b;return b},setTreeValues:function(a){var b=this,c=b.options,
d=0,e=[],g,h=b.points[a.i];k(a.children,function(a){a=b.setTreeValues(a);e.push(a);a.ignore?r(a.children,function(a){var c=!1;k(a,function(a){t(a,{ignore:!0,isLeaf:!1,visible:!1});a.children.length&&(c=(c||[]).concat(a.children))});return c}):d+=a.val});B(e,function(a,c){return a.sortIndex-c.sortIndex});g=i(h&&h.value,d);t(a,{children:e,childrenTotal:d,ignore:!(i(h&&h.visible,!0)&&g>0),isLeaf:a.visible&&!d,levelDynamic:c.levelIsConstant?a.level:a.level-b.nodeMap[b.rootNode].level,name:i(h&&h.name,
""),sortIndex:i(h&&h.sortIndex,-g),val:g});return a},calculateChildrenAreas:function(a,b){var c=this,d=c.options,e=this.levelMap[a.levelDynamic+1],g=i(c[e&&e.layoutAlgorithm]&&e.layoutAlgorithm,d.layoutAlgorithm),h=d.alternateStartingDirection,f=[],d=s(a.children,function(a){return!a.ignore});if(e&&e.layoutStartingDirection)b.direction=e.layoutStartingDirection==="vertical"?0:1;f=c[g](b,d);k(d,function(a,d){var e=f[d];a.values=o(e,{val:a.childrenTotal,direction:h?1-b.direction:b.direction});a.pointValues=
o(e,{x:e.x/c.axisRatio,width:e.width/c.axisRatio});a.children.length&&c.calculateChildrenAreas(a,a.values)})},setPointValues:function(){var a=this.xAxis,b=this.yAxis;k(this.points,function(c){var d=c.node.pointValues,e,g,h;d?(e=Math.round(a.translate(d.x,0,0,0,1)),g=Math.round(a.translate(d.x+d.width,0,0,0,1)),h=Math.round(b.translate(d.y,0,0,0,1)),d=Math.round(b.translate(d.y+d.height,0,0,0,1)),c.shapeType="rect",c.shapeArgs={x:Math.min(e,g),y:Math.min(h,d),width:Math.abs(g-e),height:Math.abs(d-
h)},c.plotX=c.shapeArgs.x+c.shapeArgs.width/2,c.plotY=c.shapeArgs.y+c.shapeArgs.height/2):(delete c.plotX,delete c.plotY)})},setColorRecursive:function(a,b){var c=this,d,e;if(a){d=c.points[a.i];e=c.levelMap[a.levelDynamic];b=i(d&&d.options.color,e&&e.color,b);if(d)d.color=b;a.children.length&&k(a.children,function(a){c.setColorRecursive(a,b)})}},algorithmGroup:function(a,b,c,d){this.height=a;this.width=b;this.plot=d;this.startDirection=this.direction=c;this.lH=this.nH=this.lW=this.nW=this.total=0;
this.elArr=[];this.lP={total:0,lH:0,nH:0,lW:0,nW:0,nR:0,lR:0,aspectRatio:function(a,c){return Math.max(a/c,c/a)}};this.addElement=function(a){this.lP.total=this.elArr[this.elArr.length-1];this.total+=a;this.direction===0?(this.lW=this.nW,this.lP.lH=this.lP.total/this.lW,this.lP.lR=this.lP.aspectRatio(this.lW,this.lP.lH),this.nW=this.total/this.height,this.lP.nH=this.lP.total/this.nW,this.lP.nR=this.lP.aspectRatio(this.nW,this.lP.nH)):(this.lH=this.nH,this.lP.lW=this.lP.total/this.lH,this.lP.lR=this.lP.aspectRatio(this.lP.lW,
this.lH),this.nH=this.total/this.width,this.lP.nW=this.lP.total/this.nH,this.lP.nR=this.lP.aspectRatio(this.lP.nW,this.nH));this.elArr.push(a)};this.reset=function(){this.lW=this.nW=0;this.elArr=[];this.total=0}},algorithmCalcPoints:function(a,b,c,d){var e,g,h,f,q=c.lW,n=c.lH,l=c.plot,i,j=0,p=c.elArr.length-1;b?(q=c.nW,n=c.nH):i=c.elArr[c.elArr.length-1];k(c.elArr,function(a){if(b||j<p)c.direction===0?(e=l.x,g=l.y,h=q,f=a/h):(e=l.x,g=l.y,f=n,h=a/f),d.push({x:e,y:g,width:h,height:f}),c.direction===
0?l.y+=f:l.x+=h;j+=1});c.reset();c.direction===0?c.width-=q:c.height-=n;l.y=l.parent.y+(l.parent.height-c.height);l.x=l.parent.x+(l.parent.width-c.width);if(a)c.direction=1-c.direction;b||c.addElement(i)},algorithmLowAspectRatio:function(a,b,c){var d=[],e=this,g,f={x:b.x,y:b.y,parent:b},i=0,j=c.length-1,n=new this.algorithmGroup(b.height,b.width,b.direction,f);k(c,function(c){g=b.width*b.height*(c.val/b.val);n.addElement(g);n.lP.nR>n.lP.lR&&e.algorithmCalcPoints(a,!1,n,d,f);i===j&&e.algorithmCalcPoints(a,
!0,n,d,f);i+=1});return d},algorithmFill:function(a,b,c){var d=[],e,f=b.direction,h=b.x,i=b.y,j=b.width,n=b.height,l,o,m,p;k(c,function(c){e=b.width*b.height*(c.val/b.val);l=h;o=i;f===0?(p=n,m=e/p,j-=m,h+=m):(m=j,p=e/m,n-=p,i+=p);d.push({x:l,y:o,width:m,height:p});a&&(f=1-f)});return d},strip:function(a,b){return this.algorithmLowAspectRatio(!1,a,b)},squarified:function(a,b){return this.algorithmLowAspectRatio(!0,a,b)},sliceAndDice:function(a,b){return this.algorithmFill(!0,a,b)},stripes:function(a,
b){return this.algorithmFill(!1,a,b)},translate:function(){var a,b;m.prototype.translate.call(this);this.rootNode=i(this.options.rootId,"");this.levelMap=y(this.options.levels,function(a,b){a[b.level]=b;return a},{});b=this.tree=this.getTree();this.axisRatio=this.xAxis.len/this.yAxis.len;this.nodeMap[""].pointValues=a={x:0,y:0,width:100,height:100};this.nodeMap[""].values=a=o(a,{width:a.width*this.axisRatio,direction:this.options.layoutStartingDirection==="vertical"?0:1,val:b.val});this.calculateChildrenAreas(b,
a);this.colorAxis?this.translateColors():this.options.colorByPoint||this.setColorRecursive(this.tree,void 0);b=this.nodeMap[this.rootNode].pointValues;this.xAxis.setExtremes(b.x,b.x+b.width,!1);this.yAxis.setExtremes(b.y,b.y+b.height,!1);this.xAxis.setScale();this.yAxis.setScale();this.setPointValues()},drawDataLabels:function(){var a=this,b=s(a.points,function(a){return a.node.visible}),c,d;k(b,function(b){d=a.levelMap[b.node.levelDynamic];c={style:{}};if(!b.node.isLeaf)c.enabled=!1;if(d&&d.dataLabels)c=
o(c,d.dataLabels),a._hasPointLabels=!0;if(b.shapeArgs)c.style.width=b.shapeArgs.width;b.dlOptions=o(c,b.options.dataLabels)});m.prototype.drawDataLabels.call(this)},alignDataLabel:j.column.prototype.alignDataLabel,pointAttribs:function(a,b){var c=this.levelMap[a.node.levelDynamic]||{},d=this.options,e=b&&d.states[b]||{},c={stroke:a.borderColor||c.borderColor||e.borderColor||d.borderColor,"stroke-width":i(a.borderWidth,c.borderWidth,e.borderWidth,d.borderWidth),dashstyle:a.borderDashStyle||c.borderDashStyle||
e.borderDashStyle||d.borderDashStyle,fill:a.color||this.color,zIndex:b==="hover"?1:0};if(a.node.level<=this.nodeMap[this.rootNode].level)c.fill="none",c["stroke-width"]=0;else if(a.node.isLeaf){if(b)c.fill=x(c.fill).brighten(e.brightness).get()}else c.fill=i(d.interactByLeaf,!d.allowDrillToNode)?"none":x(c.fill).setOpacity(b==="hover"?0.75:0.15).get();return c},drawPoints:function(){var a=this,b=s(a.points,function(a){return a.node.visible});k(b,function(c){var b="levelGroup-"+c.node.levelDynamic;
a[b]||(a[b]=a.chart.renderer.g(b).attr({zIndex:1E3-c.node.levelDynamic}).add(a.group));c.group=a[b];c.pointAttr={"":a.pointAttribs(c),hover:a.pointAttribs(c,"hover"),select:{}}});j.column.prototype.drawPoints.call(this);a.options.allowDrillToNode&&k(b,function(b){var d;if(b.graphic)d=b.drillId=a.options.interactByLeaf?a.drillToByLeaf(b):a.drillToByGroup(b),b.graphic.css({cursor:d?"pointer":"default"})})},drillTo:function(){var a=this;f.addEvent(a,"click",function(b){var b=b.point,c=b.drillId,d;c&&
(d=a.nodeMap[a.rootNode].name||a.rootNode,b.setState(""),a.drillToNode(c),a.showDrillUpButton(d))})},drillToByGroup:function(a){var b=!1;if(a.node.level-this.nodeMap[this.rootNode].level===1&&!a.node.isLeaf)b=a.id;return b},drillToByLeaf:function(a){var b=!1;if(a.node.parent!==this.rootNode&&a.node.isLeaf)for(a=a.node;!b;)if(a=this.nodeMap[a.parent],a.parent===this.rootNode)b=a.id;return b},drillUp:function(){var a=null;this.rootNode&&(a=this.nodeMap[this.rootNode],a=a.parent!==null?this.nodeMap[a.parent]:
this.nodeMap[""]);if(a!==null)this.drillToNode(a.id),a.id===""?this.drillUpButton=this.drillUpButton.destroy():(a=this.nodeMap[a.parent],this.showDrillUpButton(a.name||a.id))},drillToNode:function(a){this.options.rootId=a;this.isDirty=!0;this.chart.redraw()},showDrillUpButton:function(a){var b=this,a=a||"< Back",c=b.options.drillUpButton,d,e;if(c.text)a=c.text;this.drillUpButton?this.drillUpButton.attr({text:a}).align():(e=(d=c.theme)&&d.states,this.drillUpButton=this.chart.renderer.button(a,null,
null,function(){b.drillUp()},d,e&&e.hover,e&&e.select).attr({align:c.position.align,zIndex:9}).add().align(c.position,!1,c.relativeTo||"plotBox"))},buildKDTree:w,drawLegendSymbol:f.LegendSymbolMixin.drawRectangle,getExtremes:function(){m.prototype.getExtremes.call(this,this.colorValueData);this.valueMin=this.dataMin;this.valueMax=this.dataMax;m.prototype.getExtremes.call(this)},getExtremesFromAll:!0,bindAxes:function(){var a={endOnTick:!1,gridLineWidth:0,lineWidth:0,min:0,dataMin:0,minPadding:0,max:100,
dataMax:100,maxPadding:0,startOnTick:!1,title:null,tickPositions:[]};m.prototype.bindAxes.call(this);f.extend(this.yAxis.options,a);f.extend(this.xAxis.options,a)}}))});
/**
 * @license Highcharts JS v4.2.3 (2016-02-08)
 *
 * (c) 2014 Highsoft AS
 * Authors: Jon Arild Nygard / Oystein Moseng
 *
 * License: www.highcharts.com/license
 */


(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {
	var seriesTypes = H.seriesTypes,
		map = H.map,
		merge = H.merge,
		extend = H.extend,
		extendClass = H.extendClass,
		defaultOptions = H.getOptions(),
		plotOptions = defaultOptions.plotOptions,
		noop = function () {
		},
		each = H.each,
		grep = H.grep,
		pick = H.pick,
		Series = H.Series,
		stableSort = H.stableSort,
		Color = H.Color,
		eachObject = function (list, func, context) {
			var key;
			context = context || this;
			for (key in list) {
				if (list.hasOwnProperty(key)) {
					func.call(context, list[key], key, list);
				}
			}
		},
		reduce = function (arr, func, previous, context) {
			context = context || this;
			arr = arr || []; // @note should each be able to handle empty values automatically?
			each(arr, function (current, i) {
				previous = func.call(context, previous, current, i, arr);
			});
			return previous;
		},
		// @todo find correct name for this function. 
		recursive = function (item, func, context) {
			var next;
			context = context || this;
			next = func.call(context, item);
			if (next !== false) {
				recursive(next, func, context);
			}
		};

	// Define default options
	plotOptions.treemap = merge(plotOptions.scatter, {
		showInLegend: false,
		marker: false,
		borderColor: '#E0E0E0',
		borderWidth: 1,
		dataLabels: {
			enabled: true,
			defer: false,
			verticalAlign: 'middle',
			formatter: function () { // #2945
				return this.point.name || this.point.id;
			},
			inside: true
		},
		tooltip: {
			headerFormat: '',
			pointFormat: '<b>{point.name}</b>: {point.node.val}</b><br/>'
		},
		layoutAlgorithm: 'sliceAndDice',
		layoutStartingDirection: 'vertical',
		alternateStartingDirection: false,
		levelIsConstant: true,
		states: {
			hover: {
				borderColor: '#A0A0A0',
				brightness: seriesTypes.heatmap ? 0 : 0.1,
				shadow: false
			}
		},
		drillUpButton: {
			position: { 
				align: 'right',
				x: -10,
				y: 10
			}
		}
	});
	
	// Stolen from heatmap	
	var colorSeriesMixin = {
		// mapping between SVG attributes and the corresponding options
		pointAttrToOptions: {},
		pointArrayMap: ['value'],
		axisTypes: seriesTypes.heatmap ? ['xAxis', 'yAxis', 'colorAxis'] : ['xAxis', 'yAxis'],
		optionalAxis: 'colorAxis',
		getSymbol: noop,
		parallelArrays: ['x', 'y', 'value', 'colorValue'],
		colorKey: 'colorValue', // Point color option key
		translateColors: seriesTypes.heatmap && seriesTypes.heatmap.prototype.translateColors
	};

	// The Treemap series type
	seriesTypes.treemap = extendClass(seriesTypes.scatter, merge(colorSeriesMixin, {
		type: 'treemap',
		trackerGroups: ['group', 'dataLabelsGroup'],
		pointClass: extendClass(H.Point, {
			setVisible: seriesTypes.pie.prototype.pointClass.prototype.setVisible
		}),
		/**
		 * Creates an object map from parent id to childrens index.
		 * @param {Array} data List of points set in options.
		 * @param {string} data[].parent Parent id of point.
		 * @param {Array} ids List of all point ids.
		 * @return {Object} Map from parent id to children index in data.
		 */
		getListOfParents: function (data, ids) {
			var listOfParents = reduce(data, function (prev, curr, i) {
				var parent = pick(curr.parent, '');
				if (prev[parent] === undefined) {
					prev[parent] = [];
				}
				prev[parent].push(i);
				return prev;
			}, {});

			// If parent does not exist, hoist parent to root of tree.
			eachObject(listOfParents, function (children, parent, list) {
				if ((parent !== '') && (H.inArray(parent, ids) === -1)) {
					each(children, function (child) {
						list[''].push(child);
					});
					delete list[parent];
				}
			});
			return listOfParents;
		},
		/**
		* Creates a tree structured object from the series points
		*/
		getTree: function () {
			var tree,
				series = this,
				allIds = map(this.data, function (d) {
					return d.id;
				}),
				parentList = series.getListOfParents(this.data, allIds);

			series.nodeMap = [];
			tree = series.buildNode('', -1, 0, parentList, null);
			recursive(this.nodeMap[this.rootNode], function (node) {
				var next = false,
					p = node.parent;
				node.visible = true;
				if (p || p === '') {
					next = series.nodeMap[p];
				}
				return next;
			});
			recursive(this.nodeMap[this.rootNode].children, function (children) {
				var next = false;
				each(children, function (child) {
					child.visible = true;
					if (child.children.length) {
						next = (next || []).concat(child.children);
					}
				});
				return next;
			});
			this.setTreeValues(tree);
			return tree;
		},
		init: function (chart, options) {
			var series = this;
			Series.prototype.init.call(series, chart, options);
			if (series.options.allowDrillToNode) {
				series.drillTo();
			}
		},
		buildNode: function (id, i, level, list, parent) {
			var series = this,
				children = [],
				point = series.points[i],
				node,
				child;

			// Actions
			each((list[id] || []), function (i) {
				child = series.buildNode(series.points[i].id, i, (level + 1), list, id);
				children.push(child);
			});
			node = {
				id: id,
				i: i,
				children: children,
				level: level,
				parent: parent,
				visible: false // @todo move this to better location
			};
			series.nodeMap[node.id] = node;
			if (point) {
				point.node = node;
			}
			return node;
		},
		setTreeValues: function (tree) {
			var series = this,
				options = series.options,
				childrenTotal = 0,
				children = [],
				val,
				point = series.points[tree.i];

			// First give the children some values
			each(tree.children, function (child) {
				child = series.setTreeValues(child);
				children.push(child);

				if (!child.ignore) {
					childrenTotal += child.val;
				} else {
					// @todo Add predicate to avoid looping already ignored children
					recursive(child.children, function (children) {
						var next = false;
						each(children, function (node) {
							extend(node, {
								ignore: true,
								isLeaf: false,
								visible: false
							});
							if (node.children.length) {
								next = (next || []).concat(node.children);
							}
						});
						return next;
					});
				}
			});
			// Sort the children
			stableSort(children, function (a, b) {
				return a.sortIndex - b.sortIndex;
			});
			// Set the values
			val = pick(point && point.value, childrenTotal);
			extend(tree, {
				children: children,
				childrenTotal: childrenTotal,
				// Ignore this node if point is not visible
				ignore: !(pick(point && point.visible, true) && (val > 0)),
				isLeaf: tree.visible && !childrenTotal,
				levelDynamic: (options.levelIsConstant ? tree.level : (tree.level - series.nodeMap[series.rootNode].level)),
				name: pick(point && point.name, ''),
				sortIndex: pick(point && point.sortIndex, -val),
				val: val
			});
			return tree;
		},
		/**
		 * Recursive function which calculates the area for all children of a node.
		 * @param {Object} node The node which is parent to the children.
		 * @param {Object} area The rectangular area of the parent.
		 */
		calculateChildrenAreas: function (parent, area) {
			var series = this,
				options = series.options,
				level = this.levelMap[parent.levelDynamic + 1],
				algorithm = pick((series[level && level.layoutAlgorithm] && level.layoutAlgorithm), options.layoutAlgorithm),
				alternate = options.alternateStartingDirection,
				childrenValues = [],
				children;

			// Collect all children which should be included
			children = grep(parent.children, function (n) {
				return !n.ignore;
			});

			if (level && level.layoutStartingDirection) {
				area.direction = level.layoutStartingDirection === 'vertical' ? 0 : 1;
			}
			childrenValues = series[algorithm](area, children);
			each(children, function (child, index) {
				var values = childrenValues[index];
				child.values = merge(values, {
					val: child.childrenTotal,
					direction: (alternate ? 1 - area.direction : area.direction)
				});
				child.pointValues = merge(values, {
					x: (values.x / series.axisRatio),
					width: (values.width / series.axisRatio) 
				});
				// If node has children, then call method recursively
				if (child.children.length) {
					series.calculateChildrenAreas(child, child.values);
				}
			});
		},
		setPointValues: function () {
			var series = this,
				xAxis = series.xAxis,
				yAxis = series.yAxis;
			each(series.points, function (point) {
				var node = point.node,
					values = node.pointValues,
					x1,
					x2,
					y1,
					y2;
				// Points which is ignored, have no values.
				if (values) {
					x1 = Math.round(xAxis.translate(values.x, 0, 0, 0, 1));
					x2 = Math.round(xAxis.translate(values.x + values.width, 0, 0, 0, 1));
					y1 = Math.round(yAxis.translate(values.y, 0, 0, 0, 1));
					y2 = Math.round(yAxis.translate(values.y + values.height, 0, 0, 0, 1));
					// Set point values
					point.shapeType = 'rect';
					point.shapeArgs = {
						x: Math.min(x1, x2),
						y: Math.min(y1, y2),
						width: Math.abs(x2 - x1),
						height: Math.abs(y2 - y1)
					};
					point.plotX = point.shapeArgs.x + (point.shapeArgs.width / 2);
					point.plotY = point.shapeArgs.y + (point.shapeArgs.height / 2);
				} else {
					// Reset visibility
					delete point.plotX;
					delete point.plotY;
				}
			});
		},
		setColorRecursive: function (node, color) {
			var series = this,
				point,
				level;
			if (node) {
				point = series.points[node.i];
				level = series.levelMap[node.levelDynamic];
				// Select either point color, level color or inherited color.
				color = pick(point && point.options.color, level && level.color, color);
				if (point) {
					point.color = color;
				}
				// Do it all again with the children	
				if (node.children.length) {
					each(node.children, function (child) {
						series.setColorRecursive(child, color);
					});
				}
			}
		},
		algorithmGroup: function (h, w, d, p) {
			this.height = h;
			this.width = w;
			this.plot = p;
			this.direction = d;
			this.startDirection = d;
			this.total = 0;
			this.nW = 0;
			this.lW = 0;
			this.nH = 0;
			this.lH = 0;
			this.elArr = [];
			this.lP = {
				total: 0,
				lH: 0,
				nH: 0,
				lW: 0,
				nW: 0,
				nR: 0,
				lR: 0,
				aspectRatio: function (w, h) {
					return Math.max((w / h), (h / w));
				}
			};
			this.addElement = function (el) {
				this.lP.total = this.elArr[this.elArr.length - 1];
				this.total = this.total + el;
				if (this.direction === 0) {
					// Calculate last point old aspect ratio
					this.lW = this.nW;
					this.lP.lH = this.lP.total / this.lW;
					this.lP.lR = this.lP.aspectRatio(this.lW, this.lP.lH);
					// Calculate last point new aspect ratio
					this.nW = this.total / this.height;
					this.lP.nH = this.lP.total / this.nW;
					this.lP.nR = this.lP.aspectRatio(this.nW, this.lP.nH);
				} else {
					// Calculate last point old aspect ratio
					this.lH = this.nH;
					this.lP.lW = this.lP.total / this.lH;
					this.lP.lR = this.lP.aspectRatio(this.lP.lW, this.lH);
					// Calculate last point new aspect ratio
					this.nH = this.total / this.width;
					this.lP.nW = this.lP.total / this.nH;
					this.lP.nR = this.lP.aspectRatio(this.lP.nW, this.nH);
				}
				this.elArr.push(el);						
			};
			this.reset = function () {
				this.nW = 0;
				this.lW = 0;
				this.elArr = [];
				this.total = 0;
			};
		},
		algorithmCalcPoints: function (directionChange, last, group, childrenArea) {
			var pX,
				pY,
				pW,
				pH,
				gW = group.lW,
				gH = group.lH,
				plot = group.plot,
				keep,
				i = 0,
				end = group.elArr.length - 1;
			if (last) {
				gW = group.nW;
				gH = group.nH;
			} else {
				keep = group.elArr[group.elArr.length - 1];
			}
			each(group.elArr, function (p) {
				if (last || (i < end)) {
					if (group.direction === 0) {
						pX = plot.x;
						pY = plot.y; 
						pW = gW;
						pH = p / pW;
					} else {
						pX = plot.x;
						pY = plot.y;
						pH = gH;
						pW = p / pH;
					}
					childrenArea.push({
						x: pX,
						y: pY,
						width: pW,
						height: pH
					});
					if (group.direction === 0) {
						plot.y = plot.y + pH;
					} else {
						plot.x = plot.x + pW;
					}						
				}
				i = i + 1;
			});
			// Reset variables
			group.reset();
			if (group.direction === 0) {
				group.width = group.width - gW;
			} else {
				group.height = group.height - gH;
			}
			plot.y = plot.parent.y + (plot.parent.height - group.height);
			plot.x = plot.parent.x + (plot.parent.width - group.width);
			if (directionChange) {
				group.direction = 1 - group.direction;
			}
			// If not last, then add uncalculated element
			if (!last) {
				group.addElement(keep);
			}
		},
		algorithmLowAspectRatio: function (directionChange, parent, children) {
			var childrenArea = [],
				series = this,
				pTot,
				plot = {
					x: parent.x,
					y: parent.y,
					parent: parent
				},
				direction = parent.direction,
				i = 0,
				end = children.length - 1,
				group = new this.algorithmGroup(parent.height, parent.width, direction, plot);
			// Loop through and calculate all areas
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				group.addElement(pTot);
				if (group.lP.nR > group.lP.lR) {
					series.algorithmCalcPoints(directionChange, false, group, childrenArea, plot);
				}
				// If last child, then calculate all remaining areas
				if (i === end) {
					series.algorithmCalcPoints(directionChange, true, group, childrenArea, plot);
				}
				i = i + 1;
			});
			return childrenArea;
		},
		algorithmFill: function (directionChange, parent, children) {
			var childrenArea = [],
				pTot,
				direction = parent.direction,
				x = parent.x,
				y = parent.y,
				width = parent.width,
				height = parent.height,
				pX,
				pY,
				pW,
				pH;
			each(children, function (child) {
				pTot = (parent.width * parent.height) * (child.val / parent.val);
				pX = x;
				pY = y;
				if (direction === 0) {
					pH = height;
					pW = pTot / pH;
					width = width - pW;
					x = x + pW;
				} else {
					pW = width;
					pH = pTot / pW;
					height = height - pH;
					y = y + pH;
				}
				childrenArea.push({
					x: pX,
					y: pY,
					width: pW,
					height: pH
				});
				if (directionChange) {
					direction = 1 - direction;
				}
			});
			return childrenArea;
		},
		strip: function (parent, children) {
			return this.algorithmLowAspectRatio(false, parent, children);
		},
		squarified: function (parent, children) {
			return this.algorithmLowAspectRatio(true, parent, children);
		},
		sliceAndDice: function (parent, children) {
			return this.algorithmFill(true, parent, children);
		},
		stripes: function (parent, children) {
			return this.algorithmFill(false, parent, children);
		},
		translate: function () {
			var pointValues,
				seriesArea,
				tree,
				val;

			// Call prototype function
			Series.prototype.translate.call(this);

			// Assign variables
			this.rootNode = pick(this.options.rootId, '');
			// Create a object map from level to options
			this.levelMap = reduce(this.options.levels, function (arr, item) {
				arr[item.level] = item;
				return arr;
			}, {});
			tree = this.tree = this.getTree(); // @todo Only if series.isDirtyData is true

			// Calculate plotting values.
			this.axisRatio = (this.xAxis.len / this.yAxis.len);
			this.nodeMap[''].pointValues = pointValues = { x: 0, y: 0, width: 100, height: 100 };
			this.nodeMap[''].values = seriesArea = merge(pointValues, {
				width: (pointValues.width * this.axisRatio),
				direction: (this.options.layoutStartingDirection === 'vertical' ? 0 : 1),
				val: tree.val
			});
			this.calculateChildrenAreas(tree, seriesArea);

			// Logic for point colors
			if (this.colorAxis) {
				this.translateColors();
			} else if (!this.options.colorByPoint) {
				this.setColorRecursive(this.tree, undefined);
			}

			// Update axis extremes according to the root node.
			val = this.nodeMap[this.rootNode].pointValues;
			this.xAxis.setExtremes(val.x, val.x + val.width, false);
			this.yAxis.setExtremes(val.y, val.y + val.height, false);
			this.xAxis.setScale();
			this.yAxis.setScale();

			// Assign values to points.
			this.setPointValues();
		},
		/**
		 * Extend drawDataLabels with logic to handle custom options related to the treemap series:
		 * - Points which is not a leaf node, has dataLabels disabled by default.
		 * - Options set on series.levels is merged in.
		 * - Width of the dataLabel is set to match the width of the point shape.
		 */
		drawDataLabels: function () {
			var series = this,
				points = grep(series.points, function (n) {
					return n.node.visible;
				}),
				options,
				level;
			each(points, function (point) {
				level = series.levelMap[point.node.levelDynamic];
				// Set options to new object to avoid problems with scope
				options = { style: {} };

				// If not a leaf, then label should be disabled as default
				if (!point.node.isLeaf) {
					options.enabled = false;
				}

				// If options for level exists, include them as well
				if (level && level.dataLabels) {
					options = merge(options, level.dataLabels);
					series._hasPointLabels = true;
				}

				// Set dataLabel width to the width of the point shape.
				if (point.shapeArgs) {
					options.style.width = point.shapeArgs.width;
				}

				// Merge custom options with point options
				point.dlOptions = merge(options, point.options.dataLabels);
			});
			Series.prototype.drawDataLabels.call(this);
		},
		alignDataLabel: seriesTypes.column.prototype.alignDataLabel,

		/**
		 * Get presentational attributes
		 */
		pointAttribs: function (point, state) {
			var level = this.levelMap[point.node.levelDynamic] || {},
				options = this.options,
				attr,
				stateOptions = (state && options.states[state]) || {};

			// Set attributes by precedence. Point trumps level trumps series. Stroke width uses pick
			// because it can be 0.
			attr = {
				'stroke': point.borderColor || level.borderColor || stateOptions.borderColor || options.borderColor,
				'stroke-width': pick(point.borderWidth, level.borderWidth, stateOptions.borderWidth, options.borderWidth),
				'dashstyle': point.borderDashStyle || level.borderDashStyle || stateOptions.borderDashStyle || options.borderDashStyle,
				'fill': point.color || this.color,
				'zIndex': state === 'hover' ? 1 : 0
			};

			if (point.node.level <= this.nodeMap[this.rootNode].level) {
				// Hide levels above the current view
				attr.fill = 'none';
				attr['stroke-width'] = 0;
			} else if (!point.node.isLeaf) {
				// If not a leaf, then remove fill
				// @todo let users set the opacity
				attr.fill = pick(options.interactByLeaf, !options.allowDrillToNode) ? 'none' : Color(attr.fill).setOpacity(state === 'hover' ? 0.75 : 0.15).get();
			} else if (state) {
				// Brighten and hoist the hover nodes
				attr.fill = Color(attr.fill).brighten(stateOptions.brightness).get();
			}

			return attr;
		},

		/**
		* Extending ColumnSeries drawPoints
		*/
		drawPoints: function () {
			var series = this,
				points = grep(series.points, function (n) {
					return n.node.visible;
				});

			each(points, function (point) {
				var groupKey = 'levelGroup-' + point.node.levelDynamic;
				if (!series[groupKey]) {
					series[groupKey] = series.chart.renderer.g(groupKey)
						.attr({
							zIndex: 1000 - point.node.levelDynamic // @todo Set the zIndex based upon the number of levels, instead of using 1000
						})
						.add(series.group);
				}
				point.group = series[groupKey];
				// Preliminary code in prepraration for HC5 that uses pointAttribs for all series
				point.pointAttr = {
					'': series.pointAttribs(point),
					'hover': series.pointAttribs(point, 'hover'),
					'select': {}
				};
			});
			// Call standard drawPoints
			seriesTypes.column.prototype.drawPoints.call(this);

			// If drillToNode is allowed, set a point cursor on clickables & add drillId to point 
			if (series.options.allowDrillToNode) {
				each(points, function (point) {
					var cursor,
						drillId;
					if (point.graphic) {
						drillId = point.drillId = series.options.interactByLeaf ? series.drillToByLeaf(point) : series.drillToByGroup(point);
						cursor = drillId ? 'pointer' : 'default';
						point.graphic.css({ cursor: cursor });
					}
				});
			}
		},
		/**
		* Add drilling on the suitable points
		*/
		drillTo: function () {
			var series = this;
			H.addEvent(series, 'click', function (event) {
				var point = event.point,
					drillId = point.drillId,
					drillName;
				// If a drill id is returned, add click event and cursor. 
				if (drillId) {
					drillName = series.nodeMap[series.rootNode].name || series.rootNode;
					point.setState(''); // Remove hover
					series.drillToNode(drillId);
					series.showDrillUpButton(drillName);
				}
			});
		},
		/**
		* Finds the drill id for a parent node.
		* Returns false if point should not have a click event
		* @param {Object} point
		* @return {string || boolean} Drill to id or false when point should not have a click event
		*/
		drillToByGroup: function (point) {
			var series = this,
				drillId = false;
			if ((point.node.level - series.nodeMap[series.rootNode].level) === 1 && !point.node.isLeaf) {
				drillId = point.id;
			}
			return drillId;
		},
		/**
		* Finds the drill id for a leaf node.
		* Returns false if point should not have a click event
		* @param {Object} point
		* @return {string || boolean} Drill to id or false when point should not have a click event
		*/
		drillToByLeaf: function (point) {
			var series = this,
				drillId = false,
				nodeParent;
			if ((point.node.parent !== series.rootNode) && (point.node.isLeaf)) {
				nodeParent = point.node;
				while (!drillId) {
					nodeParent = series.nodeMap[nodeParent.parent];
					if (nodeParent.parent === series.rootNode) {
						drillId = nodeParent.id;
					}
				}
			}
			return drillId;
		},
		drillUp: function () {
			var drillPoint = null,
				node,
				parent;
			if (this.rootNode) {
				node = this.nodeMap[this.rootNode];
				if (node.parent !== null) {
					drillPoint = this.nodeMap[node.parent];
				} else {
					drillPoint = this.nodeMap[''];
				}
			}

			if (drillPoint !== null) {
				this.drillToNode(drillPoint.id);
				if (drillPoint.id === '') {
					this.drillUpButton = this.drillUpButton.destroy();
				} else {
					parent = this.nodeMap[drillPoint.parent];
					this.showDrillUpButton((parent.name || parent.id));
				}
			} 
		},
		drillToNode: function (id) {
			this.options.rootId = id;
			this.isDirty = true; // Force redraw
			this.chart.redraw();
		},
		showDrillUpButton: function (name) {
			var series = this,
				backText = (name || '< Back'),
				buttonOptions = series.options.drillUpButton,
				attr,
				states;

			if (buttonOptions.text) {
				backText = buttonOptions.text;
			}
			if (!this.drillUpButton) {
				attr = buttonOptions.theme;
				states = attr && attr.states;
							
				this.drillUpButton = this.chart.renderer.button(
					backText,
					null,
					null,
					function () {
						series.drillUp(); 
					},
					attr, 
					states && states.hover,
					states && states.select
				)
				.attr({
					align: buttonOptions.position.align,
					zIndex: 9
				})
				.add()
				.align(buttonOptions.position, false, buttonOptions.relativeTo || 'plotBox');
			} else {
				this.drillUpButton.attr({
					text: backText
				})
				.align();
			}
		},
		buildKDTree: noop,
		drawLegendSymbol: H.LegendSymbolMixin.drawRectangle,
		getExtremes: function () {
			// Get the extremes from the value data
			Series.prototype.getExtremes.call(this, this.colorValueData);
			this.valueMin = this.dataMin;
			this.valueMax = this.dataMax;

			// Get the extremes from the y data
			Series.prototype.getExtremes.call(this);
		},
		getExtremesFromAll: true,
		bindAxes: function () {
			var treeAxis = {
				endOnTick: false,
				gridLineWidth: 0,
				lineWidth: 0,
				min: 0,
				dataMin: 0,
				minPadding: 0,
				max: 100,
				dataMax: 100,
				maxPadding: 0,
				startOnTick: false,
				title: null,
				tickPositions: []
			};
			Series.prototype.bindAxes.call(this);
			H.extend(this.yAxis.options, treeAxis);
			H.extend(this.xAxis.options, treeAxis);
		}
	}));
}));
$(document).ready(function(){


	$( "a.toggle-nav" ).click(function() {
        $( "html" ).toggleClass( "screen-md" );
        $( "html" ).toggleClass( "menu-toggled" );
        //fixes the odd chart not resizing on menu toggle bug
        $(".chart").each(function () {
            var highChart = Highcharts.charts[$(this).data('highchartsChart')];
            var highChartCont = $(highChart.container).parent();
            highChart.setSize(highChartCont.width(), highChartCont.height());
            highChart.hasUserSize = undefined;
        });

    });

});


$(document).ready(function(e) {
    breakpointDetect();
});

$(window).resize(function(e) {
    breakpointDetect();
});


function breakpointDetect(){

    if(!$( "html" ).hasClass( "menu-toggled" )){

        if($(window).width() < 990){
           $( "html" ).addClass( "screen-md" );
        } else {
           $( "html" ).removeClass( "screen-md" );
        }
    }

}





;
