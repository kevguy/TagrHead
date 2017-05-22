function _$ (selector, context) {
  return (typeof selector === 'string') ? (context || document).querySelector(selector) : selector
}

function _$$ (selectors, context) {
  return (typeof selectors === 'string') ? (context || document).querySelectorAll(selectors) : [selectors]
}

function _hasClass (className, element) {
  return new RegExp('(^|\\s+)' + className + '(\\s+|$)').test(element.className)
}

function _addClass (className, element) {
  if (!_hasClass(className, element)) {
    element.className += (element.className === '') ? className : ' ' + className
    return element.className
  }
  return undefined
}

function _removeClass (className, element) {
  element.className = element.className.replace(new RegExp('(^|\\s+)' + className + '(\\s+|$)'), '')
}
/*
function _toggleClass(className, element) {
  ( ! _hasClass(className, element)) ? _addClass(className, element) : _removeClass(className, element);
}
*/

function _oneListener (element, type, fn, capture) {
  capture = capture || false
  element.addEventListener(type, function handler (e) {
    fn.call(this, e)
    element.removeEventListener(e.type, handler, capture)
  }, capture)
}

function _create (tag, attr) {
  let element = document.createElement(tag)

  if (attr) {
    for (let name in attr) {
      if (element[name] !== undefined) {
        element[name] = attr[name]
      }
    }
  }
  return element
}

export default class Tags {
  constructor (containerId, inputId, config) {
    if (config.wrap === false) {
      this.wrap = config.wrap
    } else {
      this.wrap = true
    }

    if (config.manual === false) {
      this.manual = false
    } else {
      this.manual = true
    }

    if (config.style === 'mdl') {
      this.createTag = this.createMdlTag
    } else if (config.style === 'bootstrap-material-design') {
      this.createTag = this.createBootstrapMdTag
    } else {
      this.createTag = this.createBasicTag
    }

    this.containerId = containerId
    this.tagsArr = []
    this.KEYS = {
      ENTER: 13,
      COMMA: 188,
      BACK: 8
    }
    this.transitionEnd = this.whichTransitionEnd()
    this.pressed = false
    this.timer = undefined

    this.container = _$(containerId)

    if (this.wrap) {
      _addClass('tagrhead-tags-container', this.container)
      this.tagsContainer = this.container
    } else {
      this.tagsContainer = _create('div', {
        id: 'tagrhead-tags-container',
        className: 'tagrhead-tags-container'
      })

      this.container.appendChild(this.tagsContainer)
    }

    this.textbox = _$(inputId)

    this.tagsContainer.addEventListener('click', this.removeBtnHandler.bind(this), false)
    this.textbox.addEventListener('keydown', this.keyHandler.bind(this), false)
    this.textbox.addEventListener('keyup', this.backHandler.bind(this), false)
  }

  // handlers
  removeBtnHandler (event) {
    event.preventDefault()
    if (event.target.classList.contains('tagrhead-tag__remove')) {
      let tag = event.target.parentNode

      while (!tag.classList.contains('tagrhead-tag')) {
        tag = tag.parentNode
      }
      let tagValueNode = _$('.tagrhead-tag__value', tag)

      this.tagsContainer.removeChild(tag)
      let index = -1

      this.tagsArr.forEach((item, idx, arr) => {
        if (item.value === tagValueNode.getAttribute('data-value')) {
          index = idx
        }
      })
      this.tagsArr.splice(index, 1)
    }
    this.textbox.focus()
  }

  backHandler (event) {
    this.isPressed = false
  }

