import AutoSuggestControl from './AutoSuggestControl'
import SuggestionProvider from './SuggestionProvider'
import Tags from './Tags'

export default class Tagrhead {
  constructor (inputId, containerId, dataSources, config) {
    this.textbox = new AutoSuggestControl(
      document.getElementById(inputId),
      document.getElementById(containerId),
      new SuggestionProvider(dataSources),
      new Tags('#' + containerId, '#' + inputId, config),
      config)
  }

  getTags () {
    return this.textbox.getTags()
  }
}
