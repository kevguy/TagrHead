function _$(selector, context) {
  return (typeof selector === 'string') ? (context || document).querySelector(selector) : selector;
}

function _$$(selectors, context) {
  return (typeof selectors === 'string') ? (context || document).querySelectorAll(selectors) : [selectors];
}

function _hasClass(className, element) {
  return new RegExp('(^|\\s+)' + className + '(\\s+|$)').test(element.className);
}

function _addClass(className, element) {
  if (!_hasClass(className, element)) {
    return element.className += (element.className === '') ? className : ' ' + className;
  }
}

function _removeClass(className, element) {
  element.className = element.className.replace(new RegExp('(^|\\s+)' + className + '(\\s+|$)'), '');
}
/*
function _toggleClass(className, element) {
  ( ! _hasClass(className, element)) ? _addClass(className, element) : _removeClass(className, element);
}
*/

function _oneListener(element, type, fn, capture) {
  capture = capture || false;
  element.addEventListener(type, function handler(e) {
    fn.call(this, e);
    element.removeEventListener(e.type, handler, capture);
  }, capture);
}

function _create(tag, attr) {
  let element = document.createElement(tag);

  if (attr) {
    for (let name in attr) {
      if (element[name] !== undefined) {
        element[name] = attr[name];
      }
    }
  }
  return element;
}

class Tags {
  constructor(containerDivId, inputId) {
    this.containerId = containerDivId;
    this.el = _create('input', {
      'id': 'tag-search-box',
      'type': 'text',
      'className': 'tag-input typeahead',
      'placeholder': '',
      'value': ''
    });

    // if (this.el.instance) return;
    this.el.instance = this;

    this.type = this.el.type;

    this.tagsArray = [];

    this.KEYS = {
      ENTER: 13,
      COMMA: 188,
      BACK: 8
    };

    this.transitionEnd = this.whichTransitionEnd();

    this.isPressed = false;

    this.timer = undefined;

    // create a div element with the chosen className
    this.wrap = _$(containerDivId);
    _addClass('tags-container', this.wrap);
    this.wrap.appendChild(this.el);
    // create the input field
    this.field = _$(inputId);
    this.wrap.appendChild(this.el);

    if (this.el.value.trim() !== '') {
      this.hasTags();
    }

    this.el.type = 'hidden';
    // this.el.parentNode.insertBefore(this.wrap, this.el.nextSibling);

    this.removeBtnHandler = (e) => {
      e.preventDefault();
      if (e.target.className === 'tag__remove') {
        let tag = e.target.parentNode;
        let name = _$('.tag__name', tag);

        this.wrap.removeChild(tag);
        this.tagsArray.splice(this.tagsArray.indexOf(name.textContent), 1);
        this.el.value = this.tagsArray.join(',');
      }
      this.field.focus();
    };

    this.keyHandler = (e) => {
      // console.log('keyHandler');
      // console.log(this.wrap);
      // console.log(this.field);
      // console.log(this.field.previousSibling);
      // console.log(e.target);
      if (e.target.tagName === 'INPUT') {
        let target = e.target;
        let code = e.which || e.keyCode;
        // console.log('code');
        // console.log(code);

        if (this.field.previousSibling && code !== this.KEYS.BACK) {
          // console.log(this.field.previousSibling);
          _removeClass('tag--marked', this.field.previousSibling);
        }

        let name = target.value.trim();

        if (code === this.KEYS.ENTER) {
          // console.log('enter');
          target.blur();
          // this.addTag(name);
          if (this.timer) clearTimeout(this.timer);
          this.timer = setTimeout(function () { target.focus(); }, 10);
        } else if (code === this.KEYS.BACK) {
          if (e.target.value === '' && !this.isPressed) {
            this.isPressed = true;
            this.removeTag();
          }
        }
      }
    };

    this.backHandler = (e) => {
      this.isPressed = false;
    };

    this.wrap.addEventListener('click', this.removeBtnHandler, false);
    this.wrap.addEventListener('keydown', this.keyHandler, false);
    this.wrap.addEventListener('keyup', this.backHandler, false);
  }

  hasTags() {
    let arr = this.el.value.trim().split(',');

    arr.forEach((item) => {
      item = item.trim();
      if (~this.tagsArray.indexOf(item)) { // equivalent to this.tagsArray.indexOf(item) >= 0
        return;
      }
      let tag = this.createTag(item);

      this.tagsArray.push(item);
      this.wrap.insertBefore(tag, this.field);
    });
  }

  createTag(name) {
    let tag = _create('div', {
      'className': 'tag',
      'innerHTML': '<span class="tag__name">' + name + '</span>' +
      '<button class="tag__remove">&times;</button>'
    });

    return tag;
  }

  removeTag() {
    if (this.tagsArray.length === 0) return;

    let tags = _$$('.tag', this.wrap);
    let tag = tags[tags.length - 1];

    if (!_hasClass('tag--marked', tag)) {
      _addClass('tag--marked', tag);
      return;
    }

    this.tagsArray.pop();
    this.wrap.removeChild(tag);

    this.el.value = this.tagsArray.join(',');
  }

  addTag(name) {
    // delete comma if comma exists
    // console.log('addTag');
    name = name.toString().replace(/,/g, '').trim();

    if (name === '') return this.field.value = '';

    if (~this.tagsArray.indexOf(name)) {
      // console.log('running $$');
      let exist = _$$('.tag', this.wrap);

      Array.prototype.forEach.call(exist, (tag) => {
        if (tag.firstChild.textContent === name) {
          _addClass('tag--exists', tag);
          if (this.transitionEnd) {
            _oneListener(tag, this.transitionEnd, () => {
              _removeClass('tag--exists', tag);
            });
          } else {
            _removeClass('tag--exists', tag);
          }
        }
      });
      // return this.field.value = '';
      this.field.value = '';
      return this.field.value;
    }
    let tag = this.createTag(name);

    this.wrap.insertBefore(tag, _$(this.containerId + ' .twitter-typeahead')[0]);
    this.tagsArray.push(name);
    this.field.value = '';
    this.el.value += (this.el.value === '') ? name : ',' + name;
  }

  whichTransitionEnd() {
    let root = document.documentElement;
    let transitions = {
      'transition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'mozTransitionEnd',
      'OTransition': 'oTransitionEnd otransitionend'
    };

    for (let t in transitions) {
      if (root.style[t] !== undefined) {
        return transitions[t];
      }
    }

    return false;
  }

  // PUBLIC APIs
  getTags() {
    return this.tagsArray;
  }

  clearTags() {
    if (!this.el.instance) return;
    this.tagsArray.length = 0;
    this.el.value = '';
    this.wrap.innerHTML = '';
    this.wrap.appendChild(this.field);
  }

  addTags(name) {
    if (!this.el.instance) return;
    if (Array.isArray(name)) {
      name.map((item) => {
        this.addTag(item);
      });
      // for (let i = 0, len = name.length; i < len; i++){
      //   this.addTag(name[i]);
      // }
    } else {
      this.addTag(name);
    }
  }

  getTagsArray() {
    return this.tagsArray;
  }

  destroy() {
    if (!this.el.instance) return;

    this.wrap.removeEventListener('click', this.removeBtnHandler, false);
    this.wrap.removeEventListener('keydown', this.keyHandler, false);
    this.wrap.removeEventListener('leyup', this.keyHandler, false);

    this.wrap.parentNode.removeChild(this.wrap);
    this.tagsArray = null;
    this.timer = null;
    this.wrap = null;
    this.field = null;
    this.transitionEnd = null;

    delete this.el.instance;
    // this.el.type = type;

  }
}

module.exports = Tags;
