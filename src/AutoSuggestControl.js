export default class AutoSuggestControl {
  constructor (textbox, container, provider, tagsCtrl, config = {}) {
    this.cur = -1
    this.criteriaCur = -1
    this.prefix = ''
    this.layer = null
    this.criteriaLayer = null
    this.provider = provider
    this.tagsCtrl = tagsCtrl
    this.textbox = textbox
    this.tag = null
    this.mode = 'criteria'
    this.style = config.style
    this.wrap = true
    this.container = container
    this.init()
  }

  getTags () {
    return this.tagsCtrl.getTags()
  }

  /**
   * Autosuggests one or more suggestions for what the user has typed.
   * If no suggestions are passed in, then no autosuggest occurs.
   * @param {Array} suggestions  An array of suggestion strings.
   * @param {Boolean} typeAhead If the control should provide a type ahead suggestion.
   */
  autosuggest (suggestions, typeAhead) {
    if (suggestions.length > 0) {
      let results = []

      suggestions.forEach(suggestion => {
        suggestion.results.forEach((item) => {
          results.push(item)
        })
      })
      results = results
        .filter((suggestion) => suggestion.itemValue.indexOf(this.textbox.value) === 0)
      if (results.length > 0 && typeAhead) {
        this.typeAhead(results[0].itemValue)
      }

      // if (typeAhead) {
      //   this.typeAhead(suggestions[0].results[0])
      // }
      this.mode = 'suggestions'
      this.showDropDownLayer(suggestions)
    } else {
      this.hideDropDownLayer()
    }
  }

  /**
   * Selects a range of text in the textbox.
   * @param {Number} startPos The start index (base 0) of the selection.
   * @param {Number} selectLength The number of characters to select.
   */
  selectRange (startPos, selectLength) {
    // use text ranges for Internet Explorer
    if (this.textbox.createTextRange) {
      let range = this.textbox.createTextRange()

      range.moveStart('character', startPos)
      range.moveEnd('character', selectLength - this.textbox.value.length)
      range.select()

    // use setSelectionRange() for Mozilla
    } else if (this.textbox.setSelectionRange) {
      this.textbox.setSelectionRange(startPos, selectLength)
    }

    // set focus back to the textbox
    this.textbox.focus()
  }

  /**
   * Inserts a suggestion into the textbox, highlighting the
   * suggested part of the text.
   * @param {String} suggestion The suggestion for the textbox.
   */
  typeAhead (suggestion) {
    // check for support of typeahead functionality
    if (this.textbox.createTextRange || this.textbox.setSelectionRange) {
      let len = this.textbox.value.length

      this.textbox.value = suggestion
      this.selectRange(len, suggestion.length)
    }
  }

  /**
   * Gets the left coordinate of the textbox.
   * @return {Number} The left coordinate of the textbox in pixels.
   */
  getLeft () {
    let node

    console.log('wrap value')
    console.log(this.wrap)
    if (this.wrap === true) {
      console.log('wrap')
      node = this.container
      console.log(this.container)
      console.log(this.container.offsetLeft)
    } else {
      node = this.textbox
    }

    let left = 0

    while (node.tagName !== 'BODY') {
      left += node.offsetLeft
      node = node.offsetParent
    }

    return left
  }

  /**
   * Gets the top coordinate of the textbox.
   * @return {Number} The top coordinate of the textbox in pixels.
   */
  getTop () {
    let node = this.textbox
    let top = 0

    while (node.tagName !== 'BODY') {
      top += node.offsetTop
      node = node.offsetParent
    }

    return top
  }

  createCriteriaLayer () {
    this.criteriaLayer = document.createElement('div')
    this.criteriaLayer.className = 'tagrhead-criterias'
    this.criteriaLayer.style.visibility = 'hidden'
    // this.criteriaLayer.style.width = this.textbox.offsetWidth
    this.criteriaLayer.style.width = this.textbox.getBoundingClientRect().width

    this.criteriaLayer.onmousedown =
    this.criteriaLayer.onmouseup =
    this.criteriaLayer.onmouseover = (event) => {
      event = event || window.event
      let target = event.target || event.srcElement

      if (event.type === 'mousedown') {
        this.textbox.value = target.firstChild.nodeValue + ':'
        this.hideCriteriaLayer()
        console.log(this.textbox.value)
        this.textbox.focus()
        this.prefix = this.textbox.value.substring(0, this.textbox.value.indexOf(':'))
        this.provider.requestSuggestions(this, false)
        this.textbox.click()
      } else if (event.type === 'mouseover' && !target.classList.contains('tagrhead-criteria-header')) {
        this.highlightCriteria(target)
      } else {

      }
    }
    // document.body.appendChild(this.criteriaLayer)
    this.textbox.parentNode.insertBefore(this.criteriaLayer, this.textbox.nextSibling)
  }

  hideCriteriaLayer () {
    this.criteriaLayer.style.visibility = 'hidden'
  }

  showCriteriaLayer () {
    console.log('showCriteria')
    let suggestions = this.provider.requestHeaders()

    console.log(suggestions)
    this.criteriaLayer.innerHTML = '' // clear contents of the layer
    let div = null

    div = document.createElement('div')
    div.classList.add('tagrhead-criteria-header')
    div.appendChild(document.createTextNode('Category'))
    this.criteriaLayer.appendChild(div)

    suggestions.forEach((datasetName) => {
      div = null
      div = document.createElement('div')
      div.classList.add('tagrhead-criteria-item')
      div.setAttribute('data-criteria', datasetName)
      div.appendChild(document.createTextNode(datasetName))
      this.criteriaLayer.appendChild(div)
    })
    if (this.style === 'mdl') {
      this.criteriaLayer.style.left = '0px'
    } else if (this.style === 'bootstrap-material-design') {
      // this.criteriaLayer.style.left = this.textbox.offsetLeft + 'px'
      this.criteriaLayer.style.left = '0'
    } else {
      this.criteriaLayer.style.left = this.getLeft() + 'px'
    }

    this.criteriaLayer.style.top = (this.getTop() + this.textbox.offsetHeight) + 'px'

    if (this.style === 'bootstrap-material-design') {
      this.criteriaLayer.style.top = this.textbox.offsetHeight + 14 + 'px'
    }

    this.criteriaLayer.style.visibility = 'visible'
  }

  /**
   * Creates the dropdown layer to display multiple suggestions.
   */
  createDropDownLayer () {
    let self = this

    // create the layer and assign styles
    this.layer = document.createElement('div')
    this.layer.className = 'tagrhead-suggestions'
    this.layer.style.visibility = 'hidden'
    // this.layer.style.width = this.textbox.offsetWidth
    this.layer.style.width = this.textbox.getBoundingClientRect().width

    // when the user clicks on a suggestion, get the text (innerHTML)
    // and place it into the textbox
    this.layer.onmousedown =
    this.layer.onmouseup =
    this.layer.onmouseover = (event) => {
      event = event || window.event
      let target = event.target || event.srcElement

      if (event.type === 'mousedown') {
        self.textbox.value = target.firstChild.nodeValue
        this.tagsCtrl.addTags(this.tag)
        self.hideDropDownLayer()
      } else if (event.type === 'mouseover' && !target.classList.contains('tagrhead-header')) {
        self.highlightSuggestion(target)
      } else {
        self.textbox.focus()
      }
    }
    // document.body.appendChild(this.layer)
    this.textbox.parentNode.insertBefore(this.layer, this.textbox.nextSibling)
  }

  /**
   * Hides the suggestion dropdown.
   */
  hideDropDownLayer () {
    this.layer.style.visibility = 'hidden'
  }

  /**
   * Builds the suggestion layer contents, moves it into position,
   * and displays the layer.
   * @param {Array} suggestions An array of suggestions for the control.
   */
  showDropDownLayer (suggestions) {
    this.layer.innerHTML = '' // clear contents of the layer
    suggestions.forEach((dataset) => {
      let div = null

      div = document.createElement('div')
      div.classList.add('tagrhead-header')
      div.appendChild(document.createTextNode(dataset.name))
      this.layer.appendChild(div)

      div = null
      for (let i = 0; i < dataset.results.length; i++) {
        div = document.createElement('div')
        div.classList.add('tagrhead-item')
        div.setAttribute('data-key', dataset.results[i].itemKey)
        div.setAttribute('data-value', dataset.results[i].itemValue)
        div.setAttribute('data-header', dataset.name)
        div.appendChild(document.createTextNode(dataset.results[i].itemValue))
        this.layer.appendChild(div)
      }
    })

    if (this.style === 'mdl') {
      this.layer.style.left = '0px'
    } else if (this.style === 'bootstrap-material-design') {
      // this.layer.style.left = this.textbox.offsetLeft + 'px'
      this.layer.style.left = '0'
    } else {
      this.layer.style.left = this.getLeft() + 'px'
    }
    this.layer.style.top = (this.getTop() + this.textbox.offsetHeight) + 'px'

    if (this.style === 'bootstrap-material-design') {
      // this.layer.style.top = this.textbox.offsetHeight + 14 + 'px'
      this.layer.style.top = '100%'
    }

    this.layer.style.visibility = 'visible'
  }

  /**
   * Handles keyup events
   * The keyup event fires after changes have been made to
   * the textbox, which is exactly when autosuggest should begin working.
   * @param {Object} event The event object for the keyup event
   */
  keyUpHandler (event) {
    let self = this
    let keyCode = event.keyCode

    if (this.textbox.value.indexOf(':') > 0) {
      this.prefix = this.textbox.value.substring(0, this.textbox.value.indexOf(':'))
    } else {
      this.prefix = ''
    }

    if (this.mode === 'suggestions') {
      // for backspace (8) and delete (46), shows suggestions without typeahead
      if (keyCode === 8 || keyCode === 46) {
        this.provider.requestSuggestions(self, false)

      // make sure not to interfere with non-character keys
      } else if (keyCode < 32 || (keyCode >= 33 && keyCode < 46) || (keyCode >= 112 && keyCode <= 123)) {
        // ignore
      } else {
        this.provider.requestSuggestions(self, true)
      }
    }
  }

  /**
   * Handles three keydown events.
   * The keydown event fires whenever the user presses a key
   * on the keyboard but before any changes occur to the textbox.
   * @param {Object} event The event object for the keydown event.
   */
  keyDownHandler (event) {
    if (this.mode === 'suggestions') {
      switch (event.keyCode) {
        case 38: // up arrow
          this.highlightPreviousSuggestion()
          break
        case 40: // down arrow
          this.highlightNextSuggestion()
          break
        case 13: // enter
          console.log(this.tag)
          this.tagsCtrl.addTags(this.tag)
          this.hideDropDownLayer()
          break
      }
    } else {
      switch (event.keyCode) {
        case 38: // up arrow
          this.highlightPreviousCriteria()
          break
        case 40: // down arrow
          console.log('going down')
          this.highlightNextCriteria()
          break
        case 13: // enter
          let criteriaNodes = this.criteriaLayer.childNodes

          for (let i = 0; i < criteriaNodes.length; i++) {
            let node = criteriaNodes[i]

            if (node.classList.contains('tagrhead-criteria-current')) {
              this.textbox.value = node.getAttribute('data-criteria') + ':'
              console.log('hihi')
            }
          }

          this.hideCriteriaLayer()
          break
      }
    }
  }

  /**
   * Highlights the next suggestion in the dropdown and
   * places the suggestion into the textbox.
   */
  highlightNextSuggestion () {
    let suggestionNodes = this.layer.childNodes

    if (suggestionNodes.length > 0 && this.cur < suggestionNodes.length - 1) {
      let node = suggestionNodes[++this.cur]

      if (node.classList.contains('tagrhead-header')) {
        node = suggestionNodes[++this.cur]
      }
      this.highlightSuggestion(node)
      this.textbox.value = node.firstChild.nodeValue
    }
  }

  highlightNextCriteria () {
    let criteriaNodes = this.criteriaLayer.childNodes

    if (criteriaNodes.length > 0 && this.criteriaCur < criteriaNodes.length - 1) {
      let node = criteriaNodes[ ++this.criteriaCur]

      if (node.classList.contains('tagrhead-criteria-header')) {
        node = criteriaNodes[++this.criteriaCur]
      }
      this.highlightCriteria(node)
      // this.textbox.value = node.firstChild.nodeValue + ':'
    }
  }

  highlightCriteria (criteriaNode) {
    for (let i = 0; i < this.criteriaLayer.childNodes.length; i++) {
      let node = this.criteriaLayer.childNodes[i]

      if (node === criteriaNode) {
        node.classList.add('tagrhead-criteria-current')
      } else if (node.classList.contains('tagrhead-criteria-current')) {
        node.classList.remove('tagrhead-criteria-current')
      }
    }
  }

  highlightPreviousCriteria () {
    let criteriaNodes = this.criteriaLayer.childNodes

    if (criteriaNodes.length > 0 && this.criteriaCur > 0) {
      let node = criteriaNodes[ --this.criteriaCur]

      if (node.classList.contains('tagrhead-criteria-header')) {
        node = criteriaNodes[--this.criteriaCur]
      }
      this.highlightCriteria(node)
      // this.textbox.value = node.firstChild.nodeValue + ':'
    }
  }

  /**
   * Highlights the previous suggestion in the dropdown and
   * places the suggestion into the textbox.
   */
  highlightPreviousSuggestion () {
    let suggestionNodes = this.layer.childNodes

    if (suggestionNodes.length > 0 && this.cur > 1) {
      let node = suggestionNodes[ --this.cur]

      if (node.classList.contains('tagrhead-header')) {
        node = suggestionNodes[ --this.cur]
      }
      this.highlightSuggestion(node)
      this.textbox.value = node.firstChild.nodeValue
    }
  }

  /**
   * Highlights the given node in the suggestions dropdown.
   * @param {Node} suggestionNode The node representing a suggestion in the dropdown.
   */
  highlightSuggestion (suggestionNode) {
    for (let i = 0; i < this.layer.childNodes.length; i++) {
      let node = this.layer.childNodes[i]

      if (node === suggestionNode) {
        node.classList.add('tagrhead-current')
        // node.className = "tagrhead-current"
        this.tag = {
          key: node.getAttribute('data-key'),
          value: node.getAttribute('data-value'),
          header: node.getAttribute('data-header')
        }
        console.log(this.tag)
      } else if (node.classList.contains('tagrhead-current')) {
        node.classList.remove('tagrhead-current')
        // node.className = ""
      }
    }
  }

  init () {
    // save a reference to this object
    let self = this

    // assign the onkeyup event handler
    this.textbox.onkeyup = (event) => {
      // check for the proper location of the event object
      if (this.textbox.value === '') {
        this.mode = 'criteria'
        this.hideDropDownLayer()
      } else {
        this.mode = 'suggestions'
        this.hideCriteriaLayer()
        if (!event) {
          event = window.event
        }
        self.keyUpHandler(event)
      }
    }

    // assign onkeydown event handler
    this.textbox.onkeydown = (event) => {
      // check for the proper location of the event object
      if (!event) {
        event = window.event
      }
      self.keyDownHandler(event)
    }

    this.textbox.onfocus = () => {
      console.log('textbox focus')
      if (this.textbox.value === '') {
        console.log('show criteria')
        this.mode = 'criteria'

        if (this.style === 'mdl') {
          console.log('falling')
          if (document.querySelector('.devsite-search-form')) {
            document.querySelector('.devsite-search-form').classList.add('devsite-search-active')
          }
        }

        this.showCriteriaLayer()
      } else {
        this.mode = 'suggestions'
        console.log('happen')
        this.hideCriteriaLayer()
        this.prefix = this.textbox.value.substring(0, this.textbox.value.indexOf(':'))
        this.provider.requestSuggestions(self, false)
      }
    }

    this.textbox.onchange = () => {
      console.log('boy')
      if (this.textbox.value.indexOf(':') > 0) {
        this.prefix = this.textbox.value.substring(0, this.textbox.value.indexOf(':'))
      } else {
        this.prefix = ''
      }
    }

    // assign onblur event handler (hides suggestions)
    this.textbox.onblur = () => {
      console.log('blur')

      if (this.textbox.value.indexOf(':') < 0) {
        self.hideDropDownLayer()
        self.hideCriteriaLayer()

        if (this.style === 'mdl') {
          if (document.querySelector('.devsite-search-form')) {
            if (this.getTags().length === 0 && this.textbox.value === '') {
              document.querySelector('.devsite-search-form').classList.remove('devsite-search-active')
            }
          }
        }
      }
    }

    // create the suggestions dropdown
    this.createDropDownLayer()
    this.createCriteriaLayer()
  }
}
