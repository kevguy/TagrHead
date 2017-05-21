import Bloodhound from '../node_modules/corejs-typeahead/dist/bloodhound.min.js'

export default class SuggestionProvider {
  constructor (dataSources) {
    this.bloodHoundsData = null
    this.init(dataSources)
  }

  _createBloodHoundConfig (dataSource) {
    return {
      local: dataSource.data,
      datumTokenizer (data) {
        return Bloodhound.tokenizers.whitespace(data[dataSource.srchKey])
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      identify: (obj) => obj[dataSource.srchKey],
      limit: 50
    }
  }

  _createBloodHound (dataSource) {
    let config = this._createBloodHoundConfig(dataSource)
    let engine = new Bloodhound(config)

    let srchResults

    let sync = (datums) => {
      // console.log('datums from `local`, `prefetch`, and `#add`')
      // console.log(datums)
      srchResults = datums
    }

    let async = (datums) => {
      // console.log('datums from `remote`');
      // console.log(datums)
    }

    return {
      itemHeader: dataSource.itemHeader,
      itemKey: dataSource.itemKey,
      itemValue: dataSource.itemValue,
      bloodHound: engine,
      search (query) {
        srchResults = undefined
        if (query === '') {
          // return random elements form dataSource
          console.log('here')
          return dataSource.data.slice(0, 4)
        }
        // srchresults are passed into the sync callback
        // engine.search returns the bloodhound object
        // I don't know why, ask someone else
        engine.search(query, sync, async)
        return srchResults
      }
    }
  }

  init (dataSources) {
    this.bloodHoundsData = dataSources.map((dataSource) => {
      return this._createBloodHound(dataSource)
    })

    let bloodhounds = this.bloodHoundsData.map((item) => {
      return item.bloodHound.initialize()
    })

    Promise.all(bloodhounds)
      .then(() => {console.log('bloodhounds ready to go')})
      .catch((err) => {console.error('error', err)})
  }

  requestHeaders () {
    console.log(this.bloodHoundsData)
    return this.bloodHoundsData.map((dataSource) => dataSource.itemHeader)
  }

  requestSuggestions (autoSuggestControl, typeAhead) {
    let suggestions = []

    console.log(autoSuggestControl)
    console.log(autoSuggestControl.textbox)
    let textboxValue = autoSuggestControl.textbox.value
    let prefix = autoSuggestControl.prefix

    if (prefix !== '') {
      textboxValue = textboxValue.substring(prefix.length + 1, textboxValue.length)
    }

    console.log('prefix')
    console.log(prefix)
    console.log('textboxValue')
    console.log(textboxValue)

    // if (textboxValue.length > 0) {
    if (prefix === '') {
      this.bloodHoundsData.forEach(dataset => {
        let results = dataset.search(textboxValue)

        results = results.map((item) => {
          return {
            itemKey: item[dataset.itemKey],
            itemValue: item[dataset.itemValue]
          }
        })

        if (results.length > 0) {
          suggestions.push({
            name: dataset.itemHeader,
            results
          })
        }
      })
    } else {
      this.bloodHoundsData.forEach(dataset => {
        if (dataset.itemHeader === prefix) {
          console.log('answer me')
          let results = dataset.search(textboxValue)

          results = results.map((item) => {
            return {
              itemKey: item[dataset.itemKey],
              itemValue: item[dataset.itemValue]
            }
          })

          if (results.length > 0) {
            suggestions.push({
              name: dataset.itemHeader,
              results
            })
          }
        }
      })
    }
    // }
    autoSuggestControl.autosuggest(suggestions, typeAhead)
  }
}