  keyHandler (event) {
    if (event.target.tagName === 'INPUT') {
      let target = event.target
      let keyCode = event.which || event.keyCode

      if (keyCode !== this.KEYS.BACK) {
        let tags = _$$('.tagrhead-tag__marked', this.tagsContainer)

        if (tags.length > 0) {
          [...tags].forEach((tag) => {
            _removeClass('tagrhead-tag__marked', tag)
          })
        }
      }

      let newTagValue = target.value.trim()

      if (keyCode === this.KEYS.ENTER && this.manual === true) {
        target.blur()
        this.addTag(newTagValue)
        if (this.timer) clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          target.focus()
        }, 10)
      } else if (keyCode === this.KEYS.BACK) {
        if (event.target.value === '' && !this.isPressed) {
          this.isPressed = true
          this.removeTag()
        }
      }
    }
  }

  createBasicTag (value, key, header) {
    key = key || value
    header = header || value

    let tag = _create('div', {
      'className': 'tagrhead-tag',
      'innerHTML': '<span class="tagrhead-tag__value" data-key="' + key +
                      '" data-value="' + value +
                      '" data-header="' + header + '" >' +
                     '<span>' + header + '-' + value + '</span>' +
                     '<button class="tagrhead-tag__remove">&times;</button>' +
                   '</span>'
    })

    return tag
  }

  createMdlTag (value, key, header) {
    key = key || value
    header = header || value

    let tag = _create('div', {
      'className': 'tagrhead-tag',
      'innerHTML': '<span class="tagrhead-tag__value mdl-chip mdl-chip--deletable"' +
                      'data-key="' + key +
                      '" data-value="' + value +
                      '" data-header="' + header + '" >' +
                     '<span class="mdl-chip__text">' + header + '-' + value + '</span>' +
                     '<button class="tagrhead-tag__remove mdl-chip__action">' +
                      '<i class="tagrhead-tag__remove material-icons">cancel</i>' +
                     '</button>' +
                   '</span>'
    })

    return tag
  }

  createBootstrapMdTag (value, key, header) {
    // <a href="javascript:void(0)" class="btn btn-primary">Primary<span class="badge">42</span></a>

    key = key || value
    header = header || value

    let tag = _create('div', {
      'className': 'tagrhead-tag',
      'innerHTML': '<a class="tagrhead-tag__value btn btn-info" href="javascript:void(0)"' +
                      'data-key="' + key +
                      '" data-value="' + value +
                      '" data-header="' + header + '" >' +
                     header + '-' + value +
                     '<span class="tagrhead-tag__remove badge">' +
                      'x' +
                     '</span>' +
                   '</a>'
    })

    return tag
  }

  removeTag () {
    if (this.tagsArr.length === 0) return

    let tags = _$$('.tagrhead-tag', this.tagsContainer)
    let tag = tags[tags.length - 1]

    if (!_hasClass('tagrhead-tag__marked', tag)) {
      _addClass('tagrhead-tag__marked', tag)
      return
    }

    this.tagsArr.pop()
    this.tagsContainer.removeChild(tag)
  }

  addTag (value, key, header) {
    key = key || value
    header = header || value

    // delete comma if comma exists
    value = value.toString().replace(/,/g, '').trim()
    if (value === '') {
      this.textbox.value = ''
      return this.textbox.value
    }

    if (~this.tagsArr.map((item) => (item.value)).indexOf(value)) {
      let exist = _$$('tagrhead-tag__exists', this.tagsContainer)

      Array.prototype.forEach.call(exist, (tag) => {
        if (this.transitionEnd) {
          _oneListener(tag, this.transitionEnd, () => {
            _removeClass('tagrhead-tag__exists', tag)
          })
        } else {
          _removeClass('tagrhead-tag__exists', tag)
        }
      })
      this.textbox.value = ''
      return this.textbox.value
    }
    let tag = this.createTag(value, key, header)

    if (this.wrap) {
      this.tagsContainer.insertBefore(tag, this.tagsContainer.childNodes[0])
    } else {
      this.tagsContainer.insertBefore(tag, _$(this.containerId)[0])
    }

    this.tagsArr.push({
      header,
      key,
      value
    })
    this.textbox.value = ''

    return undefined
  }

  whichTransitionEnd () {
    let root = document.documentElement
    let transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'mozTransitionEnd',
      'OTransition': 'oTransitionEnd otransitionend'
    }

    for (let t in transitions) {
      if (root.style[t] !== undefined) {
        return transitions[t]
      }
    }
    return false
  }

  // Public APIs
  getTags () { return this.tagsArr }

  clearTags () {
    if (!this) return
    this.tagsArr = []
    this.tagsContainer.innerHTML = ''
    this.container.innerHTML = ''
    this.container.appendChild(this.textbox)
  }

  addTags (data) {
    if (!this) return
    if (Array.isArray(data)) {
      data.forEach((item) => { this.addTag(item.value, item.key, item.header) })
    } else {
      this.addTag(data.value, data.key, data.header)
    }
  }

  destroy () {
    if (!this) return
    this.container.removeEventListener('click', this.removeBtnHandler, false)
    this.container.removeEventListener('keydown', this.keyHandler, false)
    this.container.removeEventListener('keyup', this.keyHandler, false)

    this.container.parentNode.removeChild(this.container)
    this.tagsArr = null
    this.timer = null
    this.container = null
    this.textbox = null
    this.transitionEnd = null
  }
}
